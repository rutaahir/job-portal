/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, BookOpen, Layers, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

interface SkillTrend {
  name: string;
  demandPct: number;
  growthPct: number;
  premium: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  certs: string[];
}

export default function SkillsExplorerTrends() {
  const [industry, setIndustry] = useState('Software');
  const [activeSkillName, setActiveSkillName] = useState('React');

  // Skill Database
  const skillDb: Record<string, SkillTrend[]> = {
    'Software': [
      {
        name: 'React',
        demandPct: 94,
        growthPct: 14,
        premium: '₹2.4 LPA',
        difficulty: 'Intermediate',
        certs: ['Meta Front-End Developer', 'React Advanced Certificate'],
      },
      {
        name: 'TypeScript',
        demandPct: 88,
        growthPct: 22,
        premium: '₹1.8 LPA',
        difficulty: 'Intermediate',
        certs: ['Microsoft TypeScript Architect', 'W3C JS/TS certified'],
      },
      {
        name: 'AWS DevOps',
        demandPct: 91,
        growthPct: 18,
        premium: '₹3.5 LPA',
        difficulty: 'Expert',
        certs: ['AWS Certified DevOps Engineer', 'HashiCorp Terraform Associate'],
      },
    ],
    'Creative': [
      {
        name: 'Figma',
        demandPct: 92,
        growthPct: 11,
        premium: '₹1.6 LPA',
        difficulty: 'Beginner',
        certs: ['Google UX Design Certificate', 'Figma Certified Professional'],
      },
      {
        name: 'Webflow',
        demandPct: 82,
        growthPct: 25,
        premium: '₹2.2 LPA',
        difficulty: 'Intermediate',
        certs: ['Webflow Experts certification', 'Responsive Web Design'],
      },
    ],
  };

  const currentSkills = skillDb[industry] || skillDb['Software'];
  const activeSkill = currentSkills.find((s) => s.name === activeSkillName) || currentSkills[0];

  return (
    <div className="space-y-8">
      {/* 1. Header selection segment */}
      <div className="bg-surface-theme border border-border-theme rounded-3xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase text-text-primary-theme tracking-wide flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary-theme" />
            Skills Trend Explorer
          </h3>
          <p className="text-[11px] text-text-secondary-theme font-medium mt-0.5">
            Identify hot skills, average compensation premiums, and professional certificates recommended by corporate recruiters.
          </p>
        </div>

        {/* Industry selections */}
        <div className="flex gap-2">
          {['Software', 'Creative'].map((ind) => (
            <button
              key={ind}
              onClick={() => {
                setIndustry(ind);
                // Reset active skill on switch
                const firstSkill = skillDb[ind]?.[0]?.name || 'React';
                setActiveSkillName(firstSkill);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                industry === ind
                  ? 'bg-primary-theme text-white'
                  : 'bg-bg-theme border border-border-theme text-text-secondary-theme hover:border-text-muted-theme'
              }`}
            >
              {ind === 'Software' ? 'Software & IT Sourcing' : 'Creative Design & UX'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Side-by-side core layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Skills Trend Index (5 cols) */}
        <div className="lg:col-span-5 bg-surface-theme border border-border-theme rounded-3xl p-5 shadow-sm space-y-4">
          <h4 className="text-[10px] font-black uppercase text-text-muted-theme tracking-wider border-b border-border-theme pb-2 flex items-center justify-between">
            Trending Skills Index <span>Growth rate</span>
          </h4>

          <div className="space-y-2.5">
            {currentSkills.map((sk) => {
              const isActive = sk.name === activeSkill.name;
              return (
                <div
                  key={sk.name}
                  onClick={() => setActiveSkillName(sk.name)}
                  className={`p-3.5 border rounded-2xl cursor-pointer transition-all flex justify-between items-center ${
                    isActive
                      ? 'bg-primary-theme/5 border-primary-theme'
                      : 'bg-bg-theme border-border-theme/40 hover:border-text-muted-theme'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-black text-text-primary-theme block">{sk.name}</span>
                    <span className="text-[9px] text-text-muted-theme font-bold">Premium: {sk.premium}</span>
                  </div>
                  <div className="text-right">
                    <span className="bg-success-theme/10 text-success-theme border border-success-theme/20 text-[10px] font-mono font-black px-2 py-0.5 rounded-full">
                      +{sk.growthPct}% YoY
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Skill details card panel (7 cols) */}
        <div className="lg:col-span-7 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          {/* Header block details */}
          <div className="flex justify-between items-start gap-4 pb-4 border-b border-border-theme/40">
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-text-primary-theme flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-primary-theme animate-pulse" />
                {activeSkill.name} Insights
              </h4>
              <p className="text-[10px] text-text-secondary-theme font-medium">
                High recruitment priority identified by automated job parsing systems.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-border-theme/40 text-text-secondary-theme text-[10px] font-bold rounded-lg border border-border-theme/10">
              {activeSkill.difficulty} Skill
            </span>
          </div>

          {/* Core Metrics Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-bg-theme border border-border-theme/30 rounded-2xl text-center space-y-1">
              <span className="text-2xl font-black text-text-primary-theme block font-serif">{activeSkill.demandPct}%</span>
              <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider block">Market Demand</span>
            </div>

            <div className="p-4 bg-bg-theme border border-border-theme/30 rounded-2xl text-center space-y-1">
              <span className="text-2xl font-black text-text-primary-theme block font-serif">+{activeSkill.growthPct}%</span>
              <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider block">Annual Growth</span>
            </div>

            <div className="p-4 bg-bg-theme border border-border-theme/30 rounded-2xl text-center space-y-1">
              <span className="text-2xl font-black text-text-primary-theme block font-serif">{activeSkill.premium}</span>
              <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider block">Salary Premium</span>
            </div>
          </div>

          {/* Recommended Certifications list */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-black uppercase text-text-secondary-theme tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-primary-theme" /> Recommended Certifications
            </h5>
            <div className="space-y-2.5">
              {activeSkill.certs.map((cert) => (
                <div key={cert} className="flex items-center gap-3 p-3 bg-bg-theme border border-border-theme/30 rounded-xl text-xs font-semibold text-text-secondary-theme">
                  <div className="w-5 h-5 rounded-full bg-success-theme/10 text-success-theme flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
