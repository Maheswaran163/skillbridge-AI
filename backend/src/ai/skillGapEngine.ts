import { StudentProfile, SkillGapAnalysisResult, LearningRoadmapPhase } from '../types';
import { GeminiService } from './gemini';

export interface CareerRequirement {
  careerGoal: string;
  requiredSkills: { skillName: string; minScore: number; priority: 'critical' | 'high' | 'medium' }[];
}

export const CAREER_BENCHMARKS: Record<string, CareerRequirement> = {
  'Full Stack Developer': {
    careerGoal: 'Full Stack Developer',
    requiredSkills: [
      { skillName: 'React', minScore: 80, priority: 'critical' },
      { skillName: 'Node.js', minScore: 75, priority: 'critical' },
      { skillName: 'JavaScript', minScore: 85, priority: 'critical' },
      { skillName: 'TypeScript', minScore: 75, priority: 'high' },
      { skillName: 'SQL', minScore: 70, priority: 'high' },
      { skillName: 'Docker', minScore: 60, priority: 'medium' },
      { skillName: 'AWS Cloud', minScore: 50, priority: 'medium' },
    ],
  },
  'AI/ML Engineer': {
    careerGoal: 'AI/ML Engineer',
    requiredSkills: [
      { skillName: 'Python', minScore: 90, priority: 'critical' },
      { skillName: 'Machine Learning', minScore: 85, priority: 'critical' },
      { skillName: 'NLP & LLMs', minScore: 80, priority: 'critical' },
      { skillName: 'Deep Learning', minScore: 75, priority: 'high' },
      { skillName: 'SQL', minScore: 70, priority: 'medium' },
    ],
  },
  'Cloud Engineer': {
    careerGoal: 'Cloud Engineer',
    requiredSkills: [
      { skillName: 'AWS Cloud', minScore: 85, priority: 'critical' },
      { skillName: 'Docker', minScore: 80, priority: 'critical' },
      { skillName: 'Kubernetes', minScore: 75, priority: 'high' },
      { skillName: 'Python', minScore: 70, priority: 'high' },
      { skillName: 'Cybersecurity', minScore: 65, priority: 'medium' },
    ],
  },
};

export class SkillGapEngine {
  /**
   * Deterministic Skill Comparison Engine
   */
  static analyzeSkillGap(student: StudentProfile, targetGoal?: string): SkillGapAnalysisResult {
    const goal = targetGoal || student.careerGoal || 'Full Stack Developer';
    const benchmark = CAREER_BENCHMARKS[goal] || CAREER_BENCHMARKS['Full Stack Developer'];

    const studentSkillMap = new Map<string, number>();
    student.skills.forEach((s) => {
      studentSkillMap.set(s.skillName.toLowerCase(), s.score || 0);
    });

    const matchingSkills: SkillGapAnalysisResult['matchingSkills'] = [];
    const missingSkills: SkillGapAnalysisResult['missingSkills'] = [];
    const weakSkills: SkillGapAnalysisResult['weakSkills'] = [];

    let totalWeight = 0;
    let earnedWeight = 0;

    benchmark.requiredSkills.forEach((req) => {
      const weight = req.priority === 'critical' ? 3 : req.priority === 'high' ? 2 : 1;
      totalWeight += weight * 100;

      const currentScore = studentSkillMap.get(req.skillName.toLowerCase()) || 0;
      earnedWeight += weight * currentScore;

      if (currentScore >= req.minScore) {
        matchingSkills.push({
          skillName: req.skillName,
          studentProficiency: currentScore,
          requiredProficiency: req.minScore,
          status: currentScore >= 85 ? 'strong' : 'adequate',
        });
      } else if (currentScore === 0) {
        missingSkills.push({
          skillName: req.skillName,
          requiredProficiency: req.minScore,
          priority: req.priority,
          suggestedCourse: `Mastering ${req.skillName} for Enterprise Applications`,
        });
      } else {
        weakSkills.push({
          skillName: req.skillName,
          studentProficiency: currentScore,
          requiredProficiency: req.minScore,
          gap: req.minScore - currentScore,
        });
      }
    });

    const overallMatchPercentage = Math.round((earnedWeight / (totalWeight || 1)) * 100);

    const personalizedRoadmap = this.generateDeterministicRoadmap(missingSkills, weakSkills);

    return {
      studentId: student.uid,
      targetRole: goal,
      overallMatchPercentage,
      matchingSkills,
      missingSkills,
      weakSkills,
      personalizedRoadmap,
    };
  }

  private static generateDeterministicRoadmap(
    missingSkills: SkillGapAnalysisResult['missingSkills'],
    weakSkills: SkillGapAnalysisResult['weakSkills']
  ): LearningRoadmapPhase[] {
    const focusSkills = [...missingSkills.map((m) => m.skillName), ...weakSkills.map((w) => w.skillName)];

    return [
      {
        phase: 1,
        durationWeeks: 'Weeks 1 - 2',
        focusArea: `Foundations & Core Prerequisites (${focusSkills.slice(0, 2).join(', ') || 'Core Stack'})`,
        skillsToLearn: focusSkills.slice(0, 2),
        tasks: [
          {
            id: 'task_1',
            title: `Complete fundamentals tutorial on ${focusSkills[0] || 'Core Architecture'}`,
            resourceType: 'course',
            resourceLink: 'https://skillbridge.ai/courses/fundamentals',
            completed: true,
          },
          {
            id: 'task_2',
            title: `Build 2 hands-on mini projects showcasing ${focusSkills[0] || 'State Management'}`,
            resourceType: 'project',
            resourceLink: 'https://skillbridge.ai/projects/starter',
            completed: false,
          },
        ],
      },
      {
        phase: 2,
        durationWeeks: 'Weeks 3 - 4',
        focusArea: `Advanced Proficiency & Integration (${focusSkills.slice(2, 4).join(', ') || 'Database & Cloud'})`,
        skillsToLearn: focusSkills.slice(2, 4),
        tasks: [
          {
            id: 'task_3',
            title: `Implement RESTful API endpoints and unit tests in ${focusSkills[2] || 'Node.js'}`,
            resourceType: 'practice',
            resourceLink: 'https://skillbridge.ai/practice/api-design',
            completed: false,
          },
        ],
      },
      {
        phase: 3,
        durationWeeks: 'Weeks 5 - 8',
        focusArea: 'Capstone Portfolio Build & Assessment Verification',
        skillsToLearn: focusSkills,
        tasks: [
          {
            id: 'task_4',
            title: 'Deploy full-stack application on Cloud/Vercel with Docker containers',
            resourceType: 'project',
            resourceLink: 'https://skillbridge.ai/projects/capstone',
            completed: false,
          },
          {
            id: 'task_5',
            title: 'Take SkillBridge Proctored Skill Assessment to earn Verified Badge',
            resourceType: 'practice',
            resourceLink: 'https://skillbridge.ai/assessments',
            completed: false,
          },
        ],
      },
    ];
  }
}
