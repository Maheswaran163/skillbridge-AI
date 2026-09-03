'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/apiClient';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Briefcase,
  Award,
  Building2,
  Bell,
  BarChart3,
  Search,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';
import { JobOpportunity, StudentProfile, StaffAnnouncement, PlacementRecord, InstitutionAnalytics } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function StaffDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'moderation' | 'verification' | 'placements' | 'announcements' | 'analytics'>('moderation');
  
  // Data States
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [announcements, setAnnouncements] = useState<StaffAnnouncement[]>([]);
  const [analytics, setAnalytics] = useState<InstitutionAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form States
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', targetAudience: 'all' });
  const [newPlacement, setNewPlacement] = useState({ studentName: '', companyName: '', roleTitle: '', packageLpa: 12, offerType: 'full_time', status: 'accepted' });
  const [showPlacementModal, setShowPlacementModal] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, placementsData, annData, analyticsData, studentProfile] = await Promise.all([
        fetchApi<JobOpportunity[]>('/staff/moderation/jobs'),
        fetchApi<PlacementRecord[]>('/staff/placements'),
        fetchApi<StaffAnnouncement[]>('/staff/announcements'),
        fetchApi<InstitutionAnalytics>('/analytics/institution'),
        fetchApi<StudentProfile>('/students/profile'),
      ]);

      setJobs(jobsData || []);
      setPlacements(placementsData || []);
      setAnnouncements(annData || []);
      setAnalytics(analyticsData || null);
      if (studentProfile) setStudents([studentProfile]);
    } catch (err) {
      console.error('Failed to load staff data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveJob = async (id: string) => {
    try {
      await fetchApi(`/staff/moderation/jobs/${id}/approve`, { method: 'POST' });
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'approved' } : j)));
      showToast('Posting approved and published to student feed!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectJob = async (id: string) => {
    try {
      await fetchApi(`/staff/moderation/jobs/${id}/reject`, { method: 'POST' });
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'rejected' } : j)));
      showToast('Posting rejected.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyStudent = async (studentId: string, projectIds: string[], certIds: string[]) => {
    try {
      await fetchApi('/staff/verify-student', {
        method: 'POST',
        body: JSON.stringify({ studentId, projectIds, certIds }),
      });
      showToast('Student credentials verified and badges issued!');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    try {
      const created = await fetchApi<StaffAnnouncement>('/staff/announcements', {
        method: 'POST',
        body: JSON.stringify(newAnnouncement),
      });
      setAnnouncements((prev) => [created, ...prev]);
      setNewAnnouncement({ title: '', content: '', targetAudience: 'all' });
      showToast('Announcement broadcasted to students!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await fetchApi<PlacementRecord>('/staff/placements', {
        method: 'POST',
        body: JSON.stringify(newPlacement),
      });
      setPlacements((prev) => [created, ...prev]);
      setShowPlacementModal(false);
      showToast('Placement record logged successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  const pendingJobs = jobs.filter((j) => j.status === 'pending');
  const approvedJobs = jobs.filter((j) => !j.status || j.status === 'approved');

  return (
    <div className="space-y-8">
      {/* Top Staff Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Staff Training & Placement Officer Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="gradient-text">{user?.name || 'Priya Nair'}</span>
          </h1>
          <p className="text-xs text-gray-400">
            {user?.institutionName || 'IIT Bombay'} Training & Placement Cell • Verification Privilege Active
          </p>
        </div>

        {actionSuccessMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> {actionSuccessMessage}
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="bg-gray-900/80 px-4 py-2.5 rounded-2xl border border-gray-800 text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400">Pending Postings</p>
            <p className="text-lg font-extrabold text-amber-400">{pendingJobs.length}</p>
          </div>
          <div className="bg-gray-900/80 px-4 py-2.5 rounded-2xl border border-gray-800 text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400">Total Placed</p>
            <p className="text-lg font-extrabold text-emerald-400">{placements.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'moderation' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-400 hover:bg-gray-800/60'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job & Internship Moderation</span>
          {pendingJobs.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-gray-950 font-bold text-[10px]">
              {pendingJobs.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'verification' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-400 hover:bg-gray-800/60'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Student Profile & Badge Verification</span>
        </button>

        <button
          onClick={() => setActiveTab('placements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'placements' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-400 hover:bg-gray-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Placement & Offer Tracker</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'announcements' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-400 hover:bg-gray-800/60'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Announcements Broadcast</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-400 hover:bg-gray-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Skill Gap Analytics</span>
        </button>
      </div>

      {/* TAB 1: MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Pending Industry Opportunities for Review
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {jobs
              .filter((j) => j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((job) => (
                <div key={job.id} className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{job.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          job.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : job.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {job.status || 'Approved'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-gray-500" /> {job.companyName} • {job.location} • <span className="text-indigo-400 font-semibold">{job.salaryOrStipend}</span>
                    </p>

                    <p className="text-xs text-gray-300 max-w-3xl line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {job.requiredSkills.map((sk) => (
                        <span key={sk} className="px-2 py-0.5 rounded-md bg-gray-900 text-gray-300 border border-gray-800 text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {job.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveJob(job.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectJob(job.id)}
                          className="px-3 py-2 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}
                    {job.status === 'approved' && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Active for Students
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" /> Student Credential & Project Verification
            </h2>
            <p className="text-xs text-gray-400">Review student self-declared work and grant official Institution Verified badges.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {students.map((student) => (
              <div key={student.uid} className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 font-extrabold flex items-center justify-center text-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{student.name}</h3>
                      <p className="text-xs text-gray-400">{student.department} • Graduation Year: {student.graduationYear}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <p className="text-gray-400 text-[10px]">Readiness Score</p>
                      <p className="font-extrabold text-emerald-400 text-sm">{student.readinessScore}%</p>
                    </div>
                    <button
                      onClick={() => handleVerifyStudent(student.uid, student.projects.map(p => p.id), student.certifications.map(c => c.id))}
                      className="px-4 py-2 rounded-xl gradient-bg-primary text-white font-semibold text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <ShieldCheck className="w-4 h-4" /> Issue Institution Verification Badge
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Projects */}
                  <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 space-y-3">
                    <h4 className="text-xs font-bold text-gray-200 flex items-center justify-between">
                      <span>Submitted Projects</span>
                      <span className="text-gray-400 text-[10px]">{student.projects.length} Total</span>
                    </h4>
                    <div className="space-y-2">
                      {student.projects.map((proj) => (
                        <div key={proj.id} className="bg-gray-950/70 p-3 rounded-xl border border-gray-800 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-white">{proj.title}</p>
                            <p className="text-[11px] text-gray-400">{proj.techStack.join(', ')}</p>
                          </div>
                          {proj.verified ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Verified
                            </span>
                          ) : (
                            <button
                              onClick={() => handleVerifyStudent(student.uid, [proj.id], [])}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 text-[10px] font-bold hover:bg-indigo-600/50"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 space-y-3">
                    <h4 className="text-xs font-bold text-gray-200 flex items-center justify-between">
                      <span>Uploaded Certifications</span>
                      <span className="text-gray-400 text-[10px]">{student.certifications.length} Total</span>
                    </h4>
                    <div className="space-y-2">
                      {student.certifications.map((cert) => (
                        <div key={cert.id} className="bg-gray-950/70 p-3 rounded-xl border border-gray-800 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-white">{cert.title}</p>
                            <p className="text-[11px] text-gray-400">{cert.issuingOrganization}</p>
                          </div>
                          {cert.verified ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Verified
                            </span>
                          ) : (
                            <button
                              onClick={() => handleVerifyStudent(student.uid, [], [cert.id])}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 text-[10px] font-bold hover:bg-indigo-600/50"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PLACEMENTS */}
      {activeTab === 'placements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Campus Placement Records & Offers
            </h2>
            <button
              onClick={() => setShowPlacementModal(true)}
              className="px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-semibold flex items-center gap-1.5 hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" /> Log New Offer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
              <p className="text-xs text-gray-400">Average Salary Offer</p>
              <p className="text-2xl font-extrabold text-emerald-400">18.75 LPA</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
              <p className="text-xs text-gray-400">Highest Package</p>
              <p className="text-2xl font-extrabold text-purple-400">24.0 LPA</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-1">
              <p className="text-xs text-gray-400">Offers Accepted</p>
              <p className="text-2xl font-extrabold text-blue-400">{placements.filter(p => p.status === 'accepted').length}</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-900/80 text-gray-400 uppercase font-semibold text-[10px] border-b border-gray-800">
                <tr>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Company</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Package</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {placements.map((plc) => (
                  <tr key={plc.id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="p-3.5 font-bold text-white">{plc.studentName}</td>
                    <td className="p-3.5 text-indigo-400 font-semibold">{plc.companyName}</td>
                    <td className="p-3.5">{plc.roleTitle}</td>
                    <td className="p-3.5 font-extrabold text-emerald-400">₹{plc.packageLpa} LPA</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {plc.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-400">{plc.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-400" /> Broadcast Announcement
            </h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Day 1 Placement Guidelines"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-400 block mb-1">Message Content</label>
                <textarea
                  rows={4}
                  placeholder="Type official notification message to students..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-400 block mb-1">Target Audience</label>
                <select
                  value={newAnnouncement.targetAudience}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Students</option>
                  <option value="final_year">Final Year Placement Batch</option>
                  <option value="students">Pre-Final Internship Batch</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" /> Broadcast Notification
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" /> Active Student Broadcasts
            </h3>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{ann.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {ann.targetAudience}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{ann.content}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>By {ann.authorName}</span>
                    <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" /> Institution Top Student Skill Gaps (%)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topSkillGaps}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="skillName" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                    <Bar dataKey="gapPercentage" fill="#818cf8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Industry Demand Score vs Student Supply
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.industryDemandTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="skillName" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                    <Bar dataKey="demandScore" fill="#34d399" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
