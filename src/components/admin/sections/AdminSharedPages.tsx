/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Inbox, Bell, Search, Terminal, HelpCircle, AlertOctagon, 
  Settings, CheckCircle2, Send, MessageSquare, Info, ShieldAlert,
  Archive, Check, CornerDownRight, PlusCircle, Trash2
} from 'lucide-react';

interface AdminSharedPagesProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function AdminSharedPages({ addToast }: AdminSharedPagesProps) {
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'notifications' | 'command' | 'support' | 'errors'>('inbox');
  const [typedCommand, setTypedCommand] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  // Inbox Threads State
  const [inboxThreads, setInboxThreads] = useState([
    { id: 't-1', sender: 'Rahul Gupta', role: 'Employer', msg: 'Having issues verifying our company GST credentials.', time: '10m ago', archived: false, replies: [] as string[] },
    { id: 't-2', sender: 'Arjun Mehta', role: 'Candidate', msg: 'Is there a limit on the number of resume versions I can upload?', time: '1h ago', archived: false, replies: [] as string[] },
    { id: 't-3', sender: 'Priya Sharma', role: 'Recruiter', msg: 'Need custom sourcing quotas configured for enterprise teams.', time: '4h ago', archived: false, replies: [] as string[] },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Corporate Account Registered', desc: 'Acme Corporation submitted verification documentation.', time: '2 mins ago', unread: true },
    { id: 2, title: 'Security Event Alert', desc: 'Successful root administrator key rotation completed.', time: '10 mins ago', unread: false },
    { id: 3, title: 'Subscription Payment Approved', desc: 'TechSoft completed invoice transaction #TXN123455.', time: '40 mins ago', unread: false },
  ]);

  // Terminal telemetry logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'System init. Listening on virtual port 3000.',
    'Ready for superadmin administrative command override sequence.'
  ]);

  // Dynamic submitted tickets list
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TKT-9201', subject: 'Stripe webhook latency', category: 'Billing', status: 'In Review', message: 'Stripe transactions are taking up to 3 seconds to propagate to local database logs.', created: 'Just now' }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    addToast('All system notifications set to read.', 'success');
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedCommand) return;
    
    const cmd = typedCommand.trim();
    let reply = `Command executed: "${cmd}"`;

    if (cmd.startsWith('/sync-cache')) {
      reply = 'SUCCESS: Flushed 18 edge assets folders. CDN invalidation successfully sent.';
      addToast('CDN caches flushed successfully.', 'success');
    } else if (cmd.startsWith('/audit-security')) {
      reply = 'SUCCESS: SSL/TLS cipher suites validated. 0 alerts triggered.';
      addToast('Platform security audit finished.', 'success');
    } else if (cmd.startsWith('/system-status')) {
      reply = 'STATUS: Container node-01-prod is active. CPU load: 1.2%, Memory: 412MB / 1024MB.';
      addToast('System status retrieved.', 'info');
    } else if (cmd.startsWith('/clear-notifications')) {
      setNotifications([]);
      reply = 'SUCCESS: Cleaned all live notifications.';
      addToast('Cleared notifications registry.', 'success');
    } else {
      reply = `INFO: Sent instruction "${cmd}" to cloud clusters. Waiting for execution logs...`;
      addToast('Custom command passed to clusters.', 'info');
    }

    setTerminalLogs([...terminalLogs, `> ${cmd}`, reply]);
    setTypedCommand('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      category: 'General Technical',
      status: 'Open / Pending',
      message: ticketMessage,
      created: 'Just now'
    };

    setSupportTickets([newTicket, ...supportTickets]);

    // Also push a mirror thread into the Super Admin inbox so the system reacts dynamically!
    const newInboxThread = {
      id: `t-${inboxThreads.length + 1}`,
      sender: 'SuperAdmin System Support',
      role: 'SYSTEM',
      msg: `Filed ticket: ${ticketSubject}`,
      time: 'Just now',
      archived: false,
      replies: [ticketMessage]
    };
    setInboxThreads([newInboxThread, ...inboxThreads]);

    addToast(`Support ticket ${newTicket.id} filed successfully!`, 'success');
    setTicketSubject('');
    setTicketMessage('');
  };

  const handleArchiveThread = (id: string) => {
    setInboxThreads(inboxThreads.map(t => t.id === id ? { ...t, archived: true } : t));
    addToast('Conversation archived successfully.', 'success');
    if (activeThreadId === id) {
      setActiveThreadId(null);
    }
  };

  const handleArchiveAllThreads = () => {
    setInboxThreads(inboxThreads.map(t => ({ ...t, archived: true })));
    addToast('All inbox threads archived.', 'success');
    setActiveThreadId(null);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !activeThreadId) return;

    setInboxThreads(inboxThreads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          replies: [...t.replies, replyText]
        };
      }
      return t;
    }));

    addToast('Reply sent successfully to recipient.', 'success');
    setReplyText('');
  };

  const activeThread = inboxThreads.find(t => t.id === activeThreadId);

  return (
    <div className="space-y-6">
      
      {/* Shared subtabs */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl p-4 shadow-sm space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-theme/40 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'inbox', label: '1. Shared Inbox', icon: Inbox },
              { id: 'notifications', label: '2. Live Notifications', icon: Bell },
              { id: 'command', label: '3. Command Palette', icon: Terminal },
              { id: 'support', label: '4. Help Center & Tickets', icon: HelpCircle },
              { id: 'errors', label: '5. Error States Previews', icon: AlertOctagon },
            ].map((sub) => {
              const Icon = sub.icon;
              const isActive = activeSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-primary-theme text-white shadow-sm' 
                      : 'bg-border-theme/10 text-text-secondary-theme hover:bg-border-theme/40 hover:text-text-primary-theme'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Page components */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Sub Tab: Shared Inbox */}
          {activeSubTab === 'inbox' && (
            <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Super Admin Inbox</h4>
                  <p className="text-[10px] text-text-muted-theme font-semibold">Incoming communications from candidates, employers, and recruiters.</p>
                </div>
                <button 
                  onClick={handleArchiveAllThreads}
                  className="px-2.5 py-1.5 bg-border-theme hover:bg-border-theme/80 text-text-primary-theme text-[9px] font-black rounded-lg cursor-pointer"
                >
                  Archive All Threads
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 space-y-2 border-r border-border-theme/40 pr-4">
                  <span className="text-[9px] font-black uppercase text-text-muted-theme block tracking-wider">Active Threads</span>
                  {inboxThreads.filter(t => !t.archived).length === 0 ? (
                    <div className="text-[10px] font-semibold text-text-muted-theme py-4">No active conversations.</div>
                  ) : (
                    inboxThreads.filter(t => !t.archived).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveThreadId(item.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer block ${
                          activeThreadId === item.id 
                            ? 'bg-primary-theme/5 border-primary-theme/30' 
                            : 'bg-transparent border-border-theme/30 hover:bg-border-theme/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black text-text-primary-theme truncate">{item.sender}</span>
                          <span className="text-[8px] font-black bg-primary-theme/10 text-primary-theme px-1.5 py-0.5 rounded uppercase">{item.role}</span>
                        </div>
                        <p className="text-[9px] text-text-secondary-theme truncate mt-1 font-semibold">{item.msg}</p>
                        <span className="text-[8px] text-text-muted-theme block mt-1 text-right">{item.time}</span>
                      </button>
                    ))
                  )}
                </div>

                <div className="md:col-span-7 space-y-4">
                  {activeThread ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-border-theme/10 rounded-2xl border border-border-theme/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-black text-xs text-text-primary-theme">{activeThread.sender}</div>
                          <button 
                            onClick={() => handleArchiveThread(activeThread.id)}
                            className="p-1 hover:bg-rose-500/10 text-text-muted-theme hover:text-rose-500 rounded cursor-pointer"
                            title="Archive Conversation"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold">{activeThread.msg}</p>
                      </div>

                      {activeThread.replies.map((rep, idx) => (
                        <div key={idx} className="p-4 bg-primary-theme/5 border border-primary-theme/10 rounded-2xl space-y-1 ml-6">
                          <span className="text-[9px] font-black text-primary-theme flex items-center gap-1">
                            <CornerDownRight className="w-3 h-3" />
                            <span>Superadmin Response</span>
                          </span>
                          <p className="text-[10px] text-text-primary-theme leading-relaxed font-semibold">{rep}</p>
                        </div>
                      ))}

                      <form onSubmit={handleReplySubmit} className="space-y-2 pt-2">
                        <textarea
                          rows={2} required value={replyText} onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type reply to write to secure client message logs..."
                          className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                        />
                        <div className="flex justify-end">
                          <button type="submit" className="px-4 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-[10px] font-black rounded-lg flex items-center gap-1 cursor-pointer">
                            <Send className="w-3 h-3" />
                            <span>Send Reply</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-text-muted-theme border border-dashed border-border-theme/60 rounded-2xl bg-border-theme/5">
                      <MessageSquare className="w-6 h-6 mb-2 text-text-muted-theme" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Select a conversation thread</span>
                      <p className="text-[9px] font-semibold max-w-xs mt-1">Click any active communication message in the left index list to review logs and submit replies.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sub Tab: Notifications */}
          {activeSubTab === 'notifications' && (
            <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Platform Notifications</h4>
                  <p className="text-[10px] text-text-muted-theme font-semibold">Security logs and operational alerts stream.</p>
                </div>
                <button 
                  onClick={handleMarkAllRead}
                  className="px-2.5 py-1.5 bg-border-theme hover:bg-border-theme/80 text-text-primary-theme text-[9px] font-black rounded-lg cursor-pointer"
                >
                  Mark All Read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((not) => (
                  <div key={not.id} className={`p-4 border rounded-2xl flex items-start justify-between gap-4 transition-colors ${
                    not.unread 
                      ? 'bg-primary-theme/5 border-primary-theme/20' 
                      : 'bg-border-theme/10 border-border-theme/40'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {not.unread && <span className="w-2 h-2 rounded-full bg-primary-theme animate-pulse" />}
                        <span className="text-[11px] font-black text-text-primary-theme">{not.title}</span>
                      </div>
                      <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold">{not.desc}</p>
                    </div>
                    <span className="text-[9px] text-text-muted-theme font-semibold whitespace-nowrap">{not.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub Tab: Command Palette */}
          {activeSubTab === 'command' && (
            <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-5">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Global Search & Command Palette</h4>
                <p className="text-[10px] text-text-muted-theme font-semibold">Direct keyboard shortcut or prompt input targeting platform commands.</p>
              </div>

              <form onSubmit={handleCommandSubmit} className="space-y-4">
                <div className="relative">
                  <Terminal className="absolute left-3.5 top-3.5 w-5 h-5 text-primary-theme" />
                  <input 
                    type="text"
                    value={typedCommand}
                    onChange={(e) => setTypedCommand(e.target.value)}
                    placeholder="Type a command (e.g. /sync-cache, /audit-security, /system-status, /clear-notifications)..."
                    className="w-full bg-transparent border-2 border-border-theme focus:border-primary-theme rounded-xl pl-12 pr-4 py-3.5 text-xs font-black focus:outline-none text-text-primary-theme placeholder-text-muted-theme"
                  />
                </div>

                <div className="p-4 bg-border-theme/15 rounded-2xl border border-border-theme/35 space-y-3">
                  <div>
                    <h5 className="text-[9px] font-black text-text-muted-theme uppercase tracking-wider mb-2">Available System Commands</h5>
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-text-secondary-theme">
                      <div><span className="text-primary-theme cursor-pointer hover:underline" onClick={() => setTypedCommand('/sync-cache')}>/sync-cache</span> &middot; Flushes edge assets</div>
                      <div><span className="text-primary-theme cursor-pointer hover:underline" onClick={() => setTypedCommand('/audit-security')}>/audit-security</span> &middot; Scans certificates</div>
                      <div><span className="text-primary-theme cursor-pointer hover:underline" onClick={() => setTypedCommand('/clear-notifications')}>/clear-notifications</span> &middot; Clear notification registry</div>
                      <div><span className="text-primary-theme cursor-pointer hover:underline" onClick={() => setTypedCommand('/system-status')}>/system-status</span> &middot; Dumps container logs</div>
                    </div>
                  </div>

                  <div className="border-t border-border-theme/40 pt-3">
                    <span className="text-[9px] font-black uppercase text-text-muted-theme tracking-wider block mb-2">Telemetry Log Stream Output</span>
                    <div className="bg-black/90 text-emerald-400 p-4 rounded-xl font-mono text-[10px] space-y-1.5 max-h-48 overflow-y-auto">
                      {terminalLogs.map((logStr, idx) => (
                        <div key={idx} className={logStr.startsWith('>') ? 'text-primary-theme' : logStr.startsWith('SUCCESS') ? 'text-emerald-400' : 'text-gray-300'}>
                          {logStr}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Sub Tab: Help Center */}
          {activeSubTab === 'support' && (
            <div className="space-y-6">
              <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-5">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Raise Platform Support Ticket</h4>
                  <p className="text-[10px] text-text-muted-theme font-semibold">Submit help requests regarding database or payment configurations.</p>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Ticket Category Subject</label>
                    <input 
                      type="text" required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Enter short ticket title (e.g. Stripe webhook failing)..."
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Detailed Message</label>
                    <textarea required
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      rows={4}
                      placeholder="Describe the issue, including error logs or user IDs affected..."
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="px-4 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-[10px] font-black rounded-lg shadow-sm cursor-pointer"
                  >
                    File High-Priority Ticket
                  </button>
                </form>
              </div>

              {/* Dynamic support tickets ledger */}
              <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Filed Support Tickets</h4>
                <div className="space-y-3">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border border-border-theme/40 rounded-2xl bg-border-theme/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] font-black text-primary-theme">{ticket.id}</span>
                        <span className="text-[8px] font-black bg-amber-500/15 text-amber-600 px-2 py-0.5 rounded-full uppercase">{ticket.status}</span>
                      </div>
                      <h5 className="text-xs font-black text-text-primary-theme">{ticket.subject}</h5>
                      <p className="text-[10px] text-text-secondary-theme font-semibold leading-relaxed">{ticket.message}</p>
                      <span className="text-[8px] text-text-muted-theme block text-right font-medium">{ticket.created}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub Tab: Error States */}
          {activeSubTab === 'errors' && (
            <div className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { title: '404 - Not Found', desc: 'The requested page directory does not exist.', code: '404 Error' },
                  { title: '500 - Server Failure', desc: 'The server container failed to process headers.', code: '500 Error' },
                  { title: 'Maintenance Mode', desc: 'Sourcing catalog offline for routine calibrations.', code: 'Maintenance' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-theme border border-border-theme p-5 rounded-3xl shadow-sm text-center space-y-3">
                    <span className="text-[8px] font-black bg-rose-500/15 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase">
                      {item.code}
                    </span>
                    <h5 className="text-[11px] font-black text-text-primary-theme">{item.title}</h5>
                    <p className="text-[9px] text-text-secondary-theme leading-relaxed font-semibold">{item.desc}</p>
                    <button 
                      onClick={() => addToast(`Previewed full-screen ${item.code} overlay.`, 'info')}
                      className="px-3 py-1.5 bg-border-theme hover:bg-border-theme/80 text-text-primary-theme font-black text-[9px] rounded-lg transition-colors cursor-pointer w-full"
                    >
                      Trigger Preview
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Quick platform summaries */}
        <div className="lg:col-span-4">
          <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-1.5">
              <Info className="w-4 h-4 text-primary-theme" />
              <span>Phase 5 Architecture</span>
            </h4>

            <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold">
              The Phase 5 modules provide shared communication layers across Candidate, Employer, and Super Admin portals.
            </p>

            <div className="p-4 bg-border-theme/15 rounded-2xl border border-border-theme/35">
              <span className="text-[9px] font-black text-text-muted-theme uppercase block">WebSockets Hub</span>
              <span className="text-[11px] font-black text-text-primary-theme block mt-1">Status: Operational</span>
              <span className="text-[9px] text-text-muted-theme font-semibold block mt-0.5">3 active stream connections</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
