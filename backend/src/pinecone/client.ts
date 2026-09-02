import { Pinecone } from '@pinecone-database/pinecone';
import { config } from '../config/env';

export interface VectorRecord {
  id: string;
  values: number[];
  metadata: {
    documentId: string;
    institutionId: string;
    userId: string;
    documentType: string;
    title: string;
    source: string;
    permissions: string; // 'public' | 'institution_only' | 'private'
    content: string;
    chunkIndex: number;
  };
}

let pineconeClient: Pinecone | null = null;

if (config.isPineconeConfigured()) {
  try {
    pineconeClient = new Pinecone({
      apiKey: config.pinecone.apiKey,
    });
    console.log('✅ Pinecone Client initialized');
  } catch (error) {
    console.warn('⚠️ Pinecone initialization failed, using local vector engine fallback:', error);
  }
} else {
  console.log('ℹ️ Pinecone API key not detected. Using local vector engine with metadata filter enforcement.');
}

// In-memory Vector Store fallback engine
class LocalVectorEngine {
  private vectors: VectorRecord[] = [];

  constructor() {
    this.seedDefaultKnowledge();
  }

  private seedDefaultKnowledge() {
    const defaultChunks = [
      {
        id: 'chunk_1',
        title: 'Full Stack Career Roadmap 2026',
        documentId: 'doc_fullstack_career_roadmap',
        institutionId: 'inst_iitb',
        userId: 'admin_deshmukh',
        documentType: 'career_guide',
        source: 'SkillBridge Guide',
        permissions: 'public',
        content: 'To become a modern Full Stack Developer in 2026, students must master React 19/Next.js App Router for frontend, Node.js & Express for REST API design, SQL (PostgreSQL) and MongoDB for database management, and basic Docker containerization.',
      },
      {
        id: 'chunk_2',
        title: 'IIT Bombay Placement Policy',
        documentId: 'doc_placement_policy_iitb',
        institutionId: 'inst_iitb',
        userId: 'admin_deshmukh',
        documentType: 'placement_policy',
        source: 'IIT Bombay Placement Cell',
        permissions: 'institution_only',
        content: 'Students eligible for Day 1 campus placements must maintain a minimum readiness score of 75% on SkillBridge AI and have completed at least one verified industry internship or major Capstone project.',
      },
      {
        id: 'chunk_3',
        title: 'AI/ML & RAG Architecture Preparation',
        documentId: 'doc_aiml_interview_guide',
        institutionId: 'inst_nitt',
        userId: 'acad_meera',
        documentType: 'interview_prep',
        source: 'Innovate AI Labs',
        permissions: 'public',
        content: 'For GenAI & AI/ML Engineer roles, candidates are evaluated on Python fluency, PyTorch deep learning basics, Pinecone vector indexing, RAG chunking strategies, and Gemini API integration.',
      },
    ];

    defaultChunks.forEach((item, index) => {
      this.vectors.push({
        id: item.id,
        values: this.generateMockVector(item.content),
        metadata: {
          ...item,
          chunkIndex: index,
        },
      });
    });
  }

  // Generates 768-dim pseudo vector from text hash for fallback similarity calculations
  private generateMockVector(text: string): number[] {
    const vector: number[] = new Array(768).fill(0);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const idx = (charCode * (i + 1)) % 768;
      vector[idx] += (charCode / 255.0) * 0.1;
    }
    // Normalize vector
    const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vector.map((v) => v / magnitude);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }

  async upsertVectors(records: VectorRecord[]) {
    this.vectors.push(...records);
  }

  async queryVectors(
    queryVector: number[],
    topK: number = 5,
    filter?: { institutionId?: string; documentType?: string; permissions?: string }
  ) {
    let filtered = this.vectors;

    if (filter) {
      filtered = filtered.filter((rec) => {
        if (filter.institutionId && rec.metadata.institutionId !== filter.institutionId && rec.metadata.permissions !== 'public') {
          return false;
        }
        if (filter.documentType && rec.metadata.documentType !== filter.documentType) {
          return false;
        }
        return true;
      });
    }

    const scored = filtered.map((rec) => ({
      ...rec,
      score: this.cosineSimilarity(queryVector, rec.values),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }
}

export const localVectorEngine = new LocalVectorEngine();
export { pineconeClient };
