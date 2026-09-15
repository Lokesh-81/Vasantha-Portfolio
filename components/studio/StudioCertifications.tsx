'use client';

import React, { useState } from 'react';
import { Award, Plus, Edit3, Trash2, X, AlertCircle, RefreshCw, Upload } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { createCertification, updateCertification, deleteCertification, uploadStorageFile } from '@/lib/supabase/api';

export function StudioCertifications() {
  const { certifications, refreshData } = usePortfolio();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    issuer: '',
    badge_color: '#60A5FA',
    certificate_url: '',
    sort_order: 1,
  });

  const startAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      issuer: '',
      badge_color: '#60A5FA',
      certificate_url: '',
      sort_order: certifications.length + 1,
    });
    setIsAddingNew(true);
    setError(null);
  };

  const startEdit = (item: any) => {
    setIsAddingNew(false);
    setEditingId(item.id);
    setForm({
      title: item.title,
      issuer: item.issuer,
      badge_color: item.badgeColor || '#60A5FA',
      certificate_url: item.certificate_url || '',
      sort_order: item.sort_order || 1,
    });
    setError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCert(true);
    setError(null);

    try {
      const ext = file.name.split('.').pop() || 'pdf';
      const path = `certificates/cert_${Date.now()}.${ext}`;
      const res = await uploadStorageFile('portfolio-media', path, file);

      if (res.error) throw res.error;
      if (res.data?.publicUrl) {
        setForm((prev) => ({ ...prev, certificate_url: res.data.publicUrl }));
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload certificate document');
    } finally {
      setUploadingCert(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isAddingNew) {
        const res = await createCertification({
          title: form.title.trim(),
          issuer: form.issuer.trim(),
          badge_color: form.badge_color,
          certificate_url: form.certificate_url || null,
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      } else if (editingId) {
        const res = await updateCertification(editingId, {
          title: form.title.trim(),
          issuer: form.issuer.trim(),
          badge_color: form.badge_color,
          certificate_url: form.certificate_url || null,
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      }

      await refreshData();
      setIsAddingNew(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save certification');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    setLoading(true);
    try {
      const res = await deleteCertification(id);
      if (res.error) throw res.error;
      await refreshData();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete certification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Certifications & Credentials</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Manage industry certifications, course completions, and verified credentials.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Certification</span>
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Modal */}
      {(isAddingNew || editingId) && (
        <form onSubmit={handleSave} className="rounded-2xl border border-[#2563EB]/40 bg-[#111827] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
            <h3 className="text-sm font-semibold text-white">
              {isAddingNew ? 'Add Certification' : 'Edit Certification Details'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
              className="text-[#94A3B8] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Certification Title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Electric Vehicle's Basics"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Issuing Organization
              </label>
              <input
                type="text"
                required
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                placeholder="NSIC / Infosys SpringBoard / NPTEL"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Accent Color (Hex)
              </label>
              <input
                type="text"
                value={form.badge_color}
                onChange={(e) => setForm({ ...form, badge_color: e.target.value })}
                placeholder="#60A5FA"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Upload Certificate Proof
              </label>
              <label className="flex items-center justify-center gap-2 rounded-xl bg-[#1F2937] hover:bg-[#374151] px-3 py-2 text-xs font-semibold text-white cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5" />
                <span>{uploadingCert ? 'Uploading...' : 'Attach File'}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  disabled={uploadingCert}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
              className="px-4 py-2 rounded-xl border border-[#1F2937] text-xs font-semibold text-[#94A3B8] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563EB] text-xs font-semibold text-white hover:bg-[#1D4ED8]"
            >
              {loading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Certification</span>
            </button>
          </div>
        </form>
      )}

      {/* Certifications List */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {certifications.map((item: any) => (
          <div
            key={item.id || item.title}
            className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-5 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.badgeColor || '#60A5FA' }}
                />
                <span className="text-[10px] font-mono text-[#A5B4FC]">{item.issuer}</span>
              </div>
              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1F2937] mt-4">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              {item.id && (
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
