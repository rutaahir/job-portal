/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Sliders, Cpu, Brain, CheckCircle, HelpCircle, 
  Settings, Award, RefreshCw, BarChart2, X
} from 'lucide-react';

interface AdminAiEngineProps {
  addToast: (text: string, type?: 'success' | 'info') => void;
}

export default function AdminAiEngine({ addToast }: AdminAiEngineProps) {
  const [activeSubTab, setActiveSubTab] = useState<'matching' | 'config' | 'trust' | 'parser' | 'assessment'>('matching');
  
  // Model sliders
  const [confidence, setConfidence] = useState(70);
  const [modelVersion, setModelVersion] = useState('v3.2 (Latest)');
  const [updateFrequency, setUpdateFrequency] = useState('Real-time');

  // AI Matching switches
  const [enableMatching, setEnableMatching] = useState(true);
  const [autoRecommendations, setAutoRecommendations] = useState(true);
  const [skillsExtraction, setSkillsExtraction] = useState(true);
  const [biasReduction, setBiasReduction] = useState(false);
  const [feedbackLoop, setFeedbackLoop] = useState(true);

  // Matcher algorithms
  const [algorithms, setAlgorithms] = useState([
    { id: 'alg-1', name: 'AI Configuration Engine', status: 'Active', accuracy: '92.6%', updated: '18 May 2024', weights: { skills: 40, exp: 30, edu: 20, loc: 10 } },
    { id: 'alg-2', name: 'Trust Score Matcher', status: 'Active', accuracy: 'N/A', updated: '18 May 2024', weights: { skills: 30, exp: 40, edu: 15, loc: 15 } },
    { id: 'alg-3', name: 'Resume Parser v4.1', status: 'Active', accuracy: '96.2%', updated: '18 May 2024', weights: { skills: 50, exp: 25, edu: 15, loc: 10 } },
    { id: 'alg-4', name: 'Assessment Scoring Engine', status: 'Active', accuracy: '94.8%', updated: '18 May 2024', weights: { skills: 35, exp: 35, edu: 20, loc: 10 } },
  ]);

  // Calibration State
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Modal / tuning State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedAlg, setSelectedAlg] = useState<typeof algorithms[0] | null>(null);
  
  const [tuningSkills, setTuningSkills] = useState(40);
  const [tuningExp, setTuningExp] = useState(30);
  const [tuningEdu, setTuningEdu] = useState(20);
  const [tuningLoc, setTuningLoc] = useState(10);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('AI configuration weights and model versions updated on cluster.', 'success');
  };

  const handleConfigureAlg = (alg: typeof algorithms[0]) => {
    setSelectedAlg(alg);
    setTuningSkills(alg.weights.skills);
    setTuningExp(alg.weights.exp);
    setTuningEdu(alg.weights.edu);
    setTuningLoc(alg.weights.loc);
    setIsConfigModalOpen(true);
  };

  const submitTuning = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAlg) {
      const sum = tuningSkills + tuningExp + tuningEdu + tuningLoc;
      if (sum !== 100) {
        addToast(`Sub-weights must total exactly 100%. Current total: ${sum}%`, 'info');
        return;
      }
      setAlgorithms(algorithms.map(a => 
        a.id === selectedAlg.id 
          ? { 
              ...a, 
              weights: { skills: tuningSkills, exp: tuningExp, edu: tuningEdu, loc: tuningLoc },
              accuracy: `${(90 + Math.random() * 8).toFixed(1)}%`,
              updated: 'Just now'
            } 
          : a
      ));
      addToast(`Tuning weights updated successfully for: ${selectedAlg.name}`, 'success');
      setIsConfigModalOpen(false);
    }
  };

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    addToast('Contacting neural GPU cluster for calibration cycle...', 'info');
    setTimeout(() => {
      setAlgorithms(algorithms.map(a => ({
        ...a,
        accuracy: `${(91 + Math.random() * 7).toFixed(1)}%`,
        updated: 'Today (Calibrated)'
      })));
      setIsCalibrating(false);
      addToast('GPU cluster completed model weight re-calibration successfully!', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Subelement navigation bar */}
      <div className="bg-surface-theme border border-border-theme rounded-2xl p-4 shadow-sm space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-theme/40 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'matching', label: 'Matching Algorithm', icon: Brain },
              { id: 'config', label: 'AI Configuration', icon: Sliders },
              { id: 'trust', label: 'Trust Score Weights', icon: Award },
              { id: 'parser', label: 'Resume Parser LLM', icon: Cpu },
              { id: 'assessment', label: 'Assessment Engine', icon: Sparkles },
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
            disabled={isCalibrating}
            onClick={handleRecalibrate}
            className={`px-3 py-1.5 text-white text-[10px] font-black rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
              isCalibrating ? 'bg-emerald-600 opacity-70 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin' : ''}`} />
            <span>{isCalibrating ? 'Recalibrating Core...' : 'Re-calibrate AI Weights'}</span>
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Main sub-tab interface */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeSubTab === 'matching' && (
            <div className="bg-surface-theme border border-border-theme rounded-3xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border-theme/40">
                <h4 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">AI Matching Modules</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-bold text-text-primary-theme">
                  <thead>
                    <tr className="bg-border-theme/10 border-b border-border-theme text-[9px] uppercase tracking-wider font-black text-text-muted-theme">
                      <th className="p-4 pl-6">Matching Module Name</th>
                      <th className="p-4">Operational Status</th>
                      <th className="p-4">Calibration Accuracy</th>
                      <th className="p-4">Last Automated Check</th>
                      <th className="p-4 text-right pr-6">Weight Tuning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-theme/40 text-text-secondary-theme">
                    {algorithms.map((alg) => (
                      <tr key={alg.id} className="hover:bg-border-theme/10 transition-colors">
                        <td className="p-4 pl-6 font-black text-text-primary-theme">{alg.name}</td>
                        <td className="p-4">
                          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 px-2.5 py-0.5 rounded text-[9px] font-black uppercase">
                            {alg.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono">{alg.accuracy}</td>
                        <td className="p-4 font-mono text-[10px]">{alg.updated}</td>
                        <td className="p-4 text-right pr-6">
                          <button 
                            onClick={() => handleConfigureAlg(alg)}
                            className="px-2.5 py-1.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-[9px] font-black rounded-lg cursor-pointer transition-colors"
                          >
                            Configure
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab !== 'matching' && (
            <div className="bg-surface-theme border border-border-theme p-6 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">AI Parameter Insights</h4>
              <p className="text-[10px] text-text-secondary-theme leading-relaxed font-semibold">
                This matching module configures neural token distance weights automatically. Model embeddings parse candidate skills, job vacancies, and test reports to compute real-time matching accuracy index scores.
              </p>
              <div className="p-4 bg-border-theme/20 rounded-2xl border border-border-theme/40 text-[9px] font-mono text-text-muted-theme">
                EMBED_MODEL: text-embedding-004 &middot; DISTANCE: COSINE &middot; DIMENSIONS: 768
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: AI Tune Config Panels */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Slider tune widget */}
          <div className="bg-surface-theme border border-border-theme p-6 rounded-3xl shadow-sm space-y-5">
            <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-primary-theme" />
              <span>Model Tuning Parameters</span>
            </h4>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Model Variant Selection</label>
                <select 
                  value={modelVersion}
                  onChange={(e) => setModelVersion(e.target.value)}
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                >
                  <option value="v3.2 (Latest)">v3.2 (Latest LLM Tuning)</option>
                  <option value="v3.1 (Stable)">v3.1 (Stable Production)</option>
                  <option value="v2.9 (Legacy)">v2.9 (Legacy Fast Match)</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">
                  <span>Confidence Cutoff Threshold</span>
                  <span className="font-mono text-primary-theme">{confidence}%</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="95"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full h-1.5 bg-border-theme rounded-lg appearance-none cursor-pointer accent-primary-theme"
                />
                <span className="text-[8px] text-text-muted-theme font-semibold block leading-tight">Only recommend applicants with confidence scores greater than {confidence}%.</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary-theme uppercase tracking-wider">Embedding Update Frequency</label>
                <select 
                  value={updateFrequency}
                  onChange={(e) => setUpdateFrequency(e.target.value)}
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                >
                  <option value="Real-time">Real-time Stream</option>
                  <option value="Hourly">Hourly Batch Updates</option>
                  <option value="Daily">Daily Sync</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t border-border-theme/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-text-primary-theme">Enable AI Matching</span>
                  <input type="checkbox" checked={enableMatching} onChange={() => setEnableMatching(!enableMatching)} className="accent-primary-theme h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-text-primary-theme">Auto Recommendation Engine</span>
                  <input type="checkbox" checked={autoRecommendations} onChange={() => setAutoRecommendations(!autoRecommendations)} className="accent-primary-theme h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-text-primary-theme">Skills Autocomplete Extraction</span>
                  <input type="checkbox" checked={skillsExtraction} onChange={() => setSkillsExtraction(!skillsExtraction)} className="accent-primary-theme h-4 w-4" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full text-center py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Save Matching Weights
              </button>

            </form>
          </div>

        </div>

      </div>

      {/* Weight Tuning Modal Overlay */}
      <AnimatePresence>
        {isConfigModalOpen && selectedAlg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-theme border border-border-theme rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-border-theme/40 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary-theme" />
                  <span>Fine-Tune Weights</span>
                </h3>
                <button onClick={() => setIsConfigModalOpen(false)} className="p-1.5 hover:bg-border-theme rounded-xl text-text-muted-theme cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={submitTuning} className="p-6 space-y-5">
                <div className="p-3 bg-primary-theme/5 border border-primary-theme/15 rounded-2xl">
                  <span className="text-[9px] font-black uppercase tracking-wider text-primary-theme block">Tuning Algorithm</span>
                  <span className="text-xs font-black text-text-primary-theme block mt-0.5">{selectedAlg.name}</span>
                </div>

                <div className="space-y-4">
                  {/* Skill weight */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-text-secondary-theme">
                      <span>Skills Match Priority</span>
                      <span className="font-mono text-primary-theme">{tuningSkills}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={tuningSkills}
                      onChange={(e) => setTuningSkills(Number(e.target.value))}
                      className="w-full accent-primary-theme h-1 bg-border-theme rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Experience weight */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-text-secondary-theme">
                      <span>Experience Match Priority</span>
                      <span className="font-mono text-primary-theme">{tuningExp}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={tuningExp}
                      onChange={(e) => setTuningExp(Number(e.target.value))}
                      className="w-full accent-primary-theme h-1 bg-border-theme rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Education weight */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-text-secondary-theme">
                      <span>Education & Certification</span>
                      <span className="font-mono text-primary-theme">{tuningEdu}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={tuningEdu}
                      onChange={(e) => setTuningEdu(Number(e.target.value))}
                      className="w-full accent-primary-theme h-1 bg-border-theme rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Location weight */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-text-secondary-theme">
                      <span>Location / Remote Match</span>
                      <span className="font-mono text-primary-theme">{tuningLoc}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={tuningLoc}
                      onChange={(e) => setTuningLoc(Number(e.target.value))}
                      className="w-full accent-primary-theme h-1 bg-border-theme rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-3 bg-border-theme/25 rounded-2xl flex justify-between items-center text-[10px] font-black">
                  <span className="text-text-secondary-theme uppercase">Total Combined Weight</span>
                  <span className={`font-mono text-xs ${tuningSkills + tuningExp + tuningEdu + tuningLoc === 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {tuningSkills + tuningExp + tuningEdu + tuningLoc}% / 100%
                  </span>
                </div>

                <div className="pt-4 border-t border-border-theme/40 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsConfigModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-black text-text-secondary-theme hover:bg-border-theme/20 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl shadow-sm transition-all">Apply Tuning</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
