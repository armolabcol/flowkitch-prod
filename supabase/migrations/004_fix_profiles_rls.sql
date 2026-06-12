-- Fix infinite recursion on profiles SELECT policies.
-- The admin policy queried profiles inside its own USING clause, re-triggering RLS.
-- Use security definer helper (same pattern as 002_core_schema).

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

drop policy if exists "Admins can read all profiles" on public.profiles;

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_armo_staff());
