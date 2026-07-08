/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, LineChart, ShieldCheck, Check } from 'lucide-react';

interface WhyTechnoAdviserProps {
  onNavigateToPage: (page: string) => void;
}

export default function WhyTechnoAdviser({ onNavigateToPage }: WhyTechnoAdviserProps) {
  const points = [
    {
      title: 'AI-Powered Matching',
      desc: 'Advanced algorithms match your skills with the perfect opportunities, bypassing manual screening biases.',
      icon: Sparkles,
    },
    {
      title: 'Trusted by Top Companies',
      desc: 'Partnered with 5,200+ verified companies across the globe, from early-stage startups to Fortune 500 giants.',
      icon: Trophy,
    },
    {
      title: 'Career Growth Focused',
      desc: 'Tools and resources that help you learn, grow, and advance, identifying skill gaps dynamically.',
      icon: LineChart,
    },
    {
      title: 'Secure & Reliable',
      desc: 'Your data is safe with enterprise-grade security and privacy, including detailed GDPR console dashboards.',
      icon: ShieldCheck,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold text-primary-theme font-mono uppercase tracking-widest">
            Why TechnoAdviser
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-text-primary-theme leading-tight">
            The Smarter Way <br />
            to Build Your <span className="text-primary-theme">Career</span>
          </h1>
          <p className="text-text-secondary-theme font-normal text-sm sm:text-base leading-relaxed max-w-xl">
            We combine cutting-edge AI technology with deep industry expertise to connect the right talent with the right opportunities. Faster. Smarter. Better. We ensure candidates never face dead-ends or unvetted recruiters.
          </p>

          <div className="space-y-4 pt-2">
            {[
              'Direct-to-Hiring-Manager messages with high priority',
              'Detailed skill matching with real-time feedback scores',
              'Advanced filters for location, salary, remote/hybrid preference',
            ].map((text) => (
              <div key={text} className="flex items-start gap-3">
                <div className="p-1 bg-success-theme/10 rounded-full text-success-theme mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs sm:text-sm text-text-secondary-theme font-medium">{text}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigateToPage('Candidate Registration')}
              className="px-8 py-3.5 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl font-bold text-sm transition-colors shadow-md"
            >
              Get Started Now
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-[32px] overflow-hidden border border-border-theme shadow-2xl bg-border-theme">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80"
              alt="Hiring discussion"
              className="w-full h-full object-cover"
            />
            {/* Overlay badge with 92% Match */}
            <div className="absolute top-[20%] left-[-20px] bg-surface-theme border border-border-theme rounded-2xl p-4 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-theme/15 flex items-center justify-center font-extrabold text-primary-theme text-xs">
                92%
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-text-muted-theme">Deep Match</div>
                <div className="text-xs font-bold text-text-primary-theme">Excellent Match Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {points.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="bg-surface-theme border border-border-theme p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="p-3 bg-primary-theme/5 text-primary-theme rounded-xl w-fit">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary-theme">{p.title}</h3>
              <p className="text-xs text-text-secondary-theme leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
