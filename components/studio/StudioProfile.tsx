'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Save, AlertCircle, CheckCircle2, Upload, RefreshCw } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { updateProfile, uploadStorageFile } from '@/lib/supabase/api';

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
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

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `profile/vasantha_avatar_${Date.now()}.${fileExt}`;
      const res = await uploadStorageFile('portfolio-media', fileName, file);

      if (res.error) throw res.error;
      if (res.data?.publicUrl) {
        await updateProfile({ profile_image_url: res.data.publicUrl });
        await refreshData();
        setSuccess('Profile photograph uploaded to Supabase Storage!');
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload profile photo to storage');
    } finally {
      setUploadingImage(false);
    }
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

      {error && (
        <div className="rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Image Section */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-white mb-3">Profile Photograph</h3>
          <p className="text-xs text-[#94A3B8] mb-4">
            Until Vasantha provides her actual photograph, the public site displays a neutral technical avatar badge. You can upload an official photograph below to store in <code className="text-blue-400 font-mono">portfolio-media/profile/</code>.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#1F2937] bg-[#0B132B] text-white font-mono text-xl font-bold">
              VP
            </div>

            <div>
              <label className="inline-flex items-center gap-2 rounded-xl bg-[#1F2937] hover:bg-[#374151] px-4 py-2 text-xs font-semibold text-white cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5" />
                <span>{uploadingImage ? 'Uploading to Supabase...' : 'Upload Actual Photograph'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-[#64748B] mt-1">
                Accepted: JPG, PNG, WebP (Max 5MB)
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
