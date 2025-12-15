import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Supabase client: must use service role key to satisfy RLS insert policy
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

const ALLOWED_STAGES = [
  'Pre-Seed',
  'Seed',
  'Series A+',
  'SME ($10k–$50k MRR)',
  'SME ($50k–$250k MRR)',
  'Enterprise',
  'Not sure'
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
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
    : [];
  return new Set([
    'http://localhost:5173',
    'http://localhost:8888', // netlify dev default
    ...fromEnv
  ]);
})();

const buildCorsHeaders = (origin?: string) => {
  if (origin && allowedOrigins.has(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Vary': 'Origin'
    };
  }
  return {};
};

const getClientIp = (headers: Record<string, string | undefined>) =>
  headers['x-nf-client-connection-ip'] ||
  headers['client-ip'] ||
  headers['x-forwarded-for']?.split(',')[0].trim() ||
  'unknown';

const handler: Handler = async (event) => {
  const origin = event.headers.origin;
  const corsHeaders = buildCorsHeaders(origin);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, errors: { global: 'Method not allowed' } })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
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
      _gotcha
    } = body;

    // Honeypot: silently accept to mislead bots
    if (_gotcha) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true })
      };
    }

    // Rate limit
    const ip = getClientIp(event.headers);
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.set(ip, { count: 1, windowStart: now });
    } else {
      if (entry.count >= RATE_LIMIT_MAX) {
        return {
          statusCode: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ok: false, errors: { global: 'Too many requests. Please try again shortly.' } })
        };
      }
      entry.count += 1;
      rateLimitMap.set(ip, entry);
    }

    // Validation
    const errors: Record<string, string> = {};

    if (!full_name || full_name.length < 2 || full_name.length > 80) {
      errors.full_name = 'Name must be between 2 and 80 characters.';
    }

    if (!work_email || !isValidEmail(work_email)) {
      errors.work_email = 'Please enter a valid work email.';
    }

    if (!company_name || company_name.trim().length === 0) {
      errors.company_name = 'Company name is required.';
    }

    if (!current_stage || !ALLOWED_STAGES.includes(current_stage)) {
      errors.current_stage = 'Please select a valid stage.';
    }

    if (!primary_goal || primary_goal.length < 15) {
      errors.primary_goal = 'Please provide more detail about your goal (min 15 chars).';
    }

    if (phone_whatsapp) {
      const cleanPhone = phone_whatsapp.replace(/[^\d+]/g, '');
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        errors.phone_whatsapp = 'Phone must be between 7-15 digits.';
      }
    }

    if (deck_or_website && !isValidUrl(deck_or_website)) {
      errors.deck_or_website = 'Please provide a valid URL (https://...).';
    }

    if (Object.keys(errors).length > 0) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, errors })
      };
    }

    const userAgent = event.headers['user-agent'] ?? 'unknown';
    const requestType = request_type || 'Diagnostic';
    const utm = typeof utm_params === 'object' && utm_params ? utm_params : {};

    // Safe env diagnostics (no secrets logged)
    console.log('[lead] Supabase envs present', {
      hasUrl: !!process.env.SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });

    const { error: dbError } = await supabase.from('leads').insert([
      {
        full_name,
        work_email,
        phone_whatsapp,
        company_name,
        current_stage,
        primary_goal,
        deck_or_website,
        request_type: requestType,
        source_page: source_page || null,
        utm_source: utm.utm_source || null,
        utm_medium: utm.utm_medium || null,
        utm_campaign: utm.utm_campaign || null,
        utm_term: utm.utm_term || null,
        utm_content: utm.utm_content || null,
        ip,
        user_agent: userAgent,
        status: 'new'
      }
    ]);

    if (dbError) {
      console.error('Supabase insert error', {
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        code: dbError.code
      });
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ok: false,
          error: 'Database error',
          details: dbError.message
        })
      };
    }

    const notifyTo = process.env.NOTIFY_EMAIL ?? 'muhammad@maqoncapital.com';
    const fromEmail = process.env.FROM_EMAIL ?? 'MAQON <noreply@maqoncapital.com>';
    const submittedAt = new Date().toISOString();

    const htmlBody = `
      <div style="font-family: 'Inter', system-ui, -apple-system; color: #0b0c10;">
        <h2 style="margin: 0 0 12px;">New MAQON Diagnostic Request — ${company_name}</h2>
        <p style="margin: 0 0 16px; color: #1f2933;">Submitted at ${submittedAt}</p>
        <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
          <tbody>
            <tr><td style="padding: 6px 0; font-weight: 600;">Name</td><td>${full_name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Work Email</td><td>${work_email}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Phone / WhatsApp</td><td>${phone_whatsapp || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Company</td><td>${company_name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Stage</td><td>${current_stage}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Primary Goal</td><td>${primary_goal}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Deck / Website</td><td>${deck_or_website || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Request Type</td><td>${requestType}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">Source Page</td><td>${source_page || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">IP</td><td>${ip}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">User Agent</td><td>${userAgent}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">UTM Source</td><td>${utm.utm_source || '—'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">UTM Medium</td><td>${utm.utm_medium || '—'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">UTM Campaign</td><td>${utm.utm_campaign || '—'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">UTM Term</td><td>${utm.utm_term || '—'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600;">UTM Content</td><td>${utm.utm_content || '—'}</td></tr>
          </tbody>
        </table>
      </div>
    `;

    const textBody = [
      `New MAQON Diagnostic Request — ${company_name}`,
      `Submitted: ${submittedAt}`,
      `Name: ${full_name}`,
      `Work Email: ${work_email}`,
      `Phone / WhatsApp: ${phone_whatsapp || 'N/A'}`,
      `Company: ${company_name}`,
      `Stage: ${current_stage}`,
      `Primary Goal: ${primary_goal}`,
      `Deck / Website: ${deck_or_website || 'N/A'}`,
      `Request Type: ${requestType}`,
      `Source Page: ${source_page || 'N/A'}`,
      `IP: ${ip}`,
      `User Agent: ${userAgent}`,
      `UTM Source: ${utm.utm_source || '—'}`,
      `UTM Medium: ${utm.utm_medium || '—'}`,
      `UTM Campaign: ${utm.utm_campaign || '—'}`,
      `UTM Term: ${utm.utm_term || '—'}`,
      `UTM Content: ${utm.utm_content || '—'}`
    ].join('\n');

    const { error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: [notifyTo],
      subject: `New MAQON Diagnostic Request — ${company_name}`,
      html: htmlBody,
      text: textBody
    });

    if (emailError) {
      console.error('Resend error', emailError);
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Email dispatch failed' })
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    console.error('Lead function error', error);
    return {
      statusCode: 500,
      headers: { ...buildCorsHeaders(event.headers.origin), 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Internal server error' })
    };
  }
};

export { handler };

