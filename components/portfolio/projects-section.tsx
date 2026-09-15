'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Cpu,
  Zap,
  Activity,
  Radio,
  Layers,
  ChevronRight,
  ShieldCheck,
  Thermometer,
} from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { useLanguage } from '@/src/i18n';
import { projectsList, ProjectItem } from '@/lib/data/portfolio-data';

export function ProjectsSection() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Power Systems & Grid Stability', 'Embedded Systems & IoT'];

  const filteredProjects = projectsList.filter((project) => {
    if (selectedCategory === 'All') return true;
    return project.category === selectedCategory;
  });

  return (
    <section id="projects" className="relative w-full px-4 sm:px-8 py-16 sm:py-24 border-t border-[#1F2937]/80">
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.18)_0%,rgba(192,132,252,0.1)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={480}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-8 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}-${t('work.tag', 'TECHNICAL PROJECTS & RESEARCH')}`} per="word" delay={0.05}>
                {t('work.tag', 'TECHNICAL PROJECTS & RESEARCH')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}-${t('work.title', 'Engineering')}`} per="word" delay={0.15}>
                {t('work.title', 'Engineering')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('work.titleAccent', 'projects.')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <p>
              {t(
                'work.subtitle',
                'Academic projects and simulations focusing on power grid stability, renewable integration, and embedded battery protection.'
              )}
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#64748B] mr-2">
            {t('work.filter', 'Filter:')}
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                  : 'border border-[#1F2937] bg-[#111827]/70 text-[#CBD5E1] hover:border-[#60A5FA]/40 hover:text-white'
              }`}
            >
              {cat === 'All'
                ? t('work.filter.all', 'All Projects')
                : cat === 'Power Systems'
                ? t('work.filter.power', 'Power Systems')
                : cat === 'Embedded & IoT'
                ? t('work.filter.iot', 'Embedded & IoT')
                : cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-[#1F2937] bg-[#111827]/85 p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-[#60A5FA]/60 hover:shadow-2xl"
            >
              <div>
                {/* Top Row: Number & Status */}
                <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#60A5FA] bg-[#2563EB]/20 border border-[#2563EB]/40 px-2.5 py-0.5 rounded-lg">
                      PROJECT {project.number}
                    </span>
                    <span className="text-[11px] font-mono text-[#A5B4FC]">
                      {project.category === 'Power Systems' ? t('work.filter.power', 'Power Systems') : t('work.filter.iot', 'Embedded & IoT')}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {project.status === 'Completed' ? t('work.status.completed', 'Completed') : project.status}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#60A5FA] transition-colors">
                  {project.name}
                </h3>

                {/* Tagline */}
                <p className="mt-2 text-xs font-medium text-[#A5B4FC] tracking-wide">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
                  {project.description}
                </p>

                {/* Schematic / Visual Graphic Preview */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-[#1F2937] bg-[#0B132B]/90 p-4">
                  {project.graphicType === 'fidvr' ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                        <span className="flex items-center gap-1.5 text-[#60A5FA]">
                          <Activity className="h-3.5 w-3.5" />
                          MATLAB / Simulink FIDVR Voltage Response
                        </span>
                        <span className="text-emerald-400">PV-STATCOM Active</span>
                      </div>
                      {/* Stylized Voltage Wave Curve */}
                      <div className="relative h-28 w-full bg-[#111827]/60 rounded-xl p-2 flex items-center justify-center">
                        <svg className="h-full w-full overflow-visible" viewBox="0 0 300 80">
                          {/* Grid Lines */}
                          <line x1="0" y1="20" x2="300" y2="20" stroke="#1F2937" strokeDasharray="3,3" />
                          <line x1="0" y1="40" x2="300" y2="40" stroke="#1F2937" strokeDasharray="3,3" />
                          <line x1="0" y1="60" x2="300" y2="60" stroke="#1F2937" strokeDasharray="3,3" />

                          {/* Uncompensated Delayed Curve (Red/Muted) */}
                          <path
                            d="M 10 20 L 70 20 L 80 68 L 160 65 L 220 40 L 290 20"
                            fill="none"
                            stroke="#FB7185"
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                          />
                          {/* Compensated PV-STATCOM Fast Recovery Curve (Blue/Cyan) */}
                          <path
                            d="M 10 20 L 70 20 L 80 68 L 100 45 L 130 25 L 290 20"
                            fill="none"
                            stroke="#60A5FA"
                            strokeWidth="2.5"
                          />
                          {/* Fault Indicator Point */}
                          <circle cx="80" cy="68" r="4" fill="#F43F5E" />
                          <circle cx="100" cy="45" r="3" fill="#60A5FA" />
                        </svg>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#CBD5E1]">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
                          With PV-STATCOM (Accelerated Recovery)
                        </span>
                        <span className="flex items-center gap-1 text-[#FB7185]">
                          <span className="h-2 w-2 rounded-full bg-[#FB7185]" />
                          Uncompensated (Delayed)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                        <span className="flex items-center gap-1.5 text-[#F472B6]">
                          <Cpu className="h-3.5 w-3.5" />
                          Smart Charge Guardian Architecture
                        </span>
                        <span className="text-emerald-400">Relay Protected</span>
                      </div>
                      {/* Embedded Flow Graphic */}
                      <div className="grid grid-cols-3 gap-2 py-3">
                        <div className="rounded-xl border border-[#1F2937] bg-[#111827] p-2.5 text-center">
                          <Thermometer className="h-4 w-4 mx-auto text-[#FB7185] mb-1" />
                          <span className="text-[10px] font-mono text-[#E0E7FF] block">Thermal Sensor</span>
                          <span className="text-[9px] text-[#A5B4FC]">Continuous Scan</span>
                        </div>
                        <div className="rounded-xl border border-[#1F2937] bg-[#111827] p-2.5 text-center">
                          <ShieldCheck className="h-4 w-4 mx-auto text-emerald-400 mb-1" />
                          <span className="text-[10px] font-mono text-[#E0E7FF] block">Auto-Cutoff</span>
                          <span className="text-[9px] text-emerald-300">Relay Switch</span>
                        </div>
                        <div className="rounded-xl border border-[#1F2937] bg-[#111827] p-2.5 text-center">
                          <Radio className="h-4 w-4 mx-auto text-[#60A5FA] mb-1" />
                          <span className="text-[10px] font-mono text-[#E0E7FF] block">Bluetooth</span>
                          <span className="text-[9px] text-[#A5B4FC]">Instant Alerts</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Highlights & Implementation List */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A5B4FC]">
                    {t('work.keyContributions', 'Key Highlights & Implementation')}
                  </span>
                  <ul className="space-y-2 text-xs text-[#CBD5E1]">
                    {project.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#60A5FA]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technologies List */}
              <div className="mt-6 border-t border-[#1F2937] pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-[#1F2937] bg-[#0B132B] px-2.5 py-1 font-mono text-[11px] text-[#CBD5E1]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
