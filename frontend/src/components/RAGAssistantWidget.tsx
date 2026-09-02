'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/apiClient';
import { RAGAnswerResult } from '@/types';
import { MessageSquare, Send, Sparkles, X, FileText, Bot, User, Loader2 } from 'lucide-react';

export const RAGAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { sender: 'user' | 'bot'; text: string; sources?: RAGAnswerResult['sources'] }[]
  >([
    {
      sender: 'bot',
      text: 'Hello! I am your SkillBridge RAG Career Assistant. Ask me anything about job skills, career roadmaps, placement policies, or interview preparation.',
    },
  ]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userText = query;
    setQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const result = await fetchApi<RAGAnswerResult>('/rag/chat', {
        method: 'POST',
        body: JSON.stringify({ question: userText }),
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: result.answer,
          sources: result.sources,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'To become a Full Stack Developer, focus on React 19, Next.js App Router, Node.js REST APIs, SQL, and Docker containerization.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full gradient-bg-primary text-white font-medium shadow-2xl shadow-blue-500/40 hover:scale-105 transition-all"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="text-sm">RAG AI Assistant</span>
        </button>
      ) : (
        <div className="w-[380px] sm:w-[420px] h-[520px] glass-panel rounded-3xl border border-gray-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-gray-800 gradient-bg-primary flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Pinecone RAG Assistant</h4>
                <p className="text-[10px] text-blue-100">Grounded Gemini AI Knowledge Engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-800/80 border border-gray-700/60 text-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* Sources Footnote */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-700/50 space-y-1">
                      <p className="text-[10px] font-semibold text-blue-400 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Grounded References ({msg.sources.length}):
                      </p>
                      {msg.sources.map((src, i) => (
                        <div key={i} className="text-[10px] text-gray-400 bg-gray-900/60 p-1.5 rounded border border-gray-800">
                          <span className="font-medium text-gray-300">{src.title}</span> • Score: {src.relevanceScore}%
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-gray-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>Searching vector embeddings & generating answer...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-gray-800 bg-gray-900/80 flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about placement policy, skills, roadmaps..."
              className="flex-1 bg-gray-800 text-gray-200 placeholder-gray-500 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700"
            />
            <button
              onClick={handleSend}
              disabled={loading || !query.trim()}
              className="p-2 rounded-xl gradient-bg-primary text-white disabled:opacity-50 hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
