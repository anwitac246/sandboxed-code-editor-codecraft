'use client';

import { useState, useCallback } from 'react';
import { ProjectFile } from '@/types/project';

export interface EditorTab {
  fileId: string;
  isDirty: boolean;
}

export function useEditor(initialFiles: ProjectFile[]) {
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const openFile = useCallback((fileId: string) => {
    setOpenTabs((prev) => {
      if (prev.find((t) => t.fileId === fileId)) return prev;
      return [...prev, { fileId, isDirty: false }];
    });
    setActiveFileId(fileId);
  }, []);

  const closeTab = useCallback(
    (fileId: string) => {
      setOpenTabs((prev) => {
        const idx = prev.findIndex((t) => t.fileId === fileId);
        const next = prev.filter((t) => t.fileId !== fileId);
        if (activeFileId === fileId) {
          const nextActive =
            next[Math.min(idx, next.length - 1)]?.fileId ?? null;
          setActiveFileId(nextActive);
        }
        return next;
      });
    },
    [activeFileId]
  );

  const switchTab = useCallback((fileId: string) => {
    setActiveFileId(fileId);
  }, []);

  const updateFileContent = useCallback((fileId: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, content } : f))
    );
    setOpenTabs((prev) =>
      prev.map((t) => (t.fileId === fileId ? { ...t, isDirty: true } : t))
    );
  }, []);

  const getActiveFile = useCallback((): ProjectFile | null => {
    return files.find((f) => f.id === activeFileId) ?? null;
  }, [files, activeFileId]);

  const getFileById = useCallback(
    (id: string): ProjectFile | null => {
      return files.find((f) => f.id === id) ?? null;
    },
    [files]
  );

  return {
    files,
    openTabs,
    activeFileId,
    openFile,
    closeTab,
    switchTab,
    updateFileContent,
    getActiveFile,
    getFileById,
  };
}