'use client';

import { EditorTab } from '@/hooks/useEditor';
import { ProjectFile } from '@/types/project';

interface EditorTabsProps {
  tabs: EditorTab[];
  activeFileId: string | null;
  getFileById: (id: string) => ProjectFile | null;
  onTabClick: (fileId: string) => void;
  onTabClose: (fileId: string) => void;
}

export function EditorTabs({
  tabs,
  activeFileId,
  getFileById,
  onTabClick,
  onTabClose,
}: EditorTabsProps) {
  if (tabs.length === 0) return null;

  return (
    <div className="flex items-end border-b border-zinc-800/60 bg-[#0b0f14] overflow-x-auto scrollbar-none">
      {tabs.map(({ fileId, isDirty }) => {
        const file = getFileById(fileId);
        const isActive = activeFileId === fileId;
        if (!file) return null;

        return (
          <div
            key={fileId}
            onClick={() => onTabClick(fileId)}
            className={`group relative flex items-center gap-2.5 px-4 py-2.5 text-xs font-mono cursor-pointer select-none shrink-0 border-r border-zinc-800/40 transition-colors ${
              isActive
                ? 'text-[#4FC3F7] bg-[#0d1117]'
                : 'text-zinc-600 hover:text-zinc-300 bg-[#0b0f14] hover:bg-[#0d1117]/60'
            }`}
          >
            {/* Active top border */}
            {isActive && (
              <span className="absolute top-0 left-0 right-0 h-px bg-[#4FC3F7]/60" />
            )}

            <span className="truncate max-w-[120px]">{file.name}</span>

            {isDirty && (
              <span className="w-1 h-1 rounded-full bg-[#4FC3F7]/60 shrink-0" />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(fileId);
              }}
              className={`shrink-0 w-3.5 h-3.5 flex items-center justify-center rounded-sm transition-colors ${
                isActive
                  ? 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60'
                  : 'text-transparent group-hover:text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700/60'
              }`}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}