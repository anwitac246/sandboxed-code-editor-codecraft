"use client";

import { useCallback, useRef, useState } from "react";
import { Project, ProjectFile } from "@/types/project";
import FileTree, { langFromName } from "@/components/features/editor/FileTree";
import { EditorPane } from "@/components/features/editor/EditorPane";
import { Terminal, TerminalLine } from "@/components/features/editor-viewer/Terminal";
import { Allotment } from "allotment";
import "allotment/style.css";
import {
  updateProjectFile,
  addProjectFile,
  renameProjectFile,
  deleteProjectFile,
  renameFolder,
  deleteFolder,
} from "@/service/project.service";

interface ProjectEditorProps {
  project: Project;
}

// ─── Confirmation modal ───────────────────────────────────────────────────────

function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[340px] rounded-2xl border border-white/[0.09] bg-[#0d0d1a] shadow-2xl p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-semibold text-white/85">Are you sure?</p>
          <p className="text-[13px] text-white/40 leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-[13px] font-medium bg-red-500/80 hover:bg-red-500 text-white transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const [files, setFiles] = useState<ProjectFile[]>(project.files);
  const [activeFileId, setActiveFileId] = useState<string | null>(
    project.files[0]?.id ?? null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);

  const handleTerminalClear = () => setTerminalLines([]);

  const activeFile = files.find((f) => f.id === activeFileId) ?? null;
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Content change (auto-save) ────────────────────────────────────────────

  const handleContentChange = useCallback(
    (fileId: string, content: string) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, content } : f))
      );
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        setIsSaving(true);
        setSaveError(null);
        try {
          await updateProjectFile(project.id, fileId, content);
        } catch {
          setSaveError("Auto-save failed.");
        } finally {
          setIsSaving(false);
        }
      }, 800);
    },
    [project.id]
  );

  // ── Add file  ─────────────────────────────────────────────────────────────
  // onAddFile receives either a full path (when called from context/toolbar with path)
  // or null to add at root.

  const handleAddFile = useCallback(
    async (fullPathOrNull: string | null) => {
      const fullPath = fullPathOrNull ?? `untitled-${Date.now()}.ts`;
      const lang = langFromName(fullPath);
      try {
        const newFile = await addProjectFile(project.id, fullPath, lang);
        setFiles((prev) => [...prev, newFile]);
        setActiveFileId(newFile.id);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Could not create file.");
      }
    },
    [project.id]
  );

  // ── Add folder (virtual — just creates a placeholder .gitkeep inside) ─────

  const handleAddFolder = useCallback(
    async (fullPathOrNull: string | null) => {
      const fullPath = fullPathOrNull ?? `folder-${Date.now()}`;
      const keepPath = `${fullPath}/.gitkeep`;
      try {
        const keepFile = await addProjectFile(project.id, keepPath, "plaintext", "");
        setFiles((prev) => [...prev, keepFile]);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Could not create folder.");
      }
    },
    [project.id]
  );

  // ── Rename file ───────────────────────────────────────────────────────────

  const handleRenameFile = useCallback(
    async (fileId: string, newName: string) => {
      try {
        const updated = await renameProjectFile(project.id, fileId, newName);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? updated : f))
        );
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Could not rename file.");
      }
    },
    [project.id]
  );

  // ── Delete file ───────────────────────────────────────────────────────────

  const handleDeleteFile = useCallback(
    (fileId: string) => {
      const file = files.find((f) => f.id === fileId);
      setConfirm({
        message: `Delete "${file?.name.split("/").pop() ?? fileId}"? This cannot be undone.`,
        onConfirm: async () => {
          setConfirm(null);
          try {
            await deleteProjectFile(project.id, fileId);
            setFiles((prev) => prev.filter((f) => f.id !== fileId));
            if (activeFileId === fileId) {
              setActiveFileId(files.find((f) => f.id !== fileId)?.id ?? null);
            }
          } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Could not delete file.");
          }
        },
      });
    },
    [project.id, files, activeFileId]
  );

  // ── Rename folder ─────────────────────────────────────────────────────────

  const handleRenameFolder = useCallback(
    async (oldPath: string, newName: string) => {
      // Derive new path: replace last segment
      const parts = oldPath.split("/");
      parts[parts.length - 1] = newName;
      const newPath = parts.join("/");
      try {
        const updated = await renameFolder(project.id, oldPath, newPath);
        setFiles(updated);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Could not rename folder.");
      }
    },
    [project.id]
  );

  // ── Delete folder ─────────────────────────────────────────────────────────

  const handleDeleteFolder = useCallback(
    (folderPath: string) => {
      const count = files.filter((f) =>
        f.name.startsWith(`${folderPath}/`)
      ).length;
      setConfirm({
        message: `Delete folder "${folderPath.split("/").pop()}" and all ${count} file${count !== 1 ? "s" : ""} inside? This cannot be undone.`,
        onConfirm: async () => {
          setConfirm(null);
          try {
            await deleteFolder(project.id, folderPath);
            setFiles((prev) =>
              prev.filter((f) => !f.name.startsWith(`${folderPath}/`))
            );
            // If active file was inside, clear it
            if (
              activeFileId &&
              files.find(
                (f) =>
                  f.id === activeFileId &&
                  f.name.startsWith(`${folderPath}/`)
              )
            ) {
              setActiveFileId(
                files.find((f) => !f.name.startsWith(`${folderPath}/`))?.id ?? null
              );
            }
          } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Could not delete folder.");
          }
        },
      });
    },
    [project.id, files, activeFileId]
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="flex flex-col h-full">
        {saveError && (
          <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-2 bg-red-500/[0.08] border-b border-red-500/20 text-[12.5px] text-red-400">
            <span>{saveError}</span>
            <button
              onClick={() => setSaveError(null)}
              className="text-red-400/60 hover:text-red-400 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          <Allotment>
            <Allotment.Pane preferredSize={240} minSize={180}>
              <FileTree
                projectName={project.name}
                files={files}
                activeFileId={activeFileId}
                onSelectFile={setActiveFileId}
                onAddFile={handleAddFile}
                onAddFolder={handleAddFolder}
                onRenameFile={handleRenameFile}
                onDeleteFile={handleDeleteFile}
                onRenameFolder={handleRenameFolder}
                onDeleteFolder={handleDeleteFolder}
              />
            </Allotment.Pane>
            <Allotment.Pane>
              <Allotment vertical>
                <Allotment.Pane>
                  <EditorPane
                    file={activeFile}
                    isSaving={isSaving}
                    onContentChange={handleContentChange}
                  />
                </Allotment.Pane>
                <Allotment.Pane preferredSize={200} minSize={100}>
                  <Terminal
                    lines={terminalLines}
                    isRunning={isTerminalRunning}
                    onClear={handleTerminalClear}
                  />
                </Allotment.Pane>
              </Allotment>
            </Allotment.Pane>
          </Allotment>
        </div>
      </div>

      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}