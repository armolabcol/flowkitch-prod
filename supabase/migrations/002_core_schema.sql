-- Kitch SaaS — Phase 3 core schema
-- Requires 001_profiles.sql applied first.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_armo_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in (
        'armo_admin',
        'super_admin',
        'billing_admin',
        'support_agent',
        'sales_agent'
      )
  );
$$;

create or replace function public.get_user_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select client_id from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null check (country in ('CO', 'US')),
  email text not null,
  tax_id text null,
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Arm staff read all clients"
  on public.clients for select
  using (public.is_armo_staff());

create policy "Client users read own client"
  on public.clients for select
  using (id = public.get_user_client_id());

-- Link profiles → clients (nullable until client exists)
alter table public.profiles
  drop constraint if exists profiles_client_id_fkey;

alter table public.profiles
  add constraint profiles_client_id_fkey
  foreign key (client_id) references public.clients (id) on delete set null;

-- ---------------------------------------------------------------------------
-- restaurants
-- ---------------------------------------------------------------------------
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  country text not null check (country in ('CO', 'US')),
  city text not null,
  timezone text not null default 'America/Bogota',
  created_at timestamptz not null default now()
);

create index if not exists restaurants_client_id_idx on public.restaurants (client_id);

alter table public.restaurants enable row level security;

create policy "Arm staff read all restaurants"
  on public.restaurants for select
  using (public.is_armo_staff());

create policy "Client users read own restaurants"
  on public.restaurants for select
  using (client_id = public.get_user_client_id());

-- ---------------------------------------------------------------------------
-- plugin_installations
-- ---------------------------------------------------------------------------
create table if not exists public.plugin_installations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  site_url text not null,
  plugin_version text not null default '3.0.0',
  license_status text not null check (
    license_status in (
      'active',
      'past_due',
      'grace_period',
      'suspended',
      'cancelled',
      'maintenance_required',
      'license_unknown'
    )
  ),
  license_expires_at timestamptz not null,
  grace_until timestamptz null,
  last_sync_at timestamptz null,
  last_license_check_at timestamptz null,
  orders_month integer not null default 0 check (orders_month >= 0),
  revenue_month bigint not null default 0 check (revenue_month >= 0),
  average_ticket integer not null default 0 check (average_ticket >= 0),
  created_at timestamptz not null default now()
);

create index if not exists plugin_installations_restaurant_id_idx
  on public.plugin_installations (restaurant_id);

create index if not exists plugin_installations_license_status_idx
  on public.plugin_installations (license_status);

alter table public.plugin_installations enable row level security;

create policy "Arm staff read all installations"
  on public.plugin_installations for select
  using (public.is_armo_staff());

create policy "Client users read own installations"
  on public.plugin_installations for select
  using (
    restaurant_id in (
      select r.id from public.restaurants r
      where r.client_id = public.get_user_client_id()
    )
  );

-- ---------------------------------------------------------------------------
-- api_keys (hash only — never store plaintext)
-- ---------------------------------------------------------------------------
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references public.plugin_installations (id) on delete cascade,
  key_hash text not null unique,
  last4 text not null check (char_length(last4) = 4),
  status text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  revoked_at timestamptz null
);

create index if not exists api_keys_installation_id_idx on public.api_keys (installation_id);
create index if not exists api_keys_key_hash_idx on public.api_keys (key_hash);

alter table public.api_keys enable row level security;

create policy "Arm staff read api key metadata"
  on public.api_keys for select
  using (public.is_armo_staff());

create policy "Client users read own api key metadata"
  on public.api_keys for select
  using (
    installation_id in (
      select pi.id
      from public.plugin_installations pi
      join public.restaurants r on r.id = pi.restaurant_id
      where r.client_id = public.get_user_client_id()
    )
  );

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  status text not null check (
    status in ('active', 'past_due', 'grace_period', 'cancelled', 'trialing')
  ),
  plan_name text not null default 'Kitch Pro',
  current_period_start timestamptz null,
  current_period_end timestamptz not null,
  grace_until timestamptz null,
  amount_cents integer not null default 0 check (amount_cents >= 0),
  currency text not null default 'USD' check (currency in ('USD', 'COP')),
  created_at timestamptz not null default now()
);

create index if not exists subscriptions_client_id_idx on public.subscriptions (client_id);

alter table public.subscriptions enable row level security;

create policy "Arm staff read all subscriptions"
  on public.subscriptions for select
  using (public.is_armo_staff());

create policy "Client users read own subscriptions"
  on public.subscriptions for select
  using (client_id = public.get_user_client_id());

-- ---------------------------------------------------------------------------
-- telemetry_daily
-- ---------------------------------------------------------------------------
create table if not exists public.telemetry_daily (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references public.plugin_installations (id) on delete cascade,
  date date not null,
  orders_count integer not null default 0 check (orders_count >= 0),
  revenue_cents bigint not null default 0 check (revenue_cents >= 0),
  average_ticket_cents integer not null default 0 check (average_ticket_cents >= 0),
  plugin_version text not null,
  created_at timestamptz not null default now(),
  unique (installation_id, date)
);

create index if not exists telemetry_daily_installation_date_idx
  on public.telemetry_daily (installation_id, date desc);

alter table public.telemetry_daily enable row level security;

create policy "Arm staff read all telemetry"
  on public.telemetry_daily for select
  using (public.is_armo_staff());

create policy "Client users read own telemetry"
  on public.telemetry_daily for select
  using (
    installation_id in (
      select pi.id
      from public.plugin_installations pi
      join public.restaurants r on r.id = pi.restaurant_id
      where r.client_id = public.get_user_client_id()
    )
  );

-- ---------------------------------------------------------------------------
-- maintenance_logs
-- ---------------------------------------------------------------------------
create table if not exists public.maintenance_logs (
  id uuid primary key default gen_random_uuid(),
  installation_id uuid not null references public.plugin_installations (id) on delete cascade,
  title text not null,
  status text not null check (
    status in ('scheduled', 'in_progress', 'completed')
  ),
  scheduled_at timestamptz not null,
  completed_at timestamptz null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists maintenance_logs_installation_id_idx
  on public.maintenance_logs (installation_id);

alter table public.maintenance_logs enable row level security;

create policy "Arm staff read all maintenance logs"
  on public.maintenance_logs for select
  using (public.is_armo_staff());

create policy "Client users read own maintenance logs"
  on public.maintenance_logs for select
  using (
    installation_id in (
      select pi.id
      from public.plugin_installations pi
      join public.restaurants r on r.id = pi.restaurant_id
      where r.client_id = public.get_user_client_id()
    )
  );

-- Arm staff write access (insert/update) — Phase 3 read-focused; admin UI mock for writes
create policy "Arm staff manage clients"
  on public.clients for all
  using (public.is_armo_staff())
  with check (public.is_armo_staff());

create policy "Arm staff manage restaurants"
  on public.restaurants for all
  using (public.is_armo_staff())
  with check (public.is_armo_staff());

create policy "Arm staff manage installations"
  on public.plugin_installations for all
  using (public.is_armo_staff())
  with check (public.is_armo_staff());

create policy "Arm staff manage api keys"
  on public.api_keys for all
  using (public.is_armo_staff())
  with check (public.is_armo_staff());

create policy "Arm staff manage subscriptions"
  on public.subscriptions for all
  using (public.is_armo_staff())
  with check (public.is_armo_staff());

create policy "Arm staff manage telemetry"
  on public.telemetry_daily for all
  using (public.is_armo_staff())
  with check (public.is_armo_staff());

create policy "Arm staff manage maintenance logs"
  on public.maintenance_logs for all
  using (public.is_armo_staff())
  with check (public.is_armo_staff());
