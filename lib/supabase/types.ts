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
          name: string;
          headline: string;
          bio: string | null;
          about_bio: string | null;
          about_sub_description: string | null;
          location: string | null;
          email: string;
          phone: string | null;
          linkedin_url: string | null;
          profile_image_url: string | null;
          interests: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          headline: string;
          bio?: string | null;
          about_bio?: string | null;
          about_sub_description?: string | null;
          location?: string | null;
          email: string;
          phone?: string | null;
          linkedin_url?: string | null;
          profile_image_url?: string | null;
          interests?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          headline?: string;
          bio?: string | null;
          about_bio?: string | null;
          about_sub_description?: string | null;
          location?: string | null;
          email?: string;
          phone?: string | null;
          linkedin_url?: string | null;
          profile_image_url?: string | null;
          interests?: string[];
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          institution: string;
          degree: string;
          period: string;
          score: string;
          score_label: string;
          description: string | null;
          highlights: string[];
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution: string;
          degree: string;
          period: string;
          score: string;
          score_label?: string;
          description?: string | null;
          highlights?: string[];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution?: string;
          degree?: string;
          period?: string;
          score?: string;
          score_label?: string;
          description?: string | null;
          highlights?: string[];
          sort_order?: number;
          updated_at?: string;
        };
      };
      experience: {
        Row: {
          id: string;
          company: string;
          role: string;
          period: string;
          location: string | null;
          type: string | null;
          description: string | null;
          responsibilities: string[];
          technologies: string[];
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          role: string;
          period: string;
          location?: string | null;
          type?: string | null;
          description?: string | null;
          responsibilities?: string[];
          technologies?: string[];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          role?: string;
          period?: string;
          location?: string | null;
          type?: string | null;
          description?: string | null;
          responsibilities?: string[];
          technologies?: string[];
          sort_order?: number;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          number: string;
          name: string;
          category: string;
          tagline: string | null;
          description: string;
          details: string[];
          technologies: string[];
          year: string | null;
          status: string;
          accent_color: string | null;
          image_url: string | null;
          graphic_type: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number?: string;
          name: string;
          category: string;
          tagline?: string | null;
          description: string;
          details?: string[];
          technologies?: string[];
          year?: string | null;
          status?: string;
          accent_color?: string | null;
          image_url?: string | null;
          graphic_type?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          name?: string;
          category?: string;
          tagline?: string | null;
          description?: string;
          details?: string[];
          technologies?: string[];
          year?: string | null;
          status?: string;
          accent_color?: string | null;
          image_url?: string | null;
          graphic_type?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          level: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          level?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          level?: string;
          sort_order?: number;
          updated_at?: string;
        };
      };
      certifications: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          badge_color: string | null;
          certificate_url: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          badge_color?: string | null;
          certificate_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string;
          badge_color?: string | null;
          certificate_url?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          award: string;
          event: string;
          year: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          award: string;
          event: string;
          year?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          award?: string;
          event?: string;
          year?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      languages: {
        Row: {
          id: string;
          language: string;
          proficiency: string;
          level_percentage: number;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          language: string;
          proficiency: string;
          level_percentage?: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          language?: string;
          proficiency?: string;
          level_percentage?: number;
          sort_order?: number;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          status: 'new' | 'read' | 'archived';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          status?: 'new' | 'read' | 'archived';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string | null;
          message?: string;
          status?: 'new' | 'read' | 'archived';
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
