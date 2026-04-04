import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';

/** Parsed Firebase service account JSON (Console download uses snake_case keys). */
type FirebaseServiceAccountFile = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

function getDb() {
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw || raw.trim() === '') {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
    }
    const keyFile = JSON.parse(raw) as FirebaseServiceAccountFile;
    initializeApp({
      credential: cert({
        projectId: keyFile.project_id,
        clientEmail: keyFile.client_email,
        privateKey: keyFile.private_key?.replace(/\\n/g, '\n'),
      }),
      projectId: keyFile.project_id || process.env.FIREBASE_PROJECT_ID || 'maqon-93fa2',
    });
  }
  return getFirestore();
}

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

const ALLOWED_STAGES = [
  'Pre-Seed',
  'Seed',
  'Series A+',
  'SME ($10k–$50k MRR)',
  'SME ($50k–$250k MRR)',
  'Enterprise',
  'Not sure',
];

// Simple in-memory rate limiter: 5 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const allowedOrigins = (() => {
  const fromEnv = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : [];
  return new Set([
    'http://localhost:5173',
    'http://localhost:8888',
    ...fromEnv,
  ]);
})();

const buildCorsHeaders = (origin?: string) => {
  if (origin && allowedOrigins.has(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      Vary: 'Origin',
    };
  }
  return {};
};

const applyCors = (res: VercelResponse, origin?: string) => {
  const h = buildCorsHeaders(origin);
  for (const [k, v] of Object.entries(h)) {
    res.setHeader(k, v);
  }
};

const getClientIp = (req: VercelRequest): string => {
  const h = req.headers;
  const xf = h['x-forwarded-for'];
  const firstForwarded =
    typeof xf === 'string'
      ? xf.split(',')[0].trim()
      : Array.isArray(xf)
        ? xf[0]?.split(',')[0].trim()
        : undefined;
  const nf = h['x-nf-client-connection-ip'];
  const nfIp = typeof nf === 'string' ? nf : Array.isArray(nf) ? nf[0] : undefined;
  const cip = h['client-ip'];
  const clientIp = typeof cip === 'string' ? cip : Array.isArray(cip) ? cip[0] : undefined;
  return nfIp || clientIp || firstForwarded || req.socket?.remoteAddress || 'unknown';
};

function parseBody(req: VercelRequest): Record<string, unknown> {
  const b = req.body;
  if (b == null) return {};
  if (typeof b === 'string') {
    try {
      return JSON.parse(b) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof b === 'object' && !Buffer.isBuffer(b)) {
    return b as Record<string, unknown>;
  }
  return {};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : undefined;

  console.log('[api/lead] hit', req.method, req.url ?? '', new Date().toISOString());

  if (req.method === 'OPTIONS') {
    applyCors(res, origin);
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    applyCors(res, origin);
    return res.status(405).json({ ok: false, errors: { global: 'Method not allowed' } });
  }

  try {
    const body = parseBody(req);
    const {
      full_name,
      work_email,
      phone_whatsapp,
      company_name,
      current_stage,
      primary_goal,
      deck_or_website,
      request_type,
      source_page,
      utm_params,
      _gotcha,
    } = body as Record<string, unknown>;

    applyCors(res, origin);

    // Honeypot: silently accept to mislead bots
    if (_gotcha) {
      return res.status(200).json({ ok: true });
    }

    // Rate limit
    const ip = getClientIp(req);
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.set(ip, { count: 1, windowStart: now });
    } else {
      if (entry.count >= RATE_LIMIT_MAX) {
        return res.status(429).json({
          ok: false,
          errors: { global: 'Too many requests. Please try again shortly.' },
        });
      }
      entry.count += 1;
      rateLimitMap.set(ip, entry);
    }

    // Validation
    const errors: Record<string, string> = {};

    if (!full_name || typeof full_name !== 'string' || full_name.length < 2 || full_name.length > 80) {
      errors.full_name = 'Name must be between 2 and 80 characters.';
    }

    if (!work_email || typeof work_email !== 'string' || !isValidEmail(work_email)) {
      errors.work_email = 'Please enter a valid work email.';
    }

    if (!company_name || typeof company_name !== 'string' || company_name.trim().length === 0) {
      errors.company_name = 'Company name is required.';
    }

    if (!current_stage || typeof current_stage !== 'string' || !ALLOWED_STAGES.includes(current_stage)) {
      errors.current_stage = 'Please select a valid stage.';
    }

    if (!primary_goal || typeof primary_goal !== 'string' || primary_goal.length < 15) {
      errors.primary_goal = 'Please provide more detail about your goal (min 15 chars).';
    }

    if (phone_whatsapp && typeof phone_whatsapp === 'string') {
      const cleanPhone = phone_whatsapp.replace(/[^\d+]/g, '');
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        errors.phone_whatsapp = 'Phone must be between 7-15 digits.';
      }
    }

    if (deck_or_website && typeof deck_or_website === 'string' && !isValidUrl(deck_or_website)) {
      errors.deck_or_website = 'Please provide a valid URL (https://...).';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    // TEMP: bypass Firestore + email — confirm routing/validation only
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, test: true });
  } catch (error) {
    console.error('Lead function error', error);
    applyCors(res, origin);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
