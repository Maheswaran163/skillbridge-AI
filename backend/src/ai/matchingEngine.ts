import { StudentProfile, JobOpportunity, CandidateMatchResult } from '../types';

export class MatchingEngine {
  /**
   * Deterministic Weighted Candidate Matching Algorithm
   */
  static matchCandidate(student: StudentProfile, job: JobOpportunity): CandidateMatchResult {
    const requiredSet = new Set(job.requiredSkills.map((s) => s.toLowerCase()));
    const preferredSet = new Set(job.preferredSkills.map((s) => s.toLowerCase()));

    const studentSkillScores = new Map<string, { score: number; verified: boolean }>();
    student.skills.forEach((s) => {
      studentSkillScores.set(s.skillName.toLowerCase(), {
        score: s.score || 70,
        verified: s.verificationLevel !== 'self_declared',
      });
    });

    let matchedRequiredCount = 0;
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    job.requiredSkills.forEach((reqSkill) => {
      const info = studentSkillScores.get(reqSkill.toLowerCase());
      if (info && info.score >= 60) {
        matchedRequiredCount++;
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    // 1. Skill Match Score (50%)
    const skillMatchRatio = job.requiredSkills.length > 0 ? matchedRequiredCount / job.requiredSkills.length : 1;
    const skillMatchScore = Math.round(skillMatchRatio * 100);

    // 2. Assessment Score (15%)
    const assessmentScore = Math.min(100, Math.round(student.technicalScore * 1.0));

    // 3. Projects Score (10%)
    const relevantProjects = student.projects.filter((p) =>
      p.techStack.some((tech) => requiredSet.has(tech.toLowerCase()) || preferredSet.has(tech.toLowerCase()))
    );
    const projectsScore = Math.min(100, relevantProjects.length * 50);

    // 4. Certifications Score (5%)
    const certificationsScore = Math.min(100, student.certifications.length * 50);

    // 5. Experience Score (5%)
    const experienceScore = Math.min(100, student.internships.length * 50);

    // 6. Career Interest Score (10%)
    const careerInterestScore =
      student.careerGoal.toLowerCase().includes(job.title.toLowerCase()) ||
      job.title.toLowerCase().includes(student.careerGoal.toLowerCase())
        ? 100
        : 70;

    // 7. Soft Skills Score (5%)
    const softSkillsScore = Math.round(student.softSkillScore || 80);

    // Weighted Combined Score
    const weightedMatchScore = Math.round(
      skillMatchScore * 0.5 +
        assessmentScore * 0.15 +
        projectsScore * 0.1 +
        certificationsScore * 0.05 +
        experienceScore * 0.05 +
        careerInterestScore * 0.1 +
        softSkillsScore * 0.05
    );

    const aiExplanation =
      missingSkills.length === 0
        ? `Candidate ${student.name} matches 100% of required technical skills with verified projects in ${matchedSkills.slice(0, 3).join(', ')}.`
        : `Candidate ${student.name} matches ${matchedSkills.length}/${job.requiredSkills.length} required skills (${matchedSkills.join(', ')}). Missing skill: ${missingSkills.join(', ')}.`;

    return {
      studentId: student.uid,
      studentName: student.name,
      email: student.email,
      department: student.department,
      graduationYear: student.graduationYear,
      readinessScore: student.readinessScore,
      weightedMatchScore,
      scoreBreakdown: {
        skillMatchScore,
        assessmentScore,
        projectsScore,
        certificationsScore,
        experienceScore,
        careerInterestScore,
        softSkillsScore,
      },
      matchedSkills,
      missingSkills,
      aiExplanation,
    };
  }
}
