import { PROJECTS } from '../data';
import { ArrowUpRight, Github } from 'lucide-react';
import SectionLabel from './SectionLabel';
import PipelineDiagram from './PipelineDiagram';

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative w-full bg-[#050505] ambient-glow py-32 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 xl:px-24">
        <SectionLabel index="02" title="Work" />

        <h2
          data-reveal
          className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight leading-tight mb-20 max-w-2xl"
        >
          A few systems built to solve real problems.
        </h2>

        <div className="space-y-28 md:space-y-36">
          {PROJECTS.map((project, index) => {
            const imageFirst = index % 2 === 1;

            return (
              <article
                key={project.id}
                data-reveal
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              >
                <div className={`lg:col-span-6 ${imageFirst ? 'lg:order-2' : 'lg:order-1'} order-2 space-y-6`}>
                  <div className="font-mono text-xs text-neutral-500 flex items-center gap-3">
                    <span className="text-orange-400/80">{String(index + 1).padStart(2, '0')}</span>
                    {project.year && <span>{project.year}</span>}
                    {project.subtitle && <span>· {project.subtitle}</span>}
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                    {project.title}
                  </h3>

                  <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>

                  <dl className="grid grid-cols-2 gap-x-8 gap-y-5 pt-2">
                    {project.stats.map((stat) => (
                      <div key={stat.label} className="border-t border-neutral-800 pt-3">
                        <dt className="font-mono text-[11px] text-neutral-400 tracking-wide">{stat.label}</dt>
                        <dd className="mt-1 text-sm text-white">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="flex flex-wrap items-center gap-6 pt-2 text-sm">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        Source
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                      >
                        Live
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>

                <div className={`lg:col-span-6 ${imageFirst ? 'lg:order-1' : 'lg:order-2'} order-1`}>
                  <div className="group rounded-xl border border-neutral-800 bg-[#0b0b0b] overflow-hidden shadow-[0_30px_80px_-30px_rgba(249,115,22,0.18)] hover:border-neutral-700 transition-colors duration-500">
                    <div className={`overflow-hidden ${project.thumbnail ? "" : "aspect-[16/10]"}`}>
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          loading="lazy"
                          className="block w-full h-auto opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition duration-700 ease-out"
                        />
                      ) : (
                        project.pipeline && <PipelineDiagram steps={project.pipeline} />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 px-5 py-4 border-t border-neutral-800 font-mono text-[11px] text-neutral-400">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
