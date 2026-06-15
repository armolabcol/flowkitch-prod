-- Kitch SaaS — RBAC: regional_admin, sales portfolio, scoped RLS
-- Requires 008_billing_providers.sql

-- ---------------------------------------------------------------------------
-- profiles: regional scope
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists assigned_country text null
    check (assigned_country is null or assigned_country in ('CO', 'US'));

-- Migrate armo_admin → super_admin
update public.profiles set role = 'super_admin' where role = 'armo_admin';

-- Allow regional_admin role
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (
  role in (
    'super_admin',
    'regional_admin',
    'client_user',
    'billing_admin',
    'support_agent',
    'sales_agent',
    'client_owner',
    'client_billing'
  )
);

-- ---------------------------------------------------------------------------
-- clients: sales agent assignment
-- ---------------------------------------------------------------------------
alter table public.clients
  add column if not exists assigned_sales_agent_id uuid null
    references public.profiles (id) on delete set null;

create index if not exists clients_assigned_sales_agent_idx
  on public.clients (assigned_sales_agent_id)
  where assigned_sales_agent_id is not null;

-- ---------------------------------------------------------------------------
-- RBAC helpers (security definer — bypass RLS on profiles)
-- ---------------------------------------------------------------------------
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

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
        'super_admin',
        'regional_admin',
        'billing_admin',
        'support_agent',
        'sales_agent'
      )
  );
$$;

create or replace function public.get_staff_country()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select assigned_country
  from public.profiles
  where id = auth.uid() and role = 'regional_admin'
  limit 1;
$$;

create or replace function public.can_staff_read_client(p_client_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when public.is_super_admin() then true
    when exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('billing_admin', 'support_agent')
    ) then true
    when exists (
      select 1 from public.profiles p
      join public.clients c on c.id = p_client_id
      where p.id = auth.uid()
        and p.role = 'regional_admin'
        and p.assigned_country = c.country
    ) then true
    when exists (
      select 1 from public.clients c
      where c.id = p_client_id
        and c.assigned_sales_agent_id = auth.uid()
    ) then true
    else false
  end;
$$;

create or replace function public.can_staff_manage_client(p_client_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when public.is_super_admin() then true
    when exists (
      select 1 from public.profiles p
      join public.clients c on c.id = p_client_id
      where p.id = auth.uid()
        and p.role = 'regional_admin'
        and p.assigned_country = c.country
    ) then true
    else false
  end;
$$;

-- ---------------------------------------------------------------------------
-- clients RLS
-- ---------------------------------------------------------------------------
drop policy if exists "Arm staff read all clients" on public.clients;

create policy "Staff read scoped clients"
  on public.clients for select
  using (public.can_staff_read_client(id));

-- ---------------------------------------------------------------------------
-- restaurants RLS
-- ---------------------------------------------------------------------------
drop policy if exists "Arm staff read all restaurants" on public.restaurants;

create policy "Staff read scoped restaurants"
  on public.restaurants for select
  using (public.can_staff_read_client(client_id));

-- ---------------------------------------------------------------------------
-- plugin_installations RLS
-- ---------------------------------------------------------------------------
drop policy if exists "Arm staff read all installations" on public.plugin_installations;

create policy "Staff read scoped installations"
  on public.plugin_installations for select
  using (
    exists (
      select 1 from public.restaurants r
      where r.id = restaurant_id
        and public.can_staff_read_client(r.client_id)
    )
  );

-- ---------------------------------------------------------------------------
-- subscriptions RLS
-- ---------------------------------------------------------------------------
drop policy if exists "Arm staff read all subscriptions" on public.subscriptions;

create policy "Staff read scoped subscriptions"
  on public.subscriptions for select
  using (public.can_staff_read_client(client_id));

-- ---------------------------------------------------------------------------
-- payments RLS
-- ---------------------------------------------------------------------------
drop policy if exists "Arm staff read all payments" on public.payments;

create policy "Staff read scoped payments"
  on public.payments for select
  using (public.can_staff_read_client(client_id));

-- ---------------------------------------------------------------------------
-- profiles RLS — staff sees profiles in scope
-- ---------------------------------------------------------------------------
drop policy if exists "Admins can read all profiles" on public.profiles;

create policy "Staff read scoped profiles"
  on public.profiles for select
  using (
    auth.uid() = id
    or public.is_super_admin()
    or (
      public.is_armo_staff()
      and (
        role in ('super_admin', 'regional_admin', 'billing_admin', 'support_agent', 'sales_agent')
        or (
          client_id is not null
          and public.can_staff_read_client(client_id)
        )
      )
    )
  );
