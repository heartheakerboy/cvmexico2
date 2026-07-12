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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliate_commissions: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          amount?: number
          created_at?: string
          id?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          method: string
          reference: string
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          amount?: number
          created_at?: string
          id?: string
          method?: string
          reference?: string
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          method?: string
          reference?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          converted: boolean
          created_at: string
          id: string
          order_amount: number
          referred_email: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          converted?: boolean
          created_at?: string
          id?: string
          order_amount?: number
          referred_email: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          converted?: boolean
          created_at?: string
          id?: string
          order_amount?: number
          referred_email?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          clicks: number
          code: string
          commission_rate: number
          created_at: string
          email: string
          id: string
          name: string
          notes: string
          signups: number
          status: string
          total_earned: number
          updated_at: string
        }
        Insert: {
          clicks?: number
          code: string
          commission_rate?: number
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string
          signups?: number
          status?: string
          total_earned?: number
          updated_at?: string
        }
        Update: {
          clicks?: number
          code?: string
          commission_rate?: number
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string
          signups?: number
          status?: string
          total_earned?: number
          updated_at?: string
        }
        Relationships: []
      }
      ai_credit_events: {
        Row: {
          action: string
          admin_id: string | null
          amount: number | null
          created_at: string
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          amount?: number | null
          created_at?: string
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          amount?: number | null
          created_at?: string
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_models: {
        Row: {
          cost_input: number
          cost_output: number
          created_at: string
          enabled: boolean
          id: string
          model_id: string
          monthly_credit_limit: number | null
          name: string
          provider: string
          updated_at: string
        }
        Insert: {
          cost_input?: number
          cost_output?: number
          created_at?: string
          enabled?: boolean
          id?: string
          model_id: string
          monthly_credit_limit?: number | null
          name: string
          provider?: string
          updated_at?: string
        }
        Update: {
          cost_input?: number
          cost_output?: number
          created_at?: string
          enabled?: boolean
          id?: string
          model_id?: string
          monthly_credit_limit?: number | null
          name?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_prompt_versions: {
        Row: {
          content: string
          created_at: string
          id: string
          max_tokens: number | null
          model: string | null
          prompt_id: string
          temperature: number | null
          version: number
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          max_tokens?: number | null
          model?: string | null
          prompt_id: string
          temperature?: number | null
          version: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          max_tokens?: number | null
          model?: string | null
          prompt_id?: string
          temperature?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_versions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "ai_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompts: {
        Row: {
          active: boolean
          category: string | null
          content: string
          created_at: string
          id: string
          max_tokens: number | null
          model: string | null
          name: string
          slug: string
          temperature: number
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          max_tokens?: number | null
          model?: string | null
          name: string
          slug: string
          temperature?: number
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          max_tokens?: number | null
          model?: string | null
          name?: string
          slug?: string
          temperature?: number
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          cost: number
          country: string | null
          created_at: string
          error: string | null
          feature: string
          id: string
          input_tokens: number
          model: string | null
          output_tokens: number
          plan: string | null
          response_ms: number
          status: string
          total_tokens: number
          user_id: string | null
        }
        Insert: {
          cost?: number
          country?: string | null
          created_at?: string
          error?: string | null
          feature?: string
          id?: string
          input_tokens?: number
          model?: string | null
          output_tokens?: number
          plan?: string | null
          response_ms?: number
          status?: string
          total_tokens?: number
          user_id?: string | null
        }
        Update: {
          cost?: number
          country?: string | null
          created_at?: string
          error?: string | null
          feature?: string
          id?: string
          input_tokens?: number
          model?: string | null
          output_tokens?: number
          plan?: string | null
          response_ms?: number
          status?: string
          total_tokens?: number
          user_id?: string | null
        }
        Relationships: []
      }
      ai_user_limits: {
        Row: {
          bonus_credits: number
          created_at: string
          daily_limit: number | null
          disabled: boolean
          lifetime_limit: number | null
          monthly_limit: number | null
          unlimited: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          bonus_credits?: number
          created_at?: string
          daily_limit?: number | null
          disabled?: boolean
          lifetime_limit?: number | null
          monthly_limit?: number | null
          unlimited?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          bonus_credits?: number
          created_at?: string
          daily_limit?: number | null
          disabled?: boolean
          lifetime_limit?: number | null
          monthly_limit?: number | null
          unlimited?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          active: boolean
          created_at: string
          expires_at: string | null
          id: string
          key_prefix: string
          last_used_at: string | null
          name: string
          scopes: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          scopes?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          scopes?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_name: string | null
          created_at: string
          details: string | null
          entity: string | null
          id: string
          ip_address: string | null
          severity: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_name?: string | null
          created_at?: string
          details?: string | null
          entity?: string | null
          id?: string
          ip_address?: string | null
          severity?: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_name?: string | null
          created_at?: string
          details?: string | null
          entity?: string | null
          id?: string
          ip_address?: string | null
          severity?: string
        }
        Relationships: []
      }
      billing_details: {
        Row: {
          address: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          legal_name: string | null
          tax_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legal_name?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          legal_name?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string
          content: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          id: string
          percent_off: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          id?: string
          percent_off?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          percent_off?: number
        }
        Relationships: []
      }
      cover_letters: {
        Row: {
          company: string | null
          content: string
          created_at: string
          id: string
          role: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          content?: string
          created_at?: string
          id?: string
          role?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          content?: string
          created_at?: string
          id?: string
          role?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      downloads: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["download_kind"]
          size_bytes: number | null
          source: string | null
          storage_path: string | null
          title: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["download_kind"]
          size_bytes?: number | null
          source?: string | null
          storage_path?: string | null
          title: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["download_kind"]
          size_bytes?: number | null
          source?: string | null
          storage_path?: string | null
          title?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_broadcasts: {
        Row: {
          audience: string
          body: string
          created_at: string
          id: string
          recipients_count: number
          scheduled_at: string | null
          sent_count: number
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          audience?: string
          body?: string
          created_at?: string
          id?: string
          recipients_count?: number
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          audience?: string
          body?: string
          created_at?: string
          id?: string
          recipients_count?: number
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          error: string | null
          id: string
          recipient: string
          status: string
          subject: string | null
          template: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          recipient: string
          status?: string
          subject?: string | null
          template?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          recipient?: string
          status?: string
          subject?: string | null
          template?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          active: boolean
          body: string
          created_at: string
          id: string
          name: string
          slug: string
          subject: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          body?: string
          created_at?: string
          id?: string
          name: string
          slug: string
          subject?: string
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
          subject?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          concept: string
          created_at: string
          currency: string
          id: string
          issued_at: string
          method: string | null
          number: string
          period: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          user_id: string
        }
        Insert: {
          amount?: number
          concept: string
          created_at?: string
          currency?: string
          id?: string
          issued_at?: string
          method?: string | null
          number: string
          period?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          user_id: string
        }
        Update: {
          amount?: number
          concept?: string
          created_at?: string
          currency?: string
          id?: string
          issued_at?: string
          method?: string | null
          number?: string
          period?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string | null
          company: string
          created_at: string
          id: string
          location: string | null
          notes: string | null
          role: string
          salary: string | null
          status: Database["public"]["Enums"]["job_status"]
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          company: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          role: string
          salary?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          company?: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          role?: string
          salary?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_events: {
        Row: {
          created_at: string
          id: string
          job_id: string
          occurred_at: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          occurred_at?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          occurred_at?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          created_at: string
          cta_label: string
          cta_url: string
          headline: string
          id: string
          published: boolean
          slug: string
          subheadline: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string
          cta_url?: string
          headline?: string
          id?: string
          published?: boolean
          slug: string
          subheadline?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string
          cta_url?: string
          headline?: string
          id?: string
          published?: boolean
          slug?: string
          subheadline?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          budget: number
          channel: string
          created_at: string
          ends_at: string | null
          id: string
          name: string
          notes: string
          starts_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: number
          channel?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          name: string
          notes?: string
          starts_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number
          channel?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          name?: string
          notes?: string
          starts_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_files: {
        Row: {
          created_at: string
          folder: string
          height: number | null
          id: string
          is_svg: boolean
          mime_type: string | null
          name: string
          path: string
          size: number
          updated_at: string
          width: number | null
        }
        Insert: {
          created_at?: string
          folder?: string
          height?: number | null
          id?: string
          is_svg?: boolean
          mime_type?: string | null
          name: string
          path: string
          size?: number
          updated_at?: string
          width?: number | null
        }
        Update: {
          created_at?: string
          folder?: string
          height?: number | null
          id?: string
          is_svg?: boolean
          mime_type?: string | null
          name?: string
          path?: string
          size?: number
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          active: boolean
          audience: string
          body: string
          channel: string
          created_at: string
          ends_at: string | null
          id: string
          link_url: string | null
          sent_count: number
          starts_at: string | null
          title: string
          updated_at: string
          variant: string
        }
        Insert: {
          active?: boolean
          audience?: string
          body?: string
          channel?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          link_url?: string | null
          sent_count?: number
          starts_at?: string | null
          title: string
          updated_at?: string
          variant?: string
        }
        Update: {
          active?: boolean
          audience?: string
          body?: string
          channel?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          link_url?: string | null
          sent_count?: number
          starts_at?: string | null
          title?: string
          updated_at?: string
          variant?: string
        }
        Relationships: []
      }
      occupations: {
        Row: {
          created_at: string
          description: string | null
          featured: boolean
          id: string
          industry: string | null
          resume_examples: string[]
          salary_currency: string
          salary_max: number | null
          salary_min: number | null
          skills: string[]
          slug: string
          title: string
          universities: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          industry?: string | null
          resume_examples?: string[]
          salary_currency?: string
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[]
          slug: string
          title: string
          universities?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          industry?: string | null
          resume_examples?: string[]
          salary_currency?: string
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[]
          slug?: string
          title?: string
          universities?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean
          created_at: string
          features: Json
          id: string
          interval: string
          name: string
          price: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          features?: Json
          id?: string
          interval?: string
          name: string
          price?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          features?: Json
          id?: string
          interval?: string
          name?: string
          price?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          ai_output_lang: string
          avatar_url: string | null
          certificates: Json
          created_at: string
          currency: string
          dashboard_lang: string
          date_format: string
          education: Json
          email: string | null
          experience: Json
          full_name: string | null
          headline: string | null
          id: string
          languages: Json
          linkedin: string | null
          number_format: string
          phone: string | null
          plan: Database["public"]["Enums"]["plan_type"]
          portfolio: string | null
          references_list: Json
          resume_lang: string
          skills: Json
          summary: string | null
          timezone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          ai_output_lang?: string
          avatar_url?: string | null
          certificates?: Json
          created_at?: string
          currency?: string
          dashboard_lang?: string
          date_format?: string
          education?: Json
          email?: string | null
          experience?: Json
          full_name?: string | null
          headline?: string | null
          id: string
          languages?: Json
          linkedin?: string | null
          number_format?: string
          phone?: string | null
          plan?: Database["public"]["Enums"]["plan_type"]
          portfolio?: string | null
          references_list?: Json
          resume_lang?: string
          skills?: Json
          summary?: string | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          ai_output_lang?: string
          avatar_url?: string | null
          certificates?: Json
          created_at?: string
          currency?: string
          dashboard_lang?: string
          date_format?: string
          education?: Json
          email?: string | null
          experience?: Json
          full_name?: string | null
          headline?: string | null
          id?: string
          languages?: Json
          linkedin?: string | null
          number_format?: string
          phone?: string | null
          plan?: Database["public"]["Enums"]["plan_type"]
          portfolio?: string | null
          references_list?: Json
          resume_lang?: string
          skills?: Json
          summary?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      redirects: {
        Row: {
          active: boolean
          created_at: string
          from_path: string
          hits: number
          id: string
          is_404: boolean
          status_code: number
          to_path: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          from_path: string
          hits?: number
          id?: string
          is_404?: boolean
          status_code?: number
          to_path: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          from_path?: string
          hits?: number
          id?: string
          is_404?: boolean
          status_code?: number
          to_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          design: Json
          education: Json
          email: string | null
          experience: Json
          extras: Json
          full_name: string | null
          headline: string | null
          id: string
          layout: Json
          location: string | null
          phone: string | null
          photo_url: string | null
          skills: Json
          summary: string | null
          template: string
          title: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          created_at?: string
          design?: Json
          education?: Json
          email?: string | null
          experience?: Json
          extras?: Json
          full_name?: string | null
          headline?: string | null
          id?: string
          layout?: Json
          location?: string | null
          phone?: string | null
          photo_url?: string | null
          skills?: Json
          summary?: string | null
          template?: string
          title?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          created_at?: string
          design?: Json
          education?: Json
          email?: string | null
          experience?: Json
          extras?: Json
          full_name?: string | null
          headline?: string | null
          id?: string
          layout?: Json
          location?: string | null
          phone?: string | null
          photo_url?: string | null
          skills?: Json
          summary?: string | null
          template?: string
          title?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          created_at: string
          id: string
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          noindex: boolean
          og_description: string | null
          og_image: string | null
          og_title: string | null
          path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          noindex?: boolean
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          path?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_reply: string | null
          created_at: string
          id: string
          message: string
          priority: string
          requester_email: string | null
          requester_name: string | null
          status: string
          subject: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message?: string
          priority?: string
          requester_email?: string | null
          requester_name?: string | null
          status?: string
          subject: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message?: string
          priority?: string
          requester_email?: string | null
          requester_name?: string | null
          status?: string
          subject?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_backups: {
        Row: {
          created_at: string
          id: string
          label: string
          size_bytes: number
          status: string
          storage_location: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          size_bytes?: number
          status?: string
          storage_location?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          size_bytes?: number
          status?: string
          storage_location?: string
        }
        Relationships: []
      }
      system_cron_jobs: {
        Row: {
          command: string
          created_at: string
          enabled: boolean
          id: string
          last_run_at: string | null
          last_status: string
          name: string
          next_run_at: string | null
          schedule: string
          updated_at: string
        }
        Insert: {
          command?: string
          created_at?: string
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          last_status?: string
          name: string
          next_run_at?: string | null
          schedule: string
          updated_at?: string
        }
        Update: {
          command?: string
          created_at?: string
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          last_status?: string
          name?: string
          next_run_at?: string | null
          schedule?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string
          id: string
          level: string
          message: string
          method: string | null
          path: string | null
          source: string
          status_code: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string
          message?: string
          method?: string | null
          path?: string | null
          source?: string
          status_code?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          message?: string
          method?: string | null
          path?: string | null
          source?: string
          status_code?: number | null
        }
        Relationships: []
      }
      system_queue_jobs: {
        Row: {
          attempts: number
          created_at: string
          error: string | null
          id: string
          job_type: string
          payload: string
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          error?: string | null
          id?: string
          job_type: string
          payload?: string
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          error?: string | null
          id?: string
          job_type?: string
          payload?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      templates: {
        Row: {
          active: boolean
          ats_score: number
          category: string
          created_at: string
          description: string | null
          featured: boolean
          id: string
          name: string
          premium: boolean
          sort_order: number
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          ats_score?: number
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          name: string
          premium?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          ats_score?: number
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          name?: string
          premium?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_role: string
          avatar_url: string | null
          created_at: string
          featured: boolean
          id: string
          quote: string
          rating: number
          updated_at: string
        }
        Insert: {
          author_name: string
          author_role?: string
          avatar_url?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          quote?: string
          rating?: number
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_role?: string
          avatar_url?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          quote?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          id: string
          key: string
          locale: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          locale: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          locale?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      download_kind: "pdf" | "docx" | "link" | "generado"
      invoice_status: "pagado" | "pendiente" | "fallido" | "reembolsado"
      job_status: "deseos" | "aplicado" | "entrevista" | "oferta" | "rechazado"
      plan_type: "free" | "pro"
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
    Enums: {
      app_role: ["admin", "user"],
      download_kind: ["pdf", "docx", "link", "generado"],
      invoice_status: ["pagado", "pendiente", "fallido", "reembolsado"],
      job_status: ["deseos", "aplicado", "entrevista", "oferta", "rechazado"],
      plan_type: ["free", "pro"],
    },
  },
} as const
