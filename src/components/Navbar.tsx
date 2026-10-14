import { useEffect, useState } from 'react';
import { PROFILE, RESUME_URL } from '../data';
import { scrollToId, scrollToTop } from '../lib/scroll';

const NAV_ITEMS = [
  { id: 'about', label: 'About', mobile: false },
  { id: 'projects', label: 'Work', mobile: true },
  { id: 'experience', label: 'Experience', mobile: false },
  { id: 'contact', label: 'Contact', mobile: true },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const elements = ['hero', ...NAV_ITEMS.map((i) => i.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-[#050505]/85 backdrop-blur-md border-b border-neutral-900' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 xl:px-24 h-16">
        <button
          onClick={scrollToTop}
          className="font-display text-sm font-semibold text-white tracking-tight cursor-pointer"
        >
          {PROFILE.name}
        </button>

        <nav className="flex items-center gap-5 sm:gap-7 text-sm">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToId(item.id)}
              className={`${item.mobile ? '' : 'hidden md:inline'} transition-colors cursor-pointer ${
                activeSection === item.id ? 'text-white' : 'text-neutral-500 hover:text-neutral-200'
              }`}
            >
              {item.label}
            </button>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            className="text-neutral-500 hover:text-neutral-200 transition-colors"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
