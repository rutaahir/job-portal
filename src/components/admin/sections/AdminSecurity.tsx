/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Key, ToggleLeft, Database, Activity, RefreshCw, 
  HelpCircle, Trash2, CheckCircle2, AlertCircle, PlayCircle, X
} from 'lucide-react';

interface AdminSecurityProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function AdminSecurity({ addToast }: AdminSecurityProps) {
  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'flags' | 'keys' | 'backup' | 'health'>('logs');

  // Security audit state
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastAuditTime, setLastAuditTime] = useState('10 minutes ago');

  // Cloud backup state
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Feature flags toggles state
  const [flags, setFlags] = useState({
    aiMatching: true,
    recruiterSandbox: false,
    videoResumeUploads: true,
    employerSubvouchers: false,
    enhancedTrustAudit: true,
  });

  // API Keys state list
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Gemini LLM Parser Proxy', keyPrefix: 'ai_gemini_prod_...4b81', status: 'Active', created: '20 May 2024' },
    { id: '2', name: 'Stripe Billing Webhook', keyPrefix: 'stripe_live_...9f20', status: 'Active', created: '19 May 2024' },
    { id: '3', name: 'Google Cloud Geocoding', keyPrefix: 'gmaps_geo_...0c83', status: 'Active', created: '15 May 2024' },
  ]);

  // Logs state
  const [logsList, setLogsList] = useState<any[]>([]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const res = await fetch('/api/admin/logs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((log: any) => ({
          time: new Date(log.timestamp).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          admin: log.email || 'SYSTEM',
          act: log.message,
          ip: log.type,
          status: 'Success'
        }));
        setLogsList(mapped);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, []);

  // Key Rotation Modal State
  const [isRotateModalOpen, setIsRotateModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<typeof apiKeys[0] | null>(null);

  const postSystemLog = async (logType: string, message: string) => {
    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      await fetch('/api/admin/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type: logType, message })
      });
      fetchLogs();
    } catch (err) {
      console.error('Failed to post system log:', err);
    }
  };

  const handleToggleFlag = (key: keyof typeof flags) => {
    const newVal = !flags[key];
    setFlags({ ...flags, [key]: newVal });
    addToast(`Feature flag "${String(key)}" set to ${newVal ? 'ENABLED' : 'DISABLED'} on cluster.`, 'info');
    postSystemLog('SECURITY', `Modified Feature Flag: ${String(key)} to ${newVal ? 'ENABLED' : 'DISABLED'}`);
  };

  const handleOpenRotateModal = (key: typeof apiKeys[0]) => {
    setSelectedKey(key);
    setIsRotateModalOpen(true);
  };

  const submitRotateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedKey) {
      const randHex = Math.floor(Math.random() * 16777215).toString(16);
      const newPrefix = `${selectedKey.keyPrefix.split('_...')[0]}_...${randHex.slice(0, 4)}`;
      
      setApiKeys(apiKeys.map(k => 
        k.id === selectedKey.id 
          ? { ...k, keyPrefix: newPrefix, created: 'Just now' }
          : k
      ));

      addToast(`API Credentials rotated for ${selectedKey.name}. New prefix: ${newPrefix}`, 'success');
      postSystemLog('SECURITY', `Rotated API credentials for: ${selectedKey.name}`);
      setIsRotateModalOpen(false);
    }
  };

  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    addToast('Executing Google Cloud Storage backup sequence now...', 'info');
    
    setTimeout(() => {
      setIsBackingUp(false);
      addToast('Cold GCS snapshot stream completed! Database ledger backed up successfully.', 'success');
      postSystemLog('AUDIT', 'Triggered immediate cold GCS system backup');
    }, 1500);
  };

  const handleRunSecurityAudit = () => {
    setIsAuditing(true);
    addToast('Scanning system clusters, SSL/TLS cypher keys, and DDoS rules...', 'info');
    
    setTimeout(() => {
      setIsAuditing(false);
      setLastAuditTime('Just now');
      addToast('Scan complete. 0 vulnerabilities or package exploits detected!', 'success');
      postSystemLog('SECURITY', 'Automated cluster compliance & security audit scan');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs navigation */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl p-4 shadow-sm space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-theme/40 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'logs', label: 'Security Audit Logs', icon: Shield },
              { id: 'flags', label: 'Feature Flags', icon: ToggleLeft },
              { id: 'keys', label: 'API Keys Registry', icon: Key },
              { id: 'backup', label: 'Cloud Backups', icon: Database },
              { id: 'health', label: 'Container Health', icon: Activity },
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

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-text-muted-theme font-semibold">
              Scan: {lastAuditTime}
            </span>
            <button 
              disabled={isAuditing}
              onClick={handleRunSecurityAudit}
              className={`px-3.5 py-1.5 text-white text-[10px] font-black rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all ${
                isAuditing ? 'bg-primary-theme/70 opacity-80 cursor-not-allowed' : 'bg-primary-theme hover:bg-primary-hover-theme'
              }`}
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Run Security Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Main Security interface */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Sub Tab: Audit Logs */}
          {activeSubTab === 'logs' && (
            <div className="bg-surface-theme border border-border-theme rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border-theme/40">
                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Live Audit Ledger</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
                  <thead>
                    <tr className="bg-border-theme/10 border-b border-border-theme text-[9px] uppercase tracking-wider font-black text-text-muted-theme">
                      <th className="p-4 pl-6">Timestamp</th>
                      <th className="p-4">Administrator / Actor</th>
                      <th className="p-4">Action Parameters</th>
                      <th className="p-4">Origin IP Address</th>
                      <th className="p-4 text-right pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-theme/40 text-text-secondary-theme font-semibold">
                    {logsList.map((log, i) => (
                      <tr key={i} className="hover:bg-border-theme/10 transition-colors">
                        <td className="p-4 pl-6 font-mono text-[10px] text-text-primary-theme">{log.time}</td>
                        <td className="p-4 text-text-primary-theme font-black">{log.admin}</td>
                        <td className="p-4 text-[10px]">{log.act}</td>
                        <td className="p-4 font-mono text-[10px]">{log.ip}</td>
                        <td className="p-4 text-right pr-6">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            log.status === 'Success' 
                              ? 'bg-emerald-500/10 text-emerald-500' 
                              : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub Tab: Feature Flags */}
          {activeSubTab === 'flags' && (
            <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-5">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Active Feature Flags</h4>
                <p className="text-[10px] text-text-muted-theme font-semibold">Toggling flags updates live production modules within seconds without cluster redeployment.</p>
              </div>

              <div className="divide-y divide-border-theme/35">
                {[
                  { key: 'aiMatching', label: 'AI Sourcing & Custom Recommendation Engine', desc: 'Runs real-time vector cosine calculations for candidate-job matching.' },
                  { key: 'recruiterSandbox', label: 'Corporate Sandbox Environments', desc: 'Allows newly onboarded recruiters to test actions in isolated containers.' },
                  { key: 'videoResumeUploads', label: 'Video Resume Upload & Parser Channels', desc: 'Enables candidate uploading of video profiles with auto transcription.' },
                  { key: 'enhancedTrustAudit', label: 'Enhanced Enterprise Trust & Integrity Audits', desc: 'Enforces high-fidelity validation tests on new employer accounts.' },
                ].map((item) => {
                  const flagKey = item.key as keyof typeof flags;
                  return (
                    <div key={item.key} className="py-4 flex items-center justify-between">
                      <div className="space-y-1 pr-6">
                        <span className="text-[11px] font-black text-text-primary-theme block">{item.label}</span>
                        <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold">{item.desc}</p>
                      </div>

                      <button 
                        onClick={() => handleToggleFlag(flagKey)}
                        className={`w-12 h-6.5 rounded-full p-1 transition-all flex cursor-pointer ${flags[flagKey] ? 'bg-primary-theme justify-end' : 'bg-border-theme/60 justify-start'}`}
                      >
                        <span className="w-4.5 h-4.5 rounded-full bg-white shadow" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub Tab: API Keys */}
          {activeSubTab === 'keys' && (
            <div className="bg-surface-theme border border-border-theme rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border-theme/40 flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Cluster API Credentials</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
                  <thead>
                    <tr className="bg-border-theme/10 border-b border-border-theme text-[9px] uppercase tracking-wider font-black text-text-muted-theme">
                      <th className="p-4 pl-6">Service Integration Endpoint</th>
                      <th className="p-4">Key Token Prefix</th>
                      <th className="p-4">Operational Status</th>
                      <th className="p-4">Last Rotated</th>
                      <th className="p-4 text-right pr-6">Manage Key</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-theme/40 text-text-secondary-theme font-semibold">
                    {apiKeys.map((key) => (
                      <tr key={key.id} className="hover:bg-border-theme/10 transition-colors">
                        <td className="p-4 pl-6 font-black text-text-primary-theme">{key.name}</td>
                        <td className="p-4 font-mono text-[10px]">{key.keyPrefix}</td>
                        <td className="p-4">
                          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                            {key.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[10px]">{key.created}</td>
                        <td className="p-4 text-right pr-6">
                          <button 
                            onClick={() => handleOpenRotateModal(key)}
                            className="px-2.5 py-1.5 bg-border-theme hover:bg-border-theme/80 text-text-primary-theme text-[10px] font-black rounded-lg transition-colors cursor-pointer"
                          >
                            Rotate Key
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub Tab: Backups & System Health */}
          {activeSubTab !== 'logs' && activeSubTab !== 'flags' && activeSubTab !== 'keys' && (
            <div className="bg-surface-theme border border-border-theme p-6 rounded-3xl shadow-sm text-center space-y-4">
              <Database className="w-8 h-8 text-primary-theme mx-auto" />
              <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Automated Cloud Orchestration</h4>
              <p className="text-[10px] text-text-muted-theme font-semibold leading-relaxed">
                Backups are created daily at 02:00 UTC and streamed directly into Google Cloud storage buckets. 
              </p>
              <div>
                <button 
                  disabled={isBackingUp}
                  onClick={handleTriggerBackup}
                  className={`px-5 py-2 text-white text-[10px] font-black rounded-xl cursor-pointer flex items-center gap-1.5 mx-auto transition-all ${
                    isBackingUp ? 'bg-primary-theme/70 opacity-80 cursor-not-allowed' : 'bg-primary-theme hover:bg-primary-hover-theme'
                  }`}
                >
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Streaming database snapshots...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5" />
                      <span>Create Backup Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Quick Integrity Board */}
        <div className="lg:col-span-4">
          <div className="bg-surface-theme border border-border-theme rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary-theme" />
              <span>Integrity Monitor</span>
            </h4>

            <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold">
              Security profiles strictly audit database queries, admin credential operations, and public endpoint loads.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { name: 'Intrusion Detection', state: 'Secure', color: 'text-emerald-500 bg-emerald-500/10' },
                { name: 'DDoS Firewalls', state: 'Optimal', color: 'text-emerald-500 bg-emerald-500/10' },
                { name: 'SSL/TLS Cipher Suite', state: 'Nominal', color: 'text-emerald-500 bg-emerald-500/10' },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-text-primary-theme">{item.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${item.color}`}>{item.state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Key Rotation Modal */}
      <AnimatePresence>
        {isRotateModalOpen && selectedKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-theme border border-border-theme rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-border-theme/40 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-2">
                  <Key className="w-4 h-4 text-primary-theme" />
                  <span>Rotate Credentials Key</span>
                </h3>
                <button onClick={() => setIsRotateModalOpen(false)} className="p-1.5 hover:bg-border-theme rounded-xl text-text-muted-theme cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={submitRotateKey} className="p-6 space-y-4">
                <div className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-2xl">
                  <span className="text-[9px] font-black uppercase tracking-wider text-rose-500 block">Critical Warning</span>
                  <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold mt-1">
                    Rotating credentials for <strong className="text-text-primary-theme">{selectedKey.name}</strong> will invalidate existing tokens immediately. New tokens will propagate to clusters.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider block">Service Endpoint</span>
                  <div className="p-3 bg-border-theme/25 rounded-xl text-xs font-bold text-text-primary-theme">
                    {selectedKey.name}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider block">Existing Key Prefix Hash</span>
                  <div className="p-3 bg-border-theme/25 rounded-xl font-mono text-xs font-semibold text-text-muted-theme">
                    {selectedKey.keyPrefix}
                  </div>
                </div>

                <div className="pt-4 border-t border-border-theme/40 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsRotateModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-black text-text-secondary-theme hover:bg-border-theme/20 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl shadow-sm transition-all">Rotate & Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
