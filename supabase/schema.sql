-- Leads table and policies for MAQON lead intake
create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  work_email text not null,
  phone_whatsapp text null,
  company_name text not null,
  current_stage text not null,
  primary_goal text not null,
  deck_or_website text null,
  source_page text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_term text null,
  utm_content text null,
  ip text null,
  user_agent text null,
  status text not null default 'new',
  notes text null
);

-- Indexes for operational queries
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_work_email_idx on public.leads (work_email);
create index if not exists leads_company_name_idx on public.leads (company_name);
create index if not exists leads_status_idx on public.leads (status);

-- Security: enable RLS and deny public access
alter table public.leads enable row level security;

-- Explicitly block all access by default
drop policy if exists "deny all on leads" on public.leads;
create policy "deny all on leads"
  on public.leads
  using (false)
  with check (false);

-- Inserts are only allowed via service role (server-side key).
drop policy if exists "service role insert only" on public.leads;
create policy "service role insert only"
  on public.leads
  for insert
  to service_role
  with check (true);

