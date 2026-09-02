'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  FileCheck,
  Video,
  LineChart,
  Cpu,
  Layers,
  Database,
} from 'lucide-react';

export default function HomePage() {
  const { switchDemoUser } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" /> Smart India Hackathon (SIH) Problem Statement Solution
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Bridge Academia & Industry with <span className="gradient-text">AI Skill Intelligence</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            SkillBridge AI maps student skill gaps, generates personalized learning roadmaps, matches verified candidates with industry roles, and delivers institutional placement analytics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/student"
              className="px-6 py-3.5 rounded-2xl gradient-bg-primary text-white font-semibold text-sm shadow-xl shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Explore Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/student/assessment"
              className="px-6 py-3.5 rounded-2xl glass-card text-gray-200 font-semibold text-sm hover:border-blue-500/40 transition-all flex items-center gap-2"
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Take Skill Assessment</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Role Switcher Demo Gateway */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Experience All 5 Role Dashboards</h2>
          <p className="text-xs text-gray-400 mt-1">Select a role below to immediately log in and explore its dedicated workflow.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <button
            onClick={() => switchDemoUser('std_aarav')}
            className="p-6 rounded-2xl glass-card text-left group border border-gray-800 hover:border-blue-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Student Portal</h3>
            <p className="text-xs text-gray-400 mb-4">Aarav Sharma • IIT Bombay</p>
            <ul className="space-y-1.5 text-[11px] text-gray-300">
              <li className="flex items-center gap-1.5">✓ Skill Gap & Roadmap</li>
              <li className="flex items-center gap-1.5">✓ ATS Resume Analyzer</li>
              <li className="flex items-center gap-1.5">✓ AI Interview Practice</li>
            </ul>
          </button>

          <button
            onClick={() => switchDemoUser('ind_techcorp')}
            className="p-6 rounded-2xl glass-card text-left group border border-gray-800 hover:border-purple-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Industry Portal</h3>
            <p className="text-xs text-gray-400 mb-4">TechCorp India Pvt Ltd</p>
            <ul className="space-y-1.5 text-[11px] text-gray-300">
              <li className="flex items-center gap-1.5">✓ Post Jobs & Internships</li>
              <li className="flex items-center gap-1.5">✓ Weighted Candidate Matcher</li>
              <li className="flex items-center gap-1.5">✓ Applicant Tracking System</li>
            </ul>
          </button>

          <button
            onClick={() => switchDemoUser('acad_raman')}
            className="p-6 rounded-2xl glass-card text-left group border border-gray-800 hover:border-emerald-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Academician Portal</h3>
            <p className="text-xs text-gray-400 mb-4">Dr. K. S. Raman • CSE Dept</p>
            <ul className="space-y-1.5 text-[11px] text-gray-300">
              <li className="flex items-center gap-1.5">✓ Industry Consultancy</li>
              <li className="flex items-center gap-1.5">✓ FDP & Joint Research</li>
              <li className="flex items-center gap-1.5">✓ Faculty Internships</li>
            </ul>
          </button>

          <button
            onClick={() => switchDemoUser('admin_deshmukh')}
            className="p-6 rounded-2xl glass-card text-left group border border-gray-800 hover:border-amber-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Institution Admin</h3>
            <p className="text-xs text-gray-400 mb-4">IIT Bombay Placement Cell</p>
            <ul className="space-y-1.5 text-[11px] text-gray-300">
              <li className="flex items-center gap-1.5">✓ Skill Demand Analytics</li>
              <li className="flex items-center gap-1.5">✓ AI Curriculum Guidance</li>
              <li className="flex items-center gap-1.5">✓ Employability Scoreboard</li>
            </ul>
          </button>
        </div>
      </section>

      {/* Architecture Pipeline */}
      <section className="glass-panel rounded-3xl p-8 border border-gray-800 space-y-6">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Full-Stack Monorepo & AI RAG Architecture</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 space-y-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h4 className="font-bold text-gray-200">Next.js 15 Frontend</h4>
            <p className="text-gray-400">App Router, Tailwind CSS, Lucide icons, Recharts visualization, Zod form validation.</p>
          </div>
          <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 space-y-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-gray-200">Express REST Backend</h4>
            <p className="text-gray-400">Modular Node.js service architecture, Firebase ID token verification, Helmet, Rate limiting.</p>
          </div>
          <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 space-y-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-gray-200">Pinecone Vector DB</h4>
            <p className="text-gray-400">RAG ingestion pipeline with 768-dim embeddings and strict metadata permission filtering.</p>
          </div>
          <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 space-y-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-gray-200">Gemini 1.5/2.0 AI</h4>
            <p className="text-gray-400">Grounded career recommendations, ATS resume scoring, and interview feedback engine.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
