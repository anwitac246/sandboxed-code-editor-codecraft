'use client';

import { useRouter } from 'next/navigation';
import { Star, FileCode2, Clock } from 'lucide-react';
import { Project } from '@/types/project';

const langColors: Record<string, string> = {
  typescript: 'text-blue-400 bg-blue-500/10',
  javascript: 'text-yellow-400 bg-yellow-500/10',
  html: 'text-orange-400 bg-orange-500/10',
  css: 'text-purple-400 bg-purple-500/10',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

interface ProjectCardProps {
  project: Project;
  onToggleStar: (id: string) => void;
}

export function ProjectCard({ project, onToggleStar }: ProjectCardProps) {
  const router = useRouter();
  const langs = [...new Set(project.files.map((f) => f.language))];

  return (
    <div
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
      className="group relative bg-zinc-900/60 border border-zinc-800/70 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700/80 hover:shadow-[0_8px_40px_-8px_rgba(99,102,241,0.25)] hover:bg-zinc-900/80 backdrop-blur-sm"
    >
      {/* Glow blob on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/5 group-hover:to-violet-500/5 transition-all duration-300 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-700/50 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-violet-500/20 group-hover:border-blue-500/30 transition-all">
            <FileCode2 size={14} className="text-zinc-400 group-hover:text-blue-300 transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight leading-snug">
            {project.name}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(project.id);
          }}
          className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Star
            size={14}
            className={
              project.isStarred
                ? 'fill-amber-400 text-amber-400'
                : 'text-zinc-600 hover:text-zinc-400'
            }
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
        {project.description ?? 'No description provided.'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {langs.map((lang) => (
            <span
              key={lang}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide ${langColors[lang] ?? 'text-zinc-400 bg-zinc-800'}`}
            >
              {lang}
            </span>
          ))}
          {langs.length === 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full text-zinc-600 bg-zinc-800">
              Empty
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-600">
          <Clock size={10} />
          {timeAgo(project.updatedAt)}
        </div>
      </div>
    </div>
  );
}