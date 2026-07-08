/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Info } from 'lucide-react';

const candidatePlans = [
  {
    name: 'Free Basic',
    price: '₹0',
    period: '/month',
    features: [
      '5 Auto-Matched jobs/week (Admin Configured)',
      'Basic profile visibility to employers',
      'Standard application limits (30/month)',
      'Community board access',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    name: 'Career Plus',
    price: '₹499',
    period: '/month',
    features: [
      '30 Auto-Matched jobs/week',
      'Priority placement in search lists',
      'AI Resume Audit & Score Enhancer',
      'Cover letter automated assistant',
      'Unlocked salary explorer details',
    ],
    cta: 'Upgrade to Plus',
    popular: true,
  },
  {
    name: 'Career Premium',
    price: '₹1,199',
    period: '/month',
    features: [
      'Unlimited auto-matching & alerts',
      'Super-boost profile highlight',
      'Mock interview AI copilot (interactive)',
      '1-on-1 resume review feedback report',
      'Direct messaging to verified recruiters',
    ],
    cta: 'Go Premium',
    popular: false,
  },
];

const recruiterPlans = [
  {
    name: 'Starter',
    price: '₹3,499',
    period: '/month',
    features: [
      '1 Active Job Post',
      'Access to Basic Candidates (capped lists)',
      'Standard resume parsing',
      'Analytics basic dashboard',
      '1 Recruiter Seat',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: '₹7,999',
    period: '/month',
    features: [
      '5 Active Job Posts',
      'AI Candidate Auto-Matching (No Caps)',
      'Advanced ATS Pipeline with columns',
      'Direct interview scheduler integration',
      'Priority customer support',
      '3 Team Collaboration Seats',
    ],
    cta: 'Get Professional',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited Job Posts',
      'Full Database Resume Unlocks',
      'Custom integrations (Slack, Jira, etc.)',
      'Dedicated recruiter support manager',
      'Custom SLA, contract invoicing',
      'Unlimited Seat Accounts',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

interface PricingProps {
  onSelectPlan: (planName: string, price: string) => void;
}

export default function Pricing({ onSelectPlan }: PricingProps) {
  const [billingRole, setBillingRole] = useState<'jobSeeker' | 'employer'>('jobSeeker');

  const currentPlans = billingRole === 'jobSeeker' ? candidatePlans : recruiterPlans;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
    >
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-primary-theme font-mono uppercase tracking-widest">
          Pricing Plans
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-text-primary-theme tracking-tight">
          Simple, Transparent <br />Pricing for <span className="text-primary-theme">Everyone</span>
        </h1>
        <p className="text-text-secondary-theme font-normal text-sm sm:text-base">
          Choose a plan that fits your goals. Upgrade or downgrade at any time with no hidden fees or transaction commissions.
        </p>

        {/* Toggle Selector */}
        <div className="flex justify-center pt-4">
          <div className="bg-surface-theme border border-border-theme p-1 rounded-full flex gap-1 shadow-sm">
            <button
              onClick={() => setBillingRole('jobSeeker')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                billingRole === 'jobSeeker'
                  ? 'bg-primary-theme text-white shadow-md'
                  : 'text-text-secondary-theme hover:text-text-primary-theme'
              }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setBillingRole('employer')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                billingRole === 'employer'
                  ? 'bg-primary-theme text-white shadow-md'
                  : 'text-text-secondary-theme hover:text-text-primary-theme'
              }`}
            >
              For Employers
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {currentPlans.map((plan, index) => (
          <div
            key={plan.name}
            className={`bg-surface-theme border rounded-3xl p-8 relative shadow-sm hover:shadow-lg transition-all flex flex-col justify-between ${
              plan.popular ? 'border-primary-theme ring-2 ring-primary-theme/10 scale-[1.02]' : 'border-border-theme'
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary-theme text-white text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full shadow-md">
                Most Popular
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-text-primary-theme">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-serif font-extrabold text-text-primary-theme">
                    {plan.price}
                  </span>
                  <span className="text-xs text-text-muted-theme font-medium font-sans">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3.5 border-t border-border-theme pt-6">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-xs text-text-secondary-theme leading-relaxed">
                    <div className="p-0.5 bg-primary-theme/10 rounded-full text-primary-theme mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onSelectPlan(plan.name, plan.price)}
                className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  plan.popular
                    ? 'bg-primary-theme hover:bg-primary-hover-theme text-white shadow-md'
                    : 'bg-surface-theme border border-border-theme hover:bg-border-theme text-text-primary-theme'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-text-muted-theme flex items-center justify-center gap-2 max-w-md mx-auto bg-primary-theme/5 p-4 rounded-xl border border-primary-theme/10">
        <Info className="w-4 h-4 text-primary-theme flex-shrink-0" />
        <span>All plans include a 14-day free trial. No credit card required. Cancel or modify subscription in billing settings.</span>
      </div>
    </motion.div>
  );
}
