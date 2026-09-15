'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Mail, Lock, LogIn, UserPlus, AlertCircle, ArrowLeft, CheckCircle2, Settings, Key, Link as LinkIcon } from 'lucide-react';
import { getSupabaseClient, isSupabaseConfigured, getSupabaseConfig, saveRuntimeSupabaseConfig } from '@/lib/supabase/client';

interface StudioAuthProps {
  onSuccess: () => void;
  onExit: () => void;
}

export function StudioAuth({ onSuccess, onExit }: StudioAuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick Connection Config modal/toggle for troubleshooting
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [configKey, setConfigKey] = useState('');
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  useEffect(() => {
    const current = getSupabaseConfig();
    setConfigUrl(current.url);
    setConfigKey(current.anonKey);
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveRuntimeSupabaseConfig(configUrl, configKey);
    setConfigSavedNotice(true);
    setErrorMessage(null);
    setTimeout(() => {
      setConfigSavedNotice(false);
      setShowConfigModal(false);
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const client = getSupabaseClient();
    const config = getSupabaseConfig();

    if (!client || !isSupabaseConfigured() || !config.url) {
      setErrorMessage(
        'Supabase is not configured yet. Click "Configure Connection" below to provide your Supabase URL and Anon Key.'
      );
      setShowConfigModal(true);
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          onSuccess();
        } else {
          setSuccessMessage(
            'Admin account created! If email confirmation is enabled on your Supabase project, check your inbox; otherwise, you may sign in.'
          );
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const msg = err?.message || String(err);
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch')) {
        setErrorMessage(
          `Connection to Supabase failed ("Failed to fetch"). Your current project URL is "${config.url || 'EMPTY'}". Please verify that your Supabase URL begins with https:// (not postgresql://) and that Vercel has been redeployed. You can also click "Configure Connection" below to set or fix it directly.`
        );
      } else {
        setErrorMessage(msg || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B132B] flex flex-col items-center justify-center p-4 sm:p-6 text-[#E0E7FF] font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <button
        type="button"
        onClick={onExit}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Portfolio</span>
      </button>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#1F2937] bg-[#111827]/90 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
            <Shield className="h-7 w-7" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#60A5FA] font-semibold">
            Vasantha Portfolio CMS
          </span>
          <h1 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
            Studio Admin Portal
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1.5">
            Authenticate with your Supabase Admin credentials to manage content and media.
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-2">
              <p className="leading-relaxed">{errorMessage}</p>
              {!showConfigModal && (
                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  className="underline text-rose-200 hover:text-white font-medium block cursor-pointer"
                >
                  Click here to check/enter Supabase URL & Key
                </button>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-4 text-xs text-emerald-300 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <p className="leading-relaxed">{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5B4FC] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="peralavasantha08@gmail.com"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 pl-10 pr-4 py-3 text-sm text-white placeholder-[#475569] outline-none transition-all focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5B4FC] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 pl-10 pr-4 py-3 text-sm text-white placeholder-[#475569] outline-none transition-all focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-[#1D4ED8] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isSignUp ? (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Create Admin Account</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In to Studio</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        <div className="mt-6 pt-6 border-t border-[#1F2937] flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="text-xs text-[#94A3B8] hover:text-[#60A5FA] transition-colors cursor-pointer"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'First time setting up? Create Admin account'}
          </button>

          <button
            type="button"
            onClick={() => setShowConfigModal(!showConfigModal)}
            className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B] hover:text-[#A5B4FC] transition-colors cursor-pointer"
          >
            <Settings className="h-3 w-3" />
            <span>{showConfigModal ? 'Hide Connection Settings' : 'Configure Connection Keys'}</span>
          </button>
        </div>

        {/* Collapsible Direct Credentials Config for Zero-Downtime Troubleshooting */}
        {showConfigModal && (
          <form onSubmit={handleSaveConfig} className="mt-5 rounded-2xl border border-[#334155] bg-[#0B132B] p-4 text-xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#1F2937]">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Settings className="h-3.5 w-3.5 text-[#60A5FA]" />
                Supabase Credentials
              </span>
              {configSavedNotice && (
                <span className="text-[10px] text-emerald-400 font-mono">Saved!</span>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#94A3B8] mb-1">
                Project URL (e.g. https://xyz.supabase.co)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#64748B]" />
                <input
                  type="text"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full rounded-lg border border-[#1F2937] bg-[#111827] pl-8 pr-3 py-2 text-xs text-white placeholder-[#475569] outline-none focus:border-[#60A5FA]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#94A3B8] mb-1">
                Anon / Public API Key
              </label>
              <div className="relative">
                <Key className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#64748B]" />
                <input
                  type="password"
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                  className="w-full rounded-lg border border-[#1F2937] bg-[#111827] pl-8 pr-3 py-2 text-xs text-white placeholder-[#475569] outline-none focus:border-[#60A5FA]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2 font-medium transition-colors cursor-pointer"
            >
              Save Credentials to Browser
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
