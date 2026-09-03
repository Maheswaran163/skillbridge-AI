'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Brain,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Zap,
  Target,
  TrendingUp,
  FileCheck2,
  Video,
  LineChart,
  Cpu,
  Layers,
  Database,
  Users,
} from 'lucide-react';
import { UserRole } from '@/types';

const ROLE_OPTIONS: { value: UserRole; label: string; icon: React.FC<any>; color: string; bg: string; desc: string; redirect: string }[] = [
  { value: 'student', label: 'Student', icon: GraduationCap, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-300', desc: 'Skill gap analysis, AI resume, interview prep', redirect: '/student' },
  { value: 'industry', label: 'Industry', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-300', desc: 'Post jobs, find verified candidates', redirect: '/industry' },
  { value: 'academician', label: 'Academician', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-300', desc: 'Consultancy, FDP, joint research', redirect: '/academician' },
  { value: 'institution_admin', label: 'Institution Admin', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-300', desc: 'Placement analytics & skill demand', redirect: '/institution' },
];

export default function HomePage() {
  const router = useRouter();
  const { switchDemoUser, registerUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'register' | 'demo'>('register');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' as UserRole, institutionName: '', department: '', careerGoal: '', companyName: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedRole = ROLE_OPTIONS.find(r => r.value === form.role)!;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await registerUser(form);
      const redirect = ROLE_OPTIONS.find(r => r.value === user.role)?.redirect || '/student';
      router.push(redirect);
    } catch (err: any) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (uid: string, redirect: string) => {
    setLoading(true);
    await switchDemoUser(uid);
    setLoading(false);
    router.push(redirect);
  };

  const features = [
    { icon: Brain, title: 'AI Skill Gap Analysis', desc: 'Pinpoint missing skills with personalized learning roadmaps' },
    { icon: FileCheck2, title: 'ATS Resume Analyzer', desc: 'Score your resume against job descriptions instantly' },
    { icon: Video, title: 'AI Interview Simulator', desc: 'Practice technical & HR rounds with real-time feedback' },
    { icon: Target, title: 'Smart Candidate Matching', desc: 'Industry finds top talent with 7-factor AI matching' },
    { icon: LineChart, title: 'Institution Analytics', desc: 'Track skill demand gaps and placement outcomes' },
    { icon: Database, title: 'RAG AI Career Assistant', desc: 'Ask placement policies & career questions, grounded in docs' },
  ];

  return (
    <div className="space-y-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-slate-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
          {/* Left — Hero Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> Smart India Hackathon 2026 — SIH Problem Statement
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Bridge Academia &amp; Industry with{' '}
              <span className="gradient-text">AI Skill Intelligence</span>
            </h1>

            <p className="text-slate-600 text-base leading-relaxed max-w-lg">
              SkillBridge AI maps student skill gaps, generates personalized learning roadmaps, matches verified candidates with industry roles, and delivers institutional placement analytics — all powered by Gemini AI and Pinecone RAG.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {[
                { label: '12,500+ Students', icon: Users },
                { label: '450+ Companies', icon: Briefcase },
                { label: '95% Placement Rate', icon: TrendingUp },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
                  <Icon className="w-3.5 h-3.5 text-orange-500" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Registration / Demo Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-orange-500/10 border border-slate-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'register' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Create Free Account
              </button>
              <button
                onClick={() => setActiveTab('demo')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'demo' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                ⚡ Try Demo
              </button>
            </div>

            <div className="p-6">
              {/* REGISTER TAB */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Role Selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">I am a...</label>
                    <div className="grid grid-cols-2 gap-2">
                      {ROLE_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = form.role === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setForm({ ...form, role: opt.value })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left text-xs font-semibold transition-all ${
                              isSelected ? `${opt.bg} ${opt.color}` : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50'
                            }`}
                          >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? opt.color : 'text-slate-400'}`} />
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">{selectedRole.desc}</p>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        placeholder={form.role === 'industry' ? 'Company Name / Full Name' : 'Your Full Name'}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="you@institution.edu.in"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Password *</label>
                      <div className="relative">
                        <input
                          type={showPass ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                          required
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Conditional fields */}
                    {(form.role === 'student' || form.role === 'academician') && (
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Institution Name</label>
                        <input
                          type="text"
                          placeholder="e.g. IIT Bombay, NIT Trichy"
                          value={form.institutionName}
                          onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                        />
                      </div>
                    )}

                    {form.role === 'student' && (
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Career Goal</label>
                        <select
                          value={form.careerGoal}
                          onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                        >
                          <option value="">Select your target role</option>
                          <option value="Full Stack Developer">Full Stack Developer</option>
                          <option value="AI/ML Engineer">AI/ML Engineer</option>
                          <option value="Cloud DevOps Engineer">Cloud DevOps Engineer</option>
                          <option value="Data Scientist">Data Scientist</option>
                          <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                          <option value="Product Manager">Product Manager</option>
                        </select>
                      </div>
                    )}

                    {form.role === 'industry' && (
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Company Name</label>
                        <input
                          type="text"
                          placeholder="e.g. TechCorp India Pvt Ltd"
                          value={form.companyName}
                          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl gradient-bg-primary text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create My Account & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    By registering, you agree to our Terms of Service. Free for students.
                  </p>
                </form>
              )}

              {/* DEMO TAB */}
              {activeTab === 'demo' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 text-center pb-1">
                    One-click login to explore any role dashboard instantly.
                  </p>
                  {[
                    { uid: 'std_aarav', label: 'Student — Aarav Sharma', sub: 'IIT Bombay • B.Tech CSE 2026', icon: GraduationCap, color: 'bg-orange-50 border-orange-200 hover:border-orange-400 text-orange-700', iconColor: 'text-orange-600', redirect: '/student' },
                    { uid: 'ind_techcorp', label: 'Industry — TechCorp India', sub: 'Enterprise SaaS • Bengaluru', icon: Briefcase, color: 'bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-700', iconColor: 'text-blue-600', redirect: '/industry' },
                    { uid: 'acad_raman', label: 'Academician — Dr. K. S. Raman', sub: 'CSE Dept • IIT Bombay', icon: BookOpen, color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 text-emerald-700', iconColor: 'text-emerald-600', redirect: '/academician' },
                    { uid: 'admin_deshmukh', label: 'Institution Admin — IIT Bombay', sub: 'Placement Cell Director', icon: Building2, color: 'bg-purple-50 border-purple-200 hover:border-purple-400 text-purple-700', iconColor: 'text-purple-600', redirect: '/institution' },
                  ].map((acc) => {
                    const Icon = acc.icon;
                    return (
                      <button
                        key={acc.uid}
                        onClick={() => handleDemoLogin(acc.uid, acc.redirect)}
                        disabled={loading}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 ${acc.color} transition-all text-left group disabled:opacity-50`}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${acc.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{acc.label}</p>
                          <p className="text-[11px] opacity-70">{acc.sub}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </button>
                    );
                  })}

                  {loading && (
                    <div className="flex justify-center py-2">
                      <div className="w-5 h-5 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Everything you need to <span className="gradient-text">bridge the gap</span></h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">A full-stack AI-powered platform serving 4 distinct user roles with purpose-built tools for every stakeholder.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Full-Stack Monorepo &amp; AI RAG Architecture</h3>
            <p className="text-xs text-slate-500">Production-grade infrastructure with graceful demo fallbacks</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {[
            { icon: Layers, label: 'Next.js 15 Frontend', desc: 'App Router, Tailwind CSS, Recharts, Lucide icons', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
            { icon: Cpu, label: 'Express REST Backend', desc: 'Modular Node.js, Firebase ID auth, Helmet, Rate Limiting', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' },
            { icon: Database, label: 'Pinecone Vector DB', desc: 'RAG pipeline, 768-dim embeddings, permission metadata filter', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
            { icon: Sparkles, label: 'Gemini 2.0 AI', desc: 'Skill gap analysis, ATS scoring, Interview feedback engine', color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100' },
          ].map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className={`${bg} p-4 rounded-xl border space-y-2`}>
              <Icon className={`w-5 h-5 ${color}`} />
              <h4 className="font-bold text-slate-800">{label}</h4>
              <p className="text-slate-500">{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {['TypeScript', 'Firebase Auth', 'JWT', 'Express.js', 'Pinecone', 'Gemini API', 'Recharts', 'Tailwind CSS', 'Zod', 'Docker'].map((tech) => (
            <span key={tech} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-medium">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ROLE CARDS */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900">Dedicated portals for every stakeholder</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { uid: 'std_aarav', redirect: '/student', label: 'Student Portal', sub: 'Aarav Sharma • IIT Bombay', icon: GraduationCap, features: ['Skill Gap & Learning Roadmap', 'ATS Resume Analyzer', 'AI Interview Practice'], accent: 'border-orange-200 hover:border-orange-400', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', badge: 'bg-orange-50 text-orange-600 border-orange-200' },
            { uid: 'ind_techcorp', redirect: '/industry', label: 'Industry Portal', sub: 'TechCorp India Pvt Ltd', icon: Briefcase, features: ['Post Jobs & Internships', 'AI Candidate Matcher', 'Applicant Tracking System'], accent: 'border-blue-200 hover:border-blue-400', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', badge: 'bg-blue-50 text-blue-600 border-blue-200' },
            { uid: 'acad_raman', redirect: '/academician', label: 'Academician Portal', sub: 'Dr. K. S. Raman • CSE Dept', icon: BookOpen, features: ['Industry Consultancy', 'FDP & Joint Research', 'Faculty Internships'], accent: 'border-emerald-200 hover:border-emerald-400', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
            { uid: 'admin_deshmukh', redirect: '/institution', label: 'Institution Admin', sub: 'IIT Bombay Placement Cell', icon: Building2, features: ['Skill Demand Analytics', 'AI Curriculum Guidance', 'Employability Scoreboard'], accent: 'border-purple-200 hover:border-purple-400', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', badge: 'bg-purple-50 text-purple-600 border-purple-200' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.uid}
                onClick={() => handleDemoLogin(card.uid, card.redirect)}
                disabled={loading}
                className={`p-6 rounded-2xl bg-white text-left group border-2 ${card.accent} shadow-sm hover:shadow-md transition-all disabled:opacity-50`}
              >
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{card.label}</h3>
                <p className={`text-xs px-2 py-0.5 rounded-full border inline-block mb-3 ${card.badge}`}>{card.sub}</p>
                <ul className="space-y-1.5">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${card.iconColor}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className={`mt-4 flex items-center gap-1 text-xs font-bold ${card.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Quick Demo Login</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
