/**
 * project.service.ts
 *
 * Abstraction layer for all project-related data operations.
 * Currently returns mock in-memory data.
 * Replace each function body with real fetch/axios calls when the backend is ready.
 */

import { Project, ProjectFile, CreateProjectData } from "@/types/project";
import { MOCK_PROJECTS } from "@/data/mockProjects";

// ─── Simulated network delay ────────────────────────────────────────────────
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── In-memory store ─────────────────────────────────────────────────────────
let projectStore: Project[] = [...MOCK_PROJECTS];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeInitialFile(payload: CreateProjectData): ProjectFile {
  const langMap: Record<string, string> = {
    TypeScript: "typescript",
    JavaScript: "javascript",
    Python: "python",
    Rust: "rust",
    Go: "go",
    Java: "java",
    "C++": "cpp",
    Other: "plaintext",
  };
  const ext: Record<string, string> = {
    TypeScript: "ts",
    JavaScript: "js",
    Python: "py",
    Rust: "rs",
    Go: "go",
    Java: "java",
    "C++": "cpp",
    Other: "txt",
  };
  return {
    id: `f_${Date.now()}`,
    name: `index.${ext[payload.language] ?? "txt"}`,
    language: (langMap[payload.language] ?? "plaintext") as ProjectFile["language"],
    content: `// ${payload.name}\n// ${payload.description ?? "A new CodeCraft project"}\n`,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch all projects.
 * Future: GET /api/projects
 */
export async function getProjects(): Promise<Project[]> {
  await delay(300);
  return [...projectStore];
}

/**
 * Fetch a single project by ID.
 * Future: GET /api/projects/:id
 */
export async function getProjectById(
  projectId: string
): Promise<Project | null> {
  await delay(200);
  return projectStore.find((p) => p.id === projectId) ?? null;
}

/**
 * Create a new project with a generated entry file.
 * Future: POST /api/projects
 */
export async function createProject(
  payload: CreateProjectData
): Promise<Project> {
  await delay(300);
  const newProject: Project = {
    id: `proj_${Date.now()}`,
    name: payload.name,
    description: payload.description,
    language: payload.language,
    status: "active",
    isStarred: false,
    tags: payload.tags ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [makeInitialFile(payload)],
  };
  projectStore = [newProject, ...projectStore];
  return newProject;
}

/**
 * Toggle the starred state of a project.
 * Future: PATCH /api/projects/:id/star
 */
export async function toggleStar(projectId: string): Promise<Project> {
  await delay(150);
  const project = projectStore.find((p) => p.id === projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);
  project.isStarred = !project.isStarred;
  return { ...project };
}

/**
 * Update the content of a specific file within a project.
 * Future: PATCH /api/projects/:id/files/:fileId
 */
export async function updateProjectFile(
  projectId: string,
  fileId: string,
  content: string
): Promise<ProjectFile> {
  await delay(150);
  const project = projectStore.find((p) => p.id === projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);
  const file = project.files.find((f) => f.id === fileId);
  if (!file) throw new Error(`File ${fileId} not found`);
  file.content = content;
  project.updatedAt = new Date().toISOString();
  return { ...file };
}

/**
 * Delete a project.
 * Future: DELETE /api/projects/:id
 */
export async function deleteProject(projectId: string): Promise<void> {
  await delay(200);
  projectStore = projectStore.filter((p) => p.id !== projectId);
}

// ─── File management ──────────────────────────────────────────────────────────

/**
 * Add a new file to a project.
 * Future: POST /api/projects/:id/files
 */
export async function addProjectFile(
  projectId: string,
  name: string,           // full path e.g. "src/utils/helpers.ts"
  language: ProjectFile["language"],
  content = ""
): Promise<ProjectFile> {
  await delay(150);
  const project = projectStore.find((p) => p.id === projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);

  const existing = project.files.find((f) => f.name === name);
  if (existing) throw new Error(`A file named "${name}" already exists`);

  const newFile: ProjectFile = {
    id: `f_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    language,
    content,
  };
  project.files = [...project.files, newFile];
  project.updatedAt = new Date().toISOString();
  return { ...newFile };
}

/**
 * Rename a file (or move it by changing its path).
 * Future: PATCH /api/projects/:id/files/:fileId  { name }
 */
export async function renameProjectFile(
  projectId: string,
  fileId: string,
  newName: string
): Promise<ProjectFile> {
  await delay(150);
  const project = projectStore.find((p) => p.id === projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);

  const clash = project.files.find((f) => f.name === newName && f.id !== fileId);
  if (clash) throw new Error(`A file named "${newName}" already exists`);

  const file = project.files.find((f) => f.id === fileId);
  if (!file) throw new Error(`File ${fileId} not found`);

  // Derive language from extension when renaming
  const ext = newName.split(".").pop() ?? "";
  const extLangMap: Record<string, ProjectFile["language"]> = {
    ts: "typescript", tsx: "typescript",
    js: "javascript", jsx: "javascript",
    py: "python",
    rs: "rust",
    go: "go",
    java: "java",
    cpp: "cpp", cc: "cpp", cxx: "cpp",
    html: "html", htm: "html",
    css: "css",
    json: "json",
    md: "markdown", mdx: "markdown",
  };
  file.name = newName;
  file.language = extLangMap[ext] ?? "plaintext";
  project.updatedAt = new Date().toISOString();
  return { ...file };
}

/**
 * Delete a file from a project.
 * Future: DELETE /api/projects/:id/files/:fileId
 */
export async function deleteProjectFile(
  projectId: string,
  fileId: string
): Promise<void> {
  await delay(150);
  const project = projectStore.find((p) => p.id === projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);
  project.files = project.files.filter((f) => f.id !== fileId);
  project.updatedAt = new Date().toISOString();
}

/**
 * Rename a folder (renames the path prefix of all contained files).
 * Future: PATCH /api/projects/:id/folders  { oldPath, newPath }
 */
export async function renameFolder(
  projectId: string,
  oldPath: string,
  newPath: string
): Promise<ProjectFile[]> {
  await delay(150);
  const project = projectStore.find((p) => p.id === projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);
  project.files = project.files.map((f) =>
    f.name.startsWith(`${oldPath}/`)
      ? { ...f, name: f.name.replace(`${oldPath}/`, `${newPath}/`) }
      : f
  );
  project.updatedAt = new Date().toISOString();
  return [...project.files];
}

/**
 * Delete a folder and all files inside it.
 * Future: DELETE /api/projects/:id/folders  { path }
 */
export async function deleteFolder(
  projectId: string,
  folderPath: string
): Promise<void> {
  await delay(150);
  const project = projectStore.find((p) => p.id === projectId);
  if (!project) throw new Error(`Project ${projectId} not found`);
  project.files = project.files.filter(
    (f) => !f.name.startsWith(`${folderPath}/`)
  );
  project.updatedAt = new Date().toISOString();
}