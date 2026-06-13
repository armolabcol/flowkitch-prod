# Supabase — aplicar migraciones pendientes (una sola sesión)

Ejecuta en **SQL Editor** en este orden, **sin redeploy** entre archivos:

| Orden | Archivo | Qué hace |
|-------|---------|----------|
| 1 | `004_fix_profiles_rls.sql` | Fix RLS profiles (login admin) |
| 2 | `005_phase4_phase6.sql` | payments, audit_logs, demo_leads |
| 3 | `006_client_payment_refs.sql` | refs Stripe/Wompi + idempotencia pagos |

Copia y pega cada archivo completo → **Run**. Si un objeto ya existe, ignora el error o usa la versión idempotente del script.

## Verificación rápida

```sql
select table_name from information_schema.tables
where table_schema = 'public'
  and table_name in ('payments', 'audit_logs', 'demo_leads')
order by 1;
```

Debe devolver las 3 tablas.

## Perfil admin

```sql
select email, role, client_id from public.profiles
where email = 'jose.artavia@armolab.net';
```

Si `role` no es `armo_admin`:

```sql
update public.profiles set role = 'armo_admin' where email = 'jose.artavia@armolab.net';
```
