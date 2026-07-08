/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, ChevronLeft, ChevronRight, Video, Plus, X, 
  Trash2, Briefcase, Clock, CheckCircle, Sparkles, AlertCircle
} from 'lucide-react';

interface InterviewCalendarSectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

interface CalendarEvent {
  id: string;
  day: number;
  month: string;
  year: number;
  title: string;
  company: string;
  round: string;
  time: string;
  type: 'corporate' | 'mock' | 'assessment';
  dateStr: string;
  daysLeftStr?: string;
  notes?: string;
  checklist?: string[];
  verified?: boolean;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    day: 9,
    month: 'July',
    year: 2026,
    title: 'System Design Preparation',
    company: 'AI Career Coach',
    round: '1-on-1 Mock Session',
    time: '04:30 PM',
    type: 'mock',
    dateStr: 'THURSDAY, JULY 9, 2026',
    notes: 'Focus on scaling database architectures, load balancers, and distributed caching mechanisms.',
    checklist: [
      'Revise sharding and replication protocols',
      'Review system design blueprint template',
      'Prepare case study on video streaming latency optimization'
    ],
    verified: true
  },
  {
    id: 'evt-2',
    day: 12,
    month: 'July',
    year: 2026,
    title: 'UI/UX Designer Interview',
    company: 'Tech Mahindra',
    round: 'Round 1 (Technical & Live Design)',
    time: '10:00 AM',
    type: 'corporate',
    dateStr: 'SUNDAY, JULY 12, 2026',
    daysLeftStr: 'IN 5 DAYS',
    notes: '“Prepare portfolio slides and read up on design system architecture.”',
    checklist: [
      'Review the job description & target requirements',
      'Test Google Meet connection & audio/camera settings',
      'Keep your resume and portfolio deck ready to share',
      'Formulate 2 target questions to ask the interviewers'
    ],
    verified: true
  },
  {
    id: 'evt-3',
    day: 18,
    month: 'July',
    year: 2026,
    title: 'Product Designer Interview',
    company: 'Flipkart',
    round: 'Round 2 (Portfolio Presentation)',
    time: '02:00 PM',
    type: 'corporate',
    dateStr: 'SATURDAY, JULY 18, 2026',
    daysLeftStr: 'IN 11 DAYS',
    notes: 'Deep dive into e-commerce user journeys, checkout conversion rates, and localized mobile interactions.',
    checklist: [
      'Review user retention case study',
      'Polish portfolio visual mockups',
      'Setup screenshare presentation deck'
    ],
    verified: true
  },
  {
    id: 'evt-4',
    day: 23,
    month: 'July',
    year: 2026,
    title: 'Design Specialist Interview',
    company: 'Microsoft',
    round: 'Round 3 (HR & Leadership Fit)',
    time: '11:00 AM',
    type: 'corporate',
    dateStr: 'THURSDAY, JULY 23, 2026',
    daysLeftStr: 'IN 16 DAYS',
    notes: 'Focus on leadership principles, cross-functional collaboration, and inclusive design paradigms.',
    checklist: [
      'Draft responses for behavioral questions (STAR method)',
      'Prepare list of team-oriented design conflicts resolved',
      'Review Microsoft Fluent Design guidelines'
    ],
    verified: true
  },
  {
    id: 'evt-5',
    day: 28,
    month: 'July',
    year: 2026,
    title: 'Technical Design Challenge',
    company: 'TechnoAdviser Portal',
    round: 'Skills Assessment Task',
    time: '11:59 PM',
    type: 'assessment',
    dateStr: 'TUESDAY, JULY 28, 2026',
    daysLeftStr: 'DUE IN 21 DAYS',
    notes: 'Build a fully responsive component library prototype matching strict accessibility WCAG standards.',
    checklist: [
      'Verify keyboard navigation support',
      'Check color contrast ratios',
      'Package codebase into clean GitHub repository link'
    ],
    verified: true
  }
];

export default function InterviewCalendarSection({ addToast }: InterviewCalendarSectionProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedDay, setSelectedDay] = useState<number | null>(12);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // States for scheduling a mock test slot
  const [mockRole, setMockRole] = useState('Senior Product Designer');
  const [mockDate, setMockDate] = useState('2026-07-09');
  const [mockTime, setMockTime] = useState('14:00');
  const [mockCategory, setMockCategory] = useState<'corporate' | 'mock' | 'assessment'>('mock');
  const [mockCompany, setMockCompany] = useState('AI Career Coach');

  // Track checked states for checklists on each event
  const [checkedStates, setCheckedStates] = useState<Record<string, Record<number, boolean>>>({
    'evt-2': { 0: true, 1: true } // Presets for high fidelity
  });

  const handleToggleChecklist = (eventId: string, itemIdx: number) => {
    setCheckedStates(prev => {
      const eventChecks = { ...prev[eventId] };
      eventChecks[itemIdx] = !eventChecks[itemIdx];
      return {
        ...prev,
        [eventId]: eventChecks
      };
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
    addToast(`Cancelled booking slot: ${eventToDelete?.title || 'Event'}`, 'info');
  };

  const handleReset = () => {
    setEvents(INITIAL_EVENTS);
    setSelectedDay(12);
    setSelectedFilter('all');
    setCheckedStates({
      'evt-2': { 0: true, 1: true }
    });
    addToast('Reset calendar simulation parameters to July 2026 baseline.', 'success');
  };

  const handleAddMockInterview = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse day from dateStr (expects YYYY-MM-DD)
    const dateParts = mockDate.split('-');
    const day = parseInt(dateParts[2]) || 15;
    const year = parseInt(dateParts[0]) || 2026;

    const weekdayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dObj = new Date(year, 6, day); // July is month 6
    const dateStr = `${weekdayNames[dObj.getDay()]}, JULY ${day}, ${year}`;

    // Format time to AM/PM
    let timeStr = mockTime;
    try {
      const [hours, minutes] = mockTime.split(':');
      const hourNum = parseInt(hours);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const formattedHour = hourNum % 12 || 12;
      timeStr = `${String(formattedHour).padStart(2, '0')}:${minutes} ${ampm}`;
    } catch (err) {
      // Fallback
    }

    const newEvent: CalendarEvent = {
      id: `evt-custom-${Date.now()}`,
      day,
      month: 'July',
      year,
      title: `${mockRole} Session`,
      company: mockCompany || 'AI Rehearsal Coach',
      round: mockCategory === 'mock' ? 'AI Mentor Practice' : mockCategory === 'corporate' ? 'Mock Live Coding' : 'Skill Evaluation Challenge',
      time: timeStr,
      type: mockCategory,
      dateStr,
      daysLeftStr: `IN ${Math.max(1, day - 7)} DAYS`,
      notes: `Custom self-coached session focused on core development patterns, performance, and UI styling concepts.`,
      checklist: [
        'Review core theory and architecture paradigms',
        'Verify tool configurations and code sandbox integrations',
        'Analyze typical industry-level challenge deliverables'
      ],
      verified: true
    };

    setEvents(prev => [...prev, newEvent]);
    setSelectedDay(day);
    setShowScheduleModal(false);
    addToast(`Successfully booked custom "${newEvent.title}" on July ${day}!`, 'success');
  };

  // Math for July 2026 Grid (Starts on Wednesday -> index 3 offset)
  const offsetDays = 3;
  const daysInJuly = 31;
  const daysInJune = 30;

  const fullCalendarDays: { dayNum: number; isCurrentMonth: boolean }[] = [];

  // 1. Previous month trailing days
  for (let i = daysInJune - offsetDays + 1; i <= daysInJune; i++) {
    fullCalendarDays.push({ dayNum: i, isCurrentMonth: false });
  }

  // 2. Days 1 to 31 in July
  for (let i = 1; i <= daysInJuly; i++) {
    fullCalendarDays.push({ dayNum: i, isCurrentMonth: true });
  }

  // 3. Next month leading days to complete 42 elements (6 rows)
  const remainingSlots = 42 - fullCalendarDays.length;
  for (let i = 1; i <= remainingSlots; i++) {
    fullCalendarDays.push({ dayNum: i, isCurrentMonth: false });
  }

  // Filter logic
  const filteredEvents = events.filter(evt => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'corporate') return evt.type === 'corporate';
    if (selectedFilter === 'mock') return evt.type === 'mock';
    if (selectedFilter === 'assessment') return evt.type === 'assessment';
    return true;
  });

  const selectedDayEvents = filteredEvents.filter(e => e.day === selectedDay);

  // Counters for Metric widgets
  const corporateCount = events.filter(e => e.type === 'corporate').length;
  const mockCount = events.filter(e => e.type === 'mock').length;
  const assessmentCount = events.filter(e => e.type === 'assessment').length;
  const totalCount = events.length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-left">
      
      {/* 1. Header Hero Panel with premium background glow */}
      <div className="bg-surface-theme border border-border-theme/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#E8702A]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E8702A] bg-[#E8702A]/10 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8702A] animate-pulse"></span>
              PORTAL ENGINE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary-theme uppercase tracking-tight">
              INTERVIEW MANAGEMENT SYSTEM
            </h2>
            <p className="text-xs text-text-secondary-theme leading-relaxed">
              Synchronize your active corporate rounds, plan automated technical assessments, and perform AI-driven mentor rehearsals on an integrated calendar workspace.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleReset}
              className="px-4 py-2 text-xs font-bold text-text-secondary-theme border border-border-theme/60 hover:border-[#E8702A]/30 hover:text-[#E8702A] rounded-xl bg-surface-theme/50 transition-all cursor-pointer"
            >
              Reset to July 2026
            </button>
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2.5 bg-[#E8702A] hover:bg-[#d05e20] text-white text-xs font-extrabold rounded-xl shadow-lg shadow-[#E8702A]/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Book Mock Session
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Metric Suite Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Corporate */}
        <div className="bg-surface-theme border border-border-theme/60 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden group hover:border-[#E8702A]/30 transition-all">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-text-muted-theme uppercase tracking-widest">CORPORATE</span>
            <h4 className="text-sm font-extrabold text-text-primary-theme">Active Rounds</h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E8702A]/10 flex items-center justify-center text-[#E8702A] font-black text-sm border border-[#E8702A]/20">
            {corporateCount}
          </div>
        </div>

        {/* Card 2: AI Rehearsal */}
        <div className="bg-surface-theme border border-border-theme/60 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-text-muted-theme uppercase tracking-widest">AI REHEARSAL</span>
            <h4 className="text-sm font-extrabold text-text-primary-theme">Mock Practices</h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black text-sm border border-indigo-500/20">
            {mockCount}
          </div>
        </div>

        {/* Card 3: Automated */}
        <div className="bg-surface-theme border border-border-theme/60 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-text-muted-theme uppercase tracking-widest">AUTOMATED</span>
            <h4 className="text-sm font-extrabold text-text-primary-theme">Assessments</h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-sm border border-emerald-500/20">
            {assessmentCount}
          </div>
        </div>

        {/* Card 4: Chronology */}
        <div className="bg-surface-theme border border-border-theme/60 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden group hover:border-text-secondary-theme/30 transition-all">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-text-muted-theme uppercase tracking-widest">CHRONOLOGY</span>
            <h4 className="text-sm font-extrabold text-text-primary-theme">Total Bookings</h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center text-text-secondary-theme font-black text-sm border border-border-theme/60">
            {totalCount}
          </div>
        </div>
      </div>

      {/* 3. Category Filters Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-border-theme/40">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-widest">CATEGORY FILTER:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'corporate', label: 'Corporate Rounds' },
            { id: 'mock', label: 'AI Mock practices' },
            { id: 'assessment', label: 'Assessments' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedFilter(item.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                selectedFilter === item.id 
                  ? 'bg-text-primary-theme text-surface-theme shadow-sm' 
                  : 'bg-surface-theme border border-border-theme/60 text-text-secondary-theme hover:bg-border-theme/30'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Interactive Double-Panel Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Side: Calendar Month Block (8 cols) */}
        <div className="lg:col-span-8 bg-surface-theme border border-border-theme/60 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-theme/40 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-text-primary-theme">July 2026</h3>
                <span className="text-[9px] font-extrabold uppercase bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded border border-rose-500/20 tracking-wider">
                  ACTIVE VIEW
                </span>
              </div>
              <p className="text-[10px] font-bold text-text-muted-theme uppercase tracking-widest">
                {filteredEvents.length} ITEMS PLANNED FOR THIS PERIOD
              </p>
            </div>

            {/* Calendar Control Navigation */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => addToast('Viewing previous period is locked in prototype mode.', 'info')}
                className="p-1.5 border border-border-theme/60 rounded-lg hover:bg-border-theme/30 text-text-secondary-theme transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  setSelectedDay(7);
                  addToast('Centered back to today: July 7, 2026', 'success');
                }}
                className="px-2.5 py-1 text-[10px] font-extrabold uppercase border border-border-theme/60 rounded-lg text-text-secondary-theme hover:bg-border-theme/30 tracking-wider transition-all cursor-pointer"
              >
                TODAY
              </button>
              <button 
                onClick={() => addToast('Viewing future period is locked in prototype mode.', 'info')}
                className="p-1.5 border border-border-theme/60 rounded-lg hover:bg-border-theme/30 text-text-secondary-theme transition-all cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Calendar Day Labels */}
          <div className="grid grid-cols-7 text-center text-[10px] font-black text-text-muted-theme uppercase tracking-wider pb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d}>{d}</span>)}
          </div>

          {/* Core Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-semibold text-text-secondary-theme">
            {fullCalendarDays.map((dayObj, idx) => {
              const { dayNum, isCurrentMonth } = dayObj;
              
              const dayEvents = isCurrentMonth 
                ? filteredEvents.filter(e => e.day === dayNum)
                : [];
              const hasEvent = dayEvents.length > 0;
              const mainEvent = dayEvents[0];
              
              const isSelected = selectedDay === dayNum && isCurrentMonth;
              const isToday = dayNum === 7 && isCurrentMonth;

              // Grid Item color configuration matching screens perfectly
              let borderClass = 'border border-border-theme/30';
              let bgClass = 'bg-surface-theme/20';
              let textClass = isCurrentMonth ? 'text-text-primary-theme' : 'text-text-muted-theme opacity-30';
              
              if (isCurrentMonth) {
                if (hasEvent) {
                  if (mainEvent.type === 'corporate') {
                    borderClass = 'border-[#E8702A]/80 hover:border-[#E8702A]';
                    bgClass = isSelected ? 'bg-[#E8702A]' : 'bg-[#E8702A]/5';
                    if (isSelected) textClass = 'text-white font-black';
                  } else if (mainEvent.type === 'mock') {
                    borderClass = 'border-indigo-400 hover:border-indigo-500';
                    bgClass = isSelected ? 'bg-indigo-600' : 'bg-indigo-500/5';
                    if (isSelected) textClass = 'text-white font-black';
                  } else if (mainEvent.type === 'assessment') {
                    borderClass = 'border-emerald-400 hover:border-emerald-500';
                    bgClass = isSelected ? 'bg-emerald-600' : 'bg-emerald-500/5';
                    if (isSelected) textClass = 'text-white font-black';
                  }
                } else if (isToday) {
                  borderClass = 'border-rose-400 hover:border-rose-500';
                  bgClass = isSelected ? 'bg-rose-500' : 'bg-rose-500/5';
                  if (isSelected) textClass = 'text-white font-black';
                } else {
                  if (isSelected) {
                    bgClass = 'bg-text-primary-theme text-surface-theme';
                    textClass = 'text-surface-theme font-black';
                  } else {
                    bgClass = 'hover:bg-border-theme/30 bg-surface-theme/50';
                  }
                }
              }

              return (
                <button
                  key={`calendar-cell-${idx}`}
                  onClick={() => {
                    if (isCurrentMonth) {
                      setSelectedDay(dayNum);
                    } else {
                      addToast('This day belongs to an adjacent month.', 'info');
                    }
                  }}
                  className={`min-h-[64px] sm:min-h-[76px] rounded-2xl p-1.5 flex flex-col justify-between items-center transition-all cursor-pointer relative group ${borderClass} ${bgClass} ${textClass} ${isSelected ? 'scale-[1.02] shadow-sm' : ''}`}
                >
                  {/* Day Number */}
                  <span className={`text-xs font-extrabold ${isToday && !isSelected ? 'w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-black shadow-sm shadow-rose-500/10' : ''}`}>
                    {dayNum}
                  </span>

                  {/* Horizontal visual label pill */}
                  {hasEvent && (
                    <div className="w-full mt-1">
                      <div className="hidden sm:block text-[8px] font-extrabold truncate px-1 py-0.5 rounded border leading-tight text-center max-w-full">
                        {mainEvent.type === 'corporate' && (
                          <span className={isSelected ? 'text-white/90' : 'text-[#E8702A]'}>
                            {mainEvent.company}
                          </span>
                        )}
                        {mainEvent.type === 'mock' && (
                          <span className={isSelected ? 'text-white/90' : 'text-indigo-600 dark:text-indigo-400'}>
                            AI Career Coach
                          </span>
                        )}
                        {mainEvent.type === 'assessment' && (
                          <span className={isSelected ? 'text-white/90' : 'text-emerald-600 dark:text-emerald-400'}>
                            TechnoAdviser Portal
                          </span>
                        )}
                      </div>
                      <span className={`block sm:hidden w-1.5 h-1.5 rounded-full mx-auto ${
                        mainEvent.type === 'corporate' ? 'bg-[#E8702A]' :
                        mainEvent.type === 'mock' ? 'bg-indigo-500' : 'bg-emerald-500'
                      }`}></span>
                    </div>
                  )}

                  {/* Today dot indicator */}
                  {isToday && !hasEvent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse mt-1"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Color Codes Legend */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-border-theme/40 text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E8702A]"></span>
              <span>Corporate Rounds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>AI Mock Practices</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Skill Assessments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Today Indicators</span>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Event Agenda Panel (4 cols) */}
        <div className="lg:col-span-4 bg-surface-theme border border-border-theme/60 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border-theme/40 pb-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-text-muted-theme uppercase tracking-widest">
                DAILY AGENDA DETAILS
              </span>
              <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">
                {selectedDay ? `SUNDAY, JULY ${selectedDay}, 2026` : 'SELECT A DAY'}
              </h3>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-black uppercase bg-slate-500/10 text-text-secondary-theme rounded-md">
              {selectedDayEvents.length} Active Slot(s)
            </span>
          </div>

          <AnimatePresence mode="wait">
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDayEvents.map((evt) => {
                  const isCheckedMap = checkedStates[evt.id] || {};
                  const checkedCount = Object.values(isCheckedMap).filter(Boolean).length;
                  const progressPercent = evt.checklist 
                    ? Math.round((checkedCount / evt.checklist.length) * 100) 
                    : 0;

                  return (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-5 border border-border-theme/60 rounded-2xl space-y-5 bg-surface-theme/30 relative overflow-hidden text-left"
                    >
                      {/* Badge and action row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                            evt.type === 'corporate' ? 'bg-[#E8702A]/10 text-[#E8702A]' :
                            evt.type === 'mock' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {evt.type === 'corporate' ? 'Corporate Round' : evt.type === 'mock' ? 'AI Rehearsal' : 'Assessment'}
                          </span>
                          {evt.daysLeftStr && (
                            <span className="text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded tracking-wider">
                              {evt.daysLeftStr}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="p-1 hover:bg-rose-500/10 rounded-lg text-text-muted-theme hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Title Segment */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-text-primary-theme leading-tight">
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary-theme">
                          <Briefcase className="w-3.5 h-3.5 text-text-muted-theme" />
                          <span className="font-bold">{evt.company}</span>
                          <span className="text-text-muted-theme">&bull;</span>
                          <span className="text-text-muted-theme font-medium text-[11px]">{evt.round}</span>
                        </div>
                      </div>

                      {/* Event contextual notes */}
                      {evt.notes && (
                        <p className="text-[11px] text-text-secondary-theme font-medium leading-relaxed italic bg-surface-theme/80 border-l-2 border-[#E8702A] p-2.5 rounded-r-lg">
                          {evt.notes}
                        </p>
                      )}

                      {/* Checklist section */}
                      {evt.checklist && evt.checklist.length > 0 && (
                        <div className="space-y-2.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted-theme">
                              CANDIDATE PREPARATION LIST
                            </span>
                            <span className="text-[9px] font-black text-text-secondary-theme">
                              {checkedCount}/{evt.checklist.length} Completed
                            </span>
                          </div>

                          {/* Dynamic progress bar */}
                          <div className="h-1 bg-border-theme/60 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#E8702A] transition-all duration-300" 
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>

                          <div className="space-y-1.5">
                            {evt.checklist.map((item, idx) => (
                              <label 
                                key={idx}
                                className="flex items-start gap-2.5 p-2 border border-border-theme/40 hover:border-border-theme hover:bg-surface-theme rounded-xl text-xs font-semibold text-text-secondary-theme transition-all cursor-pointer"
                              >
                                <input 
                                  type="checkbox"
                                  checked={!!isCheckedMap[idx]}
                                  onChange={() => handleToggleChecklist(evt.id, idx)}
                                  className="mt-0.5 rounded border-border-theme text-[#E8702A] focus:ring-[#E8702A]/30 w-3.5 h-3.5 cursor-pointer"
                                />
                                <span className={isCheckedMap[idx] ? 'line-through text-text-muted-theme' : ''}>
                                  {item}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Clock details and Call-to-action button */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border-theme/40">
                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                          <Clock className="w-4 h-4 text-[#E8702A]" />
                          <div>
                            <span className="text-xs font-extrabold text-text-primary-theme">
                              {evt.time}
                            </span>
                            <span className="text-[9px] font-bold text-text-muted-theme uppercase block tracking-wider leading-none">
                              VERIFIED ENTRY
                            </span>
                          </div>
                        </div>

                        <a
                          href="https://meet.google.com"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto px-4 py-2.5 bg-[#E8702A] hover:bg-[#d05e20] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-md shadow-[#E8702A]/10"
                        >
                          <Video className="w-3.5 h-3.5" /> 
                          <span>Start Video Interview Session</span>
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                key="empty-agenda"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 border border-dashed border-border-theme/60 rounded-2xl text-center space-y-3 px-4"
              >
                <div className="w-10 h-10 rounded-full bg-border-theme/40 flex items-center justify-center mx-auto text-text-muted-theme">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-text-secondary-theme">
                  No events scheduled for July {selectedDay}, 2026
                </p>
                <p className="text-[10px] text-text-muted-theme max-w-[200px] mx-auto leading-relaxed">
                  Click on any highlighted calendar day, or schedule a fresh rehearsal session.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 5. Chronology Pipeline Timeline Tracker */}
      <div className="bg-surface-theme border border-border-theme/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-theme/40 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">
              INTERACTIVE PIPELINE TIMELINE
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-[#E8702A]/10 text-[#E8702A] rounded border border-[#E8702A]/20 tracking-wider">
              {filteredEvents.length} Tasks Set
            </span>
          </div>
          <span className="text-[10px] text-text-muted-theme font-bold">
            Chronological Order
          </span>
        </div>

        <div className="relative border-l border-border-theme/60 pl-6 ml-3 space-y-4 text-left">
          {filteredEvents.sort((a,b) => a.day - b.day).map((evt) => {
            const isSelected = selectedDay === evt.day;
            let dotColor = 'bg-[#E8702A]';
            if (evt.type === 'mock') dotColor = 'bg-indigo-500';
            if (evt.type === 'assessment') dotColor = 'bg-emerald-500';

            return (
              <div key={evt.id} className="relative">
                {/* Vertical node circle */}
                <span className={`absolute -left-[31px] top-4 w-2.5 h-2.5 rounded-full ring-4 ring-surface-theme ${dotColor} ${isSelected ? 'scale-125 animate-pulse' : ''}`}></span>

                {/* Event Row Card */}
                <div
                  onClick={() => setSelectedDay(evt.day)}
                  className={`p-4 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#E8702A] bg-[#E8702A]/5 shadow-sm' 
                      : 'border-border-theme/40 bg-surface-theme/50 hover:border-border-theme hover:bg-surface-theme'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-text-primary-theme">
                        {evt.title}
                      </h4>
                      <span className="text-[9px] text-text-muted-theme font-extrabold uppercase">
                        &bull; {evt.company}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-secondary-theme font-bold uppercase tracking-wider">
                      {evt.round}
                    </p>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <span className="text-[11px] font-black text-[#E8702A] bg-[#E8702A]/10 px-2 py-0.5 rounded uppercase tracking-wider">
                      Jul {evt.day}
                    </span>
                    <span className="text-[10px] font-bold text-text-muted-theme">
                      {evt.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. High-End Booking Form Overlay Dialog */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)}></div>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-theme border border-border-theme max-w-md w-full rounded-3xl p-6 space-y-5 shadow-2xl relative z-10 text-xs font-semibold text-left"
            >
              <div className="flex justify-between items-center border-b border-border-theme/40 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E8702A]" />
                  <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">
                    Book AI Mock Rehearsal
                  </h3>
                </div>
                <button 
                  onClick={() => setShowScheduleModal(false)} 
                  className="p-1 hover:bg-border-theme/60 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4 text-text-muted-theme" />
                </button>
              </div>

              <form onSubmit={handleAddMockInterview} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">
                    Interview Domain / Role Target
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-surface-theme/50 border border-border-theme/60 rounded-xl p-3 focus:outline-none focus:border-[#E8702A]/50 text-xs text-text-primary-theme" 
                    value={mockRole} 
                    onChange={e => setMockRole(e.target.value)} 
                    placeholder="e.g. Senior Product Designer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">
                    Host / Partner Entity
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-surface-theme/50 border border-border-theme/60 rounded-xl p-3 focus:outline-none focus:border-[#E8702A]/50 text-xs text-text-primary-theme" 
                    value={mockCompany} 
                    onChange={e => setMockCompany(e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">
                      Category Type
                    </label>
                    <select
                      className="w-full bg-surface-theme/50 border border-border-theme/60 rounded-xl p-3 focus:outline-none focus:border-[#E8702A]/50 text-xs text-text-primary-theme cursor-pointer"
                      value={mockCategory}
                      onChange={e => {
                        const val = e.target.value as 'corporate' | 'mock' | 'assessment';
                        setMockCategory(val);
                        if (val === 'corporate') setMockCompany('Tech Mahindra');
                        if (val === 'mock') setMockCompany('AI Career Coach');
                        if (val === 'assessment') setMockCompany('TechnoAdviser Portal');
                      }}
                    >
                      <option value="mock">AI Rehearsal (Indigo)</option>
                      <option value="corporate">Corporate Round (Orange)</option>
                      <option value="assessment">Assessment Task (Emerald)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">
                      Select Date (July 2026)
                    </label>
                    <input 
                      type="date" 
                      required
                      min="2026-07-01"
                      max="2026-07-31"
                      className="w-full bg-surface-theme/50 border border-border-theme/60 rounded-xl p-3 focus:outline-none focus:border-[#E8702A]/50 text-xs text-text-primary-theme" 
                      value={mockDate} 
                      onChange={e => setMockDate(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">
                    Select Time Slot
                  </label>
                  <input 
                    type="time" 
                    required
                    className="w-full bg-surface-theme/50 border border-border-theme/60 rounded-xl p-3 focus:outline-none focus:border-[#E8702A]/50 text-xs text-text-primary-theme" 
                    value={mockTime} 
                    onChange={e => setMockTime(e.target.value)} 
                  />
                </div>

                <div className="flex gap-2 p-3 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-[10px] text-text-secondary-theme leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Ensure your video and audio inputs are fully optimized before starting. AI rehearsals provide smart interactive logs at completion.</span>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#E8702A] hover:bg-[#d05e20] text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-lg shadow-[#E8702A]/10 uppercase tracking-wider"
                >
                  Confirm Booking Slot
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
