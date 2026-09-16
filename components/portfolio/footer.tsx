'use client';

import React from 'react';
import { Spotlight } from '@/components/core/spotlight';
import { Clock } from '@/components/core/sliding-number';
import { profileData } from '@/lib/data/portfolio-data';

export interface FooterProps {
  onNavigate?: (section: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative mt-auto border-t border-[#1F2937] bg-[#0B132B]/95 px-4 sm:px-8 py-8 backdrop-blur-md overflow-hidden">
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.15)_0%,rgba(192,132,252,0.08)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={400}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Exact required format: VASANTHA PERALA · HYDERABAD, INDIA · © 2026 Vasantha Perala */}
        <div className="flex flex-col items-center justify-between gap-4 pb-6 sm:flex-row text-xs text-[#64748B]">
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[#E0E7FF] text-center sm:text-left">
            <span className="font-bold tracking-wider uppercase">VASANTHA PERALA</span>
            <span className="text-[#334155]">·</span>
            <span className="text-xs text-[#CBD5E1] tracking-wider uppercase">HYDERABAD, INDIA</span>
            <span className="text-[#334155]">·</span>
            <span className="text-[11px] text-[#A5B4FC]/80 font-normal">
              © {new Date().getFullYear()} Vasantha Perala
            </span>
          </div>

          {/* Social & Contact links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#CBD5E1]">
            <a
              href={profileData.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#60A5FA] transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-[#334155]">·</span>
            <a
              href={`mailto:${profileData.email}`}
              className="hover:text-[#60A5FA] transition-colors"
            >
              Email (peralavasantha08@gmail.com)
            </a>
            <span className="text-[#334155]">·</span>
            <a
              href={profileData.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Live IST Clock as the ABSOLUTE FINAL, BOTTOM-MOST ELEMENT below copyright row */}
        <div className="border-t border-[#1F2937]/50 pt-5 flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#1F2937] bg-[#111827]/80 px-4 py-1.5 shadow-sm">
            <span className="font-mono text-[11px] font-semibold text-[#60A5FA] tracking-wider uppercase">
              IST Live Clock
            </span>
            <span className="text-[#334155]">·</span>
            <Clock />
          </div>
        </div>
      </div>
    </footer>
  );
}
