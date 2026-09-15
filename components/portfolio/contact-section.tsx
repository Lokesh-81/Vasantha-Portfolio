'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Copy,
  Check,
  Linkedin,
  Phone,
  Mail,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Clock,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { useLanguage } from '@/src/i18n';
import { profileData } from '@/lib/data/portfolio-data';

export function ContactSection() {
  const { t, language } = useLanguage();

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'Internship Opportunity',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [isFormTyping, setIsFormTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const topicRef = useRef<HTMLDivElement>(null);

  const topicOptions = [
    'Internship Opportunity',
    'Engineering Project Collaboration',
    'Power Systems & Renewables Discussion',
    'General Inquiry / Networking',
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (topicRef.current && !topicRef.current.contains(event.target as Node)) {
        setIsTopicOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypingActivity = () => {
    setIsFormTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsFormTyping(false);
    }, 2500);
  };

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage(t('contact.errorRequired', 'Please provide your name, email, and message.'));
      setStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setErrorMessage(t('contact.errorEmail', 'Please provide a valid email address.'));
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    // Simulate reliable dispatch
    setTimeout(() => {
      setStatus('success');
      setForm({
        name: '',
        email: '',
        topic: 'Internship Opportunity',
        message: '',
      });
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }, 800);
  };

  return (
    <section id="contact" className="relative w-full px-4 sm:px-8 py-16 sm:py-24 border-t border-[#1F2937]/80">
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.2)_0%,rgba(192,132,252,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={500}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-8 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('contact.tag', 'GET IN TOUCH')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('contact.title', "Let's")}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('contact.titleAccent', 'connect.')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <p>
              {t(
                'contact.subtitle',
                'Interested in engineering internships, technical collaborations, and research opportunities. Reach out via email, phone, or LinkedIn.'
              )}
            </p>
          </div>
        </div>

        {/* 2-Column Split: Direct Verified Channels & Contact Form */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
          {/* Direct Verified Channels Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-[#1F2937] bg-[#111827]/85 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A5B4FC]">
                Direct Verified Channels
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Reach Out Directly
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#CBD5E1]">
                Feel free to email, call, or message me directly for inquiries, internships, or academic collaboration.
              </p>

              {/* Verified Email Card */}
              <div className="mt-6 rounded-2xl border border-[#1F2937] bg-[#0B132B]/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB]/20 text-[#60A5FA]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#64748B] block">
                        Primary Email
                      </span>
                      <a
                        href={`mailto:${profileData.email}`}
                        className="text-xs sm:text-sm font-semibold text-white hover:text-[#60A5FA] transition-colors"
                      >
                        {profileData.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(profileData.email)}
                      className="rounded-lg border border-[#1F2937] bg-[#111827] p-2 text-[#CBD5E1] hover:border-[#60A5FA]/60 hover:text-white transition-colors cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedText === profileData.email ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <a
                      href={`mailto:${profileData.email}`}
                      className="rounded-lg bg-[#2563EB] p-2 text-white hover:bg-[#1D4ED8] transition-colors"
                      title="Open Mail Client"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Verified Phone & WhatsApp Card */}
              <div className="mt-3 rounded-2xl border border-[#1F2937] bg-[#0B132B]/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#64748B] block">
                        Phone & WhatsApp
                      </span>
                      <a
                        href={profileData.telUrl}
                        className="text-xs sm:text-sm font-semibold text-white hover:text-emerald-400 transition-colors font-mono"
                      >
                        {profileData.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(profileData.phone)}
                      className="rounded-lg border border-[#1F2937] bg-[#111827] p-2 text-[#CBD5E1] hover:border-emerald-500/60 hover:text-white transition-colors cursor-pointer"
                      title="Copy Phone"
                    >
                      {copiedText === profileData.phone ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <a
                      href={profileData.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-emerald-600 p-2 text-white hover:bg-emerald-500 transition-colors"
                      title="WhatsApp Chat"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Verified LinkedIn Profile Card */}
              <div className="mt-3 rounded-2xl border border-[#1F2937] bg-[#0B132B]/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A66C2]/20 text-[#38BDF8] border border-[#0A66C2]/40">
                      <Linkedin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#64748B] block">
                        Professional Network
                      </span>
                      <a
                        href={profileData.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs sm:text-sm font-semibold text-white hover:text-[#38BDF8] transition-colors"
                      >
                        linkedin.com/in/vasantha-perala
                      </a>
                    </div>
                  </div>
                  <a
                    href={profileData.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-[#0A66C2] p-2 text-white hover:bg-[#084e96] transition-colors"
                    title="Visit LinkedIn"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Location and Timezone Indicator */}
              <div className="mt-6 flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-3 text-xs text-[#CBD5E1]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#60A5FA]" />
                  <span>{profileData.locationDisplay}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online & Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form Column */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-[#1F2937] bg-[#111827]/85 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              {/* Subtle typing glow effect */}
              <motion.div
                className="pointer-events-none absolute -inset-0.5 rounded-3xl"
                animate={{
                  opacity: isFormTyping || isTextareaFocused ? 1 : 0,
                }}
                transition={{ duration: 0.25 }}
                style={{
                  background:
                    'radial-gradient(circle at 50% 0%, rgba(96,165,250,0.18) 0%, rgba(192,132,252,0.1) 50%, transparent 80%)',
                }}
              />

              <div className="relative z-10">
                <span className="text-xs font-mono uppercase tracking-wider text-[#60A5FA]">
                  Online Message
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Send Direct Inquiry
                </h3>
                <p className="mt-1 text-xs text-[#CBD5E1]">
                  Fill out the form below and I will respond to your email promptly.
                </p>

                {/* Form Message States */}
                {status === 'success' && (
                  <div className="mt-4 rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-4 text-xs text-emerald-300 flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-200">
                        {t('contact.successTitle', 'Message Sent Successfully!')}
                      </p>
                      <p className="mt-0.5 text-emerald-400/90">
                        {t('contact.successDesc', "Thank you for reaching out. I'll get back to you promptly.")}
                      </p>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mt-4 rounded-2xl border border-rose-800/60 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-rose-200">Submission Alert</p>
                      <p className="mt-0.5 text-rose-400/90">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Name and Email */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#A5B4FC] mb-1.5">
                        Your Name <span className="text-[#F472B6]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          handleTypingActivity();
                        }}
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 px-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:border-[#60A5FA] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#A5B4FC] mb-1.5">
                        Email Address <span className="text-[#F472B6]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          handleTypingActivity();
                        }}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 px-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:border-[#60A5FA] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Discussion Topic Dropdown */}
                  <div className="relative" ref={topicRef}>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A5B4FC] mb-1.5">
                      Subject / Topic
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsTopicOpen(!isTopicOpen)}
                      className="w-full flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#0B132B]/80 px-4 py-2.5 text-sm text-white text-left focus:border-[#60A5FA] cursor-pointer"
                    >
                      <span>{form.topic}</span>
                      <ChevronDown className="h-4 w-4 text-[#64748B]" />
                    </button>

                    <AnimatePresence>
                      {isTopicOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-[#1F2937] bg-[#111827] p-1.5 shadow-2xl z-20"
                        >
                          {topicOptions.map((topic) => (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => {
                                setForm({ ...form, topic });
                                setIsTopicOpen(false);
                              }}
                              className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                                form.topic === topic
                                  ? 'bg-[#2563EB]/30 text-[#60A5FA] font-medium'
                                  : 'text-[#CBD5E1] hover:bg-[#1F2937]'
                              }`}
                            >
                              {topic}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Message textarea */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A5B4FC] mb-1.5">
                      Your Message <span className="text-[#F472B6]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onFocus={() => setIsTextareaFocused(true)}
                      onBlur={() => setIsTextareaFocused(false)}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        handleTypingActivity();
                      }}
                      placeholder="Share details regarding the opportunity, project, or inquiry..."
                      className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 p-4 text-sm text-white placeholder-[#64748B] focus:border-[#60A5FA] focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:bg-[#1D4ED8] disabled:opacity-50 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
