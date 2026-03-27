'use client';

import { ProjectFile } from '@/types/project';

const langDot: Record<string, string> = {
  typescript: 'bg-[#4FC3F7]',
  javascript: 'bg-yellow-400',
  html: 'bg-orange-400',
  css: 'bg-purple-400',
};

const langExt: Record<string, string> = {
  typescript: '.ts',
  javascript: '.js',
  html: '.html',
  css: '.css',
};

interface FileItemProps {
  file: ProjectFile;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
}

export function FileItem({ file, isActive, isOpen, onClick }: FileItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-4 py-1.5 text-xs font-mono transition-colors text-left group ${
        isActive
          ? 'text-[#4FC3F7] bg-[#4FC3F7]/5 border-l border-[#4FC3F7]/40'
          : 'text-zinc-500 hover:text-zinc-200 border-l border-transparent hover:border-zinc-700'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity ${
          langDot[file.language] ?? 'bg-zinc-600'
        } ${isOpen ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}
      />
      <span className="truncate flex-1">{file.name}</span>
      {isOpen && (
        <span
          className={`w-1 h-1 rounded-full shrink-0 ${
            isActive ? 'bg-[#4FC3F7]' : 'bg-zinc-600'
          }`}
        />
      )}
    </button>
  );
}