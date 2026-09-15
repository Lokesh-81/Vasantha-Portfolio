'use client';

import React, { useState } from 'react';
import { FileText, Upload, CheckCircle2, AlertCircle, Download, ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { uploadStorageFile, updateSiteSetting } from '@/lib/supabase/api';

export function StudioResume() {
  const { resumeUrl, refreshData } = usePortfolio();

  const [uploading, setUploading] = useState(false);
  const [savingCustomUrl, setSavingCustomUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState(resumeUrl || '');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Please select a valid PDF file.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const fileName = `Vasantha_Perala_Resume_${Date.now()}.pdf`;
      const res = await uploadStorageFile('resume', fileName, file);

      if (res.error) throw res.error;
      if (res.data?.publicUrl) {
        // Update site settings in DB
        await updateSiteSetting('resume_url', res.data.publicUrl, 'Active public resume document URL');
        await refreshData();
        setCustomUrl(res.data.publicUrl);
        setSuccess('Resume PDF successfully uploaded to Supabase Storage and activated for the public portfolio!');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload resume to storage');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCustomUrl(true);
    setError(null);
    setSuccess(null);

    try {
      await updateSiteSetting('resume_url', customUrl.trim(), 'Active public resume document URL');
      await refreshData();
      setSuccess('Resume URL updated successfully!');
    } catch (err: any) {
      setError(err?.message || 'Failed to update resume URL');
    } finally {
      setSavingCustomUrl(false);
    }
  };

  const handleRemoveResume = async () => {
    if (!confirm('Are you sure you want to remove the active resume? Public visitors will see "Resume coming soon".')) return;
    setError(null);
    setSuccess(null);

    try {
      await updateSiteSetting('resume_url', '', 'Active public resume document URL');
      await refreshData();
      setCustomUrl('');
      setSuccess('Resume reference removed.');
    } catch (err: any) {
      setError(err?.message || 'Failed to remove resume');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-[#1F2937] pb-4">
        <h2 className="text-xl font-bold text-white">Resume Document Manager</h2>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Bucket: <code className="text-blue-400 font-mono">resume</code>. When a resume is uploaded, the public "Download Resume" button immediately activates.
        </p>
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

      {/* Current Resume Status Card */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${resumeUrl ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/20 bg-amber-500/10 text-amber-400'}`}>
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block">Current Status</span>
              <h3 className="text-base font-semibold text-white">
                {resumeUrl ? 'Active Resume Available' : 'No Resume Uploaded'}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {resumeUrl
                  ? 'Public visitors can click "Download Resume" in the hero and footer.'
                  : 'Public visitors will see "Resume coming soon" when clicking the button.'}
              </p>
            </div>
          </div>

          {resumeUrl && (
            <div className="flex items-center gap-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Test Download</span>
              </a>
              <button
                type="button"
                onClick={handleRemoveResume}
                className="p-2 rounded-xl border border-rose-900/40 bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 transition-colors"
                title="Remove resume"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Upload Box */}
        <div className="mt-6">
          <label className="border-2 border-dashed border-[#1F2937] hover:border-[#60A5FA]/60 bg-[#0B132B]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
            <Upload className="h-8 w-8 text-[#64748B] group-hover:text-[#60A5FA] mb-2 transition-colors" />
            <p className="text-sm font-semibold text-white group-hover:text-[#60A5FA] transition-colors">
              {uploading ? 'Uploading PDF to Supabase Storage...' : 'Click or drop PDF here to upload or replace resume'}
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Supports PDF documents up to 10MB. Stored securely in <code className="text-blue-400 font-mono">resume</code> bucket.
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Or specify external direct PDF link */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-white mb-2">Or Direct Resume URL</h3>
        <p className="text-xs text-[#94A3B8] mb-4">
          If your resume is already hosted elsewhere (e.g. Google Drive direct link, Cloud Storage, or personal domain), you can set the URL directly below:
        </p>

        <form onSubmit={handleSaveCustomUrl} className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://your-supabase-project.supabase.co/storage/v1/object/public/resume/..."
            className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs font-mono text-white focus:border-[#60A5FA] outline-none"
          />
          <button
            type="submit"
            disabled={savingCustomUrl}
            className="px-4 py-2 rounded-xl bg-[#2563EB] text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors shrink-0"
          >
            {savingCustomUrl ? 'Saving...' : 'Set Active URL'}
          </button>
        </form>
      </div>
    </div>
  );
}
