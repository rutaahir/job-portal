/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, ArrowRight, Star, Calendar, Download, ChevronLeft,
  ChevronRight, CheckCircle, FileText, Plus, HelpCircle, Phone, Mail,
  MapPin, Upload, Send, MessageSquare, AlertTriangle, CheckCircle2, X, Info
} from 'lucide-react';
import { Job } from '../../../types';

interface EmpAtsSectionProps {
  initialTargetApplicantId: string | null;
  onClearTargetApplicant: () => void;
  initialTargetJobTitle?: string | null;
  onClearTargetJobTitle?: () => void;
  addToast: (text: string, type?: 'success' | 'info') => void;
}

const getResumeContent = (applicant: any) => {
  if (applicant && applicant.candidateData) {
    const c = applicant.candidateData;
    return `${(c.name || applicant.name).toUpperCase()} - PROFILE SUMMARY
Email: ${applicant.email} | Phone: ${c.phone || applicant.phone || 'N/A'}
Location: ${c.currentCity || 'N/A'} | Open to Work: ${c.openToWork ? 'Yes' : 'No'}

BIO
${c.bio || 'Productive professional seeking to deliver technical excellence and modern design implementation.'}

EDUCATION
${c.education || 'N/A'}

EXPERIENCE HISTORY
${Array.isArray(c.experienceHistory) && c.experienceHistory.length > 0
        ? c.experienceHistory.map((h: any) => `- ${h.role} at ${h.company} (${h.duration})\n  ${h.description || ''}`).join('\n')
        : '- Entry-Level / Fresher / Independent Developer'}

SKILLS
${Array.isArray(c.skills) ? c.skills.join(', ') : (c.skills || 'N/A')}

CERTIFICATIONS & LANGUAGES
${c.certifications || 'Verified Professional'}
Languages: ${c.languages || 'English'}`;
  }
  return `ROHAN MEHTA - SENIOR UI/UX DESIGNER
Bengaluru, India | +91 84909 11181 | rohanmehta@gmail.com

SUMMARY
Passion-driven UI/UX Designer with 4.5+ years of core design expertise. Skilled in establishing pixel-perfect design systems, conducting user research, wireframing and prototyping complex SaaS software architectures.`;
};

function mapDbStatusToAtsStatus(dbStatus: string): string {
  if (dbStatus === 'Offer') return 'Offered';
  if (dbStatus === 'Joined' || dbStatus === 'Accepted') return 'Hired';
  return dbStatus; // Applied, Screening, Shortlisted, Interview, HR, Rejected
}

function mapAtsStatusToDbStatus(atsStatus: string): string {
  if (atsStatus === 'Offered') return 'Offer';
  if (atsStatus === 'Hired') return 'Joined';
  return atsStatus;
}

export default function EmpAtsSection({
  initialTargetApplicantId,
  onClearTargetApplicant,
  initialTargetJobTitle,
  onClearTargetJobTitle,
  addToast
}: EmpAtsSectionProps) {
  const [selectedJob, setSelectedJob] = useState('Senior UI/UX Designer');
  const [recruiterJobs, setRecruiterJobs] = useState<any[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'resume' | 'experience' | 'skills' | 'notes' | 'timeline' | 'offer_details'>('overview');

  // Comparison mode toggle
  const [isCompareMode, setIsCompareMode] = useState(false);

  // Notes form inputs
  const [interviewRound, setInterviewRound] = useState('Technical Round');
  const [interviewer, setInterviewer] = useState('Arjun Mehta');
  const [interviewDate, setInterviewDate] = useState('2024-05-10');
  const [ratings, setRatings] = useState({ technical: 4, communication: 5, problemSolving: 4, culturalFit: 5, overall: 4.5 });
  const [notesComment, setNotesComment] = useState('Excellent performance on live wireframing exercise.');

  // Live and mock candidates database for ATS
  const [pipelineCandidates, setPipelineCandidates] = useState<any[]>([]);

  // Interview Scheduler Modal state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewModalData, setInterviewModalData] = useState({
    candidateId: '',
    mode: 'online' as 'online' | 'offline',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    location: 'TechnoAdviser HQ, Noida, Sector 62',
    date: '2026-07-15T10:00',
    interviewer: 'Rahul Malhotra (Tech Lead)',
    round: 'Technical Architecture Round'
  });

  // Offer Letter Modal state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerModalData, setOfferModalData] = useState({
    candidateId: '',
    mode: 'ai' as 'ai' | 'upload',
    salary: '₹ 15 LPA',
    joiningDate: '2026-08-01',
    terms: 'Standard probation of 3 months. Benefits include health insurance and flexible hybrid workspace.',
    signature: 'Aditya Roy (HR Director)',
    fileName: ''
  });

  // Negotiation message state
  const [recruiterNegotiationMsg, setRecruiterNegotiationMsg] = useState('');

  const loadApplications = async () => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    try {
      const response = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const apps = await response.json();
        if (apps && apps.length > 0) {
          const mapped = apps.map((app: any) => ({
            id: app.id,
            name: app.candidate ? `${app.candidate.firstName} ${app.candidate.lastName}` : app.candidateId,
            role: app.job ? app.job.title : 'Applicant',
            jobId: app.jobId,
            status: mapDbStatusToAtsStatus(app.status),
            match: app.candidate ? `${app.candidate.resumeScore || app.rankingScore || 75}%` : '75%',
            date: `Applied on ${new Date(app.appliedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
            avatar: app.candidate?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${app.candidate?.firstName || 'A'}`,
            phone: app.candidate?.phone || '',
            email: app.candidateId,
            candidateData: app.candidate,
            timeline: app.timeline || [],
            notes: app.notes || '',
            interviewNotes: app.interviewNotes || '',
            interviewSchedule: app.interviewSchedule || '',
            candidateScore: app.candidateScore,
            rankingScore: app.rankingScore
          }));
          setPipelineCandidates(mapped);

          // Keep active details card fresh
          if (selectedApplicant) {
            const updatedApplicant = mapped.find((c: any) => c.id === selectedApplicant.id);
            if (updatedApplicant) {
              setSelectedApplicant(updatedApplicant);
            }
          }
        } else {
          setPipelineCandidates([]);
        }
      }
    } catch (err) {
      console.error('Failed to load applications in ATS:', err);
    }
  };

  React.useEffect(() => {
    const fetchRecruiterJobs = async () => {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      try {
        const response = await fetch(`/api/jobs?limit=100&companyId=${encodeURIComponent(token || '')}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.jobs && data.jobs.length > 0) {
            setRecruiterJobs(data.jobs);

            // Check if initial target job title is present
            if (initialTargetJobTitle) {
              const matchedJob = data.jobs.find((j: any) => j.title.toLowerCase() === initialTargetJobTitle.toLowerCase());
              if (matchedJob) {
                setSelectedJob(matchedJob.id);
                onClearTargetJobTitle?.();
              } else {
                setSelectedJob(data.jobs[0].id);
              }
            } else {
              setSelectedJob(data.jobs[0].id); // Select first job by default
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch recruiter jobs in ATS:', err);
      }
    };
    fetchRecruiterJobs();
    loadApplications();
    const interval = setInterval(loadApplications, 4000); // Poll every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // Update selectedJob when initialTargetJobTitle changes
  React.useEffect(() => {
    if (initialTargetJobTitle && recruiterJobs.length > 0) {
      const matchedJob = recruiterJobs.find((j: any) => j.title.toLowerCase() === initialTargetJobTitle.toLowerCase());
      if (matchedJob) {
        setSelectedJob(matchedJob.id);
        onClearTargetJobTitle?.();
      }
    }
  }, [initialTargetJobTitle, recruiterJobs, onClearTargetJobTitle]);

  // Filter candidates by selectedJob state
  const filteredCandidates = React.useMemo(() => {
    return pipelineCandidates.filter(c => {
      const isDbJob = recruiterJobs.some(rj => rj.id === selectedJob);
      if (isDbJob) {
        return c.jobId === selectedJob;
      }
      return c.role === selectedJob || !c.jobId;
    });
  }, [pipelineCandidates, selectedJob, recruiterJobs]);

  // Drag and drop states
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    e.dataTransfer.setData('text/plain', candidateId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedCandidateId(candidateId);
  };

  const handleDragEnd = () => {
    setDraggedCandidateId(null);
    setDragOverStageId(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('text/plain') || draggedCandidateId;
    if (candidateId) {
      const candidate = pipelineCandidates.find(c => c.id === candidateId);
      if (candidate) {
        if (candidate.status !== stageId) {
          handleMoveCandidate(candidateId, stageId);
        }
      }
    }
    setDragOverStageId(null);
    setDraggedCandidateId(null);
  };

  const stages = [
    { id: 'Applied', label: 'Applied', count: filteredCandidates.filter(c => c.status === 'Applied').length },
    { id: 'Screening', label: 'Screening', count: filteredCandidates.filter(c => c.status === 'Screening').length },
    { id: 'Interview', label: 'Interview', count: filteredCandidates.filter(c => c.status === 'Interview').length },
    { id: 'Offered', label: 'Offered', count: filteredCandidates.filter(c => c.status === 'Offered').length },
    { id: 'Hired', label: 'Hired', count: filteredCandidates.filter(c => c.status === 'Hired').length },
  ];

  const handleMoveCandidate = async (candidateId: string, nextStatus: string) => {
    // Intercept status transition to trigger detailed scheduler/builder flows
    if (nextStatus === 'Interview') {
      const cand = pipelineCandidates.find(c => c.id === candidateId);
      setInterviewModalData({
        candidateId,
        mode: 'online',
        meetLink: 'https://meet.google.com/abc-defg-hij',
        location: 'TechnoAdviser HQ, Noida, Sector 62',
        date: '2026-07-15T10:00',
        interviewer: 'Rahul Malhotra (Tech Lead)',
        round: 'Technical Architecture Round'
      });
      setShowInterviewModal(true);
      return;
    }

    if (nextStatus === 'Offered') {
      setOfferModalData({
        candidateId,
        mode: 'ai',
        salary: '₹ 15 LPA',
        joiningDate: '2026-08-01',
        terms: 'Standard probation of 3 months. Benefits include health insurance and flexible hybrid workspace.',
        signature: 'Aditya Roy (HR Director)',
        fileName: ''
      });
      setShowOfferModal(true);
      return;
    }

    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    const dbStatus = mapAtsStatusToDbStatus(nextStatus);

    if (candidateId && !candidateId.startsWith('cand-')) {
      try {
        const response = await fetch(`/api/applications/${candidateId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: dbStatus })
        });
        if (response.ok) {
          addToast(`Moved candidate to stage: ${nextStatus}!`, 'success');
          await loadApplications();
          return;
        }
      } catch (err) {
        console.error('Error updating candidate status:', err);
      }
    }

    setPipelineCandidates(
      pipelineCandidates.map((c) => {
        if (c.id === candidateId) {
          addToast(`Moved ${c.name} to stage: ${nextStatus}!`, 'success');
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
    if (selectedApplicant && selectedApplicant.id === candidateId) {
      setSelectedApplicant({ ...selectedApplicant, status: nextStatus });
    }
  };

  const handleSaveInterviewSchedule = async () => {
    const { candidateId, mode, meetLink, location, date, interviewer, round } = interviewModalData;
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    const dbStatus = 'Interview';

    const formattedNotes = `Round: ${round} | Interviewer: ${interviewer}`;
    const formattedSchedule = date;
    const interviewNotes = mode === 'online'
      ? `Online Interview - Meet Link: ${meetLink}`
      : `Offline Interview - Address: ${location}`;

    if (candidateId && !candidateId.startsWith('cand-')) {
      try {
        const response = await fetch(`/api/applications/${candidateId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: dbStatus,
            interviewSchedule: formattedSchedule,
            interviewNotes: interviewNotes,
            notes: formattedNotes
          })
        });
        if (response.ok) {
          addToast('Interview scheduled and candidate notified!', 'success');
          setShowInterviewModal(false);
          await loadApplications();
          return;
        }
      } catch (err) {
        console.error('Error scheduling interview:', err);
      }
    }

    // Mock/Fallback
    setPipelineCandidates(
      pipelineCandidates.map((c) => {
        if (c.id === candidateId) {
          addToast('Interview scheduled (simulated)!', 'success');
          return {
            ...c,
            status: 'Interview',
            interviewSchedule: formattedSchedule,
            interviewNotes: interviewNotes,
            notes: formattedNotes
          };
        }
        return c;
      })
    );
    setShowInterviewModal(false);
  };

  const handleSendOfferLetter = async () => {
    const { candidateId, mode, salary, joiningDate, terms, signature, fileName } = offerModalData;
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;

    const offerJsonObj = {
      offer_status: 'PENDING',
      offer_mode: mode,
      salary,
      joining_date: joiningDate,
      terms,
      signature,
      file_name: mode === 'upload' ? (fileName || 'Offer_Letter.pdf') : '',
      offer_text: mode === 'ai' ? `OFFER OF EMPLOYMENT

We are pleased to extend an offer of employment to you for the position at TechnoAdviser.

Compensation details: ${salary}
Target Joining Date: ${joiningDate}
Additional Terms & Perks: ${terms}

Please review these terms and approve or reject the offer from your dashboard.

Best Regards,
${signature}` : `Manual Upload: ${fileName || 'Offer_Letter.pdf'}`,
      chat: []
    };

    const notesString = JSON.stringify(offerJsonObj);

    if (candidateId && !candidateId.startsWith('cand-')) {
      try {
        const response = await fetch(`/api/applications/${candidateId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'Offer',
            notes: notesString
          })
        });
        if (response.ok) {
          addToast('Offer letter sent successfully!', 'success');
          setShowOfferModal(false);
          await loadApplications();
          return;
        }
      } catch (err) {
        console.error('Error sending offer letter:', err);
      }
    }

    // Mock
    setPipelineCandidates(
      pipelineCandidates.map((c) => {
        if (c.id === candidateId) {
          addToast('Offer letter sent (simulated)!', 'success');
          return {
            ...c,
            status: 'Offered',
            notes: notesString
          };
        }
        return c;
      })
    );
    setShowOfferModal(false);
  };

  const handleSendRecruiterNegotiationMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterNegotiationMsg.trim() || !selectedApplicant) return;

    let offerObj: any = {
      offer_status: 'NEGOTIATING',
      offer_mode: 'ai',
      salary: '₹ 15 LPA',
      joining_date: '2026-08-01',
      terms: 'Standard probation.',
      signature: 'HR Director',
      chat: []
    };

    try {
      if (selectedApplicant.notes && selectedApplicant.notes.startsWith('{')) {
        offerObj = JSON.parse(selectedApplicant.notes);
      }
    } catch (err) { }

    const newMsg = {
      sender: 'RECRUITER',
      text: recruiterNegotiationMsg,
      timestamp: new Date().toISOString()
    };

    offerObj.chat = [...(offerObj.chat || []), newMsg];
    offerObj.offer_status = 'NEGOTIATING'; // Set negotiating status

    const notesString = JSON.stringify(offerObj);
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;

    if (!selectedApplicant.id.startsWith('cand-')) {
      try {
        const response = await fetch(`/api/applications/${selectedApplicant.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'Offer',
            notes: notesString
          })
        });
        if (response.ok) {
          addToast('Response transmitted successfully!', 'success');
          setRecruiterNegotiationMsg('');
          await loadApplications();
          return;
        }
      } catch (err) {
        console.error('Error posting message:', err);
      }
    }

    // Mock
    setPipelineCandidates(
      pipelineCandidates.map((c) => {
        if (c.id === selectedApplicant.id) {
          return { ...c, notes: notesString };
        }
        return c;
      })
    );
    setSelectedApplicant({ ...selectedApplicant, notes: notesString });
    setRecruiterNegotiationMsg('');
    addToast('Negotiation message added (simulated).', 'success');
  };

  const handleSendInterviewNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;

    if (selectedApplicant && !selectedApplicant.id.startsWith('cand-')) {
      try {
        const response = await fetch(`/api/applications/${selectedApplicant.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            rating: ratings.overall,
            notes: notesComment,
            interviewSchedule: interviewDate,
            interviewNotes: `Round: ${interviewRound} | Interviewer: ${interviewer}`
          })
        });
        if (response.ok) {
          addToast(`Notes and ratings saved for ${selectedApplicant.name}!`, 'success');
          await loadApplications();
          setNotesComment('');
          return;
        }
      } catch (err) {
        console.error('Error saving candidate notes:', err);
      }
    }

    addToast(`Notes and ratings saved for ${selectedApplicant?.name}!`, 'success');
    setNotesComment('');
  };

  // Automatic routing if initial target provided
  React.useEffect(() => {
    if (initialTargetApplicantId) {
      const match = pipelineCandidates.find((c) => c.id === initialTargetApplicantId);
      if (match) {
        setSelectedApplicant(match);
        if (match.jobId) {
          setSelectedJob(match.jobId);
        }
      }
    }
  }, [initialTargetApplicantId, pipelineCandidates]);

  // Read offer details if exists
  let offerDetailsObj: any = null;
  let offerStatusLabel = 'PENDING';
  if (selectedApplicant) {
    try {
      if (selectedApplicant.notes && selectedApplicant.notes.startsWith('{')) {
        offerDetailsObj = JSON.parse(selectedApplicant.notes);
        offerStatusLabel = offerDetailsObj.offer_status || 'PENDING';
      }
    } catch (err) { }
  }

  return (
    <div className="space-y-8">

      {/* Top ATS Header & Filter dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-theme pb-5">
        <div>
          <h1 className="text-xl font-black text-text-primary-theme uppercase tracking-wider">ATS Pipeline</h1>
          <p className="text-xs text-text-secondary-theme font-semibold">Track applicants through standard screening, interview and offer stages.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="bg-surface-theme border border-border-theme px-4 py-2 rounded-xl text-xs font-black text-text-primary-theme focus:outline-none focus:border-primary-theme cursor-pointer"
          >
            {recruiterJobs.length > 0 ? (
              recruiterJobs.map((job) => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))
            ) : (
              <>
                <option value="Senior UI/UX Designer">Senior UI/UX Designer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Product Manager">Product Manager</option>
              </>
            )}
          </select>

          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${isCompareMode
                ? 'bg-primary-theme text-white'
                : 'bg-surface-theme border border-border-theme text-text-secondary-theme hover:bg-border-theme/40'
              }`}
          >
            {isCompareMode ? 'Exit Comparison' : 'Compare Candidates'}
          </button>
        </div>
      </div>

      {/* RENDER MODAL OR DETAIL PANEL IF SELECTED APPLICANT */}
      <AnimatePresence>
        {selectedApplicant && !isCompareMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-surface-theme p-6 rounded-3xl border border-border-theme shadow-md space-y-6"
          >
            {/* Header / Bio Card segment */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border-theme/60">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedApplicant(null);
                    onClearTargetApplicant();
                  }}
                  className="p-1.5 hover:bg-border-theme/40 rounded-xl cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 text-text-secondary-theme" />
                </button>
                <img src={selectedApplicant.avatar} alt={selectedApplicant.name} className="w-12 h-12 rounded-full object-cover border border-border-theme" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-text-primary-theme">{selectedApplicant.name}</h3>
                    {selectedApplicant.status === 'Offered' && offerStatusLabel === 'REJECTED' && (
                      <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                        Offer Rejected
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-text-secondary-theme font-medium">{selectedApplicant.role} &middot; Match: {selectedApplicant.match}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedApplicant.status}
                  onChange={(e) => handleMoveCandidate(selectedApplicant.id, e.target.value)}
                  className="bg-border-theme/40 text-text-primary-theme border border-border-theme/50 px-3.5 py-2 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                >
                  {stages.map((st) => (
                    <option key={st.id} value={st.id}>Move to: {st.label}</option>
                  ))}
                </select>



                {selectedApplicant.status === 'Offered' && (
                  <button
                    onClick={() => {
                      setOfferModalData({
                        candidateId: selectedApplicant.id,
                        mode: offerDetailsObj ? offerDetailsObj.offer_mode : 'ai',
                        salary: offerDetailsObj ? offerDetailsObj.salary : '₹ 15 LPA',
                        joiningDate: offerDetailsObj ? offerDetailsObj.joining_date : '2026-08-01',
                        terms: offerDetailsObj ? offerDetailsObj.terms : 'Standard probation of 3 months. Benefits include health insurance and flexible hybrid workspace.',
                        signature: offerDetailsObj ? offerDetailsObj.signature : 'Aditya Roy (HR Director)',
                        fileName: offerDetailsObj ? offerDetailsObj.file_name : ''
                      });
                      setShowOfferModal(true);
                    }}
                    className="px-4 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl transition-all cursor-pointer"
                  >
                    {offerDetailsObj ? 'Re-send / Edit Offer' : 'Send Offer Letter'}
                  </button>
                )}
              </div>
            </div>

            {/* Sub-Tab Selector for Details */}
            <div className="flex border-b border-border-theme/40 pb-2 overflow-x-auto gap-2">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'resume', label: 'Resume Preview' },
                { id: 'experience', label: 'Experience Details' },
                { id: 'skills', label: 'Skills Grid' },
                ...(selectedApplicant.status === 'Offered' || selectedApplicant.status === 'Hired' ? [{ id: 'offer_details', label: 'Offer & Negotiation' }] : []),
                { id: 'notes', label: 'Interview Notes' },
                { id: 'timeline', label: 'Hiring Timeline' },
              ].map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setDetailTab(tb.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${detailTab === tb.id
                      ? 'bg-primary-theme/10 text-primary-theme font-black border-b-2 border-primary-theme'
                      : 'text-text-secondary-theme hover:text-text-primary-theme'
                    }`}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            {/* TAB PANELS */}
            <div className="pt-2">

              {/* TAB: OVERVIEW */}
              {detailTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Candidate Contact</h4>
                    <div className="space-y-2 text-xs text-text-secondary-theme font-medium pl-1">
                      <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-theme" /> <span>{selectedApplicant.phone || '+91 84909 11181'}</span></div>
                      <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-theme" /> <span>{selectedApplicant.email || 'rohan.mehta@example.com'}</span></div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-theme" /> <span>{selectedApplicant.candidateData?.currentCity || 'Bengaluru, India'}</span></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Verification Badge Information</h4>
                    <div className="bg-emerald-500/10 border border-emerald-500/15 p-4 rounded-2xl flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-black text-emerald-500 block">Verified match ratio: {selectedApplicant.match}</span>
                        <p className="text-[10px] text-text-secondary-theme font-medium leading-relaxed">This candidate matches all core requirement tags set in the job vacancy.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: RESUME */}
              {detailTab === 'resume' && (
                <div className="space-y-4 bg-border-theme/10 p-5 rounded-2xl border border-border-theme/40">
                  <div className="flex justify-between items-center pb-2 border-b border-border-theme/30">
                    <span className="text-[10px] font-black font-mono text-text-muted-theme">FILE: {selectedApplicant.name}_Resume.pdf</span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-theme text-white text-[10px] font-black rounded-lg hover:bg-primary-hover-theme transition-colors cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-text-secondary-theme leading-relaxed whitespace-pre-wrap select-none p-4 bg-surface-theme border border-border-theme/60 rounded-xl shadow-inner max-h-72 overflow-y-auto">
                    {getResumeContent(selectedApplicant)}
                  </pre>
                </div>
              )}

              {/* TAB: EXPERIENCE */}
              {detailTab === 'experience' && (
                <div className="space-y-4">
                  {selectedApplicant.candidateData?.experienceHistory && selectedApplicant.candidateData.experienceHistory.length > 0 ? (
                    selectedApplicant.candidateData.experienceHistory.map((xp: any, idx: number) => (
                      <div key={idx} className="border-l-2 border-primary-theme pl-4 py-1 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-text-primary-theme">{xp.role}</span>
                          <span className="font-mono text-text-muted-theme">{xp.duration || 'N/A'}</span>
                        </div>
                        <span className="text-[10px] font-bold text-primary-theme block">{xp.company}</span>
                        {xp.description && (
                          <p className="text-[10px] text-text-secondary-theme leading-relaxed font-medium">
                            {xp.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-text-secondary-theme font-medium italic">
                      No industry experience history listed (Entry-Level / Fresher).
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SKILLS */}
              {detailTab === 'skills' && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedApplicant.candidateData?.skills && selectedApplicant.candidateData.skills.length > 0 ? (
                    selectedApplicant.candidateData.skills.map((sk: string) => (
                      <div key={sk} className="bg-surface-theme border border-border-theme px-4 py-2.5 rounded-2xl flex flex-col justify-between shadow-sm min-w-[120px]">
                        <span className="text-xs font-black text-text-primary-theme block">{sk}</span>
                        <span className="text-[10px] font-bold text-primary-theme font-mono mt-1">Verified Expert</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-text-secondary-theme font-medium italic">
                      No skills listed on profile.
                    </div>
                  )}
                </div>
              )}

              {/* TAB: NOTES */}
              {detailTab === 'notes' && (() => {
                const isNotesReadOnly = selectedApplicant.status === 'Offered' || selectedApplicant.status === 'Hired';
                return (
                  <div className="space-y-5 max-w-2xl">
                    {/* Schedule summary if exists */}
                    {selectedApplicant.interviewSchedule ? (
                      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-amber-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-wider">Scheduled Interview Details</span>
                          </div>
                          {!isNotesReadOnly && (
                            <button
                              type="button"
                              onClick={() => {
                                setInterviewModalData({
                                  candidateId: selectedApplicant.id,
                                  mode: selectedApplicant.interviewNotes?.includes('Online') ? 'online' : 'offline',
                                  meetLink: selectedApplicant.interviewNotes?.includes('Meet Link: ') ? selectedApplicant.interviewNotes.split('Meet Link: ')[1] : 'https://meet.google.com/abc-defg-hij',
                                  location: selectedApplicant.interviewNotes?.includes('Address: ') ? selectedApplicant.interviewNotes.split('Address: ')[1] : 'TechnoAdviser HQ, Noida, Sector 62',
                                  date: selectedApplicant.interviewSchedule || '2026-07-15T10:00',
                                  interviewer: selectedApplicant.notes?.includes('Interviewer: ') ? selectedApplicant.notes.split('Interviewer: ')[1] : 'Rahul Malhotra (Tech Lead)',
                                  round: selectedApplicant.notes?.includes('Round: ') ? selectedApplicant.notes.split('Round: ')[1].split(' | ')[0] : 'Technical Architecture Round'
                                });
                                setShowInterviewModal(true);
                              }}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black rounded-lg transition-all cursor-pointer"
                            >
                              Update Interview Details
                            </button>
                          )}
                        </div>
                        <div className="text-xs space-y-1 font-semibold text-text-secondary-theme">
                          <div className="flex justify-between">
                            <span className="text-text-muted-theme font-medium">Date & Time: </span>
                            <span className="text-text-primary-theme font-extrabold">
                              {new Date(selectedApplicant.interviewSchedule).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {selectedApplicant.interviewNotes && (
                            <div className="flex justify-between">
                              <span className="text-text-muted-theme font-medium">Meeting Info / Venue: </span>
                              <span className="text-text-primary-theme font-extrabold">{selectedApplicant.interviewNotes}</span>
                            </div>
                          )}
                          {selectedApplicant.notes && !selectedApplicant.notes.startsWith('{') && (
                            <div className="flex justify-between">
                              <span className="text-text-muted-theme font-medium">Round & Interviewer: </span>
                              <span className="text-text-primary-theme font-extrabold">{selectedApplicant.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      selectedApplicant.status === 'Interview' && !isNotesReadOnly && (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between">
                          <div className="text-xs font-semibold text-text-secondary-theme">
                            No interview scheduled yet for this candidate.
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setInterviewModalData({
                                candidateId: selectedApplicant.id,
                                mode: 'online',
                                meetLink: 'https://meet.google.com/abc-defg-hij',
                                location: 'TechnoAdviser HQ, Noida, Sector 62',
                                date: '2026-07-15T10:00',
                                interviewer: 'Rahul Malhotra (Tech Lead)',
                                round: 'Technical Architecture Round'
                              });
                              setShowInterviewModal(true);
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black rounded-lg transition-all cursor-pointer"
                          >
                            Update Interview Details
                          </button>
                        </div>
                      )
                    )}

                    {isNotesReadOnly && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl text-xs font-semibold flex items-center gap-2">
                        <Info className="w-5 h-5 flex-shrink-0" />
                        <span>This application has progressed to the Offered/Hired stage. The interview ratings and feedback comments are now archived and read-only.</span>
                      </div>
                    )}

                    <form onSubmit={handleSendInterviewNotes} className="space-y-4 bg-border-theme/10 p-5 rounded-2xl border border-border-theme/40 shadow-inner">
                      <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Technical Review & Ratings</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Interview Round</label>
                          <select
                            disabled={isNotesReadOnly}
                            value={interviewRound}
                            onChange={(e) => setInterviewRound(e.target.value)}
                            className="w-full bg-surface-theme border border-border-theme rounded-xl p-2.5 text-xs font-bold focus:outline-none disabled:opacity-60"
                          >
                            <option>Technical Round</option>
                            <option>HR Screening</option>
                            <option>System Architecture</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Interviewer</label>
                          <input
                            disabled={isNotesReadOnly}
                            type="text"
                            value={interviewer}
                            onChange={(e) => setInterviewer(e.target.value)}
                            className="w-full bg-surface-theme border border-border-theme rounded-xl p-2.5 text-xs font-bold focus:outline-none disabled:opacity-60"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Review Date</label>
                          <input
                            disabled={isNotesReadOnly}
                            type="date"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            className="w-full bg-surface-theme border border-border-theme rounded-xl p-2.5 text-xs font-bold focus:outline-none disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Comments / Recommendation Notes</label>
                        <textarea
                          disabled={isNotesReadOnly}
                          rows={3}
                          value={notesComment}
                          onChange={(e) => setNotesComment(e.target.value)}
                          placeholder={isNotesReadOnly ? "No comments archived." : "Input feedback description..."}
                          className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs font-semibold resize-none focus:outline-none disabled:opacity-60"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-border-theme/40 pt-3">
                        {Object.entries(ratings).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <span className="text-[8px] font-black uppercase text-text-muted-theme tracking-widest">{key}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-extrabold font-mono text-text-primary-theme">{value}/5</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {!isNotesReadOnly && (
                        <button
                          type="submit"
                          className="px-4.5 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl transition-all cursor-pointer"
                        >
                          Save Notes & Ratings
                        </button>
                      )}
                    </form>
                  </div>
                );
              })()}

              {/* TAB: TIMELINE */}
              {detailTab === 'timeline' && (
                <div className="space-y-6 pl-4 pt-2 relative">
                  <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-border-theme/60" />
                  {selectedApplicant.timeline && selectedApplicant.timeline.length > 0 ? (
                    selectedApplicant.timeline.map((tl: any, idx: number) => (
                      <div key={idx} className="relative pl-6 space-y-1">
                        <div className="absolute left-[-23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-primary-theme bg-surface-theme" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-text-primary-theme">
                            {tl.status === 'Applied' ? 'Application Transmitted' :
                              tl.status === 'Screening' ? 'Screening Candidate' :
                                tl.status === 'Interview' ? 'Interview Scheduled' :
                                  tl.status === 'Offer' ? 'Offer Extended' :
                                    tl.status === 'Accepted' ? 'Offer Approved & Accepted' :
                                      tl.status === 'Rejected' ? 'Application Terminated' : tl.status}
                          </span>
                          <span className="font-mono text-[10px] text-text-muted-theme">
                            {tl.timestamp ? new Date(tl.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                          </span>
                        </div>
                        {tl.note && (
                          <p className="text-[10px] text-text-secondary-theme font-medium leading-relaxed italic">
                            "{tl.note}"
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="relative pl-6 space-y-1">
                      <div className="absolute left-[-23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-primary-theme bg-surface-theme" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-text-primary-theme">Application Transmitted</span>
                        <span className="font-mono text-[10px] text-text-muted-theme">{selectedApplicant.date}</span>
                      </div>
                      <p className="text-[10px] text-text-secondary-theme font-medium">Initial submission received.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: OFFER DETAILS & NEGOTIATION */}
              {detailTab === 'offer_details' && (
                <div className="space-y-6">
                  {!offerDetailsObj ? (
                    <div className="text-center py-10 bg-border-theme/10 border border-border-theme rounded-2xl space-y-3">
                      <FileText className="w-10 h-10 text-text-muted-theme mx-auto" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-text-primary-theme">No Offer Letter Generated Yet</h4>
                        <p className="text-[10px] text-text-secondary-theme max-w-sm mx-auto">
                          Configure a formal offer proposal containing compensation details, joining date, and terms for this candidate.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setOfferModalData({
                            candidateId: selectedApplicant.id,
                            mode: 'ai',
                            salary: '₹ 15 LPA',
                            joiningDate: '2026-08-01',
                            terms: 'Standard probation of 3 months. Benefits include health insurance and flexible hybrid workspace.',
                            signature: 'Aditya Roy (HR Director)',
                            fileName: ''
                          });
                          setShowOfferModal(true);
                        }}
                        className="px-4 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl cursor-pointer"
                      >
                        Create Offer Letter
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                      {/* Offer specifications */}
                      <div className="lg:col-span-6 space-y-4">
                        <div className="bg-bg-theme border border-border-theme/60 p-5 rounded-2xl space-y-4">
                          <div className="flex justify-between items-center border-b border-border-theme/40 pb-3">
                            <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Offer Summary</h4>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${offerStatusLabel === 'ACCEPTED' || selectedApplicant.status === 'Hired' ? 'bg-success-theme/10 text-success-theme border border-success-theme/20' :
                                offerStatusLabel === 'REJECTED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                  offerStatusLabel === 'NEGOTIATING' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              }`}>
                              {offerStatusLabel === 'ACCEPTED' || selectedApplicant.status === 'Hired' ? 'Offer Accepted' :
                                offerStatusLabel === 'REJECTED' ? 'Offer Rejected' :
                                  offerStatusLabel === 'NEGOTIATING' ? 'Negotiating' : 'Offer Sent'}
                            </span>
                          </div>

                          <div className="text-xs space-y-2 font-semibold text-text-secondary-theme">
                            <div className="flex justify-between">
                              <span className="text-text-muted-theme">Proposed Salary:</span>
                              <span className="text-text-primary-theme font-bold">{offerDetailsObj.salary}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted-theme">Joining Date:</span>
                              <span className="text-text-primary-theme font-bold">{offerDetailsObj.joining_date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted-theme">Offer Format:</span>
                              <span className="text-text-primary-theme font-bold uppercase">{offerDetailsObj.offer_mode}</span>
                            </div>
                            <div className="border-t border-border-theme/40 pt-2 space-y-1">
                              <span className="text-text-muted-theme block">Job Terms & Benefits:</span>
                              <p className="text-[11px] text-text-primary-theme font-medium leading-relaxed bg-surface-theme p-3 rounded-xl border border-border-theme/40">
                                {offerDetailsObj.terms}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setOfferModalData({
                                candidateId: selectedApplicant.id,
                                mode: offerDetailsObj.offer_mode,
                                salary: offerDetailsObj.salary,
                                joiningDate: offerDetailsObj.joining_date,
                                terms: offerDetailsObj.terms,
                                signature: offerDetailsObj.signature,
                                fileName: offerDetailsObj.file_name
                              });
                              setShowOfferModal(true);
                            }}
                            className="flex-1 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl cursor-pointer"
                          >
                            Modify & Re-issue Offer
                          </button>
                        </div>
                      </div>

                      {/* Negotiation Thread */}
                      <div className="lg:col-span-6 bg-bg-theme border border-border-theme/60 rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
                        <div>
                          <div className="flex items-center gap-2 border-b border-border-theme/40 pb-3 mb-3">
                            <MessageSquare className="w-4 h-4 text-primary-theme" />
                            <span className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Negotiation Log</span>
                          </div>

                          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                            {offerDetailsObj.chat && offerDetailsObj.chat.length > 0 ? (
                              offerDetailsObj.chat.map((msg: any, idx: number) => {
                                const isRecruiter = msg.sender === 'RECRUITER';
                                return (
                                  <div key={idx} className={`flex flex-col ${isRecruiter ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3 rounded-2xl text-xs max-w-[85%] font-medium leading-relaxed ${isRecruiter
                                        ? 'bg-primary-theme text-white rounded-tr-none'
                                        : 'bg-surface-theme border border-border-theme text-text-primary-theme rounded-tl-none'
                                      }`}>
                                      {msg.text}
                                    </div>
                                    <span className="text-[8px] text-text-muted-theme mt-1 font-mono">
                                      {isRecruiter ? 'You' : selectedApplicant.name} &bull; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-[10px] text-text-muted-theme italic text-center py-6">
                                No discussion initiated. Candidate has not started negotiations yet.
                              </p>
                            )}
                          </div>
                        </div>

                        <form onSubmit={handleSendRecruiterNegotiationMsg} className="mt-4 pt-3 border-t border-border-theme/40 flex gap-2">
                          <input
                            type="text"
                            value={recruiterNegotiationMsg}
                            onChange={(e) => setRecruiterNegotiationMsg(e.target.value)}
                            placeholder="Type a message or negotiation update..."
                            className="flex-1 bg-surface-theme border border-border-theme rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="p-2 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </div>

                    </div>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW: ATS PIPELINE GRID (Only show if not compare mode and no selected candidate details) */}
      {!selectedApplicant && !isCompareMode && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map((stage) => {
            const stageCands = filteredCandidates.filter((c) => c.status === stage.id);
            const isOver = dragOverStageId === stage.id;
            return (
              <div
                key={stage.id}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={() => setDragOverStageId(null)}
                onDrop={(e) => handleDrop(e, stage.id)}
                className={`bg-surface-theme border rounded-2xl p-4 space-y-4 flex flex-col min-h-[400px] transition-all duration-200 ${isOver
                    ? 'border-primary-theme bg-primary-theme/5 scale-[1.01] ring-2 ring-primary-theme/10 shadow-md'
                    : 'border-border-theme'
                  }`}
              >

                {/* Header pipeline segment */}
                <div className="flex items-center justify-between pb-2 border-b border-border-theme/40">
                  <span className="text-xs font-black text-text-primary-theme uppercase tracking-wider">{stage.label}</span>
                  <span className="bg-border-theme/50 text-text-secondary-theme px-2 py-0.5 rounded text-[10px] font-mono font-black">{stageCands.length}</span>
                </div>

                {/* Candidate feed columns list */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[50vh] pr-1">
                  {stageCands.map((c) => {
                    const isBeingDragged = draggedCandidateId === c.id;
                    let hasRejectedOffer = false;
                    try {
                      if (c.status === 'Offered' && c.notes && c.notes.startsWith('{')) {
                        const parsedNotes = JSON.parse(c.notes);
                        hasRejectedOffer = parsedNotes.offer_status === 'REJECTED';
                      }
                    } catch (err) { }

                    return (
                      <div
                        key={c.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, c.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedApplicant(c)}
                        className={`bg-border-theme/20 hover:border-primary-theme/30 hover:shadow border p-3.5 rounded-xl space-y-2 cursor-grab active:cursor-grabbing transition-all ${isBeingDragged
                            ? 'opacity-40 border-dashed border-primary-theme/60 scale-95 bg-border-theme/10 shadow-none'
                            : hasRejectedOffer
                              ? 'border-red-500/40 bg-red-500/5 hover:scale-[1.01]'
                              : 'border-border-theme/60 hover:scale-[1.01]'
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover border border-border-theme/50" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 justify-between">
                              <span className="text-xs font-black text-text-primary-theme block truncate">{c.name}</span>
                              {hasRejectedOffer && (
                                <span className="bg-red-500/10 text-red-500 text-[6px] font-black uppercase tracking-wider px-1 rounded flex-shrink-0">
                                  Rejected Offer
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-text-muted-theme font-mono">{c.match} Match</span>
                          </div>
                        </div>
                        <div className="text-[9px] text-text-secondary-theme font-bold flex justify-between items-center">
                          <span>{c.date}</span>
                          <span className="text-[8px] uppercase tracking-wider text-text-muted-theme px-1.5 py-0.5 bg-border-theme/30 rounded-md font-extrabold">Drag &rarr;</span>
                        </div>
                      </div>
                    );
                  })}

                  {stageCands.length === 0 && (
                    <div className="h-full flex items-center justify-center p-8 text-center min-h-[120px]">
                      <span className="text-[10px] text-text-muted-theme font-bold uppercase">
                        {isOver ? 'Drop candidate here' : 'No Applicants'}
                      </span>
                    </div>
                  )}

                  {/* Drop indicator outline when dragging from another column */}
                  {draggedCandidateId && !stageCands.some(c => c.id === draggedCandidateId) && (
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center flex items-center justify-center transition-all ${isOver
                        ? 'border-primary-theme/60 bg-primary-theme/10 scale-[1.01]'
                        : 'border-border-theme/40 bg-border-theme/5 opacity-50'
                      }`}>
                      <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider">
                        Drop zone
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: CANDIDATE COMPARISON MATRIX */}
      {isCompareMode && (
        <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="pb-4 border-b border-border-theme/60">
            <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">Candidate Comparison Matrix</h2>
            <p className="text-[10px] text-text-secondary-theme font-semibold">Side-by-side review of top short-listed Design specialists.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
              <thead>
                <tr className="bg-border-theme/20 border-b border-border-theme">
                  <th className="p-4 pl-6 text-[10px] uppercase font-black tracking-widest text-text-muted-theme">Metrics parameters</th>
                  <th className="p-4">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="block text-xs font-black">Rohan Mehta</span>
                        <span className="text-[9px] text-text-secondary-theme">Senior UX/UI</span>
                      </div>
                    </div>
                  </th>
                  <th className="p-4">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="block text-xs font-black">Arjun Reddy</span>
                        <span className="text-[9px] text-text-secondary-theme">Product Designer</span>
                      </div>
                    </div>
                  </th>
                  <th className="p-4">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="block text-xs font-black">Sneha Kapoor</span>
                        <span className="text-[9px] text-text-secondary-theme">Designer Specialist</span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme/40 font-semibold text-text-secondary-theme">
                <tr>
                  <td className="p-4 pl-6 font-black text-text-primary-theme">Experience</td>
                  <td className="p-4 text-text-primary-theme">4.5 Years</td>
                  <td className="p-4 text-text-primary-theme">5 Years</td>
                  <td className="p-4 text-text-primary-theme">3.5 Years</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-black text-text-primary-theme">Core Skills</td>
                  <td className="p-4">🎨 Figma, System Design</td>
                  <td className="p-4">📈 Wireframing, UX</td>
                  <td className="p-4">🔥 Prototyping, Figma</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-black text-text-primary-theme">Technical Round</td>
                  <td className="p-4 font-mono">4.5 / 5.0</td>
                  <td className="p-4 font-mono">4.0 / 5.0</td>
                  <td className="p-4 font-mono">3.5 / 5.0</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-black text-text-primary-theme">HR Screening</td>
                  <td className="p-4 font-mono">4.0 / 5.0</td>
                  <td className="p-4 font-mono">4.5 / 5.0</td>
                  <td className="p-4 font-mono">4.0 / 5.0</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-black text-text-primary-theme">Expected Salary</td>
                  <td className="p-4 font-mono">₹ 12 LPA</td>
                  <td className="p-4 font-mono">₹ 11 LPA</td>
                  <td className="p-4 font-mono">₹ 10 LPA</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-black text-text-primary-theme">Notice Period</td>
                  <td className="p-4">30 Days</td>
                  <td className="p-4">45 Days</td>
                  <td className="p-4 font-mono">30 Days</td>
                </tr>
                <tr className="bg-primary-theme/5">
                  <td className="p-4 pl-6 font-black text-primary-theme">Overall Score</td>
                  <td className="p-4 font-mono text-primary-theme font-black text-sm">4.3</td>
                  <td className="p-4 font-mono text-primary-theme font-black text-sm">4.2</td>
                  <td className="p-4 font-mono text-primary-theme font-black text-sm">3.8</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6"></td>
                  <td className="p-4">
                    <button onClick={() => addToast('Shortlisted Rohan Mehta!', 'success')} className="px-3 py-1.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-[10px] font-black rounded-lg cursor-pointer">Shortlist</button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => addToast('Shortlisted Arjun Reddy!', 'success')} className="px-3 py-1.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-[10px] font-black rounded-lg cursor-pointer">Shortlist</button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => addToast('Shortlisted Sneha Kapoor!', 'success')} className="px-3 py-1.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-[10px] font-black rounded-lg cursor-pointer">Shortlist</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. MODAL: INTERVIEW SCHEDULER */}
      {/* ======================================================== */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-5"
          >
            <div className="flex justify-between items-center border-b border-border-theme/40 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">Schedule Interview</h3>
              </div>
              <button
                onClick={() => setShowInterviewModal(false)}
                className="p-1 hover:bg-border-theme/40 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4 text-text-secondary-theme" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Interview Mode</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-text-primary-theme font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="online"
                      checked={interviewModalData.mode === 'online'}
                      onChange={() => setInterviewModalData({ ...interviewModalData, mode: 'online' })}
                      className="accent-primary-theme"
                    />
                    Online (Google Meet / Link)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-text-primary-theme font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="offline"
                      checked={interviewModalData.mode === 'offline'}
                      onChange={() => setInterviewModalData({ ...interviewModalData, mode: 'offline' })}
                      className="accent-primary-theme"
                    />
                    Offline (In-Person / Office)
                  </label>
                </div>
              </div>

              {interviewModalData.mode === 'online' ? (
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Google Meet / Online Link</label>
                  <input
                    type="url"
                    value={interviewModalData.meetLink}
                    onChange={(e) => setInterviewModalData({ ...interviewModalData, meetLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    className="w-full bg-bg-theme border border-border-theme rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Office Address Venue</label>
                  <input
                    type="text"
                    value={interviewModalData.location}
                    onChange={(e) => setInterviewModalData({ ...interviewModalData, location: e.target.value })}
                    placeholder="Enter office venue address..."
                    className="w-full bg-bg-theme border border-border-theme rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Interviewer Name</label>
                  <input
                    type="text"
                    value={interviewModalData.interviewer}
                    onChange={(e) => setInterviewModalData({ ...interviewModalData, interviewer: e.target.value })}
                    placeholder="Rahul Malhotra"
                    className="w-full bg-bg-theme border border-border-theme rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={interviewModalData.date}
                    onChange={(e) => setInterviewModalData({ ...interviewModalData, date: e.target.value })}
                    className="w-full bg-bg-theme border border-border-theme rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Interview Round Title</label>
                <input
                  type="text"
                  value={interviewModalData.round}
                  onChange={(e) => setInterviewModalData({ ...interviewModalData, round: e.target.value })}
                  placeholder="Technical Architecture Round"
                  className="w-full bg-bg-theme border border-border-theme rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border-theme/40">
              <button
                onClick={() => setShowInterviewModal(false)}
                className="flex-1 py-2.5 border border-border-theme rounded-xl text-xs font-bold text-text-secondary-theme hover:bg-border-theme/20 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInterviewSchedule}
                className="flex-1 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Schedule & Notify
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MODAL: OFFER LETTER BUILDER */}
      {/* ======================================================== */}
      {showOfferModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-5"
          >
            <div className="flex justify-between items-center border-b border-border-theme/40 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-theme" />
                <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">Create Offer Proposal</h3>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="p-1 hover:bg-border-theme/40 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4 text-text-secondary-theme" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Format Source</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-text-primary-theme font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="offer_mode"
                      value="ai"
                      checked={offerModalData.mode === 'ai'}
                      onChange={() => setOfferModalData({ ...offerModalData, mode: 'ai' })}
                      className="accent-primary-theme"
                    />
                    Generate Draft with AI Template
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-text-primary-theme font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="offer_mode"
                      value="upload"
                      checked={offerModalData.mode === 'upload'}
                      onChange={() => setOfferModalData({ ...offerModalData, mode: 'upload' })}
                      className="accent-primary-theme"
                    />
                    Upload Document PDF
                  </label>
                </div>
              </div>

              {offerModalData.mode === 'ai' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Proposed Salary Package</label>
                      <input
                        type="text"
                        value={offerModalData.salary}
                        onChange={(e) => setOfferModalData({ ...offerModalData, salary: e.target.value })}
                        placeholder="e.g. ₹ 15 LPA"
                        className="w-full bg-bg-theme border border-border-theme rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Joining Date</label>
                      <input
                        type="date"
                        value={offerModalData.joiningDate}
                        onChange={(e) => setOfferModalData({ ...offerModalData, joiningDate: e.target.value })}
                        className="w-full bg-bg-theme border border-border-theme rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Job Terms / Benefits Details</label>
                    <textarea
                      rows={3}
                      value={offerModalData.terms}
                      onChange={(e) => setOfferModalData({ ...offerModalData, terms: e.target.value })}
                      placeholder="Enter probation, bonuses, policies..."
                      className="w-full bg-bg-theme border border-border-theme rounded-xl p-3 text-xs font-semibold resize-none focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">HR Signature Sign-off Name</label>
                    <input
                      type="text"
                      value={offerModalData.signature}
                      onChange={(e) => setOfferModalData({ ...offerModalData, signature: e.target.value })}
                      placeholder="Aditya Roy (HR Director)"
                      className="w-full bg-bg-theme border border-border-theme rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border-theme rounded-2xl p-6 text-center space-y-2">
                    <Upload className="w-8 h-8 text-text-muted-theme mx-auto" />
                    <span className="text-xs font-black text-text-primary-theme block">Drag or Upload PDF Offer Letter</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setOfferModalData({ ...offerModalData, fileName: file.name });
                        }
                      }}
                      className="mx-auto text-xs font-semibold cursor-pointer max-w-[200px]"
                    />
                    {offerModalData.fileName && (
                      <span className="text-[10px] text-success-theme font-bold block pt-1 font-mono">
                        Selected: {offerModalData.fileName}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Proposed Salary Package</label>
                      <input
                        type="text"
                        value={offerModalData.salary}
                        onChange={(e) => setOfferModalData({ ...offerModalData, salary: e.target.value })}
                        className="w-full bg-bg-theme border border-border-theme rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-text-secondary-theme uppercase tracking-wider">Joining Date</label>
                      <input
                        type="date"
                        value={offerModalData.joiningDate}
                        onChange={(e) => setOfferModalData({ ...offerModalData, joiningDate: e.target.value })}
                        className="w-full bg-bg-theme border border-border-theme rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-border-theme/40">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 py-2.5 border border-border-theme rounded-xl text-xs font-bold text-text-secondary-theme hover:bg-border-theme/20 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOfferLetter}
                className="flex-1 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl cursor-pointer shadow-sm"
              >
                Send Offer
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
