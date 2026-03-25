'use client';

import { FileCode2 } from 'lucide-react';
import { ProjectFile } from '@/types/project';

const langDot: Record<string, string> = {
  typescript: 'bg-blue-400',
  javascript: 'bg-yellow-400',
  html: 'bg-orange-400',
  css: 'bg-purple-400',
};

interface FileTreeProps {
  files: ProjectFile[];
  activeFileId: string | null;
  onSelect: (file: ProjectFile) => void;
}

export function FileTree({ files, activeFileId, onSelect }: FileTreeProps) {
  return (
    <aside className="w-52 shrink-0 bg-zinc-900/50 border-r border-zinc-800/60 flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-800/60">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600">Files</p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.length === 0 ? (
          <p className="text-xs text-zinc-600 px-4 py-3">No files yet.</p>
        ) : (
          files.map((file) => (
            <button
              key={file.id}
              onClick={() => onSelect(file)}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs transition-all ${
                activeFileId === file.id
                  ? 'bg-blue-500/10 text-blue-300'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${langDot[file.language] ?? 'bg-zinc-500'}`} />
              <FileCode2 size={12} className="shrink-0 opacity-50" />
              <span className="truncate">{file.name}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}