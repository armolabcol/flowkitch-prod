# Recuperar flowkitch.com en Hostinger (503 / pantalla negra)

## Qué significa el error en `stderr.log`

```
uv_thread_create failed
pthread_create: Resource temporarily unavailable
```

Node **no puede arrancar** porque el plan agotó hilos/procesos (límites CloudLinux).  
No es un bug del código de login — **el servidor no levanta**.

---

## Opción A — Configuración correcta en hPanel (recomendada)

En **Ajustes y reimplementación**:

| Campo | Valor |
|-------|--------|
| **Node.js** | `20` |
| **Install** | `npm ci` |
| **Build** | `npm run build` |
| **Start** | `node scripts/hostinger-start.cjs` |
| **Output directory** | `.next/standalone` (si el panel lo pide) |
| **Entry file** | vacío, o `server.js` solo si el cwd es `.next/standalone` |

### Variables de entorno

```
NODE_ENV=production
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://flowkitch.com
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NODE_OPTIONS=--max-old-space-size=512
UV_THREADPOOL_SIZE=1
```

### Después de guardar

1. **Redeploy** (build completo)
2. Cuando diga "Se ha completado" → **Restart**
3. Prueba: `https://flowkitch.com/api/health`

---

## Opción B — Start alternativo (si A falla)

En Start command, prueba **solo una** de estas:

```
node scripts/hostinger-start.cjs
```

O, si Hostinger ejecuta desde la carpeta de output:

```
node server.js
```

(con **Output directory** = `.next/standalone`)

**No uses** `npm run start` si puedes evitarlo — añade un proceso npm extra.

---

## Opción C — Si sigue 503 tras Restart

1. En hPanel → **Deployments** → revisa que el **último build no falló**.
2. Abre **Registros de tiempo de ejecución** o `stderr.log` en File Manager → `domains/flowkitch.com/nodejs/`.
3. Si sigue `uv_thread_create` / `pthread_create`:
   - Abre ticket a **soporte Hostinger** con este texto:

   > Node.js app on flowkitch.com fails to start with  
   > `uv_thread_create` / `pthread_create: Resource temporarily unavailable`.  
   > Please clear zombie Node processes for my account and confirm NPROC/thread limits for Node.js Web Apps.

4. Considera **subir de plan** (Business → Cloud) si el límite es muy bajo para Next.js.

---

## Opción D — Recrear la app Node (último recurso)

Hostinger no tiene botón "Stop". Para limpiar procesos zombie:

1. Anota variables de entorno actuales.
2. Elimina el sitio Node.js y vuelve a **Import Git Repository** → `flowkitch-prod` / `main`.
3. Configura como en Opción A.
4. Redeploy.

---

## Verificación

| URL | Esperado |
|-----|----------|
| `/api/health` | `{"ok":true,"service":"kitch"}` |
| `/es` | Home de Kitch (fondo oscuro con contenido) |
| `/es/portal/login` | Formulario de login |

---

## Supabase (login)

Ejecuta en SQL Editor: `supabase/migrations/004_fix_profiles_rls.sql`
