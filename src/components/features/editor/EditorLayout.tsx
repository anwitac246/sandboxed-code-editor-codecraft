'use client';

import { useState, useCallback } from 'react';
import { Project } from '@/types/project';
import { useEditor } from '@/hooks/useEditor';
import { FileTree } from './FileTree';
import { EditorTabs } from './EditorTabs';
import { EditorPane } from './EditorPane';
import { Terminal, TerminalLine } from './Terminal';
import { runCode } from '@/service/execution.service';

interface EditorLayoutProps {
  project: Project;
}

export function EditorLayout({ project }: EditorLayoutProps) {
  const {
    files,
    openTabs,
    activeFileId,
    openFile,
    closeTab,
    switchTab,
    updateFileContent,
    getActiveFile,
    getFileById,
  } = useEditor(project.files);

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      id: 'init',
      text: `// CodeCraft v1.0 — ${project.name}`,
      type: 'info',
    },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const pushLine = useCallback((text: string, type: TerminalLine['type']) => {
    setTerminalLines((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, text, type },
    ]);
  }, []);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    pushLine(`$ run — ${new Date().toLocaleTimeString()}`, 'command');

    const result = await runCode(
      files.map((f) => ({
        name: f.name,
        content: f.content,
        language: f.language,
      }))
    );

    result.output.split('\n').forEach((line) => {
      pushLine(line, result.error ? 'error' : 'output');
    });

    pushLine(
      `// finished in ${result.duration}ms — exit code ${result.exitCode}`,
      'info'
    );
    setIsRunning(false);
  }, [files, isRunning, pushLine]);

  const handleClearTerminal = useCallback(() => {
    setTerminalLines([]);
  }, []);

  const activeFile = getActiveFile();

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-background h-full">
      {/* Top action bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-primary font-mono text-sm font-bold">
            &lt;/&gt;
          </span>
          <span className="text-muted-foreground font-mono text-xs">
            {project.name}
          </span>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-1.5 text-xs border transition-all ${
            isRunning
              ? 'border-border text-muted-foreground cursor-not-allowed'
              : 'border-border text-secondary-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5'
          }`}
        >
          {isRunning ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              running...
            </>
          ) : (
            <>
              <span className="text-[10px]">▶</span>
              Run Code
            </>
          )}
        </button>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <FileTree
          files={files}
          activeFileId={activeFileId}
          openFileIds={openTabs.map((t) => t.fileId)}
          onFileClick={openFile}
          projectName={project.name}
        />

        {/* Editor column */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <EditorTabs
            tabs={openTabs}
            activeFileId={activeFileId}
            getFileById={getFileById}
            onTabClick={switchTab}
            onTabClose={closeTab}
          />

          {/* Editor + Terminal stack */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <EditorPane
              file={activeFile}
              onContentChange={updateFileContent}
            />
            <Terminal
              lines={terminalLines}
              isRunning={isRunning}
              onClear={handleClearTerminal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}