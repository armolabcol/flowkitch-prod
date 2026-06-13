-- Kitch SaaS — Phase 4/6 extensions
-- Requires 002_core_schema.sql applied first.

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  subscription_id uuid null references public.subscriptions (id) on delete set null,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'USD' check (currency in ('USD', 'COP')),
  status text not null check (
    status in ('paid', 'pending', 'failed', 'refunded')
  ),
  provider text null,
  provider_payment_id text null,
  paid_at timestamptz null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists payments_client_id_idx on public.payments (client_id);
create index if not exists payments_paid_at_idx on public.payments (paid_at desc nulls last);

alter table public.payments enable row level security;

create policy "Arm staff read all payments"
  on public.payments for select
  using (public.is_armo_staff());

create policy "Client users read own payments"
  on public.payments for select
  using (client_id = public.get_user_client_id());

create policy "Arm staff manage payments"
  on public.payments for all
  using (public.is_armo_staff())
  with check (public.is_armo_staff());

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid null references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

alter table public.audit_logs enable row level security;

create policy "Arm staff read audit logs"
  on public.audit_logs for select
  using (public.is_armo_staff());

create policy "Arm staff insert audit logs"
  on public.audit_logs for insert
  with check (public.is_armo_staff());

-- ---------------------------------------------------------------------------
-- demo_leads (marketing form)
-- ---------------------------------------------------------------------------
create table if not exists public.demo_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  restaurant text not null,
  country text not null,
  city text not null,
  email text not null,
  whatsapp text null,
  tables integer null check (tables is null or tables >= 1),
  uses_pos text not null,
  locale text not null default 'es' check (locale in ('es', 'en')),
  source text not null default 'demo_form',
  created_at timestamptz not null default now()
);

create index if not exists demo_leads_created_at_idx on public.demo_leads (created_at desc);
create index if not exists demo_leads_email_idx on public.demo_leads (email);

alter table public.demo_leads enable row level security;

create policy "Arm staff read demo leads"
  on public.demo_leads for select
  using (public.is_armo_staff());

-- Inserts via service role only (API route)
