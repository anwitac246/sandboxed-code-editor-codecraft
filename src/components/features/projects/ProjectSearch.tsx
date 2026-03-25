'use client';

interface ProjectSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export function ProjectSearch({ value, onChange }: ProjectSearchProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search projects..."
      className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-[#4FC3F7]/50 transition-colors font-mono"
    />
  );
}