/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserCheck, ShieldAlert, Ban, Trash2, Search, Filter, 
  CheckCircle, XCircle, ChevronRight, UserMinus, PlusCircle, Sparkles, X
} from 'lucide-react';

interface AdminUserMgmtProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function AdminUserMgmt({ addToast }: AdminUserMgmtProps) {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'candidates' | 'employers' | 'recruiters' | 'queue' | 'suspended'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Provision state
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [provisionName, setProvisionName] = useState('');
  const [provisionEmail, setProvisionEmail] = useState('');
  const [provisionRole, setProvisionRole] = useState('RECRUITER');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((u: any) => ({
          id: u.email,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status === 'BLOCKED' ? 'Suspended' : u.status === 'PENDING' ? 'Pending Verification' : 'Active',
          joined: u.date_joined ? new Date(u.date_joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'
        }));
        setUsersList(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (email: string) => {
    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const res = await fetch(`/api/admin/verifications/${encodeURIComponent(email)}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'APPROVE' })
      });
      if (res.ok) {
        addToast('Employer verified and activated successfully!', 'success');
        fetchUsers();
      } else {
        const err = await res.json();
        addToast(`Failed to verify: ${err.error || res.statusText}`, 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to connect to verification service.', 'info');
    }
  };

  const handleSuspend = async (email: string) => {
    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const res = await fetch(`/api/admin/users/${encodeURIComponent(email)}/toggle-block`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('User session suspended (Blocked).', 'info');
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = async (email: string) => {
    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const res = await fetch(`/api/admin/users/${encodeURIComponent(email)}/toggle-block`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('User account restored (Active).', 'success');
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (email: string) => {
    const conf = confirm('Are you sure you want to permanently delete this user directory record?');
    if (!conf) return;

    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const res = await fetch(`/api/admin/users/${encodeURIComponent(email)}/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('User record expunged from platform.', 'success');
        fetchUsers();
      } else {
        const err = await res.json();
        addToast(`Failed to delete user: ${err.error || res.statusText}`, 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to connect to delete service.', 'info');
    }
  };

  const handleOpenProvisionModal = () => {
    setProvisionName('');
    setProvisionEmail('');
    setProvisionRole('RECRUITER');
    setIsProvisionModalOpen(true);
  };

  const submitProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provisionName || !provisionEmail) {
      addToast('Please input both name and email.', 'info');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: provisionEmail.trim().toLowerCase(),
          password: 'Password@123',
          role: provisionRole,
          name: provisionName,
          details: {
            city: 'Bengaluru',
            role: 'Software Engineer',
            companyName: `${provisionName} Enterprises`,
            industry: 'Technology',
            location: 'Bengaluru',
            about: 'Provisioned enterprise partner account.'
          }
        })
      });
      if (res.ok) {
        addToast(`Successfully provisioned ${provisionRole.toLowerCase()} account for ${provisionName}.`, 'success');
        setIsProvisionModalOpen(false);
        fetchUsers();
      } else {
        const err = await res.json();
        addToast(`Provisioning failed: ${err.error || 'Check input details.'}`, 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Provisioning failed. Connection error.', 'info');
    }
  };

  // Filter based on active sub tab and search queries
  const filteredUsers = usersList.filter((user) => {
    // Sub-tab filter
    if (activeSubTab === 'candidates' && user.role !== 'CANDIDATE') return false;
    if (activeSubTab === 'employers' && user.role !== 'EMPLOYER') return false;
    if (activeSubTab === 'recruiters' && user.role !== 'RECRUITER') return false;
    if (activeSubTab === 'queue' && user.status !== 'Pending Verification') return false;
    if (activeSubTab === 'suspended' && user.status !== 'Suspended') return false;

    // Search query filter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Dynamic metrics calculations
  const totalCount = usersList.length;
  const activeCount = usersList.filter((u) => u.status === 'Active').length;
  const suspendedCount = usersList.filter((u) => u.status === 'Suspended').length;
  const queueCount = usersList.filter((u) => u.status === 'Pending Verification').length;

  const activePct = totalCount ? Math.round((activeCount / totalCount) * 100) : 0;
  const suspendedPct = totalCount ? Math.round((suspendedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Metrics Header widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Users Registered', count: totalCount.toLocaleString(), detail: 'All active roles combined', color: 'border-blue-500' },
          { label: 'Active Sourcing Users', count: activeCount.toLocaleString(), detail: `${activePct}% daily engagement rate`, color: 'border-emerald-500' },
          { label: 'Suspended Accounts', count: suspendedCount.toLocaleString(), detail: `${suspendedPct}% flags generated`, color: 'border-rose-500' },
          { label: 'Verification Queue', count: queueCount.toLocaleString(), detail: 'Pending manual audit', color: 'border-amber-500' },
        ].map((met) => (
          <div key={met.label} className={`bg-surface-theme border-l-4 ${met.color} border border-border-theme/40 rounded-2xl p-5 shadow-sm`}>
            <span className="text-[9px] font-black uppercase text-text-muted-theme tracking-wider block">{met.label}</span>
            <span className="text-2xl font-black text-text-primary-theme font-mono block mt-1">{met.count}</span>
            <span className="text-[9px] text-text-secondary-theme font-semibold block mt-1">{met.detail}</span>
          </div>
        ))}
      </div>

      {/* User sub-navigation bar */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl shadow-sm p-4 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-theme/40 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'users', label: 'All Users', count: usersList.length },
              { id: 'candidates', label: 'Candidates', count: usersList.filter(u => u.role === 'CANDIDATE').length },
              { id: 'employers', label: 'Employers', count: usersList.filter(u => u.role === 'EMPLOYER').length },
              { id: 'recruiters', label: 'Recruiters', count: usersList.filter(u => u.role === 'RECRUITER').length },
              { id: 'queue', label: 'Verification Queue', count: usersList.filter(u => u.status === 'Pending Verification').length },
              { id: 'suspended', label: 'Suspended Users', count: usersList.filter(u => u.status === 'Suspended').length },
            ].map((sub) => {
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
                  <span>{sub.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black font-mono ${isActive ? 'bg-white text-primary-theme' : 'bg-border-theme/40 text-text-muted-theme'}`}>
                    {sub.count}
                  </span>
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleOpenProvisionModal}
            className="px-3.5 py-1.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-[10px] font-black rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Provision Sourcing Account</span>
          </button>
        </div>

        {/* Filter bar segment */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted-theme" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users directory by name, email domain, or identification number..."
              className="w-full bg-transparent border border-border-theme rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary-theme text-text-primary-theme placeholder-text-muted-theme"
            />
          </div>
        </div>

      </div>

      {/* Main Grid display list */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
            <thead>
              <tr className="bg-border-theme/10 border-b border-border-theme text-[9px] uppercase tracking-wider font-black text-text-muted-theme">
                <th className="p-4 pl-6">Identification</th>
                <th className="p-4">Name & Email</th>
                <th className="p-4">Enterprise Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Management Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme/40 text-text-secondary-theme">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[11px] text-text-muted-theme font-semibold">
                    No directory registers match the active sub-category query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-border-theme/10 transition-colors">
                    <td className="p-4 pl-6 font-mono font-black text-text-primary-theme text-[10px]">#{user.id}</td>
                    <td className="p-4">
                      <div className="font-black text-text-primary-theme">{user.name}</div>
                      <div className="text-[10px] text-text-muted-theme font-semibold">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        user.role === 'CANDIDATE' 
                          ? 'bg-blue-500/10 text-blue-500' 
                          : user.role === 'EMPLOYER' 
                          ? 'bg-orange-500/10 text-orange-500' 
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-[10px] font-mono">{user.joined}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        user.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15' 
                          : user.status === 'Suspended' 
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/15' 
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/15'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="inline-flex gap-2">
                        {user.status === 'Pending Verification' && (
                          <button
                            onClick={() => handleVerify(user.id)}
                            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[9px] rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {user.status === 'Suspended' ? (
                          <button
                            onClick={() => handleRestore(user.id)}
                            className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white font-black text-[9px] rounded-lg transition-colors cursor-pointer"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspend(user.id)}
                            className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-black text-[9px] rounded-lg transition-colors cursor-pointer"
                            title="Suspend Account Access"
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 hover:bg-rose-500/10 text-text-muted-theme hover:text-rose-500 rounded-lg cursor-pointer"
                          title="Purge Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Provisioning Modal Overlay */}
      <AnimatePresence>
        {isProvisionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-theme border border-border-theme rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-border-theme/40 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-primary-theme" />
                  <span>Provision Sourcing Account</span>
                </h3>
                <button onClick={() => setIsProvisionModalOpen(false)} className="p-1.5 hover:bg-border-theme rounded-xl text-text-muted-theme cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={submitProvision} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" required value={provisionName} onChange={(e) => setProvisionName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold text-text-primary-theme focus:outline-none focus:border-primary-theme"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" required value={provisionEmail} onChange={(e) => setProvisionEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold text-text-primary-theme focus:outline-none focus:border-primary-theme"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">System Role Access</label>
                  <select 
                    value={provisionRole} onChange={(e) => setProvisionRole(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold text-text-primary-theme focus:outline-none focus:border-primary-theme"
                  >
                    <option value="CANDIDATE">Candidate Role (Applicant)</option>
                    <option value="RECRUITER">Recruiter Sourcing Specialist</option>
                    <option value="EMPLOYER">Employer (Hiring Manager)</option>
                  </select>
                </div>

                <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl text-[9px] font-semibold text-emerald-600">
                  Note: Provisioned accounts are pre-authorized with high operational status and immediately added to the live directory logs.
                </div>

                <div className="pt-4 border-t border-border-theme/40 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsProvisionModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-black text-text-secondary-theme hover:bg-border-theme/20 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl shadow-sm transition-all">Authorize Credentials</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
