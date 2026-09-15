'use client';

import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Layers,
  Terminal,
  Database,
  Globe,
  Sliders,
  Bot,
  Laptop,
  Users,
} from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { InfiniteSlider } from '@/components/core/infinite-slider';
import { Spotlight } from '@/components/core/spotlight';
import { useLanguage } from '@/src/i18n';
import {
  skillsList,
  skillCategories,
  marqueeTechnologies,
  SkillItem,
} from '@/lib/data/portfolio-data';

export function SkillsSection() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredSkills = skillsList.filter((skill) => {
    if (selectedCategory === 'All') return true;
    return skill.category === selectedCategory;
  });

  const getLevelBadge = (level: SkillItem['level']) => {
    switch (level) {
      case 'Core':
        return 'border-[#2563EB]/40 bg-[#2563EB]/20 text-[#60A5FA]';
      case 'Working Knowledge':
        return 'border-[#C084FC]/40 bg-[#C084FC]/20 text-[#C084FC]';
      case 'Familiar':
        return 'border-[#1F2937] bg-[#111827] text-[#CBD5E1]';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming Languages':
        return <Terminal className="h-3.5 w-3.5 text-[#60A5FA]" />;
      case 'Frontend / Web':
        return <Globe className="h-3.5 w-3.5 text-[#38BDF8]" />;
      case 'Database':
        return <Database className="h-3.5 w-3.5 text-[#2DD4BF]" />;
      case 'AI / Machine Learning':
        return <Bot className="h-3.5 w-3.5 text-[#C084FC]" />;
      case 'Tools & Software':
        return <Laptop className="h-3.5 w-3.5 text-[#FDE68A]" />;
      case 'Soft Skills':
        return <Users className="h-3.5 w-3.5 text-[#F472B6]" />;
      default:
        return <Cpu className="h-3.5 w-3.5 text-[#A5B4FC]" />;
    }
  };

  return (
    <section id="skills" className="relative w-full px-4 sm:px-8 py-16 sm:py-24 border-t border-[#1F2937]/80">
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.16)_0%,rgba(192,132,252,0.11)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={460}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-8 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('skills.tag', 'TECHNICAL PROFICIENCY')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('skills.title', 'Skills &')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('skills.titleAccent', 'Capabilities.')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <p>
              {t(
                'skills.subtitle',
                'Programming languages, simulation suites, engineering tools, and core competencies applied across academic and practical domains.'
              )}
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-[#64748B] mr-2">
            Filter:
          </span>
          {skillCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                  : 'border border-[#1F2937] bg-[#111827]/70 text-[#CBD5E1] hover:border-[#60A5FA]/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group flex flex-col justify-between rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-[#60A5FA]/60 hover:bg-[#111827]"
            >
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                  {getCategoryIcon(skill.category)}
                  <span className="truncate">{skill.category}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white group-hover:text-[#60A5FA] transition-colors">
                  {skill.name}
                </p>
              </div>
              <div className="mt-4">
                <span
                  className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-mono font-medium ${getLevelBadge(
                    skill.level
                  )}`}
                >
                  {skill.level}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite Toolset Marquee / Slider */}
        <div className="mt-14 pt-8 border-t border-[#1F2937]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A5B4FC]">
              Core Toolset Loop · Real-Time Continuous Sync
            </span>
            <span className="text-[11px] font-mono text-[#64748B]">
              Hover to pause
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#1F2937] bg-[#0B132B]/80 py-3">
            <InfiniteSlider gap={16} duration={25}>
              {marqueeTechnologies.map((item) => (
                <div
                  key={item.name}
                  className="flex shrink-0 items-center gap-2.5 rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-2 text-xs font-medium text-[#E0E7FF] shadow-xs"
                >
                  <Cpu className="h-3.5 w-3.5 text-[#60A5FA]" />
                  <span>{item.name}</span>
                  <span className="text-[10px] font-mono text-[#64748B] ml-1">
                    · {item.category}
                  </span>
                </div>
              ))}
            </InfiniteSlider>
          </div>
        </div>
      </div>
    </section>
  );
}
