-- ==============================================================================
-- Migration 001: Initial Schema for Vasantha Perala Portfolio
-- Tables: profiles, education, experience, projects, skills, certifications,
--         achievements, languages, contact_messages, site_settings
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  headline TEXT NOT NULL,
  bio TEXT,
  about_bio TEXT,
  about_sub_description TEXT,
  location TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  profile_image_url TEXT,
  interests TEXT[] DEFAULT ARRAY['Power Systems', 'Renewable Energy', 'Electrical Engineering', 'Technology']::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. EDUCATION
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  period TEXT NOT NULL,
  score TEXT NOT NULL,
  score_label TEXT NOT NULL DEFAULT 'CGPA',
  description TEXT,
  highlights TEXT[] DEFAULT '{}'::TEXT[],
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. EXPERIENCE
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT,
  type TEXT DEFAULT 'Industrial Internship',
  description TEXT,
  responsibilities TEXT[] DEFAULT '{}'::TEXT[],
  technologies TEXT[] DEFAULT '{}'::TEXT[],
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL DEFAULT '01',
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  details TEXT[] DEFAULT '{}'::TEXT[],
  technologies TEXT[] DEFAULT '{}'::TEXT[],
  year TEXT,
  status TEXT NOT NULL DEFAULT 'Completed',
  accent_color TEXT DEFAULT '#60A5FA',
  image_url TEXT,
  graphic_type TEXT DEFAULT 'fidvr',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Core',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. CERTIFICATIONS
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  badge_color TEXT DEFAULT '#60A5FA',
  certificate_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  award TEXT NOT NULL,
  event TEXT NOT NULL,
  year TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. LANGUAGES
CREATE TABLE IF NOT EXISTS public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  level_percentage INTEGER NOT NULL DEFAULT 100,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create helpful indexes
CREATE INDEX IF NOT EXISTS idx_education_sort_order ON public.education(sort_order);
CREATE INDEX IF NOT EXISTS idx_experience_sort_order ON public.experience(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_sort_order ON public.skills(sort_order);
CREATE INDEX IF NOT EXISTS idx_certifications_sort_order ON public.certifications(sort_order);
CREATE INDEX IF NOT EXISTS idx_achievements_sort_order ON public.achievements(sort_order);
CREATE INDEX IF NOT EXISTS idx_languages_sort_order ON public.languages(sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Automatic timestamp update function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_profiles_updated_at') THEN
    CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_education_updated_at') THEN
    CREATE TRIGGER trg_education_updated_at BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_experience_updated_at') THEN
    CREATE TRIGGER trg_experience_updated_at BEFORE UPDATE ON public.experience FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_projects_updated_at') THEN
    CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_skills_updated_at') THEN
    CREATE TRIGGER trg_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_certifications_updated_at') THEN
    CREATE TRIGGER trg_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_achievements_updated_at') THEN
    CREATE TRIGGER trg_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_languages_updated_at') THEN
    CREATE TRIGGER trg_languages_updated_at BEFORE UPDATE ON public.languages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_site_settings_updated_at') THEN
    CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;
