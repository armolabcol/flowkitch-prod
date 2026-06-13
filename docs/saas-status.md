# Kitch SaaS — Estado del proyecto

Última actualización: **Fase 4/5/6 avanzada** (un solo deploy recomendado)

## Resumen ejecutivo

| Área | Estado |
|------|--------|
| Sitio + Hostinger estable | ✅ |
| Auth + admin/portal | ✅ |
| Plugin API (licencia + telemetría + HMAC + rate limit) | ✅ |
| Webhooks Stripe/Wompi | ✅ Conciliación básica (metadata/email) |
| Admin leads demo | ✅ `/admin/leads` |
| Admin gestión licencias | ✅ cambiar estado + extender +30d |
| Alertas licencias por vencer | ✅ banner admin + cron `/api/cron/license-alerts` |
| Admin API keys rotate/revoke | ✅ |
| Formulario demo → DB | ✅ |
| Portal billing historial | ✅ |
| Checkout UI Stripe/Wompi | ⏳ Pendiente |
| Plugin WP código PHP | ⏳ Ver `docs/plugin-api-integration.md` |
| Rate limit Redis | ⏳ Solo in-memory (OK en 1 instancia Hostinger) |

---

## Una sola acción Supabase (sin redeploy)

Ver [`docs/supabase-bootstrap.md`](supabase-bootstrap.md) — ejecutar **004 + 005 + 006** en una sesión SQL Editor.

---

## ✅ Ejecutado (batch actual)

| Item | Detalle |
|------|---------|
| Webhooks reales | Stripe/Wompi registran `payments`, activan suscripción/licencia |
| Idempotencia pagos | Índice único `provider + provider_payment_id` |
| Client payment refs | `stripe_customer_id`, `wompi_customer_email` (006) |
| Admin `/leads` | Lista solicitudes demo |
| Admin licencias | UI cambiar estado + extender 30 días |
| Alertas vencimiento | Banner dashboard + endpoint cron |
| Docs plugin | `docs/plugin-api-integration.md` |

---

## ⏳ Pendiente (no requiere deploy inmediato)

| Item | Acción |
|------|--------|
| SQL 004–006 | Manual en Supabase |
| Checkout pagos | Integrar Stripe Checkout / Wompi widget |
| Plugin WordPress | Implementar en repo del plugin |
| Email alertas | Conectar cron a Resend/SMTP (opcional) |
| CRUD crear clientes | Formulario admin (fase posterior) |

---

## Rutas nuevas

```
GET  /api/cron/license-alerts     → Bearer CRON_SECRET
POST /api/admin/installations     → update | extend licencia
/es/admin/leads                     → Leads demo
```

Webhooks producción:
- `https://flowkitch.com/api/webhooks/stripe`
- `https://flowkitch.com/api/webhooks/wompi`

Cron ejemplo (Hostinger cron job o UptimeRobot):
```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://flowkitch.com/api/cron/license-alerts
```
