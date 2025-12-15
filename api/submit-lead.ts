import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Clients
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, company, stage, goal, link, _gotcha } = req.body;

    // 2. Spam Protection (Honeypot)
    // If the hidden '_gotcha' field is filled, it's a bot. Return success to fool them.
    if (_gotcha) {
      return res.status(200).json({ ok: true });
    }

    // 3. Server-Side Validation
    const errors: Record<string, string> = {};
    if (!name || name.length < 2) errors.name = "Name is too short.";
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Invalid email address.";
    if (phone && phone.length < 7) errors.phone = "Phone number appears invalid.";
    if (!goal) errors.goal = "Please describe your goal.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    // 4. Insert into Supabase
    const { error: dbError } = await supabase
      .from('leads')
      .insert([
        {
          name,
          email,
          phone,
          company,
          stage,
          goal,
          link,
          ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        }
      ]);

    if (dbError) {
      console.error('Supabase Error:', dbError);
      throw new Error('Database insertion failed');
    }

    // 5. Send Admin Notification Email
    await resend.emails.send({
      from: 'MAQON Systems <system@maqon.com>', // Ensure you have verified a domain in Resend
      to: process.env.NOTIFY_EMAIL!,
      subject: `New Lead: ${name} (${company})`,
      html: `
        <h1>New Diagnostic Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company} (${stage})</p>
        <p><strong>Goal:</strong><br/>${goal}</p>
        <p><strong>Link:</strong> ${link || 'N/A'}</p>
      `
    });

    // 6. Send User Confirmation Email
    await resend.emails.send({
      from: 'MAQON Team <hello@maqon.com>',
      to: email,
      subject: 'We received your diagnostic request',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0F172A;">Request Received.</h1>
          <p>Hi ${name.split(' ')[0]},</p>
          <p>We have received your diagnostic request for <strong>${company}</strong>.</p>
          <p>Our partners review every application personally. If your business stage aligns with our current sprint capacity, we will reach out via WhatsApp or Email within 24 hours to schedule the audit.</p>
          <p>In the meantime, you can reply to this email if you have any urgent files to add.</p>
          <br/>
          <p>Regards,</p>
          <p><strong>The MAQON Team</strong><br/>Dubai • Melbourne • Frankfurt</p>
        </div>
      `
    });

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ ok: false, error: 'Internal server error.' });
  }
}