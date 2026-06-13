# Pasarelas de pago — Kitch / flowkitch.com

## Resumen

| País | Pasarela | Configuración |
|------|----------|---------------|
| USA | Stripe (fijo) | Variables env Stripe |
| Colombia | Wompi **o** PayU | Admin → Ajustes → Pasarela Colombia |

El **costo de membresía** se define por cliente en **Alta cliente** (`/es/admin/onboarding`) y se guarda en `subscriptions.amount_cents` + `currency`.

---

## Admin

1. **Ajustes** (`/es/admin/settings`) — `super_admin` o `billing_admin` eligen Wompi vs PayU para clientes nuevos en Colombia.
2. **Alta cliente** — campo costo membresía; moneda automática (COP/USD); pasarela solo lectura.
3. **Detalle cliente** — editar plan y monto post-alta.

---

## Variables de entorno (Hostinger)

### Stripe (USA)

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Webhook URL: `https://flowkitch.com/api/webhooks/stripe`

### Wompi (Colombia)

```
WOMPI_PUBLIC_KEY=pub_prod_...
WOMPI_PRIVATE_KEY=prv_prod_...
WOMPI_INTEGRITY_SECRET=...
WOMPI_EVENTS_SECRET=...
```

Webhook URL: `https://flowkitch.com/api/webhooks/wompi`

### PayU Latam (Colombia)

```
PAYU_API_LOGIN=...
PAYU_API_KEY=...
PAYU_MERCHANT_ID=...
PAYU_ACCOUNT_ID=...
PAYU_TEST_MODE=true   # false en producción
```

Confirmation URL: `https://flowkitch.com/api/webhooks/payu`

---

## Migración SQL

Ejecutar una vez en Supabase SQL Editor:

`supabase/migrations/008_billing_providers.sql`

---

## Flujo portal cliente

1. Usuario entra a `/es/portal/membership`
2. Ve monto de membresía configurado por admin
3. **Renovar** → checkout según país y pasarela del cliente
4. Webhook confirma pago → extiende suscripción y licencia 30 días

---

## Notas

- `clients.payment_provider` es snapshot al crear el cliente (no cambia si se modifica el default global).
- Sin credenciales configuradas, el portal cae en fallback WhatsApp.
- `STRIPE_PRICE_ID_USD` ya no es obligatorio; Stripe usa monto dinámico por cliente.
