"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { ProjectFile } from "@/types/project";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FileTreeCallbacks {
  onSelectFile: (fileId: string) => void;
  onAddFile: (folderPath: string | null) => void;
  onAddFolder: (parentPath: string | null) => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFolder: (oldPath: string, newName: string) => void;
  onDeleteFolder: (folderPath: string) => void;
}

interface FileTreeProps extends FileTreeCallbacks {
  projectName: string;
  files: ProjectFile[];
  activeFileId: string | null;
}

interface FileNode {
  kind: "file";
  file: ProjectFile;
  depth: number;
}

interface FolderNode {
  kind: "folder";
  path: string;
  name: string;
  depth: number;
  children: TreeNode[];
}

type TreeNode = FileNode | FolderNode;

// ─── Extension → language ─────────────────────────────────────────────────────

const EXT_LANG: Record<string, ProjectFile["language"]> = {
  ts: "typescript", tsx: "typescript",
  js: "javascript", jsx: "javascript",
  py: "python", rs: "rust", go: "go", java: "java",
  cpp: "cpp", cc: "cpp", cxx: "cpp", h: "cpp",
  html: "html", htm: "html", css: "css",
  json: "json", md: "markdown", mdx: "markdown",
};

export function langFromName(name: string): ProjectFile["language"] {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_LANG[ext] ?? "plaintext";
}

const LANG_COLOR: Record<string, string> = {
  typescript: "text-blue-400", javascript: "text-yellow-400",
  python: "text-green-400", rust: "text-orange-400",
  go: "text-cyan-400", java: "text-red-400", cpp: "text-purple-400",
  html: "text-orange-300", css: "text-sky-300", json: "text-amber-300",
  markdown: "text-white/35", plaintext: "text-white/25",
};

// ─── Build tree ───────────────────────────────────────────────────────────────

function buildTree(files: ProjectFile[]): TreeNode[] {
  const root: FolderNode = { kind: "folder", path: "", name: "", depth: -1, children: [] };
  const folderMap = new Map<string, FolderNode>();
  folderMap.set("", root);

  function getOrCreateFolder(fullPath: string, depth: number): FolderNode {
    if (folderMap.has(fullPath)) return folderMap.get(fullPath)!;
    const parts = fullPath.split("/");
    const name = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join("/");
    const parentNode = getOrCreateFolder(parentPath, depth - 1);
    const folder: FolderNode = { kind: "folder", path: fullPath, name, depth, children: [] };
    folderMap.set(fullPath, folder);
    parentNode.children.push(folder);
    return folder;
  }

  for (const file of files) {
    const parts = file.name.split("/");
    if (parts.length === 1) {
      root.children.push({ kind: "file", file, depth: 0 });
    } else {
      const folderPath = parts.slice(0, -1).join("/");
      const folder = getOrCreateFolder(folderPath, parts.length - 1);
      folder.children.push({ kind: "file", file, depth: parts.length - 1 });
    }
  }

  function sortChildren(nodes: TreeNode[]): void {
    nodes.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
      const aName = a.kind === "folder" ? a.name : a.file.name.split("/").pop()!;
      const bName = b.kind === "folder" ? b.name : b.file.name.split("/").pop()!;
      return aName.localeCompare(bName);
    });
    for (const node of nodes) {
      if (node.kind === "folder") sortChildren(node.children);
    }
  }
  sortChildren(root.children);
  return root.children;
}

// ─── Inline input ─────────────────────────────────────────────────────────────

function InlineInput({
  defaultValue,
  onConfirm,
  onCancel,
  placeholder,
}: {
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    if (defaultValue) {
      const dotIdx = defaultValue.lastIndexOf(".");
      ref.current?.setSelectionRange(0, dotIdx > 0 ? dotIdx : defaultValue.length);
    }
  }, [defaultValue]);

  const commit = () => {
    const val = ref.current?.value.trim() ?? "";
    if (val) onConfirm(val);
    else onCancel();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") onCancel();
  };

  return (
    <input
      ref={ref}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onBlur={commit}
      onKeyDown={onKey}
      className="w-full bg-[#13132a] border border-indigo-500/50 rounded px-1.5 py-0.5
        text-[12px] font-mono text-white/90 outline-none ring-1 ring-indigo-500/30
        placeholder:text-white/20"
    />
  );
}

// ─── Row action buttons (appear on hover, VS Code-style) ──────────────────────

function RowActions({
  onAddFile,
  onAddFolder,
  onRename,
  onDelete,
}: {
  onAddFile?: () => void;
  onAddFolder?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="ml-auto flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 pointer-events-none group-hover:pointer-events-auto">
      {onAddFile && (
        <ActionIcon title="New file" onClick={onAddFile}>
          {/* file + icon */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 1H7L10 4V11H3V1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M7 1V4H10" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M5 7.5H7M6 6.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </ActionIcon>
      )}
      {onAddFolder && (
        <ActionIcon title="New folder" onClick={onAddFolder}>
          {/* folder + icon */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 3H4L5.3 1.8H11V9.5H1V3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M6 5.5V7.5M5 6.5H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </ActionIcon>
      )}
      {onRename && (
        <ActionIcon title="Rename" onClick={onRename}>
          {/* pencil icon */}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M7.5 1.5L9.5 3.5L3.5 9.5H1.5V7.5L7.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
        </ActionIcon>
      )}
      {onDelete && (
        <ActionIcon title="Delete" onClick={onDelete} danger>
          {/* trash icon */}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 3H9M4 3V2H7V3M4.5 5V8.5M6.5 5V8.5M3 3L3.5 9.5H7.5L8 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ActionIcon>
      )}
    </div>
  );
}

function ActionIcon({
  title,
  onClick,
  danger = false,
  children,
}: {
  title: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`p-1 rounded transition-all duration-100
        ${danger
          ? "text-white/20 hover:text-red-400 hover:bg-red-500/10"
          : "text-white/20 hover:text-white/80 hover:bg-white/[0.08]"
        }`}
    >
      {children}
    </button>
  );
}

// ─── Context menu ─────────────────────────────────────────────────────────────

interface ContextMenuState {
  x: number;
  y: number;
  target:
    | { kind: "file"; fileId: string; fileName: string }
    | { kind: "folder"; path: string; name: string }
    | { kind: "root" };
}

function ContextMenu({
  state, onClose, onNewFile, onNewFolder, onRename, onDelete,
}: {
  state: ContextMenuState;
  onClose: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const item = (label: string, onClick: () => void, danger = false) => (
    <button
      key={label}
      onMouseDown={(e) => { e.preventDefault(); onClick(); onClose(); }}
      className={`w-full text-left px-3 py-1.5 text-[12px] rounded-md transition-colors
        ${danger
          ? "text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.08]"
          : "text-white/55 hover:text-white/90 hover:bg-white/[0.06]"}`}
    >
      {label}
    </button>
  );

  return (
    <div
      ref={ref}
      style={{ top: state.y, left: state.x }}
      className="fixed z-50 min-w-[150px] rounded-lg border border-white/[0.09] bg-[#0e0e1c] shadow-2xl shadow-black/60 py-1.5 px-1"
    >
      {item("New file", onNewFile)}
      {item("New folder", onNewFolder)}
      {(state.target.kind === "file" || state.target.kind === "folder") && (
        <>
          <div className="my-1 h-px bg-white/[0.06]" />
          {onRename && item("Rename", onRename)}
          {onDelete && item("Delete", onDelete, true)}
        </>
      )}
    </div>
  );
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolButton({ title, onClick, children }: {
  title: string; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="p-1.5 rounded text-white/25 hover:text-white/75 hover:bg-white/[0.07] transition-all duration-150"
    >
      {children}
    </button>
  );
}

// ─── Tree node row (recursive) ────────────────────────────────────────────────

function TreeNodeRowWrapper({
  node, depth, renamingPath, activeFileId, creating,
  onSelect, onContextMenu, onRenameProxy, onCancelRename,
  onConfirmCreate, onCancelCreate,
  onStartRenamingFile, onStartRenamingFolder,
  onDeleteFile, onDeleteFolder,
  onStartCreatingFile, onStartCreatingFolder,
}: {
  node: TreeNode;
  depth: number;
  renamingPath: string | null;
  activeFileId: string | null;
  creating: { kind: "file" | "folder"; parentPath: string | null } | null;
  onSelect: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, target: ContextMenuState["target"]) => void;
  onRenameProxy: (idOrPath: string, newValue: string) => void;
  onCancelRename: () => void;
  onConfirmCreate: (value: string) => void;
  onCancelCreate: () => void;
  onStartRenamingFile: (id: string) => void;
  onStartRenamingFolder: (path: string) => void;
  onDeleteFile: (id: string) => void;
  onDeleteFolder: (path: string) => void;
  onStartCreatingFile: (parentPath: string | null) => void;
  onStartCreatingFolder: (parentPath: string | null) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  if (node.kind === "file") {
    const displayName = node.file.name.split("/").pop() ?? node.file.name;
    const indent = depth * 12 + 18;
    const color = LANG_COLOR[node.file.language] ?? "text-white/25";
    const isActive = node.file.id === activeFileId;

    return (
      <div
        style={{ paddingLeft: indent }}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e, { kind: "file", fileId: node.file.id, fileName: node.file.name });
        }}
        onClick={() => onSelect(node.file.id)}
        className={`group flex items-center gap-2 pr-1 py-[3px] cursor-pointer rounded-sm select-none overflow-visible
  ${isActive ? "bg-indigo-500/10" : "hover:bg-white/[0.04]"}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`shrink-0 ${color}`}>
          <path d="M3 1H7.5L10 3.5V11H3V1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M7.5 1V3.5H10" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        </svg>

        {renamingPath === node.file.id ? (
          <InlineInput
            defaultValue={displayName}
            onConfirm={(v) => {
              const parts = node.file.name.split("/");
              parts[parts.length - 1] = v;
              onRenameProxy(node.file.id, parts.join("/"));
            }}
            onCancel={onCancelRename}
          />
        ) : (
          <>
            <span className={`text-[12.5px] font-mono truncate transition-colors flex-1 min-w-0
              ${isActive ? "text-white/90" : "text-white/40 group-hover:text-white/75"}`}>
              {displayName}
            </span>
            {/* VS Code-style hover actions */}
            <RowActions
              onRename={() => onStartRenamingFile(node.file.id)}
              onDelete={() => onDeleteFile(node.file.id)}
            />
            {isActive && (
              <span className="h-1 w-1 rounded-full bg-indigo-400 shrink-0 group-hover:hidden" />
            )}
          </>
        )}
      </div>
    );
  }

  // ── Folder ────────────────────────────────────────────────────────────────
  const indent = depth * 12 + 6;

  return (
    <div>
      <div
        style={{ paddingLeft: indent }}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e, { kind: "folder", path: node.path, name: node.name });
        }}
        onClick={() => setCollapsed((c) => !c)}
        className="group flex items-center gap-1.5 pr-1 py-[3px] cursor-pointer hover:bg-white/[0.04] rounded-sm select-none overflow-visible"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`shrink-0 text-white/25 transition-transform duration-150 ${collapsed ? "" : "rotate-90"}`}>
          <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 text-indigo-400/50">
          {collapsed
            ? <path d="M1 3.5H4.5L5.8 2H12V10.5H1V3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            : <>
                <path d="M1 3.5H4.5L5.8 2H12V4.5H1V3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M1 4.5H12V10.5H1V4.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </>
          }
        </svg>

        {renamingPath === node.path ? (
          <InlineInput
            defaultValue={node.name}
            placeholder="folder-name"
            onConfirm={(v) => onRenameProxy(node.path, v)}
            onCancel={onCancelRename}
          />
        ) : (
          <>
            <span className="text-[12.5px] text-white/50 group-hover:text-white/75 font-mono truncate transition-colors flex-1 min-w-0">
              {node.name}
            </span>
            {/* VS Code-style hover actions for folders */}
            <RowActions
              onAddFile={() => { setCollapsed(false); onStartCreatingFile(node.path); }}
              onAddFolder={() => { setCollapsed(false); onStartCreatingFolder(node.path); }}
              onRename={() => onStartRenamingFolder(node.path)}
              onDelete={() => onDeleteFolder(node.path)}
            />
          </>
        )}
      </div>

      {!collapsed && (
        <div>
          {/* Inline creation input inside this folder */}
          {creating && creating.parentPath === node.path && (
            <div style={{ paddingLeft: (depth + 1) * 12 + 18 }} className="pr-2 py-1">
              <InlineInput
                placeholder={creating.kind === "file" ? "filename.ts" : "folder-name"}
                onConfirm={onConfirmCreate}
                onCancel={onCancelCreate}
              />
            </div>
          )}

          {node.children.map((child) => (
            <TreeNodeRowWrapper
              key={child.kind === "folder" ? child.path : child.file.id}
              node={child}
              depth={depth + 1}
              renamingPath={renamingPath}
              activeFileId={activeFileId}
              creating={creating}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
              onRenameProxy={onRenameProxy}
              onCancelRename={onCancelRename}
              onConfirmCreate={onConfirmCreate}
              onCancelCreate={onCancelCreate}
              onStartRenamingFile={onStartRenamingFile}
              onStartRenamingFolder={onStartRenamingFolder}
              onDeleteFile={onDeleteFile}
              onDeleteFolder={onDeleteFolder}
              onStartCreatingFile={onStartCreatingFile}
              onStartCreatingFolder={onStartCreatingFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main FileTree export ─────────────────────────────────────────────────────

export default function FileTree({
  projectName, files, activeFileId,
  onSelectFile, onAddFile, onAddFolder,
  onRenameFile, onDeleteFile, onRenameFolder, onDeleteFolder,
}: FileTreeProps) {
  const tree = buildTree(files);

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renamingFolderPath, setRenamingFolderPath] = useState<string | null>(null);
  const [creating, setCreating] = useState<{
    kind: "file" | "folder";
    parentPath: string | null;
  } | null>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, target: ContextMenuState["target"]) => {
      e.preventDefault();
      e.stopPropagation();
      const x = Math.min(e.clientX, window.innerWidth - 170);
      const y = Math.min(e.clientY, window.innerHeight - 140);
      setContextMenu({ x, y, target });
    },
    []
  );

  const closeContext = useCallback(() => setContextMenu(null), []);

  const contextFolderPath =
    contextMenu?.target.kind === "folder"
      ? contextMenu.target.path
      : contextMenu?.target.kind === "file"
      ? (() => {
          const p = files.find((f) =>
            contextMenu.target.kind === "file" && f.id === (contextMenu.target as { fileId: string }).fileId
          )?.name ?? "";
          const parts = p.split("/");
          return parts.length > 1 ? parts.slice(0, -1).join("/") : null;
        })()
      : null;

  const handleRenameProxy = useCallback(
    (idOrPath: string, newValue: string) => {
      if (renamingFileId === idOrPath) {
        onRenameFile(idOrPath, newValue);
        setRenamingFileId(null);
      } else if (renamingFolderPath === idOrPath) {
        onRenameFolder(idOrPath, newValue);
        setRenamingFolderPath(null);
      }
    },
    [renamingFileId, renamingFolderPath, onRenameFile, onRenameFolder]
  );

  const cancelRename = useCallback(() => {
    setRenamingFileId(null);
    setRenamingFolderPath(null);
  }, []);

  const renamingPath = renamingFileId ?? renamingFolderPath;

  const handleDeleteFromContext = useCallback(() => {
    if (!contextMenu) return;
    if (contextMenu.target.kind === "file") onDeleteFile(contextMenu.target.fileId);
    else if (contextMenu.target.kind === "folder") onDeleteFolder(contextMenu.target.path);
  }, [contextMenu, onDeleteFile, onDeleteFolder]);

  const startCreatingFile = useCallback((parentPath: string | null) => {
    setCreating({ kind: "file", parentPath });
  }, []);

  const startCreatingFolder = useCallback((parentPath: string | null) => {
    setCreating({ kind: "folder", parentPath });
  }, []);

  const confirmCreate = useCallback(
    (value: string) => {
      if (!creating) return;
      const fullPath = creating.parentPath ? `${creating.parentPath}/${value}` : value;
      if (creating.kind === "file") onAddFile(fullPath as any);
      else onAddFolder(fullPath as any);
      setCreating(null);
    },
    [creating, onAddFile, onAddFolder]
  );

  return (
    <>
      <aside
        className="flex flex-col h-full bg-[#08080f] border-r border-white/[0.05] w-[210px] shrink-0 overflow-hidden"
        onContextMenu={(e) => { e.preventDefault(); handleContextMenu(e, { kind: "root" }); }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.05] shrink-0">
          <span className="text-[11px] font-semibold text-white/35 uppercase tracking-widest truncate">
            {projectName}
          </span>
          <div className="flex items-center gap-0.5">
            <ToolButton title="New file" onClick={() => startCreatingFile(null)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 1H7L10 4V11H3V1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M7 1V4H10" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M5 7.5H7M6 6.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </ToolButton>
            <ToolButton title="New folder" onClick={() => startCreatingFolder(null)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 3H4L5.3 1.8H11V9.5H1V3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M6 5.5V7.5M5 6.5H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </ToolButton>
          </div>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto overflow-x-visible py-1 px-1">
          {/* Root-level creation input */}
          {creating && creating.parentPath === null && (
            <div className="pl-5 pr-2 py-1">
              <InlineInput
                placeholder={creating.kind === "file" ? "filename.ts" : "folder-name"}
                onConfirm={confirmCreate}
                onCancel={() => setCreating(null)}
              />
            </div>
          )}

          {tree.length === 0 && !creating && (
            <div className="flex flex-col items-center gap-2 py-8 text-center px-3">
              <p className="text-[11px] text-white/20">Empty project</p>
              <button
                onClick={() => startCreatingFile(null)}
                className="text-[11px] text-indigo-400/60 hover:text-indigo-400 transition-colors"
              >
                + Create a file
              </button>
            </div>
          )}

          {tree.map((node) => (
            <TreeNodeRowWrapper
              key={node.kind === "folder" ? node.path : node.file.id}
              node={node}
              depth={0}
              renamingPath={renamingPath}
              activeFileId={activeFileId}
              creating={creating}
              onSelect={onSelectFile}
              onContextMenu={handleContextMenu}
              onRenameProxy={handleRenameProxy}
              onCancelRename={cancelRename}
              onConfirmCreate={confirmCreate}
              onCancelCreate={() => setCreating(null)}
              onStartRenamingFile={setRenamingFileId}
              onStartRenamingFolder={setRenamingFolderPath}
              onDeleteFile={onDeleteFile}
              onDeleteFolder={onDeleteFolder}
              onStartCreatingFile={startCreatingFile}
              onStartCreatingFolder={startCreatingFolder}
            />
          ))}
        </div>
      </aside>

      {contextMenu && (
        <ContextMenu
          state={contextMenu}
          onClose={closeContext}
          onNewFile={() => startCreatingFile(contextFolderPath)}
          onNewFolder={() => startCreatingFolder(contextFolderPath)}
          onRename={
            contextMenu.target.kind === "file"
              ? () => setRenamingFileId((contextMenu.target as { fileId: string }).fileId)
              : contextMenu.target.kind === "folder"
              ? () => setRenamingFolderPath((contextMenu.target as { path: string }).path)
              : undefined
          }
          onDelete={contextMenu.target.kind !== "root" ? handleDeleteFromContext : undefined}
        />
      )}
    </>
  );
}