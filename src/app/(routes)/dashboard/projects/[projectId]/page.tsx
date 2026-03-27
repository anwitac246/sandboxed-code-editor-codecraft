'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import { getProjectById } from '@/service/project.service';
import { EditorLayout } from '@/components/features/editor-viewer/EditorLayout';

export default function ProjectEditorPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getProjectById(projectId).then((p) => {
      if (!p) setNotFound(true);
      else setProject(p);
      setLoading(false);
    });
  }, [projectId]);

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <span className="text-[10px] text-muted-foreground animate-pulse">
          // loading workspace...
        </span>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">// project not found</p>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="text-xs text-primary hover:underline mt-3 block mx-auto"
          >
            ← back to projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Topbar */}
      <header className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
          >
            ← projects
          </button>
          <span className="text-border text-xs">/</span>
          <span className="text-xs text-muted-foreground">{project.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            {project.files.length} file{project.files.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      {/* Editor workspace fills remaining height */}
      <EditorLayout project={project} />
    </div>
  );
}