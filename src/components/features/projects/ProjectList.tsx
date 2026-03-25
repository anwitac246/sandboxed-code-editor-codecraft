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
      <div className="flex flex-col items-center justify-center py-32 text-center border border-zinc-800/60">
        <p className="text-zinc-600 text-sm font-mono">// no projects found</p>
        <p className="text-zinc-700 text-xs mt-2 font-mono">try a different search or create a new one</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/40">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onToggleStar={onToggleStar} />
      ))}
    </div>
  );
}