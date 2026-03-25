'use client';

import { ProjectFile } from '@/types/project';

interface EditorPaneProps {
  file: ProjectFile | null;
}

export function EditorPane({ file }: EditorPaneProps) {
  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-center">
        <div>
          <p className="text-zinc-500 text-sm font-medium">Select a file to view</p>
          <p className="text-zinc-700 text-xs mt-1">Choose a file from the tree on the left.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-zinc-800/60 px-4 py-0 bg-zinc-900/30">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-blue-500 text-blue-300 text-xs">
          <span>{file.name}</span>
        </div>
      </div>

      {/* Code area — placeholder until Monaco is added */}
      <pre className="flex-1 overflow-auto p-6 text-xs text-zinc-400 leading-relaxed font-mono bg-transparent whitespace-pre-wrap">
        {file.content || `// ${file.name} — start writing here`}
      </pre>
    </div>
  );
}