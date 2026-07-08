/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle2, ChevronRight, HelpCircle, ArrowLeft, RefreshCw, Trophy, Download } from 'lucide-react';

interface AssessmentsSectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function AssessmentsSection({ addToast }: AssessmentsSectionProps) {
  const [activeTest, setActiveTest] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  
  const testQuestions = [
    {
      q: "Which line height parameter is ideal for reading general body typography in modern UI design?",
      options: ["1.0x to 1.2x of font size", "1.4x to 1.6x of font size", "2.0x+ of font size"],
      correct: 1
    },
    {
      q: "What color model profile is strictly optimized for digital screen display layouts?",
      options: ["CMYK", "Pantone Formula", "sRGB / HEX"],
      correct: 2
    },
    {
      q: "In an atomic design hierarchy, what would a complete form field (label + input + button) represent?",
      options: ["Atom", "Molecule", "Organism"],
      correct: 1
    }
  ];

  const handleAnswerSelect = (index: number) => {
    const updated = [...answers, index];
    setAnswers(updated);

    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestCompleted(true);
      addToast('Skills assessment completed!', 'success');
    }
  };

  const getScorePercentage = () => {
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans === testQuestions[idx].correct) score++;
    });
    return Math.round((score / testQuestions.length) * 100);
  };

  const resetTest = () => {
    setActiveTest(false);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const recentAssessments = [
    { title: 'UI/UX Design Assessment', score: '85%', date: '10 May 2024', status: 'Completed' },
    { title: 'Figma Skills Test', score: '92%', date: '08 May 2024', status: 'Completed' },
    { title: 'Design Thinking Test', score: '60%', date: '12 May 2024', status: 'In Progress' },
    { title: 'User Research Assessment', score: '78%', date: '05 May 2024', status: 'Completed' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <AnimatePresence mode="wait">
        {!activeTest ? (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* Header */}
            <div>
              <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                Assessment Dashboard
              </h2>
              <p className="text-xs text-text-secondary-theme">Track and verify your skills to earn credentials</p>
            </div>

            {/* Metric row (from image 7) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm text-center space-y-1">
                <div className="text-[10px] text-text-muted-theme font-bold uppercase tracking-wider">Total Assessments</div>
                <div className="text-2xl font-serif font-black text-text-primary-theme">12</div>
              </div>
              <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm text-center space-y-1">
                <div className="text-[10px] text-text-muted-theme font-bold uppercase tracking-wider">Completed</div>
                <div className="text-2xl font-serif font-black text-success-theme">8</div>
              </div>
              <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm text-center space-y-1">
                <div className="text-[10px] text-text-muted-theme font-bold uppercase tracking-wider">In Progress</div>
                <div className="text-2xl font-serif font-black text-amber-500">2</div>
              </div>
              <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm text-center space-y-1">
                <div className="text-[10px] text-text-muted-theme font-bold uppercase tracking-wider">Certificates</div>
                <div className="text-2xl font-serif font-black text-primary-theme">5</div>
              </div>
            </div>

            {/* List */}
            <div className="bg-surface-theme border border-border-theme rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-border-theme/40">
                <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Recent Assessments</h3>
                <button
                  onClick={() => setActiveTest(true)}
                  className="px-4 py-1.5 bg-primary-theme text-white text-[11px] font-bold rounded-xl hover:bg-primary-hover-theme transition-all cursor-pointer"
                >
                  Start New Test
                </button>
              </div>

              <div className="divide-y divide-border-theme/40 text-xs font-semibold">
                {recentAssessments.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-text-primary-theme">{item.title}</h4>
                      <p className="text-[10px] text-text-muted-theme font-bold font-mono">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono font-bold bg-border-theme/50 px-2.5 py-0.5 rounded-full ${
                        item.status === 'Completed' ? 'text-success-theme bg-success-theme/5' : 'text-amber-500 bg-amber-500/5'
                      }`}>
                        {item.status}: {item.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div key="test" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm max-w-xl mx-auto">
            
            {/* Back to assess */}
            <button onClick={resetTest} className="px-3.5 py-1.5 border border-border-theme text-text-secondary-theme text-xs font-bold rounded-xl hover:bg-border-theme/40 transition-colors inline-flex items-center gap-1 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Quit Test
            </button>

            {!testCompleted ? (
              <div className="space-y-6">
                {/* Question progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">
                    <span>Atomic Design & Layout Test</span>
                    <span>Question {currentQuestion + 1} of {testQuestions.length}</span>
                  </div>
                  <div className="w-full bg-border-theme/35 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-theme h-full transition-all" style={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}></div>
                  </div>
                </div>

                {/* Q Card */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-text-primary-theme leading-relaxed">
                    {testQuestions[currentQuestion].q}
                  </h3>

                  <div className="space-y-2">
                    {testQuestions[currentQuestion].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerSelect(i)}
                        className="w-full text-left p-3.5 border border-border-theme hover:border-primary-theme hover:bg-primary-theme/5 rounded-2xl text-xs text-text-secondary-theme font-semibold transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span>{opt}</span>
                        <ChevronRight className="w-4 h-4 text-text-muted-theme" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-4 animate-scaleUp">
                <div className="w-16 h-16 bg-success-theme/10 text-success-theme rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-serif font-black text-text-primary-theme">Assessment Completed!</h3>
                  <p className="text-xs text-text-secondary-theme font-medium">You completed the atomic layout parameters verification.</p>
                </div>

                <div className="p-4 border border-border-theme rounded-2xl bg-bg-theme/40 max-w-sm mx-auto space-y-2">
                  <div className="text-[10px] text-text-muted-theme font-bold uppercase tracking-wider">Your Verified Score</div>
                  <div className="text-3xl font-serif font-black text-primary-theme">{getScorePercentage()}%</div>
                  <div className="text-[9px] text-success-theme font-bold">PASSING LEVEL ATTAINED ✓</div>
                </div>

                {/* Simulated Certificate Display */}
                <div className="p-5 border-2 border-dashed border-primary-theme/20 rounded-2xl text-left bg-gradient-to-br from-primary-theme/5 to-amber-500/5 max-w-sm mx-auto space-y-3">
                  <div className="text-center">
                    <span className="text-[8px] tracking-widest uppercase font-mono font-bold text-primary-theme">TechnoAdviser Verified Badge</span>
                  </div>
                  <div className="space-y-1 text-center">
                    <h4 className="text-xs font-black text-text-primary-theme font-serif">Arjun Mehta</h4>
                    <p className="text-[9px] text-text-secondary-theme leading-tight">is hereby certified in atomic digital screen and modern layout parameters.</p>
                    <p className="text-[8px] text-text-muted-theme font-mono mt-2">ID: CT-90498234882 &bull; May 2024</p>
                  </div>
                  <button
                    onClick={() => {
                      addToast('Certificate PDF downloaded successfully!', 'success');
                    }}
                    className="w-full py-1.5 bg-primary-theme text-white text-[10px] font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download Badge PDF
                  </button>
                </div>

                <button onClick={resetTest} className="px-5 py-2.5 bg-border-theme hover:bg-border-theme/80 text-text-primary-theme text-xs font-bold rounded-xl transition-all cursor-pointer">
                  Close Results
                </button>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
