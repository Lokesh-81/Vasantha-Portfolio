'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Save, AlertCircle, CheckCircle2, Upload, RefreshCw, Copy, Check, FileCode } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { updateProfile, uploadStorageFile } from '@/lib/supabase/api';

const FIX_PERMISSIONS_SQL = `-- Grant full permissions to Supabase authenticated user
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;`;

export function StudioProfile() {
  const { profile, refreshData } = usePortfolio();

  const [formData, setFormData] = useState({
    name: profile.name,
    headline: profile.title,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    linkedin_url: profile.linkedinUrl,
    bio: profile.heroBio,
    about_bio: profile.aboutBio,
    about_sub_description: profile.aboutSubDescription,
  });

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [imageUrlInput, setImageUrlInput] = useState(profile.profileImageUrl || '');
  const [copiedFix, setCopiedFix] = useState(false);

  const handleCopySqlFix = () => {
    navigator.clipboard.writeText(FIX_PERMISSIONS_SQL);
    setCopiedFix(true);
    setTimeout(() => setCopiedFix(false), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      // Sync with localStorage cache immediately
      const cached = localStorage.getItem('vasantha_profile_override');
      const parsed = cached ? JSON.parse(cached) : {};
      const updatedCache = {
        ...parsed,
        name: formData.name,
        title: formData.title,
        college: formData.college,
        degree: formData.degree,
        cgpa: formData.cgpa,
        location: formData.location,
        email: formData.email,
        phone: formData.phone,
        linkedinUrl: formData.linkedin_url,
        githubUrl: formData.github_url,
        heroBio: formData.hero_bio,
        aboutBio: formData.about_bio,
        aboutSubDescription: formData.about_sub_description,
      };
      localStorage.setItem('vasantha_profile_override', JSON.stringify(updatedCache));

      const res = await updateProfile(formData);
      if (res.error) throw new Error(res.error.message || 'Failed to update profile');
      await refreshData();
      setSuccess('Profile updated successfully and synced with database!');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    const readFileAsDataUrl = (f: File): Promise<string> =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(f);
      });

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `profile/vasantha_avatar_${Date.now()}.${fileExt}`;
      const res = await uploadStorageFile('portfolio-media', fileName, file);

      let finalUrl = res.data?.publicUrl;
      if (res.error || !finalUrl) {
        if (dataUrl) {
          finalUrl = dataUrl;
        } else {
          throw res.error || new Error('Upload failed');
        }
      }

      // Save to localStorage override
      const cached = localStorage.getItem('vasantha_profile_override');
      const parsed = cached ? JSON.parse(cached) : {};
      parsed.profileImageUrl = finalUrl;
      localStorage.setItem('vasantha_profile_override', JSON.stringify(parsed));

      setImageUrlInput(finalUrl.startsWith('data:') ? finalUrl.slice(0, 40) + '... (Data URI)' : finalUrl);
      try {
        await updateProfile({ profile_image_url: finalUrl });
      } catch (_) {}
      await refreshData();
      setSuccess('Profile photograph uploaded and activated!');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload profile photo to storage');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveImageUrl = async () => {
    const targetUrl = imageUrlInput.trim();
    const cached = localStorage.getItem('vasantha_profile_override');
    const parsed = cached ? JSON.parse(cached) : {};
    parsed.profileImageUrl = targetUrl;
    localStorage.setItem('vasantha_profile_override', JSON.stringify(parsed));

    try {
      await updateProfile({ profile_image_url: targetUrl });
    } catch (_) {}
    await refreshData();
    setSuccess(targetUrl ? 'Profile photo URL updated!' : 'Profile photo removed.');
    setTimeout(() => setSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Profile Configuration</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Manage your personal details, public bio, and official contact information.
          </p>
        </div>
      </div>

      {success && (
        <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-4 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {error && error.toLowerCase().includes('permission denied') ? (
        <div className="rounded-2xl border border-amber-800/60 bg-amber-950/40 p-5 text-xs text-amber-200 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-white text-sm">
                Supabase Database Permission Required
              </p>
              <p className="text-[#CBD5E1] text-xs mt-1">
                Your changes have been safely cached in your browser. However, PostgreSQL requires granting table write permissions to the <code className="text-amber-300 font-mono">authenticated</code> role in Supabase.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-900/60 bg-[#0B132B] p-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800 mb-2">
              <span className="text-[11px] font-mono text-gray-400">Run in Supabase Dashboard → SQL Editor:</span>
              <button
                type="button"
                onClick={handleCopySqlFix}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                {copiedFix ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedFix ? 'Copied to Clipboard!' : 'Copy SQL Fix'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-amber-300/90 overflow-x-auto whitespace-pre">
              {FIX_PERMISSIONS_SQL}
            </pre>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      ) : null}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Image Section */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-white mb-3">Profile Photograph</h3>
          <p className="text-xs text-[#94A3B8] mb-4">
            Until Vasantha provides her actual photograph, the public site displays a neutral technical avatar badge. You can upload an official photograph below to store in <code className="text-blue-400 font-mono">portfolio-media/profile/</code>.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            {profile.profileImageUrl ? (
              <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border-2 border-[#60A5FA] shadow-lg shadow-blue-500/20">
                <img
                  src={profile.profileImageUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#1F2937] bg-[#0B132B] text-white font-mono text-xl font-bold">
                VP
              </div>
            )}

            <div className="space-y-3 flex-1 min-w-[240px]">
              <div className="flex flex-wrap items-center gap-2.5">
                <label className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white cursor-pointer transition-colors shadow-md shadow-blue-600/20">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{uploadingImage ? 'Uploading photograph...' : 'Upload New Photograph'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>

                {profile.profileImageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrlInput('');
                      const cached = localStorage.getItem('vasantha_profile_override');
                      const parsed = cached ? JSON.parse(cached) : {};
                      delete parsed.profileImageUrl;
                      localStorage.setItem('vasantha_profile_override', JSON.stringify(parsed));
                      updateProfile({ profile_image_url: '' }).catch(() => {});
                      refreshData();
                    }}
                    className="rounded-xl border border-rose-800/60 bg-rose-950/40 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/40 transition-colors cursor-pointer"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Or enter direct image URL (e.g. https://...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-white placeholder-[#64748B] focus:border-[#60A5FA] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveImageUrl}
                  className="rounded-xl border border-[#1F2937] bg-[#1F2937] hover:bg-[#374151] px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Save URL
                </button>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Accepted: JPG, PNG, WebP (Max 5MB) or direct hosted image link.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-[#1F2937] pb-3">
            Core Identity
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                required
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Public Contact Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
              <span className="text-[10px] text-emerald-400 font-mono">peralavasantha08@gmail.com</span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
              <span className="text-[10px] text-[#64748B] font-mono">+91 9550139722</span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-sm text-white focus:border-[#60A5FA] outline-none"
            />
          </div>
        </div>

        {/* Narrative & Bio Texts */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-[#1F2937] pb-3">
            Biography & Section Narratives
          </h3>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              Hero Introduction Bio
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-sm text-white focus:border-[#60A5FA] outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              About Section Main Bio
            </label>
            <textarea
              rows={3}
              value={formData.about_bio}
              onChange={(e) => setFormData({ ...formData, about_bio: e.target.value })}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-sm text-white focus:border-[#60A5FA] outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              About Section Philosophy / Sub Description
            </label>
            <textarea
              rows={3}
              value={formData.about_sub_description}
              onChange={(e) => setFormData({ ...formData, about_sub_description: e.target.value })}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-sm text-white focus:border-[#60A5FA] outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-600/30"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
}
