export type Language =
  | 'javascript'
  | 'typescript'
  | 'html'
  | 'css'
  | 'python'
  | 'java'
  | 'cpp'
  | 'c'
  | 'rust'
  | 'ruby'
  | 'go'
  | 'json'
  | 'markdown'
  | 'plaintext';

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
  language: string;
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  tags: string[];
  status: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  language: string;
  tags?: string[];
}