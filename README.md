# Kitch — sitio comercial (Fase 1)

**Kitch** es una marca **By Armo**: solución digital para restaurantes físicos que conecta clientes, mesas, meseros, cocina y administración en un flujo operativo trazable. Sitio oficial: [flowkitch.com](https://flowkitch.com).

Esta fase cubre la web comercial bilingüe (ES/EN), identidad visual base, animaciones y páginas placeholder para portal y demo — sin login real, pagos ni base de datos.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion + GSAP
- Lucide React, `clsx`, `tailwind-merge`

## Instalación

```bash
npm install
```

## Scripts

| Comando         | Descripción                |
|-----------------|----------------------------|
| `npm run dev`   | Servidor de desarrollo     |
| `npm run build` | Compilación de producción  |
| `npm run start` | Servidor tras `build`      |
| `npm run lint`  | ESLint                     |

## Estructura principal

- `src/app/[locale]/(marketing)/` — sitio comercial (`/es`, `/en`)
- `src/app/[locale]/admin/` — panel ARMO
- `src/app/[locale]/portal/` — portal cliente
- `src/app/api/plugin/` — API para plugin WordPress
- `src/services/` — lógica de licencias, API keys, telemetría
- `src/data/saas-mock.ts` — datos mock SaaS
- `docs/saas-data-model.md` — esquema de base de datos objetivo
- `src/components/` — UI por dominio (brand, layout, home, marketing, forms)
- `src/lib/` — i18n, diccionarios, utilidades (`cn`)
- `src/data/` — navegación y definición de módulos
- `src/styles/tokens.css` — tokens de marca
- `public/brand/` y `public/mockups/` — assets (ver README en cada carpeta)

## Variables de entorno

Copia `.env.example` a `.env.local`. Las variables de Supabase y HMAC son opcionales en esta fase — el build no falla si faltan.

Variables existentes y futuras:

## Despliegue en Hostinger App Web (Node.js)

1. Conecta el repositorio `armolabcol/flowkitch-prod` (rama `main`).
2. **Node.js version:** `20` (coincide con `.nvmrc`).
3. **Install command:** `npm ci`
4. **Build command:** `npm run build`
5. **Start command:** `npm run start -- -p $PORT`  
   (alternativa: `npm run start` — el script ya escucha en `0.0.0.0` y respeta `PORT`).
6. **Output directory:** `.next` (si el panel lo pide).
7. **Entry file:** dejar vacío — Next.js arranca vía `npm run start`, no `app.js`.
8. Define `NODE_ENV=production` y las variables de `.env.example`.
9. Asigna el dominio `flowkitch.com` y configura SSL.

Si Hostinger expone un **puerto** dinámico, Next.js lo toma de la variable `PORT` automáticamente.

### Error 503 (Service Unavailable)

Significa que el proceso Node **no está corriendo** detrás del proxy. Revisa en hPanel → tu app Node.js:

1. **Build logs** — ¿`npm run build` terminó sin error?
2. **Runtime / Deploy logs** — ¿hay crash al iniciar (`next start`)?
3. **Start command** — debe ser `npm run start -- -p $PORT` (no `node app.js`).
4. **Entry file** — vacío o no configurado.
5. **Redeploy** — botón *Redeploy* o *Restart* tras cambiar env vars.
6. **Health check** — cuando la app esté arriba: `https://flowkitch.com/api/health` debe responder `{"ok":true}`.

Variables mínimas recomendadas en Hostinger:

| Variable | Valor |
|----------|--------|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://flowkitch.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://TU-PROYECTO.supabase.co` (sin `/rest/v1`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clave publishable/anon |
| `SUPABASE_SERVICE_ROLE_KEY` | clave secret (servidor) |

## Assets

Los SVG/PNG de marca y mockups son opcionales en Fase 1. Consulta `public/brand/README.md` y `public/mockups/README.md`.

### Video del Hero (opcional, recomendado)

Para activar el background cinematográfico del hero, coloca:

- `public/videos/restaurant-operations-hero.mp4`
- (opcional) `public/videos/restaurant-operations-hero.webm`

Recomendación: MP4 H.264, 1600×900 o 1920×1080, 8–15s, loop suave, sin audio, ideal < 5MB. Ver `public/videos/README.md`.

## Roadmap de fases

1. **Fase 1 (completada):** Web comercial visual — marketing, i18n, SEO base, placeholders portal/demo.
2. **Fase SaaS (actual):** Base técnica de licenciamiento — admin, portal cliente, API plugin, mock data, Supabase preparado.
3. **Fase 3 (actual):** Base de datos Supabase — schema, RLS, servicios reales, seed dev.
4. **Fase 4:** Pagos y membresías (Colombia / USA).
5. **Fase 5:** Integración plugin WordPress + telemetría.

## SaaS licensing architecture

flowkitch.com actúa como centro de control para todas las instalaciones del plugin WordPress Kitch. Cada restaurante vincula su instalación mediante una **API Key** generada desde el portal/admin.

### Flujo de validación (plugin → SaaS)

1. El plugin WordPress envía `POST /api/plugin/license/check` con:
   ```json
   {
     "api_key": "kitch_live_…",
     "site_url": "https://restaurant.com",
     "plugin_version": "3.0.0"
   }
   ```
2. El servidor busca la instalación por hash de la API Key (nunca se almacena ni expone la key completa).
3. Responde con estado de licencia, fecha de vencimiento y intervalo de re-check:
   ```json
   {
     "status": "active",
     "license_expires_at": "2026-07-01T00:00:00.000Z",
     "grace_until": null,
     "check_interval_hours": 24,
     "message": "License active"
   }
   ```

### Rutas SaaS

| Ruta | Audiencia | Descripción |
|------|-----------|-------------|
| `/es/admin` | ARMO (`armo_admin`) | Dashboard, clientes, instalaciones, licencias |
| `/es/portal` | Cliente (`client_user`) | Membresía, instalación, facturación, soporte |
| `/es/portal/login` | Cliente | Login (preparado para Supabase Auth) |
| `/api/plugin/license/check` | Plugin WP | Validación de licencia |

Las rutas sin prefijo (`/admin`, `/portal`) redirigen a `/es/…` vía proxy de locale.

### Variables de entorno

Copia `.env.example` a `.env.local`. **El proyecto compila sin credenciales reales.**

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (cliente) |
| `SUPABASE_SERVICE_ROLE_KEY` | Operaciones server-side (nunca en cliente) |
| `KITCH_API_HMAC_SECRET` | Firma HMAC futura para requests del plugin |
| `NEXT_PUBLIC_SITE_URL` | URL canónica (`https://flowkitch.com`) |

### Fases pendientes

1. **Supabase en producción** — ejecutar migración y configurar `.env` (ver `docs/saas-status.md`)
2. **Base de datos completa** — tablas clients, restaurants, installations, etc.
3. **Pagos Colombia/USA** — Wompi, Stripe u otro proveedor
4. **Webhooks** — eventos de pago → actualización de licencias
5. **Telemetría real** — heartbeat diario desde plugin
6. **Integración plugin WordPress** — consumo de API en producción

Ver estado detallado: [`docs/saas-status.md`](docs/saas-status.md)

### Seguridad

- API Keys: solo hash SHA-256 en base de datos; UI muestra `last4` únicamente.
- Logs: nunca registrar la key completa (`maskApiKey`).
- HMAC y rate limiting documentados en `docs/saas-data-model.md` — pendientes de activar.


## Licencia / uso

Uso interno del proyecto Kitch By Armo salvo que se indique lo contrario.
