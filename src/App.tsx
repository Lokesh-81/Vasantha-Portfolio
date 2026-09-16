'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioProvider } from '@/lib/portfolio-context';
import { LanguageProvider } from '@/src/i18n';
import { PortfolioDock } from '@/components/portfolio/portfolio-dock';
import { Hero } from '@/components/portfolio/hero';
import { AboutSection } from '@/components/portfolio/about-section';
import { ProjectsSection } from '@/components/portfolio/projects-section';
import { SkillsSection } from '@/components/portfolio/skills-section';
import { ExperienceSection } from '@/components/portfolio/experience-section';
import { ContactSection } from '@/components/portfolio/contact-section';
import { Footer } from '@/components/portfolio/footer';
import { Spotlight } from '@/components/core/spotlight';
import { Clock } from '@/components/core/sliding-number';
import { StudioApp } from '@/components/studio/StudioApp';

export type SectionId = 'home' | 'about' | 'projects' | 'work' | 'skills' | 'experience' | 'contact' | 'studio';

function PortfolioContent() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  // Support direct URL path (/studio) and hash loading on mount, hashchange, and popstate
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleLocation = () => {
        const hash = window.location.hash.replace('#', '') as SectionId;
        const pathname = window.location.pathname.replace(/\/+$/, '');
        if (pathname === '/studio' || pathname.startsWith('/studio') || hash === 'studio') {
          setActiveSection('studio');
          return;
        }
        if (['home', 'about', 'projects', 'work', 'skills', 'experience', 'contact'].includes(hash)) {
          setActiveSection(hash === 'work' ? 'projects' : hash);
        } else {
          setActiveSection('home');
        }
      };
      handleLocation();
      window.addEventListener('hashchange', handleLocation);
      window.addEventListener('popstate', handleLocation);
      return () => {
        window.removeEventListener('hashchange', handleLocation);
        window.removeEventListener('popstate', handleLocation);
      };
    }
  }, []);

  const handleExitStudio = () => {
    setActiveSection('home');
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/studio')) {
        window.history.pushState(null, '', '/');
      } else {
        window.history.replaceState(null, '', '#home');
      }
    }
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'studio') {
      setActiveSection('studio');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/studio');
      }
      return;
    }
    const validSection = (sectionId === 'work' ? 'projects' : sectionId) as SectionId;
    setActiveSection(validSection);
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/studio')) {
        window.history.pushState(null, '', `/#${validSection}`);
      } else {
        window.history.replaceState(null, '', `#${validSection}`);
      }
    }
  };

  // If in Studio mode, render the Admin Studio interface directly
  if (activeSection === 'studio') {
    return <StudioApp onExit={handleExitStudio} />;
  }

  // Determine current active section for dock indicator
  const dockActiveSection = activeSection === 'work' ? 'projects' : activeSection;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0B132B] text-[#E0E7FF] selection:bg-[#F472B6]/30 selection:text-[#FFF1F2] flex flex-col font-sans">
      {/* Global Mouse-Following Spotlight across whole portfolio background */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.14)_0%,rgba(192,132,252,0.08)_40%,transparent_70%)] blur-3xl pointer-events-none"
        size={680}
      />

      {/* Global Animated Floating Dock Navbar */}
      <PortfolioDock activeSection={dockActiveSection} onSelectSection={handleNavigate} />

      {/* Prominent Live IST Clock Pill - Top Right */}
      <div
        className="fixed top-3 sm:top-5 right-3 sm:right-6 z-40 flex items-center gap-2 rounded-full border border-[#1F2937]/90 bg-[#0B132B]/90 px-3 sm:px-3.5 py-1.5 backdrop-blur-xl shadow-lg"
        title="Live Indian Standard Time (IST)"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-mono text-[10px] sm:text-xs font-semibold text-[#60A5FA] tracking-wider uppercase">
          IST
        </span>
        <span className="text-[#334155]">·</span>
        <Clock className="text-[#E0E7FF] font-medium text-[11px] sm:text-xs" />
      </div>

      {/* Active Screen Viewport */}
      <main className="relative flex-1 pt-14 sm:pt-16 h-full w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar"
          >
            <div className="flex-1 w-full flex flex-col justify-start">
              {activeSection === 'home' && <Hero onNavigate={handleNavigate} />}
              {activeSection === 'about' && <AboutSection />}
              {(activeSection === 'projects' || activeSection === 'work') && (
                <ProjectsSection />
              )}
              {activeSection === 'skills' && <SkillsSection />}
              {activeSection === 'experience' && <ExperienceSection />}
              {activeSection === 'contact' && <ContactSection />}
            </div>

            {/* Global Footer with Live IST Clock & Links inside the active view */}
            <Footer onNavigate={handleNavigate} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <LanguageProvider>
        <PortfolioContent />
      </LanguageProvider>
    </PortfolioProvider>
  );
}
