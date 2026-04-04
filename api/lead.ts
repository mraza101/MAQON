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
  return res.status(200).json({ ok: true, test: 'function reached' });
}
