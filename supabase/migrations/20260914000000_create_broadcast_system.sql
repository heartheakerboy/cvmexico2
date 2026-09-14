-- Complete Broadcast Email Marketing System Migration
-- Creates relational structures for campaigns, recipients, events, preferences, and suppression list

CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  sender_name TEXT,
  sender_email TEXT,
  reply_to TEXT,
  body_html TEXT NOT NULL,
  cta_text TEXT,
  cta_url TEXT,
  banner_url TEXT,
  logo_url TEXT,
  audience_type TEXT DEFAULT 'all',
  audience_filters JSONB DEFAULT '{}'::jsonb,
  language TEXT DEFAULT 'both',
  status TEXT DEFAULT 'draft', -- draft, scheduled, sending, sent, paused, cancelled, failed
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  recipients_count INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  delivered_count INT DEFAULT 0,
  opened_count INT DEFAULT 0,
  clicked_count INT DEFAULT 0,
  bounced_count INT DEFAULT 0,
  unsubscribed_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL,
  user_id UUID,
  email TEXT NOT NULL,
  full_name TEXT,
  language TEXT DEFAULT 'es',
  status TEXT DEFAULT 'pending', -- pending, sent, delivered, opened, clicked, bounced, unsubscribed, failed
  error TEXT,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID,
  recipient_id UUID,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL, -- open, click, bounce, unsubscribe
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  email TEXT NOT NULL UNIQUE,
  marketing_emails BOOLEAN DEFAULT true,
  product_updates BOOLEAN DEFAULT true,
  career_tips BOOLEAN DEFAULT true,
  special_offers BOOLEAN DEFAULT true,
  newsletter BOOLEAN DEFAULT true,
  consent_given_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_suppressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  reason TEXT DEFAULT 'unsubscribe', -- unsubscribe, bounce, spam_complaint, manual
  notes TEXT,
  suppressed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign ON public.campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_status ON public.campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_email_events_campaign ON public.email_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_suppressions_email ON public.email_suppressions(email);
