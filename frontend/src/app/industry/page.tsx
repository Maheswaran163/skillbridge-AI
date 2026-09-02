'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/apiClient';
import { IndustryProfile, JobOpportunity, JobApplication } from '@/types';
import { Briefcase, Building2, Users, CheckCircle2, Plus, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export default function IndustryDashboardPage() {
  const [profile, setProfile] = useState<IndustryProfile | null>(null);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    Promise.all([
      fetchApi<IndustryProfile>('/industries/profile').catch(() => null),
      fetchApi<JobOpportunity[]>('/jobs').catch(() => []),
      fetchApi<JobApplication[]>('/applications').catch(() => []),
    ]).then(([pData, jData, aData]) => {
      if (pData) setProfile(pData);
      setJobs(jData);
      setApplications(aData);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Industry Header */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Verified Industry Partner
            </span>
            <span className="text-xs text-gray-400">• {profile?.headquarters}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{profile?.companyName || 'TechCorp India'}</h1>
          <p className="text-xs text-gray-400 max-w-xl">{profile?.description}</p>
        </div>

        <Link
          href="/industry/candidates"
          className="px-5 py-3 rounded-2xl gradient-bg-primary text-white font-semibold text-xs shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>AI Candidate Matcher</span>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-1">
          <p className="text-xs text-gray-400">Active Job Postings</p>
          <p className="text-3xl font-black text-white">{jobs.length}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-1">
          <p className="text-xs text-gray-400">Total Applicants</p>
          <p className="text-3xl font-black text-emerald-400">{applications.length}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-1">
          <p className="text-xs text-gray-400">Shortlisted Candidates</p>
          <p className="text-3xl font-black text-blue-400">1</p>
        </div>
      </div>

      {/* Applicant Applications Table */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" /> Recent Campus Applications
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Job Role</th>
                <th className="py-3 px-4">AI Match Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-900/40">
                  <td className="py-3 px-4 font-bold text-white">{app.studentName}</td>
                  <td className="py-3 px-4">{app.institutionName}</td>
                  <td className="py-3 px-4">{app.jobTitle}</td>
                  <td className="py-3 px-4 font-black text-emerald-400">{app.matchScore}% Match</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-semibold text-[10px]">
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-500">
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
