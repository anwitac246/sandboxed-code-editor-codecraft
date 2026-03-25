'use client';

import { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onToggleStar: (id: string) => void;
}

export function ProjectList({ projects, onToggleStar }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
          <span className="text-2xl">🗂</span>
        </div>
        <p className="text-zinc-400 text-sm font-medium">No projects found</p>
        <p className="text-zinc-600 text-xs mt-1">Try a different search or create a new one.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onToggleStar={onToggleStar} />
      ))}
    </div>
  );
}