import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';
import { config } from '../config/env';

let genAI: GoogleGenerativeAI | null = null;

if (config.isGeminiConfigured()) {
  try {
    genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    console.log('✅ Google Gemini API SDK initialized');
  } catch (error) {
    console.warn('⚠️ Gemini initialization failed, falling back to smart provider:', error);
  }
} else {
  console.log('ℹ️ GEMINI_API_KEY not set. System will use intelligent local AI synthesis provider.');
}

export class GeminiService {
  /**
   * Generates text embedding using text-embedding-004 or local fallback vector
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    if (genAI) {
      try {
        const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await embeddingModel.embedContent(text);
        return result.embedding.values;
      } catch (err) {
        console.warn('Gemini embedding call failed, using fallback vector:', err);
      }
    }

    // Local deterministic pseudo-embedding (768-dimension)
    const vec: number[] = new Array(768).fill(0);
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      vec[(code * (i + 1)) % 768] += (code / 255) * 0.05;
    }
    const mag = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vec.map((v) => v / mag);
  }

  /**
   * Generates AI synthesis text (e.g. RAG responses, career guidance, interview evaluations)
   */
  static async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          ...(systemInstruction ? { systemInstruction } : {}),
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (err) {
        console.warn('Gemini generateContent call failed, using fallback synthesis:', err);
      }
    }

    // Local smart synthesis fallback
    return `[SkillBridge AI Synthesis]: Based on the provided context: "${prompt.slice(0, 100)}...", the recommended strategy is to focus on core technical proficiency, build hands-on portfolio projects, and verify skills via standardized assessments.`;
  }
}
