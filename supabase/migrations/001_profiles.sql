-- Kitch SaaS — initial schema (Phase 2)
-- Run in Supabase SQL Editor or via CLI: supabase db push

-- ---------------------------------------------------------------------------
-- profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null check (
    role in (
      'armo_admin',
      'client_user',
      'super_admin',
      'billing_admin',
      'support_agent',
      'sales_agent',
      'client_owner',
      'client_billing'
    )
  ),
  client_id uuid null,
  full_name text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('armo_admin', 'super_admin', 'billing_admin', 'support_agent', 'sales_agent')
    )
  );

-- Auto-create profile row on signup (default client_user — promote manually)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'client_user'),
    coalesce(new.raw_user_meta_data->>'full_name', null)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Bootstrap first ARMO admin (run AFTER creating user in Supabase Auth UI):
--
--   update public.profiles
--   set role = 'armo_admin', full_name = 'ARMO Admin'
--   where email = 'tu-email@armolabcol.com';
--
-- For client users, also set client_id once clients table exists:
--   update public.profiles set client_id = '<uuid>' where email = '...';
-- ---------------------------------------------------------------------------
