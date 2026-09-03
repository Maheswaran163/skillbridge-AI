'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { AcademicianProfile } from '@/types';
import { BookOpen, Users, Award, FileText, Video, GraduationCap, Sparkles } from 'lucide-react';

export default function AcademicianDashboardPage() {
  const [profile, setProfile] = useState<AcademicianProfile | null>(null);

  useEffect(() => {
    fetchApi<{ user: AcademicianProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ demoUid: 'acad_raman' }),
    }).then((res) => setProfile(res.user as AcademicianProfile));
  }, []);

  const programs = [
    {
      icon: Award,
      title: 'Faculty Development Program (FDP)',
      desc: 'Join industry-sponsored training programs in GenAI, RAG, and Cloud Microservices.',
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
      badgeLabel: '3 Upcoming',
    },
    {
      icon: FileText,
      title: 'Industry Consultancy',
      desc: 'Offer specialized technical consulting to enterprise corporate partners.',
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-100',
      badge: 'bg-purple-100 text-purple-700 border-purple-200',
      badgeLabel: '2 Active Projects',
    },
    {
      icon: Users,
      title: 'Guest Lecture Bookings',
      desc: 'Host expert industry sessions for final year undergraduate students.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      badgeLabel: 'Next: Oct 14',
    },
    {
      icon: Video,
      title: 'Joint Research & Publications',
      desc: 'Co-author papers with industry researchers and access proprietary datasets.',
      color: 'text-orange-600',
      bg: 'bg-orange-50 border-orange-100',
      badge: 'bg-orange-100 text-orange-700 border-orange-200',
      badgeLabel: '1 In Review',
    },
    {
      icon: GraduationCap,
      title: 'Curriculum Advisory',
      desc: 'Advise on course designs aligned with cutting-edge industry technology stacks.',
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-100',
      badge: 'bg-teal-100 text-teal-700 border-teal-200',
      badgeLabel: 'CSE 2025-26',
    },
    {
      icon: Sparkles,
      title: 'AI-Augmented Teaching Grants',
      desc: 'Apply for grants to incorporate Gemini AI and RAG tools in undergraduate coursework.',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      badgeLabel: 'Apply by Nov 30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                ✓ Verified Academician
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{profile?.name || 'Dr. K. S. Raman'}</h1>
            <p className="text-xs text-slate-500">
              {profile?.designation || 'Professor'} • {profile?.department || 'Dept. of CSE'} ({profile?.institutionName || 'IIT Bombay'})
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Publications', value: '24', color: 'text-blue-600' },
          { label: 'Projects Guided', value: '11', color: 'text-emerald-600' },
          { label: 'FDP Sessions', value: '7', color: 'text-orange-600' },
          { label: 'Students Mentored', value: '340', color: 'text-purple-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center space-y-1 hover:border-orange-200 transition-all">
            <p className={`text-3xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Collaboration Programs */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          Industry-Academia Collaboration Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map(({ icon: Icon, title, desc, color, bg, badge, badgeLabel }) => (
            <div key={title} className={`bg-white p-6 rounded-2xl border ${bg} space-y-3 shadow-sm hover:shadow-md transition-all group`}>
              <div className="flex items-center justify-between">
                <Icon className={`w-7 h-7 ${color}`} />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge}`}>{badgeLabel}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              <button className={`text-xs font-bold ${color} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                Explore &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
