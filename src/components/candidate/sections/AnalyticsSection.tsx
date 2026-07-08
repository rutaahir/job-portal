/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Sparkles } from 'lucide-react';

export default function AnalyticsSection() {
  const statsList = [
    { label: 'Profile Views', val: '156', diff: '+12%', color: 'text-success-theme' },
    { label: 'Applications', val: '24', diff: '+8%', color: 'text-success-theme' },
    { label: 'Interview Calls', val: '6', diff: '+20%', color: 'text-success-theme' },
    { label: 'Offers', val: '2', diff: '+100%', color: 'text-success-theme' }
  ];

  // SVG Line Chart coordinates for Profile Views over time
  // Days of week: Mon to Sun. High fidelity graph path
  const linePoints = "10,75 35,62 60,80 85,50 110,35 135,55 160,20";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
          Career Analytics
        </h2>
        <p className="text-xs text-text-secondary-theme font-medium">Track your personal profile visibility and pipeline trends</p>
      </div>

      {/* Grid numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsList.map((stat, i) => (
          <div key={i} className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm space-y-1">
            <div className="text-[10px] text-text-muted-theme font-bold uppercase tracking-wider">{stat.label}</div>
            <div className="text-2xl font-serif font-black text-text-primary-theme">{stat.val}</div>
            <div className={`text-[9px] font-bold font-mono ${stat.color}`}>{stat.diff} this week</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* Profile Views Over Time SVG Line Graph (7 cols) */}
        <div className="lg:col-span-7 bg-surface-theme border border-border-theme rounded-3xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Profile Views Over Time</h3>
            <p className="text-[10px] text-text-muted-theme font-semibold leading-normal">Visualizing matching recruiter view metrics</p>
          </div>

          <div className="w-full h-44 relative flex items-end">
            {/* SVG graph container */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 170 100" preserveAspectRatio="none">
              {/* Grids */}
              <line x1="0" y1="20" x2="170" y2="20" stroke="var(--color-border-theme, #e2e8f0)" strokeWidth="0.25" strokeDasharray="2" />
              <line x1="0" y1="50" x2="170" y2="50" stroke="var(--color-border-theme, #e2e8f0)" strokeWidth="0.25" strokeDasharray="2" />
              <line x1="0" y1="80" x2="170" y2="80" stroke="var(--color-border-theme, #e2e8f0)" strokeWidth="0.25" strokeDasharray="2" />

              {/* Area Under Curve */}
              <path
                d={`M 10,100 L ${linePoints} L 160,100 Z`}
                fill="url(#views-gradient)"
                opacity="0.15"
                className="transition-all duration-1000"
              />

              {/* Animated Path */}
              <motion.path
                d={`M ${linePoints}`}
                fill="none"
                stroke="var(--color-primary-theme, #4f46e5)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              {/* Data dots */}
              {[
                { x: 10, y: 75 }, { x: 35, y: 62 }, { x: 60, y: 80 }, { x: 85, y: 50 },
                { x: 110, y: 35 }, { x: 135, y: 55 }, { x: 160, y: 20 }
              ].map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="2.5"
                  className="fill-primary-theme stroke-surface-theme"
                  strokeWidth="1"
                />
              ))}

              {/* Gradient definitions */}
              <defs>
                <linearGradient id="views-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary-theme, #4f46e5)" />
                  <stop offset="100%" stopColor="var(--color-primary-theme, #4f46e5)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex justify-between text-[9px] font-mono text-text-muted-theme uppercase tracking-wider px-2 font-bold">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Top Job Categories Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-surface-theme border border-border-theme rounded-3xl p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Top Job Categories</h3>
            <p className="text-[10px] text-text-muted-theme font-semibold leading-normal font-sans">Corporate recruiter demand ratio breakdown</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-border-theme, #e2e8f0)" strokeWidth="11" />
                {/* Design 45% */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4f46e5" strokeWidth="11"
                  strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.45)}`} />
                {/* Dev 30% */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="11"
                  strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.30)}`}
                  transform="rotate(162 50 50)" />
                {/* Product 15% */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="11"
                  strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.15)}`}
                  transform="rotate(270 50 50)" />
                {/* Marketing 10% */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="11"
                  strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.10)}`}
                  transform="rotate(324 50 50)" />
              </svg>
              <div className="absolute text-center">
                <BarChart3 className="w-4 h-4 text-text-muted-theme mx-auto" />
              </div>
            </div>

            <div className="space-y-2 text-[10px] font-extrabold text-text-secondary-theme flex-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary-theme"></span> Design</div>
                <span className="font-mono text-text-primary-theme">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Dev</div>
                <span className="font-mono text-text-primary-theme">30%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Product</div>
                <span className="font-mono text-text-primary-theme">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Marketing</div>
                <span className="font-mono text-text-primary-theme">10%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
