import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowUpRight, Check, Copy, X } from 'lucide-react';
import { SOCIALS, RESUME_URL, CONTACT_EMAIL, PROFILE } from '../data';
import { scrollToTop } from '../lib/scroll';
import SectionLabel from './SectionLabel';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

interface FooterProps {
  onOpenTerminal: () => void;
}

export default function Footer({ onOpenTerminal }: FooterProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsContactOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: 'db080172-5c11-4395-8554-6cb684819977',
          ...formData,
        }),
      });
      setStatus(response.ok ? 'sent' : 'error');
      if (response.ok) {
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setIsContactOpen(false);
          setStatus('idle');
        }, 1800);
      }
    } catch {
      setStatus('error');
    }
  };

  const links = [
    ...SOCIALS.map((s) => ({ label: s.name, url: s.url })),
    { label: 'Resume', url: RESUME_URL },
  ];

  const inputClass =
    'w-full bg-transparent border border-neutral-800 px-3 py-2.5 rounded-md text-sm text-white placeholder-neutral-600 focus:border-neutral-500 focus:outline-none transition-colors';

  return (
    <footer
      id="contact"
      className="relative w-full bg-[#050505] ambient-glow pt-32 pb-10 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 xl:px-24">
        <SectionLabel index="04" title="Contact" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 pb-32">
          <div className="lg:col-span-7">
            <h2
              data-reveal
              className="text-4xl sm:text-5xl font-display font-semibold text-white tracking-tight leading-[1.05]"
            >
              Let&rsquo;s talk.
            </h2>
            <p data-reveal className="mt-6 max-w-md text-neutral-400 font-light leading-relaxed">
              Open to interesting projects, meaningful conversations, and new opportunities.
            </p>

            <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
              {CONTACT_EMAIL && (
                <button
                  onClick={copyEmail}
                  className="group inline-flex items-center gap-3 text-lg sm:text-xl text-white cursor-pointer"
                >
                  <span className="border-b border-neutral-700 group-hover:border-orange-400 pb-0.5 transition-colors">
                    {CONTACT_EMAIL}
                  </span>
                  {copied ? (
                    <Check className="w-4 h-4 text-orange-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                  )}
                </button>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-5 py-2.5 rounded-md bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Send a message
              </button>
            </div>
          </div>

          <ul data-reveal className="lg:col-span-5 lg:pt-3 divide-y divide-neutral-900 border-y border-neutral-900">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between py-4 text-neutral-300 hover:text-white transition-colors"
                >
                  {link.label}
                  <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-orange-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-[11px] text-neutral-600">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenTerminal}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
              title="Or press ` anywhere"
            >
              <kbd className="px-1.5 py-0.5 border border-neutral-800 rounded">`</kbd> terminal
            </button>
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1 hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Back to top
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsContactOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5">
              <h3 className="font-display text-lg text-white">Send a message</h3>
              <button
                onClick={() => setIsContactOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                aria-label="Name"
                className={inputClass}
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                aria-label="Email"
                className={inputClass}
              />
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Message"
                aria-label="Message"
                className={`${inputClass} resize-none`}
              />

              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="text-xs text-neutral-500">
                  {status === 'sent' && 'Sent. Thanks, I’ll get back to you.'}
                  {status === 'error' && 'Something went wrong. Please try again.'}
                </span>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="px-5 py-2.5 rounded-md bg-white text-black text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {status === 'sending' ? 'Sending…' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
