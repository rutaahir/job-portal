/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { BlogItem } from '../../types';

const blogs: BlogItem[] = [
  {
    id: 'blog-1',
    title: 'Top 10 Skills in Demand for 2024 and Beyond',
    category: 'Career Tips',
    date: 'May 20, 2026',
    author: 'TechnoAdviser Team',
    readTime: '5 min read',
    summary: 'The job market is evolving rapidly, and the skills employers look for are changing every day. Staying ahead of the curve can help you future-proof your career.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    content: `### 1. Artificial Intelligence & Machine Learning
AI and ML are transforming industries and creating new opportunities across the globe. Professional skills in Python, PyTorch, and generative AI prompting are increasingly coveted by startups and enterprises alike.

### 2. Data Analysis & Interpretation
Data-driven decision making is now a must-have skill in almost every field. Understanding SQL, R, Python, and Tableau opens doors in marketing, operations, and product roles.

### 3. Cloud Computing (AWS, GCP, Azure)
With more companies transitioning to multi-cloud setups, secure cloud architectures require certified professionals who understand containers, Kubernetes, and serverless architectures.

### 4. UI/UX Design & Prototyping
As digital interfaces become the primary touchpoint for customers, the demand for highly skilled product designers who understand Figma, user testing, and micro-animations is scaling rapidly.

### 5. Cybersecurity & Risk Management
With complex digital transformation comes higher risk. Ethical hacking, encryption standards, and threat vector analysis are vital to modern tech companies.`,
  },
  {
    id: 'blog-2',
    title: 'How to Write a Resume That Gets You Hired',
    category: 'Resume Guides',
    date: 'May 18, 2026',
    author: 'Aditya Nair',
    readTime: '8 min read',
    summary: 'Tips and strategies to organize a stand-out resume that beats the ATS filters and catches recruiter attention instantly.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    content: '### The Power of ATS Optimization\nMost medium-to-large size employers use Applicant Tracking Systems (ATS) to filter CVs. If your resume does not contain the exact skill keywords and formatting that the software expects, human eyes may never see your application.\n\n### Formatting Golden Rules\n1. Keep it to one or two pages maximum.\n2. Use a standard font like Inter, Arial, or Georgia.\n3. Save and export as a clean, text-searchable PDF.',
  },
  {
    id: 'blog-3',
    title: 'Top Interview Questions and How to Answer Them',
    category: 'Interview Prep',
    date: 'May 15, 2026',
    author: 'Aditi Roy',
    readTime: '10 min read',
    summary: 'Prepare confidently with our analysis of the most common recruiter questions and behavioral prompts.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    content: '### Tell Me About Yourself\nDo not recite your entire chronological career. Instead, focus on a brief elevator pitch summarizing your biggest skills, your recent achievements, and why you are excited about this specific role.\n\n### What are Your Salary Expectations?\nConduct market research first. Use salary explorer tools to look up average bands for your region. Provide a comfortable range rather than a single fixed number, noting that your requirements depend on the full benefits package.',
  },
];

export default function BlogListing() {
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);

  const categories = ['All Categories', 'Career Tips', 'Resume Guides', 'Interview Prep', 'Industry Insights'];
  const [activeCategory, setActiveCategory] = useState('All Categories');

  const filteredBlogs = activeCategory === 'All Categories'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <AnimatePresence mode="wait">
        {!selectedBlog ? (
          /* Blog Grid View */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-primary-theme font-mono uppercase tracking-widest">
                Resource Hub
              </span>
              <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-text-primary-theme tracking-tight">
                Insights, Tips & Updates <br />to <span className="text-primary-theme">Grow Your Career</span>
              </h1>
              <p className="text-text-secondary-theme font-normal text-sm sm:text-base leading-relaxed">
                Stay updated with the latest career advice, recruitment trends, resume parsing hacks, and expert interview preparation techniques.
              </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-primary-theme border-primary-theme text-white shadow-sm'
                      : 'bg-surface-theme border-border-theme text-text-secondary-theme hover:text-text-primary-theme'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  layoutId={`blog-card-${blog.id}`}
                  onClick={() => setSelectedBlog(blog)}
                  className="bg-surface-theme rounded-3xl border border-border-theme overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Cover image */}
                    <div className="h-48 w-full bg-border-theme relative overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <span className="absolute top-4 left-4 bg-primary-theme text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full shadow-md">
                        {blog.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-4 text-[10px] font-semibold text-text-muted-theme font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {blog.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {blog.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-text-primary-theme leading-snug hover:text-primary-theme transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-text-secondary-theme leading-relaxed">
                        {blog.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-border-theme/40 mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-text-secondary-theme flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary-theme" />
                      {blog.author}
                    </span>
                    <span className="text-xs font-bold text-primary-theme hover:underline">
                      Read Article &rarr;
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Blog Detail View */
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="flex items-center gap-2 text-xs font-bold text-text-secondary-theme hover:text-primary-theme group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Articles
            </button>

            {/* Article Cover */}
            <div className="h-[340px] w-full rounded-3xl overflow-hidden border border-border-theme relative shadow-md bg-border-theme">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-6 left-6 bg-primary-theme text-white text-xs uppercase tracking-wider font-extrabold px-4 py-1.5 rounded-full shadow-lg">
                {selectedBlog.category}
              </span>
            </div>

            {/* Meta Title */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted-theme font-semibold font-mono border-b border-border-theme pb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary-theme" />
                  {selectedBlog.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary-theme" />
                  By {selectedBlog.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary-theme" />
                  {selectedBlog.readTime}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-text-primary-theme leading-tight">
                {selectedBlog.title}
              </h1>
            </div>

            {/* Two-Column Article Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Content Column */}
              <div className="lg:col-span-8 bg-surface-theme p-6 md:p-8 rounded-3xl border border-border-theme space-y-6">
                <div className="prose max-w-none text-text-secondary-theme text-sm leading-relaxed space-y-4">
                  {/* Since we don't have Markdown parser installed, let's write simple custom paragraph renderer or handle newlines elegantly */}
                  {selectedBlog.content.split('\n\n').map((para, i) => {
                    if (para.startsWith('###')) {
                      return (
                        <h3 key={i} className="text-lg font-bold text-text-primary-theme pt-4">
                          {para.replace('###', '').trim()}
                        </h3>
                      );
                    }
                    return <p key={i}>{para}</p>;
                  })}
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Share Card */}
                <div className="bg-surface-theme p-6 rounded-3xl border border-border-theme space-y-4 shadow-sm">
                  <h4 className="text-sm font-bold text-text-primary-theme border-b border-border-theme pb-2.5 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-primary-theme" />
                    Share This Post
                  </h4>
                  <div className="flex gap-3">
                    <button className="p-2.5 bg-primary-theme/5 hover:bg-primary-theme hover:text-white rounded-xl text-primary-theme transition-all cursor-pointer flex-1 flex justify-center">
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-primary-theme/5 hover:bg-primary-theme hover:text-white rounded-xl text-primary-theme transition-all cursor-pointer flex-1 flex justify-center">
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-primary-theme/5 hover:bg-primary-theme hover:text-white rounded-xl text-primary-theme transition-all cursor-pointer flex-1 flex justify-center">
                      <Linkedin className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Related Articles */}
                <div className="bg-surface-theme p-6 rounded-3xl border border-border-theme space-y-4 shadow-sm">
                  <h4 className="text-sm font-bold text-text-primary-theme border-b border-border-theme pb-2.5">
                    Other Related Posts
                  </h4>
                  <div className="space-y-4">
                    {blogs
                      .filter((b) => b.id !== selectedBlog.id)
                      .slice(0, 2)
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedBlog(item)}
                          className="flex gap-3 items-center group cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-lg bg-border-theme overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] text-primary-theme font-bold font-mono">{item.date}</div>
                            <h5 className="text-xs font-bold text-text-primary-theme group-hover:text-primary-theme transition-colors line-clamp-1 leading-snug">
                              {item.title}
                            </h5>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
