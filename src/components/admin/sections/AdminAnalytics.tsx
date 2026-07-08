/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, TrendingUp, Sparkles, HelpCircle, RefreshCw, 
  MapPin, Award, Users, Target, Clock, Zap, DollarSign
} from 'lucide-react';

interface AdminAnalyticsProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function AdminAnalytics({ addToast }: AdminAnalyticsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'platform' | 'revenue' | 'growth' | 'hiring' | 'ai'>('platform');
  const [timeframe, setTimeframe] = useState('This Month');

  const handleRefresh = () => {
    addToast('Recalculating analytics registers from log logs...', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Analytics subtabs and timeframe */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-theme border border-border-theme p-3 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'platform', label: 'Platform Metrics', icon: BarChart3 },
            { id: 'revenue', label: 'Revenue Cohorts', icon: DollarSign },
            { id: 'growth', label: 'User Growth Analytics', icon: Users },
            { id: 'hiring', label: 'Hiring Success Engine', icon: Target },
            { id: 'ai', label: 'AI Performance Metrics', icon: Sparkles },
          ].map((sub) => {
            const Icon = sub.icon;
            const isActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-primary-theme text-white shadow-md' 
                    : 'text-text-secondary-theme hover:bg-border-theme/40 hover:text-text-primary-theme'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-transparent border border-border-theme rounded-xl px-3 py-1.5 text-[11px] font-black focus:outline-none text-text-primary-theme"
          >
            <option value="This Month">This Month</option>
            <option value="Last Quarter">Last Quarter</option>
            <option value="Annual Year">Annual Year</option>
          </select>

          <button 
            onClick={handleRefresh}
            className="p-2 bg-border-theme/30 hover:bg-border-theme text-text-primary-theme rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. PLATFORM METRICS SUBTAB */}
      {activeSubTab === 'platform' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Cumulative Users', count: '125,430', change: '+12.5%' },
              { label: 'Verified Openings', count: '45,678', change: '+14.2%' },
              { label: 'Active Candidate Applications', count: '1,25,678', change: '+16.8%' },
              { label: 'Successful Match Placements', count: '12,345', change: '+13.6%' },
            ].map((st) => (
              <div key={st.label} className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted-theme block">{st.label}</span>
                <h3 className="text-2xl font-black text-text-primary-theme font-mono mt-2">{st.count}</h3>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full inline-block mt-2">{st.change} monthly growth</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Active Engagements (Monthly)</h4>
              <div className="h-64 relative w-full pt-4">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <path d="M 0 170 Q 120 40 250 140 T 500 60" fill="none" stroke="var(--color-primary, #f97316)" strokeWidth="4" />
                </svg>
              </div>
            </div>

            <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Recruitment Distribution</h4>
              <div className="h-40 flex items-center justify-center my-4 relative">
                <div className="w-28 h-28 rounded-full border-8 border-primary-theme flex items-center justify-center">
                  <span className="text-xs font-black font-mono text-text-primary-theme">100% Sourcing</span>
                </div>
              </div>
              <p className="text-[9px] text-text-muted-theme font-semibold text-center leading-relaxed">Segmentation registers trace direct talent queries accurately.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. REVENUE COHORTS SUBTAB */}
      {activeSubTab === 'revenue' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Cumulative Platform Revenue', count: '₹ 8.75 Cr', change: '+16.4%' },
              { label: 'Current MRR', count: '₹ 72.35 L', change: '+12.6%' },
              { label: 'ARPU Ratio', count: '₹ 585', change: '+8.2%' },
              { label: 'Paying Corporate Members', count: '18,765', change: '+14.8%' },
            ].map((st) => (
              <div key={st.label} className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted-theme block">{st.label}</span>
                <h3 className="text-2xl font-black text-text-primary-theme font-mono mt-2">{st.count}</h3>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full inline-block mt-2">{st.change} VS baseline</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Billing Ledger Performance</h4>
              <div className="h-64 flex items-end justify-between gap-3 pt-6">
                {[30, 45, 60, 55, 75, 90].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-primary-theme/60 to-primary-theme rounded-xl" style={{ height: `${h * 2}px` }} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Top Sourcing Packages</h4>
              <div className="space-y-3.5">
                {[
                  { plan: 'Enterprise Package', value: '₹ 2.84 Cr', pct: '45%' },
                  { plan: 'Pro Plus Account', value: '₹ 2.63 Cr', pct: '30%' },
                  { plan: 'Pro Team Account', value: '₹ 1.51 Cr', pct: '15%' },
                  { plan: 'Basic Package', value: '₹ 0.87 Cr', pct: '10%' },
                ].map((item) => (
                  <div key={item.plan} className="flex justify-between items-center p-3 bg-border-theme/15 rounded-xl text-[10px] font-bold">
                    <span>{item.plan}</span>
                    <span className="font-mono text-text-primary-theme font-black">{item.value} ({item.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. USER GROWTH ANALYTICS */}
      {activeSubTab === 'growth' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Staged New Registrations', count: '5,245', change: '+14.2%' },
              { label: 'Weekly Active Sessions', count: '24,578', change: '+11.3%' },
              { label: 'Returning Talent Pool', count: '18,765', change: '+12.6%' },
              { label: 'Session Retention Rate', count: '72.6%', change: '+5.4%' },
            ].map((st) => (
              <div key={st.label} className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted-theme block">{st.label}</span>
                <h3 className="text-2xl font-black text-text-primary-theme font-mono mt-2">{st.count}</h3>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full inline-block mt-2">{st.change} week over week</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">New Users Onboarding Velocity</h4>
              <div className="h-64 relative w-full pt-4">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <path d="M 0 160 Q 120 80 250 120 T 500 40" fill="none" stroke="#3b82f6" strokeWidth="4" />
                </svg>
              </div>
            </div>

            <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Geographic Talent Pools</h4>
              <div className="space-y-3.5">
                {[
                  { country: 'India Sourcing Hub', share: '45%' },
                  { country: 'USA Enterprise Hub', share: '20%' },
                  { country: 'United Kingdom', share: '15%' },
                  { country: 'Canada Hub', share: '10%' },
                  { country: 'Others Pool', share: '10%' },
                ].map((item) => (
                  <div key={item.country} className="flex justify-between items-center text-[10px] font-bold p-2.5 bg-border-theme/15 rounded-xl">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary-theme" />
                      {item.country}
                    </span>
                    <span className="font-mono text-text-primary-theme font-black">{item.share}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. HIRING SUCCESS ENGINE */}
      {activeSubTab === 'hiring' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Cumulative Hires Made', count: '12,345', change: '+12.6%' },
              { label: 'Success Conversion Match', count: '78.5%', change: '+6.2%' },
              { label: 'Average Time To Hire', count: '18 Days', change: '-2.4%' },
              { label: 'Offer Acceptance Score', count: '92.3%', change: '+3.1%' },
            ].map((st) => (
              <div key={st.label} className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted-theme block">{st.label}</span>
                <h3 className="text-2xl font-black text-text-primary-theme font-mono mt-2">{st.count}</h3>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full inline-block mt-2">{st.change} monthly gain</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Monthly Placement Velocity</h4>
              <div className="h-64 flex items-end justify-between gap-4 pt-6">
                {[20, 35, 50, 45, 65, 80].map((val, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-orange-500 to-amber-500 rounded-xl" style={{ height: `${val * 2}px` }} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Active Industry Sectors</h4>
              <div className="space-y-3">
                {[
                  { sector: 'IT Services / Systems', share: '45%' },
                  { sector: 'SaaS Software Products', share: '20%' },
                  { sector: 'Fintech Solutions', share: '15%' },
                  { sector: 'Healthcare Systems', share: '10%' },
                  { sector: 'Others', share: '10%' },
                ].map((item) => (
                  <div key={item.sector} className="flex justify-between items-center text-[10px] font-bold p-2 bg-border-theme/15 rounded-xl">
                    <span>{item.sector}</span>
                    <span className="font-mono text-text-primary-theme font-black">{item.share}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 5. AI PERFORMANCE METRICS */}
      {activeSubTab === 'ai' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Semantic Accuracy Target', count: '92.6%', change: '+3.8%' },
              { label: 'Matching Recommendations', count: '1,25,467', change: '+14.9%' },
              { label: 'Recruiter Time Saved', count: '45,678 hrs', change: '+20.4%' },
              { label: 'Employer Satisfaction Index', count: '4.6 / 5', change: '+0.3' },
            ].map((st) => (
              <div key={st.label} className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted-theme block">{st.label}</span>
                <h3 className="text-2xl font-black text-text-primary-theme font-mono mt-2">{st.count}</h3>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full inline-block mt-2">{st.change} gain</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">AI Match Deviation Rate</h4>
              <div className="h-64 relative w-full pt-4">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <path d="M 0 140 Q 120 180 250 150 T 500 80" fill="none" stroke="#10b981" strokeWidth="4" />
                </svg>
              </div>
            </div>

            <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Active Models Operational</h4>
              <div className="space-y-3">
                {[
                  { model: 'Model Variant v3.2 (Latest)', rating: '95.6% score' },
                  { model: 'Model Variant v3.1 (Stable)', rating: '92.3% score' },
                  { model: 'Model Variant v2.9 (Legacy)', rating: '88.1% score' },
                ].map((item) => (
                  <div key={item.model} className="flex justify-between items-center text-[10px] font-bold p-2 bg-border-theme/15 rounded-xl">
                    <span>{item.model}</span>
                    <span className="font-mono text-emerald-500 font-black">{item.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
