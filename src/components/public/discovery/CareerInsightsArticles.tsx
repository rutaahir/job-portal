/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Clock, Tag, ArrowRight, X, ArrowLeft, Heart, Share2, Sparkles } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  content: string;
  likes: number;
}

export default function CareerInsightsArticles() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);

  // Professional Mock Career Articles
  const articles: Article[] = [
    {
      id: 'art-1',
      title: 'How to Build an Outstanding ATS-Friendly Resume in 2026',
      category: 'Resume Tips',
      readTime: '5 min read',
      date: 'July 4, 2026',
      summary: 'Corporate HR departments rely heavily on AI filters. Discover structural keywords, design boundaries, and experience formats that pass screening engines effortlessly.',
      content: `The resume evaluation landscape is evolving rapidly. More than 98% of Fortune 500 corporations utilize Applicant Tracking Systems (ATS) to filter, rate, and index candidate submittals before any human recruiter reads them.

How to guarantee compatibility:
1. Use Standard Section Headers: Standard headers like "Professional Experience", "Education", and "Technical Skills" are easily parsed. Avoid creative titles like "Where I have Been".
2. Incorporate exact keywords matching the job description: Analyze the target posting for repeating skill-terms (e.g. "React", "TypeScript", "UI design") and place them logically.
3. Keep layouts clean: Multi-column tables, SVG graphs, and floating graphics often choke parsing compilers. Stick to a clean, structural single-column layout with generous spacing.`,
      likes: 128,
    },
    {
      id: 'art-2',
      title: 'Cracking the AI-Assisted Interview: Interactive Guidelines',
      category: 'Interviews',
      readTime: '7 min read',
      date: 'June 28, 2026',
      summary: 'Automated video interviewing platforms assess tone, speed, and structural answers. Learn how to present yourself confidently to algorithmic panels.',
      content: `Many technical screenings are now assisted or entirely driven by AI recording interfaces. These models analyze your speech patterns, answers structure, and tech key terms.

Key rules to succeed:
1. Structure answers with the STAR method (Situation, Task, Action, Result). Algorithmic scorers look for this logical flow in verbal transcripts.
2. Maintain clean, deliberate pacing. Speaking too fast or using excessive fillers (e.g., "like", "um") degrades scoring indices.
3. Center your camera framing and verify high-quality lighting. Solid visual framing conveys professionalism.`,
      likes: 94,
    },
    {
      id: 'art-3',
      title: 'Salary Negotiation: How to Leverage Multiple Offers Confidently',
      category: 'Salary',
      readTime: '6 min read',
      date: 'May 15, 2026',
      summary: 'Secured multiple tech opportunities? Master the art of professional alignment to secure higher compensation bands without souring recruiter relations.',
      content: `Receiving multiple job offers is the absolute best leverage you can hold during salary negotiations. However, executing this poorly can seem arrogant or manipulative.

How to handle this professionally:
1. Always express genuine gratitude and enthusiasm first. Recite what excites you about the corporate vision.
2. Be transparent but collaborative. Inform the recruiter: "I have received another competitive offer at a higher compensation band, but this position is my top choice. Is there flexibility to adjust the base compensation to help close my decision?"
3. Avoid ultimatums. Frame your conversations around collaborative long-term value.`,
      likes: 212,
    },
  ];

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedArticles((prev) =>
      prev.includes(id) ? prev.filter((aId) => aId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-text-primary-theme flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-primary-theme animate-pulse" />
            Career Development Insights
          </h2>
          <p className="text-[11px] text-text-secondary-theme font-medium leading-relaxed max-w-2xl">
            Read verified guides and methodologies curated by industry leaders to accelerate resume screenings, conquer behavioral panels, and optimize compensation negotiations.
          </p>
        </div>
      </div>

      {/* Main Articles Grid Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => {
          const isLiked = likedArticles.includes(art.id);
          const currentLikes = isLiked ? art.likes + 1 : art.likes;
          return (
            <motion.div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-surface-theme border border-border-theme hover:border-primary-theme/45 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] text-text-muted-theme font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-primary-theme">
                    <Tag className="w-3 h-3" /> {art.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {art.readTime}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-text-primary-theme group-hover:text-primary-theme transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-text-secondary-theme line-clamp-3 leading-relaxed font-medium">
                  {art.summary}
                </p>
              </div>

              {/* Bottom stats row */}
              <div className="border-t border-border-theme/40 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-text-muted-theme font-bold">{art.date}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleToggleLike(art.id, e)}
                    className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all ${
                      isLiked
                        ? 'bg-red-500/10 border-red-500/20 text-red-500'
                        : 'bg-bg-theme border-border-theme/60 text-text-muted-theme hover:text-text-primary-theme'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    {currentLikes}
                  </button>
                  <span className="text-xs font-bold text-primary-theme group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Read &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reading Article Modal Dialog */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-surface-theme border border-border-theme rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative z-10 p-6 sm:p-8 space-y-6"
            >
              {/* Heading Close Button */}
              <div className="flex justify-between items-center border-b border-border-theme/40 pb-4">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-1 text-xs font-bold text-text-secondary-theme hover:text-primary-theme cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Guides
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 bg-bg-theme hover:bg-border-theme rounded-full text-text-secondary-theme cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & metadata */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-text-muted-theme tracking-wider">
                  <span className="text-primary-theme">{selectedArticle.category}</span>
                  <span>&middot;</span>
                  <span>{selectedArticle.readTime}</span>
                  <span>&middot;</span>
                  <span>{selectedArticle.date}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-text-primary-theme leading-snug">
                  {selectedArticle.title}
                </h2>
              </div>

              {/* Content body formatted elegantly */}
              <div className="text-xs sm:text-sm text-text-secondary-theme font-medium leading-relaxed whitespace-pre-wrap space-y-4">
                {selectedArticle.content}
              </div>

              {/* Share/Like actions footer */}
              <div className="border-t border-border-theme/40 pt-5 flex items-center justify-between">
                <button
                  onClick={(e) => handleToggleLike(selectedArticle.id, e)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    likedArticles.includes(selectedArticle.id)
                      ? 'bg-red-500/10 border-red-500/20 text-red-500'
                      : 'bg-bg-theme border-border-theme text-text-secondary-theme hover:border-text-muted-theme'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedArticles.includes(selectedArticle.id) ? 'fill-current' : ''}`} />
                  Appreciate Guide ({likedArticles.includes(selectedArticle.id) ? selectedArticle.likes + 1 : selectedArticle.likes})
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 bg-primary-theme text-white hover:bg-primary-hover-theme text-xs font-black rounded-xl cursor-pointer shadow-sm"
                >
                  Done Reading
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
