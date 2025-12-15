import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Clients
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_STAGES = [
  "Pre-Seed", 
  "Seed", 
  "Series A+", 
  "SME ($10k–$50k MRR)", 
  "SME ($50k–$250k MRR)", 
  "Enterprise", 
  "Not sure"
];

// Helper: Basic Email Regex
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Helper: URL Regex
const isValidUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, errors: { global: 'Method not allowed' } });
  }

  try {
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
      _gotcha // Honeypot
    } = req.body;

    // 2. Spam Protection: Honeypot
    if (_gotcha) {
      // Return fake success to fool bots
      return res.status(200).json({ ok: true });
    }

    // 3. Spam Protection: Rate Limiting (Simple IP check)
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { count, error: rateError } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gt('created_at', fiveMinutesAgo);

    if (count && count > 2) {
      return res.status(429).json({ ok: false, errors: { global: 'Too many requests. Please try again later.' } });
    }

    // 4. Validation
    const errors: Record<string, string> = {};

    if (!full_name || full_name.length < 2 || full_name.length > 80) {
      errors.full_name = "Name must be between 2 and 80 characters.";
    }

    if (!work_email || !isValidEmail(work_email)) {
      errors.work_email = "Please enter a valid work email.";
    }

    if (!company_name || company_name.trim().length === 0) {
      errors.company_name = "Company name is required.";
    }

    if (!current_stage || !ALLOWED_STAGES.includes(current_stage)) {
      errors.current_stage = "Please select a valid stage.";
    }

    if (!primary_goal || primary_goal.length < 15) {
      errors.primary_goal = "Please provide more detail about your goal (min 15 chars).";
    }

    if (phone_whatsapp) {
      // Strip non-digit/plus chars
      const cleanPhone = phone_whatsapp.replace(/[^\d+]/g, '');
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        errors.phone_whatsapp = "Phone must be between 7-15 digits.";
      }
    }

    if (deck_or_website && !isValidUrl(deck_or_website)) {
      errors.deck_or_website = "Please provide a valid URL (https://...).";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    // 5. Store in Supabase
    const { error: dbError } = await supabase
      .from('leads')
      .insert([
        {
          full_name,
          work_email,
          phone_whatsapp,
          company_name,
          current_stage,
          primary_goal,
          deck_or_website,
          request_type: request_type || 'Diagnostic',
          source_page,
          utm_params,
          ip_address: ip
        }
      ]);

    if (dbError) {
      console.error('Supabase Insert Error:', dbError);
      throw new Error('Database error');
    }

    // 6. Send Notifications (Parallel)
    const adminEmailPromise = resend.emails.send({
      from: 'MAQON System <system@maqon.com>',
      to: process.env.NOTIFY_EMAIL!,
      subject: `New Lead: ${company_name} (${full_name})`,
      html: `
        <h2>New Diagnostic Request</h2>
        <ul>
          <li><strong>Name:</strong> ${full_name}</li>
          <li><strong>Email:</strong> ${work_email}</li>
          <li><strong>Phone:</strong> ${phone_whatsapp || 'N/A'}</li>
          <li><strong>Company:</strong> ${company_name}</li>
          <li><strong>Stage:</strong> ${current_stage}</li>
          <li><strong>URL:</strong> ${deck_or_website || 'N/A'}</li>
        </ul>
        <h3>Primary Goal</h3>
        <p>${primary_goal}</p>
        <hr />
        <p><small>IP: ${ip} | Source: ${source_page || 'Unknown'}</small></p>
      `
    });

    const userEmailPromise = resend.emails.send({
      from: 'MAQON Team <hello@maqon.com>',
      to: work_email,
      subject: 'Request Received: MAQON Diagnostic',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #333;">
          <h2 style="color: #000;">We received your request.</h2>
          <p>Hi ${full_name.split(' ')[0]},</p>
          <p>Thanks for applying for a diagnostic session for <strong>${company_name}</strong>.</p>
          <p>Our partners review applications daily. If your stage and goals align with our sprint capacity, we will contact you via email or WhatsApp within 24 hours to schedule the audit.</p>
          <br>
          <p>Best,</p>
          <p><strong>The MAQON Team</strong></p>
        </div>
      `
    });

    await Promise.allSettled([adminEmailPromise, userEmailPromise]);

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('API Handler Error:', error);
    return res.status(500).json({ ok: false, errors: { global: 'Internal server error' } });
  }
}