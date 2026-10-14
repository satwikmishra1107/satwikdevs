import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { SOCIALS, RESUME_URL } from '../data';

type Log = { text: string; type: 'input' | 'output' | 'system' };

const INTRO: Log[] = [
  { text: "You found the terminal. Type 'help' to see what it can do.", type: 'system' },
];

interface TerminalProps {
  open: boolean;
  onClose: () => void;
}

export default function Terminal({ open, onClose }: TerminalProps) {
  const [logs, setLogs] = useState<Log[]>(INTRO);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [logs]);

  // Must open synchronously inside the key event: Safari blocks window.open
  // from timers as an unrequested popup
  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const respond = (cmd: string): string | null => {
    const lower = cmd.toLowerCase();
    const social = SOCIALS.find((s) => lower.includes(s.name.toLowerCase()));
    if (social) {
      openUrl(social.url);
      return `Opening ${social.name}...`;
    }
    if (lower === 'resume') {
      openUrl(RESUME_URL);
      return 'Opening resume...';
    }
    if (lower === 'help') {
      return 'Commands: linkedin, github, leetcode, resume, whoami, ls, pwd, date, echo <msg>, ping, coffee, 42, clear, exit';
    }
    if (lower === 'hello' || lower === 'hi') return 'Hello. Thanks for poking around.';
    if (lower === 'ping') return 'pong';
    if (lower === 'whoami') return 'guest — curious enough to find this, apparently.';
    if (lower === 'pwd') return '/home/satwik/portfolio';
    if (lower === 'ls' || lower === 'ls -la') return 'linkedin  github  leetcode  resume  secrets.txt (permission denied)';
    if (lower === 'date') return new Date().toString();
    if (lower.startsWith('sudo')) return 'Nice try. No root for visitors.';
    if (lower === 'rm -rf /' || lower === 'rm -rf /*') return 'Request denied. The site lives to see another day.';
    if (lower === 'coffee') return 'Brewing... ☕ done.';
    if (lower === '42') return 'The answer to life, the universe, and everything.';
    if (lower.startsWith('echo ')) return cmd.slice(5);
    return null;
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    setInput('');
    if (!cmd) return;

    const lower = cmd.toLowerCase();
    if (lower === 'clear' || lower === 'cls') {
      setLogs([]);
      return;
    }
    if (lower === 'exit') {
      onClose();
      return;
    }

    const reply = respond(cmd);
    setLogs((prev) => [
      ...prev,
      { text: `$ ${cmd}`, type: 'input' },
      reply !== null
        ? { text: reply, type: 'output' }
        : { text: `command not found: ${cmd}. Try 'help'.`, type: 'system' },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') run(input);
    if (e.key === 'Escape') onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] p-4 md:p-6 flex justify-center"
      data-lenis-prevent
    >
      <div className="w-full max-w-2xl rounded-lg border border-neutral-800 bg-[#0a0a0a]/95 backdrop-blur shadow-2xl overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-900 text-neutral-500">
          <span>satwik@portfolio: ~</span>
          <button onClick={onClose} className="hover:text-white transition-colors cursor-pointer" aria-label="Close terminal">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div ref={scrollRef} className="h-56 overflow-y-auto overscroll-contain p-4 space-y-2 leading-relaxed">
          {logs.map((log, i) => (
            <div
              key={i}
              className={
                log.type === 'input'
                  ? 'text-orange-400'
                  : log.type === 'output'
                    ? 'text-neutral-200'
                    : 'text-neutral-500'
              }
            >
              {log.text}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-neutral-900">
          <span className="text-neutral-600">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            aria-label="Terminal input"
            className="flex-1 bg-transparent outline-none text-white placeholder-neutral-700"
            placeholder="help"
          />
        </div>
      </div>
    </div>
  );
}
