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
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar renders here via your existing layout */}

      <div className="max-w-6xl mx-auto px-8 pt-16 pb-24">
        {/* Page header */}
        <div className="flex items-end justify-between mb-16 border-b border-border pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {/* Logo: </> in cyan */}
              <span className="text-primary font-mono text-lg font-bold">&lt;/&gt;</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                CodeCraft
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Projects
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount} project{totalCount !== 1 ? 's' : ''} in workspace
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/projects/new')}
            className="border border-border text-secondary-foreground text-sm px-5 py-2.5 hover:border-primary/60 hover:text-primary transition-all"
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
              <span className="text-xs text-muted-foreground">
                {projects.length} result{projects.length !== 1 ? 's' : ''}
              </span>
              <ProjectFilters sortOrder={sortOrder} onSortChange={setSortOrder} />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-background animate-pulse"
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