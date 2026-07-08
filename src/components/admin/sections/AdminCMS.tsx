/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Layout, HelpCircle, Mail, Bell, Sparkles, 
  Settings, CheckCircle2, Globe, Eye, Edit, X, RefreshCw
} from 'lucide-react';

interface AdminCMSProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function AdminCMS({ addToast }: AdminCMSProps) {
  const [activeSubTab, setActiveSubTab] = useState<'landing' | 'blog' | 'faqs' | 'email' | 'notifications'>('landing');

  // Landing page configuration list state
  const [sections, setSections] = useState([
    { id: 'hero', name: 'Hero Section Content', status: 'Live', items: 'Headline, CTA Link, Cover Asset', headline: 'Find the Right Job Smarter with AI', subtitle: 'Connect instantly to verified candidates and corporate vacancies utilizing secure distance-weights parameters.', updated: '16 May 2024' },
    { id: 'features', name: 'Features Matrix Grid', status: 'Live', items: 'Sourcing speed, AI validation, Secure portals', headline: 'Platform Matrix', subtitle: 'Our proprietary algorithm validates skills profiles at scale.', updated: '15 May 2024' },
    { id: 'chronology', name: 'How It Works (Chronology)', status: 'Live', items: 'Candidate signup, AI matching, Verified interview', headline: 'Chronological Workflows', subtitle: 'Get onboarded in three simple steps.', updated: '14 May 2024' },
    { id: 'testimonials', name: 'Testimonials Slider', status: 'Live', items: '3 Verified corporate recruiter stories', headline: 'Recruiter Stories', subtitle: 'See what verified enterprise leaders are saying.', updated: '10 May 2024' },
    { id: 'cta', name: 'CTA Section Banner', status: 'Live', items: 'Direct signup action card', headline: 'Ready to Accelerate Sourcing?', subtitle: 'Create an account and start recruiting now.', updated: '08 May 2024' },
  ]);

  // CDN publish state
  const [isPublishing, setIsPublishing] = useState(false);

  // Editor Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<typeof sections[0] | null>(null);
  const [editHeadline, setEditHeadline] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');

  const handlePublishCMS = () => {
    setIsPublishing(true);
    addToast('Contacting CDN endpoints to invalidate edge cache...', 'info');
    setTimeout(() => {
      setIsPublishing(false);
      addToast('All staged CMS changes successfully written to Edge CDN caches!', 'success');
    }, 1200);
  };

  const handleConfigureSection = (section: typeof sections[0]) => {
    setSelectedSection(section);
    setEditHeadline(section.headline);
    setEditSubtitle(section.subtitle);
    setIsEditModalOpen(true);
  };

  const submitSectionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSection) {
      setSections(sections.map(s => 
        s.id === selectedSection.id 
          ? { ...s, headline: editHeadline, subtitle: editSubtitle, updated: 'Just now' }
          : s
      ));
      addToast(`Updated content parameters for: ${selectedSection.name}`, 'success');
      setIsEditModalOpen(false);
    }
  };

  // Extract Hero Section to bind with the simulated browser preview dynamically
  const heroSection = sections.find(s => s.id === 'hero') || sections[0];

  return (
    <div className="space-y-6">
      
      {/* Sub tabs nav */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl p-4 shadow-sm space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-theme/40 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'landing', label: 'Landing Page Sections', icon: Layout },
              { id: 'blog', label: 'Platform Blogs', icon: FileText },
              { id: 'faqs', label: 'Global FAQ Ledger', icon: HelpCircle },
              { id: 'email', label: 'Email Templates', icon: Mail },
              { id: 'notifications', label: 'Push Templates', icon: Bell },
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

          <button 
            disabled={isPublishing}
            onClick={handlePublishCMS}
            className={`px-3.5 py-1.5 text-white text-[10px] font-black rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all ${
              isPublishing ? 'bg-primary-theme/70 opacity-80 cursor-not-allowed' : 'bg-primary-theme hover:bg-primary-hover-theme'
            }`}
          >
            {isPublishing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Invalidating Cache...</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                <span>Publish To Production CDN</span>
              </>
            )}
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Section managers */}
        <div className="lg:col-span-8 space-y-5">
          
          {activeSubTab === 'landing' && (
            <div className="bg-surface-theme border border-border-theme rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border-theme/40">
                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Landing Content Modules</h4>
              </div>

              <div className="divide-y divide-border-theme/35">
                {sections.map((sect) => (
                  <div key={sect.id} className="p-4 hover:bg-border-theme/10 transition-colors flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-black text-text-primary-theme">{sect.name}</h5>
                      <span className="text-[10px] text-text-muted-theme font-semibold block mt-0.5">Parameters: {sect.items}</span>
                      <span className="text-[9px] text-text-muted-theme font-medium block">Last sync: {sect.updated}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                        {sect.status}
                      </span>
                      <button 
                        onClick={() => handleConfigureSection(sect)}
                        className="p-1.5 hover:bg-border-theme/50 rounded-xl text-primary-theme cursor-pointer transition-colors"
                        title="Edit Section Parameters"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab !== 'landing' && (
            <div className="bg-surface-theme border border-border-theme p-6 rounded-3xl text-center space-y-2 shadow-sm">
              <Eye className="w-8 h-8 text-primary-theme mx-auto" />
              <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">CMS Templates Builder</h4>
              <p className="text-[10px] text-text-muted-theme font-semibold">Templates staging directory is synchronizing correctly with server assets folders.</p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Live Card Preview Block */}
        <div className="lg:col-span-4">
          <div className="bg-surface-theme border border-border-theme rounded-3xl shadow-sm p-6 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-primary-theme" />
              <span>Real-time Hero Preview</span>
            </h4>

            {/* Simulated browser window */}
            <div className="border border-border-theme/60 rounded-2xl overflow-hidden bg-bg-theme shadow-lg">
              <div className="bg-border-theme/10 p-2.5 flex items-center gap-1.5 border-b border-border-theme">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="bg-surface-theme text-[8px] font-black px-4.5 py-0.5 rounded-full text-text-muted-theme overflow-hidden truncate max-w-xs ml-2">
                  technoadviser.com/home
                </div>
              </div>

              {/* Landing Page Content Mock bound to Hero Section */}
              <div className="p-4 space-y-3 text-center">
                <div className="inline-flex items-center gap-1 bg-primary-theme/10 text-primary-theme px-2 py-0.5 rounded-full text-[8px] font-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Powered Matching</span>
                </div>
                <h3 className="text-sm font-black font-serif text-text-primary-theme leading-tight">
                  {heroSection.headline}
                </h3>
                <p className="text-[9px] text-text-secondary-theme leading-relaxed">
                  {heroSection.subtitle}
                </p>
                <div className="pt-2">
                  <button className="px-4 py-1.5 bg-primary-theme text-white text-[9px] font-black rounded-lg shadow-sm">
                    Get Started Free
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-text-muted-theme leading-relaxed font-semibold">
              The preview represents current Hero and Action banners. Updates made here are immediately published into draft environments.
            </p>
          </div>
        </div>

      </div>

      {/* Inline Content Editor Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-theme border border-border-theme rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-border-theme/40 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-2">
                  <Edit className="w-4 h-4 text-primary-theme" />
                  <span>Edit Content Block</span>
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 hover:bg-border-theme rounded-xl text-text-muted-theme cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={submitSectionEdit} className="p-6 space-y-4">
                <div className="p-3 bg-primary-theme/5 border border-primary-theme/15 rounded-2xl">
                  <span className="text-[9px] font-black uppercase tracking-wider text-primary-theme block">Staged CMS Section</span>
                  <span className="text-xs font-black text-text-primary-theme block mt-0.5">{selectedSection.name}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Headline / Title</label>
                  <input 
                    type="text" required value={editHeadline} onChange={(e) => setEditHeadline(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold text-text-primary-theme focus:outline-none focus:border-primary-theme"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Body / Supporting Copy</label>
                  <textarea 
                    rows={3} required value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold text-text-primary-theme focus:outline-none focus:border-primary-theme resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-border-theme/40 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-black text-text-secondary-theme hover:bg-border-theme/20 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl shadow-sm transition-all">Stage Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
