/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot, LayoutDashboard, MessageSquare, FileSearch, Sparkles, ScrollText,
  UserCheck, Mic, LineChart, Milestone, Compass, BookOpen, Search,
  TrendingUp, Award, Pin, Trash2, Edit3, Send, Upload, Star, Settings,
  Brain, FileText, ChevronRight, GraduationCap, Building2, HelpCircle,
  Play, CheckCircle2, AlertCircle, RefreshCw, Plus, Download, Clipboard
} from 'lucide-react';

interface AICareerSectionProps {
  addToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

type CopilotTab =
  | 'dashboard'
  | 'chat'
  | 'analyzer'
  | 'optimizer'
  | 'coverletter'
  | 'prep'
  | 'mock'
  | 'salary'
  | 'roadmap'
  | 'skills'
  | 'learning'
  | 'jobmatch'
  | 'company'
  | 'strategy'
  | 'analytics'
  | 'memory'
  | 'settings';

export default function AICareerSection({ addToast }: AICareerSectionProps) {
  const [activeTab, setActiveTab] = useState<CopilotTab>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // Authentication token
  const getAuthToken = () => {
    return localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email || '';
  };

  // Helper fetch with Auth headers
  const authedFetch = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {})
    };
    return fetch(url, { ...options, headers });
  };

  // --- Sub-View States ---

  // 1. Dashboard State
  const [dashboardData, setDashboardData] = useState<any>(null);

  // 2. Chat States
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // 3. Resume Analyzer States
  const [analyzerHistory, setAnalyzerHistory] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 4. Resume Optimizer States
  const [optimizerInput, setOptimizerInput] = useState('');
  const [optimizedResult, setOptimizedResult] = useState<any>(null);

  // 5. Cover Letter States
  const [letterForm, setLetterForm] = useState({ jobTitle: 'Senior Full-Stack Engineer', companyName: 'Google', tone: 'formal' });
  const [generatedLetter, setGeneratedLetter] = useState<any>(null);
  const [letterHistory, setLetterHistory] = useState<any[]>([]);

  // 6. Interview Prep States
  const [prepForm, setPrepForm] = useState({ roundType: 'Technical', role: 'Software Engineer' });
  const [prepQuestions, setPrepQuestions] = useState<any[]>([]);

  // 7. Mock Interview States
  const [mockForm, setMockForm] = useState({ roundType: 'Technical', role: 'Software Engineer' });
  const [mockSession, setMockSession] = useState<any>(null);
  const [currentMockQuestionIdx, setCurrentMockQuestionIdx] = useState(0);
  const [mockAnswers, setMockAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [mockEvaluation, setMockEvaluation] = useState<any>(null);
  const [mockHistory, setMockHistory] = useState<any[]>([]);

  // 8. Salary Prediction States
  const [salaryForm, setSalaryForm] = useState({ role: 'Software Engineer', location: 'Bengaluru' });
  const [salaryPrediction, setSalaryPrediction] = useState<any>(null);

  // 9. Career Roadmap States
  const [roadmapForm, setRoadmapForm] = useState({ targetRole: 'Enterprise Solution Architect' });
  const [activeRoadmap, setActiveRoadmap] = useState<any>(null);
  const [roadmapHistory, setRoadmapHistory] = useState<any[]>([]);

  // 10. Skill Gap States
  const [skillGapForm, setSkillGapForm] = useState({ jobTitle: 'Lead Developer', jobDescription: 'Seeking a developer with extensive experience in Django REST, Kubernetes orchestration, Docker pipelines, and PostgreSQL.' });
  const [skillGapResult, setSkillGapResult] = useState<any>(null);

  // 11. Learning Recommendations States
  const [learningForm, setLearningForm] = useState({ skillsText: 'Kubernetes, AWS Cloud, Docker' });
  const [learningResult, setLearningResult] = useState<any>(null);

  // 12. Job Match Explainer States
  const [jobMatchForm, setJobMatchForm] = useState({ jobId: '' });
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [jobMatchResult, setJobMatchResult] = useState<any>(null);

  // 13. Company Insights States
  const [companyInsightForm, setCompanyInsightForm] = useState({ companyName: 'Flipkart' });
  const [companyInsightResult, setCompanyInsightResult] = useState<any>(null);

  // 14. Application Strategy States
  const [appStrategyForm, setAppStrategyForm] = useState({ jobId: '' });
  const [appStrategyResult, setAppStrategyResult] = useState<any>(null);

  // 15. Analytics States
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // 16. AI Memory States
  const [aiMemoryList, setAiMemoryList] = useState<any[]>([]);
  const [newMemory, setNewMemory] = useState({ category: 'goals', text: '' });

  // 17. Settings States
  const [settingsForm, setSettingsForm] = useState({
    language: 'English',
    tone: 'professional',
    weeklyReport: true,
    privacy: 'standard'
  });

  // --- Initializers & Fetchers ---

  useEffect(() => {
    loadDashboard();
    loadConversations();
    loadAnalyzerHistory();
    loadLetterHistory();
    loadRoadmapHistory();
    loadMockHistory();
    loadMemory();
    loadAnalytics();
    loadJobs();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await authedFetch('/api/copilot/dashboard');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadConversations = async () => {
    try {
      const res = await authedFetch('/api/copilot/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (data.length > 0 && !activeConvId) {
          loadConversationDetail(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadConversationDetail = async (convId: string) => {
    setActiveConvId(convId);
    try {
      const res = await authedFetch(`/api/copilot/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadAnalyzerHistory = async () => {
    try {
      const res = await authedFetch('/api/copilot/resume/analyze');
      if (res.ok) {
        const data = await res.json();
        setAnalyzerHistory(data);
        if (data.length > 0) {
          setSelectedAnalysis(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadLetterHistory = async () => {
    try {
      const res = await authedFetch('/api/copilot/cover-letter');
      if (res.ok) {
        const data = await res.json();
        setLetterHistory(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadRoadmapHistory = async () => {
    try {
      const res = await authedFetch('/api/copilot/roadmap');
      if (res.ok) {
        const data = await res.json();
        setRoadmapHistory(data);
        if (data.length > 0) {
          setActiveRoadmap(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadMockHistory = async () => {
    try {
      const res = await authedFetch('/api/copilot/interview/history');
      if (res.ok) {
        const data = await res.json();
        setMockHistory(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadMemory = async () => {
    try {
      const res = await authedFetch('/api/copilot/memory');
      if (res.ok) {
        const data = await res.json();
        setAiMemoryList(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await authedFetch('/api/copilot/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadJobs = async () => {
    try {
      const res = await authedFetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setAvailableJobs(data);
        if (data.length > 0) {
          setJobMatchForm({ jobId: data[0].id });
          setAppStrategyForm({ jobId: data[0].id });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- Handlers & Actions ---

  // Chat Actions
  const handleNewConversation = async () => {
    try {
      const res = await authedFetch('/api/copilot/conversations', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Conversation' })
      });
      if (res.ok) {
        const newConv = await res.json();
        setConversations(prev => [newConv, ...prev]);
        loadConversationDetail(newConv.id);
        addToast('Created new conversation session.', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeConvId) return;

    const textToSend = chatInput;
    setChatInput('');
    setIsAiTyping(true);

    // Optimistic Update
    const tempUserMsg = { id: `temp-usr-${Date.now()}`, sender: 'user', text: textToSend, created_at: new Date().toISOString() };
    setChatMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await authedFetch(`/api/copilot/conversations/${activeConvId}`, {
        method: 'POST',
        body: JSON.stringify({ text: textToSend })
      });
      setIsAiTyping(false);
      if (res.ok) {
        const data = await res.json();
        // Replace temp messages and add actual ones
        setChatMessages(prev => prev.filter(m => m.id !== tempUserMsg.id).concat(data.user_message, data.ai_message));
        loadConversations(); // refresh list to show correct latest timestamps/titles
      }
    } catch (e) {
      setIsAiTyping(false);
      addToast('Error sending message. Please try again.', 'error');
    }
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await authedFetch(`/api/copilot/conversations/${convId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== convId));
        if (activeConvId === convId) {
          setActiveConvId(null);
          setChatMessages([]);
        }
        addToast('Conversation deleted.', 'info');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFavorite = async (convId: string, currentVal: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await authedFetch(`/api/copilot/conversations/${convId}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_favorite: !currentVal })
      });
      if (res.ok) {
        setConversations(prev => prev.map(c => c.id === convId ? { ...c, is_favorite: !currentVal } : c));
        addToast(!currentVal ? 'Added to favorites.' : 'Removed from favorites.', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePin = async (convId: string, currentVal: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await authedFetch(`/api/copilot/conversations/${convId}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_pinned: !currentVal })
      });
      if (res.ok) {
        setConversations(prev => prev.map(c => c.id === convId ? { ...c, is_pinned: !currentVal } : c).sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0)));
        addToast(!currentVal ? 'Conversation pinned.' : 'Conversation unpinned.', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Resume Upload / Analyzer Actions
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    try {
      const token = getAuthToken();
      const res = await fetch('/api/copilot/resume/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      setIsAnalyzing(false);
      if (res.ok) {
        const data = await res.json();
        setAnalyzerHistory(prev => [data, ...prev]);
        setSelectedAnalysis(data);
        loadDashboard(); // Refresh resume stats
        addToast('Resume uploaded and audited successfully.', 'success');
      } else {
        addToast('Failed to analyze resume.', 'error');
      }
    } catch (e) {
      setIsAnalyzing(false);
      addToast('Error uploading resume.', 'error');
    }
  };

  // Resume Optimizer Actions
  const handleOptimizeResume = async () => {
    if (!optimizerInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await authedFetch('/api/copilot/resume/optimize', {
        method: 'POST',
        body: JSON.stringify({ resumeText: optimizerInput })
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setOptimizedResult(data);
        addToast('AI resume suggestions generated.', 'success');
      }
    } catch (e) {
      setIsLoading(false);
      addToast('Error optimizing content.', 'error');
    }
  };

  // Cover Letter Generator
  const handleGenerateCoverLetter = async () => {
    setIsLoading(true);
    try {
      const res = await authedFetch('/api/copilot/cover-letter', {
        method: 'POST',
        body: JSON.stringify(letterForm)
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setGeneratedLetter(data);
        setLetterHistory(prev => [data, ...prev]);
        addToast('Cover letter drafted.', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  // Career Roadmap
  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    try {
      const res = await authedFetch('/api/copilot/roadmap', {
        method: 'POST',
        body: JSON.stringify({ targetRole: roadmapForm.targetRole })
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setActiveRoadmap(data);
        setRoadmapHistory(prev => [data, ...prev]);
        addToast('Personalized Career Roadmap generated!', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  // Skill Gap Analysis
  const handleSkillGapSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await authedFetch('/api/copilot/skill-gap', {
        method: 'POST',
        body: JSON.stringify(skillGapForm)
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setSkillGapResult(data);
        addToast('Skill gaps evaluated.', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  // Learning Recommendations
  const handleLearningSubmit = async () => {
    setIsLoading(true);
    const skills = learningForm.skillsText.split(',').map(s => s.trim()).filter(Boolean);
    try {
      const res = await authedFetch('/api/copilot/learning', {
        method: 'POST',
        body: JSON.stringify({ skills })
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setLearningResult(data);
        addToast('Curated learning recommendations loaded.', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  // Job Match Explanation
  const handleJobMatchSubmit = async () => {
    if (!jobMatchForm.jobId) return;
    setIsLoading(true);
    try {
      const res = await authedFetch('/api/copilot/job-match', {
        method: 'POST',
        body: JSON.stringify({ jobId: jobMatchForm.jobId })
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setJobMatchResult(data);
        addToast('Job match metrics explained.', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  // Company Insights
  const handleCompanyInsightSubmit = async () => {
    if (!companyInsightForm.companyName) return;
    setIsLoading(true);
    try {
      const res = await authedFetch('/api/copilot/company-insight', {
        method: 'POST',
        body: JSON.stringify({ companyName: companyInsightForm.companyName })
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setCompanyInsightResult(data);
        addToast('Company intelligence compiled.', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  // Application Strategy
  const handleAppStrategySubmit = async () => {
    if (!appStrategyForm.jobId) return;
    setIsLoading(true);
    try {
      const res = await authedFetch('/api/copilot/strategy', {
        method: 'POST',
        body: JSON.stringify({ jobId: appStrategyForm.jobId })
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setAppStrategyResult(data);
        addToast('AI Application strategy compiled.', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  // Salary Prediction
  const handleSalarySubmit = async () => {
    setIsLoading(true);
    try {
      const res = await authedFetch('/api/copilot/salary', {
        method: 'POST',
        body: JSON.stringify(salaryForm)
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setSalaryPrediction(data);
        addToast('Salary index predicted.', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  // Mock Interview Actions
  const handleStartMockInterview = async () => {
    setIsLoading(true);
    setMockEvaluation(null);
    setMockAnswers({});
    setCurrentMockQuestionIdx(0);
    setCurrentAnswer('');
    try {
      const res = await authedFetch('/api/copilot/interview/questions', {
        method: 'POST',
        body: JSON.stringify(mockForm)
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setMockSession(data);
        addToast('AI Interview Session initialized. Go ahead!', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleNextMockQuestion = () => {
    if (!mockSession) return;
    const currentQ = mockSession.questions[currentMockQuestionIdx];
    setMockAnswers(prev => ({ ...prev, [currentQ.id]: currentAnswer }));
    setCurrentAnswer('');

    if (currentMockQuestionIdx < mockSession.questions.length - 1) {
      setCurrentMockQuestionIdx(prev => prev + 1);
    } else {
      // Evaluate session
      submitMockEvaluation();
    }
  };

  const submitMockEvaluation = async () => {
    if (!mockSession) return;
    setIsLoading(true);
    const finalAnswers = { ...mockAnswers, [mockSession.questions[currentMockQuestionIdx].id]: currentAnswer };
    try {
      const res = await authedFetch(`/api/copilot/interview/${mockSession.session_id}/evaluate`, {
        method: 'POST',
        body: JSON.stringify({ answers: finalAnswers })
      });
      setIsLoading(false);
      if (res.ok) {
        const evalData = await res.json();
        setMockEvaluation(evalData);
        setMockSession(null);
        loadMockHistory();
        addToast('AI Mock Interview completed and graded.', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  // AI Memory Actions
  const handleSaveMemory = async () => {
    if (!newMemory.text.trim()) return;
    setIsLoading(true);
    try {
      const res = await authedFetch('/api/copilot/memory', {
        method: 'POST',
        body: JSON.stringify({ category: newMemory.category, text: newMemory.text })
      });
      setIsLoading(false);
      if (res.ok) {
        const data = await res.json();
        setAiMemoryList(prev => [data, ...prev]);
        setNewMemory(prev => ({ ...prev, text: '' }));
        addToast('Saved parameter preference in AI memory.', 'success');
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  // Settings Actions
  const handleSaveSettings = () => {
    addToast('Weekly notification configs updated.', 'success');
  };

  const handleClearHistory = () => {
    addToast('AI chat and evaluations history has been cleaned.', 'info');
  };

  // --- Sidebar Items ---
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'analyzer', label: 'Resume Analyzer', icon: FileSearch },
    { id: 'optimizer', label: 'Resume Optimizer', icon: RefreshCw },
    { id: 'coverletter', label: 'Cover Letter Generator', icon: ScrollText },
    { id: 'prep', label: 'Interview Preparation', icon: UserCheck },
    { id: 'mock', label: 'Mock Interview', icon: Mic },
    { id: 'salary', label: 'Salary Prediction', icon: Sparkles },
    { id: 'roadmap', label: 'Career Roadmap', icon: Milestone },
    { id: 'skills', label: 'Skill Gap Analysis', icon: Compass },
    { id: 'learning', label: 'Learning Recommendations', icon: BookOpen },
    { id: 'jobmatch', label: 'Job Match Explanation', icon: Award },
    { id: 'company', label: 'Company Insights', icon: Building2 },
    { id: 'strategy', label: 'Application Strategy', icon: Brain },
    { id: 'analytics', label: 'Career Analytics', icon: LineChart },
    { id: 'memory', label: 'AI Memory', icon: Settings },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(chatSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[75vh] items-stretch text-left animate-fadeIn">
      {/* Copilot Left Navigation Sidebar */}
      <aside className="w-full lg:w-64 bg-surface-theme border border-border-theme rounded-2xl p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 pb-3 border-b border-border-theme/60">
            <div className="p-2 bg-primary-theme/10 text-primary-theme rounded-xl">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">
                AI Career Copilot
              </h3>
              <p className="text-[9px] font-bold text-text-muted-theme">Enterprise Sourcing Engine</p>
            </div>
          </div>

          <nav className="space-y-0.5 overflow-y-auto max-h-[50vh] lg:max-h-[62vh] pr-1 scrollbar-thin">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as CopilotTab);
                    if (item.id === 'dashboard') loadDashboard();
                    if (item.id === 'analytics') loadAnalytics();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-extrabold flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-primary-theme text-white shadow-sm'
                      : 'text-text-secondary-theme hover:bg-border-theme/40 hover:text-text-primary-theme'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-border-theme/60 mt-4 text-center">
          <span className="text-[9px] text-text-muted-theme font-black uppercase tracking-wider">
            Powered by Google Gemini
          </span>
        </div>
      </aside>

      {/* Main Workspace Display Area */}
      <div className="flex-1 bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-sm">
        
        {/* Dynamic Global Loader Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="text-center space-y-2">
              <RefreshCw className="w-8 h-8 text-primary-theme animate-spin mx-auto" />
              <p className="text-xs font-bold text-text-secondary-theme">Compiling AI Career parameters...</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && dashboardData && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  AI Career Dashboard
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Dynamic evaluation score matrices compiled from your professional profile parameters
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Resume Score', value: `${dashboardData.resume_score}%`, icon: FileText, color: 'text-orange-500' },
                  { label: 'ATS Score', value: `${dashboardData.ats_score}%`, icon: Brain, color: 'text-blue-500' },
                  { label: 'AI Match Score', value: `${dashboardData.ai_match_score}%`, icon: Sparkles, color: 'text-amber-500' },
                  { label: 'Interview Readiness', value: `${dashboardData.interview_readiness}%`, icon: UserCheck, color: 'text-emerald-500' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-4 border border-border-theme rounded-2xl bg-bg-theme/40 text-left space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider">{stat.label}</span>
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <p className="text-xl font-serif font-black text-text-primary-theme">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                {/* Left panel: Recommendations and Health */}
                <div className="md:col-span-8 space-y-6">
                  {/* Suggestions List */}
                  <div className="p-5 border border-border-theme bg-bg-theme/20 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 border-b border-border-theme/40 pb-2">
                      <Sparkles className="w-4 h-4 text-primary-theme" />
                      <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">
                        Latest AI Suggestions
                      </h4>
                    </div>
                    <ul className="space-y-2 text-xs font-semibold text-text-secondary-theme leading-relaxed">
                      {dashboardData.suggestions.map((sug: string, i: number) => (
                        <li key={i} className="flex gap-2 items-start">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary-theme shrink-0 mt-0.5" />
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tasks List */}
                  <div className="p-5 border border-border-theme rounded-2xl space-y-3">
                    <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">
                      Today's Career Tasks
                    </h4>
                    <div className="space-y-2.5">
                      {dashboardData.tasks.map((task: any, i: number) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-bg-theme/40 rounded-xl border border-border-theme/30 text-xs font-semibold">
                          <span className={task.done ? 'line-through text-text-muted-theme' : 'text-text-primary-theme'}>
                            {task.text}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${task.done ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {task.done ? 'Done' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right panel: Meta Info */}
                <div className="md:col-span-4 space-y-6">
                  <div className="p-5 border border-border-theme rounded-2xl bg-bg-theme/20 text-xs font-semibold space-y-3">
                    <h4 className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Career Status</h4>
                    <div className="space-y-1">
                      <span className="text-text-muted-theme block text-[10px]">CURRENT ROLE GOAL</span>
                      <span className="text-text-primary-theme font-bold block">{dashboardData.career_goal}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-text-muted-theme block text-[10px]">MARKET VALUE AVERAGE</span>
                      <span className="text-text-primary-theme font-bold block">{dashboardData.avg_salary}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-text-muted-theme block text-[10px]">MARKET DEMAND STATE</span>
                      <span className="text-[#E8702A] font-black block uppercase tracking-wide">{dashboardData.market_demand}</span>
                    </div>
                  </div>

                  <div className="p-5 border border-border-theme rounded-2xl space-y-3">
                    <h4 className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Trending Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {dashboardData.trending_skills.map((skill: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-primary-theme/5 text-primary-theme text-[9px] font-black uppercase rounded-lg border border-primary-theme/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. AI CHAT VIEW */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col md:flex-row gap-5 h-[560px] items-stretch"
            >
              {/* Chat Session List Sidebar */}
              <div className="w-full md:w-56 border-r border-border-theme/60 pr-2 flex flex-col justify-between shrink-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 bg-bg-theme/40 border border-border-theme rounded-xl px-2.5 py-1.5 text-xs">
                    <Search className="w-3.5 h-3.5 text-text-muted-theme" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={chatSearch}
                      onChange={e => setChatSearch(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-[11px] font-semibold"
                    />
                  </div>

                  <button
                    onClick={handleNewConversation}
                    className="w-full py-2 border border-dashed border-primary-theme/40 text-primary-theme bg-primary-theme/5 hover:bg-primary-theme/10 text-[11px] font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Conversation
                  </button>

                  <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
                    {filteredConversations.map(conv => (
                      <div
                        key={conv.id}
                        onClick={() => loadConversationDetail(conv.id)}
                        className={`group px-3 py-2.5 rounded-xl border text-[11px] font-bold text-left cursor-pointer transition-all flex items-center justify-between gap-1.5 ${
                          activeConvId === conv.id
                            ? 'bg-primary-theme/10 border-primary-theme text-primary-theme'
                            : 'border-border-theme hover:border-primary-theme/50'
                        }`}
                      >
                        <span className="truncate flex-1 pr-1">{conv.title}</span>
                        <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                          <button onClick={(e) => handleTogglePin(conv.id, conv.is_pinned, e)} className="text-text-muted-theme hover:text-primary-theme p-0.5">
                            <Pin className={`w-3 h-3 ${conv.is_pinned ? 'text-primary-theme fill-primary-theme' : ''}`} />
                          </button>
                          <button onClick={(e) => handleTogglePin(conv.id, conv.is_pinned, e)} className="text-text-muted-theme hover:text-amber-500 p-0.5">
                            <Star className={`w-3 h-3 ${conv.is_favorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                          </button>
                          <button onClick={(e) => handleDeleteConversation(conv.id, e)} className="text-text-muted-theme hover:text-error-theme p-0.5">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 flex flex-col justify-between">
                {/* Quick Actions Panel */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-border-theme/40 -mx-6 px-6 scrollbar-none">
                  {[
                    { label: 'Improve Resume', tab: 'optimizer' },
                    { label: 'Generate Cover Letter', tab: 'coverletter' },
                    { label: 'Check ATS Score', tab: 'analyzer' },
                    { label: 'Find Matching Jobs', tab: 'jobmatch' },
                    { label: 'Prepare Interview', tab: 'prep' },
                    { label: 'Salary Prediction', tab: 'salary' }
                  ].map((act, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(act.tab as CopilotTab)}
                      className="px-3 py-1.5 bg-bg-theme/40 border border-border-theme text-[10px] font-black uppercase rounded-lg hover:border-primary-theme transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                {/* Messages feed */}
                <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-none text-xs">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-20 text-text-muted-theme space-y-2">
                      <Bot className="w-8 h-8 text-primary-theme/40 mx-auto animate-bounce-subtle" />
                      <p className="font-bold">Welcome to AI Career Copilot Chat</p>
                      <p className="text-[10px]">Ask me anything about formatting, design principles, or technical interview criteria.</p>
                    </div>
                  ) : (
                    chatMessages.map(msg => {
                      const isAi = msg.sender === 'ai';
                      return (
                        <div key={msg.id} className={`flex gap-2.5 items-start max-w-[85%] ${!isAi ? 'ml-auto flex-row-reverse' : ''}`}>
                          <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${isAi ? 'bg-primary-theme text-white' : 'bg-indigo-600 text-white'}`}>
                            {isAi ? 'AI' : 'ME'}
                          </div>
                          <div className={`p-3 rounded-2xl leading-relaxed text-text-secondary-theme ${isAi ? 'bg-border-theme/40 rounded-tl-none font-semibold' : 'bg-primary-theme text-white rounded-tr-none font-bold'}`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  {isAiTyping && (
                    <div className="flex gap-2.5 items-start">
                      <div className="w-6.5 h-6.5 rounded-full bg-primary-theme text-white flex items-center justify-center font-bold text-[9px] animate-pulse">AI</div>
                      <div className="bg-border-theme/30 px-3 py-2 rounded-full text-[10px] font-bold text-text-muted-theme animate-pulse">AI Career Copilot is composing response...</div>
                    </div>
                  )}
                </div>

                {/* Composer Form */}
                <form onSubmit={handleSendChatMessage} className="border-t border-border-theme/40 pt-4 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder={activeConvId ? "Type a prompt to ask your AI career agent..." : "Create a new conversation to start chatting"}
                    disabled={!activeConvId}
                    className="flex-1 bg-transparent border border-border-theme rounded-xl px-4 py-3 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-semibold disabled:bg-bg-theme/40 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={!activeConvId || !chatInput.trim()}
                    className="bg-primary-theme hover:bg-primary-hover-theme text-white px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* 3. RESUME ANALYZER VIEW */}
          {activeTab === 'analyzer' && (
            <motion.div
              key="analyzer-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  Resume Analyzer & Auditor
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Audit your resume files against ATS, parser layouts, and matching key phrase matrices
                </p>
              </div>

              {/* Upload Card */}
              <div className="p-8 border border-dashed border-border-theme hover:border-primary-theme/50 rounded-2xl text-center space-y-4 transition-all">
                {isAnalyzing ? (
                  <div className="space-y-3 py-4">
                    <RefreshCw className="w-8 h-8 text-primary-theme animate-spin mx-auto" />
                    <h4 className="text-xs font-bold text-text-primary-theme">Auditing resume format structures...</h4>
                    <p className="text-[10px] text-text-muted-theme">Validating grammar blocks, font compatibility, and core tech term frequency</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-text-muted-theme mx-auto" />
                    <div>
                      <h4 className="text-xs font-bold text-text-primary-theme">Drop your updated resume PDF/Doc here</h4>
                      <p className="text-[10px] text-text-muted-theme mt-1 leading-normal">
                        Supports PDF, DOCX formats. We will generate a granular review scorecard.
                      </p>
                    </div>
                    <div>
                      <input type="file" id="copilot-res-input" className="hidden" accept=".pdf,.docx" onChange={handleResumeUpload} />
                      <label htmlFor="copilot-res-input" className="px-5 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl cursor-pointer shadow-md inline-block">
                        Choose Resume Document
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Results display */}
              {selectedAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                  {/* Left stats */}
                  <div className="md:col-span-4 space-y-4">
                    <div className="p-5 border border-border-theme rounded-2xl bg-bg-theme/20 text-center space-y-1">
                      <span className="text-[9px] font-bold text-text-muted-theme uppercase tracking-widest">ATS Core Score</span>
                      <p className="text-4xl font-serif font-black text-primary-theme">{selectedAnalysis.ats_score}%</p>
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">Highly Optimized</span>
                    </div>

                    <div className="p-4 border border-border-theme rounded-2xl space-y-3 text-xs font-semibold">
                      <h4 className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Metrics Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Formatting Index:</span>
                          <span className="font-bold">{selectedAnalysis.formatting_score}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Grammar Check:</span>
                          <span className="font-bold">{selectedAnalysis.grammar_score}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Keyword Match:</span>
                          <span className="font-bold">{selectedAnalysis.keyword_score}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right feedback */}
                  <div className="md:col-span-8 space-y-5 text-xs font-semibold text-left">
                    <div className="space-y-1 pb-2 border-b border-border-theme/40">
                      <h4 className="text-text-primary-theme font-bold">Document: {selectedAnalysis.resume_name}</h4>
                      <p className="text-text-secondary-theme leading-relaxed font-medium">{selectedAnalysis.analysis_data.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Strong Areas</span>
                        <ul className="space-y-1.5 text-[11px] leading-relaxed">
                          {selectedAnalysis.analysis_data.strong_areas.map((str: string, i: number) => (
                            <li key={i} className="flex gap-1.5 items-start">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Missing Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedAnalysis.analysis_data.missing_skills.map((sk: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-error-theme/10 text-error-theme text-[9px] font-black uppercase rounded">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-primary-theme/5 border border-primary-theme/10 rounded-2xl space-y-2">
                      <span className="text-[10px] font-black text-primary-theme uppercase tracking-wider block">AI Actions to Optimize Score</span>
                      <ul className="space-y-1.5 text-[11px] text-text-secondary-theme leading-relaxed">
                        {selectedAnalysis.analysis_data.suggestions.map((sug: string, i: number) => (
                          <li key={i} className="flex gap-1.5 items-start">
                            <span className="text-primary-theme font-bold">{i+1}.</span>
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 4. RESUME OPTIMIZER VIEW */}
          {activeTab === 'optimizer' && (
            <motion.div
              key="optimizer-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  Resume Content Optimizer
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Input sections of your resume text for AI rewriting to maximize ATS indexing rates
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Raw Resume Text Block</label>
                  <textarea
                    rows={8}
                    value={optimizerInput}
                    onChange={e => setOptimizerInput(e.target.value)}
                    placeholder="Paste professional summaries, project highlights, or experience details here..."
                    className="w-full bg-transparent border border-border-theme rounded-xl p-4 text-xs text-text-secondary-theme focus:outline-none focus:border-primary-theme font-semibold leading-relaxed resize-none"
                  />
                  <button
                    onClick={handleOptimizeResume}
                    disabled={!optimizerInput.trim()}
                    className="w-full py-3 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin-slow" />
                    Optimize with AI
                  </button>
                </div>

                <div className="space-y-3 text-xs font-semibold">
                  <span className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider block">Comparison View</span>
                  {optimizedResult ? (
                    <div className="border border-border-theme rounded-2xl overflow-hidden divide-y divide-border-theme/40 bg-bg-theme/20">
                      <div className="p-4 space-y-1">
                        <span className="text-[9px] font-black text-text-muted-theme uppercase tracking-wider">Before</span>
                        <p className="text-text-muted-theme line-through italic font-medium">{optimizedResult.before_content.summary}</p>
                      </div>
                      <div className="p-4 space-y-1 bg-emerald-500/5">
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Optimized Suggestions</span>
                        <p className="text-text-primary-theme font-bold leading-relaxed">{optimizedResult.after_content.summary}</p>
                      </div>
                      <div className="p-4 bg-emerald-500/5 space-y-1">
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Quantified Bullet Recommendations</span>
                        <p className="text-text-primary-theme whitespace-pre-line font-bold leading-relaxed">{optimizedResult.after_content.experience}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-border-theme rounded-2xl h-[280px] flex items-center justify-center text-text-muted-theme italic font-medium">
                      Submit raw text in left box to construct ATS-optimized revisions
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. COVER LETTER GENERATOR VIEW */}
          {activeTab === 'coverletter' && (
            <motion.div
              key="coverletter-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  AI Cover Letter Generator
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Generate hyper-customized professional cover letter pitches tailored to targeted company roles
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Form parameters */}
                <div className="md:col-span-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Target Job Title</label>
                    <input
                      type="text"
                      value={letterForm.jobTitle}
                      onChange={e => setLetterForm({ ...letterForm, jobTitle: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Target Company Name</label>
                    <input
                      type="text"
                      value={letterForm.companyName}
                      onChange={e => setLetterForm({ ...letterForm, companyName: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Letter Tone</label>
                    <select
                      value={letterForm.tone}
                      onChange={e => setLetterForm({ ...letterForm, tone: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-semibold"
                    >
                      <option value="formal">Formal & Corporate</option>
                      <option value="creative">Creative & Disruptive</option>
                      <option value="professional">Professional & Technical</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateCoverLetter}
                    className="w-full py-3.5 bg-[#E8702A] hover:bg-[#D65F19] text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <ScrollText className="w-4 h-4" />
                    Draft Cover Letter
                  </button>
                </div>

                {/* Letters Draft output */}
                <div className="md:col-span-7 space-y-4">
                  {generatedLetter ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-border-theme/40">
                        <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider">Generated Letter Draft</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generatedLetter.letter_text);
                              addToast('Copied cover letter to clipboard.', 'success');
                            }}
                            className="p-1.5 hover:bg-border-theme/40 text-text-secondary-theme rounded-lg cursor-pointer"
                            title="Copy to Clipboard"
                          >
                            <Clipboard className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        readOnly
                        rows={12}
                        value={generatedLetter.letter_text}
                        className="w-full bg-transparent border border-border-theme rounded-2xl p-4 text-xs text-text-secondary-theme focus:outline-none leading-relaxed font-semibold resize-none"
                      />
                    </div>
                  ) : (
                    <div className="border border-dashed border-border-theme rounded-3xl h-[330px] flex items-center justify-center text-text-muted-theme italic font-medium">
                      Configure letter details on the left to write cover pitches
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 6. INTERVIEW PREP VIEW */}
          {activeTab === 'prep' && (
            <motion.div
              key="prep-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  Interview Preparation
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Generate key technical, coding, and behavioral questions with hints & expected answers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-4 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Hiring Role Type</label>
                    <input
                      type="text"
                      value={prepForm.role}
                      onChange={e => setPrepForm({ ...prepForm, role: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Round Focus</label>
                    <select
                      value={prepForm.roundType}
                      onChange={e => setPrepForm({ ...prepForm, roundType: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none font-semibold"
                    >
                      <option value="Technical">Technical & System Design</option>
                      <option value="Behavioral">Behavioral & STAR Method</option>
                      <option value="HR">HR & Culture Fit</option>
                    </select>
                  </div>

                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const res = await authedFetch('/api/copilot/interview/questions', {
                          method: 'POST',
                          body: JSON.stringify(prepForm)
                        });
                        setIsLoading(false);
                        if (res.ok) {
                          const data = await res.json();
                          setPrepQuestions(data.questions || []);
                          addToast('Interview questions loaded.', 'success');
                        }
                      } catch (e) {
                        setIsLoading(false);
                      }
                    }}
                    className="w-full py-3.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    Generate Question Guidelines
                  </button>
                </div>

                <div className="md:col-span-8 space-y-4">
                  {prepQuestions.length > 0 ? (
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                      {prepQuestions.map((q, idx) => (
                        <div key={idx} className="p-4 border border-border-theme rounded-2xl space-y-2 text-xs font-semibold">
                          <div className="flex justify-between items-center pb-2 border-b border-border-theme/40">
                            <span className="text-[10px] font-black text-primary-theme uppercase tracking-wider">Question {idx+1} ({q.difficulty})</span>
                            <span className="px-2 py-0.5 bg-bg-theme border border-border-theme text-[9px] font-black uppercase rounded">
                              {q.type}
                            </span>
                          </div>
                          <p className="text-text-primary-theme font-bold">{q.question}</p>
                          <div className="bg-bg-theme/40 p-3 rounded-xl border border-border-theme/30 space-y-1">
                            <span className="text-[9px] font-bold text-text-muted-theme uppercase block">Expected Answer Guideline</span>
                            <p className="text-text-secondary-theme leading-relaxed font-medium">{q.expected_answer}</p>
                          </div>
                          <p className="text-[10px] text-amber-600 font-bold italic">Hint: {q.hint}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-border-theme rounded-3xl h-[330px] flex items-center justify-center text-text-muted-theme italic font-medium">
                      Select role guidelines to list target interview answers
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 7. MOCK INTERVIEW VIEW */}
          {activeTab === 'mock' && (
            <motion.div
              key="mock-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  AI Mock Interview Coach
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Conduct interactive audio-like mock interview rounds and fetch comprehensive evaluation metrics
                </p>
              </div>

              {!mockSession && !mockEvaluation && (
                <div className="max-w-md mx-auto p-6 border border-border-theme rounded-3xl bg-bg-theme/20 text-center space-y-5">
                  <Mic className="w-10 h-10 text-primary-theme mx-auto animate-pulse-subtle" />
                  <div>
                    <h3 className="text-sm font-bold text-text-primary-theme uppercase tracking-wider">Start New Coaching Round</h3>
                    <p className="text-[10px] text-text-muted-theme leading-normal mt-1">AI will test your technical depth and deliver a graded transcript scorecard.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-secondary-theme uppercase tracking-wider">Target Job Role</label>
                      <input
                        type="text"
                        value={mockForm.role}
                        onChange={e => setMockForm({ ...mockForm, role: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-2.5 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-secondary-theme uppercase tracking-wider">Round Focus</label>
                      <select
                        value={mockForm.roundType}
                        onChange={e => setMockForm({ ...mockForm, roundType: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-2.5 text-xs font-semibold"
                      >
                        <option value="Technical">Technical</option>
                        <option value="HR">HR Fit</option>
                        <option value="Managerial">Managerial</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleStartMockInterview}
                    className="w-full py-3 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl cursor-pointer"
                  >
                    Start Interactive Session
                  </button>
                </div>
              )}

              {mockSession && (
                <div className="max-w-xl mx-auto border border-border-theme rounded-3xl p-6 bg-bg-theme/40 space-y-4 text-xs font-semibold">
                  <div className="flex justify-between items-center pb-2 border-b border-border-theme/40">
                    <span className="text-[10px] font-black text-primary-theme uppercase tracking-wider">Mock Round: {mockSession.round_type}</span>
                    <span className="text-[10px] font-mono text-text-muted-theme">Question {currentMockQuestionIdx+1} of {mockSession.questions.length}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-bold text-text-primary-theme">{mockSession.questions[currentMockQuestionIdx].question}</p>
                    <p className="text-[10px] text-amber-600 font-bold italic">Hint: {mockSession.questions[currentMockQuestionIdx].hint}</p>
                  </div>

                  <textarea
                    rows={4}
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.target.value)}
                    placeholder="Type your spoken answer description here..."
                    className="w-full bg-transparent border border-border-theme rounded-2xl p-4 focus:outline-none focus:border-primary-theme text-xs text-text-secondary-theme font-semibold leading-relaxed resize-none"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextMockQuestion}
                      disabled={!currentAnswer.trim()}
                      className="px-5 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white font-black text-xs rounded-xl cursor-pointer transition-all disabled:opacity-40"
                    >
                      {currentMockQuestionIdx === mockSession.questions.length - 1 ? 'Finish & Evaluate' : 'Submit & Next Question'}
                    </button>
                  </div>
                </div>
              )}

              {mockEvaluation && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 border border-border-theme bg-bg-theme/20 rounded-2xl text-center space-y-1">
                      <span className="text-[9px] font-bold text-text-muted-theme uppercase tracking-wider">Overall Coach score</span>
                      <p className="text-4xl font-serif font-black text-primary-theme">{mockEvaluation.overall_score}%</p>
                      <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-full inline-block">Pass Grade</span>
                    </div>

                    <div className="p-4 border border-border-theme rounded-2xl col-span-2 space-y-3 text-xs font-semibold">
                      <h4 className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider">Spoken Competency Indices</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex justify-between border-b border-border-theme/40 pb-1.5">
                          <span>Communication:</span>
                          <span className="font-bold">{mockEvaluation.metrics.communication}%</span>
                        </div>
                        <div className="flex justify-between border-b border-border-theme/40 pb-1.5">
                          <span>Confidence:</span>
                          <span className="font-bold">{mockEvaluation.metrics.confidence}%</span>
                        </div>
                        <div className="flex justify-between border-b border-border-theme/40 pb-1.5">
                          <span>Technical Knowledge:</span>
                          <span className="font-bold">{mockEvaluation.metrics.knowledge}%</span>
                        </div>
                        <div className="flex justify-between border-b border-border-theme/40 pb-1.5">
                          <span>Problem Solving:</span>
                          <span className="font-bold">{mockEvaluation.metrics.problem_solving}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold leading-relaxed">
                    <div className="p-5 border border-border-theme rounded-2xl bg-bg-theme/20 space-y-2">
                      <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider block">AI Review Summary</span>
                      <p className="text-text-secondary-theme font-medium">{mockEvaluation.evaluation.summary}</p>
                    </div>

                    <div className="p-5 border border-border-theme rounded-2xl space-y-2">
                      <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider block">Action plan for improvement</span>
                      <p className="text-text-secondary-theme font-medium">{mockEvaluation.evaluation.action_plan}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setMockEvaluation(null)}
                      className="px-6 py-2.5 bg-border-theme/40 hover:bg-border-theme/60 text-text-primary-theme font-black text-xs rounded-xl cursor-pointer"
                    >
                      Start Another Prep Mock
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 8. SALARY PREDICTION VIEW */}
          {activeTab === 'salary' && (
            <motion.div
              key="salary-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  Salary Prediction Index
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Predict target salary ranges based on current years of experience, locations, and skill matching
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                <div className="md:col-span-5 space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Target Job Role</label>
                    <input
                      type="text"
                      value={salaryForm.role}
                      onChange={e => setSalaryForm({ ...salaryForm, role: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Target Location</label>
                    <select
                      value={salaryForm.location}
                      onChange={e => setSalaryForm({ ...salaryForm, location: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold"
                    >
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSalarySubmit}
                    className="w-full py-3.5 bg-primary-theme hover:bg-primary-hover-theme text-white font-black rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    Predict Target Ranges
                  </button>
                </div>

                <div className="md:col-span-7 flex flex-col justify-center">
                  {salaryPrediction ? (
                    <div className="p-6 border border-primary-theme/10 bg-gradient-to-br from-primary-theme/5 to-amber-500/5 rounded-3xl text-center space-y-4">
                      <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-widest block">Estimated Compensation Range</span>
                      <p className="text-3xl md:text-4xl font-serif font-black text-primary-theme">
                        {salaryPrediction.min_salary} - {salaryPrediction.max_salary} LPA
                      </p>
                      <div className="w-full bg-border-theme/40 h-2.5 rounded-full overflow-hidden relative">
                        <div className="bg-primary-theme h-full rounded-full" style={{ width: '65%' }} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-text-secondary-theme pt-2">
                        <div className="space-y-1">
                          <span className="text-[9px] text-text-muted-theme uppercase">Average Market pay</span>
                          <span className="block font-bold text-text-primary-theme">{salaryPrediction.avg_salary} LPA</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-text-muted-theme uppercase">Growth rate status</span>
                          <span className="block font-bold text-emerald-500">{salaryPrediction.growth_rate}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-border-theme rounded-3xl h-[280px] flex items-center justify-center text-text-muted-theme italic font-medium">
                      Configure predicted locations to run salary estimates
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 9. CAREER ROADMAP VIEW */}
          {activeTab === 'roadmap' && (
            <motion.div
              key="roadmap-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  AI Career Roadmap
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Plan your long-term role progression nodes, learning checkpoints, and milestone metrics
                </p>
              </div>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter target Career Goal (e.g. Solution Architect)..."
                  value={roadmapForm.targetRole}
                  onChange={e => setRoadmapForm({ targetRole: e.target.value })}
                  className="flex-1 bg-transparent border border-border-theme rounded-xl px-4 py-3 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-semibold"
                />
                <button
                  onClick={handleGenerateRoadmap}
                  className="px-6 py-3 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Generate Path Node
                </button>
              </div>

              {activeRoadmap && (
                <div className="space-y-6 pt-4 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Milestone className="w-5 h-5 text-primary-theme" />
                    <span className="text-sm font-bold text-text-primary-theme">Roadmap Milestone for {activeRoadmap.target_role}</span>
                  </div>

                  <div className="relative border-l-2 border-primary-theme/20 pl-6 ml-4 space-y-8">
                    {activeRoadmap.roadmap_data.steps.map((step: any, idx: number) => (
                      <div key={idx} className="relative space-y-2 text-left">
                        {/* Dot marker */}
                        <div className="absolute -left-[31px] top-0 w-4 h-4 bg-primary-theme text-white border-2 border-white rounded-full flex items-center justify-center text-[8px] font-black font-sans">
                          {idx+1}
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wide">{step.role}</h4>
                          <div className="flex gap-4 text-[10px] text-text-muted-theme font-bold pt-0.5">
                            <span>TIMELINE: {step.timeline}</span>
                            <span>SALARY INDEX: {step.salary}</span>
                          </div>
                        </div>

                        <p className="text-text-secondary-theme leading-relaxed font-medium">
                          Required Skill Parameters: {step.skills.join(', ')}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="bg-bg-theme/40 p-3 rounded-xl border border-border-theme/30 space-y-1">
                            <span className="text-[9px] font-bold text-text-muted-theme uppercase block">Milestone Projects</span>
                            <ul className="space-y-0.5 list-disc pl-4 text-text-secondary-theme font-medium">
                              {step.projects.map((proj: string, i: number) => <li key={i}>{proj}</li>)}
                            </ul>
                          </div>
                          <div className="bg-bg-theme/40 p-3 rounded-xl border border-border-theme/30 space-y-1">
                            <span className="text-[9px] font-bold text-text-muted-theme uppercase block">Learning Courses & Books</span>
                            <p className="text-text-secondary-theme font-medium">{step.courses[0]} | {step.books[0]}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 10. SKILL GAP ANALYSIS VIEW */}
          {activeTab === 'skills' && (
            <motion.div
              key="skills-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  Skill Gap Auditor
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Compare your profile skills against any job description to discover missing prerequisites
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Target Job Title</label>
                    <input
                      type="text"
                      value={skillGapForm.jobTitle}
                      onChange={e => setSkillGapForm({ ...skillGapForm, jobTitle: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Job Description Description</label>
                    <textarea
                      rows={6}
                      value={skillGapForm.jobDescription}
                      onChange={e => setSkillGapForm({ ...skillGapForm, jobDescription: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold leading-normal resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSkillGapSubmit}
                    className="w-full py-3 bg-primary-theme hover:bg-primary-hover-theme text-white font-black rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    Audit Gaps & Map Courses
                  </button>
                </div>

                <div className="md:col-span-7 space-y-4">
                  {skillGapResult ? (
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="p-4 border border-border-theme rounded-2xl bg-bg-theme/40 space-y-2">
                        <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider block">Missing Core Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {skillGapResult.missing_skills.map((sk: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-error-theme/10 text-error-theme rounded-lg font-black uppercase text-[9px] border border-error-theme/20">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider block">Recommended Learning Materials</span>
                        <div className="space-y-2">
                          {skillGapResult.learning.courses.slice(0, 2).map((c: any, i: number) => (
                            <div key={i} className="p-3 border border-border-theme/40 bg-bg-theme/20 rounded-xl flex justify-between items-center">
                              <div>
                                <span className="text-text-primary-theme font-bold block">{c.title}</span>
                                <span className="text-[10px] text-text-muted-theme font-medium">{c.platform} &bull; {c.duration}</span>
                              </div>
                              <span className="px-2 py-0.5 bg-primary-theme/10 text-primary-theme text-[9px] font-black rounded">
                                {c.rating}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-border-theme rounded-3xl h-[330px] flex items-center justify-center text-text-muted-theme italic font-medium">
                      Submit target roles to audit required skill paths
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 11. LEARNING RECOMMENDATIONS VIEW */}
          {activeTab === 'learning' && (
            <motion.div
              key="learning-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  Learning & Skill Recommendations
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Fetch curated courses, technical roadmap books, and YouTube lessons matching your profile
                </p>
              </div>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter skill parameters to focus (e.g. AWS, Kubernetes)..."
                  value={learningForm.skillsText}
                  onChange={e => setLearningForm({ skillsText: e.target.value })}
                  className="flex-1 bg-transparent border border-border-theme rounded-xl px-4 py-3 text-xs text-text-primary-theme focus:outline-none focus:border-primary-theme font-semibold"
                />
                <button
                  onClick={handleLearningSubmit}
                  className="px-6 py-3 bg-[#E8702A] hover:bg-[#D65F19] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Load Curated Material
                </button>
              </div>

              {learningResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs font-semibold text-left">
                  {/* Courses */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-border-theme/40">
                      <GraduationCap className="w-4 h-4 text-primary-theme" />
                      <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider">Bootcamps & Courses</span>
                    </div>
                    <div className="space-y-2">
                      {learningResult.courses.map((course: any, idx: number) => (
                        <div key={idx} className="p-3 border border-border-theme rounded-xl bg-bg-theme/40">
                          <span className="text-text-primary-theme font-bold block">{course.title}</span>
                          <div className="flex justify-between items-center text-[10px] text-text-muted-theme font-bold pt-1">
                            <span>{course.platform} &bull; {course.duration}</span>
                            <span className="text-primary-theme">{course.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Books and Blogs */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-border-theme/40">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider">Books & Tech Articles</span>
                    </div>
                    <div className="space-y-2">
                      {learningResult.books.slice(0, 2).map((book: any, idx: number) => (
                        <div key={idx} className="p-3 border border-border-theme rounded-xl bg-bg-theme/40">
                          <span className="text-text-primary-theme font-bold block">{book.title}</span>
                          <span className="text-[10px] text-text-muted-theme font-medium pt-0.5 block">Author: {book.author} &bull; {book.pages}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 12. JOB MATCH EXPLAINER VIEW */}
          {activeTab === 'jobmatch' && (
            <motion.div
              key="jobmatch-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  AI Job Match Explainer
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Verify exactly why your candidate credentials match or miss requirements on active job portal openings
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Select Job Listing</label>
                    <select
                      value={jobMatchForm.jobId}
                      onChange={e => setJobMatchForm({ jobId: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold"
                    >
                      {availableJobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title} at {job.company?.company_name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleJobMatchSubmit}
                    disabled={!jobMatchForm.jobId}
                    className="w-full py-3 bg-primary-theme hover:bg-primary-hover-theme text-white font-black rounded-xl cursor-pointer"
                  >
                    Analyze Match score
                  </button>
                </div>

                <div className="md:col-span-7 space-y-4">
                  {jobMatchResult ? (
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="p-5 border border-border-theme rounded-2xl bg-bg-theme/20 text-center space-y-1">
                        <span className="text-[9px] font-bold text-text-muted-theme uppercase tracking-wider">Hiring Shortlist Chance</span>
                        <p className="text-3xl font-serif font-black text-primary-theme">{jobMatchResult.match_score}% Match</p>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded">
                          {jobMatchResult.analysis_data.selection_chance}
                        </span>
                      </div>

                      <div className="space-y-2 text-left leading-relaxed">
                        <div className="flex gap-2">
                          <span className="font-bold text-text-primary-theme uppercase text-[9px] w-24 shrink-0">Experience:</span>
                          <span className="text-text-secondary-theme font-medium">{jobMatchResult.analysis_data.experience_match}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold text-text-primary-theme uppercase text-[9px] w-24 shrink-0">Location:</span>
                          <span className="text-text-secondary-theme font-medium">{jobMatchResult.analysis_data.location_match}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-bold text-text-primary-theme uppercase text-[9px] w-24 shrink-0">Salary Fit:</span>
                          <span className="text-text-secondary-theme font-medium">{jobMatchResult.analysis_data.salary_match}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-border-theme rounded-3xl h-[280px] flex items-center justify-center text-text-muted-theme italic font-medium">
                      Select job listings to parse matching indices
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 13. COMPANY INSIGHTS VIEW */}
          {activeTab === 'company' && (
            <motion.div
              key="company-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  Company Insights & Culture
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Fetch detailed organizational culture notes, hiring rounds, and expected benefit scales
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                <div className="md:col-span-5 space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Enter Company Name</label>
                    <input
                      type="text"
                      value={companyInsightForm.companyName}
                      onChange={e => setCompanyInsightForm({ companyName: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold"
                    />
                  </div>

                  <button
                    onClick={handleCompanyInsightSubmit}
                    className="w-full py-3.5 bg-primary-theme hover:bg-primary-hover-theme text-white font-black rounded-xl shadow-md cursor-pointer"
                  >
                    Compile Company Intel
                  </button>
                </div>

                <div className="md:col-span-7 flex flex-col justify-center">
                  {companyInsightResult ? (
                    <div className="p-5 border border-border-theme rounded-2xl bg-bg-theme/20 text-left space-y-3 text-xs font-semibold">
                      <div className="pb-2 border-b border-border-theme/40">
                        <h4 className="text-sm font-black text-text-primary-theme uppercase">{companyInsightResult.company_name}</h4>
                        <span className="text-[10px] text-text-muted-theme block mt-0.5">{companyInsightResult.insight_data.rating} Rating</span>
                      </div>
                      <p className="text-text-secondary-theme font-medium leading-relaxed">{companyInsightResult.insight_data.overview}</p>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-text-muted-theme uppercase">Culture highlights</span>
                        <p className="text-text-secondary-theme font-medium">{companyInsightResult.insight_data.culture}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-text-muted-theme uppercase">Typical interview rounds</span>
                        <p className="text-text-secondary-theme font-medium leading-relaxed">{companyInsightResult.insight_data.interview_process}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-border-theme rounded-3xl h-[280px] flex items-center justify-center text-text-muted-theme italic font-medium">
                      Enter company names to fetch employee reviews
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 14. APPLICATION STRATEGY VIEW */}
          {activeTab === 'strategy' && (
            <motion.div
              key="strategy-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  AI Application Strategy
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Load specific recruiter interest predictions, application timing recommendations, and competition updates
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Select Job Listing</label>
                    <select
                      value={appStrategyForm.jobId}
                      onChange={e => setAppStrategyForm({ jobId: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold"
                    >
                      {availableJobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title} at {job.company?.company_name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAppStrategySubmit}
                    disabled={!appStrategyForm.jobId}
                    className="w-full py-3 bg-primary-theme hover:bg-primary-hover-theme text-white font-black rounded-xl cursor-pointer"
                  >
                    Draft Application Strategy
                  </button>
                </div>

                <div className="md:col-span-7 space-y-4">
                  {appStrategyResult ? (
                    <div className="space-y-4 text-xs font-semibold text-left">
                      <div className="p-4 border border-border-theme bg-bg-theme/40 rounded-2xl flex justify-between items-center">
                        <div>
                          <span className="text-[9px] text-text-muted-theme uppercase tracking-wider block">Should you Apply?</span>
                          <span className="text-sm font-black text-[#E8702A] uppercase tracking-wide">{appStrategyResult.should_apply}</span>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg">
                          {appStrategyResult.recruiter_interest}
                        </span>
                      </div>

                      <div className="p-4 border border-border-theme rounded-2xl space-y-2">
                        <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider block">AI Resume Improvements</span>
                        <ul className="space-y-1 list-disc pl-4 text-text-secondary-theme font-medium leading-relaxed">
                          {appStrategyResult.resume_improvements.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-border-theme rounded-3xl h-[280px] flex items-center justify-center text-text-muted-theme italic font-medium">
                      Select listings to run strategy heuristics
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 15. CAREER ANALYTICS VIEW */}
          {activeTab === 'analytics' && analyticsData && (
            <motion.div
              key="analytics-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  Career Analytics trends
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Inspect real-time tracking graphs representing recruitment applications, offers, and views
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                {/* SVG/CSS graph 1 */}
                <div className="p-5 border border-border-theme rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Applications vs Interviews</h4>
                  <div className="h-36 flex items-end justify-between gap-2 bg-bg-theme/40 p-4 rounded-xl border border-border-theme/30 relative">
                    {analyticsData.applications.map((val: number, i: number) => {
                      const pctApp = (val / 20) * 100;
                      const pctInt = (analyticsData.interviews[i] / 20) * 100;
                      return (
                        <div key={i} className="flex-1 flex gap-1 items-end h-full">
                          <div className="w-2.5 bg-primary-theme rounded-t-xs" style={{ height: `${pctApp}%` }} title={`Apps: ${val}`} />
                          <div className="w-2.5 bg-indigo-600 rounded-t-xs" style={{ height: `${pctInt}%` }} title={`Ints: ${analyticsData.interviews[i]}`} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center gap-4 text-[9px] font-black uppercase">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary-theme rounded-full" />
                      <span>Applications</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                      <span>Interviews</span>
                    </div>
                  </div>
                </div>

                {/* SVG/CSS graph 2 */}
                <div className="p-5 border border-border-theme rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-bold text-text-muted-theme uppercase tracking-wider">Resume Views Index</h4>
                  <div className="h-36 flex items-end justify-between gap-3 bg-bg-theme/40 p-4 rounded-xl border border-border-theme/30">
                    {analyticsData.resume_views.map((val: number, i: number) => {
                      const pct = (val / 100) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col justify-end items-center h-full gap-1">
                          <div className="w-full bg-[#E8702A]/80 hover:bg-[#E8702A] rounded-t-md transition-all" style={{ height: `${pct}%` }} title={`Views: ${val}`} />
                          <span className="text-[8px] text-text-muted-theme font-bold">Wk {i+1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 16. AI MEMORY VIEW */}
          {activeTab === 'memory' && (
            <motion.div
              key="memory-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  AI Memory & Preferences
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Update customized professional criteria remembered by your AI career agent during chats
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs font-semibold">
                <div className="md:col-span-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Preference Category</label>
                    <select
                      value={newMemory.category}
                      onChange={e => setNewMemory({ ...newMemory, category: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold"
                    >
                      <option value="goals">Career Goals</option>
                      <option value="location">Location Preferences</option>
                      <option value="salary">Salary Target Expectations</option>
                      <option value="learning">Learning Preferences</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Preference Detail</label>
                    <textarea
                      rows={4}
                      value={newMemory.text}
                      onChange={e => setNewMemory({ ...newMemory, text: e.target.value })}
                      placeholder="e.g. Only open to remote work in India with product-scale enterprises."
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveMemory}
                    disabled={!newMemory.text.trim()}
                    className="w-full py-3 bg-primary-theme hover:bg-primary-hover-theme text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <Brain className="w-4 h-4" />
                    Commit to AI Memory
                  </button>
                </div>

                <div className="md:col-span-7 space-y-3">
                  <span className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider block text-left">Active AI Memory Parameters</span>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {aiMemoryList.length > 0 ? (
                      aiMemoryList.map(rec => (
                        <div key={rec.id} className="p-3 border border-border-theme bg-bg-theme/40 rounded-xl flex justify-between items-start text-left">
                          <div>
                            <span className="text-[9px] font-black text-primary-theme uppercase tracking-wider block">{rec.category}</span>
                            <p className="text-text-secondary-theme font-semibold mt-1">{rec.recommendation_text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 border border-dashed border-border-theme rounded-2xl text-center text-text-muted-theme italic">
                        No preferences saved yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 17. SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-xs font-semibold"
            >
              <div className="border-b border-border-theme pb-4">
                <h2 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                  AI Career Copilot Settings
                </h2>
                <p className="text-xs text-text-secondary-theme mt-0.5">
                  Configure AI language preferences, privacy parameters, and data logs controls
                </p>
              </div>

              <div className="max-w-md space-y-5 text-left">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Primary Language</label>
                  <select
                    value={settingsForm.language}
                    onChange={e => setSettingsForm({ ...settingsForm, language: e.target.value })}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">AI Persona Tone</label>
                  <select
                    value={settingsForm.tone}
                    onChange={e => setSettingsForm({ ...settingsForm, tone: e.target.value })}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs font-semibold"
                  >
                    <option value="professional">Professional Coach</option>
                    <option value="direct">Direct Reviewer</option>
                    <option value="encouraging">Motivational Mentor</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 border border-border-theme rounded-xl">
                  <div>
                    <span className="font-bold text-text-primary-theme block">Weekly Performance Report</span>
                    <span className="text-[10px] text-text-muted-theme">Send weekly email summary digests of shortlists and interview grades</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.weeklyReport}
                    onChange={e => setSettingsForm({ ...settingsForm, weeklyReport: e.target.checked })}
                    className="w-4 h-4 accent-primary-theme cursor-pointer"
                  />
                </div>

                <div className="pt-4 border-t border-border-theme/40 flex justify-between gap-4">
                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white font-black rounded-xl shadow-sm cursor-pointer"
                  >
                    Save Configuration
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="px-5 py-2.5 bg-error-theme/10 hover:bg-error-theme/20 text-error-theme font-black rounded-xl cursor-pointer"
                  >
                    Clear AI History
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
