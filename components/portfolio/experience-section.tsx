'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  BadgeCheck,
  Calendar,
  MapPin,
  CheckCircle2,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { useLanguage } from '@/src/i18n';
import {
  experienceList,
  educationList,
  certificationsList,
  achievementsList,
} from '@/lib/data/portfolio-data';
import { usePortfolio } from '@/lib/portfolio-context';

export function ExperienceSection() {
  const { t, language } = useLanguage();
  const {
    experiences: contextExperiences,
    education: contextEducation,
    certifications: contextCertifications,
    achievements: contextAchievements,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'certifications' | 'achievements'>('experience');

  const activeExperiences = contextExperiences && contextExperiences.length > 0 ? contextExperiences : experienceList;
  const activeEducation = contextEducation && contextEducation.length > 0 ? contextEducation : educationList;
  const activeCertifications = contextCertifications && contextCertifications.length > 0 ? contextCertifications : certificationsList;
  const activeAchievements = contextAchievements && contextAchievements.length > 0 ? contextAchievements : achievementsList;

  return (
    <section id="experience" className="relative w-full px-4 sm:px-8 py-16 sm:py-24 border-t border-[#1F2937]/80">
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.18)_0%,rgba(192,132,252,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={500}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-8 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('experience.tag', 'ACADEMIC & INDUSTRIAL TRACK RECORD')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('experience.title', 'Experience &')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('experience.titleAccent', 'Education.')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <p>
              {t(
                'experience.subtitle',
                'Industrial training, university education timeline, verified certifications, and technical symposium awards.'
              )}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-[#1F2937] pb-4">
          <button
            id="tab-experience"
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'experience'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'border border-[#1F2937] bg-[#111827]/70 text-[#CBD5E1] hover:border-[#60A5FA]/40 hover:text-white'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Industrial Experience</span>
          </button>

          <button
            id="tab-education"
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'education'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'border border-[#1F2937] bg-[#111827]/70 text-[#CBD5E1] hover:border-[#60A5FA]/40 hover:text-white'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Education Timeline</span>
          </button>

          <button
            id="tab-certifications"
            onClick={() => setActiveTab('certifications')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'certifications'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'border border-[#1F2937] bg-[#111827]/70 text-[#CBD5E1] hover:border-[#60A5FA]/40 hover:text-white'
            }`}
          >
            <BadgeCheck className="h-3.5 w-3.5" />
            <span>Certifications (6)</span>
          </button>

          <button
            id="tab-achievements"
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'border border-[#1F2937] bg-[#111827]/70 text-[#CBD5E1] hover:border-[#60A5FA]/40 hover:text-white'
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Achievements</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === 'experience' && (
              <motion.div
                key="tab-content-experience"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeExperiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative rounded-3xl border border-[#1F2937] bg-[#111827]/85 p-6 sm:p-8 shadow-xl backdrop-blur-xl"
                  >
                    <div className="flex flex-col justify-between gap-3 border-b border-[#1F2937] pb-5 sm:flex-row sm:items-center">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-[#60A5FA] font-semibold">
                          {exp.company}
                        </span>
                        <h3 className="mt-0.5 text-2xl font-bold text-white">
                          {exp.role}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#CBD5E1]">
                        <span className="flex items-center gap-1 font-mono rounded-full bg-[#0B132B] border border-[#1F2937] px-3 py-1 text-[#A5B4FC]">
                          <Calendar className="h-3 w-3 text-[#60A5FA]" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-[#0B132B] border border-[#1F2937] px-3 py-1 text-[#CBD5E1]">
                          <MapPin className="h-3 w-3 text-[#64748B]" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#CBD5E1]">
                      {exp.description}
                    </p>

                    <div className="mt-6 space-y-2.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A5B4FC]">
                        Key Highlights & Outcomes
                      </span>
                      <ul className="space-y-2 text-xs sm:text-sm text-[#CBD5E1]">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#60A5FA]" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-1.5 border-t border-[#1F2937] pt-4">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg border border-[#1F2937] bg-[#0B132B] px-2.5 py-1 font-mono text-xs text-[#E0E7FF]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'education' && (
              <motion.div
                key="tab-content-education"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeEducation.map((edu) => (
                  <div
                    key={edu.id}
                    className="relative rounded-3xl border border-[#1F2937] bg-[#111827]/85 p-6 sm:p-8 shadow-xl backdrop-blur-xl"
                  >
                    <div className="flex flex-col justify-between gap-3 border-b border-[#1F2937] pb-5 sm:flex-row sm:items-center">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-[#A5B4FC] font-semibold">
                          {edu.period}
                        </span>
                        <h3 className="mt-0.5 text-xl sm:text-2xl font-bold text-white">
                          {edu.institution}
                        </h3>
                        <p className="text-sm font-medium text-[#60A5FA] mt-0.5">
                          {edu.degree}
                        </p>
                      </div>

                      <div className="self-start sm:self-center">
                        <div className="rounded-2xl border border-[#2563EB]/40 bg-[#2563EB]/20 px-4 py-2 text-center">
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-[#A5B4FC]">
                            {edu.scoreLabel}
                          </span>
                          <span className="font-mono text-lg font-bold text-white">
                            {edu.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
                      {edu.description}
                    </p>

                    {edu.highlights && edu.highlights.length > 0 && (
                      <div className="mt-4 space-y-1.5 border-t border-[#1F2937] pt-3">
                        {edu.highlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2 text-xs text-[#CBD5E1]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#60A5FA]" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'certifications' && (
              <motion.div
                key="tab-content-certifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {activeCertifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="group rounded-2xl border border-[#1F2937] bg-[#111827]/85 p-5 shadow-lg backdrop-blur-xl transition-all hover:border-[#60A5FA]/60 hover:bg-[#111827]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#1F2937] bg-[#0B132B]">
                        <BadgeCheck className="h-5 w-5 text-[#60A5FA]" />
                      </div>
                      <span className="rounded-md border border-[#1F2937] bg-[#0B132B] px-2 py-0.5 font-mono text-[10px] text-[#A5B4FC]">
                        Verified Credential
                      </span>
                    </div>

                    <h4 className="mt-4 text-base font-bold text-white group-hover:text-[#60A5FA] transition-colors">
                      {cert.title}
                    </h4>
                    <p className="mt-1 text-xs font-medium text-[#CBD5E1]">
                      Issuer: <span className="text-[#60A5FA]">{cert.issuer}</span>
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="tab-content-achievements"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {activeAchievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="group rounded-2xl border border-[#1F2937] bg-[#111827]/85 p-6 shadow-lg backdrop-blur-xl transition-all hover:border-[#FDE68A]/60"
                  >
                    <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1F2937] bg-[#0B132B] text-[#FDE68A]">
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-mono text-xs uppercase tracking-wider text-[#FDE68A]">
                            {ach.award}
                          </span>
                          <h4 className="text-lg font-bold text-white">
                            {ach.title}
                          </h4>
                        </div>
                      </div>
                      {ach.year && (
                        <span className="rounded-md border border-[#1F2937] bg-[#0B132B] px-2.5 py-1 font-mono text-xs text-[#CBD5E1]">
                          {ach.year}
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <span className="text-xs text-[#A5B4FC] font-mono">
                        Event / Venue:
                      </span>
                      <p className="text-sm font-medium text-[#E0E7FF] mt-0.5">
                        {ach.event}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
