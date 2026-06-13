# Kitch — Reporte maestro de pendientes

Última actualización: post batch operaciones (`007` + checkout + admin clientes)

---

## ✅ Completado (no requiere acción)

### Infraestructura
- [x] Sitio flowkitch.com en Hostinger (standalone, Node 20)
- [x] Health check `/api/health`
- [x] Auth Supabase (login, roles, forgot/reset password)
- [x] Migraciones SQL 001–006 documentadas

### SaaS core
- [x] Admin dashboard, clientes, restaurantes, instalaciones, licencias
- [x] Portal cliente (membresía, instalación, billing, soporte)
- [x] API plugin: license check + telemetry + HMAC opcional + rate limit
- [x] Webhooks Stripe/Wompi (conciliación básica)
- [x] Leads demo → DB + admin `/admin/leads`
- [x] Rotar/revocar API keys
- [x] Gestionar licencias (estado + extender +30d)
- [x] Alertas licencias (banner + cron)
- [x] **Nuevo:** Crear clientes desde admin
- [x] **Nuevo:** Renovar membresía (Stripe USD si configurado, si no WhatsApp)
- [x] **Nuevo:** Email alertas vía Resend (opcional)
- [x] **Nuevo:** Plantilla SQL cliente piloto (`007_pilot_client_template.sql`)
- [x] **Nuevo:** Script test plugin (`scripts/test-plugin-api.mjs`)

---

## 🟡 Pendiente operativo (tú / sin código)

| # | Tarea | Cómo |
|---|-------|------|
| 1 | **Primer cliente piloto real** | Editar y ejecutar `007_pilot_client_template.sql` en Supabase |
| 2 | **Vincular usuario portal** | UPDATE profiles con `client_id` del piloto |
| 3 | **API key del piloto** | Admin → Instalaciones → Rotar key → guardar key |
| 4 | **WhatsApp comercial** | Env `NEXT_PUBLIC_WHATSAPP_E164` o `NEXT_PUBLIC_WHATSAPP_WA_LINK` en Hostinger |
| 5 | **Cron diario alertas** | Hostinger cron: `curl -H "Authorization: Bearer $CRON_SECRET" https://flowkitch.com/api/cron/license-alerts` |
| 6 | **Email alertas** | Env: `RESEND_API_KEY`, `ALERT_EMAIL_TO` (+ verificar dominio en Resend) |
| 7 | **Seguimiento leads** | Revisar `/es/admin/leads` periódicamente |

---

## 🟠 Pendiente configuración pagos (cuando tengas cuentas)

| # | Tarea | Variables / URLs |
|---|-------|------------------|
| 8 | **Stripe USA** | `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_USD`, webhook → `/api/webhooks/stripe` |
| 9 | **Wompi Colombia** | Checkout widget + webhook → `/api/webhooks/wompi` |
| 10 | **Mapeo clientes pagos** | `clients.stripe_customer_id` o email en metadata checkout |

*Renovar en portal ya funciona: Stripe si está configurado (clientes US), si no abre WhatsApp.*

---

## 🔴 Pendiente desarrollo (fases futuras)

| # | Fase | Descripción | Repo |
|---|------|-------------|------|
| 11 | **5** | Plugin WordPress: llamadas diarias a license + telemetry + HMAC | Repo plugin WP |
| 12 | **4** | UI checkout Wompi embebido en portal (Colombia) | flowkitch-prod |
| 13 | **6** | CRUD restaurantes + instalaciones desde admin | flowkitch-prod |
| 14 | **6** | Admin leads: filtros, export CSV | flowkitch-prod |
| 15 | **5** | Rate limit Redis/Upstash (multi-instancia) | flowkitch-prod |
| 16 | **6** | Tickets soporte integrados (no solo link) | flowkitch-prod |

---

## 📋 Un solo redeploy pendiente (Hostinger)

Tras el push de este batch:
1. **Guardar y reimplementar** (commit más reciente)
2. **Restart**
3. Opcional: añadir env vars nuevas (abajo)

### Env vars nuevas (opcionales)

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID_USD=price_...
RESEND_API_KEY=re_...
ALERT_EMAIL_TO=ops@armolab.net
CRON_SECRET=...
KITCH_API_HMAC_SECRET=...
NEXT_PUBLIC_WHATSAPP_E164=573001234567
```

---

## 🧪 Verificación rápida post-deploy

```powershell
# Health
curl.exe https://flowkitch.com/api/health

# Plugin API (con key real o seed)
$env:BASE_URL="https://flowkitch.com"
$env:API_KEY="kitch_live_..."
node scripts/test-plugin-api.mjs
```

Manual:
- `/es/admin/clients` → crear cliente de prueba
- `/es/portal/membership` → Renovar (WhatsApp o Stripe)
- `/es/admin/leads` → ver leads

---

## Resumen ejecutivo

| Estado | % estimado |
|--------|------------|
| Plataforma SaaS base | **~90%** |
| Operaciones comerciales (piloto + leads) | **~60%** — falta ejecutar 007 y WhatsApp |
| Pagos automáticos | **~40%** — webhooks listos, checkout parcial |
| Plugin WordPress producción | **~10%** — solo API + docs |

**Próximo paso más valioso:** cliente piloto (SQL 007) + conectar plugin WP usando `docs/plugin-api-integration.md`.
