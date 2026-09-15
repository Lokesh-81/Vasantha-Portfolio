import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Detect environment variables from Vite or Next.js conventions
function getEnv(key: string): string {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  if (metaEnv) {
    if (metaEnv[key]) return metaEnv[key];
    if (metaEnv[`VITE_${key}`]) return metaEnv[`VITE_${key}`];
    if (metaEnv[`NEXT_PUBLIC_${key}`]) return metaEnv[`NEXT_PUBLIC_${key}`];
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key] || '';
    if (process.env[`VITE_${key}`]) return process.env[`VITE_${key}`] || '';
    if (process.env[`NEXT_PUBLIC_${key}`]) return process.env[`NEXT_PUBLIC_${key}`] || '';
  }
  return '';
}

// Runtime credentials storage key for browser session if user enters them via Studio UI
const STORAGE_URL_KEY = 'vasantha_portfolio_supabase_url';
const STORAGE_KEY_KEY = 'vasantha_portfolio_supabase_anon_key';

export function getSupabaseConfig(): { url: string; anonKey: string } {
  let url =
    getEnv('SUPABASE_URL') ||
    getEnv('NEXT_PUBLIC_SUPABASE_URL') ||
    getEnv('VITE_SUPABASE_URL');

  let anonKey =
    getEnv('SUPABASE_ANON_KEY') ||
    getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
    getEnv('VITE_SUPABASE_ANON_KEY');

  // Check sessionStorage for interactive admin config fallback
  if (typeof window !== 'undefined') {
    const sessionUrl = sessionStorage.getItem(STORAGE_URL_KEY);
    const sessionKey = sessionStorage.getItem(STORAGE_KEY_KEY);
    if (!url && sessionUrl) url = sessionUrl;
    if (!anonKey && sessionKey) anonKey = sessionKey;
  }

  return { url: url.trim(), anonKey: anonKey.trim() };
}

export function saveRuntimeSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url && anonKey) {
      sessionStorage.setItem(STORAGE_URL_KEY, url.trim());
      sessionStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    } else {
      sessionStorage.removeItem(STORAGE_URL_KEY);
      sessionStorage.removeItem(STORAGE_KEY_KEY);
    }
    // Re-initialize client
    supabaseClientInstance = null;
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
}

let supabaseClientInstance: SupabaseClient<any> | null = null;

export function getSupabaseClient(): SupabaseClient<any> | null {
  if (supabaseClientInstance) return supabaseClientInstance;

  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }

  try {
    supabaseClientInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return supabaseClientInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Default export as convenience
export const supabase = getSupabaseClient();
