import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import apiRouter from './routes/apiRoutes';

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
});
app.use(limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '🚀 SkillBridge AI Backend API Server is Active!',
    healthCheck: '/api/health',
    apiDocumentation: '/api',
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'SkillBridge AI Express Server',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
    integrations: {
      firebase: config.isFirebaseConfigured() ? 'live' : 'demo_mode',
      gemini: config.isGeminiConfigured() ? 'live' : 'smart_fallback',
      pinecone: config.isPineconeConfigured() ? 'live' : 'local_vector_engine',
    },
  });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔥 Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(config.port, () => {
  console.log(`
  🚀 SkillBridge AI Backend Engine listening on http://localhost:${config.port}
  ├── Health Endpoint: http://localhost:${config.port}/api/health
  ├── REST APIs: http://localhost:${config.port}/api
  └── Status: Production-Ready Monorepo Backend Active
  `);
});

export default app;
