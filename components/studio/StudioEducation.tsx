'use client';

import React, { useState } from 'react';
import { GraduationCap, Plus, Edit3, Trash2, Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { createEducation, updateEducation, deleteEducation } from '@/lib/supabase/api';
import type { Database } from '@/lib/supabase/types';

export function StudioEducation() {
  const { education, refreshData } = usePortfolio();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    institution: '',
    degree: '',
    period: '',
    score: '',
    score_label: 'CGPA',
    description: '',
    highlights: '',
    sort_order: 1,
  });

  const startAdd = () => {
    setEditingId(null);
    setForm({
      institution: '',
      degree: '',
      period: '',
      score: '',
      score_label: 'CGPA',
      description: '',
      highlights: '',
      sort_order: education.length + 1,
    });
    setIsAddingNew(true);
    setError(null);
  };

  const startEdit = (item: any) => {
    setIsAddingNew(false);
    setEditingId(item.id);
    setForm({
      institution: item.institution,
      degree: item.degree,
      period: item.period,
      score: item.score,
      score_label: item.scoreLabel || 'CGPA',
      description: item.description || '',
      highlights: Array.isArray(item.highlights) ? item.highlights.join('\n') : '',
      sort_order: item.sort_order || 1,
    });
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const highlightsArray = form.highlights
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (isAddingNew) {
        const res = await createEducation({
          institution: form.institution,
          degree: form.degree,
          period: form.period,
          score: form.score,
          score_label: form.score_label,
          description: form.description,
          highlights: highlightsArray,
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      } else if (editingId) {
        const res = await updateEducation(editingId, {
          institution: form.institution,
          degree: form.degree,
          period: form.period,
          score: form.score,
          score_label: form.score_label,
          description: form.description,
          highlights: highlightsArray,
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      }

      await refreshData();
      setIsAddingNew(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save education record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this education record?')) return;
    setLoading(true);
    try {
      const res = await deleteEducation(id);
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
          <h2 className="text-xl font-bold text-white">Education History</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Manage academic degrees, institutions, GPA scores, and course highlights.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Education</span>
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
              {isAddingNew ? 'Add New Academic Degree' : 'Edit Degree Details'}
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
                Institution Name
              </label>
              <input
                type="text"
                required
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                placeholder="Malla Reddy Engineering College for Women"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Degree & Field of Study
              </label>
              <input
                type="text"
                required
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="B.Tech — Electrical and Electronics Engineering"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Academic Period
              </label>
              <input
                type="text"
                required
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                placeholder="2023–2027"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Score / Percentage
              </label>
              <input
                type="text"
                required
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                placeholder="8.08"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Score Type
              </label>
              <input
                type="text"
                value={form.score_label}
                onChange={(e) => setForm({ ...form, score_label: e.target.value })}
                placeholder="CGPA or Percentage"
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
              Description
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
              Key Highlights (1 per line)
            </label>
            <textarea
              rows={3}
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              placeholder="Coursework in Power Electronics&#10;Practical laboratories in MATLAB"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-sm text-white focus:border-[#60A5FA] outline-none font-mono text-xs"
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

      {/* List of Education records */}
      <div className="space-y-4">
        {education.map((item: any) => (
          <div
            key={item.id || item.degree}
            className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-semibold text-white">{item.degree}</h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.score} {item.scoreLabel}
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1]">{item.institution}</p>
              <p className="text-[11px] font-mono text-[#A5B4FC]">{item.period}</p>
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
