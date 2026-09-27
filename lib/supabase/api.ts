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
          profileImageUrl: rawProfile.profile_image_url || null,
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
            accentColor: p.accent_color || (idx === 0 ? '#60A5FA' : idx === 1 ? '#F472B6' : '#A78BFA'),
            graphicType: (p.graphic_type as any) || (idx === 0 ? 'fidvr' : idx === 1 ? 'battery' : 'none'),
            imageUrl: p.image_url || null,
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
            certificate_url: c.certificate_url || null,
            certificateUrl: c.certificate_url || null,
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
      if (resumeSetting && resumeSetting.value) {
        if (typeof resumeSetting.value === 'string') {
          const val = resumeSetting.value.trim();
          if (val.length > 0 && val !== 'null' && val !== '""') {
            resumeUrl = val.replace(/^["']|["']$/g, '');
          }
        } else if (typeof resumeSetting.value === 'object') {
          const obj = resumeSetting.value as any;
          resumeUrl = obj.url || obj.publicUrl || null;
        }
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
export async function fetchSiteSettings() {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    if (typeof window !== 'undefined') {
      const resume = localStorage.getItem('vasantha_resume_url');
      if (resume) {
        return { data: [{ key: 'resume_url', value: resume }], error: null };
      }
    }
    return { data: [], error: null };
  }
  return await client.from('site_settings').select('*');
}

export async function updateSiteSetting(key: string, value: any, description?: string) {
  const client = getSupabaseClient();
  if (!client) {
    if (typeof window !== 'undefined' && key === 'resume_url') {
      localStorage.setItem('vasantha_resume_url', typeof value === 'string' ? value : JSON.stringify(value));
    }
    return { error: null };
  }

  return await (client.from('site_settings') as any).upsert({
    key,
    value,
    description: description || null,
    updated_at: new Date().toISOString(),
  });
}

// ==============================================================================
// STORAGE & MEDIA ASSET MANAGEMENT
// ==============================================================================

const DEMO_STORAGE_KEY = 'vasantha_demo_storage_portfolio_media';

interface DemoStorageItem {
  name: string;
  id: string;
  metadata: {
    size: number;
    mimetype: string;
    lastModified?: number;
  };
  created_at: string;
  updated_at: string;
  dataUrl?: string;
}

function getDefaultDemoStorage(): Record<string, DemoStorageItem[]> {
  return {
    profile: [
      {
        name: 'vasantha_avatar.jpg',
        id: 'prof-vasantha-1',
        metadata: { size: 148420, mimetype: 'image/jpeg' },
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      },
    ],
    projects: [
      {
        name: 'redbull_racing_rb20.jpg',
        id: 'proj-rb1',
        metadata: { size: 312540, mimetype: 'image/jpeg' },
        created_at: '2025-02-10T14:30:00Z',
        updated_at: '2025-02-10T14:30:00Z',
      },
      {
        name: 'pv_statcom_fidvr_model.png',
        id: 'proj-fidvr-1',
        metadata: { size: 189200, mimetype: 'image/png' },
        created_at: '2025-02-01T09:15:00Z',
        updated_at: '2025-02-01T09:15:00Z',
      },
      {
        name: 'smart_charge_guardian_schematic.png',
        id: 'proj-battery-2',
        metadata: { size: 224800, mimetype: 'image/png' },
        created_at: '2025-02-05T11:20:00Z',
        updated_at: '2025-02-05T11:20:00Z',
      },
      {
        name: 'redbull_energy_can.png',
        id: 'proj-rb2',
        metadata: { size: 98400, mimetype: 'image/png' },
        created_at: '2025-02-12T16:45:00Z',
        updated_at: '2025-02-12T16:45:00Z',
      },
    ],
    certificates: [
      {
        name: 'cert_ev_basics.pdf',
        id: 'cert-ev-1',
        metadata: { size: 452100, mimetype: 'application/pdf' },
        created_at: '2025-01-20T08:00:00Z',
        updated_at: '2025-01-20T08:00:00Z',
      },
      {
        name: 'sample_draft_scan.pdf',
        id: 'cert-orphan-2',
        metadata: { size: 124300, mimetype: 'application/pdf' },
        created_at: '2025-01-22T13:10:00Z',
        updated_at: '2025-01-22T13:10:00Z',
      },
    ],
  };
}

function getDemoStorageState(): Record<string, DemoStorageItem[]> {
  if (typeof window === 'undefined') return getDefaultDemoStorage();
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
      const defaults = getDefaultDemoStorage();
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return getDefaultDemoStorage();
  }
}

function saveDemoStorageState(state: Record<string, DemoStorageItem[]>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save demo storage to localStorage:', err);
  }
}

function readFileAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export async function uploadStorageFile(
  bucket: 'portfolio-media' | 'resume',
  path: string,
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string }
) {
  const client = getSupabaseClient();
  const configured = isSupabaseConfigured();

  if (client && configured) {
    try {
      const { data, error } = await client.storage.from(bucket).upload(path, file, {
        upsert: options?.upsert ?? true,
        contentType: options?.contentType || (file instanceof File ? file.type : undefined),
      });

      if (!error && data) {
        const { data: urlData } = client.storage.from(bucket).getPublicUrl(path);
        return { data: { path: data.path, publicUrl: urlData.publicUrl }, error: null };
      }
      if (error) {
        console.warn('Supabase storage upload error:', error);
      }
    } catch (err: any) {
      console.warn('Supabase storage upload exception:', err);
    }
  }

  // Demo / local fallback
  try {
    const dataUrl = await readFileAsDataUrl(file);
    const parts = path.split('/');
    const folder = parts.length > 1 ? parts[0] : 'projects';
    const fileName = parts.length > 1 ? parts.slice(1).join('/') : path;

    const state = getDemoStorageState();
    if (!state[folder]) state[folder] = [];

    const existingIdx = state[folder].findIndex((f) => f.name === fileName);
    const newItem: DemoStorageItem = {
      name: fileName,
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      metadata: {
        size: file.size,
        mimetype: file.type || 'image/png',
        lastModified: Date.now(),
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      dataUrl,
    };

    if (existingIdx >= 0) {
      state[folder][existingIdx] = newItem;
    } else {
      state[folder].unshift(newItem);
    }
    saveDemoStorageState(state);

    const publicUrl = dataUrl || `https://demo-storage.local/${bucket}/${path}`;
    return { data: { path, publicUrl }, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function listStorageFiles(bucket: 'portfolio-media' | 'resume', folder?: string) {
  const client = getSupabaseClient();
  const configured = isSupabaseConfigured();

  if (client && configured) {
    try {
      const res = await client.storage.from(bucket).list(folder || '', {
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (!res.error && res.data && res.data.length > 0) {
        return res;
      }
      if (res.error) {
        console.warn('Supabase storage list returned error:', res.error);
      }
    } catch (err) {
      console.warn('Supabase storage list exception:', err);
    }
  }

  // Demo fallback
  const state = getDemoStorageState();
  const folderKey = folder || 'profile';
  const items = state[folderKey] || [];
  return { data: items, error: null };
}

export async function deleteStorageFile(bucket: 'portfolio-media' | 'resume', path: string) {
  return deleteStorageFiles(bucket, [path]);
}

export async function deleteStorageFiles(bucket: 'portfolio-media' | 'resume', paths: string[]) {
  const client = getSupabaseClient();
  const configured = isSupabaseConfigured();

  let storageError: any = null;
  if (client && configured) {
    try {
      const { data, error } = await client.storage.from(bucket).remove(paths);
      if (!error) {
        return { data, error: null };
      }
      storageError = error;
      console.warn('Supabase storage remove returned error:', error);
    } catch (err: any) {
      storageError = err;
    }
  }

  // Remove from demo storage as well
  const state = getDemoStorageState();
  for (const path of paths) {
    const parts = path.split('/');
    const folder = parts.length > 1 ? parts[0] : 'projects';
    const fileName = parts.length > 1 ? parts.slice(1).join('/') : path;
    if (state[folder]) {
      state[folder] = state[folder].filter((f) => f.name !== fileName);
    }
  }
  saveDemoStorageState(state);

  if (storageError && configured) {
    return { data: null, error: storageError };
  }
  return { data: paths, error: null };
}

export async function replaceStorageFile(
  bucket: 'portfolio-media' | 'resume',
  oldPath: string,
  newPath: string,
  file: File
) {
  // 1. Upload new replacement
  const uploadRes = await uploadStorageFile(bucket, newPath, file, { upsert: true });
  if (uploadRes.error) {
    return { data: null, error: uploadRes.error };
  }

  // 2. If path differs, delete old file to prevent orphan duplicates
  if (oldPath && oldPath !== newPath) {
    try {
      await deleteStorageFile(bucket, oldPath);
    } catch (err) {
      console.warn('Failed to delete old file during replace:', err);
    }
  }

  return uploadRes;
}

export async function updateAllMediaReferences(
  oldUrlOrPath: string,
  newUrl: string,
  oldFileName: string
): Promise<{ updatedCount: number; locations: string[] }> {
  const client = getSupabaseClient();
  const locations: string[] = [];
  let updatedCount = 0;

  const matchesOld = (val?: string | null) => {
    if (!val) return false;
    const v = val.trim();
    if (v === newUrl) return false;
    return v === oldUrlOrPath || v.includes(oldFileName) || (oldUrlOrPath && v.includes(oldUrlOrPath));
  };

  // 1. LocalStorage overrides
  if (typeof window !== 'undefined') {
    try {
      const cachedProfile = localStorage.getItem('vasantha_profile_override');
      if (cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        if (matchesOld(parsed.profileImageUrl)) {
          parsed.profileImageUrl = newUrl;
          localStorage.setItem('vasantha_profile_override', JSON.stringify(parsed));
          locations.push('Profile');
          updatedCount++;
        }
      }
      const cachedResume = localStorage.getItem('vasantha_resume_url');
      if (matchesOld(cachedResume)) {
        localStorage.setItem('vasantha_resume_url', newUrl);
        locations.push('Resume / Document');
        updatedCount++;
      }
    } catch (_) {}
  }

  // 2. Database records
  if (client && isSupabaseConfigured()) {
    try {
      // Check profiles
      const { data: profiles } = await client.from('profiles').select('id, profile_image_url');
      if (profiles && profiles.length > 0) {
        for (const p of profiles) {
          if (matchesOld(p.profile_image_url)) {
            await (client.from('profiles') as any).update({ profile_image_url: newUrl }).eq('id', p.id);
            if (!locations.includes('Profile')) locations.push('Profile');
            updatedCount++;
          }
        }
      }

      // Check projects
      const { data: projects } = await client.from('projects').select('id, name, image_url');
      if (projects && projects.length > 0) {
        for (const pr of projects) {
          if (matchesOld(pr.image_url)) {
            await (client.from('projects') as any).update({ image_url: newUrl }).eq('id', pr.id);
            const locName = `Project — ${pr.name}`;
            if (!locations.includes(locName)) locations.push(locName);
            updatedCount++;
          }
        }
      }

      // Check certifications
      const { data: certs } = await client.from('certifications').select('id, title, certificate_url');
      if (certs && certs.length > 0) {
        for (const c of certs) {
          if (matchesOld(c.certificate_url)) {
            await (client.from('certifications') as any).update({ certificate_url: newUrl }).eq('id', c.id);
            const locName = `Certification — ${c.title}`;
            if (!locations.includes(locName)) locations.push(locName);
            updatedCount++;
          }
        }
      }

      // Check site_settings
      const { data: settings } = await client.from('site_settings').select('key, value');
      if (settings && settings.length > 0) {
        for (const s of settings) {
          const sVal = typeof s.value === 'string' ? s.value : JSON.stringify(s.value);
          if (matchesOld(sVal)) {
            const nextVal = typeof s.value === 'string' ? newUrl : { ...s.value, url: newUrl };
            await (client.from('site_settings') as any).update({ value: nextVal }).eq('key', s.key);
            const locName = `Site Setting — ${s.key}`;
            if (!locations.includes(locName)) locations.push(locName);
            updatedCount++;
          }
        }
      }
    } catch (err) {
      console.warn('Error updating database references:', err);
    }
  }

  return { updatedCount, locations };
}

export async function clearAllMediaReferences(
  oldUrlOrPath: string,
  oldFileName: string
): Promise<{ clearedCount: number; locations: string[] }> {
  const client = getSupabaseClient();
  const locations: string[] = [];
  let clearedCount = 0;

  const matchesOld = (val?: string | null) => {
    if (!val) return false;
    const v = val.trim();
    return v === oldUrlOrPath || v.includes(oldFileName) || (oldUrlOrPath && v.includes(oldUrlOrPath));
  };

  // Local storage
  if (typeof window !== 'undefined') {
    try {
      const cachedProfile = localStorage.getItem('vasantha_profile_override');
      if (cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        if (matchesOld(parsed.profileImageUrl)) {
          parsed.profileImageUrl = null;
          localStorage.setItem('vasantha_profile_override', JSON.stringify(parsed));
          locations.push('Profile');
          clearedCount++;
        }
      }
      const cachedResume = localStorage.getItem('vasantha_resume_url');
      if (matchesOld(cachedResume)) {
        localStorage.removeItem('vasantha_resume_url');
        locations.push('Resume / Document');
        clearedCount++;
      }
    } catch (_) {}
  }

  // Database
  if (client && isSupabaseConfigured()) {
    try {
      const { data: profiles } = await client.from('profiles').select('id, profile_image_url');
      if (profiles && profiles.length > 0) {
        for (const p of profiles) {
          if (matchesOld(p.profile_image_url)) {
            await (client.from('profiles') as any).update({ profile_image_url: null }).eq('id', p.id);
            if (!locations.includes('Profile')) locations.push('Profile');
            clearedCount++;
          }
        }
      }

      const { data: projects } = await client.from('projects').select('id, name, image_url');
      if (projects && projects.length > 0) {
        for (const pr of projects) {
          if (matchesOld(pr.image_url)) {
            await (client.from('projects') as any).update({ image_url: null }).eq('id', pr.id);
            const locName = `Project — ${pr.name}`;
            if (!locations.includes(locName)) locations.push(locName);
            clearedCount++;
          }
        }
      }

      const { data: certs } = await client.from('certifications').select('id, title, certificate_url');
      if (certs && certs.length > 0) {
        for (const c of certs) {
          if (matchesOld(c.certificate_url)) {
            await (client.from('certifications') as any).update({ certificate_url: null }).eq('id', c.id);
            const locName = `Certification — ${c.title}`;
            if (!locations.includes(locName)) locations.push(locName);
            clearedCount++;
          }
        }
      }
    } catch (err) {
      console.warn('Error clearing database references:', err);
    }
  }

  return { clearedCount, locations };
}

