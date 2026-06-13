-- Kitch SaaS — Billing providers and platform settings
-- Requires 006_client_payment_refs.sql

alter table public.clients
  add column if not exists payment_provider text null
    check (payment_provider in ('stripe', 'wompi', 'payu')),
  add column if not exists payu_buyer_email text null;

create index if not exists clients_payu_email_idx
  on public.clients (lower(payu_buyer_email))
  where payu_buyer_email is not null;

-- ---------------------------------------------------------------------------
-- platform_settings (key-value config)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.profiles (id) on delete set null
);

alter table public.platform_settings enable row level security;

create policy "Arm staff read platform settings"
  on public.platform_settings for select
  using (public.is_armo_staff());

-- Writes via service role in admin API (same pattern as clients-admin-service)

insert into public.platform_settings (key, value)
values
  ('billing.co_provider', '"wompi"'::jsonb),
  ('billing.default_plan_name', '"Kitch Pro"'::jsonb)
on conflict (key) do nothing;

-- Backfill payment_provider for existing clients
update public.clients
set payment_provider = 'stripe'
where country = 'US' and payment_provider is null;

update public.clients
set payment_provider = 'wompi'
where country = 'CO' and payment_provider is null;
