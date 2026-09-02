'use client';

import React from 'react';
import { ShieldCheck, Building2, Users, Database, FileCheck, Layers } from 'lucide-react';

export default function SuperAdminPage() {
  return (
    <div className="space-y-8">
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-2">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-extrabold text-white">Super Admin Control Center</h1>
            <p className="text-xs text-gray-400">Multi-Tenant Institution Management & System Audit Logs</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-2">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-white">3 Verified Institutions</h3>
          <p className="text-gray-400">IIT Bombay, NIT Trichy, BITS Pilani</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-2">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-white">10+ Active Students</h3>
          <p className="text-gray-400">Isolated across multi-tenant scopes</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-white">Pinecone Vector Index</h3>
          <p className="text-gray-400">768-dim embeddings with metadata filters</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-2">
          <FileCheck className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white">Audit Log Integrity</h3>
          <p className="text-gray-400">All authentication & RAG calls logged</p>
        </div>
      </div>
    </div>
  );
}
