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
    <aside className="w-52 shrink-0 flex flex-col border-r border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Explorer
        </span>
        <span className="text-[9px] text-muted-foreground/80 truncate max-w-[7rem]">
          {projectName}
        </span>
      </div>

      {/* Section label */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground/80">
          src
        </span>
      </div>

      {/* Files */}
      <div className="flex-1 overflow-y-auto pb-4 scrollbar-none">
        {files.length === 0 ? (
          <p className="px-4 py-2 text-[10px] text-muted-foreground">
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