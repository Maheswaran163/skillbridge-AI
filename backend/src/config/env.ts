import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env or root .env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'skillbridge_ai_super_secret_jwt_key_2026',

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'skillbridge-ai-demo',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },

  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || '',
    indexName: process.env.PINECONE_INDEX_NAME || 'skillbridge-rag-index',
    environment: process.env.PINECONE_ENVIRONMENT || 'us-east-1',
  },

  isFirebaseConfigured: (): boolean => {
    return (
      Boolean(process.env.FIREBASE_PROJECT_ID) &&
      Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
      Boolean(process.env.FIREBASE_PRIVATE_KEY) &&
      !process.env.FIREBASE_CLIENT_EMAIL.includes('demo')
    );
  },

  isGeminiConfigured: (): boolean => {
    return Boolean(process.env.GEMINI_API_KEY) && process.env.GEMINI_API_KEY.length > 10;
  },

  isPineconeConfigured: (): boolean => {
    return Boolean(process.env.PINECONE_API_KEY) && process.env.PINECONE_API_KEY.length > 10;
  },
};
