'use client';

import { ProjectSearch } from './ProjectSearch';

interface ProjectSidebarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filterView: 'all' | 'starred';
  onFilterChange: (v: 'all' | 'starred') => void;
  totalCount: number;
  starredCount: number;
}

export function ProjectSidebar({
  search,
  onSearchChange,
  filterView,
  onFilterChange,
  totalCount,
  starredCount,
}: ProjectSidebarProps) {
  const nav = [
    { id: 'all', label: 'My Projects', count: totalCount },
    { id: 'starred', label: 'Starred', count: starredCount },
  ] as const;

  return (
    <aside className="w-52 shrink-0 flex flex-col gap-6 h-fit sticky top-6">
      <ProjectSearch value={search} onChange={onSearchChange} />

      <nav className="flex flex-col gap-0.5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
          Library
        </p>
        {nav.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => onFilterChange(id)}
            className={`flex items-center justify-between px-0 py-2 text-sm transition-all border-l-2 pl-3 ${
              filterView === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <span>{label}</span>
            <span className="text-xs text-muted-foreground">{count}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}