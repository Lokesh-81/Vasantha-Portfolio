'use client';

import React, { useState } from 'react';
import { Wrench, Plus, Edit3, Trash2, X, AlertCircle, RefreshCw } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { createSkill, updateSkill, deleteSkill } from '@/lib/supabase/api';
import { skillCategories } from '@/lib/data/portfolio-data';

export function StudioSkills() {
  const { skills, refreshData } = usePortfolio();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Programming Languages',
    level: 'Core',
    sort_order: 1,
  });

  const startAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      category: selectedCategory !== 'All' ? selectedCategory : 'Programming Languages',
      level: 'Core',
      sort_order: skills.length + 1,
    });
    setIsAddingNew(true);
    setError(null);
  };

  const startEdit = (item: any) => {
    setIsAddingNew(false);
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      level: item.level || 'Core',
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
        const res = await createSkill({
          name: form.name.trim(),
          category: form.category,
          level: form.level,
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      } else if (editingId) {
        const res = await updateSkill(editingId, {
          name: form.name.trim(),
          category: form.category,
          level: form.level,
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      }

      await refreshData();
      setIsAddingNew(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this skill?')) return;
    setLoading(true);
    try {
      const res = await deleteSkill(id);
      if (res.error) throw res.error;
      await refreshData();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete skill');
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Skills & Competencies</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Manage technical proficiencies, tools, AI stacks, and soft skills.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Skill</span>
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-[#2563EB] text-white'
              : 'bg-[#111827] text-[#94A3B8] hover:text-white border border-[#1F2937]'
          }`}
        >
          All ({skills.length})
        </button>
        {skillCategories.map((cat) => {
          const count = skills.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#111827] text-[#94A3B8] hover:text-white border border-[#1F2937]'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Form modal */}
      {(isAddingNew || editingId) && (
        <form onSubmit={handleSave} className="rounded-2xl border border-[#2563EB]/40 bg-[#111827] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
            <h3 className="text-sm font-semibold text-white">
              {isAddingNew ? 'Add Technical Skill' : 'Edit Skill Details'}
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

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Skill Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="MATLAB"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              >
                {skillCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Proficiency Level
              </label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              >
                <option value="Core">Core</option>
                <option value="Working Knowledge">Working Knowledge</option>
                <option value="Familiar">Familiar</option>
              </select>
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
              <span>Save Skill</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid of skills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredSkills.map((skill: any) => (
          <div
            key={skill.id || skill.name}
            className="rounded-xl border border-[#1F2937] bg-[#111827]/80 p-3.5 flex items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{skill.name}</p>
              <p className="text-[10px] font-mono text-[#A5B4FC] truncate">{skill.category}</p>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0B132B] text-[#94A3B8] border border-[#1F2937]/80 inline-block mt-1">
                {skill.level}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(skill)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              {skill.id && (
                <button
                  type="button"
                  onClick={() => handleDelete(skill.id)}
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
