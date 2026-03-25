'use client';

import { FolderOpen, Star, Layers } from 'lucide-react';
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
    { id: 'all', label: 'My Projects', icon: FolderOpen, count: totalCount },
    { id: 'starred', label: 'Starred', icon: Star, count: starredCount },
  ] as const;

  return (
    <aside className="w-60 shrink-0 flex flex-col gap-6 bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-5 shadow-[0_0_40px_-12px_rgba(99,102,241,0.15)] backdrop-blur-sm h-fit sticky top-6">
      {/* Logo area */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Layers size={14} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-zinc-100 tracking-tight">CodeCraft</span>
      </div>

      {/* Search */}
      <ProjectSearch value={search} onChange={onSearchChange} />

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1 px-1">
          Library
        </p>
        {nav.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => onFilterChange(id)}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all group ${
              filterView === id
                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Icon size={14} />
              {label}
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md ${
                filterView === id
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}