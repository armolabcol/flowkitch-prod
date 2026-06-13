# Kitch SaaS — Estado del proyecto

Última actualización: **Fase 4/5/6 parcial** (post Hostinger estable)

## Resumen ejecutivo

| Área | Estado |
|------|--------|
| Sitio comercial ES/EN | ✅ Entregado |
| Supabase Auth + roles | ✅ Producción |
| Schema DB core | ✅ `002`, `003`, `004` |
| Schema pagos/audit/leads | ✅ Migración `005` (aplicar en Supabase) |
| Admin dashboard → Supabase | ✅ Entregado |
| Portal → Supabase | ✅ Entregado (requiere `client_id` en profile) |
| API licencias → Supabase | ✅ + HMAC opcional + rate limit |
| API telemetría plugin | ✅ `POST /api/plugin/telemetry` |
| Formulario demo → DB | ✅ `POST /api/leads/demo` |
| Admin rotar/revocar API keys | ✅ UI + `/api/admin/api-keys` |
| Audit logs | ✅ Escritura + vista en Settings |
| Webhooks pagos | ⏳ Stubs Stripe/Wompi (sin conciliación real) |
| Pagos checkout live | ⏳ Fase 4 |
| Plugin WP producción | ⏳ Fase 5 (consumir APIs) |

---

## Acción requerida en Supabase

Ejecutar en SQL Editor si aún no aplicado:

1. `supabase/migrations/002_core_schema.sql`
2. `supabase/migrations/003_seed_dev.sql` (opcional — datos dev)
3. `supabase/migrations/004_fix_profiles_rls.sql`
4. **`supabase/migrations/005_phase4_phase6.sql`** ← nuevo

Variables opcionales en Hostinger / `.env`:

- `KITCH_API_HMAC_SECRET` — firma plugin (`X-Kitch-Signature`)
- `STRIPE_WEBHOOK_SECRET` — cuando Stripe esté activo
- `WOMPI_EVENTS_SECRET` — cuando Wompi esté activo

---

## ✅ Ejecutado en esta iteración

### Infra
- Limpieza de logs de debug en `scripts/hostinger-start.cjs`
- Arranque standalone estable (un proceso, cwd correcto)

### Fase 5 (plugin API)
- HMAC SHA-256 (`verifyHmacSignature`) — activo si `KITCH_API_HMAC_SECRET` está definido
- Rate limit in-memory: 60 req/min IP, 10 req/min por API key
- `POST /api/plugin/telemetry` — heartbeat diario del plugin

### Fase 4 / 6 (fundación)
- Tablas `payments`, `audit_logs`, `demo_leads` (migración 005)
- Servicio de pagos + portal billing lee historial real
- Webhooks stub: `/api/webhooks/stripe`, `/api/webhooks/wompi`
- Audit log en rotación/revocación de keys y webhooks
- Formulario demo persiste leads en Supabase
- Admin: rotar/revocar API keys desde Instalaciones
- Admin Settings: últimos audit logs

---

## ⏳ Pendiente

| Fase | Contenido |
|------|-----------|
| **4** | Checkout Stripe/Wompi, conciliación webhook → `payments` + `subscriptions` |
| **5** | Plugin WordPress consumiendo `/api/plugin/license/check` y `/api/plugin/telemetry` con HMAC |
| **5** | Rate limit distribuido (Redis/Upstash) para multi-instancia |
| **6** | UI admin leads demo, alertas email licencias por vencer |
| **6** | CRUD completo clientes/instalaciones desde admin |

---

## Rutas API

```
POST /api/plugin/license/check   → Validación licencia (+ HMAC opcional)
POST /api/plugin/telemetry       → Telemetría diaria
POST /api/leads/demo             → Lead formulario marketing
POST /api/admin/api-keys         → rotate | revoke (admin session)
POST /api/webhooks/stripe        → Stub (audit log)
POST /api/webhooks/wompi         → Stub (audit log)
GET  /api/health                 → Health check Hostinger
```

---

## Roles

| Rol | Acceso |
|-----|--------|
| `armo_admin` | Todo `/admin/*` + lectura global DB |
| `client_user` | `/portal/*` solo su `client_id` |

Vincular usuario cliente:
```sql
update public.profiles
set client_id = '10000000-0000-4000-8000-000000000002', role = 'client_user'
where email = 'manager@restaurant.com';
```

Changelog: [`docs/CHANGELOG-phase3.md`](CHANGELOG-phase3.md)
