/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, ThumbsUp, Plus, X, Check, HelpCircle, AlertCircle } from 'lucide-react';

interface CompanyReviewsFeedProps {
  addToast: (text: string, type: 'success' | 'info') => void;
}

interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  title: string;
  pros: string;
  cons: string;
  helpfulCount: number;
  hasVoted?: boolean;
}

export default function CompanyReviewsFeed({ addToast }: CompanyReviewsFeedProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review Form state
  const [formRating, setFormRating] = useState(5);
  const [formRole, setFormRole] = useState('Software Engineer');
  const [formTitle, setFormTitle] = useState('');
  const [formPros, setFormPros] = useState('');
  const [formCons, setFormCons] = useState('');

  // Initial Review data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      author: 'Verified Employee',
      role: 'Software Engineer (Current Employee)',
      rating: 5,
      date: '2 days ago',
      title: 'Superb learning opportunities and supportive engineering mentors',
      pros: 'Excellent work culture, transparent leadership, and structured performance reviews. Very good work life balance compared to other IT consultancies.',
      cons: 'The corporate appraisal cycle takes slightly longer, and training compliance models can feel rigid.',
      helpfulCount: 45,
    },
    {
      id: 'rev-2',
      author: 'Anonymous Employee',
      role: 'UI Designer (Former Employee)',
      rating: 4,
      date: '5 days ago',
      title: 'Creative design autonomy but strict appraisal hierarchies',
      pros: 'I got to design enterprise applications for massive clients. The work environment was fun, and we had great internal design community meetups.',
      cons: 'Appraisals are heavily guided by direct managers, leading to variance in career growth rates across different departments.',
      helpfulCount: 18,
    },
    {
      id: 'rev-3',
      author: 'Anonymous Employee',
      role: 'Product Manager (Current Employee)',
      rating: 4,
      date: '1 week ago',
      title: 'Fast-paced execution with decent career advancement',
      pros: 'Great collaboration between product managers and clients. The scale of project impact is highly satisfying.',
      cons: 'Sometimes resource allocations can feel sparse, leading to short periods of tight delivery timelines.',
      helpfulCount: 22,
    },
  ]);

  const categories = [
    { label: 'All', count: '12.5k' },
    { label: 'Work Culture', count: '4.2k' },
    { label: 'Learning', count: '3.8k' },
    { label: 'Work Life Balance', count: '3.5k' },
    { label: 'Job Security', count: '2.9k' },
  ];

  const reviewHighlights = [
    { label: 'Work Culture', score: 4.2 },
    { label: 'Learning & Growth', score: 4.1 },
    { label: 'Work Life Balance', score: 4.0 },
    { label: 'Salary & Benefits', score: 3.8 },
    { label: 'Career Growth', score: 4.2 },
  ];

  const handleHelpfulVote = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (r.hasVoted) return r;
          addToast('Thank you for flagging this review as helpful!', 'success');
          return { ...r, helpfulCount: r.helpfulCount + 1, hasVoted: true };
        }
        return r;
      })
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formPros || !formCons) {
      addToast('Please complete all form fields to submit review!', 'info');
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: 'Anonymous Guest Seeker',
      role: `${formRole} (Verified Reviewer)`,
      rating: formRating,
      date: 'Just now',
      title: formTitle,
      pros: formPros,
      cons: formCons,
      helpfulCount: 0,
    };

    setReviews([newReview, ...reviews]);
    setIsModalOpen(false);
    addToast('Review successfully submitted to review validation servers!', 'success');

    // Reset form
    setFormRating(5);
    setFormRole('Software Engineer');
    setFormTitle('');
    setFormPros('');
    setFormCons('');
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Grid Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Rating Summary (8 cols) */}
        <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Rating circle */}
            <div className="md:col-span-4 text-center space-y-2 border-b md:border-b-0 md:border-r border-border-theme/60 pb-6 md:pb-0 md:pr-6">
              <span className="text-5xl sm:text-6xl font-black text-text-primary-theme block font-serif leading-none">4.2</span>
              <div className="flex justify-center text-primary-theme">
                {[1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-current stroke-[1.5]" />
                ))}
                <div className="relative w-5 h-5 text-primary-theme">
                  <Star className="w-5 h-5 absolute fill-current" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                  <Star className="w-5 h-5 absolute opacity-30" />
                </div>
              </div>
              <span className="text-[11px] text-text-muted-theme font-bold block">Based on 12,588 ratings</span>
            </div>

            {/* Distribution bars */}
            <div className="md:col-span-8 space-y-2.5">
              {[
                { stars: 5, pct: '62%' },
                { stars: 4, pct: '23%' },
                { stars: 3, pct: '9%' },
                { stars: 2, pct: '4%' },
                { stars: 1, pct: '2%' },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs font-semibold">
                  <span className="w-3 text-right text-text-secondary-theme font-mono">{row.stars}</span>
                  <Star className="w-3.5 h-3.5 text-text-muted-theme fill-current" />
                  <div className="flex-1 h-2 bg-bg-theme border border-border-theme/40 rounded-full overflow-hidden">
                    <div className="bg-primary-theme h-full rounded-full" style={{ width: row.pct }} />
                  </div>
                  <span className="w-8 text-right text-text-muted-theme font-mono">{row.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Call To Action Box (4 cols) */}
        <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm text-center space-y-4">
          <div className="p-3 bg-primary-theme/10 text-primary-theme rounded-2xl w-12 h-12 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-text-primary-theme">Share Your Experience</h4>
            <p className="text-[10px] text-text-secondary-theme leading-relaxed">
              Help other job seekers discover the daily work culture and career growth parameters of employers.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl text-xs font-black shadow flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Write a Review
          </button>
        </div>
      </div>

      {/* 2. Main content segment with sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Reviews List Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Categories bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  activeCategory === cat.label
                    ? 'bg-primary-theme text-white shadow'
                    : 'bg-surface-theme text-text-secondary-theme border border-border-theme hover:border-text-muted-theme'
                }`}
              >
                {cat.label}
                <span className={`text-[9px] font-mono font-bold px-1.5 rounded-full ${
                  activeCategory === cat.label ? 'bg-white text-primary-theme' : 'bg-border-theme text-text-muted-theme'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Feed List */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-text-primary-theme">{rev.author}</span>
                      <span className="text-[10px] text-text-muted-theme font-bold font-mono">&middot; {rev.date}</span>
                    </div>
                    <span className="text-[10px] text-text-secondary-theme font-bold block">{rev.role}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-primary-theme/10 px-2.5 py-1 rounded-xl text-xs font-black text-primary-theme border border-primary-theme/5">
                    {rev.rating}.0 <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <div className="space-y-3.5 pt-1.5">
                  <h4 className="text-sm font-extrabold text-text-primary-theme leading-snug">
                    "{rev.title}"
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium leading-relaxed">
                    <div className="space-y-1 bg-success-theme/5 p-3 rounded-2xl border border-success-theme/10">
                      <span className="text-[10px] font-black uppercase text-success-theme block tracking-wide">Pros</span>
                      <p className="text-text-secondary-theme">{rev.pros}</p>
                    </div>
                    <div className="space-y-1 bg-error-theme/5 p-3 rounded-2xl border border-error-theme/10">
                      <span className="text-[10px] font-black uppercase text-error-theme block tracking-wide">Cons</span>
                      <p className="text-text-secondary-theme">{rev.cons}</p>
                    </div>
                  </div>
                </div>

                {/* Helpful voting */}
                <div className="border-t border-border-theme/40 pt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleHelpfulVote(rev.id)}
                    className={`text-[10px] font-black flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      rev.hasVoted
                        ? 'bg-success-theme/10 border-success-theme/20 text-success-theme cursor-default'
                        : 'bg-bg-theme border-border-theme/60 text-text-secondary-theme hover:border-text-muted-theme'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Helpful ({rev.helpfulCount})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right reviews sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-theme border border-border-theme rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h4 className="text-xs font-black uppercase text-text-primary-theme tracking-wide border-b border-border-theme pb-2.5">
              Review Highlights
            </h4>

            <div className="space-y-3.5">
              {reviewHighlights.map((hl) => (
                <div key={hl.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-text-secondary-theme">
                    <span>{hl.label}</span>
                    <span className="text-primary-theme font-mono font-black">{hl.score} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-bg-theme border border-border-theme/40 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-theme h-full rounded-full" 
                      style={{ width: `${(hl.score / 5.0) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal Form Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-surface-theme border border-border-theme rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative z-10 p-6 space-y-5"
            >
              <div className="flex justify-between items-center border-b border-border-theme pb-3.5">
                <h3 className="text-sm font-black uppercase text-text-primary-theme tracking-wide flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-primary-theme" /> Write Employer Review
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-bg-theme hover:bg-border-theme rounded-full text-text-secondary-theme cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Rating selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-secondary-theme">Overall Star Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormRating(val)}
                        className="text-primary-theme p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-7 h-7 ${val <= formRating ? 'fill-current' : 'opacity-25'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-black text-text-primary-theme font-mono ml-2">({formRating}.0 out of 5)</span>
                  </div>
                </div>

                {/* Role select */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-secondary-theme">Your Corporate Designation</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. UX Designer"
                    className="w-full bg-bg-theme border border-border-theme rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-secondary-theme">Review Heading</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Briefly state your biggest feedback summary..."
                    className="w-full bg-bg-theme border border-border-theme rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>

                {/* Pros and cons */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-secondary-theme">Pros (What do you like?)</label>
                  <textarea
                    rows={2}
                    value={formPros}
                    onChange={(e) => setFormPros(e.target.value)}
                    placeholder="Healthy balance, cooperative mentors, tech budgets..."
                    className="w-full bg-bg-theme border border-border-theme rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-secondary-theme">Cons (Areas of improvement?)</label>
                  <textarea
                    rows={2}
                    value={formCons}
                    onChange={(e) => setFormCons(e.target.value)}
                    placeholder="Longer appraisal pipelines, rigorous reporting policies..."
                    className="w-full bg-bg-theme border border-border-theme rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary-theme text-white hover:bg-primary-hover-theme text-xs font-black rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Publish Verified Feedback
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
