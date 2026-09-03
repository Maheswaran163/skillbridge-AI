export type UserRole =
  | 'student'
  | 'industry'
  | 'academician'
  | 'institution_admin'
  | 'super_admin';

export interface RAGAnswerResult {
  answer: string;
  sources: {
    title: string;
    source: string;
    documentType: string;
    relevanceScore: number;
    chunkSnippet: string;
  }[];
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  institutionId: string;
  institutionName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile extends UserProfile {
  role: 'student';
  department: string;
  degree: string;
  graduationYear: number;
  careerGoal: string;
  bio?: string;
  phone?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  readinessScore: number;
  employabilityScore: number;
  technicalScore: number;
  softSkillScore: number;
  skills: StudentSkill[];
  projects: StudentProject[];
  certifications: StudentCertification[];
  internships: StudentInternshipExperience[];
}

export interface StudentSkill {
  skillId: string;
  skillName: string;
  category: 'technical' | 'soft' | 'domain';
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verificationLevel: 'self_declared' | 'assessment_verified' | 'project_verified' | 'certification_verified' | 'industry_verified';
  score: number;
  verifiedAt?: string;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  role: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  verified: boolean;
}

export interface StudentCertification {
  id: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl?: string;
  skillsCovered: string[];
  verified: boolean;
}

export interface StudentInternshipExperience {
  id: string;
  companyName: string;
  role: string;
  duration: string;
  description: string;
  certificateUrl?: string;
}

export interface IndustryProfile extends UserProfile {
  role: 'industry';
  companyName: string;
  industrySector: string;
  website: string;
  companySize: string;
  headquarters: string;
  description: string;
  verified: boolean;
}

export interface AcademicianProfile extends UserProfile {
  role: 'academician';
  department: string;
  designation: string;
  expertise: string[];
  researchAreas: string[];
  consultancyAvailable: boolean;
}

export interface InstitutionAdminProfile extends UserProfile {
  role: 'institution_admin';
  institutionId: string;
  institutionName: string;
  code: string;
  location: string;
  website: string;
  totalStudents: number;
}

export interface SkillMaster {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'domain';
  description: string;
  popularDemandScore: number;
}

export interface SkillAssessmentQuestion {
  id: string;
  skillId: string;
  skillName: string;
  category: 'technical' | 'soft';
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SkillAssessmentResult {
  assessmentId: string;
  studentId: string;
  skillId: string;
  skillName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  completedAt: string;
}

export interface SkillGapAnalysisResult {
  studentId: string;
  targetRole: string;
  overallMatchPercentage: number;
  matchingSkills: {
    skillName: string;
    studentProficiency: number;
    requiredProficiency: number;
    status: 'strong' | 'adequate';
  }[];
  missingSkills: {
    skillName: string;
    requiredProficiency: number;
    priority: 'critical' | 'high' | 'medium';
    suggestedCourse?: string;
  }[];
  weakSkills: {
    skillName: string;
    studentProficiency: number;
    requiredProficiency: number;
    gap: number;
  }[];
  personalizedRoadmap: LearningRoadmapPhase[];
}

export interface LearningRoadmapPhase {
  phase: number;
  durationWeeks: string;
  focusArea: string;
  skillsToLearn: string[];
  tasks: {
    id: string;
    title: string;
    resourceType: 'course' | 'project' | 'documentation' | 'practice';
    resourceLink: string;
    completed: boolean;
  }[];
}

export interface StaffProfile extends UserProfile {
  role: 'staff';
  department: string;
  designation: string;
  phone?: string;
  verificationPrivileges: boolean;
}

export interface StaffAnnouncement {
  id: string;
  institutionId: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  targetAudience: 'all' | 'students' | 'final_year';
}

export interface PlacementRecord {
  id: string;
  studentId: string;
  studentName: string;
  companyName: string;
  roleTitle: string;
  packageLpa: number;
  offerType: 'full_time' | 'internship_ppo';
  status: 'offered' | 'accepted' | 'joined';
  date: string;
}

export interface JobOpportunity {
  id: string;
  industryId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  type: 'job' | 'internship';
  status?: 'pending' | 'approved' | 'rejected';
  description: string;
  location: string;
  workMode: 'remote' | 'on_site' | 'hybrid';
  experienceLevel: string;
  salaryOrStipend: string;
  duration?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  degreeRequired: string;
  graduationYearEligible: number[];
  deadline: string;
  createdAt: string;
  institutionId?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  institutionId: string;
  institutionName: string;
  appliedAt: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'hired' | 'rejected';
  matchScore: number;
  aiMatchExplanation: string;
  resumeUrl?: string;
}

export interface CandidateMatchResult {
  studentId: string;
  studentName: string;
  email: string;
  department: string;
  graduationYear: number;
  readinessScore: number;
  weightedMatchScore: number;
  scoreBreakdown: {
    skillMatchScore: number;
    assessmentScore: number;
    projectsScore: number;
    certificationsScore: number;
    experienceScore: number;
    careerInterestScore: number;
    softSkillsScore: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  aiExplanation: string;
}

export interface ResumeAnalysisResult {
  score: number;
  extractedName?: string;
  extractedEmail?: string;
  extractedSkills: string[];
  extractedExperience: string[];
  extractedProjects: string[];
  strengths: string[];
  weaknesses: string[];
  atsRecommendations: string[];
  jobCompatibility?: {
    jobTitle: string;
    compatibilityPercentage: number;
    matchingSkills: string[];
    missingSkills: string[];
    tailoringSuggestions: string[];
  };
}

export interface InterviewSession {
  sessionId: string;
  studentId: string;
  jobRole: string;
  experienceLevel: string;
  interviewType: 'technical' | 'hr' | 'behavioral' | 'project';
  status: 'in_progress' | 'completed';
  questions: InterviewQuestion[];
  overallFeedback?: {
    overallScore: number;
    technicalAccuracyScore: number;
    communicationScore: number;
    confidenceScore: number;
    strengths: string[];
    areasToImprove: string[];
  };
}

export interface InterviewQuestion {
  questionId: string;
  questionText: string;
  userAnswer?: string;
  evaluation?: {
    score: number;
    technicalAccuracy: string;
    communicationQuality: string;
    relevance: string;
    suggestedBetterAnswer: string;
  };
}

export interface RAGDocument {
  documentId: string;
  institutionId: string;
  userId: string;
  documentType: 'job_description' | 'course_material' | 'career_guide' | 'placement_policy' | 'interview_prep';
  title: string;
  source: string;
  permissions: 'public' | 'institution_only' | 'private';
  contentChunkCount?: number;
  uploadedAt: string;
}

export interface InstitutionAnalytics {
  institutionId: string;
  institutionName: string;
  totalStudents: number;
  placementReadyStudents: number;
  internshipCount: number;
  placementCount: number;
  averageSkillScore: number;
  averageEmployabilityScore: number;
  topSkillGaps: { skillName: string; gapPercentage: number }[];
  industryDemandTrends: { skillName: string; demandScore: number }[];
  aiCurriculumRecommendations: string[];
}
