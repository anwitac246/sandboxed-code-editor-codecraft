'use client';

import { useRouter } from 'next/navigation';
import { useProjects } from '@/hooks/useProjects';
import { ProjectSidebar } from '@/components/features/projects/ProjectSidebar';
import { ProjectList } from '@/components/features/projects/ProjectList';
import { ProjectFilters } from '@/components/features/projects/ProjectFilters';

export default function ProjectsDashboardPage() {
  const router = useRouter();
  const {
    projects,
    totalCount,
    starredCount,
    loading,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    filterView,
    setFilterView,
    toggleStar,
  } = useProjects();

  return (
    <div className="min-h-screen bg-[#0d1117] text-zinc-100">
      {/* Navbar renders here via your existing layout */}

      <div className="max-w-6xl mx-auto px-8 pt-16 pb-24">
        {/* Page header */}
        <div className="flex items-end justify-between mb-16 border-b border-zinc-800/60 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {/* Logo: </> in cyan */}
              <span className="text-[#4FC3F7] font-mono text-lg font-bold">&lt;/&gt;</span>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
                CodeCraft
              </span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">
              Projects
            </h1>
            <p className="text-sm font-mono text-zinc-600 mt-1">
              {totalCount} project{totalCount !== 1 ? 's' : ''} in workspace
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/projects/new')}
            className="border border-zinc-600 text-zinc-200 text-sm font-mono px-5 py-2.5 hover:border-[#4FC3F7]/60 hover:text-[#4FC3F7] transition-all"
          >
            + New Project
          </button>
        </div>

        {/* Body */}
        <div className="flex gap-12">
          <ProjectSidebar
            search={search}
            onSearchChange={setSearch}
            filterView={filterView}
            onFilterChange={setFilterView}
            totalCount={totalCount}
            starredCount={starredCount}
          />

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono text-zinc-600">
                {projects.length} result{projects.length !== 1 ? 's' : ''}
              </span>
              <ProjectFilters sortOrder={sortOrder} onSortChange={setSortOrder} />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/40">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-[#0d1117] animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <ProjectList projects={projects} onToggleStar={toggleStar} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}