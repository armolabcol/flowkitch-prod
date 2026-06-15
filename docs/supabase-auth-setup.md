# Supabase Auth — URLs y correo de recuperación

## 1. URL Configuration (obligatorio en Supabase Dashboard)

**Authentication → URL Configuration**

| Campo | Valor |
|-------|--------|
| **Site URL** | `https://flowkitch.com` |
| **Redirect URLs** | `https://flowkitch.com/auth/callback` |
| | `https://flowkitch.com/auth/callback/**` |

Para desarrollo local (opcional):

```
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback/**
```

> Si **Site URL** queda en `http://localhost:3000`, el correo de reset redirige al PC del desarrollador y falla en producción.

## 2. Variables en Hostinger (ya correctas si coinciden)

```
NEXT_PUBLIC_SITE_URL=https://flowkitch.com
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Tras cambiar variables → **Redeploy** + **Restart**.

## 3. Flujo de reset de contraseña

1. Usuario en `/es/portal/login` → “Olvidé contraseña”
2. `POST /api/auth/forgot-password` → Supabase envía correo
3. Enlace → `https://flowkitch.com/auth/callback?code=...&next=/es/portal/reset-password`
4. Callback intercambia `code` por sesión → `/es/portal/reset-password`
5. Usuario guarda nueva contraseña → `POST /api/auth/reset-password`

## 4. Personalizar correo (Supabase Dashboard)

**Authentication → Email Templates → Reset password**

Copia el HTML de [`email-templates/reset-password.html`](email-templates/reset-password.html) y pégalo en el editor. Conserva `{{ .ConfirmationURL }}` en el botón.

Opcional después: **SMTP** propio (Resend/SendGrid) para remitente `noreply@flowkitch.com`.

## 5. Probar

1. Aplicar configuración de URLs en Supabase
2. Deploy de la app en Hostinger
3. Solicitar **nuevo** enlace (los anteriores expiran ~1 h)
4. El enlace debe abrir `flowkitch.com`, nunca `localhost`
5. Si falla: login muestra *“El enlace expiró o no es válido…”*

## 6. Errores frecuentes

| Síntoma | Causa | Solución |
|---------|--------|----------|
| `localhost:3000` en el enlace | Site URL en Supabase = local | Cambiar a `https://flowkitch.com` |
| `otp_expired` | Token usado o >1 h | Pedir nuevo correo |
| Sesión expirada al guardar clave | No pasó por `/auth/callback` | Revisar Redirect URLs |
| Correo genérico “Supabase Auth” | Template por defecto | Personalizar en §4 |
