'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { AcademicianProfile } from '@/types';
import { BookOpen, Users, Sparkles, Award, FileText, CheckCircle2 } from 'lucide-react';

export default function AcademicianDashboardPage() {
  const [profile, setProfile] = useState<AcademicianProfile | null>(null);

  useEffect(() => {
    fetchApi<{ user: AcademicianProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ demoUid: 'acad_raman' }),
    }).then((res) => setProfile(res.user as AcademicianProfile));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-extrabold text-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{profile?.name || 'Dr. K. S. Raman'}</h1>
            <p className="text-xs text-gray-400">{profile?.designation} • {profile?.department} ({profile?.institutionName})</p>
          </div>
        </div>
      </div>

      {/* Collaboration Programs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-3">
          <Award className="w-6 h-6 text-blue-400" />
          <h3 className="text-base font-bold text-white">Faculty Development (FDP)</h3>
          <p className="text-xs text-gray-400">Join industry-sponsored training programs in GenAI, RAG, and Cloud Microservices.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-3">
          <FileText className="w-6 h-6 text-purple-400" />
          <h3 className="text-base font-bold text-white">Industry Consultancy</h3>
          <p className="text-xs text-gray-400">Offer specialized technical consulting to enterprise corporate partners.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-3">
          <Users className="w-6 h-6 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Guest Lecture Bookings</h3>
          <p className="text-xs text-gray-400">Host expert industry sessions for final year undergraduate students.</p>
        </div>
      </div>
    </div>
  );
}
