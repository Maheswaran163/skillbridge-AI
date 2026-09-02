'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { SkillAssessmentQuestion, SkillAssessmentResult } from '@/types';
import { Brain, CheckCircle2, AlertCircle, Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function StudentAssessmentPage() {
  const [questions, setQuestions] = useState<SkillAssessmentQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SkillAssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApi<SkillAssessmentQuestion[]>('/assessments/questions')
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetchApi<SkillAssessmentResult>('/assessments/submit', {
        method: 'POST',
        body: JSON.stringify({
          skillId: 'sk_js',
          answers: selectedAnswers,
        }),
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading Proctored Skill Assessment Questions...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
          <Brain className="w-4 h-4" /> Proctored AI Assessment Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white">Technical & Soft Skill Assessment</h1>
        <p className="text-xs text-gray-400">Test your mastery to earn Verified Skill Badges on your profile.</p>
      </div>

      {!result ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-800 pb-4">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span className="text-blue-400 font-semibold">{questions[currentIdx]?.skillName} ({questions[currentIdx]?.difficulty})</span>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {questions[currentIdx]?.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {questions[currentIdx]?.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[questions[currentIdx].id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(questions[currentIdx].id, optIdx)}
                    className={`w-full text-left p-4 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                        : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-blue-400 bg-blue-500' : 'border-gray-700'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-gray-300 disabled:opacity-40"
            >
              Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl gradient-bg-primary text-xs font-semibold text-white hover:scale-105 transition-transform"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl gradient-bg-emerald text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center gap-2"
              >
                {submitting ? 'Evaluating...' : 'Submit Assessment'}
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Assessment Complete!</h2>
            <p className="text-xs text-gray-400">Skill: {result.skillName} • Verified Level: <span className="text-emerald-400 uppercase font-bold">{result.skillLevel}</span></p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/80 border border-gray-800 max-w-sm mx-auto space-y-2">
            <p className="text-xs text-gray-400">Deterministic Score</p>
            <p className="text-4xl font-extrabold text-white">{result.score}%</p>
            <p className="text-xs text-emerald-400 font-semibold">{result.correctAnswers} / {result.totalQuestions} Correct Answers</p>
          </div>

          <div className="text-left space-y-3 bg-gray-900/40 p-4 rounded-xl border border-gray-800 text-xs">
            <h4 className="font-bold text-gray-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Feedback & Recommendations:
            </h4>
            <ul className="space-y-1 text-gray-300 list-disc list-inside">
              {result.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
              {result.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setCurrentIdx(0);
            }}
            className="px-6 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-200 hover:border-blue-500/40"
          >
            Retake Assessment
          </button>
        </div>
      )}
    </div>
  );
}
