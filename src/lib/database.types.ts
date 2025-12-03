// Auto-generated types for Supabase database
// Run `npx supabase gen types typescript` to regenerate after schema changes

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string | null
          display_name: string
          tagline: string | null
          skills: string[]
          hours_available: number | null
          hours_frequency: 'week' | 'month'
          pay_preference: 'hourly' | 'project' | 'salary' | 'negotiable' | null
          pay_rate: string | null
          location: string | null
          contact_email: string | null
          contact_phone: string | null
          social_links: SocialLink[]
          bio: string | null
          avatar_url: string | null
          resume_url: string | null
          is_available: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          display_name: string
          tagline?: string | null
          skills?: string[]
          hours_available?: number | null
          hours_frequency?: 'week' | 'month'
          pay_preference?: 'hourly' | 'project' | 'salary' | 'negotiable' | null
          pay_rate?: string | null
          location?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          social_links?: SocialLink[]
          bio?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          is_available?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          display_name?: string
          tagline?: string | null
          skills?: string[]
          hours_available?: number | null
          hours_frequency?: 'week' | 'month'
          pay_preference?: 'hourly' | 'project' | 'salary' | 'negotiable' | null
          pay_rate?: string | null
          location?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          social_links?: SocialLink[]
          bio?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          is_available?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
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
  }
}

export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'github' | 'website' | 'other'
  handle: string
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

