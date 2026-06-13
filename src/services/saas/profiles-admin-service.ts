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

export async function listProfiles(limit = 100) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, client_id, full_name, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}

export async function updateProfileAdmin(params: {
  profileId: string;
  role?: string;
  clientId?: string | null;
  fullName?: string | null;
  actorId?: string | null;
}): Promise<boolean> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return false;

  const patch: Record<string, unknown> = {};
  if (params.role) patch.role = params.role;
  if (params.clientId !== undefined) patch.client_id = params.clientId;
  if (params.fullName !== undefined) patch.full_name = params.fullName;

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
