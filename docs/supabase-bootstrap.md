# Supabase — bootstrap inicial (una sola vez)

Las migraciones SQL son solo para **crear el esquema** la primera vez.  
**Operación diaria = app admin** en `https://flowkitch.com/es/admin/onboarding`.

## Primera vez (SQL Editor)

| Orden | Archivo |
|-------|---------|
| 1 | `001_profiles.sql` |
| 2 | `002_core_schema.sql` |
| 3 | `003_seed_dev.sql` (opcional — datos de prueba) |
| 4 | `004_fix_profiles_rls.sql` |
| 5 | `005_phase4_phase6.sql` |
| 6 | `006_client_payment_refs.sql` |
| 7 | `008_billing_providers.sql` |

`007_pilot_client_template.sql` está **deprecated** — usar `/admin/onboarding`.
