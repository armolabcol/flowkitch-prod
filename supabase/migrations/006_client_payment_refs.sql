-- Kitch SaaS — Payment provider refs for webhook reconciliation
-- Requires 005_phase4_phase6.sql

alter table public.clients
  add column if not exists stripe_customer_id text null,
  add column if not exists wompi_customer_email text null;

create unique index if not exists clients_stripe_customer_id_uq
  on public.clients (stripe_customer_id)
  where stripe_customer_id is not null;

create index if not exists clients_wompi_email_idx
  on public.clients (lower(wompi_customer_email))
  where wompi_customer_email is not null;

-- Idempotency for webhook payment inserts
create unique index if not exists payments_provider_payment_id_uq
  on public.payments (provider, provider_payment_id)
  where provider is not null and provider_payment_id is not null;
