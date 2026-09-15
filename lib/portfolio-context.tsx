'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  profileData as initialProfile,
  educationList as initialEducation,
  experienceList as initialExperience,
  projectsList as initialProjects,
  skillsList as initialSkills,
  certificationsList as initialCertifications,
  achievementsList as initialAchievements,
  languagesList as initialLanguages,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillItem,
  CertificationItem,
  AchievementItem,
  LanguageSkill,
} from '@/lib/data/portfolio-data';
import { fetchPortfolioData } from './supabase/api';

export interface PortfolioContextValue {
  profile: typeof initialProfile;
  education: EducationItem[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: LanguageSkill[];
  resumeUrl: string | null;
  loading: boolean;
  fromDatabase: boolean;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState(initialProfile);
  const [education, setEducation] = useState<EducationItem[]>(initialEducation);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperience);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [certifications, setCertifications] = useState<CertificationItem[]>(initialCertifications);
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialAchievements);
  const [languages, setLanguages] = useState<LanguageSkill[]>(initialLanguages);
  const [resumeUrl, setResumeUrl] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vasantha_resume_url') || null;
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [fromDatabase, setFromDatabase] = useState<boolean>(false);

  // Initialize cached overrides from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedResume = localStorage.getItem('vasantha_resume_url');
      if (cachedResume && !resumeUrl) {
        setResumeUrl(cachedResume);
      }
      try {
        const cachedProfile = localStorage.getItem('vasantha_profile_override');
        if (cachedProfile) {
          const parsed = JSON.parse(cachedProfile);
          setProfile((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        // ignore JSON parse error
      }
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const data = await fetchPortfolioData();
      
      // Merge with any local overrides for photo or resume
      let effectiveProfile = data.profile;
      let effectiveResumeUrl = data.resumeUrl;

      if (typeof window !== 'undefined') {
        const localResume = localStorage.getItem('vasantha_resume_url');
        if (!effectiveResumeUrl && localResume) {
          effectiveResumeUrl = localResume;
        } else if (effectiveResumeUrl) {
          localStorage.setItem('vasantha_resume_url', effectiveResumeUrl);
        }

        const localProfile = localStorage.getItem('vasantha_profile_override');
        if (localProfile) {
          try {
            const parsed = JSON.parse(localProfile);
            effectiveProfile = { ...effectiveProfile, ...parsed };
          } catch (e) {
            // ignore
          }
        }
      }

      setProfile(effectiveProfile);
      setEducation(data.education);
      setExperiences(data.experiences);
      setProjects(data.projects);
      setSkills(data.skills);
      setCertifications(data.certifications);
      setAchievements(data.achievements);
      setLanguages(data.languages);
      setResumeUrl(effectiveResumeUrl);
      setFromDatabase(data.fromDatabase);
    } catch (error) {
      console.warn('Error loading portfolio context:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        education,
        experiences,
        projects,
        skills,
        certifications,
        achievements,
        languages,
        resumeUrl,
        loading,
        fromDatabase,
        refreshData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioContextValue {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
