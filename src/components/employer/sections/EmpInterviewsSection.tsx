/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, Video, Plus, CheckCircle, PlayCircle, 
  Trash2, HelpCircle, ChevronLeft, ChevronRight, Star, AlertCircle
} from 'lucide-react';

interface EmpInterviewsSectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function EmpInterviewsSection({ addToast }: EmpInterviewsSectionProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'schedule' | 'reviews'>('calendar');

  // New Interview Form
  const [candidateName, setCandidateName] = useState('Arjun Reddy');
  const [roundType, setRoundType] = useState('Technical Round');
  const [interviewer, setInterviewer] = useState('Rahul');
  const [meetDate, setMeetDate] = useState('2024-05-15');
  const [meetTime, setMeetTime] = useState('11:00 AM');

  // Video reviews panel mock states
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Scheduled Interviews mock array
  const [interviews, setInterviews] = useState([
    { id: 'int-1', name: 'Rohan Mehta', role: 'UI/UX Designer', date: '2024-05-10', time: '10:30 AM', round: 'Technical Round', link: 'https://meet.google.com/abc-defg-hij' },
    { id: 'int-2', name: 'Priya Singh', role: 'Product Manager', date: '2024-05-10', time: '02:00 PM', round: 'System Architecture', link: 'https://meet.google.com/xyz-uvwx-yz' },
    { id: 'int-3', name: 'Arjun Reddy', role: 'React Architect', date: '2024-05-12', time: '11:00 AM', round: 'Live Coding Board', link: 'https://meet.google.com/qwe-rtyu-iop' },
  ]);

  // Video reviews mock data
  const videoReviews = [
    { id: 'vid-1', candidate: 'Siddharth Sen', role: 'UX Specialist', question: 'Q1: Tell me about a time you handled design disagreements.', duration: '1:45 mins', thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80' },
    { id: 'vid-2', candidate: 'Rohan Mehta', role: 'Senior Designer', question: 'Q2: How do you establish scalable design tokens in Figma?', duration: '2:10 mins', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80' },
  ];

  const handleCreateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) return;

    const newInt = {
      id: `int-${Date.now()}`,
      name: candidateName,
      role: 'Shortlisted Specialist',
      date: meetDate,
      time: meetTime,
      round: roundType,
      link: 'https://meet.google.com/new-meeting-slot'
    };

    setInterviews([newInt, ...interviews]);
    addToast(`Successfully scheduled interview with ${candidateName}! Invitation sent.`, 'success');
    setCandidateName('');
    setActiveTab('calendar');
  };

  const handleDeleteInterview = (id: string, name: string) => {
    setInterviews(interviews.filter((i) => i.id !== id));
    addToast(`Cancelled and removed interview slot for ${name}.`, 'info');
  };

  return (
    <div className="space-y-8">
      
      {/* Tab Selectors and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-theme pb-5">
        <div>
          <h1 className="text-xl font-black text-text-primary-theme uppercase tracking-wider">Interview Hub</h1>
          <p className="text-xs text-text-secondary-theme font-semibold">Schedule candidate live meets, configure video reviews and manage calendars.</p>
        </div>

        <div className="flex gap-2">
          {['calendar', 'schedule', 'reviews'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                activeTab === t 
                  ? 'bg-border-theme/40 text-text-primary-theme border border-border-theme' 
                  : 'text-text-secondary-theme hover:bg-border-theme/30'
              }`}
            >
              {t === 'calendar' ? '1. Live Calendar' : t === 'schedule' ? '2. Schedule Slot' : '3. Video Review'}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: LIVE CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Interactive 7-Day Matrix */}
          <div className="lg:col-span-8 bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-border-theme/40">
              <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Weekly Sourcing Grid</h3>
              <span className="text-[10px] text-text-muted-theme font-black font-mono">MAY 2024</span>
            </div>

            <div className="grid grid-cols-7 gap-2.5">
              {[
                { day: 'Mon', num: '06', active: false },
                { day: 'Tue', num: '07', active: false },
                { day: 'Wed', num: '08', active: false },
                { day: 'Thu', num: '09', active: false },
                { day: 'Fri', num: '10', active: true },
                { day: 'Sat', num: '11', active: false },
                { day: 'Sun', num: '12', active: true },
              ].map((slot) => (
                <div 
                  key={slot.num} 
                  className={`p-3 rounded-2xl text-center space-y-1.5 border transition-all cursor-pointer ${
                    slot.active 
                      ? 'bg-primary-theme/10 border-primary-theme/30 text-primary-theme shadow-sm' 
                      : 'bg-border-theme/20 border-border-theme/40 hover:border-primary-theme/20 text-text-secondary-theme'
                  }`}
                >
                  <span className="text-[9px] font-black uppercase block tracking-wider">{slot.day}</span>
                  <span className="text-lg font-black font-mono block">{slot.num}</span>
                  {slot.active && (
                    <span className="w-1.5 h-1.5 bg-primary-theme rounded-full mx-auto block" />
                  )}
                </div>
              ))}
            </div>

            {/* List of active interviews */}
            <div className="space-y-3.5 pt-4">
              <h4 className="text-[10px] font-black text-text-muted-theme uppercase tracking-widest pl-1">Scheduled Interview Details</h4>
              {interviews.map((int) => (
                <div key={int.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-border-theme/20 border border-border-theme/40 hover:border-primary-theme/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary-theme/15 text-primary-theme">
                      <Video className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-text-primary-theme block">{int.name}</span>
                      <span className="text-[10px] text-text-secondary-theme font-bold">{int.round} &middot; {int.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a 
                      href={int.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black rounded-lg shadow-sm"
                    >
                      Launch Meeting
                    </a>
                    <button 
                      onClick={() => handleDeleteInterview(int.id, int.name)}
                      className="p-2 hover:bg-rose-500/10 text-rose-500 border border-transparent hover:border-rose-500/20 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick parameters helper */}
          <div className="lg:col-span-4 bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Guidelines Panel</h3>
              <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold">
                Candidates must be invited at least 24 hours prior. Always verify match ratios and certificates in the ATS before formulating technical assessments.
              </p>
            </div>

            <div className="bg-primary-theme/5 border border-primary-theme/10 p-4 rounded-2xl mt-6">
              <span className="text-[10px] font-black text-primary-theme uppercase tracking-wider block">Important Note</span>
              <p className="text-[9px] text-text-secondary-theme leading-relaxed pt-1">
                Video meets are automatically integrated with custom transcript generators to summarize interview highlights.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: SCHEDULE SLOT */}
      {activeTab === 'schedule' && (
        <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl">
          <div className="pb-4 border-b border-border-theme/60 mb-6">
            <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">Schedule Sourcing Slot</h2>
            <p className="text-[10px] text-text-secondary-theme font-semibold">Set up live Google Meet links for candidates in the active ATS pool.</p>
          </div>

          <form onSubmit={handleCreateInterview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Candidate Name *</label>
                <input 
                  type="text" 
                  required 
                  value={candidateName} 
                  onChange={(e) => setCandidateName(e.target.value)} 
                  placeholder="e.g. Rohan Mehta" 
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Interviewer Round</label>
                <select 
                  value={roundType} 
                  onChange={(e) => setRoundType(e.target.value)}
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                >
                  <option>Technical Round</option>
                  <option>HR Screening</option>
                  <option>System Architecture</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Interviewer</label>
                <input 
                  type="text" 
                  value={interviewer} 
                  onChange={(e) => setInterviewer(e.target.value)} 
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Meet Date</label>
                <input 
                  type="date" 
                  value={meetDate} 
                  onChange={(e) => setMeetDate(e.target.value)} 
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Meet Time</label>
                <input 
                  type="text" 
                  value={meetTime} 
                  onChange={(e) => setMeetTime(e.target.value)} 
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full text-center py-3 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer mt-4"
            >
              Dispatch Sourcing Invite
            </button>
          </form>
        </div>
      )}

      {/* VIEW 3: VIDEO REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {videoReviews.map((item) => (
            <div key={item.id} className="bg-surface-theme border border-border-theme rounded-2xl overflow-hidden shadow-sm hover:border-primary-theme/20 transition-all flex flex-col justify-between">
              <div>
                {/* Simulated Thumbnail */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  <img src={item.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
                  
                  {playingVideo === item.id ? (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center text-white space-y-2 z-10">
                      <span className="text-[10px] font-mono font-black text-primary-theme animate-pulse">PLAYING SUBMISSION FEED</span>
                      <p className="text-xs font-semibold leading-relaxed">"First, I layout the core design tokens in Tailwind, establishing standard gray and slate gradients..."</p>
                      <button 
                        onClick={() => setPlayingVideo(null)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold"
                      >
                        Pause Stream
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setPlayingVideo(item.id)}
                      className="absolute p-3 bg-white/90 hover:bg-primary-theme hover:text-white rounded-full text-text-primary-theme shadow-lg transform hover:scale-105 transition-all cursor-pointer z-10"
                    >
                      <PlayCircle className="w-8 h-8" />
                    </button>
                  )}

                  <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-white">
                    {item.duration}
                  </div>
                </div>

                <div className="p-5 space-y-1.5">
                  <h4 className="text-xs font-black text-text-primary-theme">{item.candidate}</h4>
                  <span className="text-[9px] text-primary-theme font-bold block">{item.role}</span>
                  <p className="text-[11px] text-text-secondary-theme leading-relaxed font-semibold italic">
                    {item.question}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-border-theme/30 flex justify-between items-center mt-3">
                <div className="flex gap-1.5">
                  <button onClick={() => addToast('Voted Excellent!', 'success')} className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/15 text-emerald-500 text-[10px] font-black rounded-lg cursor-pointer">Pass</button>
                  <button onClick={() => addToast('Voted Poor/Disqualified.', 'info')} className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/15 text-rose-500 text-[10px] font-black rounded-lg cursor-pointer">Fail</button>
                </div>

                <span className="text-[9px] text-text-muted-theme font-mono">Completed recently</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
