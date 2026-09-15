'use client';

import React from 'react';
import {
  FolderGit2,
  Wrench,
  GraduationCap,
  Briefcase,
  Award,
  Mail,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { Database } from '@/lib/supabase/types';

interface StudioDashboardProps {
  onNavigateTab: (tab: string) => void;
  unreadMessagesCount: number;
  recentMessages: Database['public']['Tables']['contact_messages']['Row'][];
}

export function StudioDashboard({ onNavigateTab, unreadMessagesCount, recentMessages }: StudioDashboardProps) {
  const { profile, projects, skills, education, experiences, certifications, resumeUrl, fromDatabase } = usePortfolio();

  const stats = [
    {
      title: 'Projects',
      count: projects.length,
      icon: FolderGit2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      tab: 'projects',
    },
    {
      title: 'Skills & Tools',
      count: skills.length,
      icon: Wrench,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      tab: 'skills',
    },
    {
      title: 'Education',
      count: education.length,
      icon: GraduationCap,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      tab: 'education',
    },
    {
      title: 'Experience',
      count: experiences.length,
      icon: Briefcase,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      tab: 'experience',
    },
    {
      title: 'Certifications',
      count: certifications.length,
      icon: Award,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
      tab: 'certifications',
    },
    {
      title: 'Inbox Messages',
      count: unreadMessagesCount,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} new` : 'All read',
      icon: Mail,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      tab: 'messages',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="rounded-3xl border border-[#1F2937] bg-gradient-to-r from-[#111827] via-[#1E293B]/40 to-[#111827] p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#60A5FA]">
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Studio · Production Management</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Welcome back, {profile.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-xl">
              Manage your engineering portfolio live on Supabase. Updates published here automatically sync to the public site in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-[#1F2937] bg-[#0B132B]/80 px-3.5 py-2 flex items-center gap-2 text-xs font-mono">
              <span className={`h-2 w-2 rounded-full ${fromDatabase ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-[#CBD5E1]">
                {fromDatabase ? 'Supabase Live Connected' : 'Local Fallback Mode'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('resume')}
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>{resumeUrl ? 'Update Resume' : 'Upload Resume'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.title}
              type="button"
              onClick={() => onNavigateTab(s.tab)}
              className="flex flex-col items-start justify-between rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-5 text-left transition-all hover:border-[#60A5FA]/50 hover:bg-[#1E293B]/60 group cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className={`p-2.5 rounded-xl border ${s.border} ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#64748B] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-mono">{s.count}</p>
                <p className="text-xs text-[#94A3B8] mt-0.5">{s.title}</p>
                {s.badge && (
                  <span className="inline-block text-[10px] font-mono text-rose-400 mt-1">
                    {s.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2-Column: Quick Profile Overview & Recent Contact Inquiries */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Quick Profile Card */}
        <div className="lg:col-span-5 rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#60A5FA]">
                Public Profile Info
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('profile')}
                className="text-xs text-[#94A3B8] hover:text-white font-mono transition-colors"
              >
                Edit Details →
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#64748B] block">Headline</span>
                <p className="text-sm font-semibold text-white">{profile.title}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#64748B] block">Contact Email</span>
                <p className="text-xs font-mono text-[#CBD5E1]">{profile.email}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#64748B] block">Phone</span>
                <p className="text-xs font-mono text-[#CBD5E1]">{profile.phone}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#64748B] block">Location</span>
                <p className="text-xs text-[#CBD5E1]">{profile.location}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#64748B] block">Resume Document</span>
                <p className="text-xs text-[#CBD5E1] flex items-center gap-1.5 mt-0.5">
                  <FileText className="h-3.5 w-3.5 text-blue-400" />
                  {resumeUrl ? 'Active on Supabase Storage' : 'Not uploaded yet (Resume coming soon)'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1F2937] mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('profile')}
              className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] py-2.5 text-xs font-semibold text-white hover:bg-[#1E293B] transition-colors"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('media')}
              className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] py-2.5 text-xs font-semibold text-white hover:bg-[#1E293B] transition-colors"
            >
              Storage Media
            </button>
          </div>
        </div>

        {/* Right: Recent Inquiries */}
        <div className="lg:col-span-7 rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#60A5FA]" />
              <h3 className="text-sm font-semibold text-white">Recent Contact Inquiries</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('messages')}
              className="text-xs text-[#94A3B8] hover:text-white font-mono transition-colors"
            >
              View All Messages →
            </button>
          </div>

          <div className="mt-4 divide-y divide-[#1F2937]/60">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.slice(0, 4).map((msg) => (
                <div key={msg.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-white truncate">{msg.name}</p>
                      <span className="text-[10px] text-[#64748B]">·</span>
                      <p className="text-[11px] text-[#94A3B8] font-mono truncate">{msg.email}</p>
                    </div>
                    <p className="text-xs text-[#CBD5E1] mt-0.5 line-clamp-1">{msg.subject || msg.message}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                        msg.status === 'new'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : msg.status === 'read'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#64748B]">
                No messages received yet. When visitors submit inquiries on your portfolio contact form, they will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
