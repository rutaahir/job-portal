/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, Scale, Shield, Check, MessageSquare, Send } from 'lucide-react';

interface AIRecruitmentProps {
  onNavigateToPage: (page: string) => void;
}

export default function AIRecruitment({ onNavigateToPage }: AIRecruitmentProps) {
  const recruitmentFeatures = [
    {
      title: 'AI Candidate Matching',
      desc: 'Matches candidates based on skills, experience, and core organization culture fit directly.',
      icon: Sparkles,
    },
    {
      title: 'Smart Ranking',
      desc: 'Ranks candidates based on multi-dimensional job fit score, past projects, and profile credentials.',
      icon: Brain,
    },
    {
      title: 'Bias-Free Sourcing',
      desc: 'Predicts candidates success and career retention parameters fairly without structural biases.',
      icon: Scale,
    },
    {
      title: 'Automated Communication',
      desc: 'Smart notifications and AI-assisted screening templates save hours of recruiter team efforts.',
      icon: MessageSquare,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold text-primary-theme font-mono uppercase tracking-widest">
            AI Recruitment
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-text-primary-theme leading-tight">
            AI-Powered Hiring <br />for the <span className="text-primary-theme">Future</span>
          </h1>
          <p className="text-text-secondary-theme font-normal text-sm sm:text-base leading-relaxed">
            Our advanced AI technology simplifies corporate hiring. It analyzes semantic patterns within thousands of resumes in seconds, calculating deep matching scores and shortlisting qualified candidates with high-fidelity accuracy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Semantic Resume Parser',
              'Automated Skill Validation',
              'AI Assessment Constructor',
              'Predictive Retention Metrics',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5">
                <div className="p-1 bg-primary-theme/10 rounded-full text-primary-theme">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm text-text-secondary-theme font-semibold">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigateToPage('Employer Registration')}
              className="px-6 py-3.5 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl font-bold text-sm transition-colors shadow-md flex items-center gap-2"
            >
              Get Started <Send className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateToPage('Pricing')}
              className="px-6 py-3.5 bg-surface-theme hover:bg-border-theme text-text-primary-theme border border-border-theme rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              View Employer Plans
            </button>
          </div>
        </div>

        {/* Right column: Graphic Representation of the AI Chat and Assessment board */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div className="relative w-full max-w-[440px] bg-surface-theme border border-border-theme p-6 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border-theme pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-theme/10 flex items-center justify-center text-primary-theme">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-text-primary-theme">AI Hiring Co-Pilot</h4>
                  <div className="text-[10px] text-success-theme font-bold flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-theme animate-pulse" />
                    ONLINE & ANALYZING
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Chat Interface */}
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              <div className="flex gap-2.5 items-start max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-primary-theme flex items-center justify-center text-[10px] text-white font-serif">T</div>
                <div className="bg-border-theme/30 p-3 rounded-2xl rounded-tl-none text-xs text-text-secondary-theme leading-relaxed">
                  Analyzing candidate database for <strong className="text-text-primary-theme">UX/UI Designer</strong> in Bengaluru...
                </div>
              </div>

              <div className="flex gap-2.5 items-start max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-primary-theme flex items-center justify-center text-[10px] text-white font-serif">T</div>
                <div className="bg-border-theme/30 p-3 rounded-2xl rounded-tl-none text-xs text-text-secondary-theme space-y-2">
                  <div>Found <strong className="text-text-primary-theme">3 high-match candidates</strong>:</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between bg-surface-theme border border-border-theme p-1.5 rounded-lg text-[11px]">
                      <span>Sneha Iyer</span>
                      <span className="text-primary-theme font-bold">94% Match</span>
                    </div>
                    <div className="flex items-center justify-between bg-surface-theme border border-border-theme p-1.5 rounded-lg text-[11px]">
                      <span>Arjun Mehta</span>
                      <span className="text-primary-theme font-bold">92% Match</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-theme/5 p-4 rounded-2xl border border-primary-theme/10 flex items-center justify-between text-xs font-semibold text-primary-theme">
              <span>Deep matching completed in 0.42s</span>
              <span className="font-mono text-[10px] tracking-wider bg-primary-theme/10 px-2 py-0.5 rounded">V2.4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 4 features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {recruitmentFeatures.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="bg-surface-theme border border-border-theme p-6 rounded-2xl shadow-sm space-y-3"
            >
              <div className="p-3 bg-primary-theme/5 text-primary-theme rounded-xl w-fit">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-text-primary-theme">{f.title}</h3>
              <p className="text-xs text-text-secondary-theme leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
