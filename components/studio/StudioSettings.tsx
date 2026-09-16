'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Key,
  ShieldCheck,
  FileCode,
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCheck,
} from 'lucide-react';
import { getSupabaseConfig, saveRuntimeSupabaseConfig, isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase/client';
import { usePortfolio } from '@/lib/portfolio-context';

interface StudioSettingsProps {
  session?: any;
  onSessionUpdate?: (session: any) => void;
  defaultTab?: 'account' | 'connection' | 'migrations';
}

export function StudioSettings({ session, onSessionUpdate, defaultTab = 'account' }: StudioSettingsProps) {
  const { fromDatabase, refreshData } = usePortfolio();
  const config = getSupabaseConfig();

  const [activeTab, setActiveTab] = useState<'account' | 'connection' | 'migrations'>(defaultTab);

  // Connection settings state
  const [urlInput, setUrlInput] = useState(config.url);
  const [keyInput, setKeyInput] = useState(config.anonKey);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState<string | null>(null);

  // Username change state
  const resolvedUsername =
    session?.user?.user_metadata?.username ||
    session?.user?.user_metadata?.display_name ||
    (typeof window !== 'undefined' ? localStorage.getItem('vasantha_studio_username') : null) ||
    (session?.user?.email ? session.user.email.split('@')[0] : 'admin');

  const [currentUsername, setCurrentUsername] = useState(resolvedUsername);
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [updatingUsername, setUpdatingUsername] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Password change state (NO old password required)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (resolvedUsername) {
      setCurrentUsername(resolvedUsername);
    }
  }, [resolvedUsername]);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameSuccess(null);
    setUsernameError(null);

    const clean = newUsernameInput.trim();
    if (!clean) {
      setUsernameError('Please enter a new username.');
      return;
    }

    if (clean.length < 3) {
      setUsernameError('Username must be at least 3 characters long.');
      return;
    }

    if (clean === currentUsername) {
      setUsernameError('New username must be different from current username.');
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(clean)) {
      setUsernameError('Username can only contain letters, numbers, underscores, hyphens, and dots.');
      return;
    }

    setUpdatingUsername(true);

    try {
      const client = getSupabaseClient();
      let supabaseUpdated = false;

      if (client && isSupabaseConfigured()) {
        const { data, error } = await client.auth.updateUser({
          data: {
            username: clean,
            display_name: clean,
          },
        });

        if (error) {
          throw error;
        }

        supabaseUpdated = true;
        if (data.user && onSessionUpdate) {
          onSessionUpdate({ ...session, user: data.user });
        }
      }

      // Persist to local storage for local/offline sessions & UI sync
      if (typeof window !== 'undefined') {
        localStorage.setItem('vasantha_studio_username', clean);
        const localSessionStr = localStorage.getItem('vasantha_local_admin_session');
        if (localSessionStr) {
          try {
            const parsed = JSON.parse(localSessionStr);
            parsed.user = parsed.user || {};
            parsed.user.user_metadata = parsed.user.user_metadata || {};
            parsed.user.user_metadata.username = clean;
            parsed.user.user_metadata.display_name = clean;
            localStorage.setItem('vasantha_local_admin_session', JSON.stringify(parsed));
            if (onSessionUpdate) {
              onSessionUpdate(parsed);
            }
          } catch {}
        }
      }

      setCurrentUsername(clean);
      setNewUsernameInput('');
      setUsernameSuccess(
        `Username successfully updated to "@${clean}"! ${
          supabaseUpdated ? 'Synced with your Supabase account metadata.' : ''
        }`
      );
      setTimeout(() => setUsernameSuccess(null), 6000);
    } catch (err: any) {
      console.error('Username update error:', err);
      setUsernameError(err?.message || 'Failed to update username. Please try again.');
    } finally {
      setUpdatingUsername(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setUpdatingPassword(true);

    try {
      const client = getSupabaseClient();
      let supabaseUpdated = false;

      // Update password directly using active session in Supabase Auth (no old password required)
      if (client && isSupabaseConfigured()) {
        const { data, error } = await client.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          throw error;
        }

        supabaseUpdated = true;
        if (data.user && onSessionUpdate) {
          onSessionUpdate({ ...session, user: data.user });
        }
      }

      // Sync local admin password cache so next login in local/preview mode works with new password
      if (typeof window !== 'undefined') {
        localStorage.setItem('vasantha_admin_password', newPassword);
      }

      setPasswordSuccess(
        supabaseUpdated
          ? 'Password successfully changed! Because you were logged in, no old password was needed. Your new password is now active for future logins.'
          : 'Password successfully changed! Your new credentials have been updated for your administrator account.'
      );
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 7000);
    } catch (err: any) {
      console.error('Password update error:', err);
      setPasswordError(err?.message || 'Failed to update password. Please try again.');
    } finally {
      setUpdatingPassword(false);
    }
  };

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
          message: `Connected to Supabase project, but query returned: ${error.message}. Make sure migrations have been executed in Supabase SQL editor.`,
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

  const isPasswordLengthValid = newPassword.length >= 6;
  const doPasswordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#1F2937] pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#60A5FA] font-semibold">
              Admin Configuration
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Studio Settings & Credentials
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Manage administrator authentication credentials, username, and Supabase backend services.
            </p>
          </div>

          {/* Connected status badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1F2937] bg-[#111827] self-start sm:self-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono text-[#CBD5E1]">
              Signed in as <strong className="text-white">@{currentUsername}</strong>
            </span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'account'
                ? 'bg-[#2563EB] text-white font-semibold shadow-lg shadow-blue-600/20'
                : 'bg-[#111827] text-[#94A3B8] hover:text-white border border-[#1F2937]'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>Account & Security (Password & Username)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('connection')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'connection'
                ? 'bg-[#2563EB] text-white font-semibold shadow-lg shadow-blue-600/20'
                : 'bg-[#111827] text-[#94A3B8] hover:text-white border border-[#1F2937]'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Supabase Connection</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('migrations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'migrations'
                ? 'bg-[#2563EB] text-white font-semibold shadow-lg shadow-blue-600/20'
                : 'bg-[#111827] text-[#94A3B8] hover:text-white border border-[#1F2937]'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>SQL Migrations</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACCOUNT & SECURITY */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Active Session Overview Banner */}
          <div className="rounded-2xl border border-blue-900/40 bg-gradient-to-r from-blue-950/40 via-[#111827] to-[#111827] p-5 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Active Administrator Session</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Logged In
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    User: <span className="text-white font-mono font-medium">@{currentUsername}</span> · Email:{' '}
                    <span className="text-[#CBD5E1] font-mono">{session?.user?.email || 'admin@vasantha.studio'}</span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/30 px-3.5 py-2 text-xs text-emerald-300">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCheck className="h-4 w-4 text-emerald-400" />
                  <span>No Old Password Required</span>
                </p>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">
                  Verified by your active session. You can update password or username directly.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CHANGE USERNAME CARD */}
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-[#1F2937]">
                  <div className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Change Username</h3>
                    <p className="text-xs text-[#94A3B8]">
                      Update your Studio handle and display name
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[#0B132B]/80 border border-[#1F2937] text-xs space-y-1">
                  <p className="text-[#94A3B8]">Current active username:</p>
                  <p className="text-sm font-mono font-bold text-[#60A5FA]">@{currentUsername}</p>
                </div>

                {usernameError && (
                  <div className="mt-4 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{usernameError}</span>
                  </div>
                )}

                {usernameSuccess && (
                  <div className="mt-4 rounded-xl border border-emerald-800/60 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{usernameSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateUsername} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1.5">
                      New Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-xs font-mono text-[#64748B]">@</span>
                      <input
                        type="text"
                        required
                        value={newUsernameInput}
                        onChange={(e) => setNewUsernameInput(e.target.value)}
                        placeholder="e.g. vasantha_admin"
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] pl-8 pr-3 py-2.5 text-xs font-mono text-white placeholder-[#475569] outline-none transition-all focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]"
                      />
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Min 3 characters. Allowed: letters, numbers, underscores, hyphens.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingUsername || !newUsernameInput.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {updatingUsername ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Updating Username...</span>
                      </>
                    ) : (
                      <>
                        <User className="h-3.5 w-3.5" />
                        <span>Save New Username</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1F2937]/60 text-[11px] text-[#64748B]">
                Changes take effect immediately across Studio navigation and session headers.
              </div>
            </div>

            {/* CHANGE PASSWORD CARD */}
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Change Password</h3>
                      <p className="text-xs text-[#94A3B8]">
                        Update your administrator password
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#60A5FA] font-medium">
                    No Old Password
                  </span>
                </div>

                {passwordError && (
                  <div className="mt-4 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mt-4 rounded-xl border border-emerald-800/60 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4">
                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-[#64748B]" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min. 6 chars)"
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] pl-9 pr-10 py-2.5 text-xs text-white placeholder-[#475569] outline-none transition-all focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#E0E7FF] transition-colors cursor-pointer"
                        title={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-[#64748B]" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] pl-9 pr-10 py-2.5 text-xs text-white placeholder-[#475569] outline-none transition-all focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-[#64748B] hover:text-[#E0E7FF] transition-colors cursor-pointer"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Requirements checklist indicator */}
                  <div className="rounded-xl bg-[#0B132B] p-2.5 border border-[#1F2937] space-y-1 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      {isPasswordLengthValid ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#64748B] ml-1 mr-1" />
                      )}
                      <span className={isPasswordLengthValid ? 'text-emerald-400' : 'text-[#64748B]'}>
                        At least 6 characters
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {doPasswordsMatch ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#64748B] ml-1 mr-1" />
                      )}
                      <span
                        className={
                          doPasswordsMatch
                            ? 'text-emerald-400'
                            : confirmPassword.length > 0
                            ? 'text-rose-400'
                            : 'text-[#64748B]'
                        }
                      >
                        {confirmPassword.length > 0 && !doPasswordsMatch
                          ? 'Passwords do not match'
                          : 'Passwords match'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword || !isPasswordLengthValid || !doPasswordsMatch}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {updatingPassword ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Key className="h-3.5 w-3.5" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1F2937]/60 text-[11px] text-[#64748B]">
                Old password is never requested because you are verified by your active session.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUPABASE CONNECTION */}
      {activeTab === 'connection' && (
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border ${
                  fromDatabase
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                }`}
              >
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Supabase PostgreSQL & Auth</h3>
                <p className="text-xs text-[#94A3B8]">
                  {fromDatabase
                    ? 'Active and reading live from PostgreSQL'
                    : 'Operating in fallback seed mode until credentials are provided'}
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
      )}

      {/* TAB 3: SQL MIGRATIONS */}
      {activeTab === 'migrations' && (
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl space-y-4">
          <div className="border-b border-[#1F2937] pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileCode className="h-4 w-4 text-[#60A5FA]" />
              <span>Database Migrations (SQL Scripts)</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              If you created a new Supabase project, execute these SQL migrations in your Supabase SQL Editor in order:
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

            <div className="rounded-xl border border-blue-900/60 bg-[#0B132B] p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-blue-300 font-mono">004_fix_permissions.sql (Table Grants)</p>
                <p className="text-[11px] text-[#94A3B8]">Fixes "permission denied for table profiles" by granting SQL privileges to authenticated users.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    '004',
                    `GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;`
                  )
                }
                className="flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-600/20 px-3 py-1.5 text-xs font-mono text-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
              >
                {copiedSql === '004' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedSql === '004' ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

