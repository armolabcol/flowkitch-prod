-- Kitch SaaS — Phase 3 dev seed
-- Idempotent: safe to re-run (uses fixed UUIDs + ON CONFLICT)

-- Clients
insert into public.clients (id, name, country, email, created_at) values
  ('10000000-0000-4000-8000-000000000001', 'Grupo Sabores del Valle', 'CO', 'ops@saboresdelvalle.co', '2024-03-15T10:00:00+00'),
  ('10000000-0000-4000-8000-000000000002', 'Coastal Dining Group', 'US', 'billing@coastaldining.com', '2024-06-01T14:30:00+00'),
  ('10000000-0000-4000-8000-000000000003', 'Andes Kitchen Collective', 'CO', 'admin@andeskitchen.co', '2025-01-10T09:00:00+00')
on conflict (id) do update set
  name = excluded.name,
  country = excluded.country,
  email = excluded.email;

-- Restaurants
insert into public.restaurants (id, client_id, name, country, city, timezone) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'La Terraza Medellín', 'CO', 'Medellín', 'America/Bogota'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Sabores Envigado', 'CO', 'Envigado', 'America/Bogota'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'Harbor Table Miami', 'US', 'Miami', 'America/New_York'),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'Sunset Grill Orlando', 'US', 'Orlando', 'America/New_York'),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'Andes Kitchen Bogotá', 'CO', 'Bogotá', 'America/Bogota')
on conflict (id) do update set
  name = excluded.name,
  client_id = excluded.client_id,
  city = excluded.city;

-- Plugin installations
insert into public.plugin_installations (
  id, restaurant_id, site_url, plugin_version, license_status,
  license_expires_at, grace_until, last_sync_at, last_license_check_at,
  orders_month, revenue_month, average_ticket, created_at
) values
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'https://laterraza-medellin.com', '3.0.1', 'active', '2026-09-15T00:00:00+00', null, '2026-06-11T22:45:00+00', '2026-06-11T23:00:00+00', 2840, 42850000, 15088, '2024-04-01T00:00:00+00'),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', 'https://harbortable.miami', '2.9.8', 'past_due', '2026-06-01T00:00:00+00', '2026-06-15T00:00:00+00', '2026-06-10T18:30:00+00', '2026-06-11T08:00:00+00', 1920, 86400, 45, '2024-07-15T00:00:00+00'),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000002', 'https://sabores-envigado.co', '3.0.0', 'suspended', '2026-03-01T00:00:00+00', null, '2026-05-28T12:00:00+00', '2026-06-01T00:00:00+00', 0, 0, 0, '2024-05-20T00:00:00+00'),
  ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000004', 'https://sunsetgrillorlando.com', '3.0.1', 'grace_period', '2026-06-05T00:00:00+00', '2026-06-20T00:00:00+00', '2026-06-11T20:15:00+00', '2026-06-11T20:30:00+00', 1560, 70200, 45, '2024-08-10T00:00:00+00'),
  ('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000005', 'https://andeskitchen.co', '3.0.1', 'active', '2026-12-01T00:00:00+00', null, '2026-06-11T23:10:00+00', '2026-06-11T23:15:00+00', 3100, 46500000, 15000, '2025-02-01T00:00:00+00')
on conflict (id) do update set
  license_status = excluded.license_status,
  orders_month = excluded.orders_month,
  revenue_month = excluded.revenue_month,
  last_sync_at = excluded.last_sync_at;

-- API keys (SHA-256 hashes of dev keys — see docs/saas-status.md)
insert into public.api_keys (id, installation_id, key_hash, last4, status, revoked_at) values
  ('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'c19aa671371c979851d564d4dab5b60101eab24c375276245b4e689bbecc6c6e', '7x9k', 'active', null),
  ('40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', '0b9585a4c5b599df2c6de11b92272ead2201073cb25c7880eadaec5acff6a535', '3m2p', 'active', null),
  ('40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003', '689c149fced82eafdfd9d53f05c029f2441c29ecc1645a4b3862597b56c330fe', '8f1q', 'revoked', '2026-05-01T00:00:00+00'),
  ('40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000004', 'd4b048f9706f74c29499a8231fe8d2835ba7c427d4aae8d84237f4123ab2e827', '5n4r', 'active', null),
  ('40000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000005', '294cf95533b2e15f04f544b1d94b323e2354f9df1ee3cf877e2ad01100356c36', '2w8t', 'active', null)
on conflict (id) do update set
  status = excluded.status,
  key_hash = excluded.key_hash;

-- Subscriptions
insert into public.subscriptions (
  id, client_id, status, plan_name, current_period_end, grace_until, amount_cents, currency
) values
  ('50000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'active', 'Kitch Pro', '2026-09-15T00:00:00+00', null, 29900, 'USD'),
  ('50000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'past_due', 'Kitch Pro', '2026-06-01T00:00:00+00', '2026-06-15T00:00:00+00', 29900, 'USD'),
  ('50000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'active', 'Kitch Pro', '2026-12-01T00:00:00+00', null, 119000, 'COP')
on conflict (id) do update set
  status = excluded.status,
  current_period_end = excluded.current_period_end;

-- Telemetry sample
insert into public.telemetry_daily (
  id, installation_id, date, orders_count, revenue_cents, average_ticket_cents, plugin_version
) values
  ('60000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '2026-06-11', 98, 1478400, 15088, '3.0.1')
on conflict (installation_id, date) do update set
  orders_count = excluded.orders_count,
  revenue_cents = excluded.revenue_cents;

-- Maintenance log sample
insert into public.maintenance_logs (
  id, installation_id, title, status, scheduled_at, completed_at, notes
) values
  ('70000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000003', 'Database migration 3.0', 'scheduled', '2026-06-20T10:00:00+00', null, 'Pending client confirmation')
on conflict (id) do update set
  status = excluded.status,
  notes = excluded.notes;

-- Dev API keys (for plugin testing):
--   kitch_live_mock_active_col_7x9k  → inst 001 (active)
--   kitch_live_mock_pastdue_usa_3m2p  → inst 002 (past_due)
--   kitch_live_mock_suspended_co_8f1q → inst 003 (revoked key / suspended)
--   kitch_live_mock_grace_usa_5n4r    → inst 004 (grace_period)
--   kitch_live_mock_active_usa_2w8t   → inst 005 (active)
