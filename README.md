# SkillBridge AI — Academia–Industry Skill Mapping & Placement Platform

> **"Measure Skills. Identify Gaps. Build Careers."**
> **Smart India Hackathon (SIH) Problem Statement Solution**

SkillBridge AI is a multi-tenant, full-stack enterprise web platform designed to bridge the gap between academic institutions and industry requirements.

---

## 🌟 Core Features & Highlights

1. **Deterministic + AI Skill Gap Engine**: Benchmarks student skill profiles against real-time industry job standards, generating personalized 4-week, 8-week, and 12-week learning roadmaps.
2. **Deterministic Candidate Matching Formula**:
   $$\text{Match Score} = 0.50 \cdot \text{Skill} + 0.15 \cdot \text{Assessment} + 0.10 \cdot \text{Projects} + 0.05 \cdot \text{Certs} + 0.05 \cdot \text{Exp} + 0.10 \cdot \text{Goal} + 0.05 \cdot \text{SoftSkills}$$
3. **Grounded Pinecone RAG Career Chatbot**: Vector similarity search over campus policies, career roadmaps, and interview resources, synthesized by Gemini AI with metadata permission enforcement.
4. **ATS Resume Analyzer**: PDF & DOCX text parsing (pure Node.js) with ATS readability scoring and job compatibility breakdown.
5. **AI Mock Interview Simulator**: Technical, HR, and behavioral interview generator with multi-turn scoring and improvement advice.
6. **Recharts Institutional Analytics**: Interactive dashboards for institution admins displaying student placement readiness, skill demand trends, and AI curriculum recommendations.
7. **5 Multi-Tenant Role Portals**: Dedicated UI dashboards for Student, Industry, Academician, Institution Admin, and Super Admin.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14/15 (App Router), React 18/19, TypeScript, Tailwind CSS, Lucide React, Recharts, Zod.
- **Backend**: Node.js, Express.js, TypeScript, REST APIs, Zod, Helmet, Rate Limiting, CORS.
- **Database & Auth**: Firebase Authentication, Cloud Firestore, Firebase Storage (with high-performance local demo store fallback).
- **AI & RAG**: Google Gemini API (`@google/genai`), Pinecone Vector Database (`@pinecone-database/pinecone`), `pdf-parse`, `mammoth`.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
# Backend
cd backend
cmd /c npm install

# Frontend
cd ../frontend
cmd /c npm install
```

### 2. Launch Dev Servers
```bash
# Terminal 1 (Backend on http://localhost:5000)
cd backend
cmd /c npm run dev

# Terminal 2 (Frontend on http://localhost:3000)
cd frontend
cmd /c npm run dev
```

---

## 📁 Repository Monorepo Structure

```
SIH PROTO/
├── backend/
│   ├── src/
│   │   ├── ai/            # SkillGap Engine, Candidate Matching, Resume Analyzer, Interview Simulator
│   │   ├── config/        # Environment configurations & validation
│   │   ├── firebase/      # Firebase Admin SDK & local demo store
│   │   ├── middleware/    # Auth token verifier & RBAC middleware
│   │   ├── pinecone/      # Pinecone Client & local vector engine
│   │   ├── rag/           # Ingestion & Grounded Search RAG service
│   │   ├── routes/        # Express REST API controllers & routes
│   │   ├── seed/          # Realistic Indian education demo dataset
│   │   └── server.ts      # Express server entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router pages (Student, Industry, Academician, Institution, Admin)
│   │   ├── components/    # Navigation header & floating Pinecone RAG widget
│   │   ├── context/       # AuthContext & instant SIH Role Switcher
│   │   └── lib/           # REST API client
│   ├── Dockerfile
│   └── package.json
├── shared/
│   └── types/             # Shared TypeScript DTOs and interfaces
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 📜 License
Built for the Smart India Hackathon (SIH). Open Source MIT License.
