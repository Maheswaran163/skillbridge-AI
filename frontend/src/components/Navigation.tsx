'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Brain,
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  Sparkles,
  UserCheck,
  Compass,
  FileCheck2,
  Award,
  Video,
  ChevronDown,
  LogOut,
  Zap,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { user, role, switchDemoUser, logout } = useAuth();

  const demoAccounts = [
    { label: 'Student (Aarav Sharma)', uid: 'std_aarav', role: 'student', icon: GraduationCap, color: 'text-orange-600' },
    { label: 'Industry (TechCorp India)', uid: 'ind_techcorp', role: 'industry', icon: Briefcase, color: 'text-blue-600' },
    { label: 'Academician (Dr. K. S. Raman)', uid: 'acad_raman', role: 'academician', icon: BookOpen, color: 'text-emerald-600' },
    { label: 'Institution Admin (IIT Bombay)', uid: 'admin_deshmukh', role: 'institution_admin', icon: Building2, color: 'text-purple-600' },
  ];

  const studentLinks = [
    { href: '/student', label: 'Dashboard', icon: Compass },
    { href: '/student/assessment', label: 'Skill Assessment', icon: Brain },
    { href: '/student/skill-gap', label: 'Skill Gap & Roadmap', icon: Sparkles },
    { href: '/student/jobs', label: 'Jobs & Internships', icon: Briefcase },
    { href: '/student/resume', label: 'Resume Analyzer', icon: FileCheck2 },
    { href: '/student/portfolio', label: 'Portfolio', icon: Award },
    { href: '/student/interview', label: 'AI Interview', icon: Video },
  ];

  const industryLinks = [
    { href: '/industry', label: 'Overview', icon: Briefcase },
    { href: '/industry/candidates', label: 'AI Candidate Matcher', icon: UserCheck },
  ];

  const academicianLinks = [
    { href: '/academician', label: 'Faculty Dashboard', icon: BookOpen },
  ];

  const institutionLinks = [
    { href: '/institution', label: 'Placement Analytics', icon: Building2 },
  ];

  const activeLinks =
    role === 'student' ? studentLinks
    : role === 'industry' ? industryLinks
    : role === 'academician' ? academicianLinks
    : institutionLinks;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">SkillBridge</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 border border-orange-200">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Measure Skills. Identify Gaps. Build Careers.</p>
          </div>
        </Link>

        {/* Role Nav Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            {activeLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Side — Demo Switcher or Auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-semibold text-slate-700 hover:border-orange-400 transition-all">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="hidden sm:inline-block max-w-[130px] truncate">{user.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-orange-500 text-white">{role.replace('_', ' ')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div className="absolute right-0 mt-2 w-68 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 hidden group-hover:block z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SIH Demo Role Switcher</p>
                </div>
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  const isCurrent = user?.uid === acc.uid;
                  return (
                    <button
                      key={acc.uid}
                      onClick={() => switchDemoUser(acc.uid)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                        isCurrent ? 'bg-orange-50 text-orange-600 border border-orange-200 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${acc.color}`} />
                        <span>{acc.label}</span>
                      </div>
                      {isCurrent && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                    </button>
                  );
                })}
                <div className="pt-1 mt-1 border-t border-slate-100">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/"
              className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:scale-105 transition-transform"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
