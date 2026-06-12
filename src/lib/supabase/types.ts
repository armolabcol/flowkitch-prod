/**
 * Supabase Database types — Kitch SaaS Phase 3
 * Regenerate from Supabase CLI when schema changes.
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
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          client_id?: string | null;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name: string;
          country: string;
          email: string;
          tax_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country: string;
          email: string;
          tax_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
        Relationships: [];
      };
      restaurants: {
        Row: {
          id: string;
          client_id: string;
          name: string;
          country: string;
          city: string;
          timezone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          name: string;
          country: string;
          city: string;
          timezone?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["restaurants"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "restaurants_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      plugin_installations: {
        Row: {
          id: string;
          restaurant_id: string;
          site_url: string;
          plugin_version: string;
          license_status: string;
          license_expires_at: string;
          grace_until: string | null;
          last_sync_at: string | null;
          last_license_check_at: string | null;
          orders_month: number;
          revenue_month: number;
          average_ticket: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          site_url: string;
          plugin_version?: string;
          license_status: string;
          license_expires_at: string;
          grace_until?: string | null;
          last_sync_at?: string | null;
          last_license_check_at?: string | null;
          orders_month?: number;
          revenue_month?: number;
          average_ticket?: number;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["plugin_installations"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "plugin_installations_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
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
        Insert: {
          id?: string;
          installation_id: string;
          key_hash: string;
          last4: string;
          status?: string;
          created_at?: string;
          revoked_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["api_keys"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "api_keys_installation_id_fkey";
            columns: ["installation_id"];
            isOneToOne: false;
            referencedRelation: "plugin_installations";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          client_id: string;
          status: string;
          plan_name: string;
          current_period_start: string | null;
          current_period_end: string;
          grace_until: string | null;
          amount_cents: number;
          currency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          status: string;
          plan_name?: string;
          current_period_start?: string | null;
          current_period_end: string;
          grace_until?: string | null;
          amount_cents?: number;
          currency?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "subscriptions_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      telemetry_daily: {
        Row: {
          id: string;
          installation_id: string;
          date: string;
          orders_count: number;
          revenue_cents: number;
          average_ticket_cents: number;
          plugin_version: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          installation_id: string;
          date: string;
          orders_count?: number;
          revenue_cents?: number;
          average_ticket_cents?: number;
          plugin_version: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["telemetry_daily"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "telemetry_daily_installation_id_fkey";
            columns: ["installation_id"];
            isOneToOne: false;
            referencedRelation: "plugin_installations";
            referencedColumns: ["id"];
          },
        ];
      };
      maintenance_logs: {
        Row: {
          id: string;
          installation_id: string;
          title: string;
          status: string;
          scheduled_at: string;
          completed_at: string | null;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          installation_id: string;
          title: string;
          status: string;
          scheduled_at: string;
          completed_at?: string | null;
          notes?: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["maintenance_logs"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_installation_id_fkey";
            columns: ["installation_id"];
            isOneToOne: false;
            referencedRelation: "plugin_installations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_armo_staff: { Args: Record<string, never>; Returns: boolean };
      get_user_client_id: { Args: Record<string, never>; Returns: string };
    };
    Enums: Record<string, never>;
  };
}
