# Changelog — Fase 3: Supabase datos reales

## [Fase 3] — 2026-06-12

### Resumen

Reemplazo del modelo mock SaaS por datos reales en Supabase. Admin dashboard y API de licencias conectados a PostgreSQL con RLS.

---

### SQL migrations (ejecutar en Supabase en orden)

| Archivo | Contenido |
|---------|-----------|
| `001_profiles.sql` | ✅ Ya aplicado (Fase 2b) |
| `002_core_schema.sql` | Tablas core + FK + RLS + helpers |
| `003_seed_dev.sql` | Seed idempotente (3 clientes, 5 instalaciones, API keys) |

**Acción requerida en Supabase SQL Editor:**

```text
1. Ejecutar 002_core_schema.sql
2. Ejecutar 003_seed_dev.sql
```

---

### Tablas creadas

- `clients` — grupos / empresas cliente
- `restaurants` — locales por cliente
- `plugin_installations` — sitios WordPress con Kitch
- `api_keys` — hashes SHA-256 (nunca plaintext)
- `subscriptions` — membresías (sin pagos aún)
- `telemetry_daily` — métricas diarias
- `maintenance_logs` — mantenimientos programados

### Seguridad (RLS)

- `is_armo_staff()` — lectura/escritura total para roles ARMO
- `get_user_client_id()` — aislamiento por cliente en portal
- API plugin usa **service role** (sin sesión de usuario)

---

### Código nuevo / modificado

| Área | Cambio |
|------|--------|
| `src/services/saas/` | Capa de datos: admin, portal, installations, telemetry, mappers |
| `src/lib/supabase/types.ts` | Tipos completos con Relationships |
| `src/data/saas-mock.ts` | Deprecado — referencia a seed SQL |
| Admin dashboard | Lee de Supabase vía `getAdminDashboardStats()` |
| Admin subpáginas | clients, restaurants, installations, licenses, maintenance |
| Portal | Datos por `client_id` del perfil autenticado |
| `POST /api/plugin/license/check` | Lookup real en `api_keys` + update `last_license_check_at` |
| Settings admin | Muestra conteo de registros DB |

---

### API keys de desarrollo (post-seed)

| Key | Instalación | Estado licencia |
|-----|-------------|-----------------|
| `kitch_live_mock_active_col_7x9k` | La Terraza Medellín | active |
| `kitch_live_mock_pastdue_usa_3m2p` | Harbor Table Miami | past_due |
| `kitch_live_mock_grace_usa_5n4r` | Sunset Grill Orlando | grace_period |
| `kitch_live_mock_active_usa_2w8t` | Andes Kitchen Bogotá | active |

> `kitch_live_mock_suspended_co_8f1q` tiene key **revoked** — responde `license_unknown`.

---

### Validación post-deploy

1. Login admin: `/es/admin/login` → `jose.artavia@armolab.net`
2. Dashboard: `/es/admin` — debe mostrar 3 clientes, 5 instalaciones (tras seed)
3. Settings: `/es/admin/settings` — "3 clients / 5 inst."
4. API:
   ```bash
   curl -X POST https://flowkitch.com/api/plugin/license/check \
     -H "Content-Type: application/json" \
     -d '{"api_key":"kitch_live_mock_active_col_7x9k","site_url":"https://laterraza-medellin.com","plugin_version":"3.0.0"}'
   ```

---

### Pendiente (Fase 4+)

- Tabla `payments` e historial real en portal billing
- UI admin para crear/revocar API keys
- HMAC + rate limiting en API plugin
- Webhooks de pago
- Integración plugin WordPress en producción

---

### Restricciones respetadas

- ✅ Diseño visual sin cambios
- ✅ Home y páginas comerciales intactas
- ✅ Build pasa sin credenciales (fallback vacío)
- ✅ Sin pagos, WhatsApp ni CRM
