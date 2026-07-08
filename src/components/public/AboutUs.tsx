/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Shield, Lightbulb, UserPlus, Users, Flame, Calendar, Award, CheckCircle, ArrowRight, Share2 } from 'lucide-react';

interface AboutUsProps {
  onNavigateToPage: (page: string) => void;
}

export default function AboutUs({ onNavigateToPage }: AboutUsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const stats = [
    { label: 'Active Job Listings', value: '12,580+', icon: Award },
    { label: 'Companies Hiring', value: '5,200+', icon: Users },
    { label: 'Registered Users', value: '2.4M+', icon: UserPlus },
    { label: 'Success Rate', value: '98%', icon: CheckCircle },
    { label: 'Years of Excellence', value: '15+', icon: Calendar },
  ];

  const values = [
    {
      title: 'Integrity',
      desc: 'We build trust through transparency and honesty. We hold candidate credentials and recruiter verifications to absolute legal standards.',
      icon: Shield,
    },
    {
      title: 'Innovation',
      desc: 'We embrace technology to create better solutions. From deep neural NLP parsers to streamlined pipeline column managers.',
      icon: Lightbulb,
    },
    {
      title: 'Empowerment',
      desc: 'We empower individuals to achieve their dreams by revealing matching scores, skill gaps, and custom predictions.',
      icon: Users,
    },
    {
      title: 'Collaboration',
      desc: 'We believe in teamwork and shared success, ensuring employers and recruiters can smoothly invite team seats.',
      icon: Share2,
    },
    {
      title: 'Impact',
      desc: 'We are committed to making a positive impact on career trajectories, reducing placement latency worldwide.',
      icon: Flame,
    },
  ];

  const journey = [
    {
      year: '2010',
      title: 'The Beginning',
      desc: 'TechnoAdviser was founded with a vision to revolutionize the recruitment industry.',
    },
    {
      year: '2013',
      title: 'Growth Phase',
      desc: 'Expanded our platform and added advanced job matching technology.',
    },
    {
      year: '2016',
      title: 'AI-Integration',
      desc: 'Introduced AI-powered features for smarter hiring and career guidance.',
    },
    {
      year: '2020',
      title: 'Global Reach',
      desc: 'Reached millions of users and partnered with leading companies worldwide.',
    },
    {
      year: '2024',
      title: 'Future-Ready',
      desc: 'Continuing our mission with innovative solutions for the future of work.',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24"
    >
      {/* Upper Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold text-primary-theme font-mono uppercase tracking-widest">
            About TechnoAdviser
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-text-primary-theme tracking-tight leading-tight">
            Empowering Careers.<br />
            Transforming <span className="text-primary-theme">Futures</span>.
          </h1>
          <p className="text-text-secondary-theme font-normal text-sm sm:text-base leading-relaxed">
            TechnoAdviser is an AI-powered job portal on a mission to bridge the gap between talent and opportunities. We help job seekers discover the right career paths and assist businesses in finding the perfect talent.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigateToPage('Why TechnoAdviser')}
              className="px-6 py-3.5 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl font-bold text-sm transition-colors shadow-md flex items-center gap-2"
            >
              Our Mission <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateToPage('Contact Us')}
              className="px-6 py-3.5 bg-surface-theme hover:bg-border-theme text-text-primary-theme border border-border-theme rounded-xl font-bold text-sm transition-colors shadow-sm"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Right Side - Picture and Vision Card Overlay */}
        <div className="lg:col-span-6 relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[16/10] border border-border-theme relative bg-border-theme">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
              alt="TechnoAdviser Office Meeting Space"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />
          </div>

          {/* Floating Vision Card overlay */}
          <div className="absolute top-[-30px] left-[5%] md:left-[-40px] bg-surface-theme p-6 rounded-2xl shadow-xl border border-border-theme max-w-[280px] space-y-3 z-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-theme/10 rounded-lg text-primary-theme">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-text-primary-theme">Our Vision</h4>
            </div>
            <p className="text-xs text-text-secondary-theme leading-relaxed">
              To become the most trusted global platform for career growth and talent transformation.
            </p>
          </div>

          {/* Floating Happy Users badge */}
          <div className="absolute bottom-[-30px] right-[5%] bg-surface-theme p-4 rounded-2xl shadow-xl border border-border-theme flex items-center gap-3 z-20">
            <div className="p-2.5 bg-success-theme/10 rounded-xl text-success-theme">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-text-muted-theme font-bold uppercase font-mono tracking-wider">Happy Users</div>
              <div className="text-sm font-extrabold text-text-primary-theme">2.4M+ Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <motion.div
        variants={itemVariants}
        className="bg-surface-theme rounded-3xl border border-border-theme p-8 md:p-10 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center space-y-2 flex flex-col items-center">
              <div className="p-2 bg-primary-theme/5 rounded-xl text-primary-theme">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-text-primary-theme font-serif tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-text-secondary-theme uppercase font-mono tracking-wider">
                {stat.label}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Core Values */}
      <div className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold text-primary-theme font-mono uppercase tracking-widest">
            Our Culture
          </span>
          <h2 className="text-3xl font-serif font-extrabold text-text-primary-theme tracking-tight">
            Our <span className="text-primary-theme">Core Values</span>
          </h2>
          <p className="text-text-secondary-theme text-sm">
            The principles that guide our day-to-day operations and help us deliver exceptional services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                variants={itemVariants}
                className="bg-surface-theme p-6 rounded-2xl border border-border-theme shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-primary-theme/5 text-primary-theme rounded-xl w-fit">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-text-primary-theme">{v.title}</h3>
                <p className="text-xs text-text-secondary-theme leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Timeline Journey */}
      <div className="space-y-12 pb-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold text-primary-theme font-mono uppercase tracking-widest">
            History
          </span>
          <h2 className="text-3xl font-serif font-extrabold text-text-primary-theme tracking-tight">
            Our <span className="text-primary-theme">Journey</span>
          </h2>
          <p className="text-text-secondary-theme text-sm">
            How we evolved from a small recruitment tool to an industry-leading AI intelligence engine.
          </p>
        </div>

        {/* Timeline graphics */}
        <div className="relative mt-8">
          {/* Horizontal line for desktop */}
          <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-0.5 bg-border-theme -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {journey.map((item, index) => (
              <div key={item.year} className="text-center flex flex-col items-center gap-4 relative">
                {/* Connector point */}
                <div className="w-14 h-14 rounded-full bg-surface-theme border-2 border-primary-theme text-primary-theme flex items-center justify-center font-extrabold text-sm shadow-md font-mono">
                  {item.year}
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-text-primary-theme">{item.title}</h4>
                  <p className="text-xs text-text-secondary-theme leading-relaxed max-w-[200px] mx-auto">
                    {item.desc}
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
