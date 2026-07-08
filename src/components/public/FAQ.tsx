/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

const faqs = [
  {
    question: 'What is TechnoAdviser?',
    answer: 'TechnoAdviser is an AI-powered job portal that connects top talent with premium employers. We offer intelligent job matching, candidate sourcing systems, and smart career enhancement tools.',
  },
  {
    question: 'How does AI matching work?',
    answer: 'Our proprietary algorithm analyzes your resume structure, skills, and experience, then cross-references them against job requirements. It calculates a multi-dimensional match score, highlighting your strengths and pointing out skill gaps to help you optimize your applications.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We follow strict GDPR and ISO-27001 data practices. Your profile is encrypted, and you have complete control over who can view your CV and personal information via the Privacy Settings panel.',
  },
  {
    question: 'How can I create a profile?',
    answer: 'Simply click "Sign Up" at the top right, select the "Job Seeker" role, verify your email, and go through our simple 3-step onboarding wizard. You can upload an existing resume to auto-fill your details.',
  },
  {
    question: 'Can I apply for jobs for free?',
    answer: 'Yes, basic searches and direct manual job applications are always 100% free. The paid Plus/Premium plans unlock daily automated recommendation matches, priority candidate placements, and deep AI-driven resume optimization audits.',
  },
  {
    question: 'How do employers post jobs?',
    answer: 'Employers can register for an Employer Account, select a subscription package suited to their hiring volume, and write requirements via our smart job-composer wizard. This includes dynamic screening questions and instant automated matching against our candidate database.',
  },
];

interface FAQProps {
  onNavigateToPage: (page: string) => void;
}

export default function FAQ({ onNavigateToPage }: FAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-primary-theme font-mono uppercase tracking-widest flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-primary-theme" />
          FAQ
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-text-primary-theme tracking-tight">
          Frequently Asked <br /><span className="text-primary-theme">Questions</span>
        </h1>
        <p className="text-text-secondary-theme font-normal text-sm sm:text-base">
          Find answers to the most common questions about TechnoAdviser, our algorithm matching score, billing methods, and verification guidelines.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4 pt-4">
        {faqs.map((faq, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className="bg-surface-theme border border-border-theme rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
              >
                <span className="text-sm sm:text-base font-extrabold text-text-primary-theme">
                  {faq.question}
                </span>
                <span
                  className={`p-1.5 bg-primary-theme/5 text-primary-theme rounded-xl transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 bg-primary-theme text-white' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-text-secondary-theme leading-relaxed border-t border-border-theme/40 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Still Have Questions CTA */}
      <div className="bg-primary-theme/5 border border-primary-theme/10 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto mt-12">
        <h3 className="text-base font-bold text-text-primary-theme">Still have questions?</h3>
        <p className="text-xs text-text-secondary-theme">
          Can't find the answers you're looking for? Reach out to our customer happiness support desk, and we will help you resolve any issues or setup questions.
        </p>
        <button
          onClick={() => onNavigateToPage('Contact Us')}
          className="px-6 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-full font-bold text-xs transition-colors shadow-md inline-flex items-center gap-1.5 cursor-pointer"
        >
          Contact Us <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
