/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Mail, Shield, Plus, Trash2, CheckCircle, 
  Settings, UserPlus, AlertCircle, X, ChevronRight
} from 'lucide-react';

interface EmpTeamSectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function EmpTeamSection({ addToast }: EmpTeamSectionProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Recruiter');

  // Team database mock
  const [teamMembers, setTeamMembers] = useState([
    { id: 'team-1', name: 'Rahul', email: 'rahul.recruiter@technoadviser.com', role: 'Admin / Owner', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
    { id: 'team-2', name: 'Sneha Singh', email: 'sneha.singh@technoadviser.com', role: 'Lead Recruiter', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
    { id: 'team-3', name: 'Arjun Mehta', email: 'arjun.mehta@technoadviser.com', role: 'Technical Interviewer', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
    { id: 'team-4', name: 'Priya Sen', email: 'priya.sen@technoadviser.com', role: 'Sourcer Specialist', status: 'Invited', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
  ]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMem = {
      id: `team-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Invited',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
    };

    setTeamMembers([...teamMembers, newMem]);
    addToast(`Successfully dispatched invitation parameters to ${inviteEmail}!`, 'success');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleRemoveMember = (id: string, name: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
    addToast(`Removed ${name} from your hiring team workspace.`, 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header controls section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-theme pb-5">
        <div>
          <h1 className="text-xl font-black text-text-primary-theme uppercase tracking-wider">Hiring Team Workspace</h1>
          <p className="text-xs text-text-secondary-theme font-semibold">Assign permissions, manage roles, and invite recruiters to collaborate.</p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4.5 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Recruiter</span>
        </button>
      </div>

      {/* Grid of Team Profiles list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-surface-theme border border-border-theme rounded-2xl p-5 hover:border-primary-theme/20 transition-all flex justify-between items-start">
            <div className="flex items-center gap-3.5">
              <img src={member.avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-border-theme" />
              <div>
                <h3 className="text-xs font-black text-text-primary-theme flex items-center gap-1.5">
                  <span>{member.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                    member.status === 'Active' 
                      ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-500' 
                      : 'bg-amber-500/10 border-amber-500/15 text-amber-500'
                  }`}>
                    {member.status}
                  </span>
                </h3>
                <span className="text-[10px] text-primary-theme font-bold block mt-0.5">{member.role}</span>
                <span className="text-[9px] text-text-muted-theme font-mono block mt-0.5">{member.email}</span>
              </div>
            </div>

            {member.role !== 'Admin / Owner' && (
              <button 
                onClick={() => handleRemoveMember(member.id, member.name)}
                className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded-xl transition-all border border-transparent hover:border-rose-500/15 cursor-pointer"
                title="Revoke Access"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Roles & Permissions Details box */}
      <div className="bg-surface-theme border border-border-theme p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Workspace Security Guidelines</h3>
        <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold">
          Administrators can edit plans, publish job openings, and modify reviews. Recruiters and Interviewers can process applicant details, set meet calendars, and log feedback notes.
        </p>
      </div>

      {/* INVITE RECRUITER MODAL OVERLAY */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-theme border border-border-theme p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowInviteModal(false)}
                className="absolute right-4.5 top-4.5 p-1.5 hover:bg-border-theme/40 rounded-xl cursor-pointer"
              >
                <X className="w-4.5 h-4.5 text-text-muted-theme" />
              </button>

              <div>
                <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">Invite Recruiter to Suite</h3>
                <p className="text-[10px] text-text-secondary-theme font-semibold mt-0.5">Dispatches an active link parameter for workspace registration.</p>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Recruiter Corporate Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={inviteEmail} 
                    onChange={(e) => setInviteEmail(e.target.value)} 
                    placeholder="name@company.com" 
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme placeholder-text-muted-theme"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Assigned Suite Role</label>
                  <select 
                    value={inviteRole} 
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme font-semibold text-text-primary-theme"
                  >
                    <option>Recruiter</option>
                    <option>Technical Interviewer</option>
                    <option>Sourcing Specialist</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer mt-2"
                >
                  Send Invitation
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
