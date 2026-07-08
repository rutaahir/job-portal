/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, Bell, Shield, Lock, Trash2, CheckCircle, 
  HelpCircle, ChevronRight, AlertTriangle
} from 'lucide-react';

interface EmpSettingsSectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function EmpSettingsSection({ addToast }: EmpSettingsSectionProps) {
  // Toggle switches states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Security password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast('Please satisfy all password parameters.', 'info');
      return;
    }
    addToast('Security password altered successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleSaveNotificationToggles = () => {
    addToast('Notification configurations updated.', 'success');
  };

  const handleDeleteAccount = () => {
    const conf = confirm('WARNING: Are you sure you wish to delete your employer account? All live listings and candidates will be archived permanently.');
    if (conf) {
      addToast('Account deletion request dispatched for support review.', 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      
      {/* 1. NOTIFICATIONS SETTINGS PANEL */}
      <div className="bg-surface-theme border border-border-theme p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border-theme/40">
          <Bell className="w-5 h-5 text-primary-theme" />
          <h2 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Recruiter Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-text-primary-theme block">Email digests</span>
              <span className="text-[10px] text-text-muted-theme font-semibold leading-relaxed">Receive daily summaries of candidates in the screening stage.</span>
            </div>
            <input 
              type="checkbox" 
              checked={emailAlerts} 
              onChange={() => setEmailAlerts(!emailAlerts)} 
              className="accent-primary-theme w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-text-primary-theme block">Match score alarms</span>
              <span className="text-[10px] text-text-muted-theme font-semibold leading-relaxed">Trigger warnings whenever a candidate matches more than 90%.</span>
            </div>
            <input 
              type="checkbox" 
              checked={matchNotifications} 
              onChange={() => setMatchNotifications(!matchNotifications)} 
              className="accent-primary-theme w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-text-primary-theme block">Interview reminders</span>
              <span className="text-[10px] text-text-muted-theme font-semibold leading-relaxed">Transmit push and calendar alarms 1 hour before Google Meets.</span>
            </div>
            <input 
              type="checkbox" 
              checked={interviewReminders} 
              onChange={() => setInterviewReminders(!interviewReminders)} 
              className="accent-primary-theme w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        <button 
          onClick={handleSaveNotificationToggles}
          className="px-4.5 py-2.5 bg-border-theme/40 text-text-primary-theme hover:bg-border-theme transition-all text-xs font-black rounded-xl cursor-pointer"
        >
          Save Notification Layout
        </button>
      </div>

      {/* 2. SECURITY CONFIG PANEL */}
      <div className="bg-surface-theme border border-border-theme p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-border-theme/40">
          <Shield className="w-5 h-5 text-primary-theme" />
          <h2 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Workspace Security</h2>
        </div>

        <form onSubmit={handleUpdateSecurity} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Current Password</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-primary-theme text-text-primary-theme"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-primary-theme text-text-primary-theme"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border-theme/40 pt-4">
            <div>
              <span className="text-xs font-black text-text-primary-theme block">Two-Factor Authentication</span>
              <span className="text-[10px] text-text-muted-theme font-semibold">Enable extra verification checks during logins.</span>
            </div>
            <input 
              type="checkbox" 
              checked={twoFactor} 
              onChange={() => setTwoFactor(!twoFactor)} 
              className="accent-primary-theme w-4 h-4 cursor-pointer"
            />
          </div>

          <button 
            type="submit"
            className="px-5 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Update Security Parameters
          </button>
        </form>
      </div>

      {/* 3. DANGER ZONE ARCHIVE PANEL */}
      <div className="bg-red-500/5 border border-red-500/10 p-6 sm:p-8 rounded-3xl space-y-4">
        <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5">
          <AlertTriangle className="w-4.5 h-4.5" />
          <span>Danger Zone</span>
        </h3>
        <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold">
          Deleting your corporate employer account removes all listed requirements, active candidate threads, matches, and invoices. This action cannot be reversed.
        </p>
        <button 
          onClick={handleDeleteAccount}
          className="px-4.5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl shadow transition-colors cursor-pointer"
        >
          Archive Employer Suite
        </button>
      </div>

    </div>
  );
}
