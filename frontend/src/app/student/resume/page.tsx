'use client';

import React, { useState, useRef } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { ResumeAnalysisResult } from '@/types';
import { FileCheck2, UploadCloud, Sparkles, CheckCircle2, AlertTriangle, FileText, Check, Briefcase, RefreshCw } from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState('job_1');
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleResume = `Aarav Sharma - Full Stack Developer
Email: aarav.sharma@iitb.ac.in | Phone: +91 98765 43210 | GitHub: github.com/aaravsharma-dev
Education: B.Tech Computer Science & Engineering, IIT Bombay (Graduation: 2026)
Technical Skills: JavaScript, React, Next.js, Node.js, Express.js, TypeScript, SQL, Docker, Git.
Projects:
- SkillBridge AI: Built Next.js & Node.js AI-driven skill gap platform with Pinecone RAG.
- EduSphere: Realtime quiz system with Socket.io & Redis.
Experience: Full Stack Engineering Intern at TechCorp India (3 Months).`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setResumeText(text);
      }
    };

    // If text or json or md file
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // For binary files like PDF/DOCX, attempt text reading or generate a summary preview
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async (textToScan?: string) => {
    const activeText = textToScan || resumeText || sampleResume;
    setAnalyzing(true);
    try {
      const data = await fetchApi<ResumeAnalysisResult>('/ai/resume/analyze', {
        method: 'POST',
        body: JSON.stringify({
          jobId: selectedJobId,
          resumeText: activeText,
        }),
      });
      setResult(data);
    } catch (err) {
      console.error('Resume Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const loadSample = () => {
    setResumeText(sampleResume);
    setFileName('Sample_Aarav_Sharma_Resume.txt');
    handleAnalyze(sampleResume);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
          <FileCheck2 className="w-4 h-4 text-emerald-400" /> ATS Resume Scanner & Job Compatibility Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white">AI Resume Analyzer</h1>
        <p className="text-xs text-gray-400">
          Upload your actual resume (PDF, TXT, DOCX) or paste your text to get instant ATS scores, skill extractions, and job compatibility feedback.
        </p>
      </div>

      {/* Target Job Selector & Upload Form */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
        {/* Target Job Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-400" /> Select Target Job Role for ATS Match Scoring:
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="job_1">Full Stack Developer — TechCorp India (React, Node, TypeScript, Docker)</option>
            <option value="job_2">Data Scientist / AI Engineer — DataMind (Python, PyTorch, SQL, RAG)</option>
            <option value="job_3">Cloud Infrastructure Intern — CloudScale Solutions (AWS, Kubernetes, Terraform)</option>
          </select>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/50 transition-colors p-8 rounded-2xl text-center space-y-4 bg-gray-900/40">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.doc,.txt,.md"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              {fileName ? `File Selected: ${fileName}` : 'Click to Upload your Resume File'}
            </h3>
            <p className="text-xs text-gray-400">Supports PDF, DOCX, TXT, MD files • Max size 10MB</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold border border-gray-700 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-400" /> Browse File
            </button>

            <button
              onClick={loadSample}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold border border-gray-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" /> Load Sample Resume
            </button>
          </div>
        </div>

        {/* Or Paste Resume Text directly */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-300">Or Paste Resume Content / Bio Text:</label>
            {resumeText && (
              <span className="text-[10px] text-emerald-400 font-semibold">
                ✓ {resumeText.length} characters loaded
              </span>
            )}
          </div>
          <textarea
            rows={5}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here (Education, Technical Skills, Projects, Internships, Experience)..."
            className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 leading-relaxed font-mono"
          />
        </div>

        {/* Run Scan Button */}
        <button
          onClick={() => handleAnalyze()}
          disabled={analyzing}
          className="w-full py-3.5 rounded-2xl gradient-bg-primary text-white text-xs font-extrabold shadow-xl shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <span>Analyzing Resume with AI Engine...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Scan My Resume Now</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-8 animate-in fade-in">
          {/* Header Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 space-y-2">
              <p className="text-xs text-gray-400 font-semibold">ATS Readability Score</p>
              <p className="text-4xl font-black text-emerald-400">{result.score}/100</p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${result.score}%` }} />
              </div>
            </div>

            {result.jobCompatibility && (
              <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 space-y-2">
                <p className="text-xs text-gray-400 font-semibold">Target Job Fit: {result.jobCompatibility.jobTitle}</p>
                <p className="text-4xl font-black text-blue-400">{result.jobCompatibility.compatibilityPercentage}%</p>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="gradient-bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${result.jobCompatibility.compatibilityPercentage}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Extracted Skills */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Extracted Skills ({result.extractedSkills.length}):</h4>
            <div className="flex flex-wrap gap-2">
              {result.extractedSkills.length > 0 ? (
                result.extractedSkills.map((sk) => (
                  <span key={sk} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" /> {sk}
                  </span>
                ))
              ) : (
                <span className="text-xs text-amber-400">No explicit technical skills detected in the provided text. Try adding a dedicated skills list.</span>
              )}
            </div>
          </div>

          {/* Job Compatibility Matching Skills */}
          {result.jobCompatibility && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl space-y-2">
                <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Matching Job Skills:
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {result.jobCompatibility.matchingSkills.map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl space-y-2">
                <h5 className="font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Missing Required Skills:
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {result.jobCompatibility.missingSkills.map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[11px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Strengths & ATS Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl space-y-2">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strengths Identified:
              </h5>
              <ul className="space-y-1.5 text-gray-300 list-disc list-inside">
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900/90 border border-gray-800 p-5 rounded-2xl space-y-2">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Actionable ATS Improvements:
              </h5>
              <ul className="space-y-1.5 text-gray-300 list-disc list-inside">
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
