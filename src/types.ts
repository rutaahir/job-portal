/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'GUEST' | 'JOB_SEEKER' | 'RECRUITER' | 'ADMINISTRATOR';

export type Theme = 'light' | 'dark';

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  location: string;
  workMode: 'remote' | 'hybrid' | 'onsite';
  experienceRange: string; // e.g., "2-5 Yrs"
  salaryRange: string; // e.g., "12 - 18 LPA"
  tags: string[];
  description: string;
  postedDate: string;
  matchScore?: number;
  applicantsCount?: number;
  featured?: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  employees: string;
  openJobsCount: number;
  rating: number;
  responseRate: string;
  about: string;
  website: string;
}

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  title: string;
  location: string;
  skills: { name: string; proficiency: number }[];
  experience: string;
  salaryExpectation: string;
  matchScore: number;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Rejected';
  appliedDate: string;
  resumeUrl?: string;
  bio?: string;
}

export interface BlogItem {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  summary: string;
  content: string;
  image: string;
}

export interface MessageThread {
  id: string;
  recipientName: string;
  recipientAvatar: string;
  recipientRole: string;
  contextJob: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
  messages: {
    id: string;
    sender: 'user' | 'other';
    text: string;
    timestamp: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}
