'use client';

import React, { useState } from 'react';
import { Briefcase, Plus, Edit3, Trash2, X, AlertCircle, RefreshCw } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { createExperience, updateExperience, deleteExperience } from '@/lib/supabase/api';

export function StudioExperience() {
  const { experiences, refreshData } = usePortfolio();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    company: '',
    role: '',
    period: '',
    location: '',
    type: 'Industrial Internship',
    description: '',
    responsibilities: '',
    technologies: '',
    sort_order: 1,
  });

  const startAdd = () => {
    setEditingId(null);
    setForm({
      company: '',
      role: '',
      period: '',
      location: 'Hyderabad, India',
      type: 'Industrial Internship',
      description: '',
      responsibilities: '',
      technologies: '',
      sort_order: experiences.length + 1,
    });
    setIsAddingNew(true);
    setError(null);
  };

  const startEdit = (item: any) => {
    setIsAddingNew(false);
    setEditingId(item.id);
    setForm({
      company: item.company,
      role: item.role,
      period: item.period,
      location: item.location || '',
      type: item.type || 'Industrial Internship',
      description: item.description || '',
      responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities.join('\n') : '',
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
      sort_order: item.sort_order || 1,
    });
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const responsibilitiesArr = form.responsibilities
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const technologiesArr = form.technologies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (isAddingNew) {
        const res = await createExperience({
          company: form.company,
          role: form.role,
          period: form.period,
          location: form.location,
          type: form.type,
          description: form.description,
          responsibilities: responsibilitiesArr,
          technologies: technologiesArr,
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      } else if (editingId) {
        const res = await updateExperience(editingId, {
          company: form.company,
          role: form.role,
          period: form.period,
          location: form.location,
          type: form.type,
          description: form.description,
          responsibilities: responsibilitiesArr,
          technologies: technologiesArr,
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      }

      await refreshData();
      setIsAddingNew(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save experience record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    setLoading(true);
    try {
      const res = await deleteExperience(id);
      if (res.error) throw res.error;
      await refreshData();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Experience & Internships</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Manage core industrial internships, company affiliations, and work responsibilities.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Experience</span>
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Modal/Form */}
      {(isAddingNew || editingId) && (
        <form onSubmit={handleSave} className="rounded-2xl border border-[#2563EB]/40 bg-[#111827] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
            <h3 className="text-sm font-semibold text-white">
              {isAddingNew ? 'Add Experience / Internship' : 'Edit Experience Details'}
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
                Company / Organization
              </label>
              <input
                type="text"
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Pooja & Company"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Role / Designation
              </label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Industrial Intern"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Period
              </label>
              <input
                type="text"
                required
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                placeholder="May 2026 – June 2026"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Visakhapatnam, India"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Type
              </label>
              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Industrial Internship"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
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
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              Short Summary Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              Responsibilities & Exposure (1 per line)
            </label>
            <textarea
              rows={3}
              value={form.responsibilities}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-sm text-white focus:border-[#60A5FA] outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              Technologies / Domains (Comma separated)
            </label>
            <input
              type="text"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              placeholder="Electrical Drives, Motor Control, Elecon"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
            />
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
              <span>Save Record</span>
            </button>
          </div>
        </form>
      )}

      {/* List of Experience */}
      <div className="space-y-4">
        {experiences.map((item: any) => (
          <div
            key={item.id || item.company}
            className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-semibold text-white">{item.role}</h4>
                <span className="text-xs text-[#A5B4FC]">@ {item.company}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1]">{item.period} · {item.location}</p>
              {item.description && (
                <p className="text-xs text-[#94A3B8] pt-1">{item.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="p-2 rounded-xl border border-[#1F2937] bg-[#0B132B] text-[#94A3B8] hover:text-white transition-colors"
                title="Edit"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              {item.id && (
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl border border-rose-900/40 bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
