'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Upload, Copy, Check, RefreshCw, Folder, File, AlertCircle } from 'lucide-react';
import { uploadStorageFile, listStorageFiles } from '@/lib/supabase/api';
import { getSupabaseConfig } from '@/lib/supabase/client';

export function StudioMedia() {
  const [currentFolder, setCurrentFolder] = useState<'profile' | 'projects' | 'certificates'>('profile');
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { url: supabaseUrl } = getSupabaseConfig();

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listStorageFiles('portfolio-media', currentFolder);
      if (res.error) {
        // Storage bucket may not have files yet or need creation
        setFiles([]);
      } else {
        setFiles(res.data || []);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to list storage objects');
    } finally {
      setLoading(false);
    }
  }, [currentFolder]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const path = `${currentFolder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const res = await uploadStorageFile('portfolio-media', path, file);

      if (res.error) throw res.error;
      await loadFiles();
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Check Supabase Storage permissions.');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (fileName: string) => {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/portfolio-media/${currentFolder}/${fileName}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedUrl(fileName);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Media & Assets (Supabase Storage)</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Bucket: <code className="text-blue-400 font-mono">portfolio-media</code>. Upload profile photos, project diagrams, and certificate scans.
          </p>
        </div>

        <label className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer shrink-0">
          <Upload className="h-4 w-4" />
          <span>{uploading ? 'Uploading...' : `Upload to ${currentFolder}/`}</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Folder Navigation */}
      <div className="flex items-center gap-2">
        {(['profile', 'projects', 'certificates'] as const).map((folder) => (
          <button
            key={folder}
            type="button"
            onClick={() => setCurrentFolder(folder)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
              currentFolder === folder
                ? 'bg-[#1E293B] text-white border border-[#60A5FA]/40 shadow-sm'
                : 'bg-[#111827] text-[#94A3B8] hover:text-white border border-[#1F2937]'
            }`}
          >
            <Folder className={`h-3.5 w-3.5 ${currentFolder === folder ? 'text-[#60A5FA]' : 'text-[#64748B]'}`} />
            <span>{folder}/</span>
          </button>
        ))}

        <button
          type="button"
          onClick={loadFiles}
          disabled={loading}
          className="p-2 rounded-xl border border-[#1F2937] bg-[#111827] text-[#94A3B8] hover:text-white ml-auto"
          title="Refresh files"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* File Browser Grid */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 backdrop-blur-xl min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-xs text-[#94A3B8] gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Connecting to Supabase Storage bucket...</span>
          </div>
        ) : files.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file) => {
              const fileUrl = `${supabaseUrl}/storage/v1/object/public/portfolio-media/${currentFolder}/${file.name}`;
              return (
                <div
                  key={file.name}
                  className="rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 flex flex-col justify-between group hover:border-[#60A5FA]/40 transition-all"
                >
                  <div className="aspect-video w-full rounded-lg bg-[#111827] overflow-hidden flex items-center justify-center mb-2 border border-[#1F2937]">
                    <img
                      src={fileUrl}
                      alt={file.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback icon if preview fails
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <File className="h-8 w-8 text-[#64748B]" />
                  </div>

                  <p className="text-xs text-white font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[10px] font-mono text-[#64748B] mt-0.5">
                    {file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : 'File'}
                  </p>

                  <button
                    type="button"
                    onClick={() => copyUrl(file.name)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#111827] py-1.5 text-[11px] font-mono text-[#CBD5E1] hover:text-white hover:border-[#60A5FA] transition-colors"
                  >
                    {copiedUrl === file.name ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-[#64748B]">
            <Folder className="h-10 w-10 mb-2 opacity-40" />
            <p className="text-xs">No media files found in <code className="text-blue-400 font-mono">{currentFolder}/</code> yet.</p>
            <p className="text-[11px] text-[#475569] mt-1">Use the upload button above to add assets.</p>
          </div>
        )}
      </div>
    </div>
  );
}
