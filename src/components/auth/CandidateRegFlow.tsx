/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, Smartphone, 
  CheckCircle, ShieldAlert, Sparkles, FileText, UploadCloud, 
  ArrowRight, ArrowLeft, Loader2, Edit3, Save, Compass, CheckCircle2 
} from 'lucide-react';
import { UserAccount } from './AuthTypes';
import ResumeBuilderWizard, { ResumeData } from '../candidate/ResumeBuilderWizard';

interface CandidateRegFlowProps {
  onComplete: (account: UserAccount) => void;
  onNavigateToLogin: () => void;
  addToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export default function CandidateRegFlow({ onComplete, onNavigateToLogin, addToast }: CandidateRegFlowProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  // STEP 1 State: Basic Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // STEP 2 State: Email OTP Verification
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [timer, setTimer] = useState(60);

  // STEP 3 State: Career Information
  const [currentStatus, setCurrentStatus] = useState<'Student' | 'Fresher' | 'Experienced' | 'Freelancer' | 'Career Break'>('Experienced');
  const [experience, setExperience] = useState('2');
  const [currentCity, setCurrentCity] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [remotePreference, setRemotePreference] = useState('Hybrid');
  const [availability, setAvailability] = useState('Immediate');

  // STEP 4 State: Resume Upload / Creation & AI Parser
  const [resumeOption, setResumeOption] = useState<'upload' | 'create' | 'skip' | null>(null);
  const [fileName, setFileName] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState({
    education: 'Bachelor of Technology in Computer Science (BITS Pilani, 2021)',
    experience: 'Software Engineer at Zeta Systems (2 Years)',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'Express', 'Python'],
    projects: 'AI Sourcing Pipeline, Cloud ATS Automation Platform',
    certifications: 'AWS Certified Solutions Architect, Google Professional Cloud Developer',
    languages: 'English (Fluent), Hindi (Native)'
  });
  const [editingParsed, setEditingParsed] = useState(false);

  // STEP 5 State: Career Preferences
  const [preferredRoles, setPreferredRoles] = useState<string[]>(['Frontend Engineer', 'Fullstack Developer']);
  const [newRole, setNewRole] = useState('');
  const [preferredIndustries, setPreferredIndustries] = useState('Information Technology');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [noticePeriod, setNoticePeriod] = useState('Immediate (15 days or less)');
  const [openToWork, setOpenToWork] = useState(true);

  // STEP 6 State: Profile Summary
  const [profileStrength, setProfileStrength] = useState(40);
  const [resumeScore, setResumeScore] = useState(85);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle password strength
  const validatePasswordStrength = () => {
    const checks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    const passedCount = Object.values(checks).filter(Boolean).length;
    let label = 'Weak';
    let color = 'bg-error-theme';
    let pct = 'w-1/5';

    if (passedCount >= 4 && checks.length) {
      label = 'Strong';
      color = 'bg-success-theme';
      pct = 'w-full';
    } else if (passedCount >= 3 && checks.length) {
      label = 'Medium';
      color = 'bg-warning-theme';
      pct = 'w-3/5';
    } else if (passedCount >= 1) {
      label = 'Weak';
      color = 'bg-error-theme';
      pct = 'w-2/5';
    } else {
      label = 'None';
      color = 'bg-border-theme/40';
      pct = 'w-0';
    }

    return { label, color, pct, checks };
  };

  const strength = validatePasswordStrength();

  // Step Navigations
  const handleNextStep = async () => {
    if (step === 1) {
      // Validate unique mock emails/phones and general rules
      if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        addToast('Please fill out all basic information fields.', 'error');
        return;
      }
      if (password !== confirmPassword) {
        addToast('Passwords do not match.', 'error');
        return;
      }
      if (strength.label === 'Weak') {
        addToast('Please use a stronger password meeting security rules.', 'error');
        return;
      }
      if (!acceptTerms) {
        addToast('You must accept the Terms and Privacy Policy.', 'error');
        return;
      }

      // Unique mock checks
      const users: UserAccount[] = JSON.parse(localStorage.getItem('technoadviser_users') || '[]');
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        addToast('Email address is already registered on TechnoAdviser.', 'error');
        return;
      }
      if (users.some((u) => u.phone === countryCode + phone)) {
        addToast('Mobile number is already registered.', 'error');
        return;
      }

      // Send OTP simulation
      addToast(`OTP successfully dispatched to ${email}`, 'success');
      setTimer(60);
      setStep(2);
    } else if (step === 2) {
      const fullOtp = emailOtp.join('');
      if (fullOtp.length < 6) {
        addToast('Please enter the complete 6-digit OTP code.', 'error');
        return;
      }
      if (fullOtp !== '248167') {
        setRetryCount((prev) => prev + 1);
        if (retryCount >= 2) {
          addToast('Maximum retry limit reached. Please request a new OTP.', 'error');
          return;
        }
        addToast('Invalid verification code. OTP is 248167.', 'error');
        return;
      }
      addToast('Email address successfully verified!', 'success');
      setOtpVerified(true);
      setStep(3);
    } else if (step === 3) {
      if (!currentCity || !preferredLocation || !expectedSalary) {
        addToast('Please complete all career status information.', 'error');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!resumeOption) {
        addToast('Please select a resume preference option.', 'error');
        return;
      }
      setStep(5);
    } else if (step === 5) {
      if (preferredRoles.length === 0 || !preferredIndustries) {
        addToast('Please choose at least one preferred role and industry.', 'error');
        return;
      }
      // Calculate profile strength
      let strengthScore = 60;
      if (resumeOption === 'upload' || resumeOption === 'create') strengthScore += 25;
      if (openToWork) strengthScore += 15;
      setProfileStrength(strengthScore);
      setStep(6);
    } else if (step === 6) {
      // Save Candidate Account
      const newAccount: UserAccount = {
        email: email.toLowerCase(),
        phone: countryCode + phone,
        passwordHash: password, // For simplicity we store directly
        role: 'JOB_SEEKER',
        status: 'ACTIVE',
        name: `${firstName} ${lastName}`,
        candidateInfo: {
          firstName,
          lastName,
          countryCode,
          currentStatus,
          experience: currentStatus === 'Fresher' || currentStatus === 'Student' ? '0' : experience,
          currentCity,
          preferredLocation,
          expectedSalary,
          currentSalary: currentSalary || 'N/A',
          remotePreference,
          availability,
          preferredRoles,
          preferredIndustries,
          employmentType,
          workMode,
          noticePeriod,
          openToWork,
          profileStrength,
          resumeScore: resumeOption === 'upload' ? resumeScore : 0,
          resumeParsed: resumeOption === 'upload' ? parsedData : undefined
        }
      };

      // Sync onboarding to backend REST API
      try {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.toLowerCase(),
            password: password,
            role: 'JOB_SEEKER',
            name: `${firstName} ${lastName}`,
            phone: countryCode + phone,
            details: {
              city: currentCity,
              role: preferredRoles[0] || 'Software Engineer',
              education: parsedData?.education || '',
              skills: parsedData?.skills || []
            }
          })
        });
      } catch (err) {
        console.warn('Backend REST server is offline. Safe client local state backup active.', err);
      }

      // Push into local storage
      const users: UserAccount[] = JSON.parse(localStorage.getItem('technoadviser_users') || '[]');
      users.push(newAccount);
      localStorage.setItem('technoadviser_users', JSON.stringify(users));

      addToast('Profile compiled successfully! Registering account...', 'success');
      setStep(7);

      // Auto-redirect to dashboard after success transition
      setTimeout(() => {
        onComplete(newAccount);
      }, 2000);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    setTimer(60);
    addToast('OTP code re-sent successfully. Enter code 248167.', 'success');
  };

  const handleOtpInput = (index: number, value: string) => {
    if (value.length <= 1) {
      const nextOtp = [...emailOtp];
      nextOtp[index] = value;
      setEmailOtp(nextOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`cand-otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const simulateResumeParsing = (file: File) => {
    setFileName(file.name);
    setIsParsing(true);
    addToast('Uploading resume to secure AI parser...', 'info');

    setTimeout(() => {
      setIsParsing(false);
      setResumeOption('upload');
      addToast('AI Resume Parsing complete! 6 fields extracted successfully.', 'success');
    }, 3000);
  };

  const addPreferredRole = () => {
    if (newRole && !preferredRoles.includes(newRole)) {
      setPreferredRoles([...preferredRoles, newRole]);
      setNewRole('');
    }
  };

  const removePreferredRole = (role: string) => {
    setPreferredRoles(preferredRoles.filter((r) => r !== role));
  };

  if (showWizard) {
    return (
      <ResumeBuilderWizard
        candidateName={`${firstName} ${lastName}`}
        onCancel={() => {
          setShowWizard(false);
          setResumeOption(null);
        }}
        onSave={(resume: ResumeData) => {
          // Sync with CandidateRegFlow states
          setParsedData({
            education: resume.educations.map(e => `${e.degree} in ${e.fieldOfStudy} (${e.school}, ${e.passingYear})`).join(', ') || 'N/A',
            experience: resume.experiences.map(e => `${e.role} at ${e.company} (${e.startDate} to ${e.endDate || 'Present'})`).join(', ') || 'N/A',
            skills: resume.skills.map(s => s.name),
            projects: resume.projects.map(p => p.name).join(', ') || 'N/A',
            certifications: resume.certifications.map(c => c.name).join(', ') || 'N/A',
            languages: resume.languages.map(l => l.name).join(', ') || 'N/A',
          });
          setResumeScore(resume.atsScore);
          setProfileStrength(95);
          
          if (resume.preferences.role) {
            setPreferredRoles([resume.preferences.role]);
          }
          if (resume.preferences.expectedSalary) {
            setExpectedSalary(resume.preferences.expectedSalary);
          }
          if (resume.preferences.workMode) {
            setWorkMode(resume.preferences.workMode);
          }
          if (resume.preferences.noticePeriod) {
            setNoticePeriod(resume.preferences.noticePeriod);
          }
          if (resume.preferences.openToWork) {
            setOpenToWork(resume.preferences.openToWork);
          }

          addToast('Digital resume details synced to registration profile!', 'success');
          setShowWizard(false);
          setStep(5); // Advance to next step (Career Preferences)
        }}
        addToast={addToast}
        initialData={{
          personalInfo: {
            firstName: firstName,
            lastName: lastName,
            title: 'Lead Software Engineer',
            email: email,
            phone: phone,
            countryCode: '+91',
            city: currentCity,
            state: '',
            country: 'India',
            photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
            linkedin: '',
            github: '',
            portfolio: '',
            blog: '',
            summary: ''
          }
        }}
      />
    );
  }

  return (
    <div className="bg-surface-theme p-6 sm:p-10 rounded-3xl border border-border-theme shadow-xl max-w-4xl mx-auto">
      {/* Dynamic Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-theme font-mono">
              Candidate Pipeline Onboarding
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-text-primary-theme mt-1">
              {step === 1 && 'Basic Identification'}
              {step === 2 && 'Email Secure Verification'}
              {step === 3 && 'Current Status & Experience'}
              {step === 4 && 'Smart Resume Sourcing'}
              {step === 5 && 'Match Core Preferences'}
              {step === 6 && 'Profile Alignment Summary'}
              {step === 7 && 'Redirecting to Dashboard...'}
            </h2>
          </div>
          <span className="text-xs font-black text-text-secondary-theme bg-border-theme/40 px-3 py-1.5 rounded-full font-mono">
            {step} / 7
          </span>
        </div>

        {/* Stepper progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                step >= idx + 1 ? 'bg-primary-theme shadow-[0_0_8px_#E8702A]' : 'bg-border-theme/40'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Sneha"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Kapoor"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-4 h-4 text-text-muted-theme" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sneha@email.com"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 pl-10 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Mobile Number</label>
                  <div className="flex gap-2">
                    <select 
                      value={countryCode} 
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent border border-border-theme rounded-xl px-2 text-xs font-semibold focus:outline-none focus:border-primary-theme text-text-primary-theme"
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                    </select>
                    <div className="relative flex items-center flex-1">
                      <Phone className="absolute left-3 w-4 h-4 text-text-muted-theme" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3 pl-10 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Create Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-text-muted-theme" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter strong password"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 pl-10 pr-10 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-text-muted-theme hover:text-text-primary-theme"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Confirm Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-text-muted-theme" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 pl-10 pr-10 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-text-muted-theme hover:text-text-primary-theme"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Checklist */}
              {password && (
                <div className="p-4 bg-border-theme/20 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-text-muted-theme tracking-wider">Password Strength:</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      strength.label === 'Strong' ? 'text-success-theme bg-success-theme/10' :
                      strength.label === 'Medium' ? 'text-warning-theme bg-warning-theme/10' : 'text-error-theme bg-error-theme/10'
                    }`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-border-theme/40 h-1 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} ${strength.pct} transition-all duration-300`} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-text-secondary-theme pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className={strength.checks.length ? 'text-success-theme' : 'text-text-muted-theme'}>✓</span> Min 8 Characters
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={strength.checks.upper ? 'text-success-theme' : 'text-text-muted-theme'}>✓</span> One Uppercase Letter
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={strength.checks.lower ? 'text-success-theme' : 'text-text-muted-theme'}>✓</span> One Lowercase Letter
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={strength.checks.number ? 'text-success-theme' : 'text-text-muted-theme'}>✓</span> One Number
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <span className={strength.checks.special ? 'text-success-theme' : 'text-text-muted-theme'}>✓</span> Special Character (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="cand-terms"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="accent-primary-theme rounded border-border-theme h-4 w-4 mt-0.5"
                />
                <label htmlFor="cand-terms" className="text-[11px] font-bold text-text-secondary-theme leading-normal">
                  I agree to the TechnoAdviser Technologies Terms of Service, Privacy Policy and consent to automated profile ranking procedures.
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: OTP Verification */}
          {step === '2' || step === 2 && (
            <div className="space-y-6 max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-primary-theme/10 text-primary-theme rounded-full flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary-theme font-medium">
                  We have dispatched an email confirmation with a 6-digit passcode to:
                </p>
                <strong className="text-xs text-text-primary-theme font-mono">{email}</strong>
              </div>

              <div className="flex justify-center gap-2 py-2">
                {emailOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`cand-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    required
                    value={digit}
                    onChange={(e) => handleOtpInput(idx, e.target.value)}
                    className="w-11 h-12 bg-transparent border border-border-theme text-center text-sm font-extrabold text-text-primary-theme rounded-lg focus:outline-none focus:border-primary-theme"
                  />
                ))}
              </div>

              <div className="text-[10px] text-text-muted-theme font-bold flex justify-between items-center px-4">
                <span>OTP code is: <strong className="text-primary-theme font-mono">248167</strong></span>
                <span>Expires in: <strong className="text-error-theme font-mono">01:45</strong></span>
              </div>

              <div className="border-t border-border-theme/40 pt-4 flex justify-between items-center text-xs">
                <span className="text-text-secondary-theme font-medium">Didn't receive the passcode?</span>
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={handleResendOtp}
                  className={`font-black ${timer > 0 ? 'text-text-muted-theme cursor-not-allowed' : 'text-primary-theme hover:underline'}`}
                >
                  {timer > 0 ? `Resend OTP (${timer}s)` : 'Resend Code'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Career Information */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Current Status</label>
                  <select
                    value={currentStatus}
                    onChange={(e: any) => {
                      setCurrentStatus(e.target.value);
                      if (e.target.value === 'Fresher' || e.target.value === 'Student') {
                        setExperience('0');
                      }
                    }}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  >
                    <option value="Student">Student (Undergrad/Postgrad)</option>
                    <option value="Fresher">Fresher (Looking for 1st role)</option>
                    <option value="Experienced">Experienced Professional</option>
                    <option value="Freelancer">Independent Freelancer</option>
                    <option value="Career Break">On Career Break</option>
                  </select>
                </div>

                {currentStatus !== 'Student' && currentStatus !== 'Fresher' && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Years of Experience</label>
                    <input
                      type="number"
                      min={0.5}
                      max={30}
                      step={0.5}
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Current City</label>
                  <input
                    type="text"
                    required
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Preferred Job Location</label>
                  <input
                    type="text"
                    required
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    placeholder="e.g. Hyderabad, Gandhinagar, Remote"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Expected Salary (LPA)</label>
                  <input
                    type="text"
                    required
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="e.g. 15 LPA"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                  />
                </div>

                {currentStatus !== 'Student' && currentStatus !== 'Fresher' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Current Salary (LPA)</label>
                    <input
                      type="text"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(e.target.value)}
                      placeholder="e.g. 10 LPA"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Remote Preference</label>
                  <div className="flex bg-border-theme/30 p-1 rounded-xl">
                    {['Onsite', 'Hybrid', 'Remote'].map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setRemotePreference(pref)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          remotePreference === pref ? 'bg-primary-theme text-white' : 'text-text-secondary-theme hover:text-text-primary-theme'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Availability / Notice Period</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  >
                    <option value="Immediate">Immediate / Serving Notice</option>
                    <option value="15 Days">Within 15 days</option>
                    <option value="30 Days">Within 30 days</option>
                    <option value="60 Days">Within 60 days</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Resume Parsing Option */}
          {step === 4 && (
            <div className="space-y-6">
              {isParsing ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-primary-theme animate-spin" />
                  <div>
                    <h4 className="text-sm font-black text-text-primary-theme">AI Agent Parsing Resume...</h4>
                    <p className="text-[11px] text-text-secondary-theme mt-1">
                      Extracting experience blocks, technology catalogs and matching keywords.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Option 1: Drag & Drop */}
                    <div className="border border-border-theme/80 hover:border-primary-theme/50 hover:shadow-lg rounded-2xl p-5 text-center flex flex-col justify-between space-y-4 bg-border-theme/10 transition-all cursor-pointer relative overflow-hidden group">
                      <div className="space-y-2">
                        <UploadCloud className="w-10 h-10 text-primary-theme mx-auto group-hover:scale-110 transition-transform" />
                        <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Upload Resume File</h4>
                        <p className="text-[10px] text-text-secondary-theme leading-relaxed">
                          Drag & drop PDF, DOCX here to trigger real-time semantic AI parsing.
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => e.target.files && simulateResumeParsing(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <span className="text-[9px] font-black uppercase text-primary-theme py-1.5 bg-primary-theme/10 rounded-xl">
                        AI Enabled Parser
                      </span>
                    </div>

                    {/* Option 2: Create Resume */}
                    <button
                      type="button"
                      onClick={() => {
                        setResumeOption('create');
                        setShowWizard(true);
                        addToast('Opening AI-powered Resume Creation Wizard...', 'info');
                      }}
                      className={`border rounded-2xl p-5 text-center flex flex-col justify-between space-y-4 transition-all hover:shadow-lg text-left ${
                        resumeOption === 'create' ? 'border-primary-theme bg-primary-theme/5 shadow' : 'border-border-theme/80 bg-border-theme/10'
                      }`}
                    >
                      <div className="space-y-2">
                        <FileText className="w-10 h-10 text-primary-theme mx-auto" />
                        <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">Create Digital Resume</h4>
                        <p className="text-[10px] text-text-secondary-theme leading-relaxed">
                          Populate profile blocks using our standardized ATS-optimized format.
                        </p>
                      </div>
                      <span className="text-[9px] font-black uppercase text-text-secondary-theme py-1.5 bg-border-theme/20 rounded-xl">
                        Create manually
                      </span>
                    </button>

                    {/* Option 3: Skip */}
                    <button
                      type="button"
                      onClick={() => {
                        setResumeOption('skip');
                        addToast('Resume uploading bypassed. You can add it later.', 'info');
                      }}
                      className={`border rounded-2xl p-5 text-center flex flex-col justify-between space-y-4 transition-all hover:shadow-lg text-left ${
                        resumeOption === 'skip' ? 'border-primary-theme bg-primary-theme/5 shadow' : 'border-border-theme/80 bg-border-theme/10'
                      }`}
                    >
                      <div className="space-y-2">
                        <Compass className="w-10 h-10 text-text-muted-theme mx-auto" />
                        <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider font-bold">Skip Sourcing for Now</h4>
                        <p className="text-[10px] text-text-secondary-theme leading-relaxed">
                          Complete profile basic layers first and provide credentials manually.
                        </p>
                      </div>
                      <span className="text-[9px] font-black uppercase text-text-secondary-theme py-1.5 bg-border-theme/20 rounded-xl">
                        Skip for later
                      </span>
                    </button>
                  </div>

                  {/* Parse result display and edit form */}
                  {resumeOption === 'upload' && fileName && (
                    <div className="p-5 border border-border-theme rounded-2xl space-y-4 bg-border-theme/10">
                      <div className="flex justify-between items-center border-b border-border-theme/60 pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-theme" />
                          <span className="text-xs font-extrabold text-text-primary-theme truncate max-w-[200px]">{fileName}</span>
                          <span className="text-[9px] font-black uppercase bg-success-theme/10 text-success-theme px-2 py-0.5 rounded">Parsed</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingParsed(!editingParsed)}
                          className="text-xs text-primary-theme hover:underline flex items-center gap-1 font-bold"
                        >
                          {editingParsed ? <><Save className="w-3.5 h-3.5" /> Save Changes</> : <><Edit3 className="w-3.5 h-3.5" /> Edit AI Extraction</>}
                        </button>
                      </div>

                      {editingParsed ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-text-secondary-theme uppercase">Education</label>
                              <input
                                type="text"
                                value={parsedData.education}
                                onChange={(e) => setParsedData({ ...parsedData, education: e.target.value })}
                                className="w-full bg-transparent border border-border-theme rounded-lg p-2 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-text-secondary-theme uppercase">Experience</label>
                              <input
                                type="text"
                                value={parsedData.experience}
                                onChange={(e) => setParsedData({ ...parsedData, experience: e.target.value })}
                                className="w-full bg-transparent border border-border-theme rounded-lg p-2 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-text-secondary-theme uppercase">Extracted Technology Skills</label>
                            <input
                              type="text"
                              value={parsedData.skills.join(', ')}
                              onChange={(e) => setParsedData({ ...parsedData, skills: e.target.value.split(',').map(s => s.trim()) })}
                              className="w-full bg-transparent border border-border-theme rounded-lg p-2 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-text-secondary-theme uppercase">Featured Projects</label>
                              <input
                                type="text"
                                value={parsedData.projects}
                                onChange={(e) => setParsedData({ ...parsedData, projects: e.target.value })}
                                className="w-full bg-transparent border border-border-theme rounded-lg p-2 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-text-secondary-theme uppercase">Certifications</label>
                              <input
                                type="text"
                                value={parsedData.certifications}
                                onChange={(e) => setParsedData({ ...parsedData, certifications: e.target.value })}
                                className="w-full bg-transparent border border-border-theme rounded-lg p-2 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-text-muted-theme font-black font-mono">Education:</span>
                            <p className="font-extrabold text-text-primary-theme">{parsedData.education}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-text-muted-theme font-black font-mono">Experience:</span>
                            <p className="font-extrabold text-text-primary-theme">{parsedData.experience}</p>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <span className="text-[10px] uppercase text-text-muted-theme font-black font-mono">Core Technology Index:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {parsedData.skills.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-primary-theme/10 text-primary-theme rounded text-[10px] font-black">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-text-muted-theme font-black font-mono">Extracted Projects:</span>
                            <p className="font-extrabold text-text-primary-theme">{parsedData.projects}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-text-muted-theme font-black font-mono">Certifications:</span>
                            <p className="font-extrabold text-text-primary-theme">{parsedData.certifications}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Career Preferences */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Preferred Job Roles</label>
                <div className="flex flex-wrap gap-1.5 border border-border-theme rounded-xl p-3 min-h-[44px]">
                  {preferredRoles.map((role) => (
                    <span key={role} className="px-2.5 py-1 bg-primary-theme text-white text-[10px] font-black rounded-lg flex items-center gap-1.5 shadow-sm">
                      {role}
                      <button type="button" onClick={() => removePreferredRole(role)} className="hover:text-error-theme text-xs">&times;</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredRole())}
                    placeholder="Add role & press Enter"
                    className="bg-transparent border-none text-xs focus:outline-none text-text-primary-theme font-semibold flex-1 min-w-[120px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Preferred Industries</label>
                  <select
                    value={preferredIndustries}
                    onChange={(e) => setPreferredIndustries(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Fintech">Fintech & Banking</option>
                    <option value="Healthcare">Healthcare & Biotech</option>
                    <option value="E-commerce">E-commerce & Retail</option>
                    <option value="Cybersecurity">Cybersecurity Systems</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  >
                    <option value="Full-time">Full-time Regular Position</option>
                    <option value="Part-time">Part-time Schedule</option>
                    <option value="Contract">Contract / Project Basis</option>
                    <option value="Internship">Internship / Co-op</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Preferred Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  >
                    <option value="Remote">100% Remote</option>
                    <option value="Hybrid">Hybrid (2-3 days office)</option>
                    <option value="Onsite">On-site Corporate Headquarters</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Notice Period</label>
                  <select
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  >
                    <option value="Immediate (15 days or less)">Immediate (15 days or less)</option>
                    <option value="1 Month">1 Month Notice</option>
                    <option value="2 Months">2 Months Notice</option>
                    <option value="3 Months">3 Months Notice</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-border-theme/80 bg-primary-theme/5 rounded-2xl">
                <div className="space-y-1 pr-4">
                  <h4 className="text-xs font-black text-text-primary-theme uppercase tracking-wider">"Open To Work" Status Indicator</h4>
                  <p className="text-[10px] text-text-secondary-theme leading-normal">
                    This adds a highly visible green badge alerting matches that you are ready for active recruitment.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenToWork(!openToWork)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-all ${openToWork ? 'bg-primary-theme' : 'bg-border-theme/60'}`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-all ${openToWork ? 'translate-x-5.5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Profile summary */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Strength Meter widget */}
                <div className="bg-border-theme/15 border border-border-theme p-5 rounded-2xl flex flex-col justify-center space-y-3">
                  <span className="text-[10px] font-black uppercase text-text-muted-theme tracking-wider">Profile Strength Rating</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-text-primary-theme font-mono leading-none">{profileStrength}%</span>
                    <span className="text-xs font-bold text-success-theme pb-0.5">Optimal</span>
                  </div>
                  <div className="w-full bg-border-theme/40 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-theme to-emerald-500 rounded-full" style={{ width: `${profileStrength}%` }} />
                  </div>
                  <p className="text-[10px] text-text-secondary-theme font-medium leading-relaxed">
                    A profile rating above 70% qualifies your account for high priority automatic ranking list indexing.
                  </p>
                </div>

                {/* Score Widget */}
                <div className="bg-border-theme/15 border border-border-theme p-5 rounded-2xl flex flex-col justify-center space-y-3">
                  <span className="text-[10px] font-black uppercase text-text-muted-theme tracking-wider">AI Resume Scoring Match</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-text-primary-theme font-mono leading-none">{resumeOption === 'upload' ? `${resumeScore}/100` : 'N/A'}</span>
                    {resumeOption === 'upload' && <span className="text-xs font-bold text-primary-theme pb-0.5">High Match</span>}
                  </div>
                  <p className="text-[10px] text-text-secondary-theme font-medium leading-relaxed">
                    {resumeOption === 'upload' ? 'Resume matching aligns with IT keywords. Score indicates strong correlation to major tech jobs.' : 'Upload or build a standard resume file to calculate your semantic matching indicator score.'}
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-primary-theme/5 border border-primary-theme/15 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-black uppercase text-primary-theme flex items-center gap-1">
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Real-time AI Match Suggestions</span>
                </h4>
                <ul className="space-y-2 text-[11px] font-bold text-text-secondary-theme">
                  {resumeOption !== 'upload' && (
                    <li className="flex items-start gap-2 text-warning-theme">
                      <span className="mt-0.5">✦</span> Upload a physical resume file to unlock your full match score metrics.
                    </li>
                  )}
                  {preferredRoles.length < 3 && (
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-primary-theme">✦</span> Adding one more role like "React Engineer" could expand matched job proposals by 18%.
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary-theme">✦</span> Your preferred hybrid mode is highly targeted. 41 active positions match this criteria in Bengaluru.
                  </li>
                </ul>
              </div>

              {/* Details review table */}
              <div className="p-4 border border-border-theme rounded-2xl space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-[10px] uppercase font-black text-text-muted-theme tracking-wider border-b border-border-theme/40 pb-2">
                  <span>Registered Information Summary</span>
                  <span>Confirm Details</span>
                </div>
                <div className="grid grid-cols-2 gap-4 font-semibold text-text-secondary-theme">
                  <div>
                    <span className="text-[10px] text-text-muted-theme block">Account Holder:</span>
                    <strong className="text-text-primary-theme">{firstName} {lastName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted-theme block">Email Verified:</span>
                    <strong className="text-success-theme">Verified ✓</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted-theme block">Career Level:</span>
                    <strong className="text-text-primary-theme">{currentStatus}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted-theme block">Preferred Mode:</span>
                    <strong className="text-text-primary-theme">{workMode} ({remotePreference})</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Registration Success Screen */}
          {step === 7 && (
            <div className="py-12 text-center space-y-6">
              <div className="w-20 h-20 bg-success-theme/10 text-success-theme rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-text-primary-theme">
                  Registration Complete!
                </h3>
                <p className="text-xs text-text-secondary-theme mt-1.5 max-w-md mx-auto">
                  Welcome to TechnoAdviser! Your Candidate account is now live. Logging in automatically and routing you to your dashboard...
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Nav Buttons */}
      {step < 7 && (
        <div className="flex justify-between items-center border-t border-border-theme/60 pt-6 mt-8">
          <button
            type="button"
            onClick={step === 1 ? onNavigateToLogin : handlePrevStep}
            className="px-5 py-3 border border-border-theme rounded-xl text-xs font-black hover:bg-border-theme/20 text-text-secondary-theme cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Back to Login' : 'Back'}
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="px-6 py-3 bg-primary-theme text-white rounded-xl text-xs font-black hover:bg-primary-hover-theme shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            {step === 6 ? 'Finalize Onboarding' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
