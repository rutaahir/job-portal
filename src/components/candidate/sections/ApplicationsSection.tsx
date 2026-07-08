/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, CheckCircle, Info, ChevronRight, Ban, Eye, FileText, 
  Send, MessageSquare, AlertTriangle, CheckCircle2, X, Download
} from 'lucide-react';

interface ApplicationsSectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
  onNavigateToTab: (tabId: string) => void;
}

type AppStatusFilter = 'all' | 'applied' | 'interview' | 'offer' | 'rejected';

export default function ApplicationsSection({ addToast, onNavigateToTab }: ApplicationsSectionProps) {
  const [filter, setFilter] = useState<AppStatusFilter>('all');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [appsList, setAppsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [candidateMsgText, setCandidateMsgText] = useState('');

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch('/api/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        
        const getStatusCategory = (backendStatus: string): 'applied' | 'interview' | 'offer' | 'rejected' => {
          const s = backendStatus.toLowerCase();
          if (s === 'applied' || s === 'screening' || s === 'shortlisted') return 'applied';
          if (s === 'interview' || s === 'hr') return 'interview';
          if (s === 'offer' || s === 'accepted' || s === 'joined') return 'offer';
          return 'rejected';
        };

        const getStatusLabel = (backendStatus: string): string => {
          if (backendStatus === 'Applied') return 'Applied - In Review';
          if (backendStatus === 'Screening') return 'Screening';
          if (backendStatus === 'Shortlisted') return 'Shortlisted';
          if (backendStatus === 'Interview') return 'Interview Scheduled';
          if (backendStatus === 'HR') return 'HR Round';
          if (backendStatus === 'Offer') return 'Offer Extended';
          if (backendStatus === 'Accepted') return 'Offer Accepted';
          if (backendStatus === 'Joined') return 'Joined Company';
          return backendStatus;
        };

        const getBadgeColor = (category: string): string => {
          if (category === 'applied') return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
          if (category === 'interview') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
          if (category === 'offer') return 'text-success-theme bg-success-theme/10 border-success-theme/20';
          return 'text-red-500 bg-red-500/10 border-red-500/20';
        };

        const getTimeline = (app: any) => {
          let list: any[] = [];
          if (app.timeline && app.timeline.length > 0) {
            list = app.timeline.map((t: any) => ({
              title: t.note || t.status,
              date: t.timestamp ? new Date(t.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
              done: true
            }));
          } else {
            const dateStr = app.appliedDate || new Date(app.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            list = [{ title: 'Application Transmitted', date: dateStr, done: true }];
          }

          if (app.interviewSchedule) {
            const interviewIndex = list.findIndex(item => item.title.toLowerCase().includes('interview'));
            const detailTitle = `Interview Scheduled - ${app.interviewNotes || 'Technical Evaluation'}`;
            const detailDate = new Date(app.interviewSchedule).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            
            if (interviewIndex !== -1) {
              list[interviewIndex].title = detailTitle;
              list[interviewIndex].date = detailDate;
            } else {
              list.push({
                title: detailTitle,
                date: detailDate,
                done: true
              });
            }
          }
          return list;
        };

        const mapped = data.map((app: any) => {
          const cat = getStatusCategory(app.status);
          const getCompanyLabel = (cid: string) => {
            if (cid === 'employer@meta.com') return 'Meta Platforms Inc';
            if (cid === 'recruiter@tata.com') return 'TCS';
            const name = cid ? cid.split('@')[0] : 'Corporate Partner';
            return name.charAt(0).toUpperCase() + name.slice(1).replace(/[^a-zA-Z]/g, ' ');
          };
          return {
            id: app.id,
            rawStatus: app.status,
            title: app.job?.title || 'Unknown Position',
            company: app.job?.companyName || getCompanyLabel(app.job?.companyId),
            location: app.job?.location || 'Bengaluru, India',
            appliedDate: app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: cat,
            statusLabel: getStatusLabel(app.status),
            badgeColor: getBadgeColor(cat),
            interviewSchedule: app.interviewSchedule,
            interviewNotes: app.interviewNotes,
            notes: app.notes,
            timeline: getTimeline(app)
          };
        });

        setAppsList(mapped);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleWithdraw = (id: string, title: string) => {
    setAppsList(appsList.filter(app => app.id !== id));
    setSelectedAppId(null);
    addToast(`Withdrew application for ${title} successfully.`, 'info');
  };

  const handleCandidateOfferAction = async (appId: string, action: 'ACCEPT' | 'REJECT' | 'NEGOTIATE', msgText?: string) => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    const app = appsList.find(a => a.id === appId);
    if (!app) return;

    let offerObj: any = null;
    try {
      if (app.notes && app.notes.startsWith('{')) {
        offerObj = JSON.parse(app.notes);
      }
    } catch(err){}

    if (!offerObj) {
      offerObj = {
        offer_status: 'PENDING',
        offer_mode: 'ai',
        salary: '₹ 15 LPA',
        joining_date: '2026-08-01',
        terms: 'Standard employment terms apply.',
        signature: 'HR Recruitment Office',
        offer_text: app.notes || 'Offer details summary.',
        chat: []
      };
    }

    let nextStatusVal = app.rawStatus; // keep current state
    let timelineNote = '';

    if (action === 'ACCEPT') {
      nextStatusVal = 'Accepted';
      offerObj.offer_status = 'ACCEPTED';
      timelineNote = 'Candidate approved and accepted the offer letter proposal.';
    } else if (action === 'REJECT') {
      offerObj.offer_status = 'REJECTED';
      timelineNote = 'Candidate rejected the offer letter proposal.';
    } else if (action === 'NEGOTIATE') {
      offerObj.offer_status = 'NEGOTIATING';
      if (msgText?.trim()) {
        offerObj.chat = [...(offerObj.chat || []), {
          sender: 'CANDIDATE',
          text: msgText,
          timestamp: new Date().toISOString()
        }];
      }
      timelineNote = 'Candidate sent a negotiation note.';
    }

    const notesString = JSON.stringify(offerObj);

    try {
      const response = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: nextStatusVal,
          notes: notesString,
          note: timelineNote
        })
      });
      if (response.ok) {
        addToast(action === 'ACCEPT' ? 'Offer approved! Welcoming you aboard!' : action === 'REJECT' ? 'Offer rejected.' : 'Negotiation message sent!', 'success');
        await fetchApplications();
        setCandidateMsgText('');
        return;
      }
    } catch (err) {
      console.error('Error executing candidate action:', err);
    }

    // Mock
    const updatedApps = appsList.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          rawStatus: nextStatusVal,
          statusLabel: nextStatusVal === 'Accepted' ? 'Offer Accepted' : a.statusLabel,
          notes: notesString
        };
      }
      return a;
    });
    setAppsList(updatedApps);
    setCandidateMsgText('');
    addToast('Action updated (simulated).', 'success');
  };

  const filteredApps = appsList.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const counts = {
    all: appsList.length,
    applied: appsList.filter(a => a.status === 'applied').length,
    interview: appsList.filter(a => a.status === 'interview').length,
    offer: appsList.filter(a => a.status === 'offer').length,
    rejected: appsList.filter(a => a.status === 'rejected').length
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div>
        <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
          My Applications
        </h2>
        <p className="text-xs text-text-secondary-theme">Track your active corporate job application statuses</p>
      </div>

      {/* Numerical Tabs Selector */}
      <div className="flex border border-border-theme p-1 rounded-2xl bg-surface-theme/60 overflow-x-auto gap-1 scrollbar-none">
        {[
          { id: 'all', label: 'All', count: counts.all },
          { id: 'applied', label: 'Applied', count: counts.applied },
          { id: 'interview', label: 'Interview', count: counts.interview },
          { id: 'offer', label: 'Offer', count: counts.offer },
          { id: 'rejected', label: 'Rejected', count: counts.rejected }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setFilter(tab.id as AppStatusFilter);
              setSelectedAppId(null);
            }}
            className={`flex-1 min-w-[70px] text-center py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              filter === tab.id
                ? 'bg-primary-theme text-white'
                : 'text-text-secondary-theme hover:bg-border-theme/40'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-border-theme text-text-secondary-theme'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 bg-surface-theme border border-border-theme rounded-2xl">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-theme"></div>
          <p className="text-xs text-text-muted-theme font-semibold mt-4">Retrieving application pipelines from server...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left side: Applications list */}
        <div className={`space-y-3 ${selectedAppId ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          {filteredApps.length === 0 ? (
            <div className="text-center py-10 bg-surface-theme border border-border-theme rounded-2xl">
              <p className="text-xs text-text-muted-theme font-semibold">No applications found in this status category.</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedAppId(app.id === selectedAppId ? null : app.id)}
                className={`p-4 bg-surface-theme border rounded-2xl shadow-sm hover:border-primary-theme transition-all cursor-pointer flex justify-between items-center ${
                  selectedAppId === app.id ? 'border-primary-theme bg-primary-theme/5' : 'border-border-theme/60'
                }`}
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-theme/10 text-primary-theme font-black flex items-center justify-center text-sm flex-shrink-0">
                    {app.company.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-primary-theme">{app.title}</h4>
                    <p className="text-[10px] text-text-secondary-theme font-semibold">{app.company} &bull; {app.location}</p>
                    <p className="text-[9px] text-text-muted-theme font-bold font-mono">Applied on {app.appliedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${app.badgeColor}`}>
                    {app.statusLabel}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-text-muted-theme transition-transform ${selectedAppId === app.id ? 'rotate-90 text-primary-theme' : ''}`} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right side: Selected application timeline/detail */}
        <AnimatePresence>
          {selectedAppId && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-6 bg-surface-theme border border-border-theme rounded-3xl p-6 space-y-6 shadow-sm"
            >
              {(() => {
                const app = appsList.find(a => a.id === selectedAppId);
                if (!app) return null;

                // Attempt to parse offer details if status category is 'offer'
                let offerDetails: any = null;
                let offerStatus = 'PENDING';
                try {
                  if (app.notes && app.notes.startsWith('{')) {
                    offerDetails = JSON.parse(app.notes);
                    offerStatus = offerDetails.offer_status || 'PENDING';
                  }
                } catch(err){}

                return (
                  <>
                    <div className="flex justify-between items-start border-b border-border-theme/40 pb-4">
                      <div>
                        <h3 className="text-xs font-black text-text-primary-theme">{app.title}</h3>
                        <p className="text-[10px] text-text-secondary-theme font-semibold">{app.company} &bull; {app.location}</p>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${app.badgeColor}`}>
                        {app.statusLabel}
                      </span>
                    </div>

                    {/* Offer & Negotiation Interface (Render if status === 'offer' and offer details present) */}
                    {app.status === 'offer' && offerDetails ? (
                      <div className="space-y-4">
                        <div className="border border-border-theme rounded-2xl p-5 bg-bg-theme relative overflow-hidden shadow-inner">
                          {/* Corporate Letterhead Header */}
                          <div className="border-b border-border-theme pb-3 mb-3 text-center">
                            <span className="text-[10px] font-black uppercase text-text-secondary-theme tracking-widest block">Employment Proposal</span>
                            <h4 className="text-xs font-black text-text-primary-theme">{app.company}</h4>
                          </div>

                          <div className="text-xs text-text-secondary-theme space-y-3 leading-relaxed whitespace-pre-wrap font-medium font-sans">
                            {offerDetails.offer_text}
                          </div>

                          <div className="mt-4 pt-3 border-t border-border-theme border-dashed text-xs space-y-1 font-semibold">
                            <div className="flex justify-between"><span className="text-text-muted-theme">Proposed Salary:</span> <span className="text-text-primary-theme font-bold">{offerDetails.salary}</span></div>
                            <div className="flex justify-between"><span className="text-text-muted-theme">Joining Date:</span> <span className="text-text-primary-theme font-bold">{offerDetails.joining_date}</span></div>
                            {offerDetails.file_name && (
                              <div className="flex justify-between"><span className="text-text-muted-theme">Attached File:</span> <span className="text-primary-theme font-mono font-bold">{offerDetails.file_name}</span></div>
                            )}
                          </div>

                          <div className="mt-6 pt-4 border-t border-border-theme flex flex-col items-end">
                            <span className="text-[10px] font-mono italic text-text-primary-theme font-black">{offerDetails.signature}</span>
                            <span className="text-[8px] uppercase tracking-wider text-text-muted-theme font-bold">Authorized Recruiter Signature</span>
                          </div>
                        </div>

                        {/* Status Banners */}
                        {offerStatus === 'ACCEPTED' || app.rawStatus === 'Accepted' ? (
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span>Congratulations! You accepted this offer proposal. HR team will connect with you soon.</span>
                          </div>
                        ) : offerStatus === 'REJECTED' ? (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <span>You rejected this offer. You can still message the hiring manager in the negotiation panel.</span>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCandidateOfferAction(app.id, 'ACCEPT')}
                              className="flex-1 py-2.5 bg-success-theme hover:bg-opacity-95 text-white text-xs font-black rounded-xl cursor-pointer"
                            >
                              Approve & Accept Offer
                            </button>
                            <button
                              onClick={() => handleCandidateOfferAction(app.id, 'REJECT')}
                              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl cursor-pointer"
                            >
                              Reject Offer
                            </button>
                          </div>
                        )}

                        {/* Negotiation Chat Panel */}
                        <div className="bg-bg-theme border border-border-theme rounded-2xl p-4 space-y-4">
                          <div className="flex items-center gap-2 border-b border-border-theme/40 pb-2">
                            <MessageSquare className="w-4 h-4 text-primary-theme" />
                            <span className="text-[10px] font-bold text-text-primary-theme uppercase tracking-wider">Negotiation & Chat history</span>
                          </div>

                          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                            {offerDetails.chat && offerDetails.chat.length > 0 ? (
                              offerDetails.chat.map((msg: any, idx: number) => {
                                const isSelf = msg.sender === 'CANDIDATE';
                                return (
                                  <div key={idx} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-2.5 rounded-2xl text-xs max-w-[85%] font-medium ${
                                      isSelf 
                                        ? 'bg-primary-theme text-white rounded-tr-none' 
                                        : 'bg-surface-theme border border-border-theme text-text-primary-theme rounded-tl-none'
                                    }`}>
                                      {msg.text}
                                    </div>
                                    <span className="text-[8px] text-text-muted-theme mt-0.5 font-mono">
                                      {isSelf ? 'You' : 'Recruiter'} &bull; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-[10px] text-text-muted-theme italic text-center py-4">
                                Need custom parameters or compensation adjustments? Start a chat to negotiate directly.
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-border-theme/40">
                            <input
                              type="text"
                              value={candidateMsgText}
                              onChange={(e) => setCandidateMsgText(e.target.value)}
                              placeholder="Write salary proposal or details note..."
                              className="flex-1 bg-surface-theme border border-border-theme rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                            />
                            <button
                              onClick={() => handleCandidateOfferAction(app.id, 'NEGOTIATE', candidateMsgText)}
                              className="p-2 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl cursor-pointer"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <>
                        {/* Standard interview schedules & timelines */}
                        {app.interviewSchedule && (
                          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-amber-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-xs font-black uppercase tracking-wider">Interview Scheduled</span>
                            </div>
                            <div className="text-xs space-y-1 font-semibold text-text-secondary-theme">
                              <div>
                                <span className="text-text-muted-theme font-medium">Date & Time: </span>
                                <span className="text-text-primary-theme font-extrabold">
                                  {new Date(app.interviewSchedule).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                              </div>
                              {app.interviewNotes && (
                                <div>
                                  <span className="text-text-muted-theme font-medium">Details: </span>
                                  <span className="text-text-primary-theme font-extrabold">{app.interviewNotes}</span>
                                </div>
                              )}
                              {app.notes && (
                                <div>
                                  <span className="text-text-muted-theme font-medium">Employer Notes: </span>
                                  <span className="text-text-primary-theme font-medium italic">"{app.notes}"</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Timeline flow */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Application Timeline</h4>
                          <div className="space-y-5 pl-3 relative border-l border-border-theme">
                            {app.timeline.map((item: any, idx: number) => (
                              <div key={idx} className="relative pl-5 text-xs font-semibold">
                                <div className={`absolute -left-[26px] top-0.5 w-3 h-3 rounded-full border-2 ${
                                  item.done ? 'bg-primary-theme border-primary-theme' :
                                  item.rejected ? 'bg-red-500 border-red-500' :
                                  item.current ? 'bg-amber-500 border-amber-500 animate-pulse' : 'bg-surface-theme border-border-theme'
                                }`}></div>
                                
                                <div className={`${item.done ? 'text-text-primary-theme' : item.current ? 'text-amber-600 font-bold' : item.rejected ? 'text-red-500' : 'text-text-muted-theme'}`}>
                                  {item.title}
                                </div>
                                <div className="text-[9px] text-text-muted-theme font-mono font-medium mt-0.5">{item.date}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Context Actions */}
                    <div className="border-t border-border-theme/40 pt-4 flex gap-2">
                      {app.status === 'offer' && !offerDetails && (
                        <button
                          onClick={() => {
                            addToast('Official Microsoft offer letter simulated PDF downloaded!', 'success');
                          }}
                          className="flex-1 py-2 bg-success-theme hover:bg-opacity-90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Offer Letter
                        </button>
                      )}
                      <button
                        onClick={() => handleWithdraw(app.id, app.title)}
                        className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                        title="Withdraw Application"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      )}
    </div>
  );
}
