'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Layers, Loader2 } from 'lucide-react';
import { projectService } from '@/service/project.service';

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    await projectService.createProject({ name: name.trim(), description: description.trim() || undefined });
    router.push('/dashboard/projects');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 flex items-center justify-center px-6">
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/6 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="bg-zinc-900/60 border border-zinc-800/70 rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_60px_-12px_rgba(99,102,241,0.2)]">
          {/* Icon */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
            <Layers size={18} className="text-white" />
          </div>

          <h1 className="text-xl font-bold text-zinc-50 tracking-tight mb-1">New Project</h1>
          <p className="text-sm text-zinc-500 mb-8">Give your project a name to get started.</p>

          <div className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2">
                Project Name <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="e.g. Auth Module"
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
              {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2">
                Description <span className="text-zinc-700">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this project do?"
                rows={3}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 mt-1"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating…
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}