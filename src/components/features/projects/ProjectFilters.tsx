'use client';

interface ProjectFiltersProps {
  sortOrder: 'newest' | 'oldest';
  onSortChange: (s: 'newest' | 'oldest') => void;
}

export function ProjectFilters({ sortOrder, onSortChange }: ProjectFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-600 uppercase tracking-widest">Sort</span>
      {(['newest', 'oldest'] as const).map((opt) => (
        <button
          key={opt}
          onClick={() => onSortChange(opt)}
          className={`text-xs px-3 py-1.5 rounded-md border transition-all ${
            sortOrder === opt
              ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
              : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
          }`}
        >
          {opt === 'newest' ? 'Newest' : 'Oldest'}
        </button>
      ))}
    </div>
  );
}