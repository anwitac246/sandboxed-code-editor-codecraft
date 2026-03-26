'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/service/project.service';

const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Rust",
  "Go",
  "Java",
  "C++",
  "Other",
];

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    await createProject({
      name: name.trim(),
      description: description.trim() || undefined,
      language: language,
    });
    router.push('/dashboard/projects');
  };

  const inputStyles = "bg-transparent border-b border-zinc-800 pb-2 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#4FC3F7]/50 transition-colors font-mono";

  return (
    <div className="min-h-screen bg-[#0d1117] text-zinc-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-xs font-mono text-zinc-600 hover:text-zinc-300 transition-colors mb-10 flex items-center gap-2"
        >
          ← back
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[#4FC3F7] font-mono text-lg font-bold">&lt;/&gt;</span>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">CodeCraft</span>
        </div>

        <h1 className="text-2xl font-bold text-zinc-50 tracking-tight mb-1">
          New Project
        </h1>
        <p className="text-sm font-mono text-zinc-600 mb-10">
          Initialize a new workspace.
        </p>

        <div className="flex flex-col gap-8">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500">
              name <span className="text-[#4FC3F7]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. auth-module"
              className={inputStyles}
            />
            {error && (
              <p className="text-xs font-mono text-red-400">{error}</p>
            )}
          </div>

          {/* Language */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500">
              language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={inputStyles + " bg-[#0d1117]"}
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang} className="bg-[#161b22]">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500">
              description{' '}
              <span className="text-zinc-700 normal-case tracking-normal">optional</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="// what does this project do?"
              rows={3}
              className={inputStyles + " resize-none"}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="border border-zinc-600 text-zinc-200 text-sm font-mono px-5 py-3 hover:border-[#4FC3F7]/60 hover:text-[#4FC3F7] transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {submitting ? '// initializing...' : '→ Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
