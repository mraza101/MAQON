# MAQON Lead Intake (React + Vite + Netlify Functions)

Production-grade diagnostic intake with Supabase (Postgres), Netlify Functions, and Resend email notifications.

## Stack
- Frontend: React + Vite
- Serverless: Netlify Functions (`netlify/functions/lead.ts`)
- Database: Supabase Postgres (RLS locked to service role)
- Email: Resend (SMTP fallback possible)

## Prerequisites
- Node.js 18+
- A Supabase project (service role key)
- A Resend API key (or SMTP creds if you swap the mailer)
- Netlify CLI for local function testing: `npm i -g netlify-cli`

## Setup
1) Install deps
```bash
npm install
```

2) Env vars (create `.env` locally and set the same in Netlify dashboard)
```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
NOTIFY_EMAIL=muhammad@maqoncapital.com
FROM_EMAIL="MAQON <noreply@maqoncapital.com>"
ALLOWED_ORIGINS=https://yourdomain.com
```

3) Supabase schema + RLS  
Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor:
- Creates `public.leads` with indexes on created_at, work_email, company_name, status
- Enables RLS; denies public; allows inserts only via `service_role`

4) Local dev (Netlify-style)
```bash
netlify dev
```
The contact form posts to `/.netlify/functions/lead` and will invoke the local function. Vite preview runs automatically inside `netlify dev`.

5) Deploy to Netlify (Git-based only, not Netlify Drop)
- `git init && git add . && git commit -m "init"`
- Push to GitHub
- In Netlify, “New site from Git” → connect repo
- Set the env vars above in Site Settings → Environment
- Deploy; Netlify builds with `npm run build`, publishes `dist`, and serves functions from `netlify/functions`

## Verification checklist
- Submit the contact form → row appears in Supabase `leads`
- Email received at `muhammad@maqoncapital.com`
- Honeypot `_gotcha` left empty → accepted; filled → silently ignored
- Rate limit: >5 submissions/min per IP returns 429

## SQL (for reference)
See `supabase/schema.sql` for full DDL, indexes, and RLS policies.

## Environment variables (Netlify dashboard + local)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NOTIFY_EMAIL` (default: muhammad@maqoncapital.com)
- `FROM_EMAIL` (default: MAQON <noreply@maqoncapital.com>)
- `ALLOWED_ORIGINS` (comma-separated; include prod domain)

## Notes
- CORS is locked to `ALLOWED_ORIGINS` plus localhost for dev.
- `/api/lead` is redirected to `/.netlify/functions/lead` via `netlify.toml`.
