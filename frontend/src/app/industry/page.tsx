'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/apiClient';
import { IndustryProfile, JobOpportunity, JobApplication } from '@/types';
import { Briefcase, Building2, Users, UserCheck, ArrowRight } from 'lucide-react';

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

  const shortlisted = applications.filter((a) => a.status === 'shortlisted').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              ✓ Verified Industry Partner
            </span>
            <span className="text-xs text-slate-400">• {profile?.headquarters}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{profile?.companyName || 'TechCorp India'}</h1>
          <p className="text-xs text-slate-500 max-w-xl">{profile?.description}</p>
        </div>
        <Link
          href="/industry/candidates"
          className="px-5 py-3 rounded-2xl gradient-bg-primary text-white font-bold text-xs shadow-lg shadow-orange-500/25 hover:scale-105 transition-all flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>AI Candidate Matcher</span>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Active Job Postings', value: jobs.length, color: 'text-blue-600', icon: Briefcase },
          { label: 'Total Applicants', value: applications.length, color: 'text-emerald-600', icon: Users },
          { label: 'Shortlisted', value: shortlisted || 1, color: 'text-orange-600', icon: UserCheck },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-orange-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-4xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-500" />
          Recent Campus Applications
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Job Role</th>
                <th className="py-3 px-4">AI Match Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-orange-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{app.studentName}</td>
                  <td className="py-3 px-4 text-slate-500">{app.institutionName}</td>
                  <td className="py-3 px-4">{app.jobTitle}</td>
                  <td className="py-3 px-4">
                    <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{app.matchScore}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase font-semibold text-[10px]">
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors flex items-center gap-1 ml-auto">
                      Shortlist <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">No applications yet. Post a job to start receiving candidates.</div>
          )}
        </div>
      </div>
    </div>
  );
}
