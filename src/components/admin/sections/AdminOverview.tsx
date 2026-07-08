/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Briefcase, Sparkles, TrendingUp, DollarSign, Activity, 
  MapPin, Laptop, Smartphone, Tablet, Star, Clock, CheckCircle2, 
  ShieldAlert, ArrowUpRight, ArrowDownRight, RefreshCw, Zap
} from 'lucide-react';

interface AdminOverviewProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function AdminOverview({ addToast }: AdminOverviewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'platform' | 'live' | 'revenue' | 'ai'>('platform');
  const [timeframe, setTimeframe] = useState('This Week');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Interactive node details
  const [hoveredNode, setHoveredNode] = useState<{ x: number, y: number, label: string, value: string } | null>(null);

  // Get growth chart nodes dynamically
  const chartNodes = React.useMemo(() => {
    if (!stats || !stats.growthChart || stats.growthChart.length === 0) {
      return [
        { x: 0, y: 160, date: 'Jan', count: 15 },
        { x: 83, y: 140, date: 'Feb', count: 24 },
        { x: 166, y: 150, date: 'Mar', count: 32 },
        { x: 250, y: 110, date: 'Apr', count: 48 },
        { x: 333, y: 90, date: 'May', count: 65 },
        { x: 416, y: 70, date: 'Jun', count: 88 },
        { x: 500, y: 40, date: 'Jul', count: 120 },
      ];
    }
    
    const chartData = stats.growthChart;
    const maxVal = Math.max(...chartData.map((d: any) => d.candidates + d.employers), 10);
    
    return chartData.map((d: any, idx: number) => {
      const total = d.candidates + d.employers;
      const x = Math.round((idx / (chartData.length - 1)) * 500);
      // y goes from 180 (for 0) down to 20 (for maxVal)
      const y = Math.round(180 - ((total / maxVal) * 150));
      return {
        x,
        y,
        date: d.month,
        count: total
      };
    });
  }, [stats]);

  const curvePath = React.useMemo(() => {
    if (chartNodes.length === 0) return '';
    let d = `M ${chartNodes[0].x} ${chartNodes[0].y}`;
    for (let i = 1; i < chartNodes.length; i++) {
      const prev = chartNodes[i - 1];
      const curr = chartNodes[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [chartNodes]);

  const areaPath = React.useMemo(() => {
    if (curvePath === '') return '';
    return `${curvePath} L 500 200 L 0 200 Z`;
  }, [curvePath]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const res = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    fetchAnalytics();
    addToast('Synchronizing platform registers with live containers...', 'success');
  };

  const donutData = React.useMemo(() => {
    if (!stats || !stats.stats) {
      return [
        { label: 'Candidates', pct: 0, count: 0, color: 'bg-blue-500', strokeColor: '#3b82f6' },
        { label: 'Employers', pct: 0, count: 0, color: 'bg-orange-500', strokeColor: '#f97316' },
        { label: 'Administrators', pct: 0, count: 0, color: 'bg-emerald-500', strokeColor: '#10b981' },
      ];
    }
    const s = stats.stats;
    const total = s.candidatesCount + s.employersCount + (s.adminsCount || 0);
    if (total === 0) {
      return [
        { label: 'Candidates', pct: 0, count: 0, color: 'bg-blue-500', strokeColor: '#3b82f6' },
        { label: 'Employers', pct: 0, count: 0, color: 'bg-orange-500', strokeColor: '#f97316' },
        { label: 'Administrators', pct: 0, count: 0, color: 'bg-emerald-500', strokeColor: '#10b981' },
      ];
    }
    const cPct = Math.round((s.candidatesCount / total) * 100);
    const ePct = Math.round((s.employersCount / total) * 100);
    const aPct = 100 - cPct - ePct;
    return [
      { label: 'Candidates', pct: cPct, count: s.candidatesCount, color: 'bg-blue-500', strokeColor: '#3b82f6' },
      { label: 'Employers', pct: ePct, count: s.employersCount, color: 'bg-orange-500', strokeColor: '#f97316' },
      { label: 'Administrators', pct: aPct, count: s.adminsCount || 0, color: 'bg-emerald-500', strokeColor: '#10b981' },
    ];
  }, [stats]);

  const totalUsers = React.useMemo(() => {
    if (!stats || !stats.stats) return 0;
    const s = stats.stats;
    return s.candidatesCount + s.employersCount + (s.adminsCount || 0);
  }, [stats]);

  const donutSlices = React.useMemo(() => {
    let accumulatedOffset = 0;
    return donutData.map((d) => {
      const sliceLength = (d.pct / 100) * 251.2;
      const offset = accumulatedOffset;
      accumulatedOffset -= sliceLength;
      return {
        ...d,
        strokeDasharray: `${sliceLength} 251.2`,
        strokeDashoffset: `${offset}`
      };
    });
  }, [donutData]);

  const getMetricCount = (label: string) => {
    if (!stats || !stats.stats) return '...';
    const s = stats.stats;
    if (label === 'Total Active Users') return (s.candidatesCount + s.employersCount).toLocaleString();
    if (label === 'Verified Candidates') return s.candidatesCount.toLocaleString();
    if (label === 'Corporate Employers') return s.employersCount.toLocaleString();
    return s.jobsCount.toLocaleString();
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-theme border border-border-theme p-3 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'platform', label: '1. Platform Overview', icon: Activity },
            { id: 'live', label: '2. Live Statistics', icon: Laptop },
            { id: 'revenue', label: '3. Revenue Analytics', icon: DollarSign },
            { id: 'ai', label: '4. AI Insights Suite', icon: Sparkles },
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
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>

          <button 
            onClick={handleRefresh}
            className="p-2 bg-border-theme/30 hover:bg-border-theme text-text-primary-theme rounded-xl transition-all cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SUB-SECTION 1: PLATFORM OVERVIEW */}
      {activeSubTab === 'platform' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main stats blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Total Active Users', change: '+12.5%', vs: '+10.8%', color: 'text-emerald-500' },
              { label: 'Verified Candidates', change: '+10.3%', vs: 'Goal met', color: 'text-emerald-500' },
              { label: 'Corporate Employers', change: '+9.8%', vs: '+8.2%', color: 'text-emerald-500' },
              { label: 'Vacancies Posted', change: '+14.2%', vs: '+11.5%', color: 'text-emerald-500' },
            ].map((st) => (
              <div key={st.label} className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted-theme block">{st.label}</span>
                <h3 className="text-2xl font-black text-text-primary-theme font-mono mt-2">{getMetricCount(st.label)}</h3>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/10 ${st.color} flex items-center gap-0.5`}>
                    <ArrowUpRight className="w-3 h-3" /> {st.change}
                  </span>
                  <span className="text-[9px] text-text-muted-theme font-semibold">vs last month ({st.vs})</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Live Registration Wave graph */}
            <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">User Sign-up Velocity</h4>
                  <p className="text-[10px] text-text-muted-theme font-semibold">Real-time user onboarding rate over past 30 days</p>
                </div>
                <div className="text-[10px] text-emerald-500 font-black bg-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase">
                  +19.8% vs last month
                </div>
              </div>

              {/* Dynamic Interactive SVG Chart */}
              <div className="h-64 relative w-full border-b border-l border-border-theme/40 pt-4 pl-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary, #f97316)" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="var(--color-primary, #f97316)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  {[0, 50, 100, 150].map((y) => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="currentColor" className="text-border-theme/25" strokeDasharray="4 4" />
                  ))}

                  {/* Shaded Area */}
                  <path 
                    d={areaPath} 
                    fill="url(#curveGrad)" 
                  />
 
                  {/* High Quality Curve Line */}
                  <path 
                    d={curvePath} 
                    fill="none" 
                    stroke="var(--color-primary, #f97316)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
 
                  {/* Intersecting Nodes */}
                  {chartNodes.map((node, i) => (
                    <g 
                      key={i} 
                      className="cursor-pointer group"
                      onMouseEnter={(e) => setHoveredNode({ x: node.x, y: node.y, label: node.date, value: node.count.toLocaleString() })}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r="6" 
                        className="fill-white stroke-primary-theme stroke-2 transition-all hover:r-8 hover:fill-primary-theme" 
                      />
                      <text x={node.x} y="195" textAnchor="middle" className="text-[8px] font-black fill-text-muted-theme uppercase">
                        {node.date}
                      </text>
                    </g>
                  ))}
                </svg>
 
                {/* Hover Node Tooltip */}
                {hoveredNode && (
                  <div 
                    className="absolute bg-surface-theme border border-border-theme shadow-lg rounded-xl p-2.5 text-[9px] font-black z-35 pointer-events-none"
                    style={{ left: `${hoveredNode.x / 5}%`, bottom: `${200 - hoveredNode.y}px`, transform: 'translate(-50%, -10px)' }}
                  >
                    <div className="text-text-primary-theme">{hoveredNode.label}</div>
                    <div className="text-primary-theme mt-0.5">{hoveredNode.value} Users</div>
                  </div>
                )}
              </div>
            </div>

            {/* Role Donut Section */}
            <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Distribution By Role</h4>
                <p className="text-[10px] text-text-muted-theme font-semibold">User base segmentation</p>
              </div>

              {/* Animated SVG Donut */}
              <div className="flex items-center justify-center my-6 relative">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-border-theme/20" strokeWidth="12" />
                  {donutSlices.map((slice) => (
                    <circle 
                      key={slice.label}
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke={slice.strokeColor} 
                      strokeWidth="12" 
                      strokeDasharray={slice.strokeDasharray} 
                      strokeDashoffset={slice.strokeDashoffset} 
                      strokeLinecap="round" 
                    />
                  ))}
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-lg font-black text-text-primary-theme font-mono">{totalUsers}</span>
                  <span className="text-[8px] text-text-muted-theme font-black uppercase tracking-wider">Total</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {donutData.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-[10px] font-bold">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-text-secondary-theme">{item.label}</span>
                    </div>
                    <div className="font-mono flex items-center gap-1.5">
                      <span className="text-text-primary-theme font-black">{item.pct}%</span>
                      <span className="text-text-muted-theme font-semibold">({item.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activities Feed */}
            <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary-theme" />
                <span>Recent Platform Activities</span>
              </h4>

              <div className="space-y-3.5">
                {(stats?.recentActivities || []).map((act: any, i: number) => (
                  <div key={i} className="flex justify-between items-start gap-4 p-3 bg-border-theme/10 hover:bg-border-theme/20 rounded-xl border border-border-theme/35 transition-colors">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-text-secondary-theme">{act.text}</p>
                      <div className="text-[9px] text-text-primary-theme font-black">{act.user} &middot; <span className="text-text-muted-theme font-semibold">{act.time}</span></div>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full ${act.style}`}>
                      {act.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Container System Health */}
            <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span>Super Admin Engine Health</span>
              </h4>

              <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold">
                Platform microservices operating dynamically inside Cloud Run server clusters. Edge clusters report optimal packet metrics.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Gateway Routers', stat: 'Operational', ping: '12ms', color: 'bg-emerald-500' },
                  { name: 'AI Sourcing Engine', stat: 'Active (v2.8)', ping: '45ms', color: 'bg-emerald-500' },
                  { name: 'Google Cloud SQL', stat: 'Nominal Pool', ping: '8ms', color: 'bg-emerald-500' },
                  { name: 'SMTP Gateways', stat: 'Online', ping: '20ms', color: 'bg-emerald-500' },
                ].map((sys) => (
                  <div key={sys.name} className="p-3 bg-border-theme/15 rounded-2xl border border-border-theme/40 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-black text-text-primary-theme block">{sys.name}</span>
                      <span className="text-[9px] text-text-muted-theme font-semibold">{sys.ping} latency</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${sys.color} animate-pulse`} />
                      <span className="text-[8px] font-black uppercase tracking-wider text-text-secondary-theme">{sys.stat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* SUB-SECTION 2: LIVE STATISTICS */}
      {activeSubTab === 'live' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Total Platform Users", count: totalUsers.toLocaleString(), change: 'Total Registered', vs: '100% dynamic', color: 'text-emerald-500' },
              { label: 'Pending Verifications', count: (stats?.stats?.pendingVerifications || 0).toLocaleString(), change: 'Pending Action', vs: 'Requires audit', color: 'text-orange-500' },
              { label: 'Active Sourcing Vacancies', count: (stats?.stats?.activeJobs || 0).toLocaleString(), change: 'Live Sourcing', vs: 'Published listings', color: 'text-emerald-500' },
              { label: 'Direct Job Applications', count: (stats?.stats?.applicationsCount || 0).toLocaleString(), change: 'Submitted Recs', vs: 'Parsed ATS matches', color: 'text-emerald-500' },
            ].map((st) => (
              <div key={st.label} className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted-theme block">{st.label}</span>
                <h3 className="text-2xl font-black text-text-primary-theme font-mono mt-2">{st.count}</h3>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> {st.change}
                  </span>
                  <span className="text-[9px] text-text-muted-theme font-semibold">({st.vs})</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Live activity graph block */}
            <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Active Users Workload (Live)</h4>
              
              <div className="h-64 relative w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" className="text-border-theme/30" />
                  {/* High Quality Dual Curves */}
                  <path d="M 0 170 Q 120 40 250 140 T 500 60" fill="none" stroke="#3b82f6" strokeWidth="3" />
                  <path d="M 0 120 Q 150 160 300 70 T 500 110" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="3 3" />
                </svg>
              </div>
            </div>

            {/* Top country demographic list */}
            <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Top Sourcing Countries</h4>

              <div className="space-y-4">
                {(stats?.demographics || [
                  { country: 'India', pct: 100, color: 'bg-orange-500' }
                ]).map((item: any) => (
                  <div key={item.country} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black text-text-primary-theme">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary-theme" />
                        {item.country}
                      </span>
                      <span>{item.pct}%</span>
                    </div>
                    <div className="w-full bg-border-theme/30 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* SUB-SECTION 3: REVENUE ANALYTICS */}
      {activeSubTab === 'revenue' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Total Platform Revenue', count: '₹ 8,75,20,000', change: '+16.4%', vs: '+12.5%' },
              { label: 'Monthly Recurring Revenue', count: '₹ 72,35,000', change: '+12.8%', vs: '+10.2%' },
              { label: 'Average Revenue Per User', count: '₹ 585', change: '+8.2%', vs: '+4.5%' },
              { label: 'Paying Corporate Members', count: '18,765', change: '+14.8%', vs: '+12.3%' },
            ].map((st) => (
              <div key={st.label} className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted-theme block">{st.label}</span>
                <h3 className="text-xl font-black text-text-primary-theme font-mono mt-2">{st.count}</h3>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> {st.change}
                  </span>
                  <span className="text-[9px] text-text-muted-theme font-semibold">({st.vs})</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Revenue breakdown by plan bar charts */}
            <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Revenue Influx by Month</h4>
              
              {/* Dynamic simulated bar charts */}
              <div className="h-64 flex items-end justify-between gap-2 pt-6">
                {[
                  { month: 'Jan', value: 40 },
                  { month: 'Feb', value: 55 },
                  { month: 'Mar', value: 62 },
                  { month: 'Apr', value: 78 },
                  { month: 'May', value: 85 },
                  { month: 'Jun', value: 98 },
                ].map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-3">
                    <div className="w-full bg-gradient-to-t from-primary-theme/60 to-primary-theme rounded-xl transition-all hover:scale-105 cursor-pointer" style={{ height: `${item.value * 1.8}px` }}>
                      <div className="text-[9px] font-black text-white text-center pt-2 font-mono">{item.value}%</div>
                    </div>
                    <span className="text-[10px] font-black text-text-secondary-theme uppercase">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue By Plan list */}
            <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Revenue By Subscription</h4>

              <div className="space-y-3.5 pt-2">
                {[
                  { plan: 'Enterprise Package', value: '₹ 4.2 Cr', share: '45%', color: 'bg-blue-500' },
                  { plan: 'Pro Plus Account', value: '₹ 2.5 Cr', share: '30%', color: 'bg-orange-500' },
                  { plan: 'Pro Team Account', value: '₹ 1.2 Cr', share: '15%', color: 'bg-emerald-500' },
                  { plan: 'Basic Package', value: '₹ 80 Lakhs', share: '10%', color: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.plan} className="flex items-center justify-between p-3 bg-border-theme/10 hover:bg-border-theme/25 rounded-2xl border border-border-theme/40 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${item.color}`} />
                      <div>
                        <span className="text-[10px] font-black text-text-primary-theme block">{item.plan}</span>
                        <span className="text-[9px] text-text-muted-theme font-semibold">{item.share} platform revenue share</span>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-text-primary-theme">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* SUB-SECTION 4: AI INSIGHTS */}
      {activeSubTab === 'ai' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Sourcing Match Events', count: '2,45,678', change: '+16.2%', vs: '+12.4%' },
              { label: 'AI Sourcing Recommendations', count: '1,25,467', change: '+14.9%', vs: '+10.5%' },
              { label: 'Match Precision Score', count: '92.6%', change: '+3.8%', vs: '+1.5%' },
              { label: 'Hiring Time Saved', count: '45,678 hrs', change: '+20.4%', vs: 'Goal met' },
            ].map((st) => (
              <div key={st.label} className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted-theme block">{st.label}</span>
                <h3 className="text-2xl font-black text-text-primary-theme font-mono mt-2">{st.count}</h3>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> {st.change}
                  </span>
                  <span className="text-[9px] text-text-muted-theme font-semibold">({st.vs})</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* AI Top skill list with bar display */}
            <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Most In-Demand Sourcing Skills</h4>

              <div className="space-y-4">
                {[
                  { skill: 'Python / ML Pipeline Engineering', val: 90, matches: '45k matches', color: 'from-orange-500 to-amber-400' },
                  { skill: 'Natural Language Processing (NLP)', val: 85, matches: '38k matches', color: 'from-orange-500 to-amber-400' },
                  { skill: 'React / TypeScript Frontend Stack', val: 75, matches: '32k matches', color: 'from-blue-500 to-indigo-400' },
                  { skill: 'Amazon Web Services / Docker', val: 60, matches: '18k matches', color: 'from-emerald-500 to-teal-400' },
                  { skill: 'Relational Database / Postgres SQL', val: 55, matches: '12k matches', color: 'from-purple-500 to-pink-400' },
                ].map((sk) => (
                  <div key={sk.skill} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black text-text-primary-theme">
                      <span>{sk.skill}</span>
                      <span className="font-mono">{sk.matches} &middot; {sk.val}%</span>
                    </div>
                    <div className="w-full bg-border-theme/30 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${sk.color} rounded-full`} style={{ width: `${sk.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart insights bulletins */}
            <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Agent Recommendations</span>
              </h4>

              <div className="space-y-3 pt-1">
                {[
                  { title: 'Incentivize Python Skill Assays', desc: 'Sourcing requests for ML engineers surged 45% this week.', type: 'High Priority' },
                  { title: 'Update Bangalore Sourcing Caps', desc: 'Hiring demand in Bangalore is peaking. Consider increasing subscription credits.', type: 'Strategy' },
                  { title: 'Prune Low Engagement Vacancies', desc: '6 expired positions require immediate automated archiving.', type: 'Action Required' },
                ].map((rec) => (
                  <div key={rec.title} className="p-3 bg-border-theme/15 rounded-2xl border border-border-theme/45 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-text-primary-theme">{rec.title}</span>
                      <span className="text-[8px] font-black bg-primary-theme/15 text-primary-theme px-1.5 py-0.5 rounded uppercase">{rec.type}</span>
                    </div>
                    <p className="text-[9px] text-text-secondary-theme leading-relaxed font-semibold">{rec.desc}</p>
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
