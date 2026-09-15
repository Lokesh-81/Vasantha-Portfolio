'use client';

import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, RefreshCw, Key, ShieldCheck, FileCode } from 'lucide-react';
import { getSupabaseConfig, saveRuntimeSupabaseConfig, isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase/client';
import { usePortfolio } from '@/lib/portfolio-context';
import { updateSiteSetting } from '@/lib/supabase/api';

export function StudioSettings() {
  const { fromDatabase, refreshData } = usePortfolio();
  const config = getSupabaseConfig();

  const [urlInput, setUrlInput] = useState(config.url);
  const [keyInput, setKeyInput] = useState(config.anonKey);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState<string | null>(null);

  const [heroBadge, setHeroBadge] = useState('B.Tech · EEE (2023–2027) · Hyderabad, India');
  const [savingSettings, setSavingSettings] = useState(false);

  const handleSaveRuntimeConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestingConnection(true);
    setConnectionStatus(null);

    try {
      saveRuntimeSupabaseConfig(urlInput.trim(), keyInput.trim());
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Could not create client with provided URL.');
      }

      // Test a light ping to profiles table
      const { data, error } = await client.from('profiles').select('name').limit(1);
      if (error) {
        setConnectionStatus({
          success: false,
          message: `Connected to Supabase project, but query returned: ${error.message}. Make sure migration 001, 002, 003 have been executed in Supabase SQL editor.`,
        });
      } else {
        setConnectionStatus({
          success: true,
          message: 'Successfully connected to Supabase PostgreSQL database!',
        });
        await refreshData();
      }
    } catch (err: any) {
      setConnectionStatus({
        success: false,
        message: err?.message || 'Connection failed. Please verify your Project URL and Anon Key.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleCopy = (name: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSql(name);
    setTimeout(() => setCopiedSql(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-[#1F2937] pb-4">
        <h2 className="text-xl font-bold text-white">System Settings & Supabase Configuration</h2>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Verify backend connectivity, manage runtime credentials, and access database migration scripts.
        </p>
      </div>

      {/* Supabase Connection State */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${fromDatabase ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/20 bg-amber-500/10 text-amber-400'}`}>
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Supabase PostgreSQL & Auth</h3>
              <p className="text-xs text-[#94A3B8]">
                {fromDatabase ? 'Active and reading live from PostgreSQL' : 'Operating in fallback seed mode until credentials are provided'}
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-mono px-3 py-1 rounded-full border ${
              fromDatabase
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}
          >
            {fromDatabase ? 'Connected' : 'Setup Required'}
          </span>
        </div>

        {connectionStatus && (
          <div
            className={`mt-4 rounded-xl border p-3.5 text-xs flex items-center gap-2 ${
              connectionStatus.success
                ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-300'
                : 'border-amber-800/60 bg-amber-950/40 text-amber-300'
            }`}
          >
            {connectionStatus.success ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            )}
            <span>{connectionStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleSaveRuntimeConfig} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              Supabase Project URL
            </label>
            <input
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-xs font-mono text-white focus:border-[#60A5FA] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              Supabase Anon Public API Key
            </label>
            <input
              type="text"
              required
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-xs font-mono text-white focus:border-[#60A5FA] outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={testingConnection}
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              {testingConnection && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>Test Connection & Save</span>
            </button>
          </div>
        </form>
      </div>

      {/* SQL Migrations Quick Copy Guide */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl space-y-4">
        <div className="border-b border-[#1F2937] pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileCode className="h-4 w-4 text-[#60A5FA]" />
            <span>Database Migrations (SQL Scripts)</span>
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            If you created a new Supabase project, execute these 3 SQL migrations in your Supabase SQL Editor in order:
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[#1F2937] bg-[#0B132B] p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-white font-mono">001_initial_schema.sql</p>
              <p className="text-[11px] text-[#94A3B8]">Creates all tables, triggers, updated_at functions, and constraints.</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('001', '-- Migration 001\nSee /supabase/migrations/001_initial_schema.sql')}
              className="flex items-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-mono text-[#CBD5E1] hover:text-white"
            >
              {copiedSql === '001' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedSql === '001' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-[#1F2937] bg-[#0B132B] p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-white font-mono">002_rls_policies.sql</p>
              <p className="text-[11px] text-[#94A3B8]">Secures all tables with Row Level Security, configures Storage buckets.</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('002', '-- Migration 002\nSee /supabase/migrations/002_rls_policies.sql')}
              className="flex items-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-mono text-[#CBD5E1] hover:text-white"
            >
              {copiedSql === '002' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedSql === '002' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-[#1F2937] bg-[#0B132B] p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-white font-mono">003_seed_vasantha_data.sql</p>
              <p className="text-[11px] text-[#94A3B8]">Seeds verified data for Vasantha Perala across all portfolio tables.</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('003', '-- Migration 003\nSee /supabase/migrations/003_seed_vasantha_data.sql')}
              className="flex items-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-mono text-[#CBD5E1] hover:text-white"
            >
              {copiedSql === '003' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedSql === '003' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
