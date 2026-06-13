# Plugin WordPress ↔ flowkitch.com API

Base URL producción: `https://flowkitch.com`

## 1. Validación de licencia (diaria)

```http
POST /api/plugin/license/check
Content-Type: application/json
X-Kitch-Signature: sha256=<hmac_hex>   # opcional si KITCH_API_HMAC_SECRET está configurado
```

```json
{
  "api_key": "kitch_live_…",
  "site_url": "https://mi-restaurante.com",
  "plugin_version": "3.0.0"
}
```

**Respuesta 200:**
```json
{
  "status": "active",
  "license_expires_at": "2026-07-01T00:00:00.000Z",
  "grace_until": null,
  "check_interval_hours": 24,
  "message": "License active"
}
```

## 2. Telemetría diaria

```http
POST /api/plugin/telemetry
Content-Type: application/json
X-Kitch-Signature: sha256=<hmac_hex>
```

```json
{
  "api_key": "kitch_live_…",
  "date": "2026-06-12",
  "orders_count": 142,
  "revenue_cents": 850000,
  "average_ticket_cents": 5985,
  "plugin_version": "3.0.0"
}
```

## 3. HMAC (PHP ejemplo)

```php
$secret = getenv('KITCH_HMAC_SECRET');
$body = json_encode($payload);
$sig = 'sha256=' . hash_hmac('sha256', $body, $secret);
// Header: X-Kitch-Signature: $sig
```

## 4. Rate limits

- 60 req/min por IP
- 10 req/min por API key

## 5. Estados de licencia

| status | Acción plugin |
|--------|----------------|
| `active` | Operación normal |
| `past_due` / `grace_period` | Aviso, no bloquear aún |
| `suspended` / `cancelled` | Modo restringido |
| `maintenance_required` | Forzar actualización |

## 6. Health check

```http
GET /api/health
→ {"ok":true,"service":"kitch"}
```
