'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { CandidateMatchResult } from '@/types';
import { UserCheck, Sparkles, ShieldCheck, ArrowRight, Filter } from 'lucide-react';

export default function CandidateMatcherPage() {
  const [candidates, setCandidates] = useState<CandidateMatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<CandidateMatchResult[]>('/industries/candidates')
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Executing Deterministic Weighted Candidate Ranking Algorithm...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-300" /> Deterministic Weighted Matching Formula Active
          </div>
          <h1 className="text-2xl font-extrabold text-white">AI Candidate Matching & Ranking Engine</h1>
          <p className="text-xs text-gray-400">
            Formula: Skill Match (50%) + Assessment (15%) + Projects (10%) + Certs (5%) + Experience (5%) + Goal Fit (10%) + Soft Skills (5%)
          </p>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Dept / Year</th>
                <th className="py-3 px-4">Readiness</th>
                <th className="py-3 px-4">Weighted Match Score</th>
                <th className="py-3 px-4">Matched Skills</th>
                <th className="py-3 px-4">AI Natural Match Explanation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {candidates.map((cand) => (
                <tr key={cand.studentId} className="hover:bg-gray-900/40">
                  <td className="py-4 px-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center">
                        {cand.studentName.charAt(0)}
                      </div>
                      <div>
                        <span>{cand.studentName}</span>
                        <p className="text-[10px] text-gray-500">{cand.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{cand.department} ({cand.graduationYear})</td>
                  <td className="py-4 px-4 font-extrabold text-emerald-400">{cand.readinessScore}%</td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                      {cand.weightedMatchScore}% Match
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cand.matchedSkills.map((sk) => (
                        <span key={sk} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-900 text-emerald-400 border border-emerald-500/30">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-sm text-[11px] text-gray-400 leading-relaxed">
                    {cand.aiExplanation}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="px-3.5 py-1.5 rounded-lg gradient-bg-primary text-white font-bold hover:scale-105 transition-transform">
                      Shortlist Candidate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
