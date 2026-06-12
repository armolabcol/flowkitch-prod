# Kitch SaaS — Estado del proyecto

Última actualización: Fase 2 (Auth + Supabase preparación)

## Resumen ejecutivo

| Área | Estado |
|------|--------|
| Sitio comercial ES/EN | ✅ Entregado |
| Admin dashboard (mock) | ✅ Entregado |
| Portal cliente (mock) | ✅ Entregado |
| API licencias plugin | ✅ Entregado |
| Supabase SSR + Auth | ✅ Entregado (requiere credenciales) |
| Protección rutas por rol | ✅ Entregado (activo con Supabase) |
| Base de datos completa | ⏳ Pendiente |
| Pagos | ⏳ Pendiente |
| Plugin WordPress integrado | ⏳ Pendiente |

---

## ✅ Entregado

### Fase 1 — Fundación SaaS
- Rutas `/es/admin/*` y `/es/portal/*` con UI oscura premium
- Mock data: 3 clientes, 5 instalaciones (CO/US), estados de licencia variados
- `POST /api/plugin/license/check` con validación y masking de API keys
- Servicios: `license-service`, `api-key-service`, `telemetry-service`
- Tipos TypeScript (`src/types/saas.ts`)
- Documentación modelo de datos (`docs/saas-data-model.md`)
- Supabase client/server preparados con guards (build sin credenciales)

### Fase 2 — Auth real (esta entrega)
- **`@supabase/ssr`** — sesiones con cookies
- **Login real** — `SaasLoginForm` en `/es/portal/login` y `/es/admin/login`
- **Protección de rutas** — proxy valida sesión y rol cuando Supabase está configurado
- **Guards server-side** — `requireAdminAccess`, `requirePortalAccess`
- **Sign out** — `POST /api/auth/signout`
- **OAuth callback** — `/auth/callback`
- **Migración SQL** — `supabase/migrations/001_profiles.sql` (tabla `profiles` + trigger)
- **Modo degradado** — sin `.env` de Supabase, todo sigue en mock abierto

---

## ⏳ Pendiente (próximas fases)

### Fase 2b — Supabase en producción (acción manual tuya)
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar `supabase/migrations/001_profiles.sql` en SQL Editor
3. Crear usuario en Authentication → Users
4. Promover a admin:
   ```sql
   update public.profiles
   set role = 'armo_admin', full_name = 'Tu Nombre'
   where email = 'tu-email@armolabcol.com';
   ```
5. Añadir variables en Hostinger y `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

### Fase 3 — Base de datos completa
- Tablas: `clients`, `restaurants`, `plugin_installations`, `api_keys`, `subscriptions`, `payments`
- RLS por `client_id` y rol
- Reemplazar mock data por queries reales
- Seed de datos iniciales

### Fase 4 — Pagos
- Stripe (USA) / Wompi u otro (Colombia)
- Webhooks → actualizar `license_status`
- Botón "Renovar membresía" funcional

### Fase 5 — Plugin WordPress
- Consumir `/api/plugin/license/check` en producción
- HMAC (`KITCH_API_HMAC_SECRET`)
- Rate limiting real (Redis/Upstash)
- Telemetría diaria

### Fase 6 — Operaciones
- Gestión API keys desde admin
- Audit logs
- Métricas agregadas reales
- Notificaciones de vencimiento

---

## Cómo validar ahora

### Sin Supabase (modo actual en producción)
| Qué probar | URL | Resultado esperado |
|------------|-----|-------------------|
| Comercial | `/es` | Home normal |
| Admin abierto | `/es/admin` | Dashboard mock |
| Portal abierto | `/es/portal` | Vista cliente mock |
| Login mock | `/es/portal/login` | Cualquier credencial → portal |
| Admin login | `/es/admin/login` | Cualquier credencial → admin |
| API | `POST /api/plugin/license/check` | JSON `active` / `license_unknown` |

### Con Supabase configurado
| Qué probar | Resultado esperado |
|------------|-------------------|
| `/es/admin` sin sesión | Redirige a `/es/admin/login` |
| `/es/portal` sin sesión | Redirige a `/es/portal/login` |
| Login `armo_admin` | Acceso a admin, bloqueado en portal |
| Login `client_user` | Acceso a portal, bloqueado en admin |
| Sign out | Limpia sesión, vuelve a login |

---

## Rutas

```
/es                          → Comercial (marketing)
/es/admin/login              → Login ARMO
/es/admin                    → Dashboard admin (protegido con Supabase)
/es/portal/login             → Login cliente
/es/portal                   → Portal cliente (protegido con Supabase)
/api/plugin/license/check    → API plugin
/api/auth/signout            → Cerrar sesión
/auth/callback               → OAuth Supabase
```

---

## Roles soportados

| Rol | Acceso |
|-----|--------|
| `armo_admin` | `/admin/*` |
| `super_admin`, `billing_admin`, `support_agent`, `sales_agent` | `/admin/*` (preparado) |
| `client_user` | `/portal/*` |
| `client_owner`, `client_billing` | `/portal/*` (preparado) |

---

## Contacto / soporte interno

Para crear el primer admin: ver sección **Fase 2b** arriba. No se requiere código adicional — solo Supabase + SQL.
