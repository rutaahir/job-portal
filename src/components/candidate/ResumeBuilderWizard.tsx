/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Briefcase, GraduationCap, Code2, FolderGit2, Award,
  Globe, Layout, Sparkles, Sliders, CheckCircle2, AlertCircle,
  Plus, Trash2, ArrowUp, ArrowDown, Download, Printer, Save,
  ArrowLeft, ArrowRight, RefreshCw, Copy, Check, FileText,
  SlidersHorizontal, Star, Image, Share2, HelpCircle, Eye, EyeOff
} from 'lucide-react';

// Resume data types
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
  state: string;
  country: string;
  photoUrl: string;
  linkedin: string;
  github: string;
  portfolio: string;
  blog: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  type: string; // Full-time, Part-time, Contract, etc.
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  school: string;
  passingYear: string;
  grade: string;
  achievements: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Framework' | 'Database' | 'Tool';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techUsed: string[];
  role: string;
  duration: string;
  githubLink: string;
  liveLink: string;
}

export interface Certification {
  id: string;
  name: string;
  org: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Fluent' | 'Native';
}

export interface CareerPreferences {
  role: string;
  industry: string;
  expectedSalary: string;
  currentSalary: string;
  noticePeriod: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  locations: string[];
  openToWork: boolean;
}

export interface ResumeData {
  id: string;
  name: string; // Draft name
  personalInfo: PersonalInfo;
  experiences: WorkExperience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];
  preferences: CareerPreferences;
  template: 'Professional' | 'Modern' | 'Executive' | 'Minimal' | 'Creative' | 'Corporate';
  atsScore: number;
}

interface ResumeBuilderWizardProps {
  onSave: (resume: ResumeData) => void;
  onCancel: () => void;
  addToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  initialData?: Partial<ResumeData>;
  candidateName?: string;
}

export default function ResumeBuilderWizard({ onSave, onCancel, addToast, initialData, candidateName }: ResumeBuilderWizardProps) {
  // 12 steps stepper configuration
  const steps = [
    { number: 1, label: 'Personal Details', icon: User, desc: 'Contact info & summaries' },
    { number: 2, label: 'Work Experience', icon: Briefcase, desc: 'Professional history' },
    { number: 3, label: 'Education', icon: GraduationCap, desc: 'Academic credentials' },
    { number: 4, label: 'Skills Catalogue', icon: Code2, desc: 'Technical & soft expertise' },
    { number: 5, label: 'Key Projects', icon: FolderGit2, desc: 'Featured build portfolio' },
    { number: 6, label: 'Certifications', icon: Award, desc: 'Verifiable credentials' },
    { number: 7, label: 'Key Achievements', icon: Star, desc: 'Awards & publications' },
    { number: 8, label: 'Languages', icon: Globe, desc: 'Communication fluency' },
    { number: 9, label: 'Career Goals', icon: Sliders, desc: 'Target roles & terms' },
    { number: 10, label: 'AI Optimization', icon: Sparkles, desc: 'ATS score tuning' },
    { number: 11, label: 'Select Template', icon: Layout, desc: 'Visual styles & layouts' },
    { number: 12, label: 'Final Review', icon: CheckCircle2, desc: 'Export & complete' }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'Saved' | 'Saving...' | 'Unsaved Changes'>('Saved');
  const [mobileShowPreview, setMobileShowPreview] = useState(false);

  // Default initial resume state
  const defaultResume: ResumeData = {
    id: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
    name: 'Standard Tech Resume',
    personalInfo: {
      firstName: candidateName?.split(' ')[0] || '',
      lastName: candidateName?.split(' ')[1] || '',
      title: 'Lead Frontend Engineer',
      email: 'sneha@email.com',
      phone: '9876543210',
      countryCode: '+91',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      linkedin: 'linkedin.com/in/sneha-kapoor',
      github: 'github.com/snehakapoor',
      portfolio: 'snehakapoor.dev',
      blog: 'snehakapoor.medium.com',
      summary: 'Result-driven software developer specializing in high-fidelity user experiences and UI systems.'
    },
    experiences: [
      {
        id: 'exp-1',
        company: 'Zeta Systems',
        role: 'Senior UI Engineer',
        type: 'Full-time',
        startDate: '2022-06',
        endDate: '',
        current: true,
        location: 'Bengaluru, India',
        description: 'Lead frontend engineering for core fintech dashboards. Spearheaded a custom component design system using React and Tailwind CSS, reducing layout load time by 34%.'
      }
    ],
    educations: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Technology',
        fieldOfStudy: 'Computer Science',
        school: 'BITS Pilani',
        passingYear: '2021',
        grade: '8.9 CGPA',
        achievements: 'Secured 1st rank in National Web Innovation Challenge.'
      }
    ],
    skills: [
      { id: 'sk-1', name: 'React', level: 'Expert', category: 'Framework' },
      { id: 'sk-2', name: 'TypeScript', level: 'Expert', category: 'Technical' },
      { id: 'sk-3', name: 'Tailwind CSS', level: 'Expert', category: 'Framework' },
      { id: 'sk-4', name: 'Node.js', level: 'Advanced', category: 'Technical' },
      { id: 'sk-5', name: 'System Architecture', level: 'Advanced', category: 'Technical' }
    ],
    projects: [
      {
        id: 'pr-1',
        name: 'AI-Powered Sourcing Platform',
        description: 'Designed and implemented an enterprise candidate matching portal with real-time analytics dashboards.',
        techUsed: ['React', 'TypeScript', 'D3.js', 'Tailwind'],
        role: 'Sole Creator',
        duration: '4 Months',
        githubLink: 'github.com/snehakapoor/ai-sourcing',
        liveLink: 'ai-sourcing.snehakapoor.dev'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect',
        org: 'Amazon Web Services',
        issueDate: '2023-04',
        credentialId: 'AWS-948216'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Tech Mahindra Hackathon Winner',
        description: 'Led a team of 4 to design an automated emergency response routing algorithm.',
        date: '2022-11'
      }
    ],
    languages: [
      { id: 'lng-1', name: 'English', proficiency: 'Fluent' },
      { id: 'lng-2', name: 'Hindi', proficiency: 'Native' }
    ],
    preferences: {
      role: 'Lead Frontend Engineer',
      industry: 'Information Technology',
      expectedSalary: '18 LPA',
      currentSalary: '12 LPA',
      noticePeriod: 'Immediate',
      workMode: 'Hybrid',
      locations: ['Bengaluru', 'Remote'],
      openToWork: true
    },
    template: 'Professional',
    atsScore: 82
  };

  const [resume, setResume] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('technoadviser_resume_active');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { ...defaultResume, ...initialData };
  });

  // Drafts & version state
  const [drafts, setDrafts] = useState<ResumeData[]>(() => {
    const saved = localStorage.getItem('technoadviser_resume_drafts');
    return saved ? JSON.parse(saved) : [{ ...defaultResume, ...initialData }];
  });

  // Input states for list items to avoid state stuttering
  const [newExp, setNewExp] = useState<Omit<WorkExperience, 'id'>>({
    company: '', role: '', type: 'Full-time', startDate: '', endDate: '', current: false, location: '', description: ''
  });
  const [newEdu, setNewEdu] = useState<Omit<Education, 'id'>>({
    degree: '', fieldOfStudy: '', school: '', passingYear: '', grade: '', achievements: ''
  });
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '', level: 'Advanced', category: 'Technical'
  });
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    name: '', description: '', techUsed: [], role: '', duration: '', githubLink: '', liveLink: ''
  });
  const [newCert, setNewCert] = useState<Omit<Certification, 'id'>>({
    name: '', org: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: ''
  });
  const [newAch, setNewAch] = useState<Omit<Achievement, 'id'>>({
    title: '', description: '', date: ''
  });
  const [newLang, setNewLang] = useState<Omit<Language, 'id'>>({
    name: '', proficiency: 'Fluent'
  });

  // Auto-save logic
  useEffect(() => {
    setAutoSaveStatus('Unsaved Changes');
    const timer = setTimeout(() => {
      setAutoSaveStatus('Saving...');
      localStorage.setItem('technoadviser_resume_active', JSON.stringify(resume));
      
      // Update drafts list
      setDrafts(prev => {
        const index = prev.findIndex(d => d.id === resume.id);
        let updated;
        if (index >= 0) {
          updated = [...prev];
          updated[index] = resume;
        } else {
          updated = [...prev, resume];
        }
        localStorage.setItem('technoadviser_resume_drafts', JSON.stringify(updated));
        return updated;
      });

      setTimeout(() => setAutoSaveStatus('Saved'), 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [resume]);

  // Handle draft duplication
  const handleDuplicateDraft = () => {
    const newId = `RES-${Math.floor(100000 + Math.random() * 900000)}`;
    const duplicate: ResumeData = {
      ...resume,
      id: newId,
      name: `${resume.name} (Copy)`
    };
    setResume(duplicate);
    setDrafts(prev => [...prev, duplicate]);
    addToast(`Duplicated into draft: ${duplicate.name}`, 'success');
  };

  // Handle draft deletion
  const handleDeleteDraft = (id: string) => {
    if (drafts.length <= 1) {
      addToast('Cannot delete the only resume draft.', 'error');
      return;
    }
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem('technoadviser_resume_drafts', JSON.stringify(updated));
    if (resume.id === id) {
      setResume(updated[0]);
    }
    addToast('Resume draft deleted successfully.', 'info');
  };

  // State validation with automatic jump focus
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const validateStep = (stepNum: number): boolean => {
    const errors: string[] = [];
    if (stepNum === 1) {
      if (!resume.personalInfo.firstName) errors.push('firstName');
      if (!resume.personalInfo.lastName) errors.push('lastName');
      if (!resume.personalInfo.title) errors.push('title');
      if (!resume.personalInfo.email) errors.push('email');
      if (!resume.personalInfo.phone) errors.push('phone');
      if (!resume.personalInfo.summary) errors.push('summary');
    }
    setInvalidFields(errors);

    if (errors.length > 0) {
      const firstErrorId = errors[0];
      const element = document.getElementById(firstErrorId);
      if (element) {
        element.focus();
        element.classList.add('animate-pulse', 'border-rose-500');
        setTimeout(() => element.classList.remove('animate-pulse', 'border-rose-500'), 1500);
      }
      addToast('Please satisfy all mandatory fields in this step.', 'error');
      return false;
    }
    return true;
  };

  // Next & prev transitions
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 12) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Dynamic score calculator
  const calculateCompletionPercentage = (): number => {
    let score = 10; // personal details basic
    if (resume.personalInfo.summary.length > 20) score += 10;
    if (resume.personalInfo.linkedin || resume.personalInfo.github) score += 10;
    if (resume.experiences.length > 0) score += 20;
    if (resume.educations.length > 0) score += 15;
    if (resume.skills.length >= 4) score += 15;
    if (resume.projects.length > 0) score += 10;
    if (resume.certifications.length > 0) score += 5;
    if (resume.languages.length > 0) score += 5;
    return score;
  };

  const completionPercent = calculateCompletionPercentage();

  // AI Assistance Simulations with deep realistic touch
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const handleAiSummaryGenerate = () => {
    if (!resume.personalInfo.title) {
      addToast('Provide a Professional Title first so AI can tailor the summary.', 'error');
      return;
    }
    setAiLoading('summary');
    setTimeout(() => {
      let resultSummary = '';
      const title = resume.personalInfo.title;
      const firstName = resume.personalInfo.firstName || 'Sneha';

      if (title.toLowerCase().includes('frontend') || title.toLowerCase().includes('react') || title.toLowerCase().includes('developer')) {
        resultSummary = `Innovative and outcome-oriented ${title} with ${resume.experiences[0]?.startDate ? 'several years' : '3+ years'} of experience building high-performance, responsive web architectures. Highly proficient in React, TypeScript, and modern state-management structures. Proven track record of optimizing application rendering cycles, engineering reusable design systems, and boosting core user metrics by 20%+.`;
      } else if (title.toLowerCase().includes('design') || title.toLowerCase().includes('ui') || title.toLowerCase().includes('ux')) {
        resultSummary = `Empathetic and data-driven ${title} specialized in transforming complex workflows into intuitive user interfaces. Adept at conducting user research, scaling visual design tokens, and aligning product layouts with visual aesthetic standards. Dedicated to bridging layout logic with cross-functional development squads.`;
      } else {
        resultSummary = `Experienced and results-driven ${title} with expertise in building scalable, enterprise-grade applications. Focused on leveraging industry best practices, modern clean architecture patterns, and agile methodologies to ship robust software solutions. Clear communicator and proactive mentor.`;
      }

      setResume(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, summary: resultSummary }
      }));
      setAiLoading(null);
      addToast('AI Summary successfully generated!', 'success');
    }, 1200);
  };

  const handleAiImproveExperience = (expId: string) => {
    const experience = resume.experiences.find(e => e.id === expId);
    if (!experience || !experience.description) {
      addToast('Please enter an experience description to improve.', 'error');
      return;
    }
    setAiLoading(`exp-${expId}`);
    setTimeout(() => {
      const bulletPoints = [
        `Spearheaded development of high-priority frontend systems for ${experience.company || 'the enterprise'}, introducing React hooks and Tailwind CSS layout frameworks.`,
        `Successfully engineered reusable UI modules which reduced system visual rendering times by 35% and bundle footprint by 22%.`,
        `Collaborated with cross-functional squads to integrate secure API gateways, accelerating product releases and decreasing client-side defect occurrences by 18%.`
      ].join('\n');

      setResume(prev => ({
        ...prev,
        experiences: prev.experiences.map(e => e.id === expId ? { ...e, description: bulletPoints } : e)
      }));
      setAiLoading(null);
      addToast('Bullet points upgraded using Action Verbs!', 'success');
    }, 1500);
  };

  const handleAiRecommendSkills = () => {
    setAiLoading('skills');
    setTimeout(() => {
      const recommendations: Skill[] = [
        { id: `rec-${Math.random()}`, name: 'GraphQL', level: 'Intermediate', category: 'Technical' },
        { id: `rec-${Math.random()}`, name: 'System Design', level: 'Advanced', category: 'Technical' },
        { id: `rec-${Math.random()}`, name: 'Framer Motion', level: 'Advanced', category: 'Framework' },
        { id: `rec-${Math.random()}`, name: 'Webpack / Vite', level: 'Expert', category: 'Tool' },
        { id: `rec-${Math.random()}`, name: 'CI/CD Pipelines', level: 'Intermediate', category: 'Tool' }
      ];

      setResume(prev => {
        const existingNames = prev.skills.map(s => s.name.toLowerCase());
        const filteredRecs = recommendations.filter(r => !existingNames.includes(r.name.toLowerCase()));
        if (filteredRecs.length === 0) return prev;
        return {
          ...prev,
          skills: [...prev.skills, ...filteredRecs]
        };
      });

      setAiLoading(null);
      addToast('Recommended modern skills added to your catalogue!', 'success');
    }, 1300);
  };

  // One-Click Quick Fix and score boost
  const handleAtsQuickFix = () => {
    setAiLoading('quickfix');
    setTimeout(() => {
      setResume(prev => ({
        ...prev,
        atsScore: 97,
        personalInfo: {
          ...prev.personalInfo,
          summary: prev.personalInfo.summary || 'Strategic Lead Frontend Engineer with extensive expertise in creating modular application layouts and scalable UI infrastructures.'
        },
        skills: prev.skills.length >= 7 ? prev.skills : [
          ...prev.skills,
          { id: `qf-1`, name: 'Figma Token Hand-off', level: 'Advanced', category: 'Tool' },
          { id: `qf-2`, name: 'A/B Layout Testing', level: 'Expert', category: 'Technical' },
          { id: `qf-3`, name: 'Agile Team Mentoring', level: 'Expert', category: 'Soft' }
        ]
      }));
      setAiLoading(null);
      addToast('ATS Quick Fix Applied! Score boosted to 97%!', 'success');
    }, 1800);
  };

  // Add items list helper functions
  const addExperience = () => {
    if (!newExp.company || !newExp.role) {
      addToast('Company Name and Role are required.', 'error');
      return;
    }
    const item: WorkExperience = {
      ...newExp,
      id: `exp-${Date.now()}`
    };
    setResume(prev => ({ ...prev, experiences: [...prev.experiences, item] }));
    setNewExp({ company: '', role: '', type: 'Full-time', startDate: '', endDate: '', current: false, location: '', description: '' });
    addToast('Work experience entry added.', 'success');
  };

  const deleteExperience = (id: string) => {
    setResume(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== id) }));
  };

  const addEducation = () => {
    if (!newEdu.degree || !newEdu.school) {
      addToast('Degree and School are required.', 'error');
      return;
    }
    const item: Education = {
      ...newEdu,
      id: `edu-${Date.now()}`
    };
    setResume(prev => ({ ...prev, educations: [...prev.educations, item] }));
    setNewEdu({ degree: '', fieldOfStudy: '', school: '', passingYear: '', grade: '', achievements: '' });
    addToast('Education history added.', 'success');
  };

  const deleteEducation = (id: string) => {
    setResume(prev => ({ ...prev, educations: prev.educations.filter(e => e.id !== id) }));
  };

  const addSkill = () => {
    if (!newSkill.name) {
      addToast('Skill Name is required.', 'error');
      return;
    }
    const item: Skill = {
      ...newSkill,
      id: `sk-${Date.now()}`
    };
    setResume(prev => ({ ...prev, skills: [...prev.skills, item] }));
    setNewSkill({ name: '', level: 'Advanced', category: 'Technical' });
    addToast('Skill added to list.', 'success');
  };

  const deleteSkill = (id: string) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
  };

  const addProject = () => {
    if (!newProject.name || !newProject.description) {
      addToast('Project Name and Description are required.', 'error');
      return;
    }
    const item: Project = {
      ...newProject,
      id: `pr-${Date.now()}`
    };
    setResume(prev => ({ ...prev, projects: [...prev.projects, item] }));
    setNewProject({ name: '', description: '', techUsed: [], role: '', duration: '', githubLink: '', liveLink: '' });
    addToast('Project added.', 'success');
  };

  const deleteProject = (id: string) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const addCert = () => {
    if (!newCert.name || !newCert.org) {
      addToast('Certification Name and Organization are required.', 'error');
      return;
    }
    const item: Certification = {
      ...newCert,
      id: `cert-${Date.now()}`
    };
    setResume(prev => ({ ...prev, certifications: [...prev.certifications, item] }));
    setNewCert({ name: '', org: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' });
    addToast('Certification added.', 'success');
  };

  const deleteCert = (id: string) => {
    setResume(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  };

  const addAch = () => {
    if (!newAch.title) {
      addToast('Achievement Title is required.', 'error');
      return;
    }
    const item: Achievement = {
      ...newAch,
      id: `ach-${Date.now()}`
    };
    setResume(prev => ({ ...prev, achievements: [...prev.achievements, item] }));
    setNewAch({ title: '', description: '', date: '' });
    addToast('Achievement added.', 'success');
  };

  const deleteAch = (id: string) => {
    setResume(prev => ({ ...prev, achievements: prev.achievements.filter(a => a.id !== id) }));
  };

  const addLang = () => {
    if (!newLang.name) {
      addToast('Language Name is required.', 'error');
      return;
    }
    const item: Language = {
      ...newLang,
      id: `lng-${Date.now()}`
    };
    setResume(prev => ({ ...prev, languages: [...prev.languages, item] }));
    setNewLang({ name: '', proficiency: 'Fluent' });
    addToast('Language added.', 'success');
  };

  const deleteLang = (id: string) => {
    setResume(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
  };

  // Exporters
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    addToast('Generating physical ATS-friendly resume layout...', 'info');
    setTimeout(() => {
      // Simulating a document generation file trigger
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(resume, null, 2)], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${resume.personalInfo.firstName || 'Candidate'}_ATS_Resume.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      addToast('Resume downloaded successfully!', 'success');
    }, 1200);
  };

  const handleSaveAndComplete = () => {
    // Commit to localStorage variables as well so Candidate Dashboard reads them dynamically
    localStorage.setItem('technoadviser_resume_completed', 'true');
    localStorage.setItem('technoadviser_resume_score', resume.atsScore.toString());
    localStorage.setItem('technoadviser_profile_strength', '95');
    
    // Log audit trail
    const logs = JSON.parse(localStorage.getItem('technoadviser_audit_logs') || '[]');
    logs.unshift({
      event: 'RESUME_BUILDER_COMPLETED',
      email: resume.personalInfo.email,
      timestamp: new Date().toISOString(),
      details: `Resume successfully constructed with ATS score: ${resume.atsScore}%`
    });
    localStorage.setItem('technoadviser_audit_logs', JSON.stringify(logs));

    onSave(resume);
  };

  return (
    <div className="fixed inset-0 bg-background-theme z-50 flex flex-col font-sans overflow-hidden">
      
      {/* Top Header Section */}
      <header className="border-b border-border-theme/80 bg-surface-theme px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-theme/10 rounded-xl flex items-center justify-center text-primary-theme">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={resume.name}
                onChange={(e) => setResume({ ...resume, name: e.target.value })}
                className="font-serif font-black text-text-primary-theme text-sm bg-transparent border-b border-transparent hover:border-border-theme focus:border-primary-theme focus:outline-none py-0.5 max-w-[200px]"
              />
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-border-theme/40 text-text-secondary-theme rounded-md">
                {resume.id}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-text-muted-theme font-medium">ATS Resume Wizard</span>
              <span className="w-1 h-1 rounded-full bg-border-theme" />
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${autoSaveStatus === 'Saved' ? 'bg-success-theme' : 'bg-warning-theme animate-pulse'}`} />
                <span className="text-[9px] text-text-muted-theme font-semibold font-mono">{autoSaveStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Draft controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 border-r border-border-theme/60 pr-4">
            <label className="text-[10px] font-black uppercase text-text-muted-theme tracking-wider">Draft Switcher</label>
            <select
              value={resume.id}
              onChange={(e) => {
                const selected = drafts.find(d => d.id === e.target.value);
                if (selected) setResume(selected);
              }}
              className="bg-border-theme/20 border border-border-theme text-xs font-bold text-text-primary-theme rounded-lg py-1 px-2.5 focus:outline-none"
            >
              {drafts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileShowPreview(!mobileShowPreview)}
              className="lg:hidden px-3.5 py-1.5 border border-border-theme rounded-xl text-xs font-bold text-text-secondary-theme flex items-center gap-1.5 bg-border-theme/10"
            >
              <Eye className="w-4 h-4" />
              {mobileShowPreview ? 'Edit Form' : 'Preview'}
            </button>
            <button
              onClick={handleDuplicateDraft}
              title="Duplicate Draft"
              className="p-2 border border-border-theme rounded-xl hover:bg-border-theme/20 text-text-secondary-theme cursor-pointer"
            >
              <Copy className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-border-theme hover:bg-border-theme/10 rounded-xl text-xs font-black text-text-secondary-theme cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Interface */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Stepper Progress */}
        <div className="hidden md:flex w-72 border-r border-border-theme/80 bg-surface-theme flex-col justify-between p-5 shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <span className="text-[9px] uppercase font-black text-text-muted-theme tracking-widest font-mono">Resume Completion</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-text-primary-theme font-serif">{completionPercent}%</span>
                <span className="text-[10px] font-extrabold text-success-theme font-sans">Level Optimal</span>
              </div>
              <div className="w-full bg-border-theme/40 h-2 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-gradient-to-r from-primary-theme to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${completionPercent}%` }} />
              </div>
            </div>

            {/* Stepper list */}
            <nav className="space-y-1">
              {steps.map(s => {
                const IconComp = s.icon;
                const isCurrent = currentStep === s.number;
                const isCompleted = currentStep > s.number;
                return (
                  <button
                    key={s.number}
                    onClick={() => validateStep(currentStep) && setCurrentStep(s.number)}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-3 transition-all ${
                      isCurrent ? 'bg-primary-theme/5 border border-primary-theme/10 text-primary-theme' : 'hover:bg-border-theme/15 text-text-secondary-theme'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                      isCurrent ? 'bg-primary-theme text-white border-primary-theme' :
                      isCompleted ? 'bg-success-theme/10 border-success-theme/20 text-success-theme' : 'border-border-theme bg-border-theme/10'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <IconComp className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <div className={`text-xs font-black truncate leading-tight ${isCurrent ? 'text-primary-theme' : 'text-text-primary-theme'}`}>
                        {s.number}. {s.label}
                      </div>
                      <span className="text-[9px] text-text-muted-theme font-medium truncate block leading-none mt-0.5">
                        {s.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Draft Manager Box */}
          <div className="border-t border-border-theme/60 pt-4 mt-6">
            <span className="text-[9px] uppercase font-black text-text-muted-theme tracking-widest font-mono block mb-2">Draft Version History</span>
            <div className="space-y-1.5">
              {drafts.map(d => (
                <div key={d.id} className="p-2 border border-border-theme/50 rounded-xl bg-border-theme/5 flex items-center justify-between text-[11px] font-bold">
                  <button
                    onClick={() => setResume(d)}
                    className="truncate hover:text-primary-theme text-left max-w-[120px] text-text-primary-theme"
                  >
                    {d.name}
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] font-mono font-medium text-text-muted-theme">Score: {d.atsScore}%</span>
                    {drafts.length > 1 && (
                      <button onClick={() => handleDeleteDraft(d.id)} className="text-text-muted-theme hover:text-error-theme ml-1">
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Dynamic Step Input Form (Scrollable) */}
        <div className={`flex-1 overflow-y-auto p-6 md:p-8 bg-border-theme/10 ${mobileShowPreview ? 'hidden lg:block' : 'block'}`}>
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Step Heading */}
            <div className="border-b border-border-theme pb-4">
              <span className="text-[10px] uppercase font-black text-primary-theme tracking-wider font-mono">
                Step {currentStep} of 12
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-text-primary-theme leading-tight mt-1">
                {steps[currentStep - 1].label}
              </h2>
              <p className="text-xs text-text-secondary-theme font-medium mt-1 leading-normal">
                Fill the information blocks accurately to feed our ATS parser algorithms.
              </p>
            </div>

            {/* STEP 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">First Name *</label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={resume.personalInfo.firstName}
                      onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, firstName: e.target.value } })}
                      className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Last Name *</label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={resume.personalInfo.lastName}
                      onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, lastName: e.target.value } })}
                      className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase">Professional Title *</label>
                  <input
                    id="title"
                    type="text"
                    required
                    placeholder="e.g. Lead Frontend Engineer"
                    value={resume.personalInfo.title}
                    onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, title: e.target.value } })}
                    className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={resume.personalInfo.email}
                      onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, email: e.target.value } })}
                      className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Phone Number *</label>
                    <input
                      id="phone"
                      type="text"
                      required
                      value={resume.personalInfo.phone}
                      onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, phone: e.target.value } })}
                      className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">City</label>
                    <input
                      type="text"
                      value={resume.personalInfo.city}
                      onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, city: e.target.value } })}
                      className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">State</label>
                    <input
                      type="text"
                      value={resume.personalInfo.state}
                      onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, state: e.target.value } })}
                      className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Country</label>
                    <input
                      type="text"
                      value={resume.personalInfo.country}
                      onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, country: e.target.value } })}
                      className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">LinkedIn Profile</label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/username"
                      value={resume.personalInfo.linkedin}
                      onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, linkedin: e.target.value } })}
                      className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold animate-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">GitHub Profile</label>
                    <input
                      type="text"
                      placeholder="github.com/username"
                      value={resume.personalInfo.github}
                      onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, github: e.target.value } })}
                      className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Professional Summary *</label>
                    <button
                      type="button"
                      onClick={handleAiSummaryGenerate}
                      disabled={aiLoading === 'summary'}
                      className="text-[10px] text-primary-theme font-black uppercase flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {aiLoading === 'summary' ? (
                        <><RefreshCw className="w-3 h-3 animate-spin" /> Drafting Summary...</>
                      ) : (
                        <><Sparkles className="w-3.5 h-3.5 fill-current" /> AI Generate Summary</>
                      )}
                    </button>
                  </div>
                  <textarea
                    id="summary"
                    rows={4}
                    required
                    value={resume.personalInfo.summary}
                    onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, summary: e.target.value } })}
                    className="w-full bg-surface-theme border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Work Experience */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Existing experiences list */}
                {resume.experiences.length > 0 && (
                  <div className="space-y-3.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-text-muted-theme">Current List</h3>
                    <div className="space-y-2.5">
                      {resume.experiences.map((exp, index) => (
                        <div key={exp.id} className="p-4 border border-border-theme bg-surface-theme rounded-2xl flex justify-between items-start">
                          <div className="space-y-1 pr-4">
                            <strong className="text-xs font-extrabold text-text-primary-theme">{exp.role}</strong>
                            <div className="text-[11px] text-text-secondary-theme font-semibold">
                              {exp.company} &bull; {exp.type} &bull; {exp.location}
                            </div>
                            <span className="text-[10px] text-text-muted-theme block mt-0.5">
                              {exp.startDate} to {exp.current ? 'Present' : exp.endDate}
                            </span>
                            <p className="text-[11px] text-text-secondary-theme leading-relaxed whitespace-pre-line border-t border-border-theme/40 pt-2 mt-2">
                              {exp.description}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleAiImproveExperience(exp.id)}
                              disabled={aiLoading === `exp-${exp.id}`}
                              className="mt-2.5 text-[9px] text-primary-theme font-black uppercase flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              {aiLoading === `exp-${exp.id}` ? (
                                <><RefreshCw className="w-2.5 h-2.5 animate-spin" /> Enhancing Descriptions...</>
                              ) : (
                                <><Sparkles className="w-3 h-3 fill-current" /> AI Upgrade to Bullet Points</>
                              )}
                            </button>
                          </div>
                          <button
                            onClick={() => deleteExperience(exp.id)}
                            className="p-1 text-text-muted-theme hover:text-error-theme shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add new entry form */}
                <div className="p-5 border border-border-theme bg-surface-theme rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Add Work Experience</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Company Name *</label>
                      <input
                        type="text"
                        value={newExp.company}
                        onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Job Role *</label>
                      <input
                        type="text"
                        value={newExp.role}
                        onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Employment Type</label>
                      <select
                        value={newExp.type}
                        onChange={(e) => setNewExp({ ...newExp, type: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Freelance</option>
                        <option>Internship</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Location</label>
                      <input
                        type="text"
                        value={newExp.location}
                        onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Start Date</label>
                      <input
                        type="month"
                        value={newExp.startDate}
                        onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold text-text-muted-theme"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">End Date</label>
                      <input
                        type="month"
                        disabled={newExp.current}
                        value={newExp.endDate}
                        onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold text-text-muted-theme disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="current"
                      checked={newExp.current}
                      onChange={(e) => setNewExp({ ...newExp, current: e.target.checked })}
                      className="accent-primary-theme h-4.5 w-4.5"
                    />
                    <label htmlFor="current" className="text-xs font-bold text-text-secondary-theme">I currently work here</label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Responsibilities & Core Outcomes</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Optimized database schemas, mentored juniors"
                      value={newExp.description}
                      onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold leading-relaxed"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addExperience}
                    className="w-full py-2.5 bg-primary-theme/10 hover:bg-primary-theme text-primary-theme hover:text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Experience Block
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Education */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Existing Educations */}
                {resume.educations.length > 0 && (
                  <div className="space-y-2.5">
                    {resume.educations.map(edu => (
                      <div key={edu.id} className="p-4 border border-border-theme bg-surface-theme rounded-2xl flex justify-between items-start">
                        <div className="space-y-0.5">
                          <strong className="text-xs font-extrabold text-text-primary-theme">{edu.degree} &bull; {edu.fieldOfStudy}</strong>
                          <div className="text-[11px] text-text-secondary-theme font-semibold">
                            {edu.school} &bull; Class of {edu.passingYear} &bull; {edu.grade}
                          </div>
                          {edu.achievements && (
                            <p className="text-[11px] text-text-muted-theme leading-relaxed mt-1">{edu.achievements}</p>
                          )}
                        </div>
                        <button onClick={() => deleteEducation(edu.id)} className="text-text-muted-theme hover:text-error-theme">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Education Form */}
                <div className="p-5 border border-border-theme bg-surface-theme rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Add Academic Block</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Degree Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Bachelor of Technology"
                        value={newEdu.degree}
                        onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Field of Study</label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={newEdu.fieldOfStudy}
                        onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">School / University *</label>
                    <input
                      type="text"
                      placeholder="e.g. BITS Pilani"
                      value={newEdu.school}
                      onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Passing Year</label>
                      <input
                        type="text"
                        placeholder="e.g. 2021"
                        value={newEdu.passingYear}
                        onChange={(e) => setNewEdu({ ...newEdu, passingYear: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Grade / GPA</label>
                      <input
                        type="text"
                        placeholder="e.g. 9.1 CGPA"
                        value={newEdu.grade}
                        onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Academic Honors & Achievements</label>
                    <input
                      type="text"
                      placeholder="e.g. Received Gold Medal for highest score in UI Design module"
                      value={newEdu.achievements}
                      onChange={(e) => setNewEdu({ ...newEdu, achievements: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addEducation}
                    className="w-full py-2.5 bg-primary-theme/10 hover:bg-primary-theme text-primary-theme hover:text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Education History
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Skills Catalogue */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Recommendation trigger */}
                <div className="bg-primary-theme/5 border border-primary-theme/15 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-black text-text-primary-theme flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-primary-theme fill-current" />
                      Add In-Demand Skills recommendation
                    </strong>
                    <p className="text-[10px] text-text-secondary-theme mt-0.5">
                      Instantly index skills matching top recruiters requirements for "{resume.personalInfo.title}".
                    </p>
                  </div>
                  <button
                    onClick={handleAiRecommendSkills}
                    disabled={aiLoading === 'skills'}
                    className="px-4 py-1.5 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-lg text-[10px] font-black cursor-pointer"
                  >
                    Recommend
                  </button>
                </div>

                {/* Existing Skill Badges */}
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map(s => (
                    <span
                      key={s.id}
                      className="px-3 py-1.5 bg-surface-theme border border-border-theme rounded-xl text-xs font-bold text-text-primary-theme flex items-center gap-1.5 shadow-sm hover:border-rose-500/30 transition-all group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-theme shrink-0" />
                      <span>{s.name} ({s.level})</span>
                      <button
                        onClick={() => deleteSkill(s.id)}
                        className="text-text-muted-theme hover:text-error-theme font-black text-xs ml-1 opacity-60 hover:opacity-100"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add new Skill card */}
                <div className="p-5 border border-border-theme bg-surface-theme rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Index New Skill</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Skill Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. React Native, Figma"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Skill Category</label>
                      <select
                        value={newSkill.category}
                        onChange={(e: any) => setNewSkill({ ...newSkill, category: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      >
                        <option value="Framework">Framework</option>
                        <option value="Technical">Technical</option>
                        <option value="Soft">Soft Skill</option>
                        <option value="Database">Database</option>
                        <option value="Tool">Developer Tool</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Proficiency Level</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((lvl: any) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setNewSkill({ ...newSkill, level: lvl })}
                          className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                            newSkill.level === lvl ? 'bg-primary-theme text-white border-primary-theme' : 'border-border-theme hover:bg-border-theme/10 text-text-secondary-theme'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addSkill}
                    className="w-full py-2.5 bg-primary-theme/10 hover:bg-primary-theme text-primary-theme hover:text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Register Skill
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Projects */}
            {currentStep === 5 && (
              <div className="space-y-6">
                {/* Projects list */}
                {resume.projects.length > 0 && (
                  <div className="space-y-2.5">
                    {resume.projects.map(p => (
                      <div key={p.id} className="p-4 border border-border-theme bg-surface-theme rounded-2xl flex justify-between items-start">
                        <div className="space-y-1.5">
                          <strong className="text-xs font-extrabold text-text-primary-theme">{p.name} ({p.role})</strong>
                          <div className="text-[10px] font-mono uppercase text-text-muted-theme tracking-wider block">Duration: {p.duration}</div>
                          <p className="text-[11px] text-text-secondary-theme leading-relaxed whitespace-pre-line border-t border-border-theme/40 pt-1.5 mt-1.5">{p.description}</p>
                          {p.techUsed.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {p.techUsed.map((t, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-border-theme/40 text-text-secondary-theme text-[9px] font-black rounded">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button onClick={() => deleteProject(p.id)} className="text-text-muted-theme hover:text-error-theme">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Project Form */}
                <div className="p-5 border border-border-theme bg-surface-theme rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Add Project Card</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Project Name *</label>
                      <input
                        type="text"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Role / Responsibility</label>
                      <input
                        type="text"
                        placeholder="e.g. Fullstack Dev"
                        value={newProject.role}
                        onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Duration / Timeline</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 Months"
                        value={newProject.duration}
                        onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Technology Keywords (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. React, Docker, Postgres"
                        value={newProject.techUsed.join(', ')}
                        onChange={(e) => setNewProject({ ...newProject, techUsed: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">GitHub Repository URL</label>
                      <input
                        type="text"
                        value={newProject.githubLink}
                        onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Live Demo Link</label>
                      <input
                        type="text"
                        value={newProject.liveLink}
                        onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Project Summary Description *</label>
                    <textarea
                      rows={3}
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold leading-relaxed"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addProject}
                    className="w-full py-2.5 bg-primary-theme/10 hover:bg-primary-theme text-primary-theme hover:text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: Certifications */}
            {currentStep === 6 && (
              <div className="space-y-6">
                {/* Certifications list */}
                {resume.certifications.length > 0 && (
                  <div className="space-y-2.5">
                    {resume.certifications.map(c => (
                      <div key={c.id} className="p-4 border border-border-theme bg-surface-theme rounded-2xl flex justify-between items-start">
                        <div className="space-y-0.5">
                          <strong className="text-xs font-extrabold text-text-primary-theme">{c.name}</strong>
                          <div className="text-[11px] text-text-secondary-theme font-semibold">
                            {c.org} &bull; Issued {c.issueDate}
                          </div>
                          {c.credentialId && (
                            <span className="text-[10px] font-mono text-text-muted-theme block mt-1">ID: {c.credentialId}</span>
                          )}
                        </div>
                        <button onClick={() => deleteCert(c.id)} className="text-text-muted-theme hover:text-error-theme">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add certification form */}
                <div className="p-5 border border-border-theme bg-surface-theme rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Add Certification Credentials</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Certification Name *</label>
                      <input
                        type="text"
                        value={newCert.name}
                        onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Issuing Organization *</label>
                      <input
                        type="text"
                        value={newCert.org}
                        onChange={(e) => setNewCert({ ...newCert, org: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Issue Date</label>
                      <input
                        type="month"
                        value={newCert.issueDate}
                        onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold text-text-muted-theme"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Credential ID</label>
                      <input
                        type="text"
                        value={newCert.credentialId}
                        onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addCert}
                    className="w-full py-2.5 bg-primary-theme/10 hover:bg-primary-theme text-primary-theme hover:text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Certification
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: Achievements */}
            {currentStep === 7 && (
              <div className="space-y-6">
                {/* Achievements List */}
                {resume.achievements.length > 0 && (
                  <div className="space-y-2.5">
                    {resume.achievements.map(a => (
                      <div key={a.id} className="p-4 border border-border-theme bg-surface-theme rounded-2xl flex justify-between items-start">
                        <div className="space-y-1">
                          <strong className="text-xs font-extrabold text-text-primary-theme">{a.title}</strong>
                          <div className="text-[10px] font-mono text-text-muted-theme block">Awarded: {a.date}</div>
                          {a.description && (
                            <p className="text-[11px] text-text-secondary-theme mt-1 leading-relaxed">{a.description}</p>
                          )}
                        </div>
                        <button onClick={() => deleteAch(a.id)} className="text-text-muted-theme hover:text-error-theme">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Achievement Form */}
                <div className="p-5 border border-border-theme bg-surface-theme rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Add Honors Card</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Achievement Title *</label>
                      <input
                        type="text"
                        value={newAch.title}
                        onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Date Awarded</label>
                      <input
                        type="month"
                        value={newAch.date}
                        onChange={(e) => setNewAch({ ...newAch, date: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold text-text-muted-theme"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Description Details</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Placed top in competitive hackathon run by Zeta."
                      value={newAch.description}
                      onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold leading-relaxed"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addAch}
                    className="w-full py-2.5 bg-primary-theme/10 hover:bg-primary-theme text-primary-theme hover:text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Achievement
                  </button>
                </div>
              </div>
            )}

            {/* STEP 8: Languages */}
            {currentStep === 8 && (
              <div className="space-y-6">
                {/* Languages List */}
                <div className="flex flex-wrap gap-2">
                  {resume.languages.map(l => (
                    <span
                      key={l.id}
                      className="px-3 py-1.5 bg-surface-theme border border-border-theme rounded-xl text-xs font-bold text-text-primary-theme flex items-center gap-1.5 shadow-sm hover:border-rose-500/30 transition-all"
                    >
                      <span>{l.name} &bull; {l.proficiency}</span>
                      <button onClick={() => deleteLang(l.id)} className="text-text-muted-theme hover:text-error-theme ml-1 text-xs">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Language Form */}
                <div className="p-5 border border-border-theme bg-surface-theme rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme">Register Fluency</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Language Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. German, Mandarin"
                        value={newLang.name}
                        onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary-theme uppercase">Fluency Proficiency</label>
                      <select
                        value={newLang.proficiency}
                        onChange={(e: any) => setNewLang({ ...newLang, proficiency: e.target.value })}
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Fluent</option>
                        <option>Native</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addLang}
                    className="w-full py-2.5 bg-primary-theme/10 hover:bg-primary-theme text-primary-theme hover:text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Language
                  </button>
                </div>
              </div>
            )}

            {/* STEP 9: Career preferences */}
            {currentStep === 9 && (
              <div className="space-y-4 bg-surface-theme border border-border-theme rounded-2xl p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-text-primary-theme border-b border-border-theme pb-2 mb-2">Target Preferences</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Target Role Title</label>
                    <input
                      type="text"
                      value={resume.preferences.role}
                      onChange={(e) => setResume({
                        ...resume,
                        preferences: { ...resume.preferences, role: e.target.value }
                      })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Preferred Industry</label>
                    <input
                      type="text"
                      value={resume.preferences.industry}
                      onChange={(e) => setResume({
                        ...resume,
                        preferences: { ...resume.preferences, industry: e.target.value }
                      })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Expected Salary (LPA)</label>
                    <input
                      type="text"
                      value={resume.preferences.expectedSalary}
                      onChange={(e) => setResume({
                        ...resume,
                        preferences: { ...resume.preferences, expectedSalary: e.target.value }
                      })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary-theme uppercase">Notice Period</label>
                    <select
                      value={resume.preferences.noticePeriod}
                      onChange={(e) => setResume({
                        ...resume,
                        preferences: { ...resume.preferences, noticePeriod: e.target.value }
                      })}
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    >
                      <option>Immediate</option>
                      <option>15 Days</option>
                      <option>30 Days</option>
                      <option>90 Days</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary-theme uppercase">Preferred Work Mode</label>
                  <div className="flex bg-border-theme/30 p-1 rounded-xl">
                    {(['Remote', 'Hybrid', 'Onsite'] as const).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setResume({
                          ...resume,
                          preferences: { ...resume.preferences, workMode: mode }
                        })}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          resume.preferences.workMode === mode ? 'bg-primary-theme text-white' : 'text-text-secondary-theme hover:text-text-primary-theme'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4.5 border border-primary-theme/10 bg-primary-theme/5 rounded-2xl">
                  <div className="space-y-0.5 pr-4">
                    <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Enable Open To Work Badge</h4>
                    <p className="text-[10px] text-text-secondary-theme leading-normal">
                      Signals matching companies that you have prioritized immediate active opportunities.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResume({
                      ...resume,
                      preferences: { ...resume.preferences, openToWork: !resume.preferences.openToWork }
                    })}
                    className={`w-12 h-6.5 rounded-full p-1 transition-all ${resume.preferences.openToWork ? 'bg-primary-theme' : 'bg-border-theme/60'}`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-white transition-all ${resume.preferences.openToWork ? 'translate-x-5.5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 10: AI Resume Optimization */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* ATS Meter widget */}
                  <div className="bg-surface-theme border border-border-theme p-5 rounded-2xl flex flex-col justify-center space-y-3">
                    <span className="text-[10px] font-black uppercase text-text-muted-theme tracking-wider">ATS Score Rating</span>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-text-primary-theme font-mono leading-none">{resume.atsScore}/100</span>
                      <span className={`text-xs font-bold pb-0.5 ${resume.atsScore >= 90 ? 'text-success-theme' : 'text-warning-theme'}`}>
                        {resume.atsScore >= 90 ? 'Optimal' : 'Needs Optimization'}
                      </span>
                    </div>
                    <div className="w-full bg-border-theme/40 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-warning-theme to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${resume.atsScore}%` }} />
                    </div>
                  </div>

                  {/* Optimization trigger card */}
                  <div className="bg-primary-theme/5 border border-primary-theme/15 p-5 rounded-2xl flex flex-col justify-center space-y-2">
                    <span className="text-[10px] font-black uppercase text-primary-theme tracking-wider">One-Click Optimization</span>
                    <p className="text-[10px] text-text-secondary-theme leading-relaxed">
                      AI agent scans database requirements, resolves structural leaks and inserts optimal keywords.
                    </p>
                    <button
                      onClick={handleAtsQuickFix}
                      disabled={aiLoading === 'quickfix'}
                      className="w-full py-2 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {aiLoading === 'quickfix' ? (
                        <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fixing Resume...</>
                      ) : (
                        <><Sparkles className="w-3.5 h-3.5 fill-current" /> Auto-Optimize ATS Score</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-surface-theme border border-border-theme rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-black uppercase text-text-primary-theme">AI Structural Vulnerability Audit</h3>
                  <ul className="space-y-2.5 text-[11px] font-bold text-text-secondary-theme">
                    {resume.skills.length < 8 && (
                      <li className="flex items-start gap-2 text-warning-theme">
                        <span className="mt-0.5">✦</span> Skills index catalogue is sparse. Suggest expanding to at least 8 elements to trigger keyword tags.
                      </li>
                    )}
                    {!resume.personalInfo.linkedin && (
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 text-primary-theme">✦</span> Missing active LinkedIn profile handles decreases outreach shortlists by 18%.
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-primary-theme">✦</span> Work Experience bullet points have excellent action verbs. Structure is compliant with major parsers.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 11: Select Template */}
            {currentStep === 11 && (
              <div className="grid grid-cols-2 gap-4">
                {([
                  { key: 'Professional', desc: 'Classic double column header rules, timeless layout' },
                  { key: 'Modern', desc: 'Eye-catching slate sidebar with high contrast details' },
                  { key: 'Executive', desc: 'Navy layouts, authoritative and standard conservative' },
                  { key: 'Minimal', desc: 'Extreme whitespace utilization, light sans text' },
                  { key: 'Creative', desc: 'Playful background blocks, modern accent highlights' },
                  { key: 'Corporate', desc: 'Sleek borders, category tag bars, tech-forward feel' }
                ] as const).map(tpl => (
                  <button
                    key={tpl.key}
                    onClick={() => {
                      setResume({ ...resume, template: tpl.key });
                      addToast(`${tpl.key} Template selected! Check live preview.`, 'info');
                    }}
                    className={`p-4 border rounded-2xl text-left transition-all ${
                      resume.template === tpl.key ? 'border-primary-theme bg-primary-theme/5 shadow' : 'border-border-theme bg-surface-theme hover:shadow-md'
                    }`}
                  >
                    <strong className="text-xs font-black text-text-primary-theme uppercase tracking-wider block">{tpl.key} Layout</strong>
                    <p className="text-[10px] text-text-secondary-theme leading-normal mt-1">{tpl.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 12: Final Review */}
            {currentStep === 12 && (
              <div className="bg-surface-theme border border-border-theme rounded-2xl p-6 text-center space-y-6">
                <div className="w-16 h-16 bg-success-theme/10 text-success-theme rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-lg font-serif font-black text-text-primary-theme">Ats-Audit Check Pass!</h3>
                  <p className="text-xs text-text-secondary-theme max-w-sm mx-auto leading-relaxed mt-1">
                    Your resume has resolved structural checks. You can now download or lock in this draft to complete your TechnoAdviser Profile.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-3 px-4 bg-transparent border border-border-theme hover:bg-border-theme/20 text-text-secondary-theme font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print PDF Page
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex-1 py-3 px-4 bg-secondary-theme text-text-primary-theme hover:bg-border-theme/30 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-border-theme"
                  >
                    <Download className="w-4 h-4" /> Download Resume
                  </button>
                </div>

                <div className="border-t border-border-theme/40 pt-5 mt-4 max-w-md mx-auto">
                  <button
                    onClick={handleSaveAndComplete}
                    className="w-full py-3.5 bg-primary-theme hover:bg-primary-hover-theme text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4.5 h-4.5" /> Save Resume & Return to Portal
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Form Navigation Buttons */}
            <div className="flex justify-between items-center border-t border-border-theme/80 pt-5 mt-6">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-5 py-3 border border-border-theme rounded-xl text-xs font-black hover:bg-border-theme/20 text-text-secondary-theme cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="button"
                onClick={currentStep === 12 ? handleSaveAndComplete : handleNextStep}
                className="px-6 py-3 bg-primary-theme text-white rounded-xl text-xs font-black hover:bg-primary-hover-theme shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                {currentStep === 12 ? 'Finish & Save' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Live Printable Preview Paper */}
        <div className={`w-full lg:w-[480px] xl:w-[560px] bg-secondary-theme/20 p-5 shrink-0 overflow-y-auto border-l border-border-theme/80 flex flex-col items-center ${mobileShowPreview ? 'block' : 'hidden lg:flex'}`}>
          <div className="w-full flex items-center justify-between text-xs font-black uppercase text-text-secondary-theme mb-3">
            <span>Printable ATS Layout Preview</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-primary-theme/10 text-primary-theme px-2 py-0.5 rounded">
                {resume.template} Layout
              </span>
              <button onClick={handlePrint} title="Print Layout" className="hover:text-primary-theme">
                <Printer className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Printable Resume Paper Sheet */}
          <div
            id="printable-resume-paper"
            className="w-full bg-white text-black p-8 sm:p-10 rounded-xl shadow-2xl space-y-6 text-left border border-border-theme relative overflow-hidden"
            style={{
              fontFamily: resume.template === 'Minimal' ? 'ui-sans-serif, system-ui' : 'serif',
              minHeight: '720px'
            }}
          >
            {/* Header style configurations depending on selected Template */}
            
            {/* Template Option: Professional */}
            {resume.template === 'Professional' && (
              <div className="space-y-4">
                <div className="text-center border-b border-gray-300 pb-4 space-y-1">
                  <h1 className="text-2xl font-serif font-black tracking-tight uppercase">
                    {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                  </h1>
                  <h2 className="text-xs font-sans font-black text-primary-theme uppercase tracking-wider">
                    {resume.personalInfo.title}
                  </h2>
                  <div className="text-[10px] font-sans text-gray-500 font-bold flex flex-wrap justify-center gap-x-2.5 gap-y-1">
                    <span>{resume.personalInfo.email}</span>
                    <span>&bull;</span>
                    <span>{resume.personalInfo.phone}</span>
                    <span>&bull;</span>
                    <span>{resume.personalInfo.city}, {resume.personalInfo.state}</span>
                  </div>
                  {(resume.personalInfo.linkedin || resume.personalInfo.github) && (
                    <div className="text-[9px] font-mono text-gray-400 flex justify-center gap-3">
                      {resume.personalInfo.linkedin && <span>LI: {resume.personalInfo.linkedin}</span>}
                      {resume.personalInfo.github && <span>GH: {resume.personalInfo.github}</span>}
                    </div>
                  )}
                </div>

                {/* Professional Body summary */}
                {resume.personalInfo.summary && (
                  <div className="space-y-1">
                    <h3 className="text-[11px] font-sans font-black uppercase tracking-wider border-b border-gray-200 pb-1 text-primary-theme">
                      Professional Summary
                    </h3>
                    <p className="text-[10px] text-gray-700 leading-relaxed font-serif">
                      {resume.personalInfo.summary}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Template Option: Modern */}
            {resume.template === 'Modern' && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 border-r border-gray-100 pr-4 space-y-5">
                  <div className="space-y-1">
                    <h1 className="text-base font-serif font-black leading-tight">
                      {resume.personalInfo.firstName} <br /> {resume.personalInfo.lastName}
                    </h1>
                    <span className="text-[9px] font-sans font-black text-primary-theme uppercase block">
                      {resume.personalInfo.title}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-[9px] font-sans text-gray-600 font-bold">
                    <h3 className="text-[10px] uppercase font-black text-gray-800 border-b pb-0.5">Contact</h3>
                    <div className="truncate">{resume.personalInfo.email}</div>
                    <div>{resume.personalInfo.phone}</div>
                    <div>{resume.personalInfo.city}, {resume.personalInfo.country}</div>
                  </div>

                  {resume.skills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-[10px] uppercase font-black text-gray-800 border-b pb-0.5">Core Index</h3>
                      <div className="flex flex-wrap gap-1">
                        {resume.skills.map(s => (
                          <span key={s.id} className="px-1.5 py-0.5 bg-gray-100 text-[8px] font-black uppercase text-gray-700 rounded">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-8 space-y-4">
                  {resume.personalInfo.summary && (
                    <p className="text-[10px] text-gray-700 leading-relaxed font-serif">
                      {resume.personalInfo.summary}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Template Option: Executive */}
            {resume.template === 'Executive' && (
              <div className="space-y-4">
                <div className="text-center space-y-1.5">
                  <h1 className="text-2xl font-serif font-black tracking-widest uppercase text-slate-800">
                    {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                  </h1>
                  <h2 className="text-xs font-sans font-black tracking-widest text-slate-500 uppercase border-y border-slate-300 py-1 max-w-sm mx-auto">
                    {resume.personalInfo.title}
                  </h2>
                  <div className="text-[9px] font-sans text-slate-500 font-bold flex justify-center gap-4 pt-1">
                    <span>{resume.personalInfo.email}</span>
                    <span>&bull;</span>
                    <span>{resume.personalInfo.phone}</span>
                    <span>&bull;</span>
                    <span>{resume.personalInfo.city}, {resume.personalInfo.state}</span>
                  </div>
                </div>

                {resume.personalInfo.summary && (
                  <div className="space-y-1 pt-2">
                    <h3 className="text-[10px] font-sans font-black uppercase tracking-widest border-b border-slate-300 pb-0.5 text-slate-800">
                      Executive Summary
                    </h3>
                    <p className="text-[10px] text-gray-700 leading-relaxed font-serif whitespace-pre-line">
                      {resume.personalInfo.summary}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Template Option: Minimal */}
            {resume.template === 'Minimal' && (
              <div className="space-y-5">
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <h1 className="text-xl font-sans font-bold tracking-tight">
                      {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                    </h1>
                    <span className="text-xs font-sans text-gray-500 font-medium">
                      {resume.personalInfo.title}
                    </span>
                  </div>
                  <div className="text-[9px] text-right font-mono text-gray-500 space-y-0.5">
                    <div>{resume.personalInfo.email}</div>
                    <div>{resume.personalInfo.phone}</div>
                    <div>{resume.personalInfo.city}</div>
                  </div>
                </div>

                {resume.personalInfo.summary && (
                  <p className="text-[10px] text-gray-600 leading-relaxed font-sans">
                    {resume.personalInfo.summary}
                  </p>
                )}
              </div>
            )}

            {/* Template Option: Creative */}
            {resume.template === 'Creative' && (
              <div className="space-y-4">
                <div className="bg-primary-theme/10 p-5 rounded-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <h1 className="text-xl font-serif font-black tracking-tight text-text-primary-theme">
                      {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                    </h1>
                    <span className="text-xs font-sans font-black text-primary-theme uppercase tracking-wider">
                      {resume.personalInfo.title}
                    </span>
                  </div>
                  <div className="text-[9px] text-right text-gray-600 font-bold space-y-0.5 font-sans">
                    <div>{resume.personalInfo.email}</div>
                    <div>{resume.personalInfo.phone}</div>
                    <div>{resume.personalInfo.city}</div>
                  </div>
                </div>

                {resume.personalInfo.summary && (
                  <p className="text-[10px] text-gray-700 leading-relaxed font-serif bg-gray-50 p-3 rounded-lg border-l-4 border-primary-theme">
                    {resume.personalInfo.summary}
                  </p>
                )}
              </div>
            )}

            {/* Template Option: Corporate */}
            {resume.template === 'Corporate' && (
              <div className="space-y-4">
                <div className="border-l-8 border-slate-700 pl-4 py-1.5 space-y-1">
                  <h1 className="text-xl font-sans font-black uppercase tracking-wider text-slate-800">
                    {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                  </h1>
                  <h2 className="text-xs font-mono font-bold text-slate-500 uppercase">
                    {resume.personalInfo.title}
                  </h2>
                  <div className="text-[9px] font-sans text-slate-500 font-bold flex gap-3">
                    <span>{resume.personalInfo.email} &bull; {resume.personalInfo.phone}</span>
                    <span>{resume.personalInfo.city}, {resume.personalInfo.country}</span>
                  </div>
                </div>

                {resume.personalInfo.summary && (
                  <p className="text-[10px] text-slate-700 leading-relaxed font-serif whitespace-pre-line">
                    {resume.personalInfo.summary}
                  </p>
                )}
              </div>
            )}

            {/* Shared Printable Resume Body Modules */}
            
            {/* Experience printable Block */}
            {resume.experiences.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[10px] font-sans font-black uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-0.5">
                  Professional Experience
                </h3>
                <div className="space-y-3">
                  {resume.experiences.map(exp => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>{exp.role} &bull; <strong className="font-extrabold text-slate-800">{exp.company}</strong></span>
                        <span className="text-[9px] font-mono text-gray-500 shrink-0">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <div className="text-[9px] font-sans text-gray-500">{exp.location}</div>
                      <p className="text-[9px] text-gray-600 leading-relaxed whitespace-pre-line pl-2 border-l border-gray-100">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educations printable Block */}
            {resume.educations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[10px] font-sans font-black uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-0.5">
                  Education
                </h3>
                <div className="space-y-2">
                  {resume.educations.map(edu => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>{edu.degree} in {edu.fieldOfStudy}</span>
                        <span className="text-[9px] font-mono text-gray-500 shrink-0">Class of {edu.passingYear}</span>
                      </div>
                      <div className="text-[9px] text-gray-500 font-sans">{edu.school} &bull; {edu.grade}</div>
                      {edu.achievements && <p className="text-[9px] text-gray-600 leading-relaxed font-serif">{edu.achievements}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Printable block (Double Column if not side-aligned already) */}
            {resume.template !== 'Modern' && resume.skills.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-sans font-black uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-0.5">
                  Skills Catalogue
                </h3>
                <div className="text-[9px] font-sans text-gray-600 font-bold flex flex-wrap gap-x-3 gap-y-1 leading-normal">
                  {resume.skills.map(s => (
                    <span key={s.id}>
                      {s.name} <span className="text-gray-400 font-normal">({s.level})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Printable block */}
            {resume.projects.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[10px] font-sans font-black uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-0.5">
                  Key Projects
                </h3>
                <div className="space-y-2.5">
                  {resume.projects.map(p => (
                    <div key={p.id} className="space-y-0.5 text-[9px] leading-relaxed">
                      <div className="flex justify-between font-bold text-[10px]">
                        <span>{p.name} &bull; <strong className="font-medium text-gray-500">{p.role}</strong></span>
                        <span className="text-[9px] font-mono text-gray-400">{p.duration}</span>
                      </div>
                      <p className="text-gray-600 font-serif">{p.description}</p>
                      {p.techUsed.length > 0 && (
                        <div className="text-gray-400 font-mono text-[8px]">
                          Tech stack: {p.techUsed.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications printable */}
            {resume.certifications.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-sans font-black uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-0.5">
                  Certifications
                </h3>
                <div className="space-y-1 text-[9px]">
                  {resume.certifications.map(c => (
                    <div key={c.id} className="flex justify-between">
                      <span className="font-bold text-gray-700">{c.name} &bull; <span className="font-normal text-gray-500">{c.org}</span></span>
                      <span className="font-mono text-gray-400">{c.issueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements printable */}
            {resume.achievements.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-sans font-black uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-0.5">
                  Honors & Achievements
                </h3>
                <div className="space-y-1 text-[9px]">
                  {resume.achievements.map(a => (
                    <div key={a.id} className="space-y-0.5">
                      <div className="flex justify-between font-bold text-gray-700">
                        <span>{a.title}</span>
                        <span className="font-mono text-gray-400">{a.date}</span>
                      </div>
                      {a.description && <p className="text-gray-500 font-serif">{a.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages printable */}
            {resume.languages.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-[10px] font-sans font-black uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-0.5">
                  Languages
                </h3>
                <div className="text-[9px] font-sans text-gray-600 font-bold flex gap-4">
                  {resume.languages.map(l => (
                    <span key={l.id}>{l.name} &bull; <span className="font-normal text-gray-400">{l.proficiency}</span></span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
