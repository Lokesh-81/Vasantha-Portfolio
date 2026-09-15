import { getSupabaseClient, isSupabaseConfigured } from './client';
import type { Database } from './types';
import {
  profileData as fallbackProfile,
  educationList as fallbackEducation,
  experienceList as fallbackExperience,
  projectsList as fallbackProjects,
  skillsList as fallbackSkills,
  certificationsList as fallbackCertifications,
  achievementsList as fallbackAchievements,
  languagesList as fallbackLanguages,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillItem,
  CertificationItem,
  AchievementItem,
  LanguageSkill,
} from '@/lib/data/portfolio-data';

export interface FetchedPortfolioData {
  profile: typeof fallbackProfile;
  education: EducationItem[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: LanguageSkill[];
  resumeUrl: string | null;
  fromDatabase: boolean;
}

// ==============================================================================
// PUBLIC PORTFOLIO DATA FETCHING
// ==============================================================================

export async function fetchPortfolioData(): Promise<FetchedPortfolioData> {
  const client = getSupabaseClient();

  if (!client || !isSupabaseConfigured()) {
    return {
      profile: fallbackProfile,
      education: fallbackEducation,
      experiences: fallbackExperience,
      projects: fallbackProjects,
      skills: fallbackSkills,
      certifications: fallbackCertifications,
      achievements: fallbackAchievements,
      languages: fallbackLanguages,
      resumeUrl: null,
      fromDatabase: false,
    };
  }

  try {
    const [
      { data: profilesData },
      { data: educationData },
      { data: experienceData },
      { data: projectsData },
      { data: skillsData },
      { data: certificationsData },
      { data: achievementsData },
      { data: languagesData },
      { data: settingsData },
    ] = await Promise.all([
      client.from('profiles').select('*').limit(1),
      client.from('education').select('*').order('sort_order', { ascending: true }),
      client.from('experience').select('*').order('sort_order', { ascending: true }),
      client.from('projects').select('*').order('sort_order', { ascending: true }),
      client.from('skills').select('*').order('sort_order', { ascending: true }),
      client.from('certifications').select('*').order('sort_order', { ascending: true }),
      client.from('achievements').select('*').order('sort_order', { ascending: true }),
      client.from('languages').select('*').order('sort_order', { ascending: true }),
      client.from('site_settings').select('*'),
    ]);

    // Map profile
    const rawProfile = profilesData?.[0];
    const profile = rawProfile
      ? {
          name: rawProfile.name || fallbackProfile.name,
          initials: 'VP',
          title: rawProfile.headline || fallbackProfile.title,
          degree: fallbackProfile.degree,
          college: fallbackProfile.college,
          location: rawProfile.location || fallbackProfile.location,
          email: rawProfile.email || fallbackProfile.email,
          phone: rawProfile.phone || fallbackProfile.phone,
          phoneClean: (rawProfile.phone || fallbackProfile.phone).replace(/\D/g, ''),
          whatsappUrl: `https://wa.me/${(rawProfile.phone || fallbackProfile.phone).replace(/\D/g, '')}`,
          telUrl: `tel:${rawProfile.phone || fallbackProfile.phone}`,
          linkedinUrl: rawProfile.linkedin_url || fallbackProfile.linkedinUrl,
          locationDisplay: `${rawProfile.location || 'Hyderabad, India'} (IST · UTC+5:30)`,
          heroBio: rawProfile.bio || fallbackProfile.heroBio,
          aboutBio: rawProfile.about_bio || fallbackProfile.aboutBio,
          aboutSubDescription: rawProfile.about_sub_description || fallbackProfile.aboutSubDescription,
          interests: rawProfile.interests?.length ? rawProfile.interests : fallbackProfile.interests,
        }
      : fallbackProfile;

    // Map education
    const education: EducationItem[] =
      educationData && educationData.length > 0
        ? educationData.map((e) => ({
            id: e.id,
            institution: e.institution,
            degree: e.degree,
            period: e.period,
            score: e.score,
            scoreLabel: e.score_label || 'CGPA',
            description: e.description || '',
            highlights: e.highlights || [],
          }))
        : fallbackEducation;

    // Map experience
    const experiences: ExperienceItem[] =
      experienceData && experienceData.length > 0
        ? experienceData.map((exp) => ({
            id: exp.id,
            company: exp.company,
            role: exp.role,
            period: exp.period,
            location: exp.location || '',
            type: exp.type || 'Industrial Internship',
            description: exp.description || '',
            responsibilities: exp.responsibilities || [],
            technologies: exp.technologies || [],
          }))
        : fallbackExperience;

    // Map projects
    const projects: ProjectItem[] =
      projectsData && projectsData.length > 0
        ? projectsData.map((p, idx) => ({
            id: p.id,
            number: p.number || `0${idx + 1}`,
            name: p.name,
            category: p.category,
            tagline: p.tagline || '',
            description: p.description,
            details: p.details || [],
            technologies: p.technologies || [],
            year: p.year || '2024 – 2025',
            status: p.status || 'Completed',
            accentColor: p.accent_color || (idx === 0 ? '#60A5FA' : '#F472B6'),
            graphicType: (p.graphic_type as 'fidvr' | 'battery') || (idx === 0 ? 'fidvr' : 'battery'),
          }))
        : fallbackProjects;

    // Map skills
    const skills: SkillItem[] =
      skillsData && skillsData.length > 0
        ? skillsData.map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            level: s.level as 'Core' | 'Working Knowledge' | 'Familiar',
          }))
        : fallbackSkills;

    // Map certifications
    const certifications: CertificationItem[] =
      certificationsData && certificationsData.length > 0
        ? certificationsData.map((c) => ({
            id: c.id,
            title: c.title,
            issuer: c.issuer,
            badgeColor: c.badge_color || '#60A5FA',
          }))
        : fallbackCertifications;

    // Map achievements
    const achievements: AchievementItem[] =
      achievementsData && achievementsData.length > 0
        ? achievementsData.map((a) => ({
            id: a.id,
            title: a.title,
            award: a.award,
            event: a.event,
            year: a.year || '',
          }))
        : fallbackAchievements;

    // Map languages
    const languages: LanguageSkill[] =
      languagesData && languagesData.length > 0
        ? languagesData.map((l) => ({
            language: l.language,
            proficiency: l.proficiency,
            levelPercentage: l.level_percentage,
          }))
        : fallbackLanguages;

    // Parse resume_url from site_settings
    let resumeUrl: string | null = null;
    if (settingsData) {
      const resumeSetting = settingsData.find((s) => s.key === 'resume_url');
      if (resumeSetting && typeof resumeSetting.value === 'string' && resumeSetting.value.trim().length > 0) {
        resumeUrl = resumeSetting.value;
      }
    }

    return {
      profile,
      education,
      experiences,
      projects,
      skills,
      certifications,
      achievements,
      languages,
      resumeUrl,
      fromDatabase: true,
    };
  } catch (err) {
    console.warn('Error fetching portfolio data from Supabase, using seed fallback:', err);
    return {
      profile: fallbackProfile,
      education: fallbackEducation,
      experiences: fallbackExperience,
      projects: fallbackProjects,
      skills: fallbackSkills,
      certifications: fallbackCertifications,
      achievements: fallbackAchievements,
      languages: fallbackLanguages,
      resumeUrl: null,
      fromDatabase: false,
    };
  }
}

// ==============================================================================
// CONTACT MESSAGES SUBMISSION (WITH RATE-LIMIT & VALIDATION)
// ==============================================================================

const LAST_SUBMIT_KEY = 'vasantha_portfolio_last_contact_ts';
const MIN_SUBMISSION_INTERVAL_MS = 15000; // 15 seconds rate limit per client

export async function submitContactMessage(params: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  honeypot?: string;
}): Promise<{ success: boolean; message: string }> {
  // 1. Honeypot check
  if (params.honeypot && params.honeypot.trim().length > 0) {
    // Silently reject bots without raising errors
    return { success: true, message: 'Message received successfully.' };
  }

  // 2. Client-side validation
  const name = params.name.trim();
  const email = params.email.trim();
  const message = params.message.trim();

  if (name.length < 2) {
    return { success: false, message: 'Please enter a valid name (at least 2 characters).' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  if (message.length < 5) {
    return { success: false, message: 'Please write a message of at least 5 characters.' };
  }

  // 3. Client rate limiting
  if (typeof window !== 'undefined') {
    const lastSubmit = localStorage.getItem(LAST_SUBMIT_KEY);
    const now = Date.now();
    if (lastSubmit && now - Number(lastSubmit) < MIN_SUBMISSION_INTERVAL_MS) {
      const waitSec = Math.ceil((MIN_SUBMISSION_INTERVAL_MS - (now - Number(lastSubmit))) / 1000);
      return {
        success: false,
        message: `Please wait ${waitSec} seconds before sending another message.`,
      };
    }
  }

  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    // If Supabase is not connected yet, simulate successful delivery so users aren't blocked
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
    }
    return {
      success: true,
      message: 'Your message has been received! (Connected in demo mode until Supabase credentials are set)',
    };
  }

  try {
    const { error } = await client.from('contact_messages').insert({
      name,
      email,
      phone: params.phone?.trim() || null,
      subject: params.subject?.trim() || 'General Inquiry',
      message,
      status: 'new',
    });

    if (error) {
      console.error('Failed to submit message to Supabase:', error);
      return { success: false, message: error.message || 'Failed to submit message.' };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
    }

    return { success: true, message: 'Thank you! Your message was sent successfully to Vasantha.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error occurred while submitting.' };
  }
}

// ==============================================================================
// ADMIN CRUD OPERATIONS
// ==============================================================================

export async function fetchAdminContactMessages(statusFilter?: 'new' | 'read' | 'archived') {
  const client = getSupabaseClient();
  if (!client) return { data: [], error: 'Supabase client not initialized' };

  let query = client.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  return await query;
}

export async function updateMessageStatus(id: string, status: 'new' | 'read' | 'archived') {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await client.from('contact_messages').update({ status }).eq('id', id);
}

export async function deleteContactMessage(id: string) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await client.from('contact_messages').delete().eq('id', id);
}

// Profile update
export async function updateProfile(data: Partial<Database['public']['Tables']['profiles']['Update']>) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };

  // Check if profile exists
  const { data: existing } = await (client.from('profiles') as any).select('id').limit(1);
  if (existing && existing.length > 0) {
    return await (client.from('profiles') as any).update(data).eq('id', existing[0].id);
  } else {
    return await (client.from('profiles') as any).insert({
      name: data.name || fallbackProfile.name,
      headline: data.headline || fallbackProfile.title,
      email: data.email || fallbackProfile.email,
      ...data,
    });
  }
}

// Education CRUD
export async function createEducation(item: Database['public']['Tables']['education']['Insert']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('education') as any).insert(item);
}

export async function updateEducation(id: string, item: Database['public']['Tables']['education']['Update']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('education') as any).update(item).eq('id', id);
}

export async function deleteEducation(id: string) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('education') as any).delete().eq('id', id);
}

// Experience CRUD
export async function createExperience(item: Database['public']['Tables']['experience']['Insert']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('experience') as any).insert(item);
}

export async function updateExperience(id: string, item: Database['public']['Tables']['experience']['Update']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('experience') as any).update(item).eq('id', id);
}

export async function deleteExperience(id: string) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('experience') as any).delete().eq('id', id);
}

// Projects CRUD
export async function createProject(item: Database['public']['Tables']['projects']['Insert']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('projects') as any).insert(item);
}

export async function updateProject(id: string, item: Database['public']['Tables']['projects']['Update']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('projects') as any).update(item).eq('id', id);
}

export async function deleteProject(id: string) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('projects') as any).delete().eq('id', id);
}

// Skills CRUD
export async function createSkill(item: Database['public']['Tables']['skills']['Insert']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('skills') as any).insert(item);
}

export async function updateSkill(id: string, item: Database['public']['Tables']['skills']['Update']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('skills') as any).update(item).eq('id', id);
}

export async function deleteSkill(id: string) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('skills') as any).delete().eq('id', id);
}

// Certifications CRUD
export async function createCertification(item: Database['public']['Tables']['certifications']['Insert']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('certifications') as any).insert(item);
}

export async function updateCertification(id: string, item: Database['public']['Tables']['certifications']['Update']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('certifications') as any).update(item).eq('id', id);
}

export async function deleteCertification(id: string) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('certifications') as any).delete().eq('id', id);
}

// Achievements CRUD
export async function createAchievement(item: Database['public']['Tables']['achievements']['Insert']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('achievements') as any).insert(item);
}

export async function updateAchievement(id: string, item: Database['public']['Tables']['achievements']['Update']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('achievements') as any).update(item).eq('id', id);
}

export async function deleteAchievement(id: string) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('achievements') as any).delete().eq('id', id);
}

// Languages CRUD
export async function createLanguage(item: Database['public']['Tables']['languages']['Insert']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('languages') as any).insert(item);
}

export async function updateLanguage(id: string, item: Database['public']['Tables']['languages']['Update']) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('languages') as any).update(item).eq('id', id);
}

export async function deleteLanguage(id: string) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };
  return await (client.from('languages') as any).delete().eq('id', id);
}

// Site Settings
export async function updateSiteSetting(key: string, value: any, description?: string) {
  const client = getSupabaseClient();
  if (!client) return { error: 'Supabase client not initialized' };

  return await (client.from('site_settings') as any).upsert({
    key,
    value,
    description: description || null,
    updated_at: new Date().toISOString(),
  });
}

// Storage Operations
export async function uploadStorageFile(bucket: 'portfolio-media' | 'resume', path: string, file: File) {
  const client = getSupabaseClient();
  if (!client) return { data: null, error: new Error('Supabase client not initialized') };

  const { data, error } = await client.storage.from(bucket).upload(path, file, {
    upsert: true,
  });

  if (error) return { data: null, error };

  const { data: urlData } = client.storage.from(bucket).getPublicUrl(path);
  return { data: { path: data.path, publicUrl: urlData.publicUrl }, error: null };
}

export async function listStorageFiles(bucket: 'portfolio-media' | 'resume', folder?: string) {
  const client = getSupabaseClient();
  if (!client) return { data: [], error: 'Supabase client not initialized' };
  return await client.storage.from(bucket).list(folder || '');
}
