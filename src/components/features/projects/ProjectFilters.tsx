'use client';

interface ProjectFiltersProps {
  sortOrder: 'newest' | 'oldest';
  onSortChange: (s: 'newest' | 'oldest') => void;
}

export function ProjectFilters({ sortOrder, onSortChange }: ProjectFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground uppercase tracking-widest">Sort</span>
      {(['newest', 'oldest'] as const).map((opt) => (
        <button
          key={opt}
          onClick={() => onSortChange(opt)}
          className={`text-xs px-3 py-1.5 rounded-md border transition-all ${
            sortOrder === opt
              ? 'bg-primary/10 border-primary/40 text-primary'
              : 'bg-transparent border-border text-muted-foreground hover:border-secondary hover:text-foreground'
          }`}
        >
          {opt === 'newest' ? 'Newest' : 'Oldest'}
        </button>
      ))}
    </div>
  );
}