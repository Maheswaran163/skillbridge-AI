import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ResumeAnalysisResult, JobOpportunity } from '../types';

export class ResumeAnalyzer {
  /**
   * Extracts raw plain text from PDF or DOCX file buffer
   */
  static async extractText(buffer: Buffer, mimeType: string): Promise<string> {
    try {
      if (mimeType.includes('pdf') || mimeType.endsWith('/pdf')) {
        const data = await pdfParse(buffer);
        return data.text || '';
      } else if (
        mimeType.includes('wordprocessingml') ||
        mimeType.includes('docx') ||
        mimeType.endsWith('/docx')
      ) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value || '';
      }
    } catch (err) {
      console.warn('Error parsing document buffer:', err);
    }
    // Fallback string if binary text decoding
    return buffer.toString('utf-8');
  }

  /**
   * Analyzes extracted resume text against ATS standards and target job posting
   */
  static analyzeResumeText(text: string, job?: JobOpportunity): ResumeAnalysisResult {
    const knownSkillsList = [
      'JavaScript',
      'React',
      'Next.js',
      'Node.js',
      'Express.js',
      'TypeScript',
      'Python',
      'Java',
      'SQL',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'AWS Cloud',
      'Machine Learning',
      'Deep Learning',
      'NLP & LLMs',
      'Cybersecurity',
      'System Design',
      'Git & GitHub',
      'Communication',
      'Problem Solving',
      'Teamwork',
    ];

    const textLower = text.toLowerCase();
    const extractedSkills = knownSkillsList.filter((s) => textLower.includes(s.toLowerCase()));

    // Basic ATS heuristics
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
    const hasEducation = /education|b\.tech|b\.e\.|degree|university|institute/i.test(text);
    const hasProjects = /project|developed|built|implemented/i.test(text);
    const hasExperience = /experience|internship|work|company/i.test(text);

    let atsScore = 50;
    if (hasEmail) atsScore += 10;
    if (hasPhone) atsScore += 10;
    if (hasEducation) atsScore += 10;
    if (hasProjects) atsScore += 10;
    if (extractedSkills.length >= 5) atsScore += 10;

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const atsRecommendations: string[] = [];

    if (hasEmail && hasPhone) strengths.push('Clear contact information detected');
    if (extractedSkills.length >= 4) strengths.push(`Identified ${extractedSkills.length} key technical skills: ${extractedSkills.slice(0, 4).join(', ')}`);
    if (hasProjects) strengths.push('Project section identified with engineering action verbs');

    if (extractedSkills.length < 4) {
      weaknesses.push('Limited explicit technical skills mentioned');
      atsRecommendations.push('Add a dedicated "Technical Skills" bullet section with categorized frameworks and tools.');
    }
    if (!hasExperience) {
      weaknesses.push('No formal industry internship or employment section detected');
      atsRecommendations.push('Highlight academic projects, open source contributions, or freelance work in structured experience formatting.');
    }

    let jobCompatibility: ResumeAnalysisResult['jobCompatibility'] = undefined;

    if (job) {
      const required = job.requiredSkills;
      const matched = required.filter((s) => textLower.includes(s.toLowerCase()));
      const missing = required.filter((s) => !textLower.includes(s.toLowerCase()));

      const compatibilityPercentage = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 85;

      jobCompatibility = {
        jobTitle: job.title,
        compatibilityPercentage,
        matchingSkills: matched,
        missingSkills: missing,
        tailoringSuggestions: missing.map((s) => `Incorporate project achievements or coursework demonstrating proficiency in ${s}.`),
      };
    }

    return {
      score: Math.min(100, atsScore),
      extractedSkills,
      extractedExperience: hasExperience ? ['Industry Internships & Engineering Experience'] : [],
      extractedProjects: hasProjects ? ['Full-Stack / Applied AI Project Works'] : [],
      strengths,
      weaknesses,
      atsRecommendations,
      jobCompatibility,
    };
  }
}
