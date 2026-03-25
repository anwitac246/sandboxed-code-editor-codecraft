'use client';

import { ProjectFile } from '@/types/project';

interface EditorPaneProps {
  file: ProjectFile | null;
}

export function EditorPane({ file }: EditorPaneProps) {
  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xs font-mono text-zinc-700">// select a file</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab */}
      <div className="border-b border-zinc-800/60 px-6 py-2 flex items-center gap-3">
        <span className="text-xs font-mono text-[#4FC3F7]">{file.name}</span>
        <span className="text-[10px] font-mono text-zinc-700 uppercase">{file.language}</span>
      </div>

      {/* Code */}
      <pre className="flex-1 overflow-auto p-6 text-xs text-zinc-500 leading-relaxed font-mono bg-transparent whitespace-pre-wrap">
        {file.content || `// ${file.name} — start writing here`}
      </pre>
    </div>
  );
}