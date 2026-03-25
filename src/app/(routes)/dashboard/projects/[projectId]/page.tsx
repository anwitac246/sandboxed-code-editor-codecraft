'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import { projectService } from '@/service/project.service';
import { ProjectEditor } from '@/components/features/projects/ProjectEditor';

export default function ProjectEditorPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    projectService.getProjectById(projectId).then((p) => {
      if (!p) setNotFound(true);
      else setProject(p);
      setLoading(false);
    });
  }, [projectId]);

  const handleToggleStar = async () => {
    if (!project) return;
    const updated = await projectService.toggleStar(project.id);
    if (updated) setProject(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <span className="text-xs font-mono text-zinc-600 animate-pulse">// loading project...</span>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-mono text-zinc-500">// project not found</p>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="text-xs font-mono text-[#4FC3F7] hover:underline mt-3 block"
          >
            ← back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-3 flex items-center justify-between bg-[#0d1117]">
        <div className="flex items-center gap-4 font-mono text-sm">
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="text-zinc-600 hover:text-zinc-300 transition-colors text-xs"
          >
            ← projects
          </button>
          <span className="text-zinc-800">/</span>
          <span className="text-zinc-300">{project.name}</span>
        </div>

        <button
          onClick={handleToggleStar}
          className="text-xs font-mono transition-colors"
          style={{ color: project.isStarred ? '#F9A825' : '#3f3f46' }}
        >
          {project.isStarred ? '★ starred' : '☆ star'}
        </button>
      </header>

      {/* Editor */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-49px)]">
        <ProjectEditor project={project} />
      </div>
    </div>
  );
}