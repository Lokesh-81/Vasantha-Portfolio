import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Runtime credentials storage key for browser session / persistent admin config
const STORAGE_URL_KEY = 'vasantha_portfolio_supabase_url';
const STORAGE_KEY_KEY = 'vasantha_portfolio_supabase_anon_key';

function sanitizeUrl(rawUrl?: string | null): string {
  if (!rawUrl) return '';
  let cleaned = rawUrl.trim().replace(/^['"]|['"]$/g, '');
  if (!cleaned) return '';
  // Fix protocol if user pasted project domain without https://
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  // Remove trailing slashes
  return cleaned.replace(/\/+$/, '');
}

function sanitizeKey(rawKey?: string | null): string {
  if (!rawKey) return '';
  return rawKey.trim().replace(/^['"]|['"]$/g, '');
}

export function getSupabaseConfig(): { url: string; anonKey: string } {
  // Static references for Vite AST replacement at build time
  const meta = typeof import.meta !== 'undefined' ? (import.meta as any) : undefined;
  const viteUrl = (meta?.env?.VITE_SUPABASE_URL || meta?.env?.NEXT_PUBLIC_SUPABASE_URL || '') as string;
  const viteKey = (meta?.env?.VITE_SUPABASE_ANON_KEY || meta?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '') as string;

  const procUrl =
    (typeof process !== 'undefined' && process.env
      ? (process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)
      : '') || '';

  const procKey =
    (typeof process !== 'undefined' && process.env
      ? (process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)
      : '') || '';

  let url = sanitizeUrl(viteUrl || procUrl);
  let anonKey = sanitizeKey(viteKey || procKey);

  // Check localStorage and sessionStorage for interactive admin config fallback
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem(STORAGE_URL_KEY) || sessionStorage.getItem(STORAGE_URL_KEY);
    const savedKey = localStorage.getItem(STORAGE_KEY_KEY) || sessionStorage.getItem(STORAGE_KEY_KEY);
    if (!url && savedUrl) url = sanitizeUrl(savedUrl);
    if (!anonKey && savedKey) anonKey = sanitizeKey(savedKey);
  }

  return { url, anonKey };
}

export function saveRuntimeSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    const cleanUrl = sanitizeUrl(url);
    const cleanKey = sanitizeKey(anonKey);
    if (cleanUrl && cleanKey) {
      localStorage.setItem(STORAGE_URL_KEY, cleanUrl);
      localStorage.setItem(STORAGE_KEY_KEY, cleanKey);
      sessionStorage.setItem(STORAGE_URL_KEY, cleanUrl);
      sessionStorage.setItem(STORAGE_KEY_KEY, cleanKey);
    } else {
      localStorage.removeItem(STORAGE_URL_KEY);
      localStorage.removeItem(STORAGE_KEY_KEY);
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
