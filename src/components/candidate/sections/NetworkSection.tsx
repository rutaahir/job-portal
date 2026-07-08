/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Users, GraduationCap, Award, MessageSquare, Bell, ArrowRight } from 'lucide-react';

interface NetworkSectionProps {
  onNavigateToTab: (tabId: string) => void;
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function NetworkSection({ onNavigateToTab, addToast }: NetworkSectionProps) {
  const topConnections = [
    { name: 'Rohit Sharma', role: 'Senior Designer', company: 'Google', initial: 'R', color: 'bg-blue-500' },
    { name: 'Priya Patel', role: 'Product Manager', company: 'Microsoft', initial: 'P', color: 'bg-purple-500' },
    { name: 'Amit Kumar', role: 'UI/UX Lead', company: 'Flipkart', initial: 'A', color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
          Network
        </h2>
        <p className="text-xs text-text-secondary-theme font-medium">Connect and grow your professional network pipelines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Side: Grids & Marketplace Access (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mentor Marketplace */}
            <div
              onClick={() => addToast('Mentor Marketplace directory loaded!', 'info')}
              className="p-5 bg-surface-theme border border-border-theme hover:border-primary-theme rounded-2xl cursor-pointer group transition-all flex flex-col justify-between min-h-[140px]"
            >
              <div className="p-2.5 bg-primary-theme/5 text-primary-theme rounded-xl inline-block w-fit">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-primary-theme group-hover:text-primary-theme transition-colors">Mentor Marketplace</h3>
                <p className="text-[10px] text-text-muted-theme mt-1 font-semibold leading-relaxed">Find expert mentors to review layouts and portfolio assets.</p>
              </div>
            </div>

            {/* Referral Marketplace */}
            <div
              onClick={() => addToast('Referral requests inbox open!', 'info')}
              className="p-5 bg-surface-theme border border-border-theme hover:border-primary-theme rounded-2xl cursor-pointer group transition-all flex flex-col justify-between min-h-[140px]"
            >
              <div className="p-2.5 bg-primary-theme/5 text-primary-theme rounded-xl inline-block w-fit">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-primary-theme group-hover:text-primary-theme transition-colors">Referral Marketplace</h3>
                <p className="text-[10px] text-text-muted-theme mt-1 font-semibold leading-relaxed">Request direct job referrals from verified company insiders.</p>
              </div>
            </div>

            {/* Messages */}
            <div
              onClick={() => onNavigateToTab('settings')} // navigate to settings or messages or dashboard
              className="p-5 bg-surface-theme border border-border-theme hover:border-primary-theme rounded-2xl cursor-pointer group transition-all flex flex-col justify-between min-h-[140px]"
            >
              <div className="p-2.5 bg-primary-theme/5 text-primary-theme rounded-xl inline-block w-fit">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-primary-theme group-hover:text-primary-theme transition-colors">Messages</h3>
                <p className="text-[10px] text-text-muted-theme mt-1 font-semibold leading-relaxed">Direct chat interface with tech recruiters.</p>
              </div>
            </div>

            {/* Notifications */}
            <div
              onClick={() => addToast('Notifications list refreshed.', 'info')}
              className="p-5 bg-surface-theme border border-border-theme hover:border-primary-theme rounded-2xl cursor-pointer group transition-all flex flex-col justify-between min-h-[140px]"
            >
              <div className="p-2.5 bg-primary-theme/5 text-primary-theme rounded-xl inline-block w-fit">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-primary-theme group-hover:text-primary-theme transition-colors">Notifications</h3>
                <p className="text-[10px] text-text-muted-theme mt-1 font-semibold leading-relaxed">Stay updated with instant match alerts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Connections counts and Top Connection list (4 cols) */}
        <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 space-y-6 shadow-sm">
          
          {/* Total count card */}
          <div className="space-y-1">
            <div className="text-[10px] text-text-muted-theme font-bold uppercase tracking-wider">Your Connections</div>
            <div className="text-3xl font-black font-serif text-text-primary-theme">1,234</div>
            <div className="text-[10px] text-success-theme font-bold font-mono">+12 this month</div>
          </div>

          {/* List profiles */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider border-b border-border-theme/40 pb-2">Top Connections</h4>
            <div className="space-y-3 text-xs font-semibold">
              {topConnections.map((con, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className={`w-8 h-8 rounded-full ${con.color} text-white font-black text-xs flex items-center justify-center`}>
                    {con.initial}
                  </div>
                  <div>
                    <h5 className="text-text-primary-theme font-bold">{con.name}</h5>
                    <p className="text-[10px] text-text-secondary-theme leading-normal">{con.role} at {con.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToast('Loading full contacts directory!', 'info')}
            className="w-full py-2.5 bg-border-theme hover:bg-border-theme/80 text-text-primary-theme text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
          >
            View All Connections <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
