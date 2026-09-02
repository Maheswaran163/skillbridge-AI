'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { SkillGapAnalysisResult } from '@/types';
import {
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  CheckSquare,
  Square,
} from 'lucide-react';

export default function SkillGapRoadmapPage() {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [analysis, setAnalysis] = useState<SkillGapAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    task_1: true,
  });

  const roles = ['Full Stack Developer', 'AI/ML Engineer', 'Cloud Engineer'];

  useEffect(() => {
    setLoading(true);
    fetchApi<SkillGapAnalysisResult>(`/ai/skill-gap?targetRole=${encodeURIComponent(targetRole)}`)
      .then((data) => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [targetRole]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  if (loading || !analysis) {
    return <div className="p-8 text-center text-gray-400">Computing AI Skill Gap & Personalizing Learning Roadmap...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header & Target Role Selector */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-300" /> Core AI Engine Feature
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Skill Gap Analysis & Roadmap</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Real-time benchmarking against top tier industry job requirements.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <label className="text-[11px] font-semibold text-gray-400 block mb-1">Target Career Goal</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full bg-gray-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Match Score & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-2 md:col-span-1 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Target Role Match Compatibility</p>
            <p className="text-4xl font-black text-white">{analysis.overallMatchPercentage}%</p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
            <div className="gradient-bg-primary h-full rounded-full" style={{ width: `${analysis.overallMatchPercentage}%` }} />
          </div>
          <p className="text-xs text-gray-400 pt-2">
            Target: <span className="text-blue-400 font-bold">{analysis.targetRole}</span>
          </p>
        </div>

        {/* Strong / Weak / Critical Breakdown Cards */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" /> Skill Competency Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Matching */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl space-y-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Strong / Adequate ({analysis.matchingSkills.length})
              </span>
              <div className="space-y-1">
                {analysis.matchingSkills.map((m) => (
                  <div key={m.skillName} className="flex justify-between text-[11px] text-gray-200">
                    <span>✓ {m.skillName}</span>
                    <span className="font-semibold">{m.studentProficiency}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl space-y-2">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Needs Improvement ({analysis.weakSkills.length})
              </span>
              <div className="space-y-1">
                {analysis.weakSkills.map((w) => (
                  <div key={w.skillName} className="flex justify-between text-[11px] text-gray-200">
                    <span>⚠ {w.skillName}</span>
                    <span className="font-semibold">{w.studentProficiency}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Missing */}
            <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl space-y-2">
              <span className="font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Critical Missing ({analysis.missingSkills.length})
              </span>
              <div className="space-y-1">
                {analysis.missingSkills.map((ms) => (
                  <div key={ms.skillName} className="flex justify-between text-[11px] text-gray-200">
                    <span>❌ {ms.skillName}</span>
                    <span className="font-semibold text-rose-400">0%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Learning Roadmap Phases */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-purple-400" /> Personalized AI Learning Roadmap
          </h3>
          <span className="text-xs text-gray-400">8-Week Accelerated Target</span>
        </div>

        <div className="space-y-4">
          {analysis.personalizedRoadmap.map((phase) => (
            <div key={phase.phase} className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl gradient-bg-primary text-white text-xs font-bold flex items-center justify-center">
                    P{phase.phase}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white">{phase.focusArea}</h4>
                    <p className="text-xs text-blue-400 font-medium">{phase.durationWeeks}</p>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2.5">
                {phase.tasks.map((task) => {
                  const isDone = completedTasks[task.id];
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-gray-300'
                          : 'bg-gray-900/60 border-gray-800 text-gray-200 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-500 shrink-0" />
                        )}
                        <span className={isDone ? 'line-through text-gray-400' : ''}>{task.title}</span>
                      </div>

                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                        {task.resourceType}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
