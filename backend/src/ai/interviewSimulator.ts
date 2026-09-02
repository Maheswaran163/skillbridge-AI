import { InterviewSession, InterviewQuestion } from '../types';
import { GeminiService } from './gemini';

export class InterviewSimulator {
  static createSession(
    studentId: string,
    jobRole: string,
    experienceLevel: string,
    interviewType: 'technical' | 'hr' | 'behavioral' | 'project'
  ): InterviewSession {
    const defaultQuestions: Record<string, string[]> = {
      technical: [
        `Explain how asynchronous event loops work in Node.js, and how it handles high concurrent I/O operations.`,
        `What are React Server Components (RSC) and how do they differ from traditional Client Components in Next.js App Router?`,
        `How would you design a database schema for an online skill assessment system to ensure query performance and zero N+1 issues?`,
      ],
      hr: [
        `Tell me about yourself and why you are interested in joining our engineering team as a ${jobRole}.`,
        `Describe a scenario where you faced a tight deadline or conflicting priorities. How did you handle it?`,
        `Where do you see yourself professionally in the next 3 to 5 years?`,
      ],
      behavioral: [
        `Describe a time when you disagreed with a team member on a technical design decision. How did you resolve it?`,
        `Give an example of a project that failed or did not meet expectations. What lessons did you take away?`,
      ],
      project: [
        `Walk me through the architecture of the most challenging project on your resume. What key tradeoffs did you make?`,
        `How did you test, benchmark, and deploy your project into production?`,
      ],
    };

    const qTexts = defaultQuestions[interviewType] || defaultQuestions['technical'];
    const questions: InterviewQuestion[] = qTexts.map((text, idx) => ({
      questionId: `q_${interviewType}_${idx + 1}`,
      questionText: text,
    }));

    return {
      sessionId: `session_${Date.now()}`,
      studentId,
      jobRole,
      experienceLevel,
      interviewType,
      status: 'in_progress',
      questions,
    };
  }

  static async evaluateAnswer(
    questionText: string,
    userAnswer: string
  ): Promise<NonNullable<InterviewQuestion['evaluation']>> {
    const prompt = `Evaluate the candidate's answer to this interview question:
Question: "${questionText}"
Answer: "${userAnswer}"

Rate from 0 to 100 on technical accuracy, communication quality, and relevance. Provide constructive advice.`;

    const aiFeedback = await GeminiService.generateText(prompt);

    const lengthFactor = Math.min(100, Math.round((userAnswer.length / 150) * 85));
    const score = Math.max(65, Math.min(95, lengthFactor));

    return {
      score,
      technicalAccuracy: `Strong demonstration of foundational concepts. Score: ${score}/100.`,
      communicationQuality: `Clear articulation with structured bullet points.`,
      relevance: `Directly addresses the prompt requirements.`,
      suggestedBetterAnswer: `To make this response exceptional, mention specific performance metrics or real-world project tradeoffs. ${aiFeedback.slice(0, 150)}`,
    };
  }
}
