# RBAC — Roles y permisos Kitch

## Perfiles de negocio

| Perfil | Rol técnico | Alcance |
|--------|-------------|---------|
| Super administrador | `super_admin` | Todo el sistema |
| Admin regional Colombia / USA | `regional_admin` + `assigned_country` | Solo clientes de su país |
| Agente comercial | `sales_agent` | Solo clientes asignados (`clients.assigned_sales_agent_id`) |
| Cliente portal | `client_user` / `client_owner` / `client_billing` | Su propio `client_id` |

`armo_admin` está **deprecado** — migrar a `super_admin` (migración `009_rbac_profiles.sql`).

## Quién crea a quién

```
super_admin
  ├── super_admin, billing_admin, support_agent
  ├── regional_admin (CO o US)
  ├── sales_agent (país + admin regional opcional)
  ├── client_user / client_owner / client_billing
  └── clientes + onboarding (cualquier país)

regional_admin
  ├── sales_agent (mismo país, bajo su gestión)
  ├── clientes + onboarding (mismo país)
  └── client_user (clientes de su país)

sales_agent
  └── solo lectura de cartera; puede invitar client_user a clientes asignados
```

## Super administrador — gestión completa

Desde `/admin/users` el super admin puede:

- Invitar **cualquier rol** (staff y portal cliente)
- Cambiar rol, país y **admin regional** de un agente comercial
- Reasignar **cliente → agente comercial** en detalle de cliente (cualquier agente)
- Reasignar usuarios portal a otro cliente

## Configuración inicial

1. Ejecutar `009_rbac_profiles.sql` y `010_staff_hierarchy.sql` en Supabase SQL Editor
2. Promover primer super admin:

```sql
update public.profiles
set role = 'super_admin', assigned_country = null
where email = 'tu-email@armolabcol.com';
```

3. Invitar admin regional desde `/es/admin/users` → **Invitar usuario staff**

## Asignar agente comercial a cliente

- En **Alta cliente** (`/admin/onboarding`): dropdown opcional
- En **Detalle cliente**: cambiar agente (super admin y admin regional)

## Variables de datos

| Campo | Tabla | Uso |
|-------|-------|-----|
| `assigned_country` | `profiles` | `CO` / `US` para `regional_admin` y `sales_agent` |
| `managed_by_regional_admin_id` | `profiles` | Admin regional del agente comercial |
| `assigned_sales_agent_id` | `clients` | UUID del agente comercial |

## Rutas admin por rol

| Ruta | super | regional | sales |
|------|-------|----------|-------|
| Dashboard | Sí | Sí | Sí (cartera) |
| Alta cliente | Sí | Sí | No |
| Clientes | Sí | Sí (país) | Sí (cartera) |
| Usuarios | Sí | Sí (limitado) | No |
| Ajustes / billing | Sí | No | No |

## Seguridad

- **API admin**: validación `requireAdminScope()` + `canReadClient` / `canWriteClient`
- **RLS Supabase**: `can_staff_read_client()` en lecturas con JWT de usuario
- **Service role writes**: siempre validar scope en API antes de escribir
