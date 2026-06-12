# Kitch SaaS — Estado del proyecto

Última actualización: **Fase 3** (datos reales Supabase)

## Resumen ejecutivo

| Área | Estado |
|------|--------|
| Sitio comercial ES/EN | ✅ Entregado |
| Supabase Auth + roles | ✅ Producción |
| Schema DB completo | ✅ Migración lista (`002`, `003`) |
| Admin dashboard → Supabase | ✅ Entregado |
| Portal → Supabase | ✅ Entregado (requiere `client_id` en profile) |
| API licencias → Supabase | ✅ Entregado (service role) |
| Pagos | ⏳ Fase 4 |
| Plugin WP producción | ⏳ Fase 5 |

---

## Acción requerida post-deploy

Ejecutar en Supabase SQL Editor (si aún no aplicado):

1. `supabase/migrations/002_core_schema.sql`
2. `supabase/migrations/003_seed_dev.sql`

---

## ✅ Entregado

### Fase 1 — Fundación SaaS
- UI admin/portal, mock inicial, API plugin, tipos, documentación

### Fase 2 — Auth
- Login Supabase, protección por rol, tabla `profiles`

### Fase 3 — Datos reales (actual)
- 7 tablas operativas + RLS
- Servicios en `src/services/saas/`
- Seed dev con datos CO/US
- Mock deprecado

---

## ⏳ Pendiente

| Fase | Contenido |
|------|-----------|
| **4** | Pagos (Stripe/Wompi), tabla `payments`, webhooks |
| **5** | Plugin WP, HMAC, rate limit, telemetría en vivo |
| **6** | Admin CRUD API keys, audit logs, alertas vencimiento |

---

## Rutas

```
/es/admin/login     → Login ARMO
/es/admin           → Dashboard (datos Supabase)
/es/portal/login    → Login cliente
/es/portal          → Portal (filtrado por client_id)
/api/plugin/license/check → Validación real por api_keys.key_hash
```

---

## Roles

| Rol | Acceso |
|-----|--------|
| `armo_admin` | Todo `/admin/*` + lectura global DB |
| `client_user` | `/portal/*` solo su `client_id` |

Para vincular un usuario cliente:
```sql
update public.profiles
set client_id = '10000000-0000-4000-8000-000000000002', role = 'client_user'
where email = 'manager@restaurant.com';
```

Changelog detallado: [`docs/CHANGELOG-phase3.md`](CHANGELOG-phase3.md)
