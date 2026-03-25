'use client';

import { useEffect, useRef, useState } from 'react';

export interface TerminalLine {
  id: string;
  text: string;
  type: 'output' | 'error' | 'info' | 'command';
}

interface TerminalProps {
  lines: TerminalLine[];
  isRunning: boolean;
  onClear: () => void;
}

export function Terminal({ lines, isRunning, onClear }: TerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const lineColor: Record<TerminalLine['type'], string> = {
    command: 'text-[#4FC3F7]',
    output: 'text-zinc-400',
    error: 'text-red-400',
    info: 'text-zinc-600',
  };

  return (
    <div
      className={`flex flex-col border-t border-zinc-800/60 bg-[#080b0f] transition-all duration-200 ${
        isCollapsed ? 'h-9' : 'h-52'
      }`}
    >
      {/* Terminal toolbar */}
      <div className="flex items-center justify-between px-4 h-9 border-b border-zinc-800/40 shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600">
            Terminal
          </span>
          {isRunning && (
            <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#4FC3F7]/70">
              <span className="w-1 h-1 rounded-full bg-[#4FC3F7] animate-pulse" />
              running
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClear}
            className="text-[9px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors uppercase tracking-widest"
          >
            clear
          </button>
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className="text-[9px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors"
          >
            {isCollapsed ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Output */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[11px] leading-5 scrollbar-none">
          {lines.length === 0 ? (
            <span className="text-zinc-800">
              // run your code to see output here
            </span>
          ) : (
            lines.map((line) => (
              <div key={line.id} className={lineColor[line.type]}>
                {line.text}
              </div>
            ))
          )}
          {isRunning && (
            <div className="flex items-center gap-1.5 text-zinc-600 mt-1">
              <span className="animate-pulse">▋</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}