'use client';

import { ProjectFile, Language } from '@/types/project';

const langColors: Record<string, string> = {
  typescript: '#4FC3F7',
  javascript: '#F9A825',
  html: '#EF6C00',
  css: '#AB47BC',
  python: '#3776AB',
  java: '#b07219',
  rust: '#dea584',
  go: '#00ADD8',
  cpp: '#f34b7d',
};

export function langFromName(name: string): Language {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const extLangMap: Record<string, Language> = {
    ts: 'typescript', tsx: 'typescript',
    js: 'javascript', jsx: 'javascript',
    py: 'python',
    rs: 'rust',
    go: 'go',
    java: 'java',
    cpp: 'cpp', h: 'cpp', cxx: 'cpp',
    c: 'c',
    rb: 'ruby',
    html: 'html', htm: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
  };
  return extLangMap[ext] ?? 'plaintext';
}

interface FileTreeProps {
  files: ProjectFile[];
  activeFileId: string | null;
  onSelect: (file: ProjectFile) => void;
}

export function FileTree({ files, activeFileId, onSelect }: FileTreeProps) {
  return (
    <aside className="w-48 shrink-0 border-r border-zinc-800/60 flex flex-col bg-[#0d1117]">
      <div className="px-4 py-3 border-b border-zinc-800/40">
        <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-700 font-mono">Files</p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.length === 0 ? (
          <p className="text-xs font-mono text-zinc-700 px-4 py-3">// empty</p>
        ) : (
          files.map((file) => (
            <button
              key={file.id}
              onClick={() => onSelect(file)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-mono transition-colors text-left ${
                activeFileId === file.id
                  ? 'text-[#4FC3F7] bg-[#4FC3F7]/5'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <span
                className="w-1 h-1 rounded-full shrink-0"
                style={{ background: langColors[file.language] ?? '#52525b' }}
              />
              <span className="truncate">{file.name}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
