import type { UserRole } from "@/types/saas";

export interface AuthProfile {
  id: string;
  email: string;
  role: UserRole;
  client_id: string | null;
  full_name: string | null;
  assigned_country: "CO" | "US" | null;
  managed_by_regional_admin_id: string | null;
}

export interface AuthSession {
  userId: string;
  email: string;
  profile: AuthProfile | null;
}
