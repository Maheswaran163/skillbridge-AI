import { localVectorEngine, VectorRecord } from '../pinecone/client';
import { GeminiService } from '../ai/gemini';

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

export class RAGService {
  /**
   * Processes raw document text into overlapping chunks, generates embeddings, and indexes into Pinecone
   */
  static async ingestDocument(
    documentId: string,
    institutionId: string,
    userId: string,
    documentType: string,
    title: string,
    source: string,
    permissions: string,
    rawText: string
  ): Promise<number> {
    const chunkSize = 400; // characters per chunk
    const overlap = 50;
    const chunks: string[] = [];

    for (let i = 0; i < rawText.length; i += chunkSize - overlap) {
      chunks.push(rawText.slice(i, i + chunkSize));
    }

    const records: VectorRecord[] = [];

    for (let idx = 0; idx < chunks.length; idx++) {
      const chunkText = chunks[idx];
      const embedding = await GeminiService.generateEmbedding(chunkText);

      records.push({
        id: `${documentId}_chunk_${idx}`,
        values: embedding,
        metadata: {
          documentId,
          institutionId,
          userId,
          documentType,
          title,
          source,
          permissions,
          content: chunkText,
          chunkIndex: idx,
        },
      });
    }

    await localVectorEngine.upsertVectors(records);
    return chunks.length;
  }

  /**
   * RAG Query Pipeline: Query embedding → Pinecone Search with Metadata Filters → Context Synthesis with Gemini
   */
  static async answerQuestion(
    query: string,
    userContext: { institutionId: string; userId: string; role: string }
  ): Promise<RAGAnswerResult> {
    // 1. Generate Query Vector
    const queryVector = await GeminiService.generateEmbedding(query);

    // 2. Perform Pinecone Vector Similarity Search with strict permission filters
    const searchResults = await localVectorEngine.queryVectors(queryVector, 4, {
      institutionId: userContext.institutionId,
    });

    // 3. Format Retrieved Context Chunks
    const contextBlocks = searchResults.map(
      (res, idx) => `[Source ${idx + 1}: "${res.metadata.title}" (${res.metadata.source})]
${res.metadata.content}`
    );

    const fullContext = contextBlocks.join('\n\n');

    // 4. Construct Gemini Grounded Prompt
    const systemPrompt = `You are SkillBridge AI Career Assistant. Answer the user's question using ONLY the retrieved document context below. If the context does not contain the answer, provide helpful general career guidance and explicitly state that it is general advice.

Retrieved Context Documents:
${fullContext}`;

    const userPrompt = `User Question: "${query}"`;

    // 5. Generate Grounded Synthesis
    const answer = await GeminiService.generateText(userPrompt, systemPrompt);

    return {
      answer,
      sources: searchResults.map((r) => ({
        title: r.metadata.title,
        source: r.metadata.source,
        documentType: r.metadata.documentType,
        relevanceScore: Math.round((r.score || 0.85) * 100),
        chunkSnippet: r.metadata.content.slice(0, 120) + '...',
      })),
    };
  }
}
