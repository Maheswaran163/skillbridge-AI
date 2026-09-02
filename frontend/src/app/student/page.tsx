'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/apiClient';
import { StudentProfile, JobApplication } from '@/types';
import {
  Brain,
  Sparkles,
  Award,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileCheck2,
  Video,
  ArrowRight,
  ExternalLink,
  Target,
  ShieldAlert,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi<StudentProfile>('/students/profile').catch(() => null),
      fetchApi<JobApplication[]>('/applications').catch(() => []),
    ]).then(([stdData, appData]) => {
      if (stdData) setStudent(stdData);
      setApplications(appData);
      setLoading(false);
    });
  }, []);

  if (loading || !student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-blue-400 text-sm">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading Student Intelligence Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Student Welcome Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified Student Account
            </span>
            <span className="text-xs text-gray-400">• {student.institutionName} ({student.graduationYear})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, <span className="gradient-text">{student.name}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
            Target Goal: <span className="font-semibold text-blue-400">{student.careerGoal}</span> • {student.department}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/student/skill-gap"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Skill Gap & Roadmap</span>
          </Link>
          <Link
            href="/student/assessment"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl glass-card text-gray-200 text-xs font-semibold hover:border-blue-500/40 flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Take Test</span>
          </Link>
        </div>
      </div>

      {/* 9 Core Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-card border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Placement Readiness</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{student.readinessScore}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Ready for Day 1</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className="gradient-bg-primary h-full rounded-full" style={{ width: `${student.readinessScore}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Employability Index</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{student.employabilityScore}%</span>
            <span className="text-xs text-emerald-400 font-semibold">+4% this month</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${student.employabilityScore}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Technical Skill Score</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{student.technicalScore}%</span>
            <span className="text-xs text-purple-400 font-semibold">Proctored Verified</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${student.technicalScore}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Soft Skills & Leadership</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{student.softSkillScore}%</span>
            <span className="text-xs text-amber-400 font-semibold">Strong Communication</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Verified Projects</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{student.projects.length}</span>
            <span className="text-xs text-gray-400">GitHub Verified</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Applications Submitted</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{applications.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">1 Shortlisted</span>
          </div>
        </div>
      </div>

      {/* Verified Skill Matrix */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Verified Skill Profile
          </h3>
          <Link href="/student/assessment" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
            <span>Assess More Skills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {student.skills.map((sk) => (
            <div key={sk.skillId} className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-200">{sk.skillName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                    {sk.verificationLevel.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-gray-500">{sk.proficiencyLevel}</span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-blue-400">{sk.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
