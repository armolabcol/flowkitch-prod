import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/services/audit-service";

export type PortalUserResult =
  | { action: "linked"; email: string; userId: string }
  | { action: "invited"; email: string }
  | { action: "skipped"; reason: string };

async function findAuthUserByEmail(email: string) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return null;

  const normalized = email.trim().toLowerCase();
  let page = 1;
  const perPage = 200;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error || !data.users.length) break;

    const match = data.users.find(
      (u) => u.email?.toLowerCase() === normalized,
    );
    if (match) return match;

    if (data.users.length < perPage) break;
    page += 1;
  }

  return null;
}

async function updateProfileByUserId(
  userId: string,
  clientId: string,
  fullName?: string | null,
) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("profiles")
    .update({
      client_id: clientId,
      role: "client_user",
      ...(fullName ? { full_name: fullName } : {}),
    } as never)
    .eq("id", userId);

  return !error;
}

async function updateProfileByEmail(
  email: string,
  clientId: string,
  fullName?: string | null,
) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("profiles")
    .update({
      client_id: clientId,
      role: "client_user",
      ...(fullName ? { full_name: fullName } : {}),
    } as never)
    .eq("email", email.trim().toLowerCase());

  return !error;
}

export async function linkOrInvitePortalUser(params: {
  email: string;
  clientId: string;
  fullName?: string | null;
  actorId?: string | null;
}): Promise<PortalUserResult> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return { action: "skipped", reason: "Supabase service not configured" };
  }

  const email = params.email.trim().toLowerCase();
  if (!email) {
    return { action: "skipped", reason: "Empty email" };
  }

  const existing = await findAuthUserByEmail(email);

  if (existing) {
    const ok = await updateProfileByUserId(
      existing.id,
      params.clientId,
      params.fullName,
    );
    if (!ok) {
      return { action: "skipped", reason: "Failed to update profile" };
    }

    await writeAuditLog({
      actorId: params.actorId,
      action: "user.linked",
      entityType: "profile",
      entityId: existing.id,
      metadata: { email, clientId: params.clientId },
    });

    return { action: "linked", email, userId: existing.id };
  }

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      role: "client_user",
      full_name: params.fullName ?? null,
      client_id: params.clientId,
    },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://flowkitch.com"}/auth/callback`,
  });

  if (error) {
    return { action: "skipped", reason: error.message };
  }

  if (data.user?.id) {
    await updateProfileByUserId(data.user.id, params.clientId, params.fullName);
  } else {
    await updateProfileByEmail(email, params.clientId, params.fullName);
  }

  await writeAuditLog({
    actorId: params.actorId,
    action: "user.invited",
    entityType: "profile",
    entityId: data.user?.id ?? email,
    metadata: { email, clientId: params.clientId },
  });

  return { action: "invited", email };
}

export async function listProfiles(limit = 100, staffOnly = false) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, email, role, client_id, full_name, assigned_country, managed_by_regional_admin_id, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  if (staffOnly) {
    return data.filter((p) =>
      [
        "super_admin",
        "regional_admin",
        "sales_agent",
        "billing_admin",
        "support_agent",
      ].includes(p.role),
    );
  }
  return data;
}

export async function listSalesAgents(options?: {
  country?: "CO" | "US";
  regionalAdminId?: string;
}): Promise<
  {
    id: string;
    email: string;
    full_name: string | null;
    assigned_country: string | null;
    managed_by_regional_admin_id: string | null;
  }[]
> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return [];

  let query = supabase
    .from("profiles")
    .select("id, email, full_name, assigned_country, managed_by_regional_admin_id")
    .eq("role", "sales_agent")
    .order("email");

  if (options?.regionalAdminId) {
    const { data } = await query;
    let scoped = data ?? [];
    if (options.country) {
      scoped = scoped.filter(
        (a) =>
          a.managed_by_regional_admin_id === options.regionalAdminId ||
          a.assigned_country === options.country ||
          (!a.managed_by_regional_admin_id && !a.assigned_country),
      );
    }
    return scoped;
  }

  const { data } = await query;

  let agents = data ?? [];

  if (options?.country) {
    agents = agents.filter(
      (a) =>
        a.assigned_country === options.country ||
        (!a.assigned_country && !options.regionalAdminId),
    );
  }

  return agents;
}

export async function listRegionalAdmins(): Promise<
  {
    id: string;
    email: string;
    full_name: string | null;
    assigned_country: string | null;
  }[]
> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, assigned_country")
    .eq("role", "regional_admin")
    .order("email");

  return data ?? [];
}

export type StaffInviteRole =
  | "super_admin"
  | "regional_admin"
  | "sales_agent"
  | "billing_admin"
  | "support_agent";

export async function inviteStaffUser(params: {
  email: string;
  role: StaffInviteRole;
  fullName?: string | null;
  assignedCountry?: "CO" | "US" | null;
  managedByRegionalAdminId?: string | null;
  actorId?: string | null;
}): Promise<PortalUserResult> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return { action: "skipped", reason: "Supabase service not configured" };
  }

  const email = params.email.trim().toLowerCase();
  const existing = await findAuthUserByEmail(email);

  if (existing) {
    const patch: Record<string, unknown> = {
      role: params.role,
      client_id: null,
      assigned_country:
        params.role === "regional_admin" || params.role === "sales_agent"
          ? params.assignedCountry
          : null,
      managed_by_regional_admin_id:
        params.role === "sales_agent" ? params.managedByRegionalAdminId ?? null : null,
      ...(params.fullName ? { full_name: params.fullName } : {}),
    };

    const { error } = await supabase
      .from("profiles")
      .update(patch as never)
      .eq("id", existing.id);

    if (error) return { action: "skipped", reason: error.message };

    await writeAuditLog({
      actorId: params.actorId,
      action: "staff.linked",
      entityType: "profile",
      entityId: existing.id,
      metadata: { email, role: params.role },
    });

    return { action: "linked", email, userId: existing.id };
  }

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      role: params.role,
      full_name: params.fullName ?? null,
    },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://flowkitch.com"}/auth/callback`,
  });

  if (error) {
    return { action: "skipped", reason: error.message };
  }

  if (data.user?.id) {
    await supabase
      .from("profiles")
      .update({
        role: params.role,
        client_id: null,
        assigned_country:
          params.role === "regional_admin" || params.role === "sales_agent"
            ? params.assignedCountry
            : null,
        managed_by_regional_admin_id:
          params.role === "sales_agent"
            ? params.managedByRegionalAdminId ?? null
            : null,
        ...(params.fullName ? { full_name: params.fullName } : {}),
      } as never)
      .eq("id", data.user.id);
  }

  await writeAuditLog({
    actorId: params.actorId,
    action: "staff.invited",
    entityType: "profile",
    entityId: data.user?.id ?? email,
    metadata: {
      email,
      role: params.role,
      assignedCountry: params.assignedCountry,
      managedByRegionalAdminId: params.managedByRegionalAdminId,
    },
  });

  return { action: "invited", email };
}

export async function updateProfileAdmin(params: {
  profileId: string;
  role?: string;
  clientId?: string | null;
  fullName?: string | null;
  assignedCountry?: "CO" | "US" | null;
  managedByRegionalAdminId?: string | null;
  actorId?: string | null;
}): Promise<boolean> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return false;

  const patch: Record<string, unknown> = {};
  if (params.role) patch.role = params.role;
  if (params.clientId !== undefined) patch.client_id = params.clientId;
  if (params.fullName !== undefined) patch.full_name = params.fullName;
  if (params.assignedCountry !== undefined) {
    patch.assigned_country = params.assignedCountry;
  }
  if (params.managedByRegionalAdminId !== undefined) {
    patch.managed_by_regional_admin_id = params.managedByRegionalAdminId;
  }

  if (params.role && params.role !== "sales_agent") {
    patch.managed_by_regional_admin_id = null;
  }
  if (params.role && params.role !== "regional_admin" && params.role !== "sales_agent") {
    patch.assigned_country = null;
  }
  if (
    params.role &&
    ["super_admin", "regional_admin", "sales_agent", "billing_admin", "support_agent"].includes(
      params.role,
    )
  ) {
    patch.client_id = null;
  }

  const { error } = await supabase
    .from("profiles")
    .update(patch as never)
    .eq("id", params.profileId);

  if (error) return false;

  await writeAuditLog({
    actorId: params.actorId,
    action: "user.updated",
    entityType: "profile",
    entityId: params.profileId,
    metadata: patch,
  });

  return true;
}

export async function invitePortalUser(params: {
  email: string;
  clientId: string;
  fullName?: string | null;
  actorId?: string | null;
}): Promise<PortalUserResult> {
  return linkOrInvitePortalUser(params);
}

export async function linkPortalUser(params: {
  email: string;
  clientId: string;
  fullName?: string | null;
  actorId?: string | null;
}): Promise<PortalUserResult> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return { action: "skipped", reason: "Supabase service not configured" };
  }

  const email = params.email.trim().toLowerCase();
  const existing = await findAuthUserByEmail(email);

  if (!existing) {
    return { action: "skipped", reason: "User not found in Auth" };
  }

  const ok = await updateProfileByUserId(
    existing.id,
    params.clientId,
    params.fullName,
  );
  if (!ok) return { action: "skipped", reason: "Failed to update profile" };

  await writeAuditLog({
    actorId: params.actorId,
    action: "user.linked",
    entityType: "profile",
    entityId: existing.id,
    metadata: { email, clientId: params.clientId },
  });

  return { action: "linked", email, userId: existing.id };
}
