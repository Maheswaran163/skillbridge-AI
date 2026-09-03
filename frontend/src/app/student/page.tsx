'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/apiClient';
import { StudentProfile, JobApplication } from '@/types';
import {
  Brain, Sparkles, Award, Briefcase, CheckCircle2, TrendingUp,
  FileCheck2, Video, ArrowRight, Target, BarChart3, BookOpen,
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
        <div className="flex items-center gap-3 text-orange-500 text-sm">
          <div className="w-5 h-5 border-2 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
          <span className="text-slate-600">Loading your intelligence profile...</span>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: 'Placement Readiness', value: `${student.readinessScore}%`, sub: 'Ready for Day 1', icon: Target, color: 'text-orange-600', bar: 'bg-orange-500', val: student.readinessScore },
    { label: 'Employability Index', value: `${student.employabilityScore}%`, sub: '+4% this month', icon: TrendingUp, color: 'text-emerald-600', bar: 'bg-emerald-500', val: student.employabilityScore },
    { label: 'Technical Skill Score', value: `${student.technicalScore}%`, sub: 'Proctored Verified', icon: Brain, color: 'text-blue-600', bar: 'bg-blue-500', val: student.technicalScore },
    { label: 'Soft Skills & Leadership', value: `${student.softSkillScore}%`, sub: 'Strong Communication', icon: Award, color: 'text-purple-600', bar: 'bg-purple-500', val: student.softSkillScore },
    { label: 'Verified Projects', value: `${student.projects.length}`, sub: 'GitHub Verified', icon: BookOpen, color: 'text-indigo-600', bar: 'bg-indigo-500', val: student.projects.length * 20 },
    { label: 'Applications', value: `${applications.length}`, sub: 'Submitted', icon: Briefcase, color: 'text-teal-600', bar: 'bg-teal-500', val: applications.length * 30 },
  ];

  const quickActions = [
    { href: '/student/skill-gap', label: 'AI Skill Gap & Roadmap', icon: Sparkles, color: 'gradient-bg-primary text-white shadow-md shadow-orange-500/25' },
    { href: '/student/assessment', label: 'Take Skill Assessment', icon: Brain, color: 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100' },
    { href: '/student/resume', label: 'ATS Resume Analyzer', icon: FileCheck2, color: 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100' },
    { href: '/student/interview', label: 'AI Interview Simulator', icon: Video, color: 'bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100' },
    { href: '/student/jobs', label: 'Browse Matched Jobs', icon: Briefcase, color: 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100' },
    { href: '/student/portfolio', label: 'Digital Portfolio', icon: Award, color: 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              ✓ Verified Student
            </span>
            <span className="text-xs text-slate-400">• {student.institutionName} ({student.graduationYear})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome back, <span className="gradient-text">{student.name}</span> 👋
          </h1>
          <p className="text-sm text-slate-500">
            Target Goal: <span className="font-semibold text-orange-600">{student.careerGoal}</span> • {student.department}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/student/skill-gap" className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
            AI Skill Gap & Roadmap
          </Link>
          <Link href="/student/assessment" className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 hover:bg-orange-50 hover:border-orange-200 transition-all">
            <Brain className="w-4 h-4 text-orange-500" />
            Take Test
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {metrics.map(({ label, value, sub, icon: Icon, color, bar, val }) => (
          <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-orange-200 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{value}</span>
              <span className={`text-xs font-semibold ${color}`}>{sub}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className={`${bar} h-full rounded-full`} style={{ width: `${Math.min(val, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-500" />
          AI Tools & Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02] ${color}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Skill Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-orange-500" />
            Verified Skill Profile
          </h3>
          <Link href="/student/assessment" className="text-xs text-orange-500 font-semibold hover:underline flex items-center gap-1">
            Assess More <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {student.skills.map((sk) => (
            <div key={sk.skillId} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:border-orange-200 transition-all">
              <div>
                <p className="text-xs font-bold text-slate-800">{sk.skillName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    {sk.verificationLevel.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400">{sk.proficiencyLevel}</span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-orange-600">{sk.score}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Applications */}
      {applications.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-orange-500" />
            My Applications
          </h3>
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-200 transition-all">
                <div>
                  <p className="text-sm font-bold text-slate-900">{app.jobTitle}</p>
                  <p className="text-xs text-slate-500">{app.companyName} • Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{app.matchScore}% Match</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 capitalize">{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
