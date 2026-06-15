-- Kitch SaaS — staff hierarchy: sales agent → regional admin
-- Requires 009_rbac_profiles.sql

alter table public.profiles
  add column if not exists managed_by_regional_admin_id uuid null
    references public.profiles (id) on delete set null;

create index if not exists profiles_managed_by_regional_admin_idx
  on public.profiles (managed_by_regional_admin_id)
  where managed_by_regional_admin_id is not null;

comment on column public.profiles.managed_by_regional_admin_id is
  'For sales_agent: regional admin responsible for this agent. Set by super_admin or regional_admin.';
