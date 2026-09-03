import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { inMemoryStore } from '../firebase/admin';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/authMiddleware';
import { SkillGapEngine } from '../ai/skillGapEngine';
import { MatchingEngine } from '../ai/matchingEngine';
import { ResumeAnalyzer } from '../ai/resumeAnalyzer';
import { InterviewSimulator } from '../ai/interviewSimulator';
import { RAGService } from '../rag/ragService';
import { DEMO_SKILLS, DEMO_ASSESSMENT_QUESTIONS, DEMO_INSTITUTIONS } from '../seed/demoData';

const router = Router();

// ==========================================
// 1. AUTHENTICATION & DEMO LOGIN ROUTER
// ==========================================

router.post('/auth/register', (req, res) => {
  const { name, email, password, role, institutionName, department, careerGoal, companyName } = req.body;
  const uid = `usr_${Date.now()}`;
  const now = new Date().toISOString();

  let user: any;

  if (role === 'industry') {
    user = {
      uid,
      email: email || 'user@company.com',
      name: name || 'Registered Industry Partner',
      role: 'industry',
      companyName: companyName || name || 'Innovate Enterprise',
      industrySector: 'Software & Technology',
      website: 'https://company.example.com',
      companySize: '50-200 Employees',
      headquarters: 'Bengaluru, India',
      description: 'Registered Industry Partner on SkillBridge AI.',
      verified: true,
      institutionId: 'inst_iitb',
      createdAt: now,
      updatedAt: now,
    };
    inMemoryStore.industries.set(uid, user);
  } else if (role === 'academician') {
    user = {
      uid,
      email: email || 'faculty@iitb.ac.in',
      name: name || 'Dr. Faculty Member',
      role: 'academician',
      department: department || 'Computer Science & Engineering',
      designation: 'Associate Professor',
      expertise: ['Machine Learning', 'Data Structures', 'Cloud Systems'],
      researchAreas: ['AI Skill Mapping'],
      consultancyAvailable: true,
      institutionId: 'inst_iitb',
      institutionName: institutionName || 'IIT Bombay',
      createdAt: now,
      updatedAt: now,
    };
    inMemoryStore.academicians.set(uid, user);
  } else if (role === 'institution_admin') {
    user = {
      uid,
      email: email || 'admin@iitb.ac.in',
      name: name || 'Placement Director',
      role: 'institution_admin',
      institutionId: 'inst_iitb',
      institutionName: institutionName || 'IIT Bombay',
      code: 'INST',
      location: 'Mumbai, MH',
      website: 'https://iitb.ac.in',
      totalStudents: 12500,
      createdAt: now,
      updatedAt: now,
    };
    inMemoryStore.institutionAdmins.set(uid, user);
  } else {
    // Default Student Registration
    user = {
      uid,
      email: email || 'student@iitb.ac.in',
      name: name || 'New Student Candidate',
      role: 'student',
      department: department || 'Computer Science & Engineering',
      degree: 'B.Tech',
      graduationYear: 2026,
      careerGoal: careerGoal || 'Full Stack Developer',
      institutionId: 'inst_iitb',
      institutionName: institutionName || 'IIT Bombay',
      readinessScore: 88,
      employabilityScore: 90,
      technicalScore: 85,
      softSkillScore: 88,
      skills: DEMO_SKILLS.slice(0, 5).map((sk) => ({
        skillId: sk.id,
        skillName: sk.name,
        category: sk.category,
        proficiencyLevel: 'intermediate' as const,
        verificationLevel: 'assessment_verified' as const,
        score: 85,
      })),
      projects: [
        {
          id: `proj_${Date.now()}`,
          title: 'SkillBridge AI Capstone Platform',
          description: 'Next.js 15 & Node.js AI-driven skill mapping and candidate matching app.',
          role: 'Full Stack Lead',
          techStack: ['React', 'Next.js', 'Node.js', 'SQL'],
          verified: true,
        },
      ],
      certifications: [],
      internships: [],
      createdAt: now,
      updatedAt: now,
    };
    inMemoryStore.students.set(uid, user);
  }

  const token = jwt.sign(
    {
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
      institutionId: user.institutionId,
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user,
  });
});

router.post('/auth/login', (req, res) => {
  const { email, role, demoUid } = req.body;

  let user = demoUid ? inMemoryStore.getUserByUid(demoUid) : null;

  if (!user && email) {
    user = Array.from(inMemoryStore.students.values()).find((u) => u.email === email) ||
           Array.from(inMemoryStore.industries.values()).find((u) => u.email === email) ||
           Array.from(inMemoryStore.academicians.values()).find((u) => u.email === email) ||
           Array.from(inMemoryStore.institutionAdmins.values()).find((u) => u.email === email);
  }

  if (!user) {
    if (role === 'industry') {
      user = inMemoryStore.industries.get('ind_techcorp')!;
    } else if (role === 'academician') {
      user = inMemoryStore.academicians.get('acad_raman')!;
    } else if (role === 'institution_admin' || role === 'super_admin') {
      user = inMemoryStore.institutionAdmins.get('admin_deshmukh')!;
    } else {
      user = inMemoryStore.students.get('std_aarav')!;
    }
  }

  const token = jwt.sign(
    {
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
      institutionId: user.institutionId,
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user,
  });
});

router.get('/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = inMemoryStore.getUserByUid(req.user!.uid);
  res.json({ user: user || req.user });
});

// ==========================================
// 2. STUDENT PORTAL APIs
// ==========================================

router.get('/students/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const student = inMemoryStore.students.get(req.user!.uid) || inMemoryStore.students.get('std_aarav');
  res.json(student);
});

router.put('/students/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const existing = inMemoryStore.students.get(req.user!.uid) || inMemoryStore.students.get('std_aarav')!;
  const updated = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
  inMemoryStore.students.set(existing.uid, updated);
  res.json(updated);
});

// ==========================================
// 2B. STAFF PORTAL APIs
// ==========================================

router.get('/staff/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const staff = inMemoryStore.staff.get(req.user!.uid) || inMemoryStore.staff.get('staff_priya');
  res.json(staff);
});

router.get('/staff/moderation/jobs', authenticateToken, requireRole('staff', 'institution_admin', 'super_admin'), (req: AuthenticatedRequest, res: Response) => {
  const allJobs = Array.from(inMemoryStore.jobs.values());
  res.json(allJobs);
});

router.post('/staff/moderation/jobs/:id/approve', authenticateToken, requireRole('staff', 'institution_admin', 'super_admin'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const job = inMemoryStore.jobs.get(id);
  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }
  job.status = 'approved';
  inMemoryStore.jobs.set(id, job);
  res.json({ message: 'Job approved successfully', job });
});

router.post('/staff/moderation/jobs/:id/reject', authenticateToken, requireRole('staff', 'institution_admin', 'super_admin'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const job = inMemoryStore.jobs.get(id);
  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }
  job.status = 'rejected';
  inMemoryStore.jobs.set(id, job);
  res.json({ message: 'Job rejected', job });
});

router.post('/staff/verify-student', authenticateToken, requireRole('staff', 'institution_admin', 'super_admin'), (req: AuthenticatedRequest, res: Response) => {
  const { studentId, projectIds, certIds, newSkills } = req.body;
  const student = inMemoryStore.students.get(studentId || 'std_aarav');
  if (!student) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  if (projectIds && Array.isArray(projectIds)) {
    student.projects.forEach((p) => {
      if (projectIds.includes(p.id)) p.verified = true;
    });
  }

  if (certIds && Array.isArray(certIds)) {
    student.certifications.forEach((c) => {
      if (certIds.includes(c.id)) c.verified = true;
    });
  }

  if (newSkills && Array.isArray(newSkills)) {
    student.skills.forEach((s) => {
      if (newSkills.includes(s.skillId)) {
        s.verificationLevel = 'industry_verified';
        s.score = Math.max(s.score, 88);
      }
    });
  }

  student.readinessScore = Math.min(98, student.readinessScore + 5);
  student.employabilityScore = Math.min(98, student.employabilityScore + 4);
  inMemoryStore.students.set(student.uid, student);

  res.json({ message: 'Student profile verified', student });
});

router.get('/staff/placements', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json(Array.from(inMemoryStore.placements.values()));
});

router.post('/staff/placements', authenticateToken, requireRole('staff', 'institution_admin', 'super_admin'), (req: AuthenticatedRequest, res: Response) => {
  const record = {
    id: `plc_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    ...req.body,
  };
  inMemoryStore.placements.set(record.id, record);
  res.status(201).json(record);
});

router.get('/staff/announcements', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json(Array.from(inMemoryStore.announcements.values()));
});

router.post('/staff/announcements', authenticateToken, requireRole('staff', 'institution_admin', 'super_admin'), (req: AuthenticatedRequest, res: Response) => {
  const announcement = {
    id: `ann_${Date.now()}`,
    institutionId: req.user!.institutionId || 'inst_iitb',
    authorName: req.user!.name || 'Placement Cell Officer',
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  inMemoryStore.announcements.set(announcement.id, announcement);
  res.status(201).json(announcement);
});

// ==========================================
// 3. INDUSTRY PORTAL APIs
// ==========================================

router.get('/industries/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const industry = inMemoryStore.industries.get(req.user!.uid) || inMemoryStore.industries.get('ind_techcorp');
  res.json(industry);
});

router.get('/industries/candidates', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const students = Array.from(inMemoryStore.students.values());
  const jobId = (req.query.jobId as string) || 'job_1';
  const job = inMemoryStore.jobs.get(jobId) || Array.from(inMemoryStore.jobs.values())[0];

  const matchedCandidates = students.map((std) => MatchingEngine.matchCandidate(std, job));
  matchedCandidates.sort((a, b) => b.weightedMatchScore - a.weightedMatchScore);

  res.json(matchedCandidates);
});

// ==========================================
// 4. JOBS, INTERNSHIPS & APPLICATIONS
// ==========================================

router.get('/jobs', (req, res) => {
  // Students only see approved jobs; staff/admin see all
  const all = Array.from(inMemoryStore.jobs.values()).filter((j) => j.type === 'job');
  const showAll = req.query.includePending === 'true';
  const jobs = showAll ? all : all.filter((j) => !j.status || j.status === 'approved');
  res.json(jobs);
});

router.get('/internships', (req, res) => {
  const all = Array.from(inMemoryStore.jobs.values()).filter((j) => j.type === 'internship');
  const showAll = req.query.includePending === 'true';
  const internships = showAll ? all : all.filter((j) => !j.status || j.status === 'approved');
  res.json(internships);
});

router.post('/jobs', authenticateToken, requireRole('industry', 'super_admin'), (req: AuthenticatedRequest, res: Response) => {
  const newJob = {
    id: `job_${Date.now()}`,
    industryId: req.user!.uid,
    companyName: req.user!.name || 'Tech Company',
    status: 'pending' as const, // Posts default to pending moderation
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  inMemoryStore.jobs.set(newJob.id, newJob);
  res.status(201).json(newJob);
});

router.get('/applications', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const applications = Array.from(inMemoryStore.applications.values());
  if (req.user!.role === 'student') {
    res.json(applications.filter((a) => a.studentId === req.user!.uid));
  } else {
    res.json(applications);
  }
});

router.post('/applications', authenticateToken, requireRole('student'), (req: AuthenticatedRequest, res: Response) => {
  const { jobId } = req.body;
  const job = inMemoryStore.jobs.get(jobId);
  const student = inMemoryStore.students.get(req.user!.uid) || inMemoryStore.students.get('std_aarav')!;

  const match = job ? MatchingEngine.matchCandidate(student, job) : { weightedMatchScore: 85, aiExplanation: 'Strong skill profile fit.' };

  const application = {
    id: `app_${Date.now()}`,
    jobId,
    jobTitle: job ? job.title : 'Software Developer',
    companyName: job ? job.companyName : 'TechCorp',
    studentId: student.uid,
    studentName: student.name,
    studentEmail: student.email,
    institutionId: student.institutionId,
    institutionName: student.institutionName || 'IIT Bombay',
    appliedAt: new Date().toISOString(),
    status: 'submitted' as const,
    matchScore: match.weightedMatchScore,
    aiMatchExplanation: match.aiExplanation,
  };

  inMemoryStore.applications.set(application.id, application);
  res.status(201).json(application);
});

// ==========================================
// 5. SKILLS & ASSESSMENT ENGINE
// ==========================================

router.get('/skills', (req, res) => {
  res.json(Array.from(inMemoryStore.skills.values()));
});

router.get('/assessments/questions', (req, res) => {
  const skillId = req.query.skillId as string;
  const questions = Array.from(inMemoryStore.questions.values());
  if (skillId) {
    res.json(questions.filter((q) => q.skillId === skillId));
  } else {
    res.json(questions);
  }
});

router.post('/assessments/submit', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { skillId, answers } = req.body; // answers: { questionId: number }
  const skill = inMemoryStore.skills.get(skillId) || DEMO_SKILLS[0];
  const questions = Array.from(inMemoryStore.questions.values()).filter((q) => q.skillId === skillId);

  let correct = 0;
  questions.forEach((q) => {
    if (answers && answers[q.id] === q.correctOptionIndex) {
      correct++;
    }
  });

  const total = questions.length || 1;
  const score = Math.round((correct / total) * 100) || 85;

  const result = {
    assessmentId: `ass_${Date.now()}`,
    studentId: req.user!.uid,
    skillId: skill.id,
    skillName: skill.name,
    score,
    totalQuestions: total,
    correctAnswers: correct,
    skillLevel: score >= 85 ? 'advanced' : score >= 65 ? 'intermediate' : 'beginner',
    strengths: [`Strong grasp of ${skill.name} core syntax and API patterns`],
    weaknesses: score < 85 ? [`Practice complex async performance optimizations`] : [],
    recommendations: [`Apply verified ${skill.name} badge on your digital portfolio`],
    completedAt: new Date().toISOString(),
  };

  res.json(result);
});

// ==========================================
// 6. AI SERVICE ENGINE ROUTES
// ==========================================

// AI Skill Gap Analysis
router.get('/ai/skill-gap', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const targetRole = (req.query.targetRole as string) || 'Full Stack Developer';
  const student = inMemoryStore.students.get(req.user!.uid) || inMemoryStore.students.get('std_aarav')!;

  const analysis = SkillGapEngine.analyzeSkillGap(student, targetRole);
  res.json(analysis);
});

// AI Candidate Match Score
router.post('/ai/matching', (req, res) => {
  const { studentId, jobId } = req.body;
  const student = inMemoryStore.students.get(studentId) || Array.from(inMemoryStore.students.values())[0];
  const job = inMemoryStore.jobs.get(jobId) || Array.from(inMemoryStore.jobs.values())[0];

  const match = MatchingEngine.matchCandidate(student, job);
  res.json(match);
});

// AI Resume Analyzer
router.post('/ai/resume/analyze', (req, res) => {
  const sampleResumeText = `
  Aarav Sharma - Full Stack Developer
  Email: aarav.sharma@iitb.ac.in | Phone: +91 98765 43210 | GitHub: github.com/aaravsharma-dev
  Education: B.Tech Computer Science & Engineering, IIT Bombay (Graduation: 2026)
  Technical Skills: JavaScript, React, Next.js, Node.js, Express.js, TypeScript, SQL, Docker, Git.
  Projects:
  - SkillBridge AI: Built Next.js 15 & Node.js AI-driven skill gap platform with Pinecone RAG.
  - EduSphere: Realtime quiz system with Socket.io & Redis.
  Experience: Full Stack Engineering Intern at TechCorp India (3 Months).
  `;

  const { jobId, resumeText } = req.body;
  const job = jobId ? inMemoryStore.jobs.get(jobId) : undefined;
  const textToAnalyze = (resumeText && typeof resumeText === 'string' && resumeText.trim().length > 10)
    ? resumeText
    : sampleResumeText;

  const result = ResumeAnalyzer.analyzeResumeText(textToAnalyze, job);
  res.json(result);
});

// AI Interview Simulator
router.post('/ai/interview/start', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { jobRole, experienceLevel, interviewType } = req.body;
  const session = InterviewSimulator.createSession(
    req.user!.uid,
    jobRole || 'Full Stack Developer',
    experienceLevel || '0-2 Years',
    interviewType || 'technical'
  );
  res.json(session);
});

router.post('/ai/interview/evaluate', async (req, res) => {
  const { questionText, userAnswer } = req.body;
  const evalResult = await InterviewSimulator.evaluateAnswer(questionText, userAnswer || 'I use async await and hooks.');
  res.json(evalResult);
});

// ==========================================
// 7. RAG DOCUMENT CHATBOT APIs
// ==========================================

router.post('/rag/chat', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { question } = req.body;
  if (!question) {
    res.status(400).json({ error: 'Question is required' });
    return;
  }

  const result = await RAGService.answerQuestion(question, {
    institutionId: req.user!.institutionId || 'inst_iitb',
    userId: req.user!.uid,
    role: req.user!.role,
  });

  res.json(result);
});

router.post('/rag/upload', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { title, documentType, source, rawText, permissions } = req.body;

  const documentId = `doc_${Date.now()}`;
  const chunkCount = await RAGService.ingestDocument(
    documentId,
    req.user!.institutionId || 'inst_iitb',
    req.user!.uid,
    documentType || 'career_guide',
    title || 'Document Title',
    source || 'Institution Upload',
    permissions || 'public',
    rawText || 'Sample knowledge document content.'
  );

  res.json({
    documentId,
    title,
    chunkCount,
    status: 'indexed_and_ready',
  });
});

// ==========================================
// 8. INSTITUTION ANALYTICS & DEMAND TRENDS
// ==========================================

router.get('/analytics/institution', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const analytics = {
    institutionId: 'inst_iitb',
    institutionName: 'IIT Bombay',
    totalStudents: 1250,
    placementReadyStudents: 890,
    internshipCount: 420,
    placementCount: 650,
    averageSkillScore: 84,
    averageEmployabilityScore: 88,
    topSkillGaps: [
      { skillName: 'AWS Cloud', gapPercentage: 42 },
      { skillName: 'Docker & K8s', gapPercentage: 38 },
      { skillName: 'System Design', gapPercentage: 35 },
      { skillName: 'Cybersecurity', gapPercentage: 30 },
      { skillName: 'NLP & GenAI', gapPercentage: 25 },
    ],
    industryDemandTrends: [
      { skillName: 'Python', demandScore: 96 },
      { skillName: 'React & Next.js', demandScore: 94 },
      { skillName: 'SQL & DB', demandScore: 92 },
      { skillName: 'AWS Cloud', demandScore: 89 },
      { skillName: 'Docker', demandScore: 85 },
    ],
    aiCurriculumRecommendations: [
      'Introduce a 4-week Cloud Infrastructure & Docker workshop for CSE Final Year students.',
      'Organize an industry hackathon focused on Retrieval-Augmented Generation (RAG) and Gemini AI APIs.',
      'Conduct mock system design interview bootcamps with industry mentors.',
    ],
  };

  res.json(analytics);
});

export default router;
