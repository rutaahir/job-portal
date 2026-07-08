/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Bell, RefreshCw, Key, ToggleLeft, ToggleRight, AlertTriangle, Trash2 } from 'lucide-react';

interface SettingsSectionProps {
  onLogout: () => void;
  addToast: (text: string, type?: 'success' | 'info') => void;
}

type SettingsSubTab = 'profile' | 'security' | 'notifications' | 'sessions' | 'delete';

export default function SettingsSection({ onLogout, addToast }: SettingsSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<SettingsSubTab>('profile');

  // Account states
  const [name, setName] = useState('Arjun Mehta');
  const [userRole, setUserRole] = useState('UI/UX Designer');
  const [avatar, setAvatar] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  // Security states
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [tfaEnabled, setTfaEnabled] = useState(true);

  // Notification states
  const [notifs, setNotifs] = useState({
    jobAlerts: true,
    appUpdates: true,
    interviewReminders: true,
    messageNotifs: true,
    marketingUpdates: false
  });

  // Delete account states
  const [deleteInput, setDeleteInput] = useState('');

  const handleToggleNotif = (key: keyof typeof notifs) => {
    setNotifs({ ...notifs, [key]: !notifs[key] });
    addToast('Notification preferences updated.', 'success');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      addToast('Profile avatar uploaded!', 'success');
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) {
      addToast('Please fill out all password fields.', 'info');
      return;
    }
    addToast('Security password updated successfully!', 'success');
    setOldPass('');
    setNewPass('');
  };

  const handleDeleteAccount = () => {
    if (deleteInput === 'DELETE') {
      addToast('Account permanent deletion sequence initiated.', 'success');
      setTimeout(() => {
        onLogout();
      }, 2000);
    } else {
      addToast('Please type "DELETE" exactly to confirm.', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-xs font-semibold">
      {/* Header */}
      <div>
        <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
          Account Settings
        </h2>
        <p className="text-xs text-text-secondary-theme">Manage your security, session access, and notification rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left inner tab selector (4 cols) */}
        <div className="lg:col-span-4 bg-surface-theme border border-border-theme rounded-2xl p-4 flex flex-col gap-1.5 shadow-sm">
          {[
            { id: 'profile', label: 'Profile Settings', icon: User },
            { id: 'security', label: 'Security & 2FA', icon: Shield },
            { id: 'notifications', label: 'Notification Settings', icon: Bell },
            { id: 'delete', label: 'Delete Account', icon: Trash2, danger: true }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as SettingsSubTab)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
                  activeSubTab === tab.id
                    ? tab.danger ? 'bg-red-500 text-white' : 'bg-primary-theme text-white'
                    : tab.danger ? 'text-red-500 hover:bg-red-500/10' : 'text-text-secondary-theme hover:bg-border-theme/40 hover:text-text-primary-theme'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Tab Content (8 cols) */}
        <div className="lg:col-span-8 bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          {/* Profile Settings (screenshot 13) */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider border-b border-border-theme/40 pb-2">Profile Information</h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Photo Preview */}
                <div className="relative group">
                  <img src={avatar} alt="Arjun Mehta" className="w-16 h-16 rounded-full object-cover border-2 border-primary-theme/30" />
                  <input type="file" id="settings-avatar" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </div>
                
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-text-primary-theme">{name}</h4>
                  <p className="text-[10px] text-text-muted-theme leading-relaxed font-sans">{userRole} &bull; Pune, Maharashtra, India</p>
                  <label htmlFor="settings-avatar" className="px-3.5 py-1.5 bg-primary-theme/5 hover:bg-primary-theme/10 text-primary-theme text-[10px] font-bold rounded-lg cursor-pointer inline-block border border-primary-theme/10 transition-colors">
                    Upload New Photo
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary-theme">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-secondary-theme">Headline Title</label>
                    <input type="text" value={userRole} onChange={e => setUserRole(e.target.value)} className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none" />
                  </div>
                </div>

                <button onClick={() => addToast('Profile details updated!', 'success')} className="px-5 py-2.5 bg-primary-theme text-white text-xs font-bold rounded-xl cursor-pointer">
                  Update Settings Info
                </button>
              </div>
            </div>
          )}

          {/* Security (screenshot 14) */}
          {activeSubTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider border-b border-border-theme/40 pb-2">Password & Verification</h3>
              
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary-theme">Old Password</label>
                    <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-secondary-theme">New Secure Password</label>
                    <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="px-5 py-2.5 bg-primary-theme text-white text-xs font-bold rounded-xl cursor-pointer">
                  Update Password Keys
                </button>
              </form>

              {/* Two-Factor Toggle */}
              <div className="flex items-center justify-between p-4 border border-border-theme rounded-xl bg-bg-theme/30 mt-6">
                <div>
                  <h4 className="text-xs font-bold text-text-primary-theme">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[10px] text-text-muted-theme font-semibold">Strengthen portal checks via mobile authenticator tokens.</p>
                </div>
                <button onClick={() => { setTfaEnabled(!tfaEnabled); addToast('2FA parameters toggled.', 'info'); }} className="text-primary-theme cursor-pointer">
                  {tfaEnabled ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
                </button>
              </div>
            </div>
          )}

          {/* Notifications (screenshot 15) */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider border-b border-border-theme/40 pb-2">Notification Settings</h3>
              
              <div className="space-y-4">
                {[
                  { key: 'jobAlerts', label: 'Job Alerts', desc: 'Get notified about new matching roles.' },
                  { key: 'appUpdates', label: 'Application Updates', desc: 'Updates on your corporate pipeline status.' },
                  { key: 'interviewReminders', label: 'Interview Reminders', desc: 'Alerts before upcoming rounds.' },
                  { key: 'messageNotifs', label: 'Message Notifications', desc: 'Alerts for direct recruiter chats.' },
                  { key: 'marketingUpdates', label: 'Marketing Updates', desc: 'Occasional product newsletters and pricing deals.' }
                ].map(item => (
                  <div key={item.key} className="flex justify-between items-center py-2.5 border-b border-border-theme/30">
                    <div>
                      <h4 className="text-xs font-bold text-text-primary-theme">{item.label}</h4>
                      <p className="text-[10px] text-text-muted-theme font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <button onClick={() => handleToggleNotif(item.key as keyof typeof notifs)} className="text-primary-theme cursor-pointer">
                      {notifs[item.key as keyof typeof notifs] ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete Account (screenshot 16) */}
          {activeSubTab === 'delete' && (
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider border-b border-border-theme/40 pb-2">Delete Account</h3>
              
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl space-y-2 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">This action cannot be undone. All your data will be permanently deleted.</h4>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] leading-relaxed">
                    <li>All your ongoing applications will be instantly cancelled.</li>
                    <li>Your verified skills scores and history will be lost.</li>
                    <li>We cannot restore your credentials in future periods.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="text-text-secondary-theme font-bold">Type "DELETE" to confirm your decision:</label>
                <input
                  type="text"
                  placeholder="Type DELETE..."
                  value={deleteInput}
                  onChange={e => setDeleteInput(e.target.value)}
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-red-500 text-red-500 font-mono uppercase font-black"
                />

                <button
                  onClick={handleDeleteAccount}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                    deleteInput === 'DELETE' ? 'bg-red-500 hover:bg-red-600' : 'bg-red-500/45 cursor-not-allowed'
                  }`}
                >
                  Delete My Account Permanently
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
