'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import { projectService } from '@/service/project.service';
import { EditorLayout } from '@/components/features/editor/EditorLayout';

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

  if (loading) {
    return (
      <div className="h-screen bg-[#0d1117] flex items-center justify-center">
        <span className="text-[10px] font-mono text-zinc-700 animate-pulse">
          // loading workspace...
        </span>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-mono text-zinc-600">// project not found</p>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="text-xs font-mono text-[#4FC3F7] hover:underline mt-3 block mx-auto"
          >
            ← back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] overflow-hidden">
      {/* Topbar */}
      <header className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800/60 bg-[#080b0f] shrink-0">
        <div className="flex items-center gap-4 font-mono">
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="text-[10px] text-zinc-700 hover:text-zinc-400 transition-colors uppercase tracking-widest"
          >
            ← projects
          </button>
          <span className="text-zinc-800 text-xs">/</span>
          <span className="text-xs text-zinc-500">{project.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
            {project.files.length} file{project.files.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      {/* Editor workspace fills remaining height */}
      <EditorLayout project={project} />
    </div>
  );
}