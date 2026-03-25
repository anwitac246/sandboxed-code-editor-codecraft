'use client';

import { useState } from 'react';
import { Project } from '@/types/project';
import { FileTree } from './FileTree';
import { EditorPane } from './EditorPane';

interface ProjectEditorProps {
  project: Project;
}

export function ProjectEditor({ project }: ProjectEditorProps) {
  const [activeFileId, setActiveFileId] = useState<string | null>(
    project.files[0]?.id ?? null
  );

  const activeFile = project.files.find((f) => f.id === activeFileId) ?? null;

  return (
    <div className="flex flex-1 overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm shadow-[0_0_60px_-12px_rgba(99,102,241,0.15)]">
      <FileTree
        files={project.files}
        activeFileId={activeFileId}
        onSelect={(f) => setActiveFileId(f.id)}
      />
      <EditorPane file={activeFile} />
    </div>
  );
}