import type { UserRole } from "@/types/saas";

export interface AuthProfile {
  id: string;
  email: string;
  role: UserRole;
  client_id: string | null;
  full_name: string | null;
}

export interface AuthSession {
  userId: string;
  email: string;
  profile: AuthProfile | null;
}
