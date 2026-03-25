'use client';

import { ProjectFile } from '@/types/project';
import { FileItem } from './FileItem';

interface FileTreeProps {
  files: ProjectFile[];
  activeFileId: string | null;
  openFileIds: string[];
  onFileClick: (fileId: string) => void;
  projectName: string;
}

export function FileTree({
  files,
  activeFileId,
  openFileIds,
  onFileClick,
  projectName,
}: FileTreeProps) {
  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-zinc-800/60 bg-[#0b0f14] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800/40 flex items-center justify-between">
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600">
          Explorer
        </span>
        <span className="text-[9px] font-mono text-zinc-700 truncate max-w-[7rem]">
          {projectName}
        </span>
      </div>

      {/* Section label */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-zinc-700">
          src
        </span>
      </div>

      {/* Files */}
      <div className="flex-1 overflow-y-auto pb-4 scrollbar-none">
        {files.length === 0 ? (
          <p className="px-4 py-2 text-[10px] font-mono text-zinc-700">
            // empty
          </p>
        ) : (
          files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              isActive={activeFileId === file.id}
              isOpen={openFileIds.includes(file.id)}
              onClick={() => onFileClick(file.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}