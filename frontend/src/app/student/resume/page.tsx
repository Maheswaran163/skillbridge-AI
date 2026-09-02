'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { ResumeAnalysisResult } from '@/types';
import { FileCheck2, UploadCloud, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, FileText } from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);

  const handleScanSample = async () => {
    setAnalyzing(true);
    try {
      const data = await fetchApi<ResumeAnalysisResult>('/ai/resume/analyze', {
        method: 'POST',
        body: JSON.stringify({ jobId: 'job_1' }),
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
          <FileCheck2 className="w-4 h-4 text-emerald-400" /> ATS Resume Scanner & Job Compatibility Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white">AI Resume Analyzer</h1>
        <p className="text-xs text-gray-400">Scan PDF/DOCX resumes for ATS formatting, skill extractions, and job compatibility.</p>
      </div>

      {/* Drag & Drop Card */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
          <UploadCloud className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Upload your Resume (PDF or DOCX)</h3>
          <p className="text-xs text-gray-400">Supports Node.js PDF & DOCX text parsing • Max size 10MB</p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleScanSample}
            disabled={analyzing}
            className="px-6 py-3 rounded-2xl gradient-bg-primary text-white text-xs font-semibold shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform flex items-center gap-2"
          >
            {analyzing ? (
              <span>Extracting Text & Analyzing...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run Demo AI Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-8 animate-in fade-in">
          {/* Header Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 space-y-2">
              <p className="text-xs text-gray-400">ATS Readability Score</p>
              <p className="text-4xl font-black text-emerald-400">{result.score}/100</p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${result.score}%` }} />
              </div>
            </div>

            {result.jobCompatibility && (
              <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 space-y-2">
                <p className="text-xs text-gray-400">Target Job Compatibility ({result.jobCompatibility.jobTitle})</p>
                <p className="text-4xl font-black text-blue-400">{result.jobCompatibility.compatibilityPercentage}%</p>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="gradient-bg-primary h-full rounded-full" style={{ width: `${result.jobCompatibility.compatibilityPercentage}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Extracted Skills Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Extracted Skills ({result.extractedSkills.length}):</h4>
            <div className="flex flex-wrap gap-2">
              {result.extractedSkills.map((sk) => (
                <span key={sk} className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                  ✓ {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Recommendations & ATS Fixes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl space-y-2">
              <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Strengths Identified:
              </h5>
              <ul className="space-y-1 text-gray-300 list-disc list-inside">
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl space-y-2">
              <h5 className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> ATS Recommendations:
              </h5>
              <ul className="space-y-1 text-gray-300 list-disc list-inside">
                {result.atsRecommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
