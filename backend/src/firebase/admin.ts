import * as admin from 'firebase-admin';
import { config } from '../config/env';
import {
  DEMO_STUDENTS,
  DEMO_STAFF,
  DEMO_INDUSTRIES,
  DEMO_ACADEMICIANS,
  DEMO_ADMINS,
  DEMO_SKILLS,
  DEMO_ASSESSMENT_QUESTIONS,
  DEMO_JOBS,
  DEMO_INTERNSHIPS,
  DEMO_APPLICATIONS,
  DEMO_INSTITUTIONS,
  DEMO_RAG_DOCUMENTS,
  DEMO_ANNOUNCEMENTS,
  DEMO_PLACEMENTS,
} from '../seed/demoData';
import {
  StudentProfile,
  StaffProfile,
  IndustryProfile,
  AcademicianProfile,
  InstitutionAdminProfile,
  JobOpportunity,
  JobApplication,
  SkillMaster,
  SkillAssessmentQuestion,
  RAGDocument,
  StaffAnnouncement,
  PlacementRecord,
} from '../types';

let firebaseApp: admin.app.App | null = null;
let db: admin.firestore.Firestore | null = null;

if (config.isFirebaseConfigured()) {
  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
      storageBucket: `${config.firebase.projectId}.appspot.com`,
    });
    db = admin.firestore();
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.warn('⚠️ Firebase Admin SDK initialization failed, falling back to Memory Store:', error);
  }
} else {
  console.log('ℹ️ Firebase credentials not detected. Operating in high-performance local demo store mode.');
}

// In-Memory Fallback Data Store for immediate seamless demo
class InMemoryStore {
  students: Map<string, StudentProfile> = new Map();
  staff: Map<string, StaffProfile> = new Map();
  industries: Map<string, IndustryProfile> = new Map();
  academicians: Map<string, AcademicianProfile> = new Map();
  institutionAdmins: Map<string, InstitutionAdminProfile> = new Map();
  skills: Map<string, SkillMaster> = new Map();
  questions: Map<string, SkillAssessmentQuestion> = new Map();
  jobs: Map<string, JobOpportunity> = new Map();
  applications: Map<string, JobApplication> = new Map();
  institutions: Map<string, any> = new Map();
  ragDocuments: Map<string, RAGDocument> = new Map();
  announcements: Map<string, StaffAnnouncement> = new Map();
  placements: Map<string, PlacementRecord> = new Map();

  constructor() {
    // Seed initial data
    DEMO_STUDENTS.forEach((s) => this.students.set(s.uid, { ...s }));
    DEMO_STAFF.forEach((st) => this.staff.set(st.uid, { ...st }));
    DEMO_INDUSTRIES.forEach((i) => this.industries.set(i.uid, { ...i }));
    DEMO_ACADEMICIANS.forEach((a) => this.academicians.set(a.uid, { ...a }));
    DEMO_ADMINS.forEach((adm) => this.institutionAdmins.set(adm.uid, { ...adm }));
    DEMO_SKILLS.forEach((sk) => this.skills.set(sk.id, { ...sk }));
    DEMO_ASSESSMENT_QUESTIONS.forEach((q) => this.questions.set(q.id, { ...q }));
    [...DEMO_JOBS, ...DEMO_INTERNSHIPS].forEach((j) => this.jobs.set(j.id, { ...j }));
    DEMO_APPLICATIONS.forEach((app) => this.applications.set(app.id, { ...app }));
    DEMO_INSTITUTIONS.forEach((inst) => this.institutions.set(inst.id, { ...inst }));
    DEMO_RAG_DOCUMENTS.forEach((doc) => this.ragDocuments.set(doc.documentId, { ...doc }));
    DEMO_ANNOUNCEMENTS.forEach((ann) => this.announcements.set(ann.id, { ...ann }));
    DEMO_PLACEMENTS.forEach((plc) => this.placements.set(plc.id, { ...plc }));
  }

  getUserByUid(uid: string) {
    if (this.students.has(uid)) return this.students.get(uid);
    if (this.staff.has(uid)) return this.staff.get(uid);
    if (this.industries.has(uid)) return this.industries.get(uid);
    if (this.academicians.has(uid)) return this.academicians.get(uid);
    if (this.institutionAdmins.has(uid)) return this.institutionAdmins.get(uid);
    return null;
  }
}

export const inMemoryStore = new InMemoryStore();

export { firebaseApp, db };
