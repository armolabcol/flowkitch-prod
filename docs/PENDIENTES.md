# Kitch — Reporte maestro de pendientes

Última actualización: **Membresía por cliente + pasarelas** (Stripe / Wompi / PayU)

---

## Completado — operación desde la app

| Función | Ruta |
|---------|------|
| Alta cliente completa (cliente + restaurante + instalación + suscripción + API key) | `/es/admin/onboarding` |
| **Costo membresía por cliente** (COP/USD según país) | `/es/admin/onboarding` |
| **Pasarela Colombia global** (Wompi vs PayU) | `/es/admin/settings` |
| Checkout portal con monto del cliente | `/es/portal/membership` |
| Webhooks Stripe / Wompi / PayU | `/api/webhooks/*` |
| Crear solo cliente | `/es/admin/clients` |
| Detalle cliente + editar suscripción | `/es/admin/clients/[id]` |
| Gestionar usuarios portal (vincular, invitar, roles) | `/es/admin/users` |
| Rotar/revocar API keys | `/es/admin/installations` |
| Gestionar licencias (+30d, cambiar estado) | `/es/admin/licenses` |
| Probar plugin (license + telemetry) | Botón en onboarding + `POST /api/admin/plugin-test` |
| Leads demo | `/es/admin/leads` |
| Alertas licencias | Dashboard + cron `/api/cron/license-alerts` |

**Ya no uses SQL** para operación diaria. Migraciones 001–007 bootstrap; **008** pasarelas (`008_billing_providers.sql`). Ver [`docs/billing-providers.md`](billing-providers.md).

---

## Flujo para conectar el primer plugin

1. Login admin → `/es/portal/login` → `/es/admin`
2. **Alta cliente** → `/es/admin/onboarding`
3. Completar formulario (incluye URL WordPress + email portal opcional)
4. Copiar API key del resultado
5. **Probar conexión** en la misma pantalla
6. Pegar en plugin WordPress: URL `https://flowkitch.com` + API key

---

## Pendiente operativo (config, no código)

| # | Tarea |
|---|-------|
| 1 | Aplicar migración `008_billing_providers.sql` en Supabase |
| 2 | Redeploy Hostinger + credenciales pasarelas (ver `docs/billing-providers.md`) |
| 3 | `CRON_SECRET` + cron diario alertas |
| 4 | `RESEND_API_KEY` + `ALERT_EMAIL_TO` (emails opcionales) |
| 5 | Supabase Auth → SMTP para invitaciones por email |

---

## Pendiente pagos (credenciales live)

| # | Tarea |
|---|-------|
| 6 | Stripe live: `STRIPE_SECRET_KEY`, webhook |
| 7 | Wompi live: keys + webhook events |
| 8 | PayU live: merchant + confirmation URL |

---

## Pendiente desarrollo (fase 3)

| # | Tarea |
|---|-------|
| 9 | Plugin WordPress — consumir APIs (`docs/plugin-api-integration.md`) |
| 10 | Convertir lead demo → onboarding pre-rellenado |
| 11 | CRUD mantenimiento desde admin |
| 12 | Vista admin pagos |
| 13 | Leads: filtros + export CSV |
| 14 | Rate limit Redis (multi-instancia) |
| 15 | Validar `site_url` plugin vs instalación |

---

## Progreso estimado

| Área | % |
|------|---|
| Admin / onboarding sin SQL | **~95%** |
| Plugin WP conectado | **~10%** (API lista) |
| Pagos automáticos | **~75%** (código listo; falta credenciales live) |
