'use client';

import React from 'react';
import {
  ArrowRight,
  Mail,
  User,
  Zap,
  MapPin,
  Cpu,
  GraduationCap,
  Award,
} from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { TextLoop } from '@/components/core/text-loop';
import { Spotlight } from '@/components/core/spotlight';
import { useLanguage } from '@/src/i18n';
import { profileData } from '@/lib/data/portfolio-data';

export interface HeroProps {
  onNavigate?: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { t, language } = useLanguage();

  return (
    <div id="hero" className="relative w-full px-4 sm:px-8 pt-8 sm:pt-12 pb-12 flex flex-col justify-start">
      {/* Background Spotlight */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.18)_0%,rgba(192,132,252,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={560}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] w-full flex flex-col items-start text-left">
        {/* Academic Status Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1F2937] bg-[#111827]/80 px-3.5 py-1.5 text-xs text-[#CBD5E1] shadow-sm backdrop-blur-md mb-4 sm:mb-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#A5B4FC]">
            {t('hero.statusBadge', 'B.Tech · EEE (2023–2027) · Hyderabad, India')}
          </span>
        </div>

        {/* Heading with TextEffect */}
        <div className="mt-1 max-w-4xl">
          <div className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#60A5FA] font-semibold mb-2">
            <TextEffect key={`tag-${language}-${t('hero.roleTag', 'Electrical & Electronics Engineering')}`} per="word" delay={0.05}>
              {t('hero.roleTag', 'Electrical & Electronics Engineering')}
            </TextEffect>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#E0E7FF] leading-[1.08]">
            <span className="text-[#CBD5E1] font-light">
              {t('hero.greeting', "Hello, I'm")}{' '}
            </span>
            <br className="hidden sm:inline" />
            <span className="font-normal text-white">
              Vasantha{' '}
            </span>
            <span className="instrument italic font-normal text-[#60A5FA]">
              Perala.
            </span>
          </h1>
        </div>

        {/* Dynamic Text Loop for genuine interests */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 text-base sm:text-xl text-[#CBD5E1] font-light">
          <span className="text-[#A5B4FC]/90 font-mono text-xs uppercase tracking-wider">
            {t('hero.specializingIn', 'Specializing in')}
          </span>
          <span className="text-[#334155]">/</span>
          <div className="inline-flex items-center font-medium text-[#F472B6]">
            <TextLoop interval={2800}>
              {profileData.interests.map((interest) => (
                <span key={interest} className="inline-flex items-center gap-1.5 font-semibold text-[#F472B6]">
                  <Zap className="h-4 w-4 text-[#FDE68A]" />
                  {interest}
                </span>
              ))}
            </TextLoop>
          </div>
        </div>

        {/* Hero Bio Details - 2 lines on desktop */}
        <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-[#CBD5E1]">
          {t('hero.bio', profileData.heroBio)}
        </p>

        {/* Action CTAs */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5">
          {/* Primary CTA with full 360-degree luminous glow */}
          <button
            id="hero-explore-projects-btn"
            onClick={() => onNavigate?.('projects')}
            className="group relative flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white border border-[#60A5FA]/80 shadow-[0_0_24px_rgba(37,99,235,0.6)] ring-1 ring-[#93C5FD]/30 transition-all hover:bg-[#1D4ED8] hover:border-[#BFDBFE] hover:shadow-[0_0_32px_rgba(59,130,246,0.85)] cursor-pointer"
          >
            <span>{t('hero.ctaWork', 'Explore My Work')}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Secondary CTA: Get In Touch */}
          <button
            id="hero-connect-btn"
            onClick={() => onNavigate?.('contact')}
            className="flex items-center gap-2 rounded-xl border border-[#1F2937] bg-[#111827]/80 px-5 py-3 text-sm font-medium text-[#E0E7FF] transition-all hover:border-[#60A5FA]/60 hover:bg-[#1F2937] cursor-pointer"
          >
            <Mail className="h-4 w-4 text-[#60A5FA]" />
            <span>{t('hero.ctaContact', "Let's Connect")}</span>
          </button>

          {/* Tertiary CTA: About Me */}
          <button
            id="hero-about-btn"
            onClick={() => onNavigate?.('about')}
            className="flex items-center gap-2 rounded-xl border border-[#1F2937]/60 bg-transparent px-4 py-3 text-sm font-medium text-[#CBD5E1] transition-all hover:text-white hover:border-[#334155] cursor-pointer"
          >
            <User className="h-4 w-4 text-[#C084FC]" />
            <span>{t('hero.ctaAbout', 'About Me')}</span>
          </button>
        </div>

        {/* Highlighted Engineering Details Cards */}
        <div className="mt-8 sm:mt-10 w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#1F2937] pt-6 sm:pt-8">
          {/* Card 1: College & Degree */}
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-[#60A5FA] mb-2">
              <GraduationCap className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A5B4FC]">
                {t('hero.card1.title', 'Degree & College')}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">
              {t('hero.card1.val', 'B.Tech EEE (2023–2027)')}
            </p>
            <p className="text-xs text-[#CBD5E1] mt-0.5">
              {t('hero.card1.sub', 'Malla Reddy Engineering College for Women')}
            </p>
          </div>

          {/* Card 2: Academic Standing */}
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Award className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A5B4FC]">
                {t('hero.card2.title', 'Academic Standing')}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-sm font-bold text-white font-mono">
                {t('hero.card2.val', '8.08 CGPA')}
              </p>
              <span className="text-[10px] text-emerald-400 font-mono">
                {t('hero.card2.tag', 'Current Degree')}
              </span>
            </div>
            <p className="text-xs text-[#CBD5E1] mt-0.5">
              {t('hero.card2.sub', 'Intermediate: 84.7% · SSC: 9.8 CGPA')}
            </p>
          </div>

          {/* Card 3: Core Simulation & Languages */}
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-[#F472B6] mb-2">
              <Cpu className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A5B4FC]">
                {t('hero.card3.title', 'Core Competencies')}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">
              {t('hero.card3.val', 'MATLAB · Simulink · C · Python')}
            </p>
            <p className="text-xs text-[#CBD5E1] mt-0.5">
              {t('hero.card3.sub', 'Power Systems, STATCOM, Embedded IoT')}
            </p>
          </div>

          {/* Card 4: Location & Status */}
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-[#FDE68A] mb-2">
              <MapPin className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A5B4FC]">
                {t('hero.card4.title', 'Location & Availability')}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">
              {t('hero.card4.val', 'Hyderabad, India')}
            </p>
            <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t('hero.card4.sub', 'Open for Internships & Projects')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
