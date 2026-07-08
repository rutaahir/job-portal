/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, ShieldCheck, HelpCircle, FileCheck, Star, Search, 
  Trash2, ThumbsDown, Check, X, Building, MapPin
} from 'lucide-react';

interface AdminCompanyMgmtProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function AdminCompanyMgmt({ addToast }: AdminCompanyMgmtProps) {
  const [activeSubTab, setActiveSubTab] = useState<'companies' | 'pending' | 'reviews'>('companies');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandIndustry, setNewBrandIndustry] = useState('');
  const [newBrandLocation, setNewBrandLocation] = useState('');

  const [companies, setCompanies] = React.useState<any[]>([]);

  const loadCompanies = async () => {
    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const response = await fetch('/api/admin/companies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map((c: any, index: number) => ({
          id: c.email || `co-${index + 1}`,
          name: c.companyName,
          industry: c.industry,
          location: c.location,
          status: c.status === 'APPROVED' ? 'Verified' : c.status === 'REJECTED' ? 'Rejected' : 'Pending Verification',
          joined: c.verifiedAt ? new Date(c.verifiedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '20 May 2024',
          reviews: c.rating ? Math.floor(c.rating * 3) : 5,
          email: c.email
        }));
        setCompanies(mapped);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    }
  };

  React.useEffect(() => {
    loadCompanies();
  }, []);

  const submitBrandOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName || !newBrandIndustry) {
      addToast('Please enter brand name and industry sector.', 'info');
      return;
    }
    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const response = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: newBrandName,
          industry: newBrandIndustry,
          location: newBrandLocation || 'Remote / Global'
        })
      });
      if (response.ok) {
        addToast(`Onboarded new brand: ${newBrandName} successfully!`, 'success');
        loadCompanies();
        setIsBrandModalOpen(false);
      } else {
        const data = await response.json();
        addToast(`Failed to onboard: ${data.error || response.statusText}`, 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to onboard brand.', 'info');
    }
  };

  const handleVerificationAction = async (email: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const response = await fetch(`/api/admin/verifications/${email}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      if (response.ok) {
        addToast(
          action === 'APPROVE' 
            ? 'Corporate enterprise verified successfully!' 
            : 'Enterprise validation credentials rejected.', 
          'success'
        );
        loadCompanies();
      } else {
        const data = await response.json();
        addToast(`Action failed: ${data.error || response.statusText}`, 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to perform verification action.', 'info');
    }
  };

  const handleVerify = (id: string) => {
    handleVerificationAction(id, 'APPROVE');
  };

  const handleReject = (id: string) => {
    handleVerificationAction(id, 'REJECT');
  };

  const handlePrune = async (id: string) => {
    const conf = confirm('Archive this corporate business profile and remove all connected recruiting accounts?');
    if (conf) {
      try {
        const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
        const response = await fetch(`/api/admin/companies/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          addToast('Corporate record removed from directory catalog.', 'success');
          loadCompanies();
        } else {
          const data = await response.json();
          addToast(`Failed to delete company: ${data.error || response.statusText}`, 'info');
        }
      } catch (err) {
        console.error(err);
        addToast('Failed to delete company.', 'info');
      }
    }
  };

  const filteredCompanies = companies.filter((co) => {
    if (activeSubTab === 'pending' && co.status !== 'Pending Verification') return false;
    if (activeSubTab === 'reviews' && co.reviews === 0) return false;

    return co.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           co.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
           co.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalCompanies = companies.length;
  const verifiedCompanies = companies.filter(c => c.status === 'Verified').length;
  const pendingCompanies = companies.filter(c => c.status === 'Pending Verification').length;
  const rejectedCompanies = companies.filter(c => c.status === 'Rejected').length;

  const verifiedPct = totalCompanies ? Math.round((verifiedCompanies / totalCompanies) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Listed Companies', count: totalCompanies.toLocaleString(), detail: 'All industrial profiles', color: 'border-l-blue-500' },
          { label: 'Verified Enterprises', count: verifiedCompanies.toLocaleString(), detail: `${verifiedPct}% validation rate`, color: 'border-l-emerald-500' },
          { label: 'Pending Validations', count: pendingCompanies.toLocaleString(), detail: 'Awaiting manual audits', color: 'border-l-amber-500' },
          { label: 'Rejected Corporations', count: rejectedCompanies.toLocaleString(), detail: 'Flagged for profile fraud', color: 'border-l-rose-500' },
        ].map((met) => (
          <div key={met.label} className={`bg-surface-theme border-l-4 ${met.color} border border-border-theme/40 rounded-2xl p-5 shadow-sm`}>
            <span className="text-[9px] font-black uppercase text-text-muted-theme tracking-wider block">{met.label}</span>
            <span className="text-2xl font-black text-text-primary-theme font-mono block mt-1">{met.count}</span>
            <span className="text-[9px] text-text-secondary-theme font-semibold block mt-1">{met.detail}</span>
          </div>
        ))}
      </div>

      {/* Sub tabs and search controls */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl p-4 shadow-sm space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-theme/40 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'companies', label: 'All Companies', count: companies.length },
              { id: 'pending', label: 'Pending Verification', count: companies.filter(c => c.status === 'Pending Verification').length },
              { id: 'reviews', label: 'Reviewed Profiles', count: companies.filter(c => c.reviews > 0).length },
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
            onClick={() => {
              setNewBrandName('');
              setNewBrandIndustry('');
              setNewBrandLocation('');
              setIsBrandModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-[10px] font-black rounded-lg shadow-sm cursor-pointer"
          >
            + Onboard New Brand
          </button>
        </div>

        {/* Live dynamic filtering inputs */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted-theme" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search corporate registers by brand name, primary industry vertical, or localized headquarters..."
            className="w-full bg-transparent border border-border-theme rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary-theme text-text-primary-theme placeholder-text-muted-theme"
          />
        </div>

      </div>

      {/* Main Companies Database table listing */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
            <thead>
              <tr className="bg-border-theme/10 border-b border-border-theme text-[9px] uppercase tracking-wider font-black text-text-muted-theme">
                <th className="p-4 pl-6">Company ID</th>
                <th className="p-4">Brand Profile</th>
                <th className="p-4">Industry Sector</th>
                <th className="p-4">Headquarters</th>
                <th className="p-4">Active Reviews</th>
                <th className="p-4">Verification State</th>
                <th className="p-4 text-right pr-6">Management Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme/40 text-text-secondary-theme">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[11px] text-text-muted-theme font-semibold">
                    No corporate registers match the current filters.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((co) => (
                  <tr key={co.id} className="hover:bg-border-theme/10 transition-colors">
                    <td className="p-4 pl-6 font-mono font-black text-text-primary-theme text-[10px]">#{co.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary-theme/10 text-primary-theme flex items-center justify-center font-black">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-black text-text-primary-theme">{co.name}</div>
                          <div className="text-[10px] text-text-muted-theme font-semibold">Joined {co.joined}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{co.industry}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-text-muted-theme" />
                        {co.location}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-text-primary-theme font-black">{co.reviews} reviews</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        co.status === 'Verified' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15' 
                          : co.status === 'Rejected' 
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/15' 
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/15'
                      }`}>
                        {co.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="inline-flex gap-2">
                        {co.status === 'Pending Verification' && (
                          <>
                            <button
                              onClick={() => handleVerify(co.id)}
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Verify Enterprise Profile"
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </button>
                            <button
                              onClick={() => handleReject(co.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Reject Credentials"
                            >
                              <X className="w-4 h-4 stroke-[3]" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handlePrune(co.id)}
                          className="p-1.5 hover:bg-rose-500/10 text-text-muted-theme hover:text-rose-500 rounded-lg cursor-pointer"
                          title="Purge Brand Data"
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

      {/* Brand Onboarding Modal Overlay */}
      <AnimatePresence>
        {isBrandModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-theme border border-border-theme rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-border-theme/40 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary-theme" />
                  <span>Onboard New Corporate Brand</span>
                </h3>
                <button onClick={() => setIsBrandModalOpen(false)} className="p-1.5 hover:bg-border-theme rounded-xl text-text-muted-theme cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={submitBrandOnboard} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Company Brand Name</label>
                  <input 
                    type="text" required value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="e.g. TechnoAdviser India Corp"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold text-text-primary-theme focus:outline-none focus:border-primary-theme"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Industry Sector Vertical</label>
                  <input 
                    type="text" required value={newBrandIndustry} onChange={(e) => setNewBrandIndustry(e.target.value)}
                    placeholder="e.g. IT Software, FinTech, E-Commerce"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold text-text-primary-theme focus:outline-none focus:border-primary-theme"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Headquarters Location</label>
                  <input 
                    type="text" required value={newBrandLocation} onChange={(e) => setNewBrandLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold text-text-primary-theme focus:outline-none focus:border-primary-theme"
                  />
                </div>

                <div className="p-3 bg-primary-theme/5 border border-primary-theme/15 rounded-2xl text-[9px] font-semibold text-primary-theme">
                  Enterprise Onboarding is pre-verified instantly for superadmin credentials. All associated recruiting accounts are auto-approved.
                </div>

                <div className="pt-4 border-t border-border-theme/40 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsBrandModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-black text-text-secondary-theme hover:bg-border-theme/20 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl shadow-sm transition-all">Onboard Brand</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
