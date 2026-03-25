export type Language = 'javascript' | 'typescript' | 'html' | 'css';

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  language: Language;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
}

export interface CreateProjectData {
  name: string;
  description?: string;
}