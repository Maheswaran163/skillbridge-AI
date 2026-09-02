'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { JobOpportunity, JobApplication } from '@/types';
import { Briefcase, Building2, MapPin, DollarSign, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [internships, setInternships] = useState<JobOpportunity[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [tab, setTab] = useState<'job' | 'internship'>('job');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchApi<JobOpportunity[]>('/jobs'),
      fetchApi<JobOpportunity[]>('/internships'),
      fetchApi<JobApplication[]>('/applications'),
    ]).then(([jList, iList, aList]) => {
      setJobs(jList);
      setInternships(iList);
      setApplications(aList);
    });
  }, []);

  const handleApply = async (jobId: string) => {
    setApplyingId(jobId);
    try {
      const app = await fetchApi<JobApplication>('/applications', {
        method: 'POST',
        body: JSON.stringify({ jobId }),
      });
      setApplications((prev) => [...prev, app]);
    } catch (err) {
      console.error(err);
    } finally {
      setApplyingId(null);
    }
  };

  const activeList = tab === 'job' ? jobs : internships;
  const appliedJobIds = new Set(applications.map((a) => a.jobId));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white">AI Matched Opportunities</h1>
          <p className="text-xs text-gray-400">Weighted skill match ranking based on your verified assessment profile.</p>
        </div>

        <div className="flex bg-gray-900/80 p-1 rounded-xl border border-gray-800 self-start">
          <button
            onClick={() => setTab('job')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              tab === 'job' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Full-Time Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setTab('internship')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              tab === 'internship' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Internships ({internships.length})
          </button>
        </div>
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeList.map((opportunity) => {
          const isApplied = appliedJobIds.has(opportunity.id);
          return (
            <div key={opportunity.id} className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{opportunity.title}</h3>
                    <p className="text-xs text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" /> {opportunity.companyName}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> 89% Match
                  </span>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{opportunity.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {opportunity.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {opportunity.salaryOrStipend}</span>
                </div>

                {/* Required Skills */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-gray-500">Required Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {opportunity.requiredSkills.map((sk) => (
                      <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                disabled={isApplied || applyingId === opportunity.id}
                onClick={() => handleApply(opportunity.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isApplied
                    ? 'bg-gray-800 text-emerald-400 border border-emerald-500/30'
                    : 'gradient-bg-primary text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02]'
                }`}
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Application Submitted
                  </>
                ) : applyingId === opportunity.id ? (
                  'Submitting...'
                ) : (
                  <>
                    Apply with 1-Click <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
