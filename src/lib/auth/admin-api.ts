import { getAuthSession } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/auth/roles";
import type { AuthSession } from "@/lib/auth/types";

export async function getAdminApiSession(): Promise<AuthSession | null> {
  const session = await getAuthSession();
  if (!session?.profile || !isAdminRole(session.profile.role)) {
    return null;
  }
  return session;
}
