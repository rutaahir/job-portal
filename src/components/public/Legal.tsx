/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Scale, Cookie, Calendar } from 'lucide-react';

export default function Legal() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy');

  const policies = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Your Privacy Matters',
      lastUpdated: 'Last updated: May 20, 2026',
      intro: 'At TechnoAdviser, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.',
      sections: [
        {
          num: '1',
          heading: 'Information We Collect',
          details: 'We collect personal identification details (name, email address, phone number), professional credentials (resumes, work history, skills, portfolios), and technical data (cookies, IP address, device location) to ensure precise job matching.'
        },
        {
          num: '2',
          heading: 'How We Use Your Information',
          details: 'We use the collected parameters to match profiles with jobs, coordinate interview schedules, generate cover letters, and provide detailed analytics insights. We never trade or rent your CV or contact details to third-party marketing companies.'
        },
        {
          num: '3',
          heading: 'Your Rights & Controls (GDPR)',
          details: 'Under GDPR mandates, you retain absolute rights to view, modify, download, or fully delete your personal account and historical activity records. You can do so at any time via the Privacy Center under Account Settings.'
        }
      ]
    },
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'Terms of Platform Usage',
      lastUpdated: 'Last updated: May 15, 2026',
      intro: 'Welcome to TechnoAdviser. By accessing or using our platform, services, and matching tools, you agree to comply with and be bound by these Terms and Conditions.',
      sections: [
        {
          num: '1',
          heading: 'Acceptance of Terms',
          details: 'The services are provided under these Terms. If you do not agree to all terms, you must not use or access our matching console or post job vacancies on behalf of your companies.'
        },
        {
          num: '2',
          heading: 'Use of the Platform',
          details: 'You must provide accurate, complete, and updated information. You are solely responsible for keeping your password and 2FA credentials confidential. Scraping profile or job information is strictly prohibited.'
        },
        {
          num: '3',
          heading: 'Intellectual Property',
          details: 'All matching algorithms, visual elements, layout code, assets, and design system variables remain the exclusive property of TechnoAdviser Technologies Pvt. Ltd.'
        }
      ]
    },
    cookies: {
      title: 'Cookies Policy',
      subtitle: 'Cookies and Tracking',
      lastUpdated: 'Last updated: May 12, 2026',
      intro: 'This Cookies Policy explains how TechnoAdviser uses cookies and similar tracking technologies to recognize you when you visit our website and portals.',
      sections: [
        {
          num: '1',
          heading: 'What are Cookies?',
          details: 'Cookies are small text data files saved on your computer or browser when you access websites. They help us remember login states and layout preferences.'
        },
        {
          num: '2',
          heading: 'Types of Cookies We Use',
          details: 'We use Essential Cookies (for logging in and session guard), Performance/Analytics Cookies (to analyze platform user growth, heatmap, and churn), and Functional Cookies (to remember theme selections and filters).'
        },
        {
          num: '3',
          heading: 'Managing Cookies',
          details: 'You can control, customize, or disable cookies at any time. Click the "Cookie preferences" link in our footer to open the granular categorization toggles.'
        }
      ]
    }
  };

  const activePolicy = policies[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs (Left side) */}
        <div className="lg:col-span-3 space-y-3">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full text-left p-4 rounded-xl font-bold text-xs flex items-center gap-3 border transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-primary-theme/5 border-primary-theme text-primary-theme'
                : 'bg-surface-theme border-border-theme text-text-secondary-theme hover:text-text-primary-theme'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`w-full text-left p-4 rounded-xl font-bold text-xs flex items-center gap-3 border transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-primary-theme/5 border-primary-theme text-primary-theme'
                : 'bg-surface-theme border-border-theme text-text-secondary-theme hover:text-text-primary-theme'
            }`}
          >
            <Scale className="w-4 h-4" />
            Terms & Conditions
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`w-full text-left p-4 rounded-xl font-bold text-xs flex items-center gap-3 border transition-all cursor-pointer ${
              activeTab === 'cookies'
                ? 'bg-primary-theme/5 border-primary-theme text-primary-theme'
                : 'bg-surface-theme border-border-theme text-text-secondary-theme hover:text-text-primary-theme'
            }`}
          >
            <Cookie className="w-4 h-4" />
            Cookies Policy
          </button>
        </div>

        {/* Content Area (Right side) */}
        <div className="lg:col-span-9 bg-surface-theme p-8 md:p-10 rounded-3xl border border-border-theme space-y-6">
          <div className="space-y-2 border-b border-border-theme/60 pb-4">
            <span className="text-[10px] text-primary-theme font-bold uppercase font-mono tracking-widest flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {activePolicy.lastUpdated}
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-extrabold text-text-primary-theme">
              {activePolicy.subtitle}
            </h1>
            <p className="text-xs text-text-muted-theme font-semibold">
              Category: {activePolicy.title}
            </p>
          </div>

          <p className="text-sm text-text-secondary-theme font-medium leading-relaxed italic">
            "{activePolicy.intro}"
          </p>

          <div className="space-y-6 pt-4">
            {activePolicy.sections.map((sec) => (
              <div key={sec.num} className="space-y-2 flex gap-4 items-start border-l-2 border-primary-theme/25 pl-4 py-1">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-text-primary-theme">
                    {sec.num}. {sec.heading}
                  </h3>
                  <p className="text-xs text-text-secondary-theme leading-relaxed">
                    {sec.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
