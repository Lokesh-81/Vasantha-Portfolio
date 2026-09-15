'use client';

import React, { useState } from 'react';
import { Mail, Trash2, CheckCircle2, Archive, AlertCircle, RefreshCw, Reply, Phone, Clock, Eye } from 'lucide-react';
import type { Database } from '@/lib/supabase/types';
import { updateMessageStatus, deleteContactMessage } from '@/lib/supabase/api';

type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];

interface StudioMessagesProps {
  messages: ContactMessage[];
  onRefresh: () => void;
}

export function StudioMessages({ messages, onRefresh }: StudioMessagesProps) {
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const filtered = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const handleStatusChange = async (id: string, status: 'new' | 'read' | 'archived') => {
    setLoadingAction(true);
    try {
      await updateMessageStatus(id, status);
      onRefresh();
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage({ ...activeMessage, status });
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setLoadingAction(true);
    try {
      await deleteContactMessage(id);
      onRefresh();
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage(null);
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const openMessage = (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (msg.status === 'new') {
      handleStatusChange(msg.id, 'read');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Contact Inquiries Inbox</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Read and organize direct messages submitted from your public portfolio contact form.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] p-1 text-xs">
          {(['all', 'new', 'read', 'archived'] as const).map((tab) => {
            const count = messages.filter((m) => (tab === 'all' ? true : m.status === tab)).length;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-mono capitalize transition-colors cursor-pointer ${
                  filter === tab
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Message list */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.length > 0 ? (
            filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeMessage?.id === msg.id
                    ? 'border-[#60A5FA] bg-[#1E293B]/80 shadow-lg'
                    : msg.status === 'new'
                    ? 'border-rose-500/30 bg-[#111827]/90 hover:border-rose-500/60'
                    : 'border-[#1F2937] bg-[#111827]/60 hover:border-[#374151]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-white truncate">{msg.name}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      msg.status === 'new'
                        ? 'bg-rose-500/20 text-rose-300'
                        : msg.status === 'read'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#CBD5E1] line-clamp-1">{msg.subject || 'General Inquiry'}</p>
                <p className="text-[11px] text-[#94A3B8] line-clamp-2 mt-1">{msg.message}</p>
                <div className="mt-2 text-[10px] font-mono text-[#64748B] flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(msg.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 rounded-2xl border border-[#1F2937] bg-[#111827]/40 text-center text-xs text-[#64748B]">
              No messages found in this view.
            </div>
          )}
        </div>

        {/* Right: Message Detail Viewer */}
        <div className="lg:col-span-7">
          {activeMessage ? (
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/90 p-6 backdrop-blur-xl space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-[#1F2937] pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {activeMessage.subject || 'General Inquiry'}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#CBD5E1]">
                    <span className="font-semibold text-white">{activeMessage.name}</span>
                    <span className="text-[#64748B]">·</span>
                    <a
                      href={`mailto:${activeMessage.email}`}
                      className="text-[#60A5FA] hover:underline font-mono"
                    >
                      {activeMessage.email}
                    </a>
                    {activeMessage.phone && (
                      <>
                        <span className="text-[#64748B]">·</span>
                        <span className="text-[#94A3B8] font-mono">{activeMessage.phone}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || 'Inquiry')}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    <span>Reply</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(activeMessage.id)}
                    className="p-1.5 rounded-xl border border-rose-900/40 bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#64748B] block mb-2">
                  Message Content
                </span>
                <div className="rounded-xl border border-[#1F2937] bg-[#0B132B] p-4 text-xs sm:text-sm text-[#E0E7FF] leading-relaxed whitespace-pre-wrap">
                  {activeMessage.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1F2937] text-xs">
                <span className="text-[11px] font-mono text-[#64748B]">
                  Sent: {new Date(activeMessage.created_at).toLocaleString()}
                </span>

                <div className="flex items-center gap-2">
                  {activeMessage.status !== 'read' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeMessage.id, 'read')}
                      className="px-3 py-1 rounded-lg border border-[#1F2937] text-xs text-[#CBD5E1] hover:text-white"
                    >
                      Mark Read
                    </button>
                  )}
                  {activeMessage.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeMessage.id, 'archived')}
                      className="px-3 py-1 rounded-lg border border-[#1F2937] text-xs text-[#CBD5E1] hover:text-white"
                    >
                      Archive
                    </button>
                  )}
                  {activeMessage.status !== 'new' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeMessage.id, 'new')}
                      className="px-3 py-1 rounded-lg border border-[#1F2937] text-xs text-[#CBD5E1] hover:text-white"
                    >
                      Mark Unread
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] rounded-2xl border border-[#1F2937] bg-[#111827]/40 flex flex-col items-center justify-center p-8 text-center text-[#64748B]">
              <Mail className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-xs">Select any message on the left to read full details and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
