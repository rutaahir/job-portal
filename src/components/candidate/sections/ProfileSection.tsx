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

type ProfileSubView = null | 'personal' | 'resume' | 'experience' | 'education';

export default function ProfileSection({ username, addToast }: ProfileSectionProps) {
  const [activeSubView, setActiveSubView] = useState<ProfileSubView>(null);
  const [showWizard, setShowWizard] = useState(false);

  // Drag-to-scroll tabs handlers
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeftState(tabsRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tabsRef.current.scrollLeft = scrollLeftState - walk;
  };

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
              const openToWork = cand.openToWork ?? true;
              setPreferences({
                isOpenToWork: openToWork,
                targetPay: cand.expectedSalary || '18,00,000 INR',
                noticePeriod: cand.noticePeriod || 'Immediate',
                jobType: cand.remotePreference || 'Full-Time Remote'
              });
              // Persist visibility flag for recruiter search filtering
              localStorage.setItem('technoadviser_open_to_work', String(openToWork));
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
                } else {
                  // If it parses but is not an array (e.g. string)
                  setExperiences([{
                    id: 'exp-0',
                    role: String(parsedExp),
                    company: 'Previous Employer',
                    duration: 'N/A',
                    location: 'N/A'
                  }]);
                }
              } catch (e) {
                // Fallback for plain string formats
                if (typeof cand.experienceHistory === 'string') {
                  setExperiences([{
                    id: 'exp-0',
                    role: cand.experienceHistory,
                    company: 'Previous Employer',
                    duration: 'N/A',
                    location: 'N/A'
                  }]);
                }
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
                } else {
                  setEducations([{
                    id: 'edu-0',
                    degree: String(parsedEdu),
                    school: 'Institution',
                    duration: 'N/A'
                  }]);
                }
              } catch (e) {
                // Fallback for plain string formats
                if (typeof cand.education === 'string') {
                  setEducations([{
                    id: 'edu-0',
                    degree: cand.education,
                    school: 'Institution',
                    duration: 'N/A'
                  }]);
                }
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

  const categories = [
    { id: 'personal', title: 'Personal Information', icon: User, desc: 'Basic details, skills, and links', progress: 100, isCompleted: !!(personalInfo.fullName && personalInfo.email && personalInfo.phone) },
    { id: 'resume', title: 'Resume Builder', icon: FileText, desc: 'Create & manage resumes', progress: localStorage.getItem('technoadviser_resume_completed') === 'true' ? 100 : 0, isCompleted: localStorage.getItem('technoadviser_resume_completed') === 'true' },
    { id: 'experience', title: 'Experience', icon: Briefcase, desc: 'Your work experience', progress: experiences.length > 0 ? 100 : 0, isCompleted: experiences.length > 0 },
    { id: 'education', title: 'Education', icon: GraduationCap, desc: 'Educational credentials & certifications', progress: (educations.length > 0 || certifications) ? 100 : 0, isCompleted: (educations.length > 0 || !!certifications) }
  ];

  const handleOpenToWorkToggle = async () => {
    const newValue = !preferences.isOpenToWork;
    setPreferences(prev => ({ ...prev, isOpenToWork: newValue }));
    localStorage.setItem('technoadviser_open_to_work', String(newValue));
    addToast(
      newValue
        ? 'Profile is now visible to employers. You are Open to Work!'
        : 'Profile visibility set to Private. Employers cannot find you.',
      newValue ? 'success' : 'info'
    );

    // Persist to backend
    const token = localStorage.getItem('technoadviser_token') || JSON.parse(localStorage.getItem('technoadviser_session') || '{}').email;
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ openToWork: newValue })
      });
    } catch (err) {
      console.error('Failed to sync open to work status:', err);
    }
  };



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

  const printResumeData = (resumeData: any) => {
    const p = resumeData.personalInfo || {};
    const experiences = resumeData.experiences || [];
    const educations = resumeData.educations || [];
    const skills = resumeData.skills || [];
    const projects = resumeData.projects || [];
    const certifications = resumeData.certifications || [];
    const achievements = resumeData.achievements || [];
    const languages = resumeData.languages || [];
    const prefs = resumeData.preferences || {};

    // Helper: format YYYY-MM to "Month YYYY"
    const fmtDate = (d: string) => {
      if (!d) return '';
      const parts = d.split('-');
      if (parts.length < 2) return d;
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const m = parseInt(parts[1], 10) - 1;
      return (months[m] || parts[1]) + ' ' + parts[0];
    };

    // --- EXPERIENCE ---
    let expHtml = '';
    experiences.forEach((exp: any) => {
      const role = exp.role || '';
      const company = exp.company || '';
      const type = exp.type ? ' Â· ' + exp.type : '';
      const start = fmtDate(exp.startDate);
      const end = exp.current ? 'Present' : fmtDate(exp.endDate);
      const duration = (start && end) ? start + ' â€“ ' + end : (start || end || '');
      const location = exp.location || '';
      const description = exp.description || '';

      expHtml += '<div class="item-block">';
      expHtml += '  <div class="item-header">';
      expHtml += '    <span class="item-title">' + role + ' &bull; ' + company + type + '</span>';
      expHtml += '    <span class="item-duration">' + duration + '</span>';
      expHtml += '  </div>';
      if (location) expHtml += '  <div class="item-sub">' + location + '</div>';
      if (description) expHtml += '  <p class="item-desc">' + description + '</p>';
      expHtml += '</div>';
    });

    // --- EDUCATION ---
    let eduHtml = '';
    educations.forEach((edu: any) => {
      const degree = edu.degree || '';
      const field = edu.fieldOfStudy ? ' in ' + edu.fieldOfStudy : '';
      const year = edu.passingYear ? 'Class of ' + edu.passingYear : '';
      const school = edu.school || '';
      const grade = edu.grade ? ' &bull; ' + edu.grade : '';
      const achievements2 = edu.achievements || '';

      eduHtml += '<div class="item-block">';
      eduHtml += '  <div class="item-header">';
      eduHtml += '    <span class="item-title">' + degree + field + '</span>';
      eduHtml += '    <span class="item-duration">' + year + '</span>';
      eduHtml += '  </div>';
      eduHtml += '  <div class="item-sub">' + school + grade + '</div>';
      if (achievements2) eduHtml += '  <p class="item-desc">' + achievements2 + '</p>';
      eduHtml += '</div>';
    });

    // --- SKILLS (grouped by level) ---
    let skillsHtml = '';
    const skillLevels: Record<string, string[]> = {};
    skills.forEach((s: any) => {
      const name = typeof s === 'string' ? s : s.name;
      const level = typeof s === 'string' ? 'Technical' : (s.level || 'Technical');
      if (!skillLevels[level]) skillLevels[level] = [];
      skillLevels[level].push(name);
    });
    const levelOrder = ['Expert', 'Advanced', 'Intermediate', 'Beginner'];
    levelOrder.forEach(lvl => {
      if (skillLevels[lvl] && skillLevels[lvl].length > 0) {
        skillsHtml += '<div style="margin-bottom: 6px;">';
        skillsHtml += '<span style="font-size: 9px; font-weight: 700; color: #E8702A; text-transform: uppercase; letter-spacing: 0.8px;">' + lvl + '</span> ';
        skillLevels[lvl].forEach(name => {
          skillsHtml += '<span class="skill-pill">' + name + '</span>';
        });
        skillsHtml += '</div>';
      }
    });
    // Remaining levels not in the order array
    Object.keys(skillLevels).forEach(lvl => {
      if (!levelOrder.includes(lvl)) {
        skillsHtml += '<div style="margin-bottom: 6px;">';
        skillLevels[lvl].forEach(name => {
          skillsHtml += '<span class="skill-pill">' + name + '</span>';
        });
        skillsHtml += '</div>';
      }
    });

    // --- PROJECTS ---
    let projectsHtml = '';
    projects.forEach((proj: any) => {
      const name = proj.name || '';
      const role = proj.role ? ' Â· ' + proj.role : '';
      const duration = proj.duration || '';
      const description = proj.description || '';
      const techUsed = Array.isArray(proj.techUsed) ? proj.techUsed : [];
      const links: string[] = [];
      if (proj.githubLink) links.push('GitHub: ' + proj.githubLink);
      if (proj.liveLink) links.push('Live: ' + proj.liveLink);

      projectsHtml += '<div class="item-block">';
      projectsHtml += '  <div class="item-header">';
      projectsHtml += '    <span class="item-title">' + name + role + '</span>';
      projectsHtml += '    <span class="item-duration">' + duration + '</span>';
      projectsHtml += '  </div>';
      if (techUsed.length > 0) {
        projectsHtml += '  <div class="item-sub">Tech: ' + techUsed.join(', ') + '</div>';
      }
      if (description) projectsHtml += '  <p class="item-desc">' + description + '</p>';
      if (links.length > 0) {
        projectsHtml += '  <div class="item-sub" style="margin-top: 3px;">' + links.join(' &bull; ') + '</div>';
      }
      projectsHtml += '</div>';
    });

    // --- CERTIFICATIONS ---
    let certsHtml = '';
    if (Array.isArray(certifications)) {
      certifications.forEach((c: any) => {
        if (typeof c === 'string') {
          certsHtml += '<li style="font-size: 9.5px; color: #4A5568; margin-bottom: 5px;">' + c + '</li>';
        } else {
          let line = '<strong>' + (c.name || '') + '</strong>';
          if (c.org) line += ' â€” ' + c.org;
          if (c.issueDate) line += ' <span style="font-family: monospace; color: #718096;">(' + fmtDate(c.issueDate) + (c.expiryDate ? ' to ' + fmtDate(c.expiryDate) : '') + ')</span>';
          if (c.credentialId) line += ' <span style="color: #718096; font-size: 8.5px;">ID: ' + c.credentialId + '</span>';
          certsHtml += '<li style="font-size: 9.5px; color: #4A5568; margin-bottom: 5px;">' + line + '</li>';
        }
      });
    }

    // --- ACHIEVEMENTS ---
    let achievementsHtml = '';
    achievements.forEach((ach: any) => {
      const title = ach.title || '';
      const date = ach.date ? fmtDate(ach.date) : '';
      const description = ach.description || '';

      achievementsHtml += '<div class="item-block">';
      achievementsHtml += '  <div class="item-header">';
      achievementsHtml += '    <span class="item-title">' + title + '</span>';
      achievementsHtml += '    <span class="item-duration">' + date + '</span>';
      achievementsHtml += '  </div>';
      if (description) achievementsHtml += '  <p class="item-desc">' + description + '</p>';
      achievementsHtml += '</div>';
    });

    // --- LANGUAGES ---
    let langsHtml = '';
    if (Array.isArray(languages)) {
      languages.forEach((l: any) => {
        const name = typeof l === 'string' ? l : l.name;
        const prof = typeof l === 'object' && l.proficiency ? l.proficiency : '';
        langsHtml += '<span class="lang-pill">' + name + (prof ? ' <span style="opacity:0.7;font-weight:500;">(' + prof + ')</span>' : '') + '</span>';
      });
    } else if (languages) {
      langsHtml = '<span style="font-size: 9.5px; color: #4A5568;">' + languages + '</span>';
    }

    // === BUILD HTML ===
    let htmlContent = '';
    htmlContent += '<html>';
    htmlContent += '<head>';
    htmlContent += '<title>' + (p.firstName || 'Candidate') + ' ' + (p.lastName || '') + ' â€” Resume</title>';
    htmlContent += '<link rel="preconnect" href="https://fonts.googleapis.com">';
    htmlContent += '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
    htmlContent += '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:ital,wght@0,600;0,700&display=swap" rel="stylesheet">';
    htmlContent += '<style>';
    htmlContent += '@page { size: A4 portrait; margin: 14mm 16mm; }';
    htmlContent += 'body { font-family: "Inter", sans-serif; color: #2D3748; background: white; margin: 0; padding: 0; font-size: 10px; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
    htmlContent += '.header { text-align: center; border-bottom: 2.5px solid #E8702A; padding-bottom: 14px; margin-bottom: 20px; }';
    htmlContent += '.name { font-family: "Lora", serif; font-size: 26px; font-weight: 700; color: #1A202C; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0; }';
    htmlContent += '.job-title { font-size: 12px; font-weight: 800; color: #E8702A; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0; }';
    htmlContent += '.contact { font-size: 9.5px; color: #4A5568; font-weight: 500; line-height: 1.7; }';
    htmlContent += '.contact a { color: #4A5568; text-decoration: none; }';
    htmlContent += '.section { margin-bottom: 18px; page-break-inside: avoid; break-inside: avoid; }';
    htmlContent += '.section-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #E8702A; border-bottom: 1.5px solid #FED7AA; padding-bottom: 3px; margin: 0 0 10px 0; }';
    htmlContent += '.item-block { margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid; }';
    htmlContent += '.item-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }';
    htmlContent += '.item-title { font-size: 10px; font-weight: 700; color: #1A202C; flex: 1; }';
    htmlContent += '.item-duration { font-size: 9px; font-family: monospace; font-weight: 600; color: #718096; white-space: nowrap; }';
    htmlContent += '.item-sub { font-size: 9px; color: #718096; font-style: italic; margin-top: 1px; }';
    htmlContent += '.item-desc { margin: 4px 0 0 0; font-size: 9.5px; line-height: 1.45; color: #4A5568; text-align: justify; }';
    htmlContent += '.skill-pill { display: inline-block; background: #F7FAFC; color: #4A5568; border: 1px solid #E2E8F0; padding: 3px 9px; border-radius: 5px; font-size: 9px; font-weight: 600; margin: 0 5px 5px 0; }';
    htmlContent += '.lang-pill { display: inline-block; background: #EBF8FF; color: #2C5282; border: 1px solid #BEE3F8; padding: 3px 10px; border-radius: 5px; font-size: 9px; font-weight: 600; margin: 0 5px 5px 0; }';
    htmlContent += '.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }';
    htmlContent += '</style>';
    htmlContent += '</head>';
    htmlContent += '<body>';

    // HEADER
    htmlContent += '<div class="header">';
    htmlContent += '  <h1 class="name">' + (p.firstName || '') + ' ' + (p.lastName || '') + '</h1>';
    htmlContent += '  <p class="job-title">' + (p.title || '') + '</p>';
    htmlContent += '  <div class="contact">';
    const contactParts: string[] = [];
    if (p.email) contactParts.push(p.email);
    if (p.phone) contactParts.push((p.countryCode || '') + ' ' + p.phone);
    if (p.city || p.state) contactParts.push([p.city, p.state, p.country].filter(Boolean).join(', '));
    htmlContent += '  ' + contactParts.join(' &nbsp;|&nbsp; ');
    const linkParts: string[] = [];
    if (p.linkedin) linkParts.push('LinkedIn: ' + p.linkedin);
    if (p.github) linkParts.push('GitHub: ' + p.github);
    if (p.portfolio) linkParts.push('Portfolio: ' + p.portfolio);
    if (linkParts.length > 0) htmlContent += '<br/>' + linkParts.join(' &nbsp;|&nbsp; ');
    htmlContent += '  </div>';
    htmlContent += '</div>';

    // SUMMARY
    if (p.summary) {
      htmlContent += '<div class="section">';
      htmlContent += '  <h3 class="section-title">Professional Summary</h3>';
      htmlContent += '  <p class="item-desc" style="margin-top: 0;">' + p.summary + '</p>';
      htmlContent += '</div>';
    }

    // EXPERIENCE
    if (experiences.length > 0) {
      htmlContent += '<div class="section">';
      htmlContent += '  <h3 class="section-title">Professional Experience</h3>';
      htmlContent += expHtml;
      htmlContent += '</div>';
    }

    // EDUCATION
    if (educations.length > 0) {
      htmlContent += '<div class="section">';
      htmlContent += '  <h3 class="section-title">Education</h3>';
      htmlContent += eduHtml;
      htmlContent += '</div>';
    }

    // SKILLS
    if (skills.length > 0) {
      htmlContent += '<div class="section">';
      htmlContent += '  <h3 class="section-title">Skills</h3>';
      htmlContent += '  <div>' + skillsHtml + '</div>';
      htmlContent += '</div>';
    }

    // PROJECTS
    if (projects.length > 0) {
      htmlContent += '<div class="section">';
      htmlContent += '  <h3 class="section-title">Key Projects</h3>';
      htmlContent += projectsHtml;
      htmlContent += '</div>';
    }

    // CERTIFICATIONS
    if (certsHtml) {
      htmlContent += '<div class="section">';
      htmlContent += '  <h3 class="section-title">Certifications</h3>';
      htmlContent += '  <ul style="margin: 0; padding-left: 14px;">' + certsHtml + '</ul>';
      htmlContent += '</div>';
    }

    // ACHIEVEMENTS
    if (achievementsHtml) {
      htmlContent += '<div class="section">';
      htmlContent += '  <h3 class="section-title">Honors &amp; Achievements</h3>';
      htmlContent += achievementsHtml;
      htmlContent += '</div>';
    }

    // LANGUAGES
    if (langsHtml) {
      htmlContent += '<div class="section">';
      htmlContent += '  <h3 class="section-title">Languages</h3>';
      htmlContent += '  <div style="margin-top: 4px;">' + langsHtml + '</div>';
      htmlContent += '</div>';
    }

    // CAREER PREFERENCES
    const prefParts: string[] = [];
    if (prefs.role) prefParts.push('<strong>Target Role:</strong> ' + prefs.role);
    if (prefs.industry) prefParts.push('<strong>Industry:</strong> ' + prefs.industry);
    if (prefs.workMode) prefParts.push('<strong>Work Mode:</strong> ' + prefs.workMode);
    if (prefs.noticePeriod) prefParts.push('<strong>Notice:</strong> ' + prefs.noticePeriod);
    if (prefs.expectedSalary) prefParts.push('<strong>Expected CTC:</strong> ' + prefs.expectedSalary);
    if (Array.isArray(prefs.locations) && prefs.locations.length > 0) prefParts.push('<strong>Preferred Locations:</strong> ' + prefs.locations.join(', '));

    if (prefParts.length > 0) {
      htmlContent += '<div class="section">';
      htmlContent += '  <h3 class="section-title">Career Preferences</h3>';
      htmlContent += '  <div style="font-size: 9.5px; color: #4A5568; line-height: 1.8;">' + prefParts.join(' &nbsp;Â·&nbsp; ') + '</div>';
      htmlContent += '</div>';
    }

    htmlContent += '</body></html>';

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          iframe.remove();
        }, 500);
      }, 600);
    }
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
        {activeSubView && (
          <button 
            onClick={() => setActiveSubView(null)}
            className="px-4 py-2.5 bg-surface-theme border border-border-theme hover:bg-border-theme/30 text-text-secondary-theme hover:text-text-primary-theme text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Feed</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!activeSubView ? (
          <motion.div
            key="main-profile-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full"
          >
        
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
                    
                    {/* Open to Work Toggle - top right */}
                    <button
                      onClick={handleOpenToWorkToggle}
                      title={preferences.isOpenToWork ? 'You are visible to employers. Click to hide.' : 'You are hidden from employers. Click to go visible.'}
                      className={`absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer shadow-sm ${
                        preferences.isOpenToWork
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20'
                          : 'bg-border-theme/30 border-border-theme text-text-muted-theme hover:bg-border-theme/50'
                      }`}
                    >
                      {/* Toggle pill */}
                      <span
                        className={`relative inline-flex w-8 h-4 rounded-full transition-colors duration-300 flex-shrink-0 ${
                          preferences.isOpenToWork ? 'bg-emerald-500' : 'bg-border-theme/60'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                            preferences.isOpenToWork ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </span>
                      {preferences.isOpenToWork ? 'ðŸŸ¢ Open to Work' : 'ðŸ”´ Hidden'}
                    </button>

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

          <AnimatePresence mode="wait">
            {!activeSubView ? (
              <motion.div
                key="grid-view-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
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
                          {cat.isCompleted && (
                            <span className="p-1 bg-emerald-500/10 text-emerald-500 rounded-lg">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div className="mt-3 space-y-1">
                          <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider group-hover:text-[#E8702A] transition-colors">
                            {cat.title}
                          </h4>
                          <p className="text-[10px] text-text-muted-theme font-medium leading-tight">
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

              </motion.div>
            ) : (
              <motion.div
                key="sub-view-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm text-left"
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
                              : 'bg-surface-theme border-border-theme text-text-secondary-theme hover:border-[#E8702A]/50'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          {c.title}
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

          </motion.div>
        ) : (
          <motion.div
            key="sub-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full space-y-6"
          >
            {/* Horizontal Navigation for Sections */}
            <div 
              ref={tabsRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="flex items-center overflow-x-auto border border-border-theme/60 rounded-2xl w-full cursor-grab active:cursor-grabbing select-none scrollbar-none bg-surface-theme divide-x divide-border-theme/60"
            >
              {categories.map((c, index) => {
                const Icon = c.icon;
                const isActive = activeSubView === c.id;
                const isFirst = index === 0;
                const isLast = index === categories.length - 1;
                
                // Shorten title for tabs to match the design
                const shortTitle = {
                  personal: 'Personal',
                  resume: 'Resume',
                  experience: 'Experience',
                  education: 'Education',
                  skills: 'Skills',
                  certs: 'Certs',
                  portfolio: 'Portfolio',
                  languages: 'Languages',
                  socials: 'Socials',
                  video: 'Video',
                  preferences: 'Prefs',
                  privacy: 'Privacy'
                }[c.id] || c.title;

                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveSubView(c.id as ProfileSubView)}
                    className={`flex flex-col items-center justify-center py-4 px-4 text-xs font-bold transition-all relative shrink-0 cursor-pointer flex-1 min-w-[92px] min-h-[82px] select-none ${
                      isActive 
                        ? 'bg-[#E8702A]/5 text-[#E8702A] border-b-2 border-[#E8702A]' 
                        : 'text-text-secondary-theme hover:text-text-primary-theme hover:bg-border-theme/10'
                    } ${isFirst ? 'rounded-l-2xl' : ''} ${isLast ? 'rounded-r-2xl' : ''}`}
                  >
                    {/* Status dot in top right */}
                    <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${c.isCompleted ? 'bg-emerald-500' : 'bg-stone-200'}`} />

                    <Icon className={`w-5 h-5 mb-1.5 pointer-events-none ${isActive ? 'text-[#E8702A]' : 'text-text-secondary-theme/70'}`} />
                    <span className="text-[10px] font-bold tracking-tight pointer-events-none">{shortTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Spacious Editor Card */}
            <div className="w-full bg-surface-theme border border-border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Category Info Header */}
              <div className="pb-6 border-b border-border-theme/40">
                <div>
                  <h3 className="text-base font-black text-text-primary-theme uppercase tracking-wider">
                    {categories.find(c => c.id === activeSubView)?.title}
                  </h3>
                  <p className="text-xs text-text-muted-theme mt-0.5">
                    {categories.find(c => c.id === activeSubView)?.desc}
                  </p>
                </div>
              </div>

              {/* Sub-panels */}
              {activeSubView === 'personal' && (
                <div className="space-y-6 text-xs font-semibold">
                  {/* Subsection 1: Basic Information */}
                  <div className="space-y-4 text-left">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary-theme uppercase tracking-wider">Basic Information</h4>
                      <p className="text-xs text-text-muted-theme mt-0.5">Your core identification and contact information.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold text-xs mb-1 block">Full Name</label>
                        <input
                          type="text"
                          className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                          value={personalInfo.fullName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold text-xs mb-1 block">Target Role</label>
                        <input
                          type="text"
                          className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                          value={personalInfo.role}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, role: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold text-xs mb-1 block">Email Address</label>
                        <input
                          type="email"
                          className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold text-xs mb-1 block">Contact Number</label>
                        <input
                          type="text"
                          className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold text-xs mb-1 block">City</label>
                        <input
                          type="text"
                          className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                          value={personalInfo.city}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold text-xs mb-1 block">State</label>
                        <input
                          type="text"
                          className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                          value={personalInfo.state}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, state: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold text-xs mb-1 block">Country</label>
                        <input
                          type="text"
                          className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                          value={personalInfo.country}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-text-secondary-theme font-bold text-xs mb-1 block">Professional Bio</label>
                      <textarea
                        rows={4}
                        className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold resize-none"
                        value={personalInfo.bio}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Subsection 2: Skills & Expertise */}
                  <div className="space-y-3 pt-6 border-t border-border-theme/40 text-left">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary-theme uppercase tracking-wider">Skills & Core Competencies</h4>
                      <p className="text-xs text-text-muted-theme mt-0.5">Manage your key technical and soft skills.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 py-1">
                      {skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8702A]/10 text-[#E8702A] text-xs font-bold transition-all hover:bg-[#E8702A]/20">
                          <span>{skill}</span>
                          <button
                            onClick={() => setSkills(skills.filter((_, idx) => idx !== index))}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#E8702A]/30 transition-all text-xs font-black cursor-pointer leading-none"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="e.g. React, Python, Product Design"
                        className="flex-1 bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                              setSkills([...skills, newSkill.trim()]);
                              setNewSkill('');
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                            setSkills([...skills, newSkill.trim()]);
                            setNewSkill('');
                          }
                        }}
                        className="px-5 py-2.5 bg-[#E8702A] hover:bg-[#D5601E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                      >
                        Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Subsection 3: Languages Spoken */}
                  <div className="space-y-3 pt-6 border-t border-border-theme/40 text-left">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary-theme uppercase tracking-wider">Languages Spoken</h4>
                      <p className="text-xs text-text-muted-theme mt-0.5">Specify the languages you speak (comma-separated).</p>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. English, Hindi, Spanish"
                      className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                    />
                  </div>

                  {/* Subsection 4: Links & Online Presence */}
                  <div className="space-y-3 pt-6 border-t border-border-theme/40 text-left">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary-theme uppercase tracking-wider">Links & Online Presence</h4>
                      <p className="text-xs text-text-muted-theme mt-0.5">Add links to your portfolio and social profiles.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold text-xs mb-1 block">Portfolio Website</label>
                        <input
                          type="url"
                          placeholder="https://yourwebsite.com"
                          className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                          value={personalInfo.portfolio || ''}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold text-xs mb-1 block">LinkedIn Profile</label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold"
                          value={personalInfo.linkedin || ''}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6 border-t border-border-theme/40">
                    <button
                      onClick={() => handleSave('Personal Details')}
                      className="w-full py-3 bg-[#E8702A] hover:bg-[#D5601E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider"
                    >
                      Save Personal Profile
                    </button>

                  </div>
                </div>
              )}

              {activeSubView === 'resume' && (
                <div className="space-y-6 text-xs font-semibold">
                  {localStorage.getItem('technoadviser_resume_completed') === 'true' && localStorage.getItem('technoadviser_resume_active') ? (() => {
                    let resumeData = null;
                    try {
                      resumeData = JSON.parse(localStorage.getItem('technoadviser_resume_active') || '{}');
                    } catch (e) {}

                    if (!resumeData) return null;

                    return (
                      <div className="bg-surface-theme border border-border-theme rounded-2xl p-6 space-y-4 shadow-sm text-left animate-fadeIn">
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
                                printResumeData(resumeData);
                              }, 1000);
                            }}
                            className="flex-1 w-full py-2.5 bg-[#E8702A] hover:bg-[#D5601E] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm uppercase tracking-wider"
                          >
                            <Download className="w-3.5 h-3.5" /> Download / Export
                          </button>
                          
                          <button
                            onClick={() => setShowWizard(true)}
                            className="flex-1 w-full py-2.5 bg-transparent border border-border-theme hover:bg-border-theme/20 text-text-secondary-theme text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#E8702A]" /> Edit / Save
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to create another resume? This will start a new draft.')) {
                                localStorage.removeItem('technoadviser_resume_completed');
                                localStorage.removeItem('technoadviser_resume_active');
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
                            className="flex-1 w-full py-2.5 bg-transparent text-text-primary-theme hover:bg-border-theme/35 border border-border-theme text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                          >
                            <Plus className="w-3.5 h-3.5" /> Create Another
                          </button>
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="p-6 border border-border-theme bg-[#E8702A]/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-[#E8702A] fill-current animate-pulse" />
                          Standard Digital Resume
                        </h4>
                        <p className="text-[10px] text-text-muted-theme font-semibold">
                          Maintain your profile using our guided Resume wizard.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowWizard(true)}
                        className="px-5 py-2.5 bg-[#E8702A] hover:bg-opacity-90 text-white text-[11px] font-black rounded-xl cursor-pointer shadow-sm shrink-0 uppercase tracking-wider"
                      >
                        Open Resume Wizard
                      </button>
                    </div>
                  )}

                  <div className="border-t border-border-theme/40 pt-4 text-left">
                    <h4 className="text-[11px] font-black uppercase text-text-muted-theme tracking-wider mb-2">Physical File upload</h4>
                    <div className="p-6 border border-dashed border-border-theme rounded-2xl text-center space-y-3 bg-surface-theme">
                      <FileText className="w-8 h-8 text-text-muted-theme mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-text-primary-theme">Upload a new resume version</p>
                        <p className="text-[10px] text-text-muted-theme">PDF, DOCX formats supported. Max size 5MB.</p>
                      </div>
                      <button className="px-4 py-2.5 bg-[#E8702A]/5 hover:bg-[#E8702A]/10 text-[#E8702A] text-[11px] font-bold rounded-xl cursor-pointer">
                        Browse File
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSubView === 'experience' && (
                <div className="space-y-6 text-xs font-semibold">
                  <div className="space-y-3">
                    {experiences.map(exp => (
                      <div key={exp.id} className="p-4 border border-border-theme/40 bg-bg-theme/30 rounded-xl flex justify-between items-center transition-all hover:border-[#E8702A]/20 text-left">
                        <div>
                          <h4 className="font-bold text-text-primary-theme text-sm">{exp.role}</h4>
                          <p className="text-[11px] text-text-secondary-theme font-bold">{exp.company} &bull; {exp.location}</p>
                          <p className="text-[10px] text-text-muted-theme font-mono mt-0.5">{exp.duration}</p>
                        </div>
                        <button onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border-theme/40 pt-5 space-y-4 text-left">
                    <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-[#E8702A]" />
                      <span>Add Work Experience</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold">Role Title</label>
                        <input type="text" placeholder="e.g. Lead UI/UX Designer" value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold">Company / Employer</label>
                        <input type="text" placeholder="e.g. Amazon" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold">Duration</label>
                        <input type="text" placeholder="e.g. 2022 - Present" value={newExp.duration} onChange={e => setNewExp({ ...newExp, duration: e.target.value })} className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold">Location</label>
                        <input type="text" placeholder="e.g. Hyderabad, India (Remote)" value={newExp.location} onChange={e => setNewExp({ ...newExp, location: e.target.value })} className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold" />
                      </div>
                    </div>
                    <button onClick={() => {
                      if (newExp.role && newExp.company) {
                        setExperiences([...experiences, { ...newExp, id: `exp-${Date.now()}` }]);
                        setNewExp({ role: '', company: '', duration: '', location: '' });
                        addToast('Experience added successfully!', 'success');
                      } else {
                        addToast('Please enter both role and company!', 'warning');
                      }
                    }} className="w-full py-2.5 bg-[#E8702A] hover:bg-[#D5601E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm uppercase tracking-wider">
                      <Plus className="w-4 h-4" /> Add Experience Record
                    </button>
                  </div>

                  <div className="border-t border-border-theme/40 pt-5">
                    <button
                      onClick={() => handleSave('Experience')}
                      className="w-full py-3 bg-[#E8702A] hover:bg-[#D5601E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider"
                    >
                      Save Experience Details
                    </button>
                  </div>
                </div>
              )}

              {activeSubView === 'education' && (
                <div className="space-y-6 text-xs font-semibold">
                  {/* Education List */}
                  <div className="space-y-3">
                    {educations.length > 0 ? (
                      educations.map(edu => (
                        <div key={edu.id} className="p-4 border border-border-theme/40 bg-bg-theme/30 rounded-xl flex justify-between items-center transition-all hover:border-[#E8702A]/20 text-left">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary-theme/10 rounded-xl text-[#E8702A]">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-text-primary-theme text-sm">{edu.degree}</h4>
                              <p className="text-[11px] text-text-secondary-theme font-bold">{edu.school}</p>
                              <p className="text-[10px] text-text-muted-theme font-mono mt-0.5">{edu.duration}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setEducations(educations.filter(e => e.id !== edu.id));
                              addToast('Education item deleted locally. Remember to save!', 'info');
                            }} 
                            className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 border border-dashed border-border-theme rounded-2xl text-center space-y-2 bg-surface-theme">
                        <GraduationCap className="w-8 h-8 text-text-muted-theme mx-auto" />
                        <p className="text-xs font-bold text-text-primary-theme">No education records logged</p>
                        <p className="text-[10px] text-text-muted-theme">Add your educational credentials below</p>
                      </div>
                    )}
                  </div>

                  {/* Add Education History */}
                  <div className="border-t border-border-theme/40 pt-5 space-y-4 text-left">
                    <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-[#E8702A]" />
                      <span>Add Education History</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold">Degree / Field of Study</label>
                        <input type="text" placeholder="e.g. Bachelor of Design (B.Des)" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-secondary-theme font-bold">School / University</label>
                        <input type="text" placeholder="e.g. MIT Institute of Design" value={newEdu.school} onChange={e => setNewEdu({ ...newEdu, school: e.target.value })} className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-text-secondary-theme font-bold">Duration / Graduation Year</label>
                      <input type="text" placeholder="e.g. 2017 - 2021" value={newEdu.duration} onChange={e => setNewEdu({ ...newEdu, duration: e.target.value })} className="w-full bg-transparent border border-border-theme focus:border-[#E8702A] rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none transition-all font-semibold" />
                    </div>
                    <button onClick={() => {
                      if (newEdu.degree && newEdu.school) {
                        setEducations([...educations, { ...newEdu, id: `edu-${Date.now()}` }]);
                        setNewEdu({ degree: '', school: '', duration: '' });
                        addToast('Education added successfully!', 'success');
                      } else {
                        addToast('Please enter both degree and school!', 'warning');
                      }
                    }} className="w-full py-2.5 bg-[#E8702A] hover:bg-[#D5601E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm uppercase tracking-wider">
                      <Plus className="w-4 h-4" /> Add Education Record
                    </button>
                  </div>

                  {/* Certifications Section */}
                  <div className="border-t border-border-theme/40 pt-5 space-y-3 text-left">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary-theme uppercase tracking-wider">Certifications</h4>
                      <p className="text-xs text-text-muted-theme mt-0.5">List your professional certifications and licenses.</p>
                    </div>
                    <div className="space-y-1.5">
                      <textarea
                        rows={4}
                        placeholder="e.g. AWS Certified Solutions Architect, Google UX Design Certificate"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs text-text-primary-theme focus:outline-none focus:border-[#E8702A] resize-none transition-all font-semibold"
                        value={certifications}
                        onChange={(e) => setCertifications(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Unified Save */}
                  <div className="border-t border-border-theme/40 pt-5">
                    <button
                      onClick={() => handleSave('Education & Certifications')}
                      className="w-full py-3 bg-[#E8702A] hover:bg-[#D5601E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider"
                    >
                      Save Education & Certifications
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

    </div>
  );
}
