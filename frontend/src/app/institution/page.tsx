'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { InstitutionAnalytics } from '@/types';
import { Building2, Users, Award, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function InstitutionAdminPage() {
  const [analytics, setAnalytics] = useState<InstitutionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<InstitutionAnalytics>('/analytics/institution')
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !analytics) return <div className="p-8 text-center text-gray-400">Loading Institution Placement Analytics & Recharts...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-2">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-2xl font-extrabold text-white">{analytics.institutionName} Placement & Skill Analytics</h1>
            <p className="text-xs text-gray-400">Real-time institutional oversight on student employability & skill gaps.</p>
          </div>
        </div>
      </div>

      {/* 6 Key Institution Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
        <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-gray-400">Total Students</span>
          <p className="text-2xl font-black text-white">{analytics.totalStudents}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-gray-400">Placement Ready</span>
          <p className="text-2xl font-black text-emerald-400">{analytics.placementReadyStudents}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-gray-400">Internship Count</span>
          <p className="text-2xl font-black text-blue-400">{analytics.internshipCount}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-gray-400">Placements</span>
          <p className="text-2xl font-black text-purple-400">{analytics.placementCount}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-gray-400">Avg Skill Score</span>
          <p className="text-2xl font-black text-amber-400">{analytics.averageSkillScore}%</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-gray-800 space-y-1">
          <span className="text-gray-400">Employability</span>
          <p className="text-2xl font-black text-emerald-400">{analytics.averageEmployabilityScore}%</p>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Skill Gaps Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" /> Institutional Skill Gap Analysis (%)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.topSkillGaps}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="skillName" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} />
                <Bar dataKey="gapPercentage" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Skill Demand Trends */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Industry Skill Demand Trends
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.industryDemandTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="skillName" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} />
                <Bar dataKey="demandScore" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Curriculum Recommendations */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> AI Institutional Curriculum Action Plan
        </h3>

        <div className="space-y-2 text-xs text-gray-300">
          {analytics.aiCurriculumRecommendations.map((rec, idx) => (
            <div key={idx} className="bg-gray-900/60 p-3 rounded-xl border border-gray-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
