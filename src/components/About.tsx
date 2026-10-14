import { ACHIEVEMENTS, MANIFESTO, SKILLS } from '../data';
import SectionLabel from './SectionLabel';

export default function About() {
  return (
    <section id="about" className="relative w-full bg-[#050505] ambient-glow py-32">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 xl:px-24">
        <SectionLabel index="01" title="About" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <h2
            data-reveal
            className="lg:col-span-5 text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight leading-tight"
          >
            {MANIFESTO.title}
          </h2>

          <div className="lg:col-span-7 space-y-8 text-neutral-300 font-light leading-relaxed text-base sm:text-lg">
            <p data-reveal>{MANIFESTO.body1}.</p>

            <blockquote data-reveal className="border-l border-orange-400/70 pl-6">
              <p className="font-display text-white text-lg sm:text-xl not-italic">
                {MANIFESTO.highlightPhrase}
              </p>
              <p className="mt-2 text-neutral-400 text-base">
                Built for real systems, real users, and real-world constraints.
              </p>
            </blockquote>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <ul data-reveal className="lg:col-span-5 space-y-6">
            {ACHIEVEMENTS.map((item) => (
              <li key={item.label}>
                <div className="font-display text-xl text-white">{item.label}</div>
                <div className="mt-1 text-sm text-neutral-400">{item.value}</div>
              </li>
            ))}
          </ul>

          <dl data-reveal className="lg:col-span-7 divide-y divide-neutral-900 border-y border-neutral-900">
            {SKILLS.map((group) => (
              <div key={group.label} className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-4">
                <dt className="sm:col-span-4 font-mono text-[11px] tracking-wide text-neutral-500 uppercase pt-0.5">
                  {group.label}
                </dt>
                <dd className="sm:col-span-8 text-sm text-neutral-200">
                  {group.items.join(' · ')}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
