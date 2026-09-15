'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  profileData,
  educationList,
  experienceList,
  projectsList,
  skillsList,
  certificationsList,
  achievementsList,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillItem,
  CertificationItem,
  AchievementItem,
} from '@/lib/data/portfolio-data';

export interface PortfolioContextValue {
  profile: typeof profileData;
  education: EducationItem[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [profile] = useState(profileData);
  const [education] = useState<EducationItem[]>(educationList);
  const [experiences] = useState<ExperienceItem[]>(experienceList);
  const [projects] = useState<ProjectItem[]>(projectsList);
  const [skills] = useState<SkillItem[]>(skillsList);
  const [certifications] = useState<CertificationItem[]>(certificationsList);
  const [achievements] = useState<AchievementItem[]>(achievementsList);

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
        loading: false,
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
