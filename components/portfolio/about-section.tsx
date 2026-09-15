'use client';

import React from 'react';
import {
  MapPin,
  GraduationCap,
  Languages,
  Zap,
  Activity,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { useLanguage } from '@/src/i18n';
import { profileData } from '@/lib/data/portfolio-data';

export function AboutSection() {
  const { t, language } = useLanguage();

  const philosophies = [
    {
      id: 'power-systems',
      title: t('about.philosophy1.title', 'Power Systems Analysis'),
      icon: Activity,
      desc: t(
        'about.philosophy1.desc',
        'Modeling grid dynamics, transient faults, and reactive power compensation using MATLAB & Simulink simulation platforms.'
      ),
      tag: 'MATLAB · Simulink',
      color: 'text-[#60A5FA]',
      border: 'hover:border-[#60A5FA]/60',
    },
    {
      id: 'renewable-energy',
      title: t('about.philosophy2.title', 'Renewable Energy Integration'),
      icon: Zap,
      desc: t(
        'about.philosophy2.desc',
        'Evaluating solar PV-STATCOM controllers to reinforce transmission stability and prevent delayed voltage recovery.'
      ),
      tag: 'PV-STATCOM · Solar',
      color: 'text-[#FDE68A]',
      border: 'hover:border-[#FDE68A]/60',
    },
    {
      id: 'embedded-smart',
      title: t('about.philosophy3.title', 'Embedded & Smart Systems'),
      icon: Cpu,
      desc: t(
        'about.philosophy3.desc',
        'Designing sensor-driven hardware with temperature protection, automatic relay cutoff, and real-time Bluetooth notifications.'
      ),
      tag: 'IoT · Bluetooth · C',
      color: 'text-[#F472B6]',
      border: 'hover:border-[#F472B6]/60',
    },
  ];

  // Communication languages - names only
  const communicationLanguages = ['English', 'Telugu', 'Hindi', 'French'];

  return (
    <section id="about" className="relative w-full px-4 sm:px-8 py-16 sm:py-24 border-t border-[#1F2937]/80">
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.15)_0%,rgba(192,132,252,0.09)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={460}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header with TextEffect */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-8 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}-${t('about.tag', 'ABOUT ME')}`} per="word" delay={0.05}>
                {t('about.tag', 'ABOUT ME')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}-${t('about.title', 'Driven by')}`} per="word" delay={0.15}>
                {t('about.title', 'Driven by')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('about.titleAccent', 'engineering.')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <p>
              {t('about.subtitle', profileData.aboutBio)}
            </p>
          </div>
        </div>

        {/* 2-Column Overview Grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Academic & Technical Background Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#1F2937] text-white">
                <Layers className="h-5 w-5 text-[#60A5FA]" />
                <h3 className="text-lg font-semibold tracking-tight">
                  {t('about.philosophyTitle', 'Academic Focus & Engineering Philosophy')}
                </h3>
              </div>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#CBD5E1]">
                {t('about.subDescription', profileData.aboutSubDescription)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]/80">
                {t('about.subDescription2', 'During my academic journey at Malla Reddy Engineering College for Women, I have developed technical rigor in circuit analysis, dynamic power flow simulation, and embedded system design. My goal is to bridge classical electrical engineering fundamentals with modern computational software.')}
              </p>

              {/* Quick Info Grid */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#1F2937] pt-6 sm:grid-cols-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                    {t('about.location', 'Location')}
                  </span>
                  <p className="font-semibold text-xs text-[#E0E7FF] flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#60A5FA]" />
                    {t('about.locationVal', profileData.location)}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                    {t('about.education', 'Education')}
                  </span>
                  <p className="font-semibold text-xs text-[#E0E7FF] flex items-center gap-1">
                    <GraduationCap className="h-3 w-3 text-[#A5B4FC]" />
                    {t('hero.card1.val', 'B.Tech EEE (8.08)')}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                    {t('about.specialization', 'Specialization')}
                  </span>
                  <p className="font-semibold text-xs text-[#E0E7FF] flex items-center gap-1">
                    <Zap className="h-3 w-3 text-[#FDE68A]" />
                    {t('about.specializationValue', 'Power & Renewables')}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                    {t('about.languages', 'Languages')}
                  </span>
                  <p className="font-semibold text-xs text-[#E0E7FF] flex items-center gap-1">
                    <Languages className="h-3 w-3 text-[#F472B6]" />
                    {t('about.languagesVal', '4 Languages')}
                  </p>
                </div>
              </div>
            </div>

            {/* Languages Section - Just the Languages Only */}
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                <div className="flex items-center gap-2 text-white">
                  <Languages className="h-4 w-4 text-[#F472B6]" />
                  <h4 className="text-sm font-semibold tracking-wide">
                    {t('about.languages', 'Communication Languages')}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-[#64748B]">
                  {t('nav.language', 'Languages')}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {communicationLanguages.map((lang) => (
                  <div
                    key={lang}
                    className="rounded-xl border border-[#1F2937] bg-[#0B132B]/80 px-4 py-3 text-center"
                  >
                    <p className="text-sm font-semibold text-white">
                      {lang}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: 3 Core Pillars */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#64748B] mb-2">
              {t('hero.card3.title', 'Engineering Core Competencies')}
            </div>

            {philosophies.map((phil) => {
              const Icon = phil.icon;
              return (
                <div
                  key={phil.id}
                  className={`group relative rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl transition-all duration-300 ${phil.border} hover:bg-[#111827]`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#1F2937] bg-[#0B132B] group-hover:scale-105 transition-transform">
                        <Icon className={`h-5 w-5 ${phil.color}`} />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white group-hover:text-[#60A5FA] transition-colors">
                          {phil.title}
                        </h4>
                        <span className="font-mono text-[10px] text-[#A5B4FC]">
                          {phil.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
                    {phil.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
