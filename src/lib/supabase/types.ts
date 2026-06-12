/**
 * Placeholder Supabase Database types.
 * Replace with generated types once the schema is deployed.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: string;
          client_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      clients: {
        Row: {
          id: string;
          name: string;
          country: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["clients"]["Row"]> & {
          id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Row"]>;
      };
      plugin_installations: {
        Row: {
          id: string;
          restaurant_id: string;
          site_url: string;
          plugin_version: string;
          license_status: string;
          last_sync_at: string | null;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["plugin_installations"]["Row"]
        > & { id: string; restaurant_id: string; site_url: string };
        Update: Partial<
          Database["public"]["Tables"]["plugin_installations"]["Row"]
        >;
      };
      api_keys: {
        Row: {
          id: string;
          installation_id: string;
          key_hash: string;
          last4: string;
          status: string;
          created_at: string;
          revoked_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["api_keys"]["Row"]> & {
          id: string;
          installation_id: string;
          key_hash: string;
          last4: string;
        };
        Update: Partial<Database["public"]["Tables"]["api_keys"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
