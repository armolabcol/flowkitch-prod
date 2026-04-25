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

- `src/app/[locale]/` — rutas localizadas (`/es`, `/en`)
- `src/components/` — UI por dominio (brand, layout, home, marketing, forms)
- `src/lib/` — i18n, diccionarios, utilidades (`cn`)
- `src/data/` — navegación y definición de módulos
- `src/styles/tokens.css` — tokens de marca
- `public/brand/` y `public/mockups/` — assets (ver README en cada carpeta)

## Variables de entorno (futuras)

Aún no son obligatorias. Fases posteriores podrían usar, por ejemplo:

- `NEXT_PUBLIC_SITE_URL` — URL canónica (por defecto se documenta `https://flowkitch.com`)
- Claves de formulario demo, analytics, auth del portal, etc.

Crea un `.env.local` cuando integres servicios; no lo versiones.

## Despliegue en Hostinger App Web (Node.js)

1. Conecta el repositorio o sube el proyecto.
2. **Build command:** `npm run build`
3. **Start command:** `npm run start` (Node ejecuta Next en modo producción).
4. **Node version:** alinea con la LTS recomendada por Hostinger (18+ o 20+).
5. Define `NODE_ENV=production` en el panel si no viene por defecto.
6. Asigna el dominio `flowkitch.com` al servicio y configura SSL en el panel.

Si Hostinger expone un **puerto** dinámico, Next.js 13+ suele respetar `PORT` del entorno automáticamente con `next start`.

## Assets

Los SVG/PNG de marca y mockups son opcionales en Fase 1. Consulta `public/brand/README.md` y `public/mockups/README.md`.

### Video del Hero (opcional, recomendado)

Para activar el background cinematográfico del hero, coloca:

- `public/videos/restaurant-operations-hero.mp4`
- (opcional) `public/videos/restaurant-operations-hero.webm`

Recomendación: MP4 H.264, 1600×900 o 1920×1080, 8–15s, loop suave, sin audio, ideal < 5MB. Ver `public/videos/README.md`.

## Roadmap de fases

1. **Fase 1 (actual):** Web comercial visual — marketing, i18n, SEO base, placeholders portal/demo.
2. **Fase 2:** Portal funcional (auth, sesiones, áreas internas).
3. **Fase 3:** Pagos y membresías.
4. **Fase 4:** Integración con instalaciones y operación Kitch en campo.

## Licencia / uso

Uso interno del proyecto Kitch By Armo salvo que se indique lo contrario.
