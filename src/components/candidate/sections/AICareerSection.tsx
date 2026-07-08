/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, FileSearch, RefreshCw, ScrollText, UserCheck, Mic, Sparkles, Milestone, Compass, BookOpen, Send, ArrowLeft, Upload, FileText, CheckCircle2 } from 'lucide-react';

interface AICareerSectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

type AICareerSubView = null | 'chat' | 'analyzer' | 'optimizer' | 'coverletter' | 'prep' | 'mock' | 'salary' | 'roadmap' | 'skills' | 'learning';

export default function AICareerSection({ addToast }: AICareerSectionProps) {
  const [activeSubView, setActiveSubView] = useState<AICareerSubView>(null);

  // AI Chat States
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'ai', text: 'Hello Arjun! I am your AI Career Assistant. I have indexed your designer skill parameter matrix. Ask me anything about layout trends, design system patterns, or portfolio reviews!' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Resume Analyzer States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysedFile, setAnalysedFile] = useState<string | null>(null);

  // Salary Prediction States
  const [yearsExp, setYearsExp] = useState(3);
  const [targetCity, setTargetCity] = useState('Pune');

  // Cover Letter States
  const [companyName, setCompanyName] = useState('Flipkart');
  const [roleTitle, setRoleTitle] = useState('Senior Product Designer');
  const [generatedLetter, setGeneratedLetter] = useState('');

  const gridItems = [
    { id: 'chat', title: 'AI Chat', icon: Bot, desc: 'Answers to your career questions' },
    { id: 'analyzer', title: 'Resume Analyzer', icon: FileSearch, desc: 'Analyze your resume health' },
    { id: 'optimizer', title: 'Resume Optimizer', icon: RefreshCw, desc: 'Improve your resume matches' },
    { id: 'coverletter', title: 'Cover Letter Generator', icon: ScrollText, desc: 'Generate customized letters' },
    { id: 'prep', title: 'Interview Preparation', icon: UserCheck, desc: 'Prepare for key interview rounds' },
    { id: 'mock', title: 'Mock Interview', icon: Mic, desc: 'Practice speaking mock interviews' },
    { id: 'salary', title: 'Salary Prediction', icon: Sparkles, desc: 'Predict target market salaries' },
    { id: 'roadmap', title: 'Career Roadmap', icon: Milestone, desc: 'Plan your long term career path' },
    { id: 'skills', title: 'Skill Recommendation', icon: Compass, desc: 'Discover missing core skills' },
    { id: 'learning', title: 'Learning Recommendation', icon: BookOpen, desc: 'Recommended courses & videos' }
  ];

  // Simulated Chat Responses
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: inputMsg };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "That's an interesting question regarding design systems! Generally, top tech employers (such as Google and Tech Mahindra) seek deep understanding of Figma component properties, design tokens structure, and mobile layout rules. I highly recommend structuring your portfolio around specific problem-solving metrics.";
      
      if (inputMsg.toLowerCase().includes('salary')) {
        replyText = "For a Senior UI/UX Designer role in Pune with 3-5 years of experience, the average market pay ranges from 15 LPA to 25 LPA. Candidates with verified React/Tailwind/Framer Motion knowledge easily command a premium of 20%+ above baseline.";
      } else if (inputMsg.toLowerCase().includes('resume')) {
        replyText = "Your primary resume currently scores 85%. To maximize shortlisting ratios, I recommend listing exact project outcomes, e.g., 'Reduced layout bounce rates by 18% through refactoring design tokens and spacing systems'.";
      }

      setChatMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: replyText }]);
    }, 1500);
  };

  // Simulate File Upload & Audit
  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalysedFile(file.name);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      addToast('Resume analysis complete! Audit score refreshed.', 'success');
    }, 2500);
  };

  // Predict Salary Calculation
  const calculatePredictedSalary = () => {
    let base = 8; // base LPA
    base += yearsExp * 3; // +3 LPA per year
    if (targetCity === 'Bangalore') base += 4;
    if (targetCity === 'Mumbai') base += 3;
    if (targetCity === 'Hyderabad') base += 2.5;
    return base;
  };

  // Generate letter
  const handleGenerateLetter = () => {
    setGeneratedLetter(`Dear Hiring Manager,

I am writing to express my eager interest in the ${roleTitle} position at ${companyName}. As a verified UI/UX Designer with over 3 years of hands-on experience designing design systems, complex layouts, and responsive dashboards, I am fully equipped to drive user-centered value for your product teams.

At my previous role with Flipkart, I collaborated on implementing visual design tokens that streamlined developer handoffs by 30%. I look forward to bringing this exact design-ops proficiency to the team at ${companyName}.

Sincerely,
Arjun Mehta`);
    addToast('Cover letter generated successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence mode="wait">
        {!activeSubView ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div>
              <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                AI Career Assistant
              </h2>
              <p className="text-xs text-text-secondary-theme">Your intelligent recruitment and career guide</p>
            </div>

            {/* 10-item Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {gridItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSubView(item.id as AICareerSubView)}
                    className="p-4 bg-surface-theme border border-border-theme hover:border-primary-theme rounded-2xl text-left group transition-all cursor-pointer flex flex-col justify-between min-h-[125px]"
                  >
                    <div className="p-2 bg-primary-theme/5 text-primary-theme rounded-xl inline-block group-hover:bg-primary-theme group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="mt-3">
                      <h3 className="text-xs font-bold text-text-primary-theme group-hover:text-primary-theme transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-text-muted-theme font-semibold mt-0.5 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="panel" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl mx-auto">
            
            {/* Header with Back button */}
            <div className="flex items-center gap-3 pb-4 border-b border-border-theme/40">
              <button onClick={() => setActiveSubView(null)} className="p-2 hover:bg-border-theme/40 text-text-secondary-theme rounded-lg transition-all cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">
                  {gridItems.find(i => i.id === activeSubView)?.title}
                </h3>
                <p className="text-[10px] text-text-muted-theme">Powered by Google Gemini matching intelligence</p>
              </div>
            </div>

            {/* AI Chat Interaction */}
            {activeSubView === 'chat' && (
              <div className="flex flex-col h-[400px] justify-between">
                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none text-xs">
                  {chatMessages.map(msg => {
                    const isAi = msg.sender === 'ai';
                    return (
                      <div key={msg.id} className={`flex gap-2.5 items-start max-w-[85%] ${!isAi ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${isAi ? 'bg-primary-theme text-white' : 'bg-amber-500 text-white'}`}>
                          {isAi ? 'A' : 'U'}
                        </div>
                        <div className={`p-3 rounded-2xl leading-relaxed text-text-secondary-theme ${isAi ? 'bg-border-theme/40 rounded-tl-none' : 'bg-primary-theme text-white rounded-tr-none'}`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="flex gap-2.5 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-theme text-white flex items-center justify-center font-bold text-[10px] animate-pulse">A</div>
                      <div className="bg-border-theme/30 px-3 py-2 rounded-full text-[10px] font-bold text-text-muted-theme animate-pulse">AI is compiling answer...</div>
                    </div>
                  )}
                </div>

                {/* Send Composer */}
                <form onSubmit={handleSendChat} className="border-t border-border-theme/40 pt-4 mt-4 flex gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={e => setInputMsg(e.target.value)}
                    placeholder="Ask about design interviews, salaries, resume enhancements..."
                    className="flex-1 bg-transparent border border-border-theme rounded-xl px-4 py-2.5 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-semibold"
                  />
                  <button type="submit" className="bg-primary-theme hover:bg-primary-hover-theme text-white p-2.5 rounded-xl transition-all cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Resume Analyzer */}
            {activeSubView === 'analyzer' && (
              <div className="space-y-6 text-xs font-semibold">
                <div className="p-5 border border-dashed border-border-theme rounded-2xl text-center space-y-4">
                  <Upload className="w-8 h-8 text-text-muted-theme mx-auto" />
                  <div>
                    <h4 className="text-xs font-bold text-text-primary-theme">Drop your updated resume PDF here</h4>
                    <p className="text-[10px] text-text-muted-theme leading-normal mt-1">We will score it against active Senior Designer job description tokens instantly.</p>
                  </div>
                  
                  <div className="relative">
                    <input type="file" id="resume-input" className="hidden" accept=".pdf" onChange={handleSimulateUpload} />
                    <label htmlFor="resume-input" className="px-4 py-2 bg-primary-theme text-white text-[11px] font-bold rounded-xl cursor-pointer inline-block">
                      Select File
                    </label>
                  </div>
                </div>

                {/* Results block */}
                {analysedFile && (
                  <div className="p-5 border border-border-theme rounded-2xl bg-bg-theme/40 space-y-4">
                    {isAnalyzing ? (
                      <div className="text-center space-y-2 py-4">
                        <RefreshCw className="w-6 h-6 text-primary-theme animate-spin mx-auto" />
                        <p className="text-[10px] text-text-secondary-theme">Matching visual elements, hierarchy tokens, and keyword densities...</p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center border-b border-border-theme/40 pb-2.5">
                          <div>
                            <div className="font-bold text-text-primary-theme text-xs">{analysedFile}</div>
                            <span className="text-[9px] text-text-muted-theme font-bold">PDF Format</span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-primary-theme font-serif">88<span className="text-xs text-text-muted-theme">/100</span></span>
                            <div className="text-[9px] text-success-theme font-bold font-mono">EXCELLENT MATCH RATE</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Suggested Enhancements</h4>
                          <div className="space-y-2 text-text-secondary-theme text-[11px] leading-relaxed">
                            <div className="flex gap-2 items-start">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success-theme flex-shrink-0 mt-0.5" />
                              <span>Core Figma, typography, and spacing system keywords are well highlighted.</span>
                            </div>
                            <div className="flex gap-2 items-start">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span>Consider expanding the bullet details for "Framer Motion" interaction outcomes.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Salary Prediction */}
            {activeSubView === 'salary' && (
              <div className="space-y-6 text-xs font-semibold">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-text-secondary-theme">Years of Relevant Experience</label>
                      <span className="text-primary-theme font-mono font-bold">{yearsExp} Years</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={yearsExp}
                      onChange={e => setYearsExp(Number(e.target.value))}
                      className="w-full accent-primary-theme"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-text-secondary-theme">Target Employment City</label>
                    <select
                      value={targetCity}
                      onChange={e => setTargetCity(e.target.value)}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme"
                    >
                      <option value="Pune">Pune</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-primary-theme/10 to-amber-500/5 border border-primary-theme/10 rounded-2xl text-center space-y-2">
                  <h4 className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Estimated Salary Range (LPA)</h4>
                  <div className="text-3xl font-black font-serif text-primary-theme">
                    {calculatePredictedSalary() - 2} - {calculatePredictedSalary() + 3} LPA
                  </div>
                  <p className="text-[10px] text-text-muted-theme">
                    Based on real verified Tech Mahindra and Flipkart designer job packages.
                  </p>
                </div>
              </div>
            )}

            {/* Cover Letter Generator */}
            {activeSubView === 'coverletter' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-text-secondary-theme">Target Company</label>
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-text-secondary-theme">Target Role</label>
                    <input type="text" value={roleTitle} onChange={e => setRoleTitle(e.target.value)} className="w-full bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme focus:outline-none" />
                  </div>
                </div>

                <button onClick={handleGenerateLetter} className="w-full py-2.5 bg-primary-theme text-white text-xs font-bold rounded-xl cursor-pointer">
                  Generate Customizable Pitch
                </button>

                {generatedLetter && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Generated Letter Draft</h4>
                    <textarea readOnly rows={10} className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-secondary-theme focus:outline-none resize-none font-medium leading-relaxed" value={generatedLetter} />
                  </div>
                )}
              </div>
            )}

            {/* Simpler static subviews */}
            {activeSubView !== 'chat' && activeSubView !== 'analyzer' && activeSubView !== 'salary' && activeSubView !== 'coverletter' && (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-text-secondary-theme font-medium">Standard structural recommendation loaded based on Arjun Mehta's background.</p>
                <button onClick={() => addToast('Insight parameters dispatched!', 'info')} className="px-5 py-2 bg-primary-theme text-white text-xs font-bold rounded-xl cursor-pointer">
                  Dispatched Insight
                </button>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
