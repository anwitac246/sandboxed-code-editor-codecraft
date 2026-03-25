'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Project } from '@/types/project';
import { projectService } from '@/service/project.service';

type SortOrder = 'newest' | 'oldest';
type FilterView = 'all' | 'starred';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [filterView, setFilterView] = useState<FilterView>('all');

  useEffect(() => {
    projectService.getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const toggleStar = useCallback(async (projectId: string) => {
    const updated = await projectService.toggleStar(projectId);
    if (updated) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updated : p))
      );
    }
  }, []);

  const filtered = useMemo(() => {
    let list = [...projects];

    if (filterView === 'starred') {
      list = list.filter((p) => p.isStarred);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === 'newest' ? diff : -diff;
    });

    return list;
  }, [projects, search, sortOrder, filterView]);

  const starredCount = useMemo(
    () => projects.filter((p) => p.isStarred).length,
    [projects]
  );

  return {
    projects: filtered,
    totalCount: projects.length,
    starredCount,
    loading,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    filterView,
    setFilterView,
    toggleStar,
  };
}