'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Folder,
  File,
  AlertCircle,
  Trash2,
  AlertTriangle,
  X,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  ZoomIn,
  ArrowRight,
  Info,
  ShieldAlert,
} from 'lucide-react';
import {
  uploadStorageFile,
  listStorageFiles,
  deleteStorageFile,
  replaceStorageFile,
  updateAllMediaReferences,
  clearAllMediaReferences,
  fetchSiteSettings,
} from '@/lib/supabase/api';
import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase/client';
import { usePortfolio } from '@/lib/portfolio-context';
import { getAssetUsages, formatUsageLabel, AssetUsage } from '@/lib/supabase/media-usage';

type FolderType = 'profile' | 'projects' | 'certificates';

interface StorageFile {
  name: string;
  id?: string | null;
  metadata?: {
    size?: number;
    mimetype?: string;
    lastModified?: string | number;
    [key: string]: any;
  } | null;
  created_at?: string | null;
  updated_at?: string | null;
  last_accessed_at?: string | null;
  dataUrl?: string;
}

export function StudioMedia() {
  const portfolio = usePortfolio();
  const { refreshData } = portfolio;
  const { url: supabaseUrl } = getSupabaseConfig();
  const isConfigured = isSupabaseConfigured();

  const [currentFolder, setCurrentFolder] = useState<FolderType>('profile');
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [siteSettings, setSiteSettings] = useState<any[]>([]);
  const [folderCounts, setFolderCounts] = useState<Record<FolderType, number>>({
    profile: 0,
    projects: 0,
    certificates: 0,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUsage, setFilterUsage] = useState<'all' | 'used' | 'unused'>('all');

  // Delete modal state
  const [deletingFile, setDeletingFile] = useState<{ file: StorageFile; usages: AssetUsage[] } | null>(null);
  const [deleteAcknowledged, setDeleteAcknowledged] = useState(false);
  const [autoClearReferences, setAutoClearReferences] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Replace modal state
  const [replacingFile, setReplacingFile] = useState<{ file: StorageFile; usages: AssetUsage[] } | null>(null);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [replacementPreview, setReplacementPreview] = useState<string | null>(null);
  const [preserveOriginalUrl, setPreserveOriginalUrl] = useState(true);
  const [isReplacing, setIsReplacing] = useState(false);

  // Lightbox preview state
  const [previewAsset, setPreviewAsset] = useState<{ url: string; name: string; isPdf: boolean } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Helper to construct public URL for a file
  const getFilePublicUrl = useCallback(
    (fileName: string, folder: FolderType, rawDataUrl?: string) => {
      if (rawDataUrl && rawDataUrl.startsWith('data:')) {
        return rawDataUrl;
      }
      if (supabaseUrl && supabaseUrl.startsWith('http')) {
        return `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/portfolio-media/${folder}/${fileName}`;
      }
      return rawDataUrl || `https://demo-storage.local/portfolio-media/${folder}/${fileName}`;
    },
    [supabaseUrl]
  );

  // Load files for current folder and count stats across all folders
  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch site settings for usage matching
      try {
        const settingsRes = await fetchSiteSettings();
        if (settingsRes && settingsRes.data) {
          setSiteSettings(settingsRes.data);
        }
      } catch (_) {}

      // 2. Load current folder
      const res = await listStorageFiles('portfolio-media', currentFolder);
      if (res.error) {
        setFiles([]);
      } else {
        setFiles(res.data || []);
      }

      // 3. Update file counts across tabs
      const folders: FolderType[] = ['profile', 'projects', 'certificates'];
      const counts: Record<FolderType, number> = { profile: 0, projects: 0, certificates: 0 };

      await Promise.all(
        folders.map(async (f) => {
          if (f === currentFolder && res.data) {
            counts[f] = res.data.length;
          } else {
            const fRes = await listStorageFiles('portfolio-media', f);
            counts[f] = fRes.data?.length || 0;
          }
        })
      );
      setFolderCounts(counts);
    } catch (err: any) {
      setError(err?.message || 'Failed to list storage objects');
    } finally {
      setLoading(false);
    }
  }, [currentFolder]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Full Refresh handler: re-fetches portfolio context and storage files
  const handleFullRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await refreshData();
      await loadFiles();
      setCacheBuster(Date.now());
      showToast('Media assets and usage data refreshed!', 'info');
    } catch (err: any) {
      setError(err?.message || 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Upload handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10 MB limit. Please select a smaller file.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const sanitizedName = file.name.replace(/\s+/g, '_');
      const path = `${currentFolder}/${Date.now()}_${sanitizedName}`;
      const res = await uploadStorageFile('portfolio-media', path, file);

      if (res.error) throw res.error;

      await loadFiles();
      setCacheBuster(Date.now());
      showToast(`Uploaded ${file.name} to ${currentFolder}/ successfully!`, 'success');
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Check Supabase Storage permissions and bucket policies.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Copy URL handler
  const copyUrl = (fileName: string, rawDataUrl?: string) => {
    const publicUrl = getFilePublicUrl(fileName, currentFolder, rawDataUrl);
    navigator.clipboard.writeText(publicUrl);
    setCopiedUrl(fileName);
    showToast('Public asset URL copied to clipboard!', 'info');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Open Delete Confirmation
  const openDeleteDialog = (file: StorageFile) => {
    const usages = getAssetUsages(
      file.name,
      currentFolder,
      { ...portfolio, siteSettings },
      supabaseUrl
    );
    setDeletingFile({ file, usages });
    setDeleteAcknowledged(false);
    setAutoClearReferences(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingFile) return;

    const { file, usages } = deletingFile;
    const isUsed = usages.length > 0;

    // Strict guard: if in use, require user acknowledgement checkbox
    if (isUsed && !deleteAcknowledged) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const path = `${currentFolder}/${file.name}`;
      const fileUrl = getFilePublicUrl(file.name, currentFolder, file.dataUrl);

      // 1. Delete actual object from Supabase Storage
      const res = await deleteStorageFile('portfolio-media', path);
      if (res.error) throw res.error;

      // 2. If user opted to auto-clear references, clear them
      if (isUsed && autoClearReferences) {
        await clearAllMediaReferences(fileUrl, file.name);
        await refreshData();
      }

      setDeletingFile(null);
      await loadFiles();
      showToast(`Asset "${file.name}" deleted from Supabase Storage.`, 'success');
    } catch (err: any) {
      setError(err?.message || 'Failed to delete file from Supabase Storage.');
      showToast(`Delete failed: ${err?.message || 'Permission denied'}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Replace Modal
  const openReplaceModal = (file: StorageFile) => {
    const usages = getAssetUsages(
      file.name,
      currentFolder,
      { ...portfolio, siteSettings },
      supabaseUrl
    );
    setReplacingFile({ file, usages });
    setReplacementFile(null);
    setReplacementPreview(null);
    setPreserveOriginalUrl(true);
  };

  // Handle Replacement File Selected
  const handleSelectReplacementFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > 10 * 1024 * 1024) {
      setError('Selected replacement file exceeds 10 MB limit.');
      return;
    }

    setReplacementFile(f);
    const reader = new FileReader();
    reader.onload = () => setReplacementPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  // Execute Replace
  const handleExecuteReplace = async () => {
    if (!replacingFile || !replacementFile) return;

    setIsReplacing(true);
    setError(null);

    try {
      const oldFileName = replacingFile.file.name;
      const oldPath = `${currentFolder}/${oldFileName}`;
      const oldUrl = getFilePublicUrl(oldFileName, currentFolder, replacingFile.file.dataUrl);

      let targetPath: string;
      if (preserveOriginalUrl) {
        // In-place replacement keeping same filename and URL
        targetPath = oldPath;
      } else {
        // Upload under new filename
        const ext = replacementFile.name.split('.').pop() || 'png';
        const cleanBase = replacementFile.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');
        targetPath = `${currentFolder}/${Date.now()}_${cleanBase}.${ext}`;
      }

      const res = await replaceStorageFile('portfolio-media', oldPath, targetPath, replacementFile);
      if (res.error) throw res.error;

      const newUrl = res.data?.publicUrl || getFilePublicUrl(targetPath.split('/').pop() || '', currentFolder);

      // If targetPath differed or new URL generated, update all database/portfolio references!
      if (!preserveOriginalUrl || newUrl !== oldUrl) {
        const updateRes = await updateAllMediaReferences(oldUrl, newUrl, oldFileName);
        if (updateRes.updatedCount > 0) {
          showToast(`Asset replaced and ${updateRes.updatedCount} portfolio reference(s) updated!`, 'success');
        } else {
          showToast('Asset replaced successfully in storage!', 'success');
        }
      } else {
        showToast('Asset replaced in-place! Public URL preserved.', 'success');
      }

      await refreshData();
      await loadFiles();
      setCacheBuster(Date.now());
      setReplacingFile(null);
    } catch (err: any) {
      setError(err?.message || 'Replacement failed. Check storage permissions.');
      showToast(`Replace failed: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsReplacing(false);
    }
  };

  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes || isNaN(bytes)) return 'File';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Filtered files list
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!file.name.toLowerCase().includes(query)) return false;
      }

      // Usage status filter
      if (filterUsage !== 'all') {
        const usages = getAssetUsages(
          file.name,
          currentFolder,
          { ...portfolio, siteSettings },
          supabaseUrl
        );
        if (filterUsage === 'used' && usages.length === 0) return false;
        if (filterUsage === 'unused' && usages.length > 0) return false;
      }

      return true;
    });
  }, [files, searchQuery, filterUsage, currentFolder, portfolio, siteSettings, supabaseUrl]);

  // Overall usage stats for current folder
  const currentFolderStats = useMemo(() => {
    let usedCount = 0;
    let unusedCount = 0;
    for (const f of files) {
      const usages = getAssetUsages(
        f.name,
        currentFolder,
        { ...portfolio, siteSettings },
        supabaseUrl
      );
      if (usages.length > 0) usedCount++;
      else unusedCount++;
    }
    return { usedCount, unusedCount, total: files.length };
  }, [files, currentFolder, portfolio, siteSettings, supabaseUrl]);

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all text-xs font-medium animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-800 text-rose-200'
              : 'bg-[#1E293B]/95 border-[#3B82F6]/40 text-blue-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          ) : (
            <Info className="h-4 w-4 text-blue-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Main Upload Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2937] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Media & Asset Manager</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Supabase Storage
            </span>
            {!isConfigured && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20"
                title="Supabase credentials not yet connected in Settings. Operating in demo storage mode."
              >
                Local / Demo Mode
              </span>
            )}
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Bucket: <code className="text-blue-400 font-mono">portfolio-media</code>. Manage photographs, project diagrams, and certificates with asset usage tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleFullRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#1F2937] bg-[#111827] text-xs font-medium text-[#CBD5E1] hover:text-white hover:border-[#38BDF8]/40 transition-colors disabled:opacity-50"
            title="Refresh assets and re-scan portfolio usages"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#38BDF8] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <label className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer shadow-md shadow-blue-600/20">
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
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Folder Navigation Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Folder Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['profile', 'projects', 'certificates'] as const).map((folder) => {
            const isActive = currentFolder === folder;
            const count = folderCounts[folder] || 0;
            return (
              <button
                key={folder}
                type="button"
                onClick={() => {
                  setCurrentFolder(folder);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E293B] text-white border border-[#60A5FA]/60 shadow-sm'
                    : 'bg-[#111827] text-[#94A3B8] hover:text-white border border-[#1F2937]'
                }`}
              >
                <Folder className={`h-3.5 w-3.5 ${isActive ? 'text-[#60A5FA]' : 'text-[#64748B]'}`} />
                <span>{folder}/</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans ${
                    isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-[#1E293B] text-[#64748B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-[#1F2937] bg-[#111827] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#60A5FA] w-40 sm:w-48 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Usage Filter Pills */}
          <div className="flex items-center rounded-xl border border-[#1F2937] bg-[#111827] p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setFilterUsage('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterUsage === 'all' ? 'bg-[#1E293B] text-white font-medium' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              All ({currentFolderStats.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterUsage('used')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterUsage === 'used'
                  ? 'bg-emerald-950/80 text-emerald-300 font-medium'
                  : 'text-[#94A3B8] hover:text-emerald-400'
              }`}
            >
              Used ({currentFolderStats.usedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterUsage('unused')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterUsage === 'unused'
                  ? 'bg-amber-950/80 text-amber-300 font-medium'
                  : 'text-[#94A3B8] hover:text-amber-400'
              }`}
            >
              Unused ({currentFolderStats.unusedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid Container */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-5 backdrop-blur-xl min-h-[340px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-56 text-xs text-[#94A3B8] gap-2.5">
            <RefreshCw className="h-5 w-5 animate-spin text-[#38BDF8]" />
            <span>Scanning Supabase Storage bucket & portfolio references...</span>
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file) => {
              const fileUrl = getFilePublicUrl(file.name, currentFolder, file.dataUrl);
              const previewUrl = `${fileUrl}${fileUrl.includes('?') ? '&' : '?'}t=${cacheBuster}`;
              const isPdf =
                file.name.toLowerCase().endsWith('.pdf') ||
                file.metadata?.mimetype === 'application/pdf';

              const usages = getAssetUsages(
                file.name,
                currentFolder,
                { ...portfolio, siteSettings },
                supabaseUrl
              );
              const isUsed = usages.length > 0;
              const formattedLabel = formatUsageLabel(usages);

              return (
                <div
                  key={file.name}
                  className="rounded-2xl border border-[#1F2937] bg-[#0B132B]/90 p-3.5 flex flex-col justify-between group hover:border-[#60A5FA]/50 transition-all shadow-md relative"
                >
                  {/* Top: Folder chip & Usage pill */}
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <span className="text-[10px] font-mono text-[#64748B] flex items-center gap-1">
                        <Folder className="h-3 w-3 text-[#38BDF8]" />
                        {currentFolder}/
                      </span>

                      {/* Usage Badge */}
                      {isUsed ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 max-w-[130px] truncate"
                          title={formattedLabel}
                        >
                          <CheckCircle2 className="h-2.5 w-2.5 shrink-0 text-emerald-400" />
                          <span className="truncate">{formattedLabel}</span>
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#94A3B8] bg-[#1E293B] border border-[#334155]/60"
                          title="This asset is not currently referenced anywhere on the portfolio."
                        >
                          Not currently used
                        </span>
                      )}
                    </div>

                    {/* Image / Document Preview with Zoom Overlay */}
                    <div className="aspect-video w-full rounded-xl bg-[#070D1E] overflow-hidden flex items-center justify-center mb-2.5 border border-[#1F2937] relative group-hover:border-[#38BDF8]/40 transition-colors">
                      {isPdf ? (
                        <div className="flex flex-col items-center justify-center p-3 text-[#CBD5E1] text-center">
                          <File className="h-8 w-8 text-rose-400 mb-1" />
                          <span className="text-[10px] font-mono text-rose-300 uppercase tracking-wider">PDF Document</span>
                        </div>
                      ) : (
                        <img
                          src={previewUrl}
                          alt={file.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback if image fails to render
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}

                      {/* Quick Zoom / Preview Action */}
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewAsset({
                            url: fileUrl,
                            name: file.name,
                            isPdf,
                          })
                        }
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white/80 hover:text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View Full Asset"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* File Meta */}
                    <h4 className="text-xs text-white font-medium truncate" title={file.name}>
                      {file.name}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] mt-0.5">
                      <span>{formatSize(file.metadata?.size)}</span>
                      <span>{file.created_at ? new Date(file.created_at).toLocaleDateString() : 'Storage'}</span>
                    </div>

                    {/* Explicit Usage Status Block */}
                    <div
                      className={`mt-2 p-2 rounded-xl text-[11px] leading-tight flex items-start gap-1.5 border ${
                        isUsed
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                          : 'bg-[#1E293B]/40 border-[#334155]/30 text-[#94A3B8]'
                      }`}
                    >
                      {isUsed ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="overflow-hidden">
                            <span className="font-semibold text-emerald-400">Used in: </span>
                            <span className="break-words">
                              {usages.map((u) => u.location.replace(/^Used in:\s*/i, '')).join(', ')}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-[#64748B] shrink-0 mt-0.5" />
                          <span>Not currently used</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions: Copy URL, Replace, Delete */}
                  <div className="mt-3 pt-3 border-t border-[#1F2937] space-y-1.5">
                    {/* Copy URL Button */}
                    <button
                      type="button"
                      onClick={() => copyUrl(file.name, file.dataUrl)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#111827] py-1.5 text-[11px] font-mono text-[#CBD5E1] hover:text-white hover:border-[#60A5FA] transition-colors"
                      title="Copy public URL to clipboard"
                    >
                      {copiedUrl === file.name ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    {/* Replace & Delete Grid */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Replace Button */}
                      <button
                        type="button"
                        onClick={() => openReplaceModal(file)}
                        className="flex items-center justify-center gap-1 rounded-lg border border-[#1F2937] bg-[#111827] py-1.5 text-[11px] font-medium text-[#CBD5E1] hover:text-[#38BDF8] hover:border-[#38BDF8]/50 hover:bg-[#38BDF8]/10 transition-colors cursor-pointer"
                        title="Replace this asset with a new file"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Replace</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => openDeleteDialog(file)}
                        className="flex items-center justify-center gap-1 rounded-lg border border-[#1F2937] bg-[#111827] py-1.5 text-[11px] font-medium text-rose-400 hover:text-rose-200 hover:border-rose-700/60 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete asset from storage"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-56 text-center text-[#64748B]">
            <Folder className="h-10 w-10 mb-2 opacity-40 text-[#60A5FA]" />
            <p className="text-xs text-[#CBD5E1] font-medium">
              {searchQuery || filterUsage !== 'all'
                ? 'No media files match your search filter.'
                : `No media files found in ${currentFolder}/ yet.`}
            </p>
            <p className="text-[11px] text-[#64748B] mt-1">
              {searchQuery || filterUsage !== 'all'
                ? 'Try clearing the search query or switching filters.'
                : 'Click "Upload" above to add images or documents.'}
            </p>
            {(searchQuery || filterUsage !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterUsage('all');
                }}
                className="mt-3 text-xs text-[#38BDF8] hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG (Protects in-use assets from silent deletion)   */}
      {/* ========================================================================= */}
      {deletingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-[#1F2937] bg-[#0B132B] p-6 shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              {deletingFile.usages.length > 0 ? (
                <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
              ) : (
                <div className="h-10 w-10 shrink-0 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Trash2 className="h-5 w-5" />
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-white">
                  {deletingFile.usages.length > 0 ? 'Asset Currently In Use' : 'Delete Media Asset'}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Folder: <code className="text-blue-400 font-mono">{currentFolder}/</code>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeletingFile(null)}
                className="ml-auto text-[#64748B] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Target File Card */}
            <div className="rounded-xl border border-[#1F2937] bg-[#111827] p-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-[#070D1E] border border-[#1F2937] flex items-center justify-center overflow-hidden shrink-0">
                {deletingFile.file.name.toLowerCase().endsWith('.pdf') ? (
                  <File className="h-6 w-6 text-rose-400" />
                ) : (
                  <img
                    src={getFilePublicUrl(deletingFile.file.name, currentFolder, deletingFile.file.dataUrl)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate" title={deletingFile.file.name}>
                  {deletingFile.file.name}
                </p>
                <p className="text-[10px] font-mono text-[#64748B]">
                  {formatSize(deletingFile.file.metadata?.size)} · {currentFolder}/{deletingFile.file.name}
                </p>
              </div>
            </div>

            {/* Usage Status Details */}
            {deletingFile.usages.length > 0 ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-600/40 bg-amber-950/30 p-3.5 text-xs text-amber-200">
                  <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                    Protected Asset: Referenced by live portfolio content!
                  </p>
                  <p className="mt-1.5 text-[11px] text-amber-200/90 leading-relaxed">
                    This file cannot be deleted silently because it is currently displayed on your website:
                  </p>
                  <ul className="mt-2 space-y-1 list-disc list-inside font-medium text-white">
                    {deletingFile.usages.map((u, i) => (
                      <li key={i}>{u.location}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[10px] text-amber-300/80">
                    Deleting this object from Supabase Storage will result in broken images on your public portfolio.
                  </p>
                </div>

                {/* Acknowledgement Checkboxes */}
                <div className="space-y-2 pt-1 text-xs">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[#CBD5E1] select-none">
                    <input
                      type="checkbox"
                      checked={deleteAcknowledged}
                      onChange={(e) => setDeleteAcknowledged(e.target.checked)}
                      className="mt-0.5 rounded border-[#1F2937] text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-[11px] leading-tight">
                      I understand this asset is currently in use and want to permanently delete it anyway.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-[#94A3B8] select-none">
                    <input
                      type="checkbox"
                      checked={autoClearReferences}
                      onChange={(e) => setAutoClearReferences(e.target.checked)}
                      className="mt-0.5 rounded border-[#1F2937] text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[11px] leading-tight">
                      Automatically clear referencing database fields so broken 404 image icons are not shown.
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-3 text-xs text-emerald-300">
                <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  Not currently used
                </p>
                <p className="mt-1 text-[11px] text-emerald-200/80">
                  This asset is safe to delete. No portfolio pages or sections currently reference this file.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1F2937]">
              <button
                type="button"
                onClick={() => setDeletingFile(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-[#1F2937] bg-[#111827] text-xs font-medium text-[#CBD5E1] hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting || (deletingFile.usages.length > 0 && !deleteAcknowledged)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-rose-900/30"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting from Storage...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Asset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REPLACE ASSET MODAL                                                       */}
      {/* ========================================================================= */}
      {replacingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#1F2937] bg-[#0B132B] p-6 shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-[#38BDF8]" />
                  Replace Media Asset
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Upload a replacement file. Content referencing this asset will update automatically without duplicates.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReplacingFile(null)}
                className="text-[#64748B] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Current Asset Info */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
                Current Asset in Storage
              </span>
              <div className="rounded-xl border border-[#1F2937] bg-[#111827] p-3 flex items-center gap-3">
                <div className="h-14 w-14 rounded-lg bg-[#070D1E] border border-[#1F2937] flex items-center justify-center overflow-hidden shrink-0">
                  {replacingFile.file.name.toLowerCase().endsWith('.pdf') ? (
                    <File className="h-7 w-7 text-rose-400" />
                  ) : (
                    <img
                      src={getFilePublicUrl(replacingFile.file.name, currentFolder, replacingFile.file.dataUrl)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-xs font-semibold text-white truncate">{replacingFile.file.name}</p>
                  <p className="text-[10px] font-mono text-[#64748B]">
                    {formatSize(replacingFile.file.metadata?.size)} · {currentFolder}/{replacingFile.file.name}
                  </p>
                  <p className="text-[10px] font-medium text-emerald-400 mt-1">
                    {formatUsageLabel(replacingFile.usages)}
                  </p>
                </div>
              </div>
            </div>

            {/* New File Selector & Comparison */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
                New Replacement File
              </span>

              {replacementFile ? (
                <div className="rounded-xl border border-blue-500/40 bg-blue-950/20 p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-14 w-14 rounded-lg bg-[#070D1E] border border-blue-500/30 flex items-center justify-center overflow-hidden shrink-0">
                      {replacementFile.type === 'application/pdf' ? (
                        <File className="h-7 w-7 text-rose-400" />
                      ) : (
                        <img src={replacementPreview || ''} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white truncate">{replacementFile.name}</p>
                      <p className="text-[10px] font-mono text-blue-300">{formatSize(replacementFile.size)}</p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <Check className="h-3 w-3" /> Ready to replace
                      </p>
                    </div>
                  </div>

                  <label className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer font-medium shrink-0 px-2 py-1 rounded-lg border border-blue-500/30 hover:bg-blue-500/10 transition-colors">
                    Change
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleSelectReplacementFile}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#1F2937] hover:border-[#38BDF8]/60 bg-[#111827]/60 p-6 cursor-pointer transition-colors group">
                  <Upload className="h-8 w-8 text-[#64748B] group-hover:text-[#38BDF8] transition-colors mb-2" />
                  <span className="text-xs font-semibold text-white">Select replacement file</span>
                  <span className="text-[11px] text-[#64748B] mt-0.5">JPG, PNG, WebP, SVG, or PDF up to 10 MB</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleSelectReplacementFile}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Replacement Strategy Option */}
            {replacementFile && (
              <div className="space-y-2 pt-1 border-t border-[#1F2937]">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#CBD5E1]">
                  <input
                    type="checkbox"
                    checked={preserveOriginalUrl}
                    onChange={(e) => setPreserveOriginalUrl(e.target.checked)}
                    className="mt-0.5 rounded border-[#1F2937] text-blue-600 focus:ring-blue-500"
                  />
                  <div className="leading-tight">
                    <span className="font-semibold text-white">Preserve existing URL (In-place overwrite)</span>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Recommended: keeps <code className="font-mono text-blue-300">{currentFolder}/{replacingFile.file.name}</code> so all external and internal links continue working instantly.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1F2937]">
              <button
                type="button"
                onClick={() => setReplacingFile(null)}
                disabled={isReplacing}
                className="px-4 py-2 rounded-xl border border-[#1F2937] bg-[#111827] text-xs font-medium text-[#CBD5E1] hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteReplace}
                disabled={!replacementFile || isReplacing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
              >
                {isReplacing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Uploading Replacement...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Confirm Replace</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIGHTBOX / FULL PREVIEW MODAL                                             */}
      {/* ========================================================================= */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-2xl border border-[#1F2937] bg-[#0B132B] p-5 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2937] mb-3">
              <h3 className="text-xs font-mono text-white truncate max-w-md">{previewAsset.name}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewAsset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded-lg border border-[#1F2937] bg-[#111827] text-[11px] font-mono text-[#CBD5E1] hover:text-white"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Open URL</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewAsset(null)}
                  className="text-[#64748B] hover:text-white p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto rounded-xl bg-black/60 border border-[#1F2937] flex items-center justify-center min-h-[300px]">
              {previewAsset.isPdf ? (
                <iframe src={previewAsset.url} title={previewAsset.name} className="w-full h-[600px] rounded-xl" />
              ) : (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.name}
                  className="max-h-[600px] w-auto object-contain rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
