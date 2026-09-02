'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { InterviewSession, InterviewQuestion } from '@/types';
import { Video, Sparkles, Send, CheckCircle2, Award, Bot, ArrowRight } from 'lucide-react';

export default function InterviewSimulatorPage() {
  const [jobRole, setJobRole] = useState('Full Stack Developer');
  const [interviewType, setInterviewType] = useState<'technical' | 'hr' | 'behavioral' | 'project'>('technical');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState<Record<string, InterviewQuestion['evaluation']>>({});

  const handleStartSession = async () => {
    try {
      const data = await fetchApi<InterviewSession>('/ai/interview/start', {
        method: 'POST',
        body: JSON.stringify({ jobRole, interviewType, experienceLevel: '0-2 Years' }),
      });
      setSession(data);
      setCurrentIdx(0);
      setEvaluations({});
    } catch (err) {
      console.error(err);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!session || !userAnswer.trim()) return;

    const currentQ = session.questions[currentIdx];
    setEvaluating(true);

    try {
      const result = await fetchApi<NonNullable<InterviewQuestion['evaluation']>>('/ai/interview/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          questionText: currentQ.questionText,
          userAnswer,
        }),
      });

      setEvaluations((prev) => ({ ...prev, [currentQ.questionId]: result }));
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
          <Video className="w-4 h-4 text-purple-400" /> AI Mock Interview Practice & Feedback Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white">AI Interview Simulator</h1>
        <p className="text-xs text-gray-400">Practice real technical, HR, and project interviews with instant Gemini evaluation.</p>
      </div>

      {!session ? (
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1">Target Job Role</label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full bg-gray-900 text-white font-bold text-xs p-3 rounded-xl border border-gray-700"
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1">Interview Type</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as any)}
                className="w-full bg-gray-900 text-white font-bold text-xs p-3 rounded-xl border border-gray-700"
              >
                <option value="technical">Technical Round</option>
                <option value="hr">HR & Culture Fit</option>
                <option value="behavioral">Behavioral (STAR Method)</option>
                <option value="project">Project Architecture Walkthrough</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartSession}
            className="w-full py-3.5 rounded-2xl gradient-bg-primary text-white font-bold text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Start Simulated Interview Session</span>
          </button>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
          {/* Question Counter */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 text-xs text-gray-400">
            <span>Question {currentIdx + 1} of {session.questions.length}</span>
            <span className="text-purple-400 font-semibold uppercase">{session.interviewType} Round</span>
          </div>

          {/* Question text */}
          <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
              <Bot className="w-4 h-4" /> AI Interviewer Question:
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">
              {session.questions[currentIdx]?.questionText}
            </p>
          </div>

          {/* User Answer Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 block">Your Spoken / Written Response:</label>
            <textarea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here or structure your points..."
              className="w-full bg-gray-900 text-gray-200 p-4 rounded-xl text-xs border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleEvaluateAnswer}
            disabled={evaluating || !userAnswer.trim()}
            className="w-full py-3 rounded-xl gradient-bg-emerald text-white text-xs font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-40"
          >
            {evaluating ? 'Gemini AI Evaluating Answer...' : 'Submit Answer for AI Scoring'}
          </button>

          {/* AI Evaluation Result Card */}
          {evaluations[session.questions[currentIdx]?.questionId] && (
            <div className="bg-gray-900/90 p-5 rounded-2xl border border-gray-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="text-xs font-bold text-gray-200">AI Evaluation Feedback</span>
                <span className="text-sm font-black text-emerald-400">
                  {evaluations[session.questions[currentIdx]?.questionId]?.score}/100
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-300">
                <p><strong>Technical Accuracy:</strong> {evaluations[session.questions[currentIdx]?.questionId]?.technicalAccuracy}</p>
                <p><strong>Communication:</strong> {evaluations[session.questions[currentIdx]?.questionId]?.communicationQuality}</p>
                <p className="text-blue-400"><strong>Improvement Tip:</strong> {evaluations[session.questions[currentIdx]?.questionId]?.suggestedBetterAnswer}</p>
              </div>

              {currentIdx < session.questions.length - 1 && (
                <button
                  onClick={() => {
                    setCurrentIdx((prev) => prev + 1);
                    setUserAnswer('');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl gradient-bg-primary text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
