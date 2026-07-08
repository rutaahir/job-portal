/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, BarChart3, TrendingUp, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SalaryData {
  avg: string;
  min: string;
  max: string;
  trend: number[];
  change: string;
  cities: { name: string; val: string }[];
}

export default function SalaryExplorerCharts() {
  const [role, setRole] = useState('Software Engineer');
  const [exp, setExp] = useState('3-6 Years');
  const [location, setLocation] = useState('India');

  // Database of dynamic salary mappings
  const salaryDb: Record<string, Record<string, SalaryData>> = {
    'Software Engineer': {
      'India': {
        avg: '₹12.5 LPA',
        min: '8.5 LPA',
        max: '18.5 LPA',
        change: '+8%',
        trend: [8.5, 9.2, 10.5, 11.8, 12.5],
        cities: [
          { name: 'Bangalore', val: '₹14.8 LPA' },
          { name: 'Hyderabad', val: '₹13.2 LPA' },
          { name: 'Gurgaon', val: '₹13.6 LPA' },
          { name: 'Mumbai', val: '₹12.9 LPA' },
          { name: 'Pune', val: '₹12.1 LPA' },
        ],
      },
      'USA': {
        avg: '$115,000',
        min: '$85,000',
        max: '$155,000',
        change: '+5%',
        trend: [95000, 100000, 108000, 112000, 115000],
        cities: [
          { name: 'San Francisco', val: '$145,000' },
          { name: 'New York', val: '$135,000' },
          { name: 'Seattle', val: '$132,000' },
          { name: 'Boston', val: '$120,000' },
          { name: 'Austin', val: '$118,000' },
        ],
      },
    },
    'Product Designer': {
      'India': {
        avg: '₹15.0 LPA',
        min: '10.0 LPA',
        max: '22.0 LPA',
        change: '+12%',
        trend: [10.0, 11.5, 13.0, 14.2, 15.0],
        cities: [
          { name: 'Bangalore', val: '₹17.5 LPA' },
          { name: 'Mumbai', val: '₹16.0 LPA' },
          { name: 'Gurgaon', val: '₹15.5 LPA' },
          { name: 'Pune', val: '₹14.2 LPA' },
          { name: 'Hyderabad', val: '₹13.8 LPA' },
        ],
      },
      'USA': {
        avg: '$125,000',
        min: '$90,000',
        max: '$170,000',
        change: '+6%',
        trend: [100000, 108000, 115000, 120000, 125000],
        cities: [
          { name: 'San Francisco', val: '$155,000' },
          { name: 'New York', val: '$140,000' },
          { name: 'Seattle', val: '$135,000' },
          { name: 'Los Angeles', val: '$128,000' },
          { name: 'Austin', val: '$122,000' },
        ],
      },
    },
  };

  // Safe fallback resolver
  const getSalaryDetails = (): SalaryData => {
    const roleKey = salaryDb[role] ? role : 'Software Engineer';
    const locKey = salaryDb[roleKey][location] ? location : 'India';
    return salaryDb[roleKey][locKey];
  };

  const details = getSalaryDetails();

  // Helper to map values to SVG coordinates
  const points = details.trend
    .map((val, idx) => {
      const minVal = Math.min(...details.trend);
      const maxVal = Math.max(...details.trend);
      const x = (idx / (details.trend.length - 1)) * 100;
      const range = maxVal - minVal || 1;
      const y = 80 - ((val - minVal) / range) * 60; // scale between 20 and 80 y coordinate
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-8">
      {/* 1. Dynamic Dropdowns Selector Panel */}
      <div className="bg-surface-theme border border-border-theme rounded-3xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase text-text-primary-theme tracking-wide flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary-theme" />
            Salary Benchmarking Explorer
          </h3>
          <p className="text-[11px] text-text-secondary-theme font-medium mt-0.5">
            Compare dynamic salary bands, annual growth coefficients, and geographical compensation across top tech hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-text-secondary-theme">Job Designation</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-bg-theme border border-border-theme rounded-xl px-3 py-2.5 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-bold cursor-pointer"
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="Product Designer">Product Designer</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-text-secondary-theme">Experience Range</label>
            <select
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              className="w-full bg-bg-theme border border-border-theme rounded-xl px-3 py-2.5 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-bold cursor-pointer"
            >
              <option value="1-2 Years">1-2 Years (Entry)</option>
              <option value="3-6 Years">3-6 Years (Mid)</option>
              <option value="7-10 Years">7-10 Years (Senior)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-text-secondary-theme">Geographical Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-bg-theme border border-border-theme rounded-xl px-3 py-2.5 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-bold cursor-pointer"
            >
              <option value="India">India (LPA)</option>
              <option value="USA">United States (USD)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl text-xs font-black shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              Benchmark Explore <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Average Salary Trend Card (5 cols) */}
        <div className="lg:col-span-5 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-text-muted-theme tracking-wider">Estimated Average Salary</span>
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-text-primary-theme leading-none">{details.avg}</h2>
              <span className="bg-success-theme/10 text-success-theme border border-success-theme/20 text-[10px] font-black font-mono px-2 py-0.5 rounded-full">
                {details.change} vs Last Year
              </span>
            </div>
          </div>

          {/* Inline Beautiful Raw Trend Line SVG Chart */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-black uppercase text-text-secondary-theme tracking-wide flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary-theme" /> Compensation Index Curve
            </span>
            <div className="w-full bg-bg-theme border border-border-theme/40 rounded-2xl p-4">
              <svg viewBox="0 0 100 100" className="w-full h-24 overflow-visible">
                {/* Defs for dynamic color gradients */}
                <defs>
                  <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Gradient Fill under Curve */}
                <polygon
                  points={`0,100 ${points} 100,100`}
                  fill="url(#curveGrad)"
                />
                {/* Curve Line */}
                <polyline
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
                {/* Curve endpoints dot */}
                {details.trend.map((val, idx) => {
                  const minVal = Math.min(...details.trend);
                  const maxVal = Math.max(...details.trend);
                  const x = (idx / (details.trend.length - 1)) * 100;
                  const range = maxVal - minVal || 1;
                  const y = 80 - ((val - minVal) / range) * 60;
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill="var(--color-surface)"
                      stroke="var(--color-primary)"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
              <div className="flex justify-between text-[8px] font-bold text-text-muted-theme mt-1.5 font-mono">
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Range Card (3 cols) */}
        <div className="lg:col-span-3 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h4 className="text-[10px] font-black uppercase text-text-muted-theme tracking-wider">Salary Range Band</h4>
            <div className="space-y-1.5 mt-4">
              <div className="flex justify-between text-[11px] font-bold text-text-secondary-theme">
                <span>Minimum</span>
                <span>Maximum</span>
              </div>
              <div className="text-sm font-mono font-black text-text-primary-theme flex justify-between">
                <span>{details.min}</span>
                <span>{details.max}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-4.5 bg-bg-theme border border-border-theme/40 rounded-full p-1 relative flex items-center">
              {/* Highlight bar of active average in range */}
              <div className="h-full bg-primary-theme rounded-full absolute left-1/4 right-1/4" />
              {/* Avg Pin point indicator */}
              <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-primary-theme absolute left-1/2 -translate-x-1/2 shadow-sm" />
            </div>
            <div className="text-center p-3.5 bg-bg-theme border border-border-theme/30 rounded-2xl text-[10px] text-text-secondary-theme leading-normal">
              Most candidates secure offers around the <span className="text-primary-theme font-black">50th percentile</span> mark.
            </div>
          </div>
        </div>

        {/* Top Paying Cities Card (4 cols) */}
        <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <h4 className="text-[10px] font-black uppercase text-text-muted-theme tracking-wider border-b border-border-theme pb-2 flex items-center justify-between">
            Top Paying Markets <span>Salary (Avg)</span>
          </h4>

          <div className="space-y-3">
            {details.cities.map((city, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-semibold py-1 border-b border-border-theme/30 last:border-b-0 last:pb-0">
                <span className="text-text-secondary-theme">{city.name}</span>
                <span className="font-mono font-black text-text-primary-theme">{city.val}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-primary-theme/5 border border-primary-theme/10 rounded-2xl flex items-center gap-2.5 text-[9px] text-text-secondary-theme leading-snug">
            <CheckCircle2 className="w-5 h-5 text-primary-theme flex-shrink-0" />
            Compensation scales depend heavily on cost-of-living adjustments in metro domains.
          </div>
        </div>
      </div>
    </div>
  );
}
