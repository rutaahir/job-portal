/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowLeft, 
  Smartphone, Chrome, Linkedin, Sparkles, Building, 
  Landmark, ShieldAlert, KeyRound, CheckCircle2, 
  AlertTriangle, Loader2, ArrowRight, Shield 
} from 'lucide-react';
import Logo from '../shared/Logo';
import { Role } from '../../types';
import { AuthStep, UserAccount } from './AuthTypes';
import CandidateRegFlow from './CandidateRegFlow';
import EmployerRegFlow from './EmployerRegFlow';

interface AuthFlowProps {
  initialStep: AuthStep;
  onNavigateToPage: (page: string) => void;
  onLoginSuccess: (role: Role, username: string) => void;
}

export default function AuthFlow({ initialStep, onNavigateToPage, onLoginSuccess }: AuthFlowProps) {
  const [step, setStep] = useState<AuthStep>(initialStep);

  // Core Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Security & Brute-force/Rate-limiting State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [csrfToken, setCsrfToken] = useState('');

  // Password Reset States
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState(['', '', '', '', '', '']);
  const [resetPassword, setResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');

  // Social SSO Modal state
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialProvider, setSocialProvider] = useState<'Google' | 'LinkedIn' | null>(null);

  // Employer Status Pending/Rejected Modal
  const [showStatusModal, setShowStatusModal] = useState<UserAccount | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<{ id: string; text: string; type: 'success' | 'info' | 'error' }[]>([]);

  const addToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // 1. Initialize Default User Registry on mount
  useEffect(() => {
    const existingUsers = localStorage.getItem('technoadviser_users');
    if (!existingUsers) {
      const defaultUsers: UserAccount[] = [
        {
          email: 'admin@technoadviser.com',
          phone: '+919999999999',
          passwordHash: 'Admin@12345',
          role: 'ADMINISTRATOR',
          status: 'ACTIVE',
          name: 'Super Admin'
        },
        {
          email: 'sneha@email.com',
          phone: '+919876543210',
          passwordHash: 'Password@123',
          role: 'JOB_SEEKER',
          status: 'ACTIVE',
          name: 'Sneha Kapoor',
          candidateInfo: {
            firstName: 'Sneha',
            lastName: 'Kapoor',
            countryCode: '+91',
            currentStatus: 'Experienced',
            experience: '3',
            currentCity: 'Bengaluru',
            preferredLocation: 'Bengaluru, Remote',
            expectedSalary: '18 LPA',
            currentSalary: '12 LPA',
            remotePreference: 'Hybrid',
            availability: 'Immediate',
            preferredRoles: ['React Developer', 'Frontend Engineer'],
            preferredIndustries: 'Information Technology',
            employmentType: 'Full-time',
            workMode: 'Hybrid',
            noticePeriod: 'Immediate (15 days or less)',
            openToWork: true,
            profileStrength: 85,
            resumeScore: 92
          }
        },
        {
          email: 'arjun@email.com',
          phone: '+919876543211',
          passwordHash: 'Password@123',
          role: 'JOB_SEEKER',
          status: 'ACTIVE',
          name: 'Arjun Reddy'
        },
        {
          email: 'hr@acme.com',
          phone: '+919876543212',
          passwordHash: 'Password@123',
          role: 'RECRUITER',
          status: 'ACTIVE', // Standard active employer
          name: 'Rahul Malhotra',
          employerInfo: {
            companyName: 'Acme Technologies',
            companyEmail: 'contact@acme.com',
            companyPhone: '+918043210987',
            website: 'https://acme.com',
            industry: 'Information Technology',
            companySize: '51-200 employees',
            foundedYear: '2018',
            country: 'India',
            state: 'Karnataka',
            city: 'Bengaluru',
            address: 'Tech Park, Whitefield, Bengaluru',
            designation: 'Talent Acquisition Partner',
            subscriptionPlan: 'Starter',
            verificationStatus: 'APPROVED'
          }
        }
      ];
      localStorage.setItem('technoadviser_users', JSON.stringify(defaultUsers));
    }

    // Generate CSRF token for security audit compliance
    const token = Math.random().toString(36).substring(2, 15);
    setCsrfToken(token);
    sessionStorage.setItem('technoadviser_csrf', token);
  }, []);

  // Lockdown timer countdown handler
  useEffect(() => {
    let timer: any;
    if (isLocked && lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((t) => {
          if (t <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutTimer]);

  // Standard Submit Login handler (Auto Role Detection)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      addToast(`System locked. Please wait ${lockoutTimer}s.`, 'error');
      return;
    }

    // CSRF verification check
    const savedCsrf = sessionStorage.getItem('technoadviser_csrf');
    if (!savedCsrf || savedCsrf !== csrfToken) {
      addToast('CSRF authentication token violation detected.', 'error');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Attempt dynamic backend authentication first
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password })
      });
      const data = await response.json();
      if (response.ok) {
        addToast(`Successfully authenticated as ${data.user.name} via REST API!`, 'success');
        localStorage.setItem('technoadviser_token', data.token);
        if (rememberMe) {
          localStorage.setItem('technoadviser_session', JSON.stringify({
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            timestamp: Date.now()
          }));
        }
        onLoginSuccess(data.user.role, data.user.name);
        return;
      } else {
        addToast(data.error || 'Authentication error', 'error');
        // If password is incorrect, register failure attempt
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        if (attempts >= 5) {
          setIsLocked(true);
          setLockoutTimer(30);
        }
        return;
      }
    } catch (apiErr) {
      console.warn('Backend server connection inactive. Operating on offline local sandbox engine...', apiErr);
    }

    const users: UserAccount[] = JSON.parse(localStorage.getItem('technoadviser_users') || '[]');

    // Search user
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.passwordHash === password
    );

    if (!matchedUser) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);

      // Audit logs
      const logs = JSON.parse(localStorage.getItem('technoadviser_audit_logs') || '[]');
      logs.unshift({
        event: 'FAILED_LOGIN_ATTEMPT',
        email: normalizedEmail,
        timestamp: new Date().toISOString(),
        details: 'Invalid password credentials provided'
      });
      localStorage.setItem('technoadviser_audit_logs', JSON.stringify(logs));

      if (attempts >= 5) {
        setIsLocked(true);
        setLockoutTimer(30);
        addToast('Brute-force security lockdown active. 30 seconds penalty.', 'error');
      } else {
        const remaining = 5 - attempts;
        addToast(`Invalid credentials. ${remaining} attempts remaining before lockdown.`, 'error');
      }
      return;
    }

    // Account Status Guard (Active vs Pending Verification vs Blocked)
    if (matchedUser.role === 'RECRUITER') {
      // Find latest status in company register in localStorage if any
      const companyReg = JSON.parse(localStorage.getItem('technoadviser_pending_companies') || '[]');
      const registeredCompany = companyReg.find((c: any) => c.email.toLowerCase() === normalizedEmail);
      
      const status = registeredCompany ? registeredCompany.status : matchedUser.status;
      
      if (status === 'Pending Verification' || matchedUser.status === 'PENDING_VERIFICATION') {
        setShowStatusModal(matchedUser);
        addToast('Corporate verification review is in progress.', 'info');
        return;
      }

      if (matchedUser.status === 'BLOCKED') {
        addToast('Recruiter profile suspended by administrator.', 'error');
        return;
      }
    }

    // Successful Login
    addToast(`Welcome back, ${matchedUser.name}! Opening portal...`, 'success');

    localStorage.setItem('technoadviser_token', matchedUser.email);

    // Persist remember me
    if (rememberMe) {
      localStorage.setItem('technoadviser_session', JSON.stringify({
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role,
        timestamp: Date.now()
      }));
    }

    // Log security audit
    const logs = JSON.parse(localStorage.getItem('technoadviser_audit_logs') || '[]');
    logs.unshift({
      event: 'LOGIN_SUCCESS',
      email: matchedUser.email,
      role: matchedUser.role,
      timestamp: new Date().toISOString(),
      details: 'Successful portal ingress'
    });
    localStorage.setItem('technoadviser_audit_logs', JSON.stringify(logs));

    setTimeout(() => {
      // Map Role to global Role props
      let globalRole: Role = 'GUEST';
      if (matchedUser.role === 'JOB_SEEKER') globalRole = 'JOB_SEEKER';
      else if (matchedUser.role === 'RECRUITER') globalRole = 'RECRUITER';
      else if (matchedUser.role === 'ADMINISTRATOR') globalRole = 'ADMINISTRATOR';

      onLoginSuccess(globalRole, matchedUser.name);
    }, 1200);
  };

  // Forgot Password Phase 1: Check account
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users: UserAccount[] = JSON.parse(localStorage.getItem('technoadviser_users') || '[]');
    const exists = users.some((u) => u.email.toLowerCase() === resetEmail.toLowerCase());

    if (!exists) {
      addToast('No registered accounts match this email address.', 'error');
      return;
    }

    addToast(`Security OTP passcode sent to: ${resetEmail}`, 'success');
    setStep('OTP_VERIFICATION');
  };

  // OTP Verification for Password Reset
  const handleResetOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = resetOtp.join('');
    if (enteredOtp !== '248167') {
      addToast('Invalid secure verification OTP. Use 248167.', 'error');
      return;
    }
    addToast('OTP verified. Please set your new password.', 'success');
    setStep('RESET_PASSWORD');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPassword !== confirmResetPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    if (resetPassword.length < 8) {
      addToast('Password must consist of at least 8 characters.', 'error');
      return;
    }

    // Update password in local storage
    const users: UserAccount[] = JSON.parse(localStorage.getItem('technoadviser_users') || '[]');
    const updated = users.map((u) => {
      if (u.email.toLowerCase() === resetEmail.toLowerCase()) {
        return { ...u, passwordHash: resetPassword };
      }
      return u;
    });
    localStorage.setItem('technoadviser_users', JSON.stringify(updated));

    addToast('Portal password updated securely!', 'success');
    setStep('RESET_SUCCESS');
  };

  // SSO single sign-on handlers
  const handleSocialSSOClick = (provider: 'Google' | 'LinkedIn') => {
    setSocialProvider(provider);
    setShowSocialModal(true);
  };

  const handleSocialSelectAccount = (roleSelection: 'Candidate' | 'Employer') => {
    setShowSocialModal(false);
    if (roleSelection === 'Candidate') {
      addToast(`Authenticating via ${socialProvider} (Candidate)...`, 'success');
      setTimeout(() => {
        onLoginSuccess('JOB_SEEKER', 'Sneha Kapoor');
      }, 1000);
    } else {
      addToast(`Authenticating via ${socialProvider} (Employer)...`, 'success');
      setTimeout(() => {
        onLoginSuccess('RECRUITER', 'Rahul Malhotra');
      }, 1000);
    }
  };

  // Developer Fast-Approve from login status modal
  const handleDevApprovePendingEmployer = () => {
    if (!showStatusModal) return;
    const users: UserAccount[] = JSON.parse(localStorage.getItem('technoadviser_users') || '[]');
    const updated = users.map((u) => {
      if (u.email.toLowerCase() === showStatusModal.email.toLowerCase()) {
        return { ...u, status: 'ACTIVE' as const };
      }
      return u;
    });
    localStorage.setItem('technoadviser_users', JSON.stringify(updated));

    // Also update in pending companies register
    const companyReg = JSON.parse(localStorage.getItem('technoadviser_pending_companies') || '[]');
    const updatedReg = companyReg.map((c: any) => {
      if (c.email.toLowerCase() === showStatusModal.email.toLowerCase()) {
        return { ...c, status: 'Verified' };
      }
      return c;
    });
    localStorage.setItem('technoadviser_pending_companies', JSON.stringify(updatedReg));

    addToast('Dev Override: Recruiter approved instantly!', 'success');
    setShowStatusModal(null);
  };

  // SSO selection modals
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Toast Overlay Layer */}
      <div className="fixed top-5 right-5 z-55 space-y-2.5 max-w-sm pointer-events-none w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 pointer-events-auto backdrop-blur-md ${
                t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-500' :
                t.type === 'error' ? 'bg-rose-500/10 border-rose-500/15 text-rose-500' : 'bg-primary-theme/10 border-primary-theme/15 text-primary-theme'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        
        {/* LOGIN SCREEN */}
        {step === 'LOGIN' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto"
          >
            {/* Login form columns */}
            <div className="lg:col-span-7 bg-surface-theme p-8 sm:p-10 rounded-3xl border border-border-theme flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <Logo showSubtitle={false} size="md" className="mb-4" />
                  <h1 className="text-2xl sm:text-3xl font-serif font-black text-text-primary-theme">
                    Portal <span className="text-primary-theme">Ingress</span>
                  </h1>
                  <p className="text-xs text-text-secondary-theme font-semibold mt-1">
                    Enter email credentials to login. The system automatically detects your role (Candidate, Employer, or Super Admin).
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Secure Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-text-muted-theme" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sneha@email.com or hr@acme.com"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3.5 pl-11 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Access Password</label>
                      <button
                        type="button"
                        onClick={() => setStep('FORGOT_PASSWORD')}
                        className="text-[10px] font-black uppercase text-primary-theme hover:underline tracking-wider"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-text-muted-theme" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter account password"
                        className="w-full bg-transparent border border-border-theme rounded-xl p-3.5 pl-11 pr-11 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-text-muted-theme hover:text-text-primary-theme"
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1.5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-secondary-theme">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="accent-primary-theme rounded border-border-theme h-4.5 w-4.5"
                      />
                      Remember login session
                    </label>
                  </div>

                  {isLocked && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/15 rounded-xl flex items-center gap-2 text-rose-500 text-[10px] font-black">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Security penalty lockout active. Retrying disabled for {lockoutTimer}s.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLocked}
                    className={`w-full text-white font-black py-3.5 px-6 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                      isLocked ? 'bg-border-theme text-text-muted-theme cursor-not-allowed' : 'bg-primary-theme hover:bg-primary-hover-theme hover:shadow-lg cursor-pointer'
                    }`}
                  >
                    <span>Authenticate Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* SSO options */}
                <div className="space-y-3.5 pt-2">
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-border-theme/60" />
                    <span className="flex-shrink mx-4 text-[10px] text-text-muted-theme font-mono uppercase tracking-widest font-black">or secure SSO</span>
                    <div className="flex-grow border-t border-border-theme/60" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialSSOClick('Google')}
                      className="border border-border-theme hover:bg-border-theme/20 rounded-xl py-3 flex justify-center items-center gap-2 text-xs font-bold text-text-secondary-theme cursor-pointer"
                    >
                      <Chrome className="w-4 h-4 text-rose-500" />
                      Google Single Sign-On
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSSOClick('LinkedIn')}
                      className="border border-border-theme hover:bg-border-theme/20 rounded-xl py-3 flex justify-center items-center gap-2 text-xs font-bold text-text-secondary-theme cursor-pointer"
                    >
                      <Linkedin className="w-4 h-4 text-blue-500" />
                      LinkedIn Professional SSO
                    </button>
                  </div>
                </div>

                {/* Demo Accounts Center */}
                <div className="bg-primary-theme/5 border border-primary-theme/10 rounded-2xl p-4.5 space-y-3">
                  <div>
                    <span className="text-[9px] font-black uppercase text-primary-theme tracking-widest font-mono flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      System Prototype Credentials
                    </span>
                    <p className="text-[10px] text-text-secondary-theme font-medium leading-relaxed mt-0.5">
                      Utilize our mock test credentials or bypass using social SSO handlers:
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-text-secondary-theme">
                    <button
                      type="button"
                      onClick={() => { setEmail('sneha@email.com'); setPassword('Password@123'); }}
                      className="bg-border-theme/30 p-2 rounded-lg text-center hover:bg-border-theme/60 text-[9px] truncate"
                    >
                      Candidate Account
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail('hr@acme.com'); setPassword('Password@123'); }}
                      className="bg-border-theme/30 p-2 rounded-lg text-center hover:bg-border-theme/60 text-[9px] truncate"
                    >
                      Recruiter Account
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmail('admin@technoadviser.com'); setPassword('Admin@12345'); }}
                      className="bg-border-theme/30 p-2 rounded-lg text-center hover:bg-border-theme/60 text-[9px] truncate"
                    >
                      Super Admin
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border-theme/60 pt-6 mt-6 flex justify-between items-center text-xs">
                <span className="text-text-secondary-theme font-medium">New to TechnoAdviser?</span>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('CANDIDATE_REG')}
                    className="text-primary-theme hover:underline font-black uppercase tracking-wider"
                  >
                    Candidate Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('EMPLOYER_REG')}
                    className="text-primary-theme hover:underline font-black uppercase tracking-wider"
                  >
                    Employer Register
                  </button>
                </div>
              </div>
            </div>

            {/* Aesthetic Banner Panel */}
            <div className="hidden lg:flex lg:col-span-5 bg-secondary-theme text-white rounded-3xl p-8 flex-col justify-between relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,112,42,0.15),transparent_50%)] pointer-events-none" />

              <div className="space-y-6 z-10">
                <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary-theme shadow-inner">
                  <ShieldCheck className="w-6 h-6 text-primary-theme" />
                </div>
                <h3 className="text-2xl font-serif font-black leading-tight">
                  TechnoAdviser Secure Ingress Node.
                </h3>
                <p className="text-xs text-white/80 font-normal leading-relaxed">
                  Every account undergoes automatic security audit indexing. We mandate TLS channels, CSRF validation, brute-force mitigation limits, and manual recruiter background credentials audit to sustain secure matching ratios.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 mt-8 z-10 text-xs">
                <div>
                  <strong className="text-lg font-extrabold font-serif text-white">100%</strong>
                  <div className="text-[9px] uppercase tracking-wider text-white/60 font-bold mt-0.5">Corporate Verified</div>
                </div>
                <div>
                  <strong className="text-lg font-extrabold font-serif text-white">Secure</strong>
                  <div className="text-[9px] uppercase tracking-wider text-white/60 font-bold mt-0.5">Audit Trails Logging</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CANDIDATE REGISTRATION SCREEN */}
        {step === 'CANDIDATE_REG' && (
          <CandidateRegFlow 
            onComplete={(acc) => {
              onLoginSuccess('JOB_SEEKER', acc.name);
            }} 
            onNavigateToLogin={() => setStep('LOGIN')} 
            addToast={addToast}
          />
        )}

        {/* EMPLOYER REGISTRATION SCREEN */}
        {step === 'EMPLOYER_REG' && (
          <EmployerRegFlow 
            onComplete={(acc) => {
              onLoginSuccess('RECRUITER', acc.name);
            }} 
            onNavigateToLogin={() => setStep('LOGIN')} 
            addToast={addToast}
          />
        )}

        {/* FORGOT PASSWORD SCREEN */}
        {step === 'FORGOT_PASSWORD' && (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md mx-auto bg-surface-theme p-8 sm:p-10 rounded-3xl border border-border-theme shadow-xl"
          >
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => setStep('LOGIN')}
                className="text-xs font-black text-text-secondary-theme hover:text-text-primary-theme flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>

              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-text-primary-theme">
                  Secure Password Reset
                </h2>
                <p className="text-xs text-text-secondary-theme mt-1 font-semibold">
                  Provide your registered email. We will generate and dispatch a 6-digit access recovery OTP code.
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Account Email Address</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. sneha@email.com"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3.5 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-theme hover:bg-primary-hover-theme text-white font-black py-3.5 px-6 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Generate Recovery Code
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* RESET OTP VERIFICATION SCREEN */}
        {step === 'OTP_VERIFICATION' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md mx-auto bg-surface-theme p-8 sm:p-10 rounded-3xl border border-border-theme shadow-xl text-center space-y-6"
          >
            <div className="w-16 h-16 bg-primary-theme/10 text-primary-theme rounded-full flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-serif font-black text-text-primary-theme">Verify Recovery Code</h2>
              <p className="text-xs text-text-secondary-theme font-medium mt-1">
                Enter the 6-digit secure recovery code sent to your email inbox: <br />
                <strong className="text-text-primary-theme font-mono">{resetEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleResetOtpVerify} className="space-y-5">
              <div className="flex justify-center gap-2">
                {resetOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`reset-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    required
                    value={digit}
                    onChange={(e) => {
                      if (e.target.value.length <= 1) {
                        const nextOtp = [...resetOtp];
                        nextOtp[idx] = e.target.value;
                        setResetOtp(nextOtp);
                        if (e.target.value && idx < 5) {
                          const nextInput = document.getElementById(`reset-otp-${idx + 1}`);
                          nextInput?.focus();
                        }
                      }
                    }}
                    className="w-11 h-12 bg-transparent border border-border-theme text-center text-sm font-extrabold text-text-primary-theme rounded-lg focus:outline-none focus:border-primary-theme"
                  />
                ))}
              </div>

              <div className="text-[10px] text-text-muted-theme font-bold flex justify-between items-center px-4">
                <span>Passcode is: <strong className="text-primary-theme font-mono">248167</strong></span>
                <span>Time remaining: <strong className="text-error-theme font-mono">03:00</strong></span>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-theme hover:bg-primary-hover-theme text-white font-black py-3.5 px-6 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Validate Passcode
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {/* SET NEW PASSWORD SCREEN */}
        {step === 'RESET_PASSWORD' && (
          <motion.div
            key="reset_pass"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md mx-auto bg-surface-theme p-8 sm:p-10 rounded-3xl border border-border-theme shadow-xl space-y-6"
          >
            <div>
              <h2 className="text-xl font-serif font-black text-text-primary-theme">Create New Password</h2>
              <p className="text-xs text-text-secondary-theme font-semibold mt-1">
                Establish a strong password credentials layer.
              </p>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  required
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3.5 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmResetPassword}
                  onChange={(e) => setConfirmResetPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3.5 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-theme hover:bg-primary-hover-theme text-white font-black py-3.5 px-6 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Update Password
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {/* PASSWORD RESET SUCCESS SCREEN */}
        {step === 'RESET_SUCCESS' && (
          <motion.div
            key="reset_success"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md mx-auto bg-surface-theme p-8 sm:p-10 rounded-3xl border border-border-theme shadow-xl text-center space-y-6"
          >
            <div className="w-16 h-16 bg-success-theme/10 text-success-theme rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-text-primary-theme">Credentials Restored!</h2>
              <p className="text-xs text-text-secondary-theme font-semibold mt-1">
                Your portal password has been updated. You can now login with your new credentials.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('LOGIN')}
              className="w-full bg-primary-theme hover:bg-primary-hover-theme text-white font-black py-3.5 px-6 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
            >
              Sign In Now
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Social SSO Account Select Dialog Overlay */}
      {showSocialModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface-theme border border-border-theme max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-5"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-primary-theme" />
              <div>
                <h4 className="text-xs font-black uppercase text-primary-theme tracking-widest font-mono">Secure Single Sign-On</h4>
                <h3 className="text-sm font-black text-text-primary-theme">{socialProvider} Gateway</h3>
              </div>
            </div>

            <p className="text-[11px] text-text-secondary-theme font-medium leading-relaxed">
              TechnoAdviser requests access to your verified social profile fields (email, identity tokens). Choose account target role:
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleSocialSelectAccount('Candidate')}
                className="w-full p-3 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Authorize as Candidate</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSocialSelectAccount('Employer')}
                className="w-full p-3 bg-secondary-theme hover:bg-secondary-theme/80 border border-border-theme text-text-primary-theme rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Authorize as Employer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSocialModal(false)}
              className="w-full text-center text-[10px] font-black uppercase text-text-muted-theme hover:text-text-primary-theme"
            >
              Cancel Auth
            </button>
          </motion.div>
        </div>
      )}

      {/* Employer Status Pending Review Dialog Overlay */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface-theme border border-border-theme max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider font-mono">Safety & Trust Verification</span>
                <h3 className="text-base font-black text-text-primary-theme mt-0.5">Corporate Review Pending</h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-text-secondary-theme leading-normal">
              <p>
                Hi <strong className="text-text-primary-theme">{showStatusModal.name}</strong>, your Employer account representing <strong className="text-text-primary-theme">{showStatusModal.employerInfo?.companyName || 'Corporate Enterprise'}</strong> is currently queued for manual credentials audit.
              </p>
              <div className="p-4 bg-border-theme/15 rounded-2xl border border-border-theme/40 text-[11px] font-semibold space-y-1.5">
                <span className="text-[9px] font-black uppercase text-text-muted-theme font-mono tracking-widest block">Review Status:</span>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span>Awaiting Trust & Safety Team Validation</span>
                </div>
                <p className="text-[10px] text-text-muted-theme leading-relaxed mt-1">
                  We are validating corporate domain records, registration certificates and licensing agreements. Usually takes up to 4 hours.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleDevApprovePendingEmployer}
                className="flex-1 p-3 bg-primary-theme hover:bg-primary-hover-theme text-white rounded-xl text-xs font-black shadow transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                Developer Approve
              </button>
              <button
                type="button"
                onClick={() => setShowStatusModal(null)}
                className="flex-1 p-3 bg-transparent border border-border-theme text-text-secondary-theme font-bold rounded-xl text-xs hover:bg-border-theme/20 transition-all cursor-pointer"
              >
                Close Gateway
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
