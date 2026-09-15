'use client';

import React, { useState } from 'react';
import { Languages as LangIcon, Plus, Edit3, Trash2, X, AlertCircle, RefreshCw } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { createLanguage, updateLanguage, deleteLanguage } from '@/lib/supabase/api';

export function StudioLanguages() {
  const { languages, refreshData } = usePortfolio();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    language: '',
    proficiency: 'Fluent',
    level_percentage: 100,
    sort_order: 1,
  });

  const startAdd = () => {
    setEditingId(null);
    setForm({
      language: '',
      proficiency: 'Fluent',
      level_percentage: 100,
      sort_order: (languages?.length || 0) + 1,
    });
    setIsAddingNew(true);
    setError(null);
  };

  const startEdit = (item: any) => {
    setIsAddingNew(false);
    setEditingId(item.id || item.language);
    setForm({
      language: item.language,
      proficiency: item.proficiency || 'Fluent',
      level_percentage: item.levelPercentage || 100,
      sort_order: item.sort_order || 1,
    });
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isAddingNew) {
        const res = await createLanguage({
          language: form.language.trim(),
          proficiency: form.proficiency.trim(),
          level_percentage: Number(form.level_percentage),
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      } else if (editingId) {
        const res = await updateLanguage(editingId, {
          language: form.language.trim(),
          proficiency: form.proficiency.trim(),
          level_percentage: Number(form.level_percentage),
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      }

      await refreshData();
      setIsAddingNew(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save language');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this language?')) return;
    setLoading(true);
    try {
      const res = await deleteLanguage(id);
      if (res.error) throw res.error;
      await refreshData();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete language');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Communication Languages</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Manage multilingual communication proficiencies displayed on the public portfolio.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Language</span>
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
              {isAddingNew ? 'Add Language' : 'Edit Language Proficiency'}
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

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Language
              </label>
              <input
                type="text"
                required
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                placeholder="English / Telugu / French"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Proficiency Description
              </label>
              <input
                type="text"
                required
                value={form.proficiency}
                onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
                placeholder="Fluent / Conversational / Basic"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Proficiency Level (0–100%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.level_percentage}
                onChange={(e) => setForm({ ...form, level_percentage: Number(e.target.value) })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
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
              <span>Save Language</span>
            </button>
          </div>
        </form>
      )}

      {/* Languages List */}
      <div className="grid gap-3 sm:grid-cols-2">
        {languages?.map((item: any) => (
          <div
            key={item.id || item.language}
            className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-4 backdrop-blur-xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <LangIcon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{item.language}</h4>
                <p className="text-xs text-[#CBD5E1]">{item.proficiency} ({item.levelPercentage}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
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
