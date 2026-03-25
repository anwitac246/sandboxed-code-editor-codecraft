'use client';

import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';

const langColors: Record<string, string> = {
  typescript: '#4FC3F7',
  javascript: '#F9A825',
  html: '#EF6C00',
  css: '#AB47BC',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return '1d ago';
  return `${days}d ago`;
}

interface ProjectCardProps {
  project: Project;
  onToggleStar: (id: string) => void;
}

export function ProjectCard({ project, onToggleStar }: ProjectCardProps) {
  const router = useRouter();
  const langs = [...new Set(project.files.map((f) => f.language))];
  const primaryLang = langs[0];

  return (
    <div
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
      className="group relative border border-border bg-background cursor-pointer transition-all duration-200 hover:border-secondary p-6 flex flex-col gap-4"
    >
      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent, ${langColors[primaryLang] ?? '#4FC3F7'}40, transparent)`,
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-foreground tracking-tight leading-snug">
          {project.name}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(project.id);
          }}
          className="text-xs transition-colors ml-4 shrink-0"
          style={{ color: project.isStarred ? '#F9A825' : 'var(--muted-foreground)' }}
        >
          {project.isStarred ? '★' : '☆'}
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
        {project.description ?? '// no description'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {langs.map((lang) => (
            <span
              key={lang}
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: langColors[lang] ?? 'var(--muted-foreground)' }}
            >
              {lang}
            </span>
          ))}
          {langs.length === 0 && (
            <span className="text-[10px] font-mono text-muted-foreground">empty</span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {timeAgo(project.updatedAt)}
        </span>
      </div>
    </div>
  );
}