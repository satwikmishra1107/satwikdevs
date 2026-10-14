interface SectionLabelProps {
  index: string;
  title: string;
}

export default function SectionLabel({ index, title }: SectionLabelProps) {
  return (
    <div data-reveal className="flex items-center gap-3 font-mono text-xs tracking-wider mb-8">
      <span className="text-orange-400">{index}</span>
      <span className="h-px w-8 bg-neutral-800" />
      <span className="text-neutral-500 uppercase">{title}</span>
    </div>
  );
}
