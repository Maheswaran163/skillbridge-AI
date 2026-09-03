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
  ShieldCheck,
  Sparkles,
  UserCheck,
  Compass,
  FileCheck2,
  Award,
  Video,
  ChevronDown,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { user, role, switchDemoUser } = useAuth();

  const demoAccounts = [
    { label: 'Student (Aarav Sharma)', uid: 'std_aarav', role: 'student', icon: GraduationCap },
    { label: 'Staff (Priya Nair - TPO)', uid: 'staff_priya', role: 'staff', icon: UserCheck },
    { label: 'Industry (TechCorp India)', uid: 'ind_techcorp', role: 'industry', icon: Briefcase },
    { label: 'Academician (Dr. K. S. Raman)', uid: 'acad_raman', role: 'academician', icon: BookOpen },
    { label: 'Institution Admin (IIT Bombay)', uid: 'admin_deshmukh', role: 'institution_admin', icon: Building2 },
  ];

  const studentLinks = [
    { href: '/student', label: 'Dashboard', icon: Compass },
    { href: '/student/assessment', label: 'Skill Assessment', icon: Brain },
    { href: '/student/skill-gap', label: 'Skill Gap & Roadmap', icon: Sparkles },
    { href: '/student/jobs', label: 'Matched Jobs & Internships', icon: Briefcase },
    { href: '/student/resume', label: 'Resume AI Analyzer', icon: FileCheck2 },
    { href: '/student/portfolio', label: 'Digital Portfolio', icon: Award },
    { href: '/student/interview', label: 'AI Interview Simulator', icon: Video },
  ];

  const staffLinks = [
    { href: '/staff', label: 'Staff TPO Dashboard', icon: UserCheck },
  ];

  const industryLinks = [
    { href: '/industry', label: 'Company Overview', icon: Briefcase },
    { href: '/industry/candidates', label: 'AI Candidate Matcher', icon: UserCheck },
  ];

  const academicianLinks = [
    { href: '/academician', label: 'Faculty Dashboard', icon: BookOpen },
  ];

  const institutionLinks = [
    { href: '/institution', label: 'Placement Analytics', icon: Building2 },
  ];

  const activeLinks =
    role === 'student'
      ? studentLinks
      : role === 'staff'
      ? staffLinks
      : role === 'industry'
      ? industryLinks
      : role === 'academician'
      ? academicianLinks
      : institutionLinks;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">SkillBridge</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">Measure Skills. Identify Gaps. Build Careers.</p>
          </div>
        </Link>

        {/* Dynamic Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-900/60 p-1.5 rounded-xl border border-gray-800">
          {activeLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Demo Fast Account Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card text-xs font-medium text-gray-200 hover:border-blue-500/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline-block max-w-[140px] truncate">{user?.name || 'Demo Account'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-2xl border border-gray-800 p-2 hidden group-hover:block transition-all">
              <div className="px-3 py-2 border-b border-gray-800 mb-1">
                <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">SIH Demo Role Switcher</p>
              </div>
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                const isCurrent = user?.uid === acc.uid;
                return (
                  <button
                    key={acc.uid}
                    onClick={() => switchDemoUser(acc.uid)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      isCurrent ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold' : 'text-gray-300 hover:bg-gray-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span>{acc.label}</span>
                    </div>
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
