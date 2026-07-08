/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, Sparkles, CheckCircle2, Download, History, 
  HelpCircle, ChevronRight, AlertCircle, TrendingUp
} from 'lucide-react';

interface EmpBillingSectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function EmpBillingSection({ addToast }: EmpBillingSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState('Business Plan');

  // Credits count states
  const [credits, setCredits] = useState(250);

  // Invoices list
  const paymentHistory = [
    { id: 'inv-341', date: '01 May 2024', amount: '₹ 14,999', plan: 'Business Plan Renewal', status: 'Paid' },
    { id: 'inv-282', date: '01 Apr 2024', amount: '₹ 14,999', plan: 'Business Plan Renewal', status: 'Paid' },
    { id: 'inv-190', date: '01 Mar 2024', amount: '₹ 5,000', plan: 'Add-on Credits (100)', status: 'Paid' },
  ];

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName);
    addToast(`Upgraded subscription tier to: ${planName}!`, 'success');
  };

  const handleBuyCredits = () => {
    setCredits(credits + 100);
    addToast('100 Sourcing Credits added to your corporate account balance.', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Top Tally Widget Balance block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="bg-gradient-to-br from-primary-theme to-orange-600 p-6 rounded-2xl text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute inset-0 bg-white/5 opacity-10 mix-blend-overlay" />
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider opacity-80">Remaining Sourcing Balance</span>
            <div className="text-3xl font-black font-mono">{credits} Credits</div>
          </div>
          <button 
            onClick={handleBuyCredits}
            className="self-start px-3.5 py-1.5 bg-white text-primary-theme font-black text-[10px] rounded-lg shadow cursor-pointer hover:bg-white/90"
          >
            + Purchase Credits
          </button>
        </div>

        <div className="bg-surface-theme border border-border-theme p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-text-muted-theme uppercase tracking-wider block">Subscription Plan</span>
            <span className="text-xl font-black text-text-primary-theme">{selectedPlan}</span>
          </div>
          <span className="text-[10px] text-text-secondary-theme font-semibold block">Renewal date: 01 June 2024</span>
        </div>

        <div className="bg-surface-theme border border-border-theme p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-text-muted-theme uppercase tracking-wider block">Total Recruiter Seats</span>
            <span className="text-xl font-black text-text-primary-theme font-mono">04 / 10 seats</span>
          </div>
          <span className="text-[10px] text-text-secondary-theme font-semibold block">Using 40% of plan capacity</span>
        </div>

      </div>

      {/* Grid of Pricing Plans */}
      <div className="space-y-4">
        <h2 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Hiring Sourcing Tiers</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { name: 'Starter Plan', price: '₹ 4,999', period: 'month', desc: 'Best for early startups.', features: ['3 Active Job vacancies', '50 Sourcing Resume Credits', 'Email Support'] },
            { name: 'Business Plan', price: '₹ 14,999', period: 'month', desc: 'Scale with match recommendations.', features: ['15 Active Job vacancies', '250 Sourcing Resume Credits', 'AI Matching Suite', 'Priority Help'] },
            { name: 'Enterprise Premium', price: 'Custom Quote', period: 'annual', desc: 'Relational data and API integrations.', features: ['Unlimited Job vacancies', 'Unlimited Sourcing Matches', 'Private Account Manager', 'Custom API access'] },
          ].map((plan) => {
            const isCurrent = plan.name === selectedPlan;
            return (
              <div 
                key={plan.name} 
                className={`bg-surface-theme border rounded-2xl p-5 hover:shadow transition-all flex flex-col justify-between min-h-[320px] ${
                  isCurrent ? 'border-primary-theme ring-1 ring-primary-theme/20' : 'border-border-theme'
                }`}
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-black text-text-primary-theme">{plan.name}</h3>
                    <p className="text-[10px] text-text-muted-theme font-semibold">{plan.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-text-primary-theme font-mono">{plan.price}</span>
                    <span className="text-[10px] text-text-muted-theme font-semibold">/{plan.period}</span>
                  </div>

                  <ul className="space-y-2 pt-3 border-t border-border-theme/40">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[10px] text-text-secondary-theme font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-theme" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={isCurrent}
                  className={`w-full text-center py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer mt-5 ${
                    isCurrent 
                      ? 'bg-primary-theme/10 text-primary-theme border border-primary-theme/15' 
                      : 'bg-primary-theme hover:bg-primary-hover-theme text-white shadow-sm'
                  }`}
                >
                  {isCurrent ? 'Active Plan' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History logs table */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border-theme/40">
          <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-4 h-4 text-primary-theme" />
            <span>Transaction Ledger History</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
            <thead>
              <tr className="bg-border-theme/10 border-b border-border-theme text-[9px] uppercase tracking-wider font-black text-text-muted-theme">
                <th className="p-4 pl-6">Invoice ID</th>
                <th className="p-4">Billing Date</th>
                <th className="p-4">Details</th>
                <th className="p-4">Total Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme/40 text-text-secondary-theme">
              {paymentHistory.map((pt) => (
                <tr key={pt.id} className="hover:bg-border-theme/10 transition-colors">
                  <td className="p-4 pl-6 font-mono text-[10px] font-black text-text-primary-theme">#{pt.id}</td>
                  <td className="p-4 font-mono text-[10px]">{pt.date}</td>
                  <td className="p-4">{pt.plan}</td>
                  <td className="p-4 font-mono font-black text-text-primary-theme">{pt.amount}</td>
                  <td className="p-4">
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                      {pt.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => addToast(`Triggered invoice PDF download for transaction #${pt.id}!`, 'success')}
                      className="p-1.5 hover:bg-border-theme/50 rounded-xl text-primary-theme cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
