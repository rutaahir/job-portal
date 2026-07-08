/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AuthStep =
  | 'LOGIN'
  | 'CANDIDATE_REG'
  | 'EMPLOYER_REG'
  | 'FORGOT_PASSWORD'
  | 'OTP_VERIFICATION'
  | 'RESET_PASSWORD'
  | 'RESET_SUCCESS';

export interface UserAccount {
  email: string;
  phone: string;
  passwordHash: string;
  role: 'JOB_SEEKER' | 'RECRUITER' | 'ADMINISTRATOR';
  status: 'ACTIVE' | 'BLOCKED' | 'PENDING_VERIFICATION' | 'REJECTED' | 'PROFILE_INCOMPLETE' | 'PROFILE_COMPLETE';
  name: string; // First Name + Last Name or Contact Person
  
  // Candidate info
  candidateInfo?: {
    firstName: string;
    lastName: string;
    countryCode: string;
    currentStatus: string;
    experience: string;
    currentCity: string;
    preferredLocation: string;
    expectedSalary: string;
    currentSalary: string;
    remotePreference: string;
    availability: string;
    resumeParsed?: {
      education: string;
      experience: string;
      skills: string[];
      projects: string;
      certifications: string;
      languages: string;
    };
    preferredRoles: string[];
    preferredIndustries: string;
    employmentType: string;
    workMode: string;
    noticePeriod: string;
    openToWork: boolean;
    profileStrength: number;
    resumeScore: number;
  };

  // Employer info
  employerInfo?: {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    website: string;
    industry: string;
    companySize: string;
    foundedYear: string;
    country: string;
    state: string;
    city: string;
    address: string;
    designation: string;
    logoUrl?: string;
    coverUrl?: string;
    regCertificateUrl?: string;
    gstNumber?: string;
    businessLicenseUrl?: string;
    description?: string;
    culture?: string;
    benefits?: string;
    officePhotos?: string[];
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
    };
    subscriptionPlan: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
    transaction?: {
      id: string;
      amount: string;
      timestamp: string;
      status: 'Paid' | 'Unpaid';
      invoiceNumber: string;
    };
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
    verificationNotes?: string;
  };
}
