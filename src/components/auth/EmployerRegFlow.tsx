/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Mail, Phone, Globe, Briefcase, Calendar, 
  MapPin, User, ShieldCheck, CheckCircle2, FileCheck, 
  CreditCard, Loader2, Sparkles, ArrowRight, ArrowLeft, 
  UploadCloud, Landmark, CheckCircle, ShieldAlert 
} from 'lucide-react';
import { UserAccount } from './AuthTypes';

interface EmployerRegFlowProps {
  onComplete: (account: UserAccount) => void;
  onNavigateToLogin: () => void;
  addToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export default function EmployerRegFlow({ onComplete, onNavigateToLogin, addToast }: EmployerRegFlowProps) {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // STEP 1 State: Company Information
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Information Technology');
  const [companySize, setCompanySize] = useState('51-200 employees');
  const [foundedYear, setFoundedYear] = useState('2018');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Karnataka');
  const [city, setCity] = useState('Bengaluru');
  const [address, setAddress] = useState('');

  // STEP 2 State: Primary Contact
  const [contactName, setContactName] = useState('');
  const [designation, setDesignation] = useState('Hiring Manager');
  const [officialEmail, setOfficialEmail] = useState('');
  const [officialMobile, setOfficialMobile] = useState('');

  // STEP 3 State: Verify Email (OTP Verification)
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);

  // STEP 4 State: Company Documents
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [coverUploaded, setCoverUploaded] = useState(false);
  const [certUploaded, setCertUploaded] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [businessLicense, setBusinessLicense] = useState(false);

  // STEP 5 State: Company Profile
  const [description, setDescription] = useState('');
  const [culture, setCulture] = useState('');
  const [benefits, setBenefits] = useState('');
  const [socialLinkedin, setSocialLinkedin] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');

  // STEP 6 State: Subscription
  const [selectedPlan, setSelectedPlan] = useState<'Free' | 'Starter' | 'Professional' | 'Enterprise'>('Starter');
  const [paymentRedirecting, setPaymentRedirecting] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [transaction, setTransaction] = useState<any>(null);

  // STEP 7 State: Pending Verification
  const [notifyingAdmin, setNotifyingAdmin] = useState(false);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleNextStep = async () => {
    if (step === 1) {
      if (!companyName || !companyEmail || !companyPhone || !website || !address) {
        addToast('Please complete all company information fields.', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!contactName || !officialEmail || !officialMobile || !password || !confirmPassword) {
        addToast('Please fill out all primary contact and credential fields.', 'error');
        return;
      }
      if (password !== confirmPassword) {
        addToast('Passwords do not match.', 'error');
        return;
      }

      // Check unique mock emails
      const users: UserAccount[] = JSON.parse(localStorage.getItem('technoadviser_users') || '[]');
      if (users.some((u) => u.email.toLowerCase() === officialEmail.toLowerCase())) {
        addToast('Official email is already registered on TechnoAdviser.', 'error');
        return;
      }

      // Simulation: dispatch OTP
      addToast(`Verification code dispatched to official email: ${officialEmail}`, 'success');
      setTimer(60);
      setStep(3);
    } else if (step === 3) {
      const otpCode = emailOtp.join('');
      if (otpCode.length < 6) {
        addToast('Please enter the complete 6-digit OTP code.', 'error');
        return;
      }
      if (otpCode !== '248167') {
        addToast('Invalid verification code. Use code 248167.', 'error');
        return;
      }
      addToast('Corporate official email successfully verified!', 'success');
      setStep(4);
    } else if (step === 4) {
      if (!certUploaded) {
        addToast('Please upload company registration certificate.', 'error');
        return;
      }
      setStep(5);
    } else if (step === 5) {
      if (!description || !culture) {
        addToast('Please add some company branding profile info.', 'error');
        return;
      }
      setStep(6);
    } else if (step === 6) {
      // If payment is required
      if (selectedPlan !== 'Free' && !paymentCompleted) {
        if (!cardNumber || !cardExpiry || !cardCvc) {
          addToast('Please input payment card details to initiate billing.', 'error');
          return;
        }
        // Process payment
        setPaymentRedirecting(true);
        setTimeout(() => {
          const mockTxId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
          const mockInvoice = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const amt = selectedPlan === 'Starter' ? '$99' : selectedPlan === 'Professional' ? '$299' : '$799';
          const txData = {
            id: mockTxId,
            invoiceNumber: mockInvoice,
            amount: amt,
            timestamp: new Date().toLocaleDateString(),
            status: 'Paid' as const
          };
          setTransaction(txData);
          setPaymentCompleted(true);
          setPaymentRedirecting(false);
          addToast('Corporate subscription plan activated successfully! Transaction saved.', 'success');
        }, 2500);
        return;
      }
      
      // Save Employer Account
      const newAccount: UserAccount = {
        email: officialEmail.toLowerCase(),
        phone: officialMobile,
        passwordHash: password,
        role: 'RECRUITER',
        status: 'PENDING_VERIFICATION', // Starts as pending review
        name: contactName,
        employerInfo: {
          companyName,
          companyEmail,
          companyPhone,
          website,
          industry,
          companySize,
          foundedYear,
          country,
          state,
          city,
          address,
          designation,
          logoUrl: logoUploaded ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80' : undefined,
          coverUrl: coverUploaded ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80' : undefined,
          regCertificateUrl: 'sample_cert.pdf',
          gstNumber: gstNumber || undefined,
          businessLicenseUrl: businessLicense ? 'sample_license.pdf' : undefined,
          description,
          culture,
          benefits: benefits || 'Standard corporate health benefits and equity packages.',
          officePhotos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'],
          socialLinks: {
            linkedin: socialLinkedin || undefined,
            twitter: socialTwitter || undefined
          },
          subscriptionPlan: selectedPlan,
          transaction: transaction || undefined,
          verificationStatus: 'PENDING'
        }
      };

      // Sync onboarding to backend REST API
      try {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: officialEmail.toLowerCase(),
            password: password,
            role: 'RECRUITER',
            name: contactName,
            phone: officialMobile,
            details: {
              companyName,
              industry,
              location: `${city}, ${country}`,
              website,
              about: description
            }
          })
        });
      } catch (err) {
        console.warn('Backend REST server registration failed or offline. Fallback client preservation active.', err);
      }

      // Push into local storage
      const users: UserAccount[] = JSON.parse(localStorage.getItem('technoadviser_users') || '[]');
      users.push(newAccount);
      localStorage.setItem('technoadviser_users', JSON.stringify(users));

      // Trigger Super Admin Notification update
      const pendingCompanies = JSON.parse(localStorage.getItem('technoadviser_pending_companies') || '[]');
      pendingCompanies.push({
        id: `co-${Date.now()}`,
        name: companyName,
        industry,
        location: `${city}, ${country}`,
        status: 'Pending Verification',
        joined: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        reviews: 0,
        email: officialEmail
      });
      localStorage.setItem('technoadviser_pending_companies', JSON.stringify(pendingCompanies));

      addToast('Profile compiled! Account is now in PENDING status.', 'info');
      setStep(7);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    if (value.length <= 1) {
      const nextOtp = [...emailOtp];
      nextOtp[index] = value;
      setEmailOtp(nextOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`emp-otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const triggerAdminNotifySimulation = () => {
    setNotifyingAdmin(true);
    addToast('Contacting trust audit team members...', 'info');
    setTimeout(() => {
      setNotifyingAdmin(false);
      addToast('Super Admin notified! Core audit ticket generated.', 'success');
    }, 2000);
  };

  const handleDevFastApprove = () => {
    // Modify status in localStorage directly
    const users: UserAccount[] = JSON.parse(localStorage.getItem('technoadviser_users') || '[]');
    const updatedUsers = users.map(u => {
      if (u.email.toLowerCase() === officialEmail.toLowerCase()) {
        return {
          ...u,
          status: 'ACTIVE' as const,
          employerInfo: {
            ...u.employerInfo!,
            verificationStatus: 'APPROVED' as const
          }
        };
      }
      return u;
    });
    localStorage.setItem('technoadviser_users', JSON.stringify(updatedUsers));
    addToast('Developer Bypass: Employer verified successfully!', 'success');
    setStep(8);
    
    setTimeout(() => {
      const account = updatedUsers.find(u => u.email.toLowerCase() === officialEmail.toLowerCase());
      if (account) onComplete(account);
    }, 2000);
  };

  const planDetails = {
    Free: { price: '$0', desc: 'Post up to 2 positions with basic matching parameters.' },
    Starter: { price: '$99', desc: 'Post up to 10 positions with standard screening & match lists.' },
    Professional: { price: '$299', desc: 'Unlimited listings with AI sourcing tools and calendar invites.' },
    Enterprise: { price: '$799', desc: 'Full custom sourcing pipeline with SLA and dedicated account manager.' }
  };

  return (
    <div className="bg-surface-theme p-6 sm:p-10 rounded-3xl border border-border-theme shadow-xl max-w-4xl mx-auto">
      {/* Header Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-theme font-mono">
              Enterprise Recruiter Onboarding
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-text-primary-theme mt-1">
              {step === 1 && 'Company Profile & Registration'}
              {step === 2 && 'Primary Sourcing Contact'}
              {step === 3 && 'Corporate Domain Validation'}
              {step === 4 && 'Legal Corporate Documents'}
              {step === 5 && 'Brand Culture Details'}
              {step === 6 && 'Corporate Licensing Subscriptions'}
              {step === 7 && 'Awaiting Verification Audit'}
              {step === 8 && 'Onboarding Verification Complete!'}
            </h2>
          </div>
          <span className="text-xs font-black text-text-secondary-theme bg-border-theme/40 px-3 py-1.5 rounded-full font-mono">
            {step} / 8
          </span>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex gap-1.5">
          {Array.from({ length: 8 }).map((_, idx) => (
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
          {/* STEP 1: Company Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Technologies"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Corporate Public Email</label>
                  <input
                    type="email"
                    required
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="e.g. contact@acme.com"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Company Phone</label>
                  <input
                    type="tel"
                    required
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    placeholder="e.g. +91 80 4321 0987"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Website URL</label>
                  <input
                    type="url"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://acme.com"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Fintech">Fintech Solutions</option>
                    <option value="Healthcare">Healthcare & Biotech</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="EdTech">Educational Technology</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Company Size</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  >
                    <option value="1-10 employees">1-10 employees</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="51-200 employees">51-200 employees</option>
                    <option value="201-500 employees">201-500 employees</option>
                    <option value="500+ employees">500+ employees</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Founded Year</label>
                  <input
                    type="number"
                    required
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(e.target.value)}
                    placeholder="2018"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">State / Region</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Registered Corporate Address</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street details, Business hub, Block, Zip code"
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Primary Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Primary Contact Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 w-4 h-4 text-text-muted-theme" />
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Rahul Malhotra"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 pl-10 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Official Designation</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Lead Talent Acquisition"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Official Corporate Email</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-4 h-4 text-text-muted-theme" />
                    <input
                      type="email"
                      required
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      placeholder="e.g. r.malhotra@acme.com"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 pl-10 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Official Mobile Number</label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 w-4 h-4 text-text-muted-theme" />
                    <input
                      type="tel"
                      required
                      value={officialMobile}
                      onChange={(e) => setOfficialMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 pl-10 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border-theme/40 pt-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Create Portal Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Account security password"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Confirm Portal Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Verify security password"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Verify Email */}
          {step === 3 && (
            <div className="space-y-6 max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-primary-theme/10 text-primary-theme rounded-full flex items-center justify-center mx-auto mb-2">
                <Landmark className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary-theme font-medium">
                  We have dispatched a verification passcode to your official corporate inbox at:
                </p>
                <strong className="text-xs text-text-primary-theme font-mono">{officialEmail}</strong>
              </div>

              <div className="flex justify-center gap-2 py-2">
                {emailOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`emp-otp-${idx}`}
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
                <span>OTP verification is: <strong className="text-primary-theme font-mono">248167</strong></span>
                <span>Resend in: <strong className="text-error-theme font-mono">{timer}s</strong></span>
              </div>
            </div>
          )}

          {/* STEP 4: Company Documents */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Logo Upload */}
                <div className="border border-dashed border-border-theme rounded-2xl p-4 text-center space-y-2 bg-border-theme/10 relative cursor-pointer hover:border-primary-theme transition-all">
                  <UploadCloud className="w-8 h-8 text-primary-theme mx-auto" />
                  <span className="text-[11px] font-black text-text-primary-theme block uppercase tracking-wider">Company Corporate Logo</span>
                  <p className="text-[9px] text-text-secondary-theme">Upload high contrast SVG, PNG logo (1:1 ratio)</p>
                  <input type="file" onChange={() => { setLogoUploaded(true); addToast('Logo uploaded!', 'success'); }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {logoUploaded && <span className="text-[10px] font-black text-success-theme block">✓ Uploaded successfully</span>}
                </div>

                {/* Cover Image */}
                <div className="border border-dashed border-border-theme rounded-2xl p-4 text-center space-y-2 bg-border-theme/10 relative cursor-pointer hover:border-primary-theme transition-all">
                  <UploadCloud className="w-8 h-8 text-primary-theme mx-auto" />
                  <span className="text-[11px] font-black text-text-primary-theme block uppercase tracking-wider">Company Cover banner</span>
                  <p className="text-[9px] text-text-secondary-theme">Office wallpaper photo or corporate banner</p>
                  <input type="file" onChange={() => { setCoverUploaded(true); addToast('Cover banner uploaded!', 'success'); }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {coverUploaded && <span className="text-[10px] font-black text-success-theme block">✓ Uploaded successfully</span>}
                </div>
              </div>

              <div className="p-5 border border-border-theme rounded-2xl space-y-4 bg-border-theme/5">
                <span className="text-[10px] font-black text-text-muted-theme uppercase block tracking-widest font-mono">Corporate Verification Documents</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase">Registration Certificate (PDF)</label>
                    <div className="relative border border-border-theme rounded-xl p-3 text-center bg-transparent cursor-pointer hover:border-primary-theme transition-all">
                      <input type="file" accept=".pdf" onChange={() => { setCertUploaded(true); addToast('Certificate uploaded!', 'success'); }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <span className="text-xs font-bold text-text-secondary-theme">
                        {certUploaded ? '✓ CertificateAttached.pdf' : 'Choose registration PDF file'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-text-secondary-theme uppercase">Corporate GSTIN Number (Optional)</label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="e.g. 29AAAAA1111A1Z1"
                      className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="gst-license"
                    checked={businessLicense}
                    onChange={() => setBusinessLicense(!businessLicense)}
                    className="accent-primary-theme rounded border-border-theme h-4 w-4"
                  />
                  <label htmlFor="gst-license" className="text-[11px] font-bold text-text-secondary-theme">
                    I have provided valid government registration documents. I authorize TechnoAdviser to conduct manual credentials check audits.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Company Profile */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Company Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your company culture, technology domains, core missions..."
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Corporate Workplace Culture</label>
                <textarea
                  required
                  rows={2}
                  value={culture}
                  onChange={(e) => setCulture(e.target.value)}
                  placeholder="e.g. Flat hierarchy, complete remote autonomy, robust tech challenges, health insurance schemes..."
                  className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold placeholder-text-muted-theme"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-text-secondary-theme uppercase tracking-wider">Social Branding Profiles</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="url"
                    value={socialLinkedin}
                    onChange={(e) => setSocialLinkedin(e.target.value)}
                    placeholder="LinkedIn Company URL"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                  <input
                    type="url"
                    value={socialTwitter}
                    onChange={(e) => setSocialTwitter(e.target.value)}
                    placeholder="Twitter Company URL"
                    className="w-full bg-transparent border border-border-theme rounded-xl p-3 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Choose Subscription */}
          {step === 6 && (
            <div className="space-y-6">
              {!paymentCompleted ? (
                <div className="space-y-5">
                  <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-widest block font-mono">Select Active Licensing Tier</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {(Object.keys(planDetails) as Array<keyof typeof planDetails>).map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setSelectedPlan(plan)}
                        className={`border rounded-2xl p-4 text-left flex flex-col justify-between min-h-[140px] transition-all hover:shadow-md ${
                          selectedPlan === plan ? 'border-primary-theme bg-primary-theme/5 shadow' : 'border-border-theme bg-border-theme/10'
                        }`}
                      >
                        <div>
                          <strong className="text-xs font-black text-text-primary-theme block uppercase">{plan}</strong>
                          <span className="text-xl font-black text-primary-theme block mt-1">{planDetails[plan].price}</span>
                        </div>
                        <p className="text-[9px] text-text-secondary-theme leading-normal mt-2">{planDetails[plan].desc}</p>
                      </button>
                    ))}
                  </div>

                  {selectedPlan !== 'Free' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 border border-border-theme rounded-2xl space-y-4 bg-primary-theme/5"
                    >
                      <span className="text-[10px] font-black text-text-muted-theme uppercase tracking-wider block font-mono">Secure Stripe Billing Gateway Integration</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-text-secondary-theme uppercase">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4111 2222 3333 4444"
                            className="w-full bg-transparent border border-border-theme rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-text-secondary-theme uppercase">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full bg-transparent border border-border-theme rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-text-secondary-theme uppercase">Secure CVC</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="•••"
                            className="w-full bg-transparent border border-border-theme rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary-theme text-text-primary-theme font-semibold"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="p-6 border border-success-theme/30 bg-success-theme/5 rounded-3xl space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-success-theme" />
                    <div>
                      <h4 className="text-sm font-black text-text-primary-theme uppercase tracking-wider">Subscription Complete</h4>
                      <p className="text-[10px] text-text-secondary-theme">Invoice & transactional documents archived successfully.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-theme border border-border-theme rounded-2xl text-[11px] font-semibold text-text-secondary-theme space-y-2.5">
                    <div className="flex justify-between border-b border-border-theme/40 pb-2">
                      <span className="text-text-muted-theme">Transaction ID:</span>
                      <strong className="text-text-primary-theme font-mono">{transaction?.id}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border-theme/40 pb-2">
                      <span className="text-text-muted-theme">Official Invoice Number:</span>
                      <strong className="text-text-primary-theme font-mono">{transaction?.invoiceNumber}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border-theme/40 pb-2">
                      <span className="text-text-muted-theme">Licensing Tier Plan:</span>
                      <strong className="text-primary-theme font-black uppercase">{selectedPlan}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted-theme">Amount Paid:</span>
                      <strong className="text-text-primary-theme font-black font-mono">{transaction?.amount} USD</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="text-xs text-primary-theme hover:underline font-bold"
                  >
                    Print Receipt / Save PDF Invoice
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Pending Verification */}
          {step === 7 && (
            <div className="space-y-6 py-6 text-center">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-lg sm:text-xl font-serif font-black text-text-primary-theme">
                  Profile Verification Pending Audit
                </h3>
                <p className="text-xs text-text-secondary-theme leading-relaxed">
                  Your corporate credentials (documents, certs, website domain) have been routed to the Super Admin Trust & Safety department review queue.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-xs text-text-secondary-theme font-semibold">
                  Your application is under process. After approval you can login.
                </p>
                <div className="pt-2">
                  <span onClick={onNavigateToLogin} className="text-xs font-bold text-primary-theme cursor-pointer hover:underline">
                    Go back to Login
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-text-muted-theme leading-normal pt-4 max-w-sm mx-auto">
                Once approved, you can login as <strong className="text-text-primary-theme">{officialEmail}</strong> to unlock your full recruiter matching panels.
              </p>
            </div>
          )}

          {/* STEP 8: Onboarding Approved Success */}
          {step === 8 && (
            <div className="py-12 text-center space-y-6">
              <div className="w-20 h-20 bg-success-theme/10 text-success-theme rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-text-primary-theme">
                  Corporate Verification Complete!
                </h3>
                <p className="text-xs text-text-secondary-theme mt-1.5 max-w-md mx-auto">
                  Acme Technologies has been validated successfully. Redirecting you to your main Recruiter console...
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Stepper Controls */}
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
            {paymentRedirecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {step === 6 ? (selectedPlan === 'Free' ? 'Finalize Onboarding' : 'Verify & Pay') : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
