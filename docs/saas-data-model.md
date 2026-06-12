# Kitch SaaS — Modelo de datos

Documento de referencia para la fase SaaS de flowkitch.com. Las tablas aún no están desplegadas en Supabase; este es el esquema objetivo.

## Diagrama de relaciones

```
profiles ──┬── clients ──┬── restaurants ──┬── plugin_installations ──┬── api_keys
           │             │                 │                        ├── license_checks
           │             │                 │                        ├── plugin_telemetry_daily
           │             │                 │                        └── maintenance_logs
           │             │                 │
           │             └── subscriptions ├── payments
           │             │
           └── audit_logs (polimórfico)
```

---

## Tablas

### `profiles`

Extiende `auth.users` de Supabase.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | FK → `auth.users.id` |
| `email` | text | |
| `role` | text | Ver roles abajo |
| `client_id` | uuid FK nullable | Solo para usuarios cliente |
| `full_name` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Roles actuales:** `armo_admin`, `client_user`

**Roles futuros:** `super_admin`, `billing_admin`, `support_agent`, `sales_agent`, `client_owner`, `client_billing`

---

### `clients`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `name` | text | Razón social o grupo |
| `country` | text | ISO 3166-1 alpha-2 (`CO`, `US`) |
| `email` | text | Contacto principal |
| `tax_id` | text nullable | NIT / EIN |
| `created_at` | timestamptz | |

---

### `restaurants`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `client_id` | uuid FK | |
| `name` | text | |
| `country` | text | |
| `city` | text | |
| `timezone` | text | IANA, ej. `America/Bogota` |
| `created_at` | timestamptz | |

---

### `plugin_installations`

Una fila por sitio WordPress con Kitch instalado.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `restaurant_id` | uuid FK | |
| `site_url` | text | URL canónica del WP |
| `plugin_version` | text | Semver reportado por plugin |
| `license_status` | text | Ver estados abajo |
| `license_expires_at` | timestamptz | |
| `grace_until` | timestamptz nullable | |
| `last_sync_at` | timestamptz nullable | Último heartbeat de telemetría |
| `last_license_check_at` | timestamptz nullable | |
| `created_at` | timestamptz | |

---

### `api_keys`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `installation_id` | uuid FK | |
| `key_hash` | text | SHA-256 — **nunca** almacenar key completa |
| `last4` | text | Últimos 4 caracteres para UI |
| `status` | text | `active` \| `revoked` |
| `created_at` | timestamptz | |
| `revoked_at` | timestamptz nullable | |

**Regla de seguridad:** el frontend solo expone `last4`, `status`, `created_at`, `revoked_at`.

---

### `subscriptions`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `client_id` | uuid FK | |
| `status` | text | `active`, `past_due`, `grace_period`, `cancelled`, `trialing` |
| `plan_name` | text | ej. `Kitch Pro` |
| `current_period_start` | timestamptz | |
| `current_period_end` | timestamptz | |
| `grace_until` | timestamptz nullable | |
| `amount_cents` | integer | |
| `currency` | text | `USD`, `COP` |
| `created_at` | timestamptz | |

---

### `payments`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `client_id` | uuid FK | |
| `subscription_id` | uuid FK nullable | |
| `amount_cents` | integer | |
| `currency` | text | |
| `status` | text | `paid`, `pending`, `failed`, `refunded` |
| `provider` | text nullable | Stripe, Wompi, etc. |
| `provider_payment_id` | text nullable | |
| `paid_at` | timestamptz nullable | |
| `description` | text | |
| `created_at` | timestamptz | |

---

### `license_checks`

Log de cada validación del plugin.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `installation_id` | uuid FK | |
| `api_key_id` | uuid FK | |
| `status_returned` | text | Estado enviado al plugin |
| `plugin_version` | text | |
| `site_url_reported` | text | |
| `ip_address` | text nullable | |
| `checked_at` | timestamptz | |

---

### `plugin_telemetry_daily`

Agregados diarios reportados por el plugin.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `installation_id` | uuid FK | |
| `date` | date | |
| `orders_count` | integer | |
| `revenue_cents` | integer | |
| `average_ticket_cents` | integer | |
| `plugin_version` | text | |
| `created_at` | timestamptz | |

---

### `maintenance_logs`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `installation_id` | uuid FK | |
| `title` | text | |
| `status` | text | `scheduled`, `in_progress`, `completed` |
| `scheduled_at` | timestamptz | |
| `completed_at` | timestamptz nullable | |
| `notes` | text | |
| `created_by` | uuid FK nullable | → profiles |

---

### `audit_logs`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid PK | |
| `actor_id` | uuid FK nullable | → profiles |
| `action` | text | ej. `api_key.revoked` |
| `entity_type` | text | |
| `entity_id` | text | |
| `metadata` | jsonb | |
| `created_at` | timestamptz | |

---

## Estados de licencia

| Estado | Descripción | Comportamiento plugin |
|--------|-------------|----------------------|
| `active` | Membresía vigente | Operación normal |
| `past_due` | Pago vencido | Advertencia + gracia configurable |
| `grace_period` | En periodo de gracia | Operación con avisos |
| `suspended` | Suspendido por falta de pago | Funcionalidad limitada |
| `cancelled` | Membresía cancelada | Bloqueo |
| `maintenance_required` | Migración/actualización pendiente | Aviso de mantenimiento |
| `license_unknown` | API Key inválida | Respuesta 401 |

---

## Rate limiting (placeholder)

Endpoint `POST /api/plugin/license/check`:

- **Por IP:** 60 solicitudes / minuto
- **Por key hash:** 10 solicitudes / minuto
- Implementación futura: Upstash Redis o edge function en Supabase

---

## HMAC (futuro)

Cuando `KITCH_API_HMAC_SECRET` esté configurado:

1. Plugin firma el body con HMAC-SHA256
2. Header: `X-Kitch-Signature: sha256=<hex>`
3. Servidor valida con `timingSafeCompare`

---

## Fases pendientes

1. Desplegar esquema en Supabase + RLS
2. Auth real (Supabase Auth + roles en `profiles`)
3. Pagos Colombia (Wompi) / USA (Stripe)
4. Webhooks de pago → actualizar `subscriptions` y `license_status`
5. Telemetría real desde plugin
6. Integración WordPress plugin ↔ API
