/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, Award, MessageSquare, ListCollapse, 
  HelpCircle, ChevronRight, Bot, Target, PlayCircle, RefreshCw, Send
} from 'lucide-react';

interface EmpAiSectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function EmpAiSection({ addToast }: EmpAiSectionProps) {
  const [activeSubView, setActiveSubView] = useState<'recommended' | 'ranking' | 'summaries' | 'assistant'>('recommended');
  
  // Interactive mock helper for generating questions
  const [activeQuestionCategory, setActiveQuestionCategory] = useState<'role' | 'technical' | 'behavioral' | 'mock'>('role');
  
  // Simulated candidate selected for summarization
  const [selectedSummaryCand, setSelectedSummaryCand] = useState('Riya Sharma');

  // Copilot chat mock state
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', text: 'Hi! I am your TechnoAdviser AI Copilot. Ask me to formulate custom coding challenges, design questions, or behavioral role scenarios!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const recommendedCands = [
    { name: 'Riya Sharma', match: '95%', role: 'Senior UX/UI Designer', exp: '4+ Years', location: 'Bangalore, India', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
    { name: 'Rohan Mehta', match: '95%', role: 'UI/UX Lead', exp: '4.5 Years', location: 'Mumbai, India', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
    { name: 'Karan Malhotra', match: '92%', role: 'Product Architect', exp: '3.5 Years', location: 'Pune, India', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80' },
    { name: 'Sneha Kapoor', match: '90%', role: 'Figma Systems Lead', exp: '3 Years', location: 'Bangalore, India', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
  ];

  const resumeRankings = [
    { rank: 1, name: 'Riya Sharma', score: '96%', tags: ['Figma Expert', 'SaaS Wireframes', 'Design Tokens'] },
    { rank: 2, name: 'Rohan Mehta', score: '94%', tags: ['Lead Systems', 'Qualitative Research', 'HTML/CSS'] },
    { rank: 3, name: 'Karan Malhotra', score: '92%', tags: ['Product Strategy', 'Figma Prototyping', 'Interviews'] },
    { rank: 4, name: 'Priya Singh', score: '90%', tags: ['User Testing', 'UX Systems', 'A/B Testing'] },
    { rank: 5, name: 'Vikram Patel', score: '88%', tags: ['Visual Design', 'Branding Design', 'Figma'] },
  ];

  const candidateSummaries: Record<string, { summary: string; strengths: string[]; fit: string }> = {
    'Riya Sharma': {
      summary: 'Riya has 4+ years of experience in UI/UX design. Strong in Figma, user research & prototyping. She has worked on e-commerce and SaaS products with excellent communication and problem-solving skills.',
      strengths: ['UI Design Systems', 'User Research', 'Figma Prototyping'],
      fit: '95% Match Ratio - UI/UX Designer, Product Designer'
    },
    'Rohan Mehta': {
      summary: 'Rohan brings 4.5+ years of design experience. Specializes in wireframing complex data architectures and conducting qualitative feedback sessions. Strong team player.',
      strengths: ['Enterprise SaaS UX', 'System Architecture Design', 'Quantitative Testing'],
      fit: '94% Match Ratio - Lead UI Designer, Senior Architect'
    },
  };

  const handleSendCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatLog([...chatLog, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const reply = { sender: 'ai', text: `Generated customized scenario metrics regarding "${chatInput}". Best practice suggests starting with direct coding execution, then querying the user about design trade-offs.` };
      setChatLog(prev => [...prev, reply]);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header Group Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-theme pb-5">
        <div>
          <h1 className="text-xl font-black text-text-primary-theme flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-theme fill-primary-theme" />
            <span>AI Sourcing Suite</span>
          </h1>
          <p className="text-xs text-text-secondary-theme font-semibold">
            Evaluate applicants using automated semantic matching, resume grading, and interactive copilots.
          </p>
        </div>

        <div className="flex bg-surface-theme border border-border-theme p-1 rounded-xl shadow-inner">
          {[
            { id: 'recommended', label: 'Recommended Candidates' },
            { id: 'ranking', label: 'Resume Ranking' },
            { id: 'summaries', label: 'Candidate Summary' },
            { id: 'assistant', label: 'Interview Assistant' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubView(tab.id as any)}
              className={`px-3 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeSubView === tab.id 
                  ? 'bg-primary-theme text-white shadow-sm' 
                  : 'text-text-secondary-theme hover:text-text-primary-theme hover:bg-border-theme/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBVIEW 1: RECOMMENDED CANDIDATES */}
      {activeSubView === 'recommended' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {recommendedCands.map((cand) => (
            <div key={cand.name} className="bg-surface-theme border border-border-theme rounded-2xl p-5 space-y-4 hover:border-primary-theme/30 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <img src={cand.avatar} alt={cand.name} className="w-10 h-10 rounded-full object-cover border border-border-theme" />
                  <span className="text-xs font-black font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded-full">
                    {cand.match} Match
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-black text-text-primary-theme">{cand.name}</h3>
                  <p className="text-[10px] text-text-muted-theme font-bold">{cand.role}</p>
                </div>
                <div className="text-[10px] text-text-secondary-theme space-y-0.5 font-bold">
                  <div>Experience: {cand.exp}</div>
                  <div>Location: {cand.location}</div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedSummaryCand(cand.name);
                  setActiveSubView('summaries');
                }}
                className="w-full text-center py-2 bg-border-theme/40 hover:bg-primary-theme hover:text-white text-text-primary-theme text-xs font-black rounded-xl transition-all cursor-pointer mt-4"
              >
                AI Profile Summary
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SUBVIEW 2: RESUME RANKING */}
      {activeSubView === 'ranking' && (
        <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl">
          <div className="border-b border-border-theme/60 pb-3">
            <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">AI Resume Ranking</h2>
            <p className="text-[10px] text-text-secondary-theme font-semibold">Ordered list of ranked resumes parsed directly against core requirements.</p>
          </div>

          <div className="space-y-3.5">
            {resumeRankings.map((rankItem) => (
              <div key={rankItem.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-border-theme/20 border border-border-theme/40 hover:border-primary-theme/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-theme text-white flex items-center justify-center font-black font-mono text-sm shadow-sm">
                    {rankItem.rank}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-primary-theme">{rankItem.name}</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rankItem.tags.map((tg) => (
                        <span key={tg} className="bg-border-theme/40 text-text-secondary-theme text-[9px] font-bold px-2 py-0.5 rounded">
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <span className="text-sm font-black font-mono text-primary-theme bg-primary-theme/5 px-2.5 py-1 rounded-full">{rankItem.score} Ratio</span>
                  <button 
                    onClick={() => addToast(`Shortlisted ${rankItem.name} for final interviews!`, 'success')}
                    className="px-3.5 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-[10px] font-black rounded-lg cursor-pointer"
                  >
                    Select Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBVIEW 3: AI CANDIDATE SUMMARY */}
      {activeSubView === 'summaries' && (
        <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl">
          <div className="flex justify-between items-center pb-4 border-b border-border-theme/60">
            <div>
              <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">AI Profile Summaries</h2>
              <p className="text-[10px] text-text-secondary-theme font-semibold">Generative evaluation reports mapping core career histories.</p>
            </div>
            
            <select 
              value={selectedSummaryCand} 
              onChange={(e) => setSelectedSummaryCand(e.target.value)}
              className="bg-border-theme/40 text-text-primary-theme border border-border-theme/50 px-3.5 py-2 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option>Riya Sharma</option>
              <option>Rohan Mehta</option>
            </select>
          </div>

          {candidateSummaries[selectedSummaryCand] ? (
            <div className="space-y-6">
              
              {/* Summary Block */}
              <div className="space-y-2 bg-primary-theme/5 border border-primary-theme/10 p-5 rounded-2xl relative">
                <h3 className="text-xs font-black text-text-primary-theme flex items-center gap-1.5 uppercase tracking-wider">
                  <Bot className="w-4 h-4 text-primary-theme" />
                  <span>AI Summary Evaluation Report</span>
                </h3>
                <p className="text-xs text-text-secondary-theme leading-relaxed font-medium">
                  {candidateSummaries[selectedSummaryCand].summary}
                </p>
              </div>

              {/* Strengths & Fit details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-3.5">
                  <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Key Strengths</h4>
                  <div className="space-y-2 pl-1">
                    {candidateSummaries[selectedSummaryCand].strengths.map((st) => (
                      <div key={st} className="flex items-center gap-2 text-xs text-text-secondary-theme font-semibold">
                        <Target className="w-4 h-4 text-emerald-500" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Best Fit For</h4>
                  <div className="bg-emerald-500/10 border border-emerald-500/15 p-4 rounded-2xl">
                    <span className="text-xs font-black text-emerald-500 block">Excellent Recommendation</span>
                    <p className="text-[10px] text-text-secondary-theme font-bold leading-relaxed pt-1">
                      Ideal for: {candidateSummaries[selectedSummaryCand].fit}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-text-muted-theme">
              No summary report loaded for this profile.
            </div>
          )}
        </div>
      )}

      {/* SUBVIEW 4: AI INTERVIEW ASSISTANT */}
      {activeSubView === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
          
          {/* Left Column: Copilot Generator Form */}
          <div className="lg:col-span-8 bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border-theme/40 mb-4">
                <div>
                  <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-primary-theme" />
                    <span>AI Copilot Coding/Interview Assist</span>
                  </h3>
                  <p className="text-[10px] text-text-muted-theme font-bold">Formulate questions, code scenarios, and evaluation metrics dynamically.</p>
                </div>
              </div>

              {/* Chat Log Window */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 pr-1">
                {chatLog.map((log, idx) => (
                  <div key={idx} className={`flex ${log.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                      log.sender === 'ai' 
                        ? 'bg-border-theme/40 text-text-secondary-theme' 
                        : 'bg-primary-theme text-white shadow-sm'
                    }`}>
                      {log.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input form */}
            <form onSubmit={handleSendCopilot} className="flex gap-2 border-t border-border-theme/40 pt-4">
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="Ask AI to: 'Create 3 React design token questions'..."
                className="flex-1 bg-transparent border border-border-theme rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme placeholder-text-muted-theme"
              />
              <button 
                type="submit"
                className="bg-primary-theme hover:bg-primary-hover-theme text-white p-2.5 rounded-xl cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

          {/* Right Column: Pre-configured assistant question sets */}
          <div className="lg:col-span-4 bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider mb-4">Preset Sourcing Prompts</h3>
              
              <div className="space-y-3.5">
                {[
                  { id: 'role', label: 'Role-based Questions', desc: 'Queries tailored strictly for UI/UX positions.' },
                  { id: 'technical', label: 'Technical Questions', desc: 'Interactive coding and framework queries.' },
                  { id: 'behavioral', label: 'Behavioral Questions', desc: 'Conflict resolution and management prompts.' },
                  { id: 'mock', label: 'Mock Interview Prep', desc: 'Ready-to-use scenario parameters.' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveQuestionCategory(item.id as any);
                      addToast(`Prompt loaded for category: ${item.label}`, 'info');
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex items-start gap-2.5 cursor-pointer ${
                      activeQuestionCategory === item.id 
                        ? 'bg-primary-theme/10 border-primary-theme/30 text-primary-theme' 
                        : 'border-border-theme/50 hover:bg-border-theme/20 text-text-secondary-theme'
                    }`}
                  >
                    <Target className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block">{item.label}</span>
                      <span className="text-[10px] text-text-muted-theme leading-relaxed mt-0.5 block">{item.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary-theme/5 border border-primary-theme/10 p-4 rounded-2xl mt-6">
              <span className="text-[10px] font-black text-primary-theme uppercase tracking-wider block">Copilot Tip</span>
              <p className="text-[9px] text-text-secondary-theme leading-relaxed pt-1">
                You can combine presets with customized queries to generate comprehensive developer questionnaires.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
