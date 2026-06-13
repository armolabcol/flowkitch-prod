-- Kitch SaaS — Plantilla cliente piloto (Armo Lab / primer cliente real)
-- 1. Reemplaza los valores marcados con <<...>>
-- 2. Ejecuta en Supabase SQL Editor
-- 3. Vincula el usuario portal con el UPDATE de profiles al final

-- Cliente piloto
insert into public.clients (id, name, country, email, created_at) values
  (
    'a1000000-0000-4000-8000-000000000001',
    '<<Nombre del restaurante o grupo>>',
    'CO',  -- CO o US
    '<<email-facturacion@cliente.com>>',
    now()
  )
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  country = excluded.country;

-- Restaurante
insert into public.restaurants (id, client_id, name, country, city, timezone) values
  (
    'a2000000-0000-4000-8000-000000000001',
    'a1000000-0000-4000-8000-000000000001',
    '<<Nombre sede principal>>',
    'CO',
    '<<Ciudad>>',
    'America/Bogota'
  )
on conflict (id) do update set name = excluded.name, city = excluded.city;

-- Instalación plugin
insert into public.plugin_installations (
  id, restaurant_id, site_url, plugin_version, license_status,
  license_expires_at, orders_month, revenue_month, average_ticket
) values
  (
    'a3000000-0000-4000-8000-000000000001',
    'a2000000-0000-4000-8000-000000000001',
    'https://<<dominio-cliente.com>>',
    '3.0.0',
    'active',
    (now() + interval '30 days'),
    0, 0, 0
  )
on conflict (id) do update set
  site_url = excluded.site_url,
  license_status = excluded.license_status;

-- Suscripción
insert into public.subscriptions (
  id, client_id, status, plan_name, current_period_end, amount_cents, currency
) values
  (
    'a5000000-0000-4000-8000-000000000001',
    'a1000000-0000-4000-8000-000000000001',
    'active',
    'Kitch Pro',
    (now() + interval '30 days'),
    119000,
    'COP'
  )
on conflict (id) do update set
  current_period_end = excluded.current_period_end,
  status = excluded.status;

-- Vincular usuario portal (ejecutar DESPUÉS de que el usuario se registró en Supabase Auth):
-- update public.profiles
-- set role = 'client_user',
--     client_id = 'a1000000-0000-4000-8000-000000000001'
-- where email = '<<email-del-usuario-portal@...>>';

-- Generar API key: usar Admin → Instalaciones → Rotar key
--   installation id: a3000000-0000-4000-8000-000000000001
