'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { InstitutionAnalytics } from '@/types';
import { Building2, Users, Award, TrendingUp, Sparkles, AlertCircle, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

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

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-orange-500 text-sm">
          <div className="w-5 h-5 border-2 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
          <span className="text-slate-600">Loading placement analytics...</span>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: 'Total Students', value: analytics.totalStudents, color: 'text-slate-900', icon: Users },
    { label: 'Placement Ready', value: analytics.placementReadyStudents, color: 'text-emerald-600', icon: Award },
    { label: 'Internships', value: analytics.internshipCount, color: 'text-blue-600', icon: BarChart3 },
    { label: 'Placed', value: analytics.placementCount, color: 'text-orange-600', icon: Building2 },
    { label: 'Avg Skill Score', value: `${analytics.averageSkillScore}%`, color: 'text-amber-600', icon: TrendingUp },
    { label: 'Employability', value: `${analytics.averageEmployabilityScore}%`, color: 'text-purple-600', icon: Sparkles },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-7 h-7 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                Institution Admin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {analytics.institutionName} — Placement &amp; Skill Analytics
            </h1>
            <p className="text-xs text-slate-500">Real-time institutional oversight on student employability &amp; skill gaps.</p>
          </div>
        </div>
      </div>

      {/* 6-Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-200 transition-all text-center space-y-1">
            <Icon className={`w-5 h-5 mx-auto ${color}`} />
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill Gaps Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            Institutional Skill Gap Analysis (%)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.topSkillGaps}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="skillName" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  labelStyle={{ color: '#0f172a', fontWeight: 700 }}
                />
                <Bar dataKey="gapPercentage" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Demand Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Industry Skill Demand Trends
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.industryDemandTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="skillName" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  labelStyle={{ color: '#0f172a', fontWeight: 700 }}
                />
                <Bar dataKey="demandScore" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Curriculum Recommendations */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          AI Institutional Curriculum Action Plan
        </h3>
        <div className="space-y-2.5">
          {analytics.aiCurriculumRecommendations.map((rec, idx) => (
            <div key={idx} className="bg-orange-50 border border-orange-100 p-3.5 rounded-xl flex items-start gap-3 text-xs text-slate-700">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
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
