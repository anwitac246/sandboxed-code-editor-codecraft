import { Project, CreateProjectData } from '@/types/project';

const mockProjects: Project[] = [
  {
    id: 'proj_01',
    name: 'Auth Module',
    description: 'JWT-based authentication with refresh token rotation.',
    files: [
      { id: 'f1', name: 'auth.ts', content: '// auth logic', language: 'typescript' },
      { id: 'f2', name: 'middleware.ts', content: '// middleware', language: 'typescript' },
    ],
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isStarred: true,
  },
  {
    id: 'proj_02',
    name: 'Landing Page',
    description: 'Marketing landing page with animated hero section.',
    files: [
      { id: 'f3', name: 'index.html', content: '<!-- html -->', language: 'html' },
      { id: 'f4', name: 'styles.css', content: '/* styles */', language: 'css' },
    ],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    isStarred: false,
  },
  {
    id: 'proj_03',
    name: 'Data Pipeline',
    description: 'ETL pipeline with streaming support and error recovery.',
    files: [
      { id: 'f5', name: 'pipeline.ts', content: '// pipeline', language: 'typescript' },
    ],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isStarred: true,
  },
  {
    id: 'proj_04',
    name: 'API Gateway',
    description: 'Reverse proxy with rate limiting and request validation.',
    files: [
      { id: 'f6', name: 'gateway.js', content: '// gateway', language: 'javascript' },
    ],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    isStarred: false,
  },
  {
    id: 'proj_05',
    name: 'Design System',
    description: 'Shared component library with theming support.',
    files: [
      { id: 'f7', name: 'tokens.css', content: '/* tokens */', language: 'css' },
      { id: 'f8', name: 'components.ts', content: '// components', language: 'typescript' },
    ],
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    isStarred: false,
  },
];

let store: Project[] = [...mockProjects];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const projectService = {
  async getProjects(): Promise<Project[]> {
    await delay(300);
    return [...store];
  },

  async getProjectById(projectId: string): Promise<Project | null> {
    await delay(200);
    return store.find((p) => p.id === projectId) ?? null;
  },

  async createProject(data: CreateProjectData): Promise<Project> {
    await delay(400);
    const now = new Date().toISOString();
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: data.name,
      description: data.description,
      files: [],
      createdAt: now,
      updatedAt: now,
      isStarred: false,
    };
    store = [newProject, ...store];
    return newProject;
  },

  async toggleStar(projectId: string): Promise<Project | null> {
    await delay(150);
    store = store.map((p) =>
      p.id === projectId ? { ...p, isStarred: !p.isStarred } : p
    );
    return store.find((p) => p.id === projectId) ?? null;
  },
};