import { inMemoryStore } from '../firebase/admin';

console.log('🌱 Seeding SkillBridge AI Demo Database...');
console.log(`✅ Loaded ${inMemoryStore.students.size} Demo Students`);
console.log(`✅ Loaded ${inMemoryStore.industries.size} Demo Industries`);
console.log(`✅ Loaded ${inMemoryStore.academicians.size} Demo Academicians`);
console.log(`✅ Loaded ${inMemoryStore.jobs.size} Demo Jobs & Internships`);
console.log(`✅ Loaded ${inMemoryStore.skills.size} Master Skills & ${inMemoryStore.questions.size} Assessment Questions`);
console.log('✨ Seed execution completed successfully!');
