'use client';

import { useRouter } from 'next/navigation';
import { Plus, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      {/* Radial glow background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar slot — rendered by your existing Navbar */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-16">
        {/* Page header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-blue-400" />
              <span className="text-xs text-blue-400 uppercase tracking-widest font-medium">
                Workspace
              </span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">Projects</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {totalCount} project{totalCount !== 1 ? 's' : ''} in your workspace
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/projects/new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            <Plus size={15} />
            New Project
          </button>
        </div>

        {/* Body */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <ProjectSidebar
            search={search}
            onSearchChange={setSearch}
            filterView={filterView}
            onFilterChange={setFilterView}
            totalCount={totalCount}
            starredCount={starredCount}
          />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-zinc-500">
                {projects.length} result{projects.length !== 1 ? 's' : ''}
              </p>
              <ProjectFilters sortOrder={sortOrder} onSortChange={setSortOrder} />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 animate-pulse"
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