'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Wrench,
  Award,
  Trophy,
  Languages,
  Mail,
  Image as ImageIcon,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
  ExternalLink,
  Shield,
  Menu,
  X,
  RefreshCw,
} from 'lucide-react';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { fetchAdminContactMessages } from '@/lib/supabase/api';
import { usePortfolio } from '@/lib/portfolio-context';
import type { Database } from '@/lib/supabase/types';

import { StudioAuth } from './StudioAuth';
import { StudioDashboard } from './StudioDashboard';
import { StudioProfile } from './StudioProfile';
import { StudioEducation } from './StudioEducation';
import { StudioExperience } from './StudioExperience';
import { StudioProjects } from './StudioProjects';
import { StudioSkills } from './StudioSkills';
import { StudioCertifications } from './StudioCertifications';
import { StudioAchievements } from './StudioAchievements';
import { StudioLanguages } from './StudioLanguages';
import { StudioMessages } from './StudioMessages';
import { StudioMedia } from './StudioMedia';
import { StudioResume } from './StudioResume';
import { StudioSettings } from './StudioSettings';

type StudioTab =
  | 'dashboard'
  | 'profile'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'achievements'
  | 'languages'
  | 'messages'
  | 'media'
  | 'resume'
  | 'settings';

interface StudioAppProps {
  onExit: () => void;
}

export function StudioApp({ onExit }: StudioAppProps) {
  const { refreshData } = usePortfolio();
  const [activeTab, setActiveTab] = useState<StudioTab>('dashboard');
  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Database['public']['Tables']['contact_messages']['Row'][]>([]);

  // Load messages
  const loadMessages = useCallback(async () => {
    try {
      const res = await fetchAdminContactMessages();
      if (res.data) {
        setMessages(res.data);
      }
    } catch {
      // Fallback
    }
  }, []);

  // Monitor Supabase Auth
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      setCheckingAuth(false);
      return;
    }

    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCheckingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadMessages();
    }
  }, [session, loadMessages]);

  const handleLogout = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    setSession(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#0B132B] flex items-center justify-center text-white font-mono text-sm gap-3">
        <RefreshCw className="h-5 w-5 animate-spin text-[#60A5FA]" />
        <span>Verifying Studio Authentication...</span>
      </div>
    );
  }

  // If no active session, show Supabase Auth Login / Register
  if (!session) {
    return <StudioAuth onSuccess={() => loadMessages()} onExit={onExit} />;
  }

  const unreadCount = messages.filter((m) => m.status === 'new').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'languages', label: 'Languages', icon: Languages },
    {
      id: 'messages',
      label: 'Messages',
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-screen max-h-screen w-full bg-[#0B132B] text-[#E0E7FF] font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between border-b border-[#1F2937] bg-[#111827] px-4 py-3 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-bold text-white text-sm">Studio CMS</span>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="text-xs font-mono text-[#60A5FA] flex items-center gap-1"
        >
          <span>View Site</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[#1F2937] bg-[#111827] p-4 flex flex-col justify-between transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:w-64 shrink-0 md:h-screen overflow-y-auto custom-scrollbar`}
      >
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#1F2937] mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-none">Vasantha Studio</h1>
                <span className="text-[10px] font-mono text-[#60A5FA]">Supabase Production</span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as StudioTab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-white font-semibold'
                      : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#1F2937] space-y-2 mt-6">
          <div className="px-2 py-1">
            <p className="text-[10px] font-mono uppercase text-[#64748B]">Signed in as</p>
            <p className="text-xs font-mono text-[#CBD5E1] truncate" title={session.user?.email}>
              {session.user?.email || 'admin'}
            </p>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-[#1F2937] bg-[#0B132B] text-xs font-medium text-[#CBD5E1] hover:text-white hover:border-[#60A5FA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#60A5FA]" />
            <span>Public Portfolio</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 h-[calc(100vh-53px)] md:h-screen p-4 sm:p-8 lg:p-10 pb-32 md:pb-28 overflow-y-auto custom-scrollbar scroll-smooth">
        {activeTab === 'dashboard' && (
          <StudioDashboard
            onNavigateTab={(tab) => setActiveTab(tab as StudioTab)}
            unreadMessagesCount={unreadCount}
            recentMessages={messages}
          />
        )}
        {activeTab === 'profile' && <StudioProfile />}
        {activeTab === 'education' && <StudioEducation />}
        {activeTab === 'experience' && <StudioExperience />}
        {activeTab === 'projects' && <StudioProjects />}
        {activeTab === 'skills' && <StudioSkills />}
        {activeTab === 'certifications' && <StudioCertifications />}
        {activeTab === 'achievements' && <StudioAchievements />}
        {activeTab === 'languages' && <StudioLanguages />}
        {activeTab === 'messages' && (
          <StudioMessages messages={messages} onRefresh={loadMessages} />
        )}
        {activeTab === 'media' && <StudioMedia />}
        {activeTab === 'resume' && <StudioResume />}
        {activeTab === 'settings' && <StudioSettings />}
      </main>
    </div>
  );
}
