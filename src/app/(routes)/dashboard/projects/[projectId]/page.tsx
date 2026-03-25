'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, FileCode2 } from 'lucide-react';
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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-zinc-400">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Project not found</p>
          <button onClick={() => router.push('/dashboard/projects')} className="text-sm text-blue-400 hover:underline">
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 flex flex-col">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-blue-600/4 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800/60 bg-zinc-950/60 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Projects
          </button>
          <span className="text-zinc-700">/</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-zinc-700 flex items-center justify-center">
              <FileCode2 size={10} className="text-blue-300" />
            </div>
            <span className="text-sm font-semibold text-zinc-100">{project.name}</span>
          </div>
        </div>

        <button
          onClick={handleToggleStar}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-all text-zinc-500 hover:text-zinc-300"
        >
          <Star
            size={12}
            className={project.isStarred ? 'fill-amber-400 text-amber-400' : ''}
          />
          {project.isStarred ? 'Starred' : 'Star'}
        </button>
      </header>

      {/* Editor body */}
      <div className="relative z-10 flex flex-1 overflow-hidden p-6 gap-6 h-[calc(100vh-57px)]">
        <ProjectEditor project={project} />
      </div>
    </div>
  );
}