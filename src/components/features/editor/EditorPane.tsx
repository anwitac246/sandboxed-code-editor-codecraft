'use client';

import { ProjectFile } from '@/types/project';

const langLabel: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
};

const langColor: Record<string, string> = {
  typescript: 'text-[#4FC3F7]',
  javascript: 'text-yellow-400',
  html: 'text-orange-400',
  css: 'text-purple-400',
};

interface EditorPaneProps {
  file: ProjectFile | null;
  onContentChange: (fileId: string, content: string) => void;
}

export function EditorPane({ file, onContentChange }: EditorPaneProps) {
  if (!file) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0d1117] select-none">
        <span className="text-[#4FC3F7] font-mono text-2xl font-bold mb-3 opacity-20">
          &lt;/&gt;
        </span>
        <p className="text-xs font-mono text-zinc-700">
          // select a file to start editing
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
      {/* Breadcrumb bar */}
      <div className="flex items-center justify-between px-5 py-1.5 border-b border-zinc-800/40 bg-[#0b0f14]/60">
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="text-zinc-700">src</span>
          <span className="text-zinc-800">/</span>
          <span className="text-zinc-400">{file.name}</span>
        </div>
        <span
          className={`text-[9px] font-mono uppercase tracking-widest ${
            langColor[file.language] ?? 'text-zinc-600'
          }`}
        >
          {langLabel[file.language] ?? file.language}
        </span>
      </div>

      {/* Editor area with line numbers */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="select-none bg-[#0d1117] border-r border-zinc-800/30 py-4 px-3 text-right overflow-hidden">
          {(file.content || '').split('\n').map((_, i) => (
            <div
              key={i}
              className="text-[11px] font-mono text-zinc-800 leading-5"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={file.content}
          onChange={(e) => onContentChange(file.id, e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent text-zinc-300 font-mono text-[12px] leading-5 py-4 px-4 resize-none focus:outline-none caret-[#4FC3F7] selection:bg-[#4FC3F7]/15 overflow-auto"
        />
      </div>
    </div>
  );
}