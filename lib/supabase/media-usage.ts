/**
 * Media Asset Usage Detection
 * Determines whether a media file stored in Supabase Storage is referenced by
 * any portfolio section (Profile, Projects, Certifications, Education, Experience,
 * Skills, Achievements, Site Settings / Resume).
 */

export interface AssetUsage {
  location: string; // e.g. "Profile", "Project — Smart Charge Guardian", "Certification — NSIC EV"
  type: 'profile' | 'project' | 'certification' | 'education' | 'experience' | 'resume' | 'achievement' | 'setting' | 'other';
  id?: string;
  name?: string;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Checks if a given field value references the specified media file.
 */
export function matchesMediaAsset(
  targetValue: string | null | undefined,
  folder: string,
  fileName: string,
  supabaseUrl?: string
): boolean {
  if (!targetValue || typeof targetValue !== 'string') return false;
  const val = targetValue.trim();
  if (!val || !fileName) return false;

  // 1. Direct equality with fileName
  if (val === fileName || val === encodeURIComponent(fileName)) return true;

  // 2. Relative path match (e.g. "projects/photo.jpg" or "/projects/photo.jpg")
  if (folder) {
    const rel1 = `${folder}/${fileName}`;
    const rel2 = `/${folder}/${fileName}`;
    const relEncoded1 = `${folder}/${encodeURIComponent(fileName)}`;
    const relEncoded2 = `/${folder}/${encodeURIComponent(fileName)}`;

    if (val === rel1 || val === rel2 || val === relEncoded1 || val === relEncoded2) {
      return true;
    }

    if (val.includes(rel1) || val.includes(relEncoded1)) {
      return true;
    }
  }

  // 3. Full Supabase Storage URL match
  if (supabaseUrl && folder) {
    const cleanBase = supabaseUrl.replace(/\/+$/, '');
    const fullUrl = `${cleanBase}/storage/v1/object/public/portfolio-media/${folder}/${fileName}`;
    const fullUrlEncoded = `${cleanBase}/storage/v1/object/public/portfolio-media/${folder}/${encodeURIComponent(fileName)}`;

    if (val === fullUrl || val === fullUrlEncoded) return true;
    if (val.includes(fullUrl) || val.includes(fullUrlEncoded)) return true;
  }

  // 4. Check if string contains the filename as an isolated URL path segment
  // E.g. ".../portfolio-media/projects/my_file.png"
  const cleanName = fileName.trim();
  if (val.includes(cleanName) || val.includes(encodeURIComponent(cleanName))) {
    const safeName = escapeRegex(cleanName);
    const safeEncoded = escapeRegex(encodeURIComponent(cleanName));
    const segmentRegex = new RegExp(`(^|[/_\\-?#])${safeName}($|[?#])`, 'i');
    const segmentEncodedRegex = new RegExp(`(^|[/_\\-?#])${safeEncoded}($|[?#])`, 'i');

    if (segmentRegex.test(val) || segmentEncodedRegex.test(val)) {
      // If folder is specified and URL contains another folder with same file name, check folder
      if (folder && (val.includes('portfolio-media') || val.includes('/storage/'))) {
        return val.toLowerCase().includes(folder.toLowerCase());
      }
      return true;
    }
  }

  return false;
}

export interface PortfolioSearchContext {
  profile?: any;
  projects?: any[];
  certifications?: any[];
  education?: any[];
  experiences?: any[];
  achievements?: any[];
  skills?: any[];
  languages?: any[];
  resumeUrl?: string | null;
  siteSettings?: any[];
}

/**
 * Scans all portfolio entities to identify where a specific asset is used.
 */
export function getAssetUsages(
  fileName: string,
  folder: string,
  portfolio: PortfolioSearchContext,
  supabaseUrl?: string
): AssetUsage[] {
  const usages: AssetUsage[] = [];

  const check = (val?: string | null) => matchesMediaAsset(val, folder, fileName, supabaseUrl);

  // 1. Profile Checks
  let profileMatched = false;
  if (check(portfolio.profile?.profileImageUrl)) {
    usages.push({ location: 'Profile', type: 'profile' });
    profileMatched = true;
  } else if (
    check(portfolio.profile?.heroBio) ||
    check(portfolio.profile?.aboutBio) ||
    check(portfolio.profile?.aboutSubDescription)
  ) {
    usages.push({ location: 'Profile (Bio / About)', type: 'profile' });
    profileMatched = true;
  }

  // Check localStorage profile override
  if (!profileMatched && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('vasantha_profile_override');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (check(parsed.profileImageUrl)) {
          usages.push({ location: 'Profile', type: 'profile' });
        }
      }
    } catch (_) {}
  }

  // 2. Projects Checks
  if (portfolio.projects && Array.isArray(portfolio.projects)) {
    for (const p of portfolio.projects) {
      const pName = p.name || `Project ${p.number || ''}`.trim();
      const matchFound =
        check(p.imageUrl) ||
        check(p.image_url) ||
        check(p.description) ||
        check(p.tagline) ||
        (Array.isArray(p.details) && p.details.some((d: any) => check(d)));

      if (matchFound) {
        usages.push({
          location: `Project — ${pName}`,
          type: 'project',
          id: p.id,
          name: pName,
        });
      }
    }
  }

  // 3. Certifications Checks
  if (portfolio.certifications && Array.isArray(portfolio.certifications)) {
    for (const c of portfolio.certifications) {
      const cTitle = c.title || 'Certification';
      const matchFound =
        check(c.certificate_url) ||
        check(c.certificateUrl) ||
        check(c.issuer);

      if (matchFound) {
        usages.push({
          location: `Certification — ${cTitle}`,
          type: 'certification',
          id: c.id,
          name: cTitle,
        });
      }
    }
  }

  // 4. Resume / Site Settings
  let resumeMatched = false;
  if (check(portfolio.resumeUrl)) {
    usages.push({ location: 'Resume / Active Document', type: 'resume' });
    resumeMatched = true;
  }
  if (!resumeMatched && typeof window !== 'undefined') {
    const cachedResume = localStorage.getItem('vasantha_resume_url');
    if (check(cachedResume)) {
      usages.push({ location: 'Resume / Active Document', type: 'resume' });
    }
  }

  // 5. Education Checks
  if (portfolio.education && Array.isArray(portfolio.education)) {
    for (const e of portfolio.education) {
      const matchFound =
        check(e.description) ||
        (Array.isArray(e.highlights) && e.highlights.some((h: any) => check(h)));

      if (matchFound) {
        usages.push({
          location: `Education — ${e.institution}`,
          type: 'education',
          id: e.id,
        });
      }
    }
  }

  // 6. Experience Checks
  if (portfolio.experiences && Array.isArray(portfolio.experiences)) {
    for (const exp of portfolio.experiences) {
      const matchFound =
        check(exp.description) ||
        (Array.isArray(exp.responsibilities) && exp.responsibilities.some((r: any) => check(r))) ||
        (Array.isArray(exp.technologies) && exp.technologies.some((t: any) => check(t)));

      if (matchFound) {
        usages.push({
          location: `Experience — ${exp.company}`,
          type: 'experience',
          id: exp.id,
        });
      }
    }
  }

  // 7. Achievements Checks
  if (portfolio.achievements && Array.isArray(portfolio.achievements)) {
    for (const a of portfolio.achievements) {
      const matchFound = check(a.title) || check(a.event) || check(a.award);
      if (matchFound) {
        usages.push({
          location: `Achievement — ${a.title}`,
          type: 'achievement',
          id: a.id,
        });
      }
    }
  }

  // 8. Site Settings table
  if (portfolio.siteSettings && Array.isArray(portfolio.siteSettings)) {
    for (const s of portfolio.siteSettings) {
      if (s.key === 'resume_url' && usages.some((u) => u.type === 'resume')) {
        continue;
      }
      const sVal = typeof s.value === 'string' ? s.value : JSON.stringify(s.value);
      if (check(sVal)) {
        usages.push({
          location: `Site Setting — ${s.key}`,
          type: 'setting',
        });
      }
    }
  }

  return usages;
}

/**
 * Returns formatted usage status string:
 * - "Used in: Profile"
 * - "Used in: Project — XYZ"
 * - "Used in: Profile, Project — XYZ"
 * - "Not currently used"
 */
export function formatUsageLabel(usages: AssetUsage[]): string {
  if (!usages || usages.length === 0) {
    return 'Not currently used';
  }
  return `Used in: ${usages.map((u) => u.location.replace(/^Used in:\s*/i, '')).join(', ')}`;
}
