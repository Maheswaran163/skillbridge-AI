import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation';
import { RAGAssistantWidget } from '@/components/RAGAssistantWidget';

export const metadata: Metadata = {
  title: 'SkillBridge AI — Portal for Academia-Industry Collaboration',
  description: 'Measure Skills. Identify Gaps. Build Careers. Smart India Hackathon AI Platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Navigation />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <RAGAssistantWidget />
          <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
            <p>© 2026 SkillBridge AI • Smart India Hackathon Platform • Powered by Next.js, Node.js, Firebase & Pinecone</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
