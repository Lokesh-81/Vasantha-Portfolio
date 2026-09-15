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
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fromDatabase, setFromDatabase] = useState<boolean>(false);

  const refreshData = useCallback(async () => {
    try {
      const data = await fetchPortfolioData();
      setProfile(data.profile);
      setEducation(data.education);
      setExperiences(data.experiences);
      setProjects(data.projects);
      setSkills(data.skills);
      setCertifications(data.certifications);
      setAchievements(data.achievements);
      setLanguages(data.languages);
      setResumeUrl(data.resumeUrl);
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
