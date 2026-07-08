/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, MapPin, Globe, Users, Edit3, CheckCircle, 
  Sparkles, Star, Image as ImageIcon, Camera, Trash2, ShieldCheck, Loader2
} from 'lucide-react';

interface EmpCompanySectionProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function EmpCompanySection({ addToast }: EmpCompanySectionProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Editable company states
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [website, setWebsite] = useState('');
  const [employees, setEmployees] = useState('');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');
  const [industry, setIndustry] = useState('');

  // Verification verification status
  const [verificationStatus, setVerificationStatus] = useState<'Verified' | 'Pending' | 'Not Started'>('Verified');

  // Office Gallery pictures
  const [gallery, setGallery] = useState([
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=80',
  ]);

  // Company Reviews feed list
  const [reviews, setReviews] = useState([
    { id: 'rev-1', author: 'Anjali Sharma', rating: 5, date: '10 May 2024', title: 'Exceptional Sourcing Support', comment: 'The AI recommendations in the suite reduced our engineering vetting loops by nearly 40%.' },
    { id: 'rev-2', author: 'Vikram Malhotra', rating: 4, date: '04 May 2024', title: 'Streamlined Sourcing Workflows', comment: 'The side-by-side comparison matrix is invaluable for consensus meeting updates.' },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
        const response = await fetch('/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.employer) {
            const emp = data.employer;
            setCompanyName(emp.companyName || '');
            setTagline(emp.about ? emp.about.split('.')[0] + '.' : 'Elevating corporate tech hiring and AI matching processes globally.');
            setWebsite(emp.website || '');
            setEmployees(emp.employees || '50 - 250 Employees');
            setLocation(emp.location || '');
            setAbout(emp.about || '');
            setIndustry(emp.industry || '');
            setVerificationStatus(emp.status === 'APPROVED' ? 'Verified' : emp.status === 'REJECTED' ? 'Not Started' : 'Pending');
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName,
          industry,
          location,
          employees,
          about,
          website
        })
      });
      if (response.ok) {
        setIsEditMode(false);
        addToast('Company profile parameters saved successfully!', 'success');
      } else {
        const data = await response.json();
        addToast(`Save failed: ${data.error || response.statusText}`, 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Error saving profile changes.', 'info');
    }
  };

  const handleRequestVerification = () => {
    setVerificationStatus('Pending');
    addToast('Verification request dispatched for document review.', 'info');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-theme" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Upper Brand Profile Banner */}
      <div className="bg-gradient-to-r from-primary-theme to-indigo-600 p-6 sm:p-8 rounded-3xl text-white relative overflow-hidden shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_40%)]" />
        <div className="flex items-center gap-4.5 z-10">
          <div className="w-14 h-14 bg-white text-primary-theme rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
            {companyName ? companyName.charAt(0).toUpperCase() : 'T'}
          </div>
          <div>
            <h1 className="text-xl font-serif font-black tracking-tight">{companyName || 'Corporate Partner'}</h1>
            <p className="text-xs text-white/80 font-medium pt-1">{tagline || industry}</p>
          </div>
        </div>

        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-black rounded-xl transition-all z-10 cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditMode ? 'View Profile' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Editable Parameters Profile Fields */}
        <div className="md:col-span-8 space-y-6">
          
          {!isEditMode ? (
            <div className="bg-surface-theme border border-border-theme p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">About Company</h3>
                <p className="text-xs text-text-secondary-theme leading-relaxed font-semibold">
                  {about || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border-theme/40 pt-4 text-[10px] font-black text-text-secondary-theme">
                <div>Website: <span className="text-primary-theme font-mono block mt-0.5">{website || 'N/A'}</span></div>
                <div>Employees: <span className="text-text-primary-theme block mt-0.5">{employees || 'N/A'}</span></div>
                <div>Location: <span className="text-text-primary-theme block mt-0.5">{location || 'N/A'}</span></div>
                <div>Industry: <span className="text-text-primary-theme block mt-0.5">{industry || 'N/A'}</span></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfileSubmit} className="bg-surface-theme border border-border-theme p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Company Name *</label>
                <input 
                  type="text" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold text-text-primary-theme"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Tagline</label>
                <input 
                  type="text" 
                  value={tagline} 
                  onChange={(e) => setTagline(e.target.value)} 
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold text-text-primary-theme"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Website URL</label>
                  <input 
                    type="text" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold text-text-primary-theme"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Employee Count</label>
                  <input 
                    type="text" 
                    value={employees} 
                    onChange={(e) => setEmployees(e.target.value)} 
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold text-text-primary-theme"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Industry Sector</label>
                  <input 
                    type="text" 
                    value={industry} 
                    onChange={(e) => setIndustry(e.target.value)} 
                    placeholder="e.g. IT Software, FinTech"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold text-text-primary-theme"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Headquarters / Location</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="e.g. Bangalore, India"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold text-text-primary-theme"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider font-sans">About Description</label>
                <textarea 
                  rows={4} 
                  value={about} 
                  onChange={(e) => setAbout(e.target.value)} 
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-medium resize-none text-text-primary-theme leading-relaxed"
                />
              </div>

              <button 
                type="submit"
                className="px-5 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          )}

          {/* Office Gallery Image Grid */}
          <div className="bg-surface-theme border border-border-theme p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border-theme/40">
              <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4.5 h-4.5 text-primary-theme" />
                <span>Office Gallery</span>
              </h3>
              <button 
                onClick={() => addToast('Image gallery uploader triggered.', 'info')}
                className="text-xs font-black text-primary-theme hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" /> Upload Photos
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3.5">
              {gallery.map((imgUrl, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden aspect-video group">
                  <img src={imgUrl} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => {
                        setGallery(gallery.filter((_, i) => i !== idx));
                        addToast('Removed gallery photo.', 'info');
                      }}
                      className="p-1.5 bg-white/20 hover:bg-rose-500 text-white rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Verification & Reviews */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Verification triggers block */}
          <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Corporate Verification</h3>
            
            {verificationStatus === 'Verified' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/15 p-4 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block">Badge Status: Verified</span>
                  <p className="text-[9px] text-text-secondary-theme leading-relaxed font-bold">Your corporate listings are marked with high-trust credentials.</p>
                </div>
              </div>
            ) : verificationStatus === 'Pending' ? (
              <div className="bg-amber-500/10 border border-amber-500/15 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0 animate-pulse" />
                <div>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block">Badge Status: Pending</span>
                  <p className="text-[9px] text-text-secondary-theme leading-relaxed font-bold">Documents currently under evaluation. Please wait 1-2 business days.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] text-text-secondary-theme leading-relaxed font-bold">Verify your company registry details to get full reach and trust tags.</p>
                <button 
                  onClick={handleRequestVerification}
                  className="w-full text-center py-2 bg-primary-theme text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Verify Company Details
                </button>
              </div>
            )}
          </div>

          {/* Reviews list */}
          <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Corporate Reviews</h3>
            
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="space-y-1 border-b border-border-theme/40 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-text-primary-theme">{rev.author}</span>
                    <span className="text-text-muted-theme font-mono">{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-text-primary-theme block mt-1">{rev.title}</span>
                  <p className="text-[10px] text-text-secondary-theme leading-relaxed font-medium">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
