'use client';

import { ProjectFile } from "@/types/project";

interface EditorPaneProps {
  file: ProjectFile | null;
  isSaving?: boolean;
  onContentChange: (fileId: string, content: string) => void;
}

export function EditorPane({ file, isSaving, onContentChange }: EditorPaneProps) {
  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xs font-mono text-zinc-700">// select a file</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="border-b border-zinc-800/60 px-6 py-2 flex items-center gap-3">
        <span className="text-xs font-mono text-[#4FC3F7]">{file.name}</span>
        <span className="text-[10px] font-mono text-zinc-700 uppercase">{file.language}</span>
        {isSaving && (
          <span className="ml-auto text-[10px] font-mono text-zinc-600 animate-pulse">
            saving…
          </span>
        )}
      </div>

      {/* Editable code area */}
      <textarea
        key={file.id}
        className="flex-1 resize-none overflow-auto p-6 text-xs text-zinc-300 leading-relaxed font-mono bg-transparent outline-none whitespace-pre caret-[#4FC3F7] selection:bg-[#4FC3F7]/20"
        defaultValue={file.content || ''}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        onChange={(e) => onContentChange(file.id, e.target.value)}
      />
    </div>
  );
}