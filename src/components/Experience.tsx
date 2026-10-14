import { EXPERIENCES } from '../data';
import SectionLabel from './SectionLabel';

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative w-full bg-[#050505] ambient-glow py-32 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 xl:px-24">
        <SectionLabel index="03" title="Experience" />

        <div className="divide-y divide-neutral-900 border-y border-neutral-900">
          {EXPERIENCES.map((exp) => (
            <article
              key={exp.id}
              data-reveal
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-10"
            >
              <div className="md:col-span-3 font-mono text-xs text-neutral-500 tracking-wide pt-1.5">
                {exp.period}
              </div>

              <div className="md:col-span-9">
                <h3 className="font-display text-xl text-white font-semibold tracking-tight">
                  {exp.role}
                  <span className="text-neutral-500 font-normal"> · {exp.company}</span>
                </h3>

                <ul className="mt-4 space-y-3 text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                  {exp.highlights.map((item) => (
                    <li key={item} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-orange-400/70">
                      {item}
                    </li>
                  ))}
                </ul>

                {exp.techStack.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-neutral-400">
                    {exp.techStack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
