interface PipelineDiagramProps {
  steps: string[];
}

// A vertical flow of a system's stages with a pulse travelling through it
export default function PipelineDiagram({ steps }: PipelineDiagramProps) {
  return (
    <div className="relative h-full w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_40%,rgba(249,115,22,0.08),transparent_70%)]">
      <div className="relative flex flex-col items-center gap-3.5">
        {/* Spine and the pulse that runs along it */}
        <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-neutral-800" />
        <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 overflow-hidden motion-reduce:hidden">
          <span className="absolute left-0 -translate-x-[1.5px] w-1 h-10 rounded-full bg-gradient-to-b from-transparent via-orange-400 to-transparent animate-[pipeline-flow_2.8s_linear_infinite]" />
        </div>

        {steps.map((step, i) => (
          <div
            key={step}
            className="relative z-10 flex items-center gap-3 min-w-56 justify-center px-4 py-2 rounded-md border border-neutral-800 bg-[#0b0b0b] font-mono text-[11px] text-neutral-300"
          >
            <span className="text-orange-400/80">{String(i + 1).padStart(2, '0')}</span>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
