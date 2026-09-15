-- ==============================================================================
-- Migration 002: Row Level Security (RLS) Policies & Storage Buckets
-- Secure all portfolio tables and storage resources
-- ==============================================================================

-- 1. ENABLE RLS ON ALL PUBLIC TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC READ POLICIES (Anonymous & Authenticated can view published portfolio data)
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can view education" ON public.education;
CREATE POLICY "Public can view education"
  ON public.education FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can view experience" ON public.experience;
CREATE POLICY "Public can view experience"
  ON public.experience FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can view skills" ON public.skills;
CREATE POLICY "Public can view skills"
  ON public.skills FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can view certifications" ON public.certifications;
CREATE POLICY "Public can view certifications"
  ON public.certifications FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can view achievements" ON public.achievements;
CREATE POLICY "Public can view achievements"
  ON public.achievements FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can view languages" ON public.languages;
CREATE POLICY "Public can view languages"
  ON public.languages FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can view site_settings" ON public.site_settings;
CREATE POLICY "Public can view site_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. CONTACT MESSAGES POLICIES
-- Public visitors can submit contact messages with basic validation
DROP POLICY IF EXISTS "Public can insert contact messages" ON public.contact_messages;
CREATE POLICY "Public can insert contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) >= 2 AND
    char_length(email) >= 5 AND
    char_length(message) >= 5
  );

-- Only authenticated admins can read, update, or delete contact messages
DROP POLICY IF EXISTS "Authenticated admin can view contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated admin can view contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated admin can update contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated admin can update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can delete contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated admin can delete contact messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (true);

-- 4. ADMIN WRITE POLICIES (Authenticated admin has full CRUD on portfolio tables)
-- Profiles
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
CREATE POLICY "Admin full access to profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Education
DROP POLICY IF EXISTS "Admin full access to education" ON public.education;
CREATE POLICY "Admin full access to education"
  ON public.education FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Experience
DROP POLICY IF EXISTS "Admin full access to experience" ON public.experience;
CREATE POLICY "Admin full access to experience"
  ON public.experience FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Projects
DROP POLICY IF EXISTS "Admin full access to projects" ON public.projects;
CREATE POLICY "Admin full access to projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Skills
DROP POLICY IF EXISTS "Admin full access to skills" ON public.skills;
CREATE POLICY "Admin full access to skills"
  ON public.skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Certifications
DROP POLICY IF EXISTS "Admin full access to certifications" ON public.certifications;
CREATE POLICY "Admin full access to certifications"
  ON public.certifications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Achievements
DROP POLICY IF EXISTS "Admin full access to achievements" ON public.achievements;
CREATE POLICY "Admin full access to achievements"
  ON public.achievements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Languages
DROP POLICY IF EXISTS "Admin full access to languages" ON public.languages;
CREATE POLICY "Admin full access to languages"
  ON public.languages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Site Settings
DROP POLICY IF EXISTS "Admin full access to site_settings" ON public.site_settings;
CREATE POLICY "Admin full access to site_settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION (Supabase Storage)
-- Create 'portfolio-media' and 'resume' buckets
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resume', 'resume', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
-- 1. Public can view/download media and resume
DROP POLICY IF EXISTS "Public can view portfolio media" ON storage.objects;
CREATE POLICY "Public can view portfolio media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('portfolio-media', 'resume'));

-- 2. Authenticated admin can upload/manage objects in portfolio-media and resume
DROP POLICY IF EXISTS "Admin can manage portfolio media" ON storage.objects;
CREATE POLICY "Admin can manage portfolio media"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id IN ('portfolio-media', 'resume'))
  WITH CHECK (bucket_id IN ('portfolio-media', 'resume'));
