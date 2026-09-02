'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { StudentProfile } from '@/types';
import { Award, ShieldCheck, Github, Linkedin, ExternalLink, Code2, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function StudentPortfolioPage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);

  useEffect(() => {
    fetchApi<StudentProfile>('/students/profile')
      .then((data) => setStudent(data))
      .catch(() => null);
  }, []);

  if (!student) return <div className="p-8 text-center text-gray-400">Loading Portfolio...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Portfolio Header */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-bg-primary flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/25">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{student.name}</h1>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-gray-400">{student.degree} {student.department} • {student.institutionName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {student.githubUrl && (
              <a href={student.githubUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl glass-card text-gray-300 hover:text-white">
                <Github className="w-4 h-4" />
              </a>
            )}
            {student.linkedinUrl && (
              <a href={student.linkedinUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl glass-card text-blue-400 hover:text-blue-300">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/40 p-4 rounded-2xl border border-gray-800">
          {student.bio}
        </p>
      </div>

      {/* Verified Skills Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Verified Skill Matrix & Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {student.skills.map((sk) => (
            <div key={sk.skillId} className="glass-card p-4 rounded-2xl border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{sk.skillName}</span>
                <span className="text-xs font-black text-blue-400">{sk.score}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ✓ {sk.verificationLevel.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Projects */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-purple-400" /> Key Portfolio Engineering Projects
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.projects.map((p) => (
            <div key={p.id} className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{p.title}</h4>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Verified</span>
              </div>
              <p className="text-xs text-gray-400">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.techStack.map((tech) => (
                  <span key={tech} className="text-[10px] bg-gray-900 text-gray-300 px-2 py-0.5 rounded border border-gray-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
