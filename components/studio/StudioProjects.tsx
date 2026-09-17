'use client';

import React, { useState } from 'react';
import { FolderGit2, Plus, Edit3, Trash2, X, AlertCircle, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { createProject, updateProject, deleteProject, uploadStorageFile } from '@/lib/supabase/api';

export function StudioProjects() {
  const { projects, refreshData } = usePortfolio();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    number: '01',
    name: '',
    category: 'Power Systems & Grid Stability',
    tagline: '',
    description: '',
    details: '',
    technologies: '',
    year: '2024 – 2025',
    status: 'Completed',
    accent_color: '#60A5FA',
    graphic_type: 'fidvr',
    image_url: '',
    sort_order: 1,
  });

  const startAdd = () => {
    setEditingId(null);
    setForm({
      number: `0${projects.length + 1}`,
      name: '',
      category: 'Power Systems & Grid Stability',
      tagline: '',
      description: '',
      details: '',
      technologies: '',
      year: '2024 – 2025',
      status: 'Completed',
      accent_color: '#60A5FA',
      graphic_type: 'fidvr',
      image_url: '',
      sort_order: projects.length + 1,
    });
    setIsAddingNew(true);
    setError(null);
  };

  const startEdit = (item: any) => {
    setIsAddingNew(false);
    setEditingId(item.id);
    setForm({
      number: item.number || '01',
      name: item.name,
      category: item.category,
      tagline: item.tagline || '',
      description: item.description,
      details: Array.isArray(item.details) ? item.details.join('\n') : '',
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
      year: item.year || '2024 – 2025',
      status: item.status || 'Completed',
      accent_color: item.accentColor || item.accent_color || '#60A5FA',
      graphic_type: item.graphicType || item.graphic_type || 'none',
      image_url: item.imageUrl || item.image_url || '',
      sort_order: item.sort_order || 1,
    });
    setError(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `projects/project_${Date.now()}.${ext}`;
      const res = await uploadStorageFile('portfolio-media', path, file);

      if (res.error) throw res.error;
      if (res.data?.publicUrl) {
        setForm((prev) => ({ ...prev, image_url: res.data.publicUrl }));
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload project image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const detailsArr = form.details
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const techArr = form.technologies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (isAddingNew) {
        const res = await createProject({
          number: form.number,
          name: form.name,
          category: form.category,
          tagline: form.tagline,
          description: form.description,
          details: detailsArr,
          technologies: techArr,
          year: form.year,
          status: form.status,
          accent_color: form.accent_color,
          graphic_type: form.graphic_type,
          image_url: form.image_url || null,
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      } else if (editingId) {
        const res = await updateProject(editingId, {
          number: form.number,
          name: form.name,
          category: form.category,
          tagline: form.tagline,
          description: form.description,
          details: detailsArr,
          technologies: techArr,
          year: form.year,
          status: form.status,
          accent_color: form.accent_color,
          graphic_type: form.graphic_type,
          image_url: form.image_url || null,
          sort_order: form.sort_order,
        });
        if (res.error) throw res.error;
      }

      await refreshData();
      setIsAddingNew(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save project record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setLoading(true);
    try {
      const res = await deleteProject(id);
      if (res.error) throw res.error;
      await refreshData();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Technical Projects</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Manage engineering and research projects, simulations, and interactive details.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            type="button"
            onClick={startAdd}
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Project Form */}
      {(isAddingNew || editingId) && (
        <form onSubmit={handleSave} className="rounded-2xl border border-[#2563EB]/40 bg-[#111827] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
            <h3 className="text-sm font-semibold text-white">
              {isAddingNew ? 'Create New Project' : 'Edit Project Details'}
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
                Project Number
              </label>
              <input
                type="text"
                required
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                placeholder="01"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Project Title
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Mitigation of Fault-Induced Delayed Voltage Recovery..."
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Category
              </label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Power Systems & Grid Stability"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Timeline / Year
              </label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2024 – 2025"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Status
              </label>
              <input
                type="text"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                placeholder="Completed"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              Tagline (Short Summary)
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Dynamic voltage support & fault mitigation using solar PV-STATCOM controllers"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              Main Description
            </label>
            <textarea
              rows={2}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-sm text-white focus:border-[#60A5FA] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              Technical Details / Bullet Points (1 per line)
            </label>
            <textarea
              rows={4}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-sm text-white focus:border-[#60A5FA] outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
              Technologies (Comma-separated)
            </label>
            <input
              type="text"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              placeholder="MATLAB, Simulink, PV-STATCOM, Power Systems"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Visual Graphic / Architecture Style
              </label>
              <select
                value={form.graphic_type}
                onChange={(e) => setForm({ ...form, graphic_type: e.target.value })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              >
                <option value="none">None (Clean card without graphic/image)</option>
                <option value="fidvr">MATLAB / Simulink FIDVR Voltage Waveform</option>
                <option value="battery">Smart Charge Guardian Embedded Architecture</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A5B4FC] mb-1">
                Accent Color (Hex)
              </label>
              <input
                type="text"
                value={form.accent_color}
                onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                placeholder="#A78BFA"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-sm text-white focus:border-[#60A5FA] outline-none"
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="rounded-xl border border-[#1F2937] bg-[#0B132B] p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-white block">Project Graphic / Screenshot</span>
              <span className="text-[11px] text-[#94A3B8]">
                {form.image_url ? 'Custom image uploaded from Supabase Storage' : 'Defaulting to interactive technical schematic'}
              </span>
            </div>

            <label className="flex items-center gap-2 rounded-xl bg-[#1F2937] hover:bg-[#374151] px-3.5 py-1.5 text-xs font-semibold text-white cursor-pointer transition-colors">
              <Upload className="h-3.5 w-3.5" />
              <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
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
              <span>Save Project</span>
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj: any) => (
          <div
            key={proj.id || proj.name}
            className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#60A5FA]">{proj.number}</span>
                <h4 className="text-sm font-semibold text-white">{proj.name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {proj.category}
                </span>
              </div>
              {proj.tagline && (
                <p className="text-xs text-[#CBD5E1] font-medium">{proj.tagline}</p>
              )}
              <p className="text-xs text-[#94A3B8] line-clamp-2">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.technologies?.map((tech: string) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0B132B] text-[#A5B4FC] border border-[#1F2937]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(proj)}
                className="p-2 rounded-xl border border-[#1F2937] bg-[#0B132B] text-[#94A3B8] hover:text-white transition-colors"
                title="Edit"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              {proj.id && (
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id)}
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
