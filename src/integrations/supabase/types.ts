export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      danger_zones: {
        Row: {
          active: boolean | null
          coordinates: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          risk_level: string | null
        }
        Insert: {
          active?: boolean | null
          coordinates: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          risk_level?: string | null
        }
        Update: {
          active?: boolean | null
          coordinates?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          risk_level?: string | null
        }
        Relationships: []
      }
      digital_tourist_ids: {
        Row: {
          blockchain_hash: string
          created_at: string
          digital_id: string
          expiry_date: string
          id: string
          itinerary: Json | null
          qr_code_url: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          blockchain_hash: string
          created_at?: string
          digital_id: string
          expiry_date: string
          id?: string
          itinerary?: Json | null
          qr_code_url?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          blockchain_hash?: string
          created_at?: string
          digital_id?: string
          expiry_date?: string
          id?: string
          itinerary?: Json | null
          qr_code_url?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      e_fir_reports: {
        Row: {
          blockchain_hash: string
          created_at: string
          fir_number: string
          id: string
          incident_details: string
          officer_assigned: string | null
          pdf_url: string | null
          police_station: string | null
          sos_alert_id: string
          status: string | null
        }
        Insert: {
          blockchain_hash: string
          created_at?: string
          fir_number: string
          id?: string
          incident_details: string
          officer_assigned?: string | null
          pdf_url?: string | null
          police_station?: string | null
          sos_alert_id: string
          status?: string | null
        }
        Update: {
          blockchain_hash?: string
          created_at?: string
          fir_number?: string
          id?: string
          incident_details?: string
          officer_assigned?: string | null
          pdf_url?: string | null
          police_station?: string | null
          sos_alert_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "e_fir_reports_sos_alert_id_fkey"
            columns: ["sos_alert_id"]
            isOneToOne: false
            referencedRelation: "sos_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          attachments: Json | null
          created_at: string
          description: string
          id: string
          incident_type: string
          location: Json | null
          severity: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          description: string
          id?: string
          incident_type: string
          location?: Json | null
          severity?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          description?: string
          id?: string
          incident_type?: string
          location?: Json | null
          severity?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          emergency_contact: string
          id: string
          kyc_document_number: string | null
          name: string
          nationality: string | null
          phone: string | null
          profile_image_url: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emergency_contact: string
          id?: string
          kyc_document_number?: string | null
          name: string
          nationality?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emergency_contact?: string
          id?: string
          kyc_document_number?: string | null
          name?: string
          nationality?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sos_alerts: {
        Row: {
          alert_type: string | null
          created_at: string
          digital_id: string | null
          id: string
          location: Json | null
          notes: string | null
          resolved_at: string | null
          response_time: string | null
          severity: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          alert_type?: string | null
          created_at?: string
          digital_id?: string | null
          id?: string
          location?: Json | null
          notes?: string | null
          resolved_at?: string | null
          response_time?: string | null
          severity?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string | null
          created_at?: string
          digital_id?: string | null
          id?: string
          location?: Json | null
          notes?: string | null
          resolved_at?: string | null
          response_time?: string | null
          severity?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sos_alerts_digital_id_fkey"
            columns: ["digital_id"]
            isOneToOne: false
            referencedRelation: "digital_tourist_ids"
            referencedColumns: ["digital_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
