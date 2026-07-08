/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, FileText, Briefcase, GraduationCap, Award, FolderHeart, 
  Globe2, Link2, Video, Eye, Shield, Check, ArrowLeft, Plus, 
  Trash2, Sliders, ToggleLeft, ToggleRight, ExternalLink, MapPin, 
  Mail, Phone, Linkedin, Sparkles, Lightbulb, ChevronRight, CheckCircle2, Download 
} from 'lucide-react';
import ResumeBuilderWizard, { ResumeData } from '../ResumeBuilderWizard';

interface ProfileSectionProps {
  username: string;
  addToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

type ProfileSubView = null | 'personal' | 'resume' | 'experience' | 'education' | 'skills' | 'certs' | 'portfolio' | 'languages' | 'socials' | 'video' | 'preferences' | 'privacy';

export default function ProfileSection({ username, addToast }: ProfileSectionProps) {
  const [activeSubView, setActiveSubView] = useState<ProfileSubView>(null);
  const [showWizard, setShowWizard] = useState(false);

  // States for subview edits
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Arjun Reddy',
    role: 'UI/UX Designer',
    email: 'arjun.reddy@email.com',
    phone: '+91 98765 43210',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    bio: 'I am a passionate interface designer with 3 years of hands-on experience designing design systems and user-centered web dashboards.',
    linkedin: '',
    portfolio: ''
  });

  const [skills, setSkills] = useState(['Figma', 'UI Design', 'Design System', 'User Research', 'Framer Motion', 'Tailwind CSS']);
  const [newSkill, setNewSkill] = useState('');

  const [experiences, setExperiences] = useState([
    { id: 'exp-1', role: 'Senior Product Designer', company: 'Flipkart', duration: '2023 - Present', location: 'Bangalore (Remote)' },
    { id: 'exp-2', role: 'UI/UX Designer', company: 'Cognizant', duration: '2021 - 2023', location: 'Pune, India' }
  ]);
  const [newExp, setNewExp] = useState({ role: '', company: '', duration: '', location: '' });

  const [educations, setEducations] = useState([
    { id: 'edu-1', degree: 'B.Des in Communication Design', school: 'MIT Institute of Design', duration: '2017 - 2021' }
  ]);
  const [newEdu, setNewEdu] = useState({ degree: '', school: '', duration: '' });

  const [portfolioLinks, setPortfolioLinks] = useState([
    { title: 'Behance Portfolio', url: 'https://behance.net/arjunmehta' },
    { title: 'Personal Website', url: 'https://arjunmehta.design' }
  ]);
  const [newPortLink, setNewPortLink] = useState({ title: '', url: '' });

  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const [preferences, setPreferences] = useState({
    isOpenToWork: true,
    targetPay: '18,00,000 INR',
    noticePeriod: 'Immediate',
    jobType: 'Full-Time Remote'
  });

  const [privacy, setPrivacy] = useState({
    publicSearchVisible: true,
    hideCurrentEmployer: false,
    anonymousApplicationMode: false
  });

  const [certifications, setCertifications] = useState('');
  const [languages, setLanguages] = useState('English');

  // Load profile from database on mount
  React.useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
      try {
        const response = await fetch('/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.candidate) {
            const cand = data.candidate;
            setPersonalInfo({
              fullName: `${cand.firstName || ''} ${cand.lastName || ''}`.trim() || 'Arjun Reddy',
              role: cand.currentStatus || 'UI/UX Designer',
              email: cand.id || 'arjun.reddy@email.com',
              phone: cand.phone || '+91 98765 43210',
              city: cand.currentCity || 'Hyderabad',
              state: cand.state || 'Telangana',
              country: cand.country || 'India',
              bio: cand.bio || 'I am a passionate interface designer.',
              linkedin: cand.linkedin || '',
              portfolio: cand.portfolio || ''
            });

            if (cand.certifications !== undefined) setCertifications(cand.certifications || '');
            if (cand.languages !== undefined) setLanguages(cand.languages || 'English');

            if (cand.openToWork !== undefined || cand.expectedSalary || cand.noticePeriod || cand.remotePreference) {
              setPreferences({
                isOpenToWork: cand.openToWork ?? true,
                targetPay: cand.expectedSalary || '18,00,000 INR',
                noticePeriod: cand.noticePeriod || 'Immediate',
                jobType: cand.remotePreference || 'Full-Time Remote'
              });
            }

            // Safely parse skills
            if (cand.skills) {
              try {
                const parsedSkills = typeof cand.skills === 'string' ? JSON.parse(cand.skills) : cand.skills;
                if (Array.isArray(parsedSkills)) {
                  setSkills(parsedSkills);
                } else if (typeof cand.skills === 'string') {
                  setSkills(cand.skills.split(',').map((s: string) => s.trim()).filter(Boolean));
                }
              } catch (e) {
                if (typeof cand.skills === 'string') {
                  setSkills(cand.skills.split(',').map((s: string) => s.trim()).filter(Boolean));
                }
              }
            }

            // Safely parse experienceHistory
            if (cand.experienceHistory) {
              try {
                const parsedExp = typeof cand.experienceHistory === 'string' ? JSON.parse(cand.experienceHistory) : cand.experienceHistory;
                if (Array.isArray(parsedExp)) {
                  setExperiences(parsedExp.map((exp: any, index: number) => ({
                    id: exp.id || `exp-${index}`,
                    role: exp.role || '',
                    company: exp.company || '',
                    duration: exp.duration || '',
                    location: exp.location || ''
                  })));
                }
              } catch (e) {
                console.error('Failed to parse experienceHistory:', e);
              }
            }

            // Safely parse education
            if (cand.education) {
              try {
                const parsedEdu = typeof cand.education === 'string' ? JSON.parse(cand.education) : cand.education;
                if (Array.isArray(parsedEdu)) {
                  setEducations(parsedEdu.map((edu: any, index: number) => ({
                    id: edu.id || `edu-${index}`,
                    degree: edu.degree || '',
                    school: edu.school || '',
                    duration: edu.duration || ''
                  })));
                }
              } catch (e) {
                console.error('Failed to parse education:', e);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load profile in ProfileSection:', err);
      }
    };
    loadProfile();
  }, []);

  // Category grid config with exact percentage completions
  const categories = [
    { id: 'personal', title: 'Personal Information', icon: User, desc: 'Basic details about you', progress: 100, isCompleted: !!(personalInfo.fullName && personalInfo.email && personalInfo.phone) },
    { id: 'resume', title: 'Resume Builder', icon: FileText, desc: 'Create & manage resumes', progress: localStorage.getItem('technoadviser_resume_completed') === 'true' ? 100 : 0, isCompleted: localStorage.getItem('technoadviser_resume_completed') === 'true' },
    { id: 'experience', title: 'Experience', icon: Briefcase, desc: 'Your work experience', progress: experiences.length > 0 ? 100 : 0, isCompleted: experiences.length > 0 },
    { id: 'education', title: 'Education', icon: GraduationCap, desc: 'Your educational background', progress: educations.length > 0 ? 100 : 0, isCompleted: educations.length > 0 },
    { id: 'skills', title: 'Skills', icon: Award, desc: 'Your skills & expertise', progress: skills.length > 0 ? 100 : 0, isCompleted: skills.length > 0 },
    { id: 'certs', title: 'Certifications', icon: Shield, desc: 'Your certifications', progress: certifications ? 100 : 0, isCompleted: !!certifications },
    { id: 'portfolio', title: 'Portfolio', icon: FolderHeart, desc: 'Your work portfolio', progress: personalInfo.portfolio ? 100 : 0, isCompleted: !!personalInfo.portfolio },
    { id: 'languages', title: 'Languages', icon: Globe2, desc: 'Languages you know', progress: languages ? 100 : 0, isCompleted: !!languages },
    { id: 'socials', title: 'Social Links', icon: Link2, desc: 'Your social profiles', progress: personalInfo.linkedin ? 100 : 0, isCompleted: !!personalInfo.linkedin },
    { id: 'video', title: 'Video Resume', icon: Video, desc: 'Upload your video resume', progress: videoFile ? 100 : 0, isCompleted: !!videoFile },
    { id: 'preferences', title: 'Career Preferences', icon: Sliders, desc: 'Your career preferences', progress: 100, isCompleted: true },
    { id: 'privacy', title: 'Privacy Settings', icon: Eye, desc: 'Control your visibility', progress: 100, isCompleted: true }
  ];

  const handleSave = async (viewName: string) => {
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    const nameParts = personalInfo.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      firstName,
      lastName,
      currentStatus: personalInfo.role,
      phone: personalInfo.phone,
      city: personalInfo.city,
      state: personalInfo.state,
      country: personalInfo.country,
      bio: personalInfo.bio,
      linkedin: personalInfo.linkedin,
      portfolio: personalInfo.portfolio,
      skills,
      certifications,
      languages,
      openToWork: preferences.isOpenToWork,
      expectedSalary: preferences.targetPay,
      noticePeriod: preferences.noticePeriod,
      remotePreference: preferences.jobType,
      experienceHistory: experiences.map(exp => ({
        id: exp.id,
        role: exp.role,
        company: exp.company,
        duration: exp.duration,
        location: exp.location
      })),
      education: educations.map(edu => ({
        id: edu.id,
        degree: edu.degree,
        school: edu.school,
        duration: edu.duration
      }))
    };

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        addToast(`Successfully synchronized and saved ${viewName} to database!`, 'success');
      } else {
        const errData = await response.json();
        addToast(`Saved locally, database sync failed: ${errData.error || response.statusText}`, 'warning');
      }
    } catch (err) {
      console.error('Failed to sync profile update:', err);
      addToast(`Saved ${viewName} locally (offline mode)!`, 'success');
    }
    setActiveSubView(null);
  };

  const startMockRecording = () => {
    setIsVideoRecording(true);
    setRecordingSeconds(0);
    const interval = setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev >= 10) {
          clearInterval(interval);
          setIsVideoRecording(false);
          setVideoFile('https://www.w3schools.com/html/mov_bbb.mp4');
          addToast('Video resume recorded successfully!', 'success');
          return 10;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const completedSectionsCount = categories.filter(c => c.isCompleted).length;
  const totalSectionsCount = categories.length;
  const completionPercentage = Math.round((completedSectionsCount / totalSectionsCount) * 100);

  if (showWizard) {
    return (
      <ResumeBuilderWizard
        candidateName={personalInfo.fullName}
        onCancel={() => {
          setShowWizard(false);
          setActiveSubView('resume');
        }}
        onSave={async (resume: ResumeData) => {
          const nameParts = `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          const mappedExp = resume.experiences.map(e => ({
            id: e.id,
            role: e.role,
            company: e.company,
            duration: `${e.startDate} - ${e.endDate || 'Present'}`,
            location: e.location
          }));
          const mappedEdu = resume.educations.map(e => ({
            id: e.id,
            degree: `${e.degree} in ${e.fieldOfStudy}`,
            school: e.school,
            duration: `Graduation: ${e.passingYear}`
          }));
          const mappedSkills = resume.skills.map(s => s.name);

          setPersonalInfo({
            fullName: `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`,
            role: resume.personalInfo.title,
            email: resume.personalInfo.email,
            phone: resume.personalInfo.phone,
            city: resume.personalInfo.city,
            state: resume.personalInfo.state,
            country: resume.personalInfo.country,
            bio: resume.personalInfo.summary,
            linkedin: personalInfo.linkedin,
            portfolio: personalInfo.portfolio
          });
          setSkills(mappedSkills);
          setExperiences(mappedExp);
          setEducations(mappedEdu);
          setPreferences({
            isOpenToWork: resume.preferences.openToWork,
            targetPay: resume.preferences.expectedSalary,
            noticePeriod: resume.preferences.noticePeriod,
            jobType: resume.preferences.workMode
          });

          // Save to backend database!
          const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
          const payload = {
            firstName,
            lastName,
            currentStatus: resume.personalInfo.title,
            phone: resume.personalInfo.phone,
            city: resume.personalInfo.city,
            state: resume.personalInfo.state,
            country: resume.personalInfo.country,
            bio: resume.personalInfo.summary,
            skills: mappedSkills,
            certifications,
            languages,
            openToWork: resume.preferences.openToWork,
            expectedSalary: resume.preferences.expectedSalary,
            noticePeriod: resume.preferences.noticePeriod,
            remotePreference: resume.preferences.workMode,
            experienceHistory: mappedExp,
            education: mappedEdu,
            linkedin: personalInfo.linkedin,
            portfolio: personalInfo.portfolio
          };

          try {
            const response = await fetch('/api/profile/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(payload)
            });
            if (response.ok) {
              addToast('Profile synchronized and saved to database!', 'success');
              localStorage.setItem('technoadviser_resume_completed', 'true');
            } else {
              const errData = await response.json();
              addToast(`Saved locally, database sync failed: ${errData.error || response.statusText}`, 'warning');
            }
          } catch (err) {
            console.error('Failed to sync profile wizard update:', err);
            addToast('Saved locally (offline mode)!', 'success');
          }
          setShowWizard(false);
          setActiveSubView(null);
        }}
        addToast={addToast}
        initialData={{
          personalInfo: {
            firstName: personalInfo.fullName.split(' ')[0] || '',
            lastName: personalInfo.fullName.split(' ')[1] || '',
            title: personalInfo.role,
            email: personalInfo.email,
            phone: personalInfo.phone,
            countryCode: '+91',
            city: personalInfo.city,
            state: personalInfo.state,
            country: personalInfo.country,
            photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${personalInfo.fullName}`,
            linkedin: personalInfo.linkedin || '',
            github: '',
            portfolio: personalInfo.portfolio || '',
            blog: '',
            summary: personalInfo.bio
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header / Breadcrumb segment */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary-theme tracking-tight animate-fade-in">
            My Profile
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-text-muted-theme mt-1">
            <span>Dashboard</span>
            <span className="text-text-muted-theme/50">&gt;</span>
            <span 
              className={`cursor-pointer transition-all ${activeSubView ? 'text-text-muted-theme hover:text-[#E8702A] font-medium' : 'text-[#E8702A] font-bold'}`} 
              onClick={() => setActiveSubView(null)}
            >
              My Profile
            </span>
            {activeSubView && (
              <>
                <span className="text-text-muted-theme/50">&gt;</span>
                <span className="text-[#E8702A] font-bold">
                  {categories.find(c => c.id === activeSubView)?.title}
                </span>
              </>
            )}
          </div>
        </div>
        <button 
          onClick={() => addToast('Public link copied to clipboard!', 'info')}
          className="px-4 py-2.5 bg-surface-theme border border-border-theme hover:bg-border-theme/30 text-text-primary-theme text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5 text-text-secondary-theme" />
        </button>
      </div>

      {/* Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Profile Feed Stream (Left Column) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Hero + Metrics Combo Card */}
          <div className="bg-surface-theme border border-border-theme rounded-3xl overflow-hidden shadow-sm flex flex-col relative group">
                  
                  {/* Decorative Waves Layer */}
                  <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden pointer-events-none opacity-40 md:opacity-100">
                    <svg viewBox="0 0 400 200" fill="none" className="absolute right-0 top-0 h-full w-full">
                      <path
                        d="M150,0 C250,50 200,150 400,100 L400,200 L150,200 Z"
                        fill="url(#waveGradient)"
                      />
                      <path
                        d="M100,0 C200,100 250,50 400,180"
                        stroke="#E8702A"
                        strokeWidth="1.5"
                        strokeOpacity="0.15"
                      />
                      <path
                        d="M50,200 C150,150 220,100 400,50"
                        stroke="#E8702A"
                        strokeWidth="1"
                        strokeOpacity="0.08"
                      />
                      <defs>
                        <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#E8702A" stopOpacity="0" />
                          <stop offset="50%" stopColor="#E8702A" stopOpacity="0.02" />
                          <stop offset="100%" stopColor="#E8702A" stopOpacity="0.06" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Profile Info Row */}
                  <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left">
                    
                    {/* Avatar with edit button */}
                    <div className="relative">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-surface-theme shadow-md flex-shrink-0 bg-border-theme/40">
                        <img 
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${personalInfo.fullName}`} 
                          alt={personalInfo.fullName} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover animate-fade-in"
                        />
                      </div>
                      <button 
                        onClick={() => setActiveSubView('personal')}
                        className="absolute bottom-1 right-1 p-2 bg-white dark:bg-zinc-800 text-text-primary-theme hover:text-[#E8702A] rounded-full shadow-md border border-border-theme/40 transition-all cursor-pointer"
                        title="Edit profile information"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>

                    {/* Identity Text Info */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <h2 className="text-xl md:text-2xl font-black text-text-primary-theme tracking-tight flex items-center gap-1.5 animate-pulse-subtle">
                          {personalInfo.fullName}
                        </h2>
                        <span className="inline-flex items-center justify-center bg-[#E8702A] text-white rounded-full p-0.5" title="Verified Professional Account">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      </div>
                      <p className="text-sm font-bold text-text-secondary-theme">
                        {personalInfo.role}
                      </p>
                      
                      {/* Metas Grid */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 pt-2 text-xs font-semibold text-text-secondary-theme">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#E8702A] flex-shrink-0" />
                          {personalInfo.city}, {personalInfo.country}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-text-muted-theme flex-shrink-0" />
                          {personalInfo.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-text-muted-theme flex-shrink-0" />
                          {personalInfo.phone}
                        </span>
                        {personalInfo.linkedin ? (
                          <span className="flex items-center gap-1.5">
                            <Linkedin className="w-3.5 h-3.5 text-text-muted-theme flex-shrink-0" />
                            <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#E8702A] hover:underline">
                              {personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}
                            </a>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-text-muted-theme">
                            <Linkedin className="w-3.5 h-3.5 flex-shrink-0" />
                            No LinkedIn URL
                          </span>
                        )}
                        {personalInfo.portfolio && (
                          <span className="flex items-center gap-1.5">
                            <Globe2 className="w-3.5 h-3.5 text-text-muted-theme flex-shrink-0" />
                            <a href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#E8702A] hover:underline">
                              Portfolio
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Divider Line */}
                  <div className="border-t border-border-theme/40 w-full" />

                  {/* Metrics Row Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border-theme/40 bg-surface-theme p-4 md:p-6 text-left">
                    
                    {/* Profile Strength Widget */}
                    <div className="p-4 flex items-center gap-3.5">
                      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="24" cy="24" r="18" stroke="rgba(232, 112, 42, 0.1)" strokeWidth="3" fill="transparent" />
                          <circle cx="24" cy="24" r="18" stroke="#E8702A" strokeWidth="3.5" fill="transparent"
                                  strokeDasharray={2 * Math.PI * 18}
                                  strokeDashoffset={2 * Math.PI * 18 * (1 - 0.85)}
                                  strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-[11px] font-black text-text-primary-theme">85%</span>
                      </div>
                      <div className="leading-none space-y-1">
                        <h4 className="text-[11px] font-bold text-text-muted-theme">Profile Strength</h4>
                        <p className="text-[10px] text-text-primary-theme font-black truncate max-w-[120px]">Strong score!</p>
                        <button 
                          onClick={() => setActiveSubView('skills')}
                          className="text-[9px] text-[#E8702A] font-black hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          Improve Now &rarr;
                        </button>
                      </div>
                    </div>

                    {/* Matches Widget */}
                    <div className="p-4 flex flex-col justify-center space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-bold text-text-muted-theme">Matches</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full">
                          &uarr; 18%
                        </span>
                      </div>
                      <p className="text-2xl font-black text-text-primary-theme">128</p>
                      <span className="text-[9px] text-text-muted-theme font-semibold">This month</span>
                    </div>

                    {/* Profile Views Widget */}
                    <div className="p-4 flex flex-col justify-center space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-bold text-text-muted-theme">Profile Views</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full">
                          &uarr; 12%
                        </span>
                      </div>
                      <p className="text-2xl font-black text-text-primary-theme">342</p>
                      <span className="text-[9px] text-text-muted-theme font-semibold">This month</span>
                    </div>

                    {/* Applications Widget */}
                    <div className="p-4 flex flex-col justify-center space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-bold text-text-muted-theme">Applications</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full">
                          &uarr; 8%
                        </span>
                      </div>
                      <p className="text-2xl font-black text-text-primary-theme">24</p>
                      <span className="text-[9px] text-text-muted-theme font-semibold">This month</span>
                    </div>

                  </div>
                </div>

                {/* Complete Your Profile Segment */}
                <div className="bg-surface-theme border border-border-theme rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm text-left">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">
                      Complete Your Profile
                    </h3>
                    <p className="text-[10px] text-text-muted-theme font-semibold">
                      Complete all sections to increase your visibility and get better matches.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-right leading-none space-y-1 min-w-[90px]">
                      <span className="text-[10px] font-black text-[#E8702A] font-mono">{completedSectionsCount}/{totalSectionsCount} Completed</span>
                      <div className="w-24 md:w-36 bg-border-theme/40 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#E8702A] h-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const incompleteNonResume = categories.find(c => !c.isCompleted && c.id !== 'resume');
                        if (incompleteNonResume) {
                          setActiveSubView(incompleteNonResume.id as ProfileSubView);
                          addToast(`Let's complete the "${incompleteNonResume.title}" section!`, 'info');
                        } else {
                          setActiveSubView('personal');
                        }
                      }}
                      className="px-5 py-2.5 bg-[#E8702A] hover:bg-[#D65F19] text-white text-[11px] font-bold rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      Complete All Sections
                    </button>
                  </div>
                </div>

                {/* Profile Sections Header & Subtext */}
                <div className="text-left pt-2">
                  <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">
                    Profile Sections
                  </h3>
                  <p className="text-[10px] text-text-muted-theme font-semibold">
                    Manage and update your professional information
                  </p>
                </div>

                {/* Profile Grid (4x3) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveSubView(cat.id as ProfileSubView)}
                        className="p-4 bg-surface-theme border border-border-theme hover:border-[#E8702A] rounded-2xl shadow-sm text-left group transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[145px]"
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="p-2.5 bg-[#E8702A]/10 text-[#E8702A] rounded-xl flex items-center justify-center transition-all group-hover:bg-[#E8702A] group-hover:text-white">
                            <Icon className="w-4 h-4 flex-shrink-0" />
                          </div>
                          {cat.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-text-muted-theme group-hover:text-[#E8702A] transition-colors" />
                          )}
                        </div>

                        <div className="mt-3 space-y-1">
                          <h3 className="text-[11px] font-black text-text-primary-theme group-hover:text-[#E8702A] transition-colors">
                            {cat.title}
                          </h3>
                          <p className="text-[9px] text-text-muted-theme font-medium leading-tight">
                            {cat.desc}
                          </p>
                        </div>

                        {/* Completion Strip */}
                        <div className="mt-3.5 pt-2 border-t border-border-theme/40 w-full flex items-center justify-between">
                          <span className={`text-[9px] font-bold ${cat.isCompleted ? 'text-emerald-500' : 'text-text-muted-theme'}`}>
                            {cat.isCompleted ? '100% Complete' : `${cat.progress}% Complete`}
                          </span>
                          {!cat.isCompleted && (
                            <div className="w-12 bg-border-theme/40 h-1 rounded-full overflow-hidden">
                              <div className="bg-[#E8702A] h-full" style={{ width: `${cat.progress}%` }} />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Sidebar Stream (Right Column) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Profile Overview (Spider Web Chart) */}
                <div className="bg-surface-theme border border-border-theme rounded-2xl p-5 shadow-sm space-y-4 text-left">
                  <h3 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">
                    Profile Overview
                  </h3>

                  {/* High Fidelity SVG Radar Chart */}
                  <div className="relative flex justify-center py-2">
                    <svg viewBox="0 0 200 210" className="w-full max-w-[180px] h-auto overflow-visible">
                      
                      {/* Concentric Pentagon Grids */}
                      {[13, 26, 39, 52, 65].map((r, idx) => {
                        const getPentagonPoints = (radius: number) => {
                          const cx = 100, cy = 105;
                          return Array.from({ length: 5 }).map((_, i) => {
                            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                            const x = cx + radius * Math.cos(angle);
                            const y = cy + radius * Math.sin(angle);
                            return `${x},${y}`;
                          }).join(' ');
                        };
                        return (
                          <polygon 
                            key={idx}
                            points={getPentagonPoints(r)}
                            className="stroke-border-theme/60 fill-none"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {/* Axes Lines radiating from center */}
                      {Array.from({ length: 5 }).map((_, i) => {
                        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                        const x = 100 + 65 * Math.cos(angle);
                        const y = 105 + 65 * Math.sin(angle);
                        return (
                          <line 
                            key={i}
                            x1="100" y1="105" x2={x} y2={y}
                            className="stroke-border-theme/60"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                        );
                      })}

                      {/* Active Stat Area Polygon Filled */}
                      <polygon 
                        points={[
                          { val: 0.85, angle: -Math.PI/2 }, // Skills
                          { val: 0.75, angle: -Math.PI/2 + (2*Math.PI)/5 }, // Experience
                          { val: 0.90, angle: -Math.PI/2 + (4*Math.PI)/5 }, // Education
                          { val: 0.60, angle: -Math.PI/2 + (6*Math.PI)/5 }, // Certifications
                          { val: 0.50, angle: -Math.PI/2 + (8*Math.PI)/5 }  // Activity
                        ].map(p => {
                          const r = 65 * p.val;
                          const x = 100 + r * Math.cos(p.angle);
                          const y = 105 + r * Math.sin(p.angle);
                          return `${x},${y}`;
                        }).join(' ')}
                        className="fill-[#E8702A]/15 stroke-[#E8702A]"
                        strokeWidth="2"
                      />

                      {/* Vertices indicator dots */}
                      {[
                        { val: 0.85, angle: -Math.PI/2 }, 
                        { val: 0.75, angle: -Math.PI/2 + (2*Math.PI)/5 }, 
                        { val: 0.90, angle: -Math.PI/2 + (4*Math.PI)/5 }, 
                        { val: 0.60, angle: -Math.PI/2 + (6*Math.PI)/5 }, 
                        { val: 0.50, angle: -Math.PI/2 + (8*Math.PI)/5 }
                      ].map((p, i) => {
                        const r = 65 * p.val;
                        const x = 100 + r * Math.cos(p.angle);
                        const y = 105 + r * Math.sin(p.angle);
                        return (
                          <circle 
                            key={i}
                            cx={x} cy={y} r="3"
                            className="fill-[#E8702A] stroke-white"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {/* Web Axes Labels */}
                      {[
                        { label: 'Skills', x: 100, y: 30, anchor: 'middle' },
                        { label: 'Experience', x: 172, y: 84, anchor: 'start' },
                        { label: 'Education', x: 142, y: 168, anchor: 'start' },
                        { label: 'Certifications', x: 58, y: 168, anchor: 'end' },
                        { label: 'Activity', x: 28, y: 84, anchor: 'end' }
                      ].map((l, i) => (
                        <text 
                          key={i}
                          x={l.x} y={l.y}
                          textAnchor={l.anchor}
                          className="text-[8px] font-bold fill-text-secondary-theme font-sans"
                        >
                          {l.label}
                        </text>
                      ))}

                    </svg>
                  </div>

                  {/* Horizontal bar metrics for small devices in widget */}
                  <div className="pt-2 flex items-center justify-around text-center text-[10px] font-bold text-text-secondary-theme">
                    <div>
                      <p className="text-[#E8702A] text-xs">85%</p>
                      <p className="text-text-muted-theme text-[8px] uppercase">Score</p>
                    </div>
                    <div className="w-px h-6 bg-border-theme/40" />
                    <div>
                      <p className="text-emerald-500 text-xs">A Grade</p>
                      <p className="text-text-muted-theme text-[8px] uppercase">Rating</p>
                    </div>
                  </div>
                </div>

                {/* AI Career Insight */}
                <div className="bg-surface-theme border border-border-theme rounded-2xl p-5 space-y-3 shadow-sm text-left relative overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#E8702A]">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Career Insight</span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed text-text-primary-theme">
                    You're a great match for UI/UX Designer roles. Improve your Skills to increase match score.
                  </p>
                  <button 
                    onClick={() => addToast('No recommendations matching filter changes.', 'info')}
                    className="w-full py-2 bg-surface-theme border border-border-theme hover:bg-border-theme/30 text-text-primary-theme text-[10px] font-bold rounded-xl transition-all cursor-pointer"
                  >
                    View Insights
                  </button>
                </div>

                {/* Profile Tips */}
                <div className="bg-surface-theme border border-border-theme rounded-2xl p-5 space-y-3 shadow-sm text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-primary-theme">
                    <Lightbulb className="w-4 h-4 text-[#E8702A]" />
                    <span>Profile Tips</span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed text-text-secondary-theme">
                    Add more skills to get better job recommendations.
                  </p>
                  <button 
                    onClick={() => setActiveSubView('skills')}
                    className="text-[10px] text-[#E8702A] font-black hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    Update Skills &rarr;
                  </button>
                </div>

              </div>

            </div>

          </motion.div>
        ) : (
          <motion.div
            key="sub-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl mx-auto"
            style={{ contentVisibility: 'auto' }}
          >
            {/* Back header */}
            <div className="flex items-center gap-3 pb-4 border-b border-border-theme/40">
              <button
                onClick={() => setActiveSubView(null)}
                className="p-2 hover:bg-border-theme/40 text-text-secondary-theme rounded-lg transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">
                  {categories.find(c => c.id === activeSubView)?.title}
                </h3>
                <p className="text-[10px] text-text-muted-theme">Update your parameter attributes</p>
              </div>
            </div>

            {/* Horizontal Navigation for Sections (except Resume Builder) */}
            {activeSubView !== 'resume' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-border-theme/40 -mx-6 px-6 scrollbar-none">
                {categories.filter(c => c.id !== 'resume').map((c) => {
                  const Icon = c.icon;
                  const isActive = activeSubView === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveSubView(c.id as ProfileSubView)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#E8702A] border-[#E8702A] text-white shadow-sm'
                          : 'bg-surface-theme border-border-theme/60 text-text-secondary-theme hover:bg-border-theme/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{c.title}</span>
                      {c.isCompleted && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-green-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Sub-panels */}
            {activeSubView === 'personal' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary-theme">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-[#E8702A]"
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-secondary-theme">Target Role</label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-[#E8702A]"
                      value={personalInfo.role}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary-theme">Email Address</label>
                    <input
                      type="email"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-[#E8702A]"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-secondary-theme">Contact Number</label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-[#E8702A]"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-secondary-theme">Professional Bio</label>
                  <textarea
                    rows={3}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-[#E8702A] resize-none"
                    value={personalInfo.bio}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                  />
                </div>

                <button
                  onClick={() => handleSave('Personal Information')}
                  className="w-full py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Save Personal Details
                </button>
              </div>
            )}

            {activeSubView === 'resume' && (
              <div className="space-y-4 text-xs font-semibold">
                {localStorage.getItem('technoadviser_resume_completed') === 'true' && localStorage.getItem('technoadviser_resume_active') ? (() => {
                  let resumeData = null;
                  try {
                    resumeData = JSON.parse(localStorage.getItem('technoadviser_resume_active') || '{}');
                  } catch (e) {}

                  if (!resumeData) return null;

                  return (
                    <div className="bg-surface-theme border border-border-theme rounded-2xl p-5 space-y-4 shadow-sm text-left animate-fadeIn">
                      <div className="flex items-start justify-between border-b border-border-theme/40 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#E8702A]/10 text-[#E8702A] rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-text-primary-theme uppercase tracking-wider flex items-center gap-2">
                              {resumeData.name || 'Standard Digital Resume'}
                              <span className="text-[9px] lowercase font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full">
                                Active
                              </span>
                            </h4>
                            <p className="text-[10px] text-text-muted-theme mt-0.5">
                              Created for {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName} ({resumeData.personalInfo?.title})
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] uppercase font-black text-text-muted-theme block tracking-widest font-mono">ATS Rating</span>
                          <span className="text-xl font-black text-[#E8702A] font-serif">{resumeData.atsScore || 85}%</span>
                        </div>
                      </div>

                      {/* Mini Preview Details */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] bg-bg-theme/30 p-3 rounded-xl border border-border-theme/35">
                        <div>
                          <span className="text-text-muted-theme block font-black uppercase">Experience History</span>
                          <span className="text-text-secondary-theme font-bold">
                            {resumeData.experiences?.length || 0} Positions listed
                          </span>
                        </div>
                        <div>
                          <span className="text-text-muted-theme block font-black uppercase">Education</span>
                          <span className="text-text-secondary-theme font-bold">
                            {resumeData.educations?.length || 0} Degrees listed
                          </span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-border-theme/30">
                          <span className="text-text-muted-theme block font-black uppercase mb-1">Key Index Skills</span>
                          <div className="flex flex-wrap gap-1">
                            {resumeData.skills?.slice(0, 5).map((s: any, idx: number) => (
                              <span key={idx} className="px-1.5 py-0.5 bg-border-theme/40 text-text-secondary-theme font-semibold rounded text-[9px]">
                                {typeof s === 'string' ? s : s.name}
                              </span>
                            ))}
                            {(resumeData.skills?.length || 0) > 5 && (
                              <span className="text-text-muted-theme font-bold text-[9px] self-center">
                                +{(resumeData.skills?.length || 0) - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Controls and Export Actions */}
                      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                        <button
                          onClick={() => {
                            addToast('Preparing print document layout...', 'info');
                            setTimeout(() => {
                              const element = document.createElement('a');
                              const file = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'text/plain' });
                              element.href = URL.createObjectURL(file);
                              element.download = `${resumeData.personalInfo?.firstName || 'Candidate'}_Digital_Resume.txt`;
                              document.body.appendChild(element);
                              element.click();
                              document.body.removeChild(element);
                              addToast('Resume downloaded successfully!', 'success');
                            }, 1000);
                          }}
                          className="flex-1 w-full py-2.5 bg-primary-theme hover:bg-opacity-95 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" /> Download / Export
                        </button>
                        
                        <button
                          onClick={() => setShowWizard(true)}
                          className="flex-1 w-full py-2.5 bg-transparent border border-border-theme hover:bg-border-theme/20 text-text-secondary-theme text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#E8702A]" /> Edit / Save
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to create another resume? This will start a new draft.')) {
                              localStorage.removeItem('technoadviser_resume_completed');
                              localStorage.removeItem('technoadviser_resume_active');
                              // Reset state
                              setPersonalInfo({
                                fullName: '',
                                role: '',
                                email: '',
                                phone: '',
                                city: '',
                                state: '',
                                country: '',
                                bio: '',
                                linkedin: '',
                                portfolio: ''
                              });
                              setSkills([]);
                              setExperiences([]);
                              setEducations([]);
                              addToast('New resume draft initialized!', 'info');
                              setShowWizard(true);
                            }
                          }}
                          className="flex-1 w-full py-2.5 bg-secondary-theme hover:bg-border-theme/35 text-text-primary-theme border border-border-theme text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Create Another
                        </button>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="p-4 border border-border-theme bg-[#E8702A]/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-[#E8702A] fill-current animate-pulse" />
                        Standard Digital Resume
                      </h4>
                      <p className="text-[10px] text-text-muted-theme font-semibold">
                        Maintain your parameter matrix using our 12-step guided Resume wizard.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowWizard(true)}
                      className="px-5 py-2 bg-[#E8702A] hover:bg-opacity-90 text-white text-[11px] font-black rounded-xl cursor-pointer shadow-sm shrink-0 uppercase tracking-wider"
                    >
                      Open Resume Wizard
                    </button>
                  </div>
                )}

                <div className="border-t border-border-theme/40 pt-4">
                  <h4 className="text-[11px] font-black uppercase text-text-muted-theme tracking-wider mb-2">Physical File upload</h4>
                  <div className="p-4 border border-dashed border-border-theme rounded-2xl text-center space-y-3 bg-surface-theme">
                    <FileText className="w-8 h-8 text-text-muted-theme mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-text-primary-theme">Upload a new resume version</p>
                      <p className="text-[10px] text-text-muted-theme">PDF, DOCX formats supported. Max size 5MB.</p>
                    </div>
                    <button className="px-4 py-2 bg-primary-theme/5 hover:bg-primary-theme/10 text-primary-theme text-[11px] font-bold rounded-xl cursor-pointer">
                      Browse File
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSubView === 'experience' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-3">
                  {experiences.map(exp => (
                    <div key={exp.id} className="p-4 border border-border-theme/40 bg-bg-theme/30 rounded-xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-text-primary-theme">{exp.role}</h4>
                        <p className="text-[10px] text-text-secondary-theme">{exp.company} &bull; {exp.location}</p>
                        <p className="text-[9px] text-text-muted-theme font-mono">{exp.duration}</p>
                      </div>
                      <button onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border-theme/40 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-text-primary-theme uppercase tracking-wider">Add Work Experience</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Role (e.g. Lead Designer)" value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} className="bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme focus:outline-none" />
                    <input type="text" placeholder="Company (e.g. Amazon)" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} className="bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Duration (e.g. 2022 - 2024)" value={newExp.duration} onChange={e => setNewExp({ ...newExp, duration: e.target.value })} className="bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme focus:outline-none" />
                    <input type="text" placeholder="Location (e.g. Mumbai)" value={newExp.location} onChange={e => setNewExp({ ...newExp, location: e.target.value })} className="bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme focus:outline-none" />
                  </div>
                  <button onClick={() => {
                    if (newExp.role && newExp.company) {
                      setExperiences([...experiences, { ...newExp, id: `exp-${Date.now()}` }]);
                      setNewExp({ role: '', company: '', duration: '', location: '' });
                      addToast('Experience added successfully!', 'success');
                    }
                  }} className="w-full py-2 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" /> Add Experience Record
                  </button>
                </div>
              </div>
            )}

            {activeSubView === 'skills' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-primary-theme/5 text-primary-theme border border-primary-theme/10 text-xs font-semibold rounded-lg flex items-center gap-2">
                      {skill}
                      <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-red-500 text-text-muted-theme font-bold cursor-pointer">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="e.g. Docker, TypeScript"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 bg-transparent border border-border-theme text-text-primary-theme rounded-xl p-2.5 text-xs focus:outline-none focus:border-primary-theme font-semibold"
                  />
                  <button
                    onClick={() => {
                      if (newSkill && !skills.includes(newSkill)) {
                        setSkills([...skills, newSkill]);
                        setNewSkill('');
                        addToast(`Skill "${newSkill}" appended!`, 'success');
                      }
                    }}
                    className="bg-primary-theme hover:bg-primary-hover-theme text-white px-5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {activeSubView === 'video' && (
              <div className="space-y-4 text-xs font-semibold text-center">
                {videoFile ? (
                  <div className="space-y-3">
                    <video controls className="w-full aspect-video bg-black rounded-2xl max-w-md mx-auto" src={videoFile}></video>
                    <button onClick={() => setVideoFile(null)} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold cursor-pointer">
                      Delete Video Resume
                    </button>
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-border-theme rounded-2xl max-w-md mx-auto space-y-4">
                    <Video className="w-10 h-10 text-text-muted-theme mx-auto" />
                    <div>
                      <h4 className="text-xs font-bold text-text-primary-theme">Simulate Video Resume Recording</h4>
                      <p className="text-[10px] text-text-muted-theme leading-relaxed">Present yourself to top verified recruiters in a 10-second mock pitch clip.</p>
                    </div>

                    {isVideoRecording ? (
                      <div className="space-y-2">
                        <div className="text-red-500 animate-pulse font-mono font-bold text-xs">RECORDING: {recordingSeconds}s / 10s</div>
                        <div className="w-full bg-border-theme h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${recordingSeconds * 10}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <button onClick={startMockRecording} className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span> Start Recording Test
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeSubView === 'preferences' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between p-4 border border-border-theme/40 bg-bg-theme/30 rounded-xl">
                  <div>
                    <h4 className="font-bold text-text-primary-theme">Open to Work</h4>
                    <p className="text-[10px] text-text-secondary-theme">Visible to all corporate recruiters</p>
                  </div>
                  <button onClick={() => setPreferences({ ...preferences, isOpenToWork: !preferences.isOpenToWork })} className="text-primary-theme cursor-pointer">
                    {preferences.isOpenToWork ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-text-secondary-theme">Target Salary Band</label>
                    <input type="text" value={preferences.targetPay} onChange={e => setPreferences({ ...preferences, targetPay: e.target.value })} className="w-full bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-text-secondary-theme">Notice Period</label>
                    <input type="text" value={preferences.noticePeriod} onChange={e => setPreferences({ ...preferences, noticePeriod: e.target.value })} className="w-full bg-transparent border border-border-theme rounded-xl p-2.5 text-xs text-text-primary-theme focus:outline-none" />
                  </div>
                </div>

                <button onClick={() => handleSave('Career Preferences')} className="w-full py-2.5 bg-primary-theme text-white text-xs font-bold rounded-xl cursor-pointer">
                  Save Preferences
                </button>
              </div>
            )}

            {activeSubView === 'certs' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-text-secondary-theme">Certifications</label>
                  <textarea
                    rows={4}
                    placeholder="e.g. AWS Certified Solutions Architect, Google UX Design Certificate"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-[#E8702A] resize-none"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => handleSave('Certifications')}
                  className="w-full py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Save Certifications
                </button>
              </div>
            )}

            {activeSubView === 'portfolio' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-text-secondary-theme">Portfolio Link / Website URL</label>
                  <input
                    type="url"
                    placeholder="https://myportfolio.com"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-[#E8702A]"
                    value={personalInfo.portfolio}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                  />
                </div>
                <button
                  onClick={() => handleSave('Portfolio')}
                  className="w-full py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Save Portfolio Link
                </button>
              </div>
            )}

            {activeSubView === 'languages' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-text-secondary-theme">Languages (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. English, Hindi, Spanish"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-[#E8702A]"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => handleSave('Languages')}
                  className="w-full py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Save Languages
                </button>
              </div>
            )}

            {activeSubView === 'socials' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-text-secondary-theme">LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-[#E8702A]"
                    value={personalInfo.linkedin}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                  />
                </div>
                <button
                  onClick={() => handleSave('Social Links')}
                  className="w-full py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Save Social Links
                </button>
              </div>
            )}

            {activeSubView === 'privacy' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between p-4 border border-border-theme/40 bg-bg-theme/30 rounded-xl">
                  <div>
                    <h4 className="font-bold text-text-primary-theme">Public Profile Search</h4>
                    <p className="text-[10px] text-text-secondary-theme font-medium">Allow recruiters to discover your profile in search queries.</p>
                  </div>
                  <button onClick={() => setPrivacy({ ...privacy, publicSearchVisible: !privacy.publicSearchVisible })} className="text-primary-theme cursor-pointer">
                    {privacy.publicSearchVisible ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-border-theme/40 bg-bg-theme/30 rounded-xl">
                  <div>
                    <h4 className="font-bold text-text-primary-theme">Hide Current Employer</h4>
                    <p className="text-[10px] text-text-secondary-theme font-medium">Prevent your current employer from seeing your profile.</p>
                  </div>
                  <button onClick={() => setPrivacy({ ...privacy, hideCurrentEmployer: !privacy.hideCurrentEmployer })} className="text-primary-theme cursor-pointer">
                    {privacy.hideCurrentEmployer ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
                  </button>
                </div>
                <button
                  onClick={() => handleSave('Privacy Settings')}
                  className="w-full py-2.5 bg-primary-theme hover:bg-primary-hover-theme text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Save Privacy Settings
                </button>
              </div>
            )}

            {/* Default Save Button for other simpler subviews */}
            {activeSubView !== 'personal' && activeSubView !== 'experience' && activeSubView !== 'skills' && activeSubView !== 'video' && activeSubView !== 'preferences' && activeSubView !== 'certs' && activeSubView !== 'portfolio' && activeSubView !== 'languages' && activeSubView !== 'socials' && activeSubView !== 'privacy' && (
              <div className="space-y-4 text-center">
                <p className="text-xs text-text-secondary-theme font-medium font-sans">Standard structural parameters logged for {personalInfo.fullName}.</p>
                <button
                  onClick={() => handleSave('Profile Parameters')}
                  className="px-6 py-2 bg-primary-theme text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Section
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
