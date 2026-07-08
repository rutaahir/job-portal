/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Download, CreditCard, RefreshCw, X, Receipt } from 'lucide-react';

interface BillingSectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function BillingSection({ addToast }: BillingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const priceMultiplier = billingCycle === 'yearly' ? 0.8 : 1.0; // 20% discount

  const plans = [
    { name: 'Basic', price: 0, desc: 'For starting your job discovery process', features: ['5 Job Applications/mo', 'Basic AI Match Rating', 'Standard Profile Visibility'] },
    { name: 'Pro', price: 499, desc: 'Our most popular tier for active searchers', features: ['Unlimited Applications', 'Advanced Match Explanation', 'Priority Resume Analysis', 'Interactive Cover Letters'] },
    { name: 'Premium', price: 999, desc: 'Enterprise matching and direct mentorship', features: ['All Pro Features', '1:1 Mentor Consultations', 'Referral Network Unlocked', 'Profile Highlight to Recruiters'] }
  ];

  const invoices = [
    { invId: 'INV-2024-001', date: '10 May 2024', amount: '499 INR', status: 'Paid' },
    { invId: 'INV-2024-002', date: '10 Apr 2024', amount: '499 INR', status: 'Paid' },
    { invId: 'INV-2024-003', date: '10 Mar 2024', amount: '499 INR', status: 'Paid' }
  ];

  const handleUpgrade = (planName: string) => {
    addToast(`Successfully upgraded to ${planName} subscription tier!`, 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn text-xs font-semibold">
      {/* Header */}
      <div>
        <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
          Subscription & Plans
        </h2>
        <p className="text-xs text-text-secondary-theme">Select the ideal tier to accelerate your match ratios</p>
      </div>

      {/* Monthly/Yearly toggle switcher */}
      <div className="flex justify-center">
        <div className="bg-surface-theme border border-border-theme p-1 rounded-xl flex gap-1 items-center">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly' ? 'bg-primary-theme text-white' : 'text-text-secondary-theme'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'yearly' ? 'bg-primary-theme text-white' : 'text-text-secondary-theme'
            }`}
          >
            <span>Yearly</span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-black uppercase">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const finalPrice = Math.round(plan.price * priceMultiplier);
          const isPro = plan.name === 'Pro';

          return (
            <div
              key={plan.name}
              className={`p-6 bg-surface-theme border rounded-3xl flex flex-col justify-between space-y-5 shadow-sm transition-all relative ${
                isPro ? 'border-primary-theme ring-2 ring-primary-theme/10' : 'border-border-theme/60'
              }`}
            >
              {isPro && (
                <span className="absolute -top-3 right-6 bg-primary-theme text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-primary-theme/25 shadow-sm">
                  Most Popular
                </span>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">{plan.name}</h3>
                  <p className="text-[10px] text-text-muted-theme mt-1 leading-normal font-medium">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-2xl font-serif font-black text-primary-theme">
                    ₹{finalPrice}
                  </span>
                  <span className="text-text-muted-theme font-medium text-[11px]">
                    / {billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-2 pt-2 text-[11px] font-semibold text-text-secondary-theme">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex gap-2 items-center">
                      <Check className="w-4 h-4 text-primary-theme flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(plan.name)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isPro
                    ? 'bg-primary-theme hover:bg-primary-hover-theme text-white shadow-sm'
                    : 'bg-primary-theme/5 hover:bg-primary-theme/15 text-primary-theme'
                }`}
              >
                {plan.price === 0 ? 'Current Active Tier' : 'Upgrade Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoice list table (from screenshot 12) */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Invoice History</h3>
        
        <div className="divide-y divide-border-theme/40">
          {invoices.map((inv) => (
            <div key={inv.invId} className="py-3 flex justify-between items-center text-xs font-semibold">
              <div>
                <h4 className="text-text-primary-theme">{inv.invId}</h4>
                <p className="text-[10px] text-text-muted-theme font-bold font-mono">{inv.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-black font-mono">
                  {inv.status}
                </span>
                <span className="font-mono text-text-primary-theme">{inv.amount}</span>
                <button
                  onClick={() => setSelectedInvoice(inv)}
                  className="p-2 border border-border-theme rounded-lg hover:bg-border-theme/40 transition-colors text-text-secondary-theme cursor-pointer"
                  title="View Invoice Receipt"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Receipt Modal Overlay */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)}></div>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-theme border border-border-theme max-w-sm w-full rounded-3xl p-6 space-y-5 shadow-2xl relative z-10 text-xs font-semibold"
            >
              <div className="flex justify-between items-center border-b border-border-theme pb-2.5">
                <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-primary-theme" /> Invoice Bill Details
                </h3>
                <button onClick={() => setSelectedInvoice(null)} className="p-1 hover:bg-border-theme rounded-lg"><X className="w-4 h-4 text-text-muted-theme" /></button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-muted-theme">Invoice Number</span>
                  <span className="text-text-primary-theme font-mono font-bold">{selectedInvoice.invId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted-theme">Billed To</span>
                  <span className="text-text-primary-theme font-bold">Arjun Mehta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted-theme">Billing Date</span>
                  <span className="text-text-primary-theme font-mono font-bold">{selectedInvoice.date}</span>
                </div>
                <div className="flex justify-between border-t border-b border-border-theme/40 py-2.5">
                  <span className="text-text-secondary-theme font-bold">Total Charged</span>
                  <span className="text-primary-theme font-mono font-black">{selectedInvoice.amount}</span>
                </div>

                <button
                  onClick={() => {
                    addToast('Initiating browser printer window simulator!', 'success');
                    window.print();
                  }}
                  className="w-full py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Print Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
