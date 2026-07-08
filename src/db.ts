import fs from 'fs';
import path from 'path';

// Core Type Definitions for Backend relational storage

export interface UserRow {
  email: string;
  phone: string;
  passwordHash: string;
  role: 'GUEST' | 'JOB_SEEKER' | 'RECRUITER' | 'ADMINISTRATOR';
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  failedAttempts: number;
  isLocked: boolean;
  lockoutUntil?: string;
  otpSecret?: string;
  otpVerified: boolean;
}

export interface CandidateRow {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  currentStatus: string;
  experience: string;
  currentCity: string;
  preferredLocation: string;
  expectedSalary: string;
  currentSalary: string;
  remotePreference: 'Remote' | 'Hybrid' | 'Onsite';
  availability: string;
  preferredRoles: string[];
  preferredIndustries: string;
  employmentType: string;
  workMode: string;
  noticePeriod: string;
  openToWork: boolean;
  profileStrength: number;
  resumeScore: number;
  education: string;
  experienceHistory: string;
  skills: string[];
  projects: string;
  certifications: string;
  languages: string;
  bio: string;
  savedJobs: string[]; // Job IDs
  recentSearches: string[];
  createdAt: string;
  updatedAt: string;
  softDeleted: boolean;
}

export interface EmployerRow {
  userId: string;
  companyName: string;
  industry: string;
  location: string;
  employees: string;
  rating: number;
  responseRate: string;
  about: string;
  website: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  verifiedAt?: string;
  verifiedBy?: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  softDeleted: boolean;
}

export interface JobRow {
  id: string;
  companyId: string; // userId of Employer
  title: string;
  location: string;
  workMode: 'remote' | 'hybrid' | 'onsite';
  experienceRange: string;
  salaryRange: string;
  tags: string[];
  description: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  postedDate: string;
  deadline: string;
  applicantsCount: number;
  featured: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  softDeleted: boolean;
}

export interface ApplicationRow {
  id: string;
  jobId: string;
  candidateId: string; // userId of Candidate
  status: 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'HR' | 'Offer' | 'Rejected' | 'Accepted' | 'Joined';
  appliedDate: string;
  resumeUrl?: string;
  resumeScore?: number;
  timeline: {
    status: string;
    timestamp: string;
    note: string;
  }[];
  notes?: string;
  interviewNotes?: string;
  interviewSchedule?: string;
  candidateScore?: number;
  rankingScore?: number;
  softDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface InterviewRow {
  id: string;
  applicationId: string;
  title: string;
  scheduledAt: string;
  link: string;
  notes: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemLogRow {
  id: string;
  timestamp: string;
  type: 'AUTH' | 'SECURITY' | 'AUDIT' | 'AI';
  message: string;
  email?: string;
}

// Database Schema interface
export interface DatabaseSchema {
  users: UserRow[];
  candidates: CandidateRow[];
  employers: EmployerRow[];
  jobs: JobRow[];
  applications: ApplicationRow[];
  interviews: InterviewRow[];
  systemLogs: SystemLogRow[];
}

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db_store.json');

// Memory representation of the DB
let db: DatabaseSchema = {
  users: [],
  candidates: [],
  employers: [],
  jobs: [],
  applications: [],
  interviews: [],
  systemLogs: []
};

// Seed initial default values mimicking TechnoAdviser enterprise requirements
function seedDatabase() {
  // 1. Initial Users
  db.users = [
    {
      email: 'admin@technoadviser.com',
      phone: '+919999999999',
      passwordHash: 'Admin@12345',
      role: 'ADMINISTRATOR',
      status: 'ACTIVE',
      name: 'Super Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedAttempts: 0,
      isLocked: false,
      otpVerified: true
    },
    {
      email: 'sneha@email.com',
      phone: '+919876543210',
      passwordHash: 'Password@123',
      role: 'JOB_SEEKER',
      status: 'ACTIVE',
      name: 'Sneha Kapoor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedAttempts: 0,
      isLocked: false,
      otpVerified: true
    },
    {
      email: 'employer@meta.com',
      phone: '+919811122233',
      passwordHash: 'Employer@123',
      role: 'RECRUITER',
      status: 'ACTIVE',
      name: 'Aditya Roy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedAttempts: 0,
      isLocked: false,
      otpVerified: true
    },
    {
      email: 'hr@acme.com',
      phone: '+919876543212',
      passwordHash: 'Password@123',
      role: 'RECRUITER',
      status: 'ACTIVE',
      name: 'Rahul Malhotra',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedAttempts: 0,
      isLocked: false,
      otpVerified: true
    },
    {
      email: 'recruiter@tata.com',
      phone: '+919822233344',
      passwordHash: 'TataRec@123',
      role: 'RECRUITER',
      status: 'PENDING',
      name: 'Rajesh Mehta',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedAttempts: 0,
      isLocked: false,
      otpVerified: false
    }
  ];

  // 2. Initial Candidates
  db.candidates = [
    {
      userId: 'sneha@email.com',
      firstName: 'Sneha',
      lastName: 'Kapoor',
      phone: '+919876543210',
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
      noticePeriod: 'Immediate',
      openToWork: true,
      profileStrength: 85,
      resumeScore: 88,
      education: 'B.Tech in Computer Science, NIT Karnataka (Graduation: 2021)',
      experienceHistory: 'React Developer at TCS (2021 - Present), frontend developer intern at Razorpay',
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Redux', 'JavaScript', 'Node.js'],
      projects: 'E-commerce UI Dashboard, Realtime Collaborative Whiteboard',
      certifications: 'AWS Certified Cloud Practitioner, Meta Front-End Developer Certificate',
      languages: 'English, Hindi',
      bio: 'Enthusiastic React & TypeScript engineer passionate about constructing high-fidelity user experiences and slick micro-interactions.',
      savedJobs: [],
      recentSearches: ['React Developer', 'Frontend remote', 'AI Engineer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      softDeleted: false
    }
  ];

  // 3. Initial Employers
  db.employers = [
    {
      userId: 'employer@meta.com',
      companyName: 'Meta Platforms Inc',
      industry: 'Internet & Technology',
      location: 'Bengaluru, India',
      employees: '5000-10000',
      rating: 4.8,
      responseRate: '92%',
      about: 'Meta builds technologies that help people connect, find communities, and grow businesses.',
      website: 'https://meta.com',
      status: 'APPROVED',
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'admin@technoadviser.com',
      logo: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      softDeleted: false
    },
    {
      userId: 'hr@acme.com',
      companyName: 'Acme Technologies',
      industry: 'Information Technology',
      location: 'Bengaluru, India',
      employees: '51-200',
      rating: 4.5,
      responseRate: '95%',
      about: 'A leading global consulting and software engineering firm.',
      website: 'https://acme.com',
      status: 'APPROVED',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      softDeleted: false
    },
    {
      userId: 'recruiter@tata.com',
      companyName: 'Tata Consultancy Services',
      industry: 'IT Consulting & Services',
      location: 'Mumbai, India',
      employees: '10000+',
      rating: 4.1,
      responseRate: '75%',
      about: 'Tata Consultancy Services is an IT services, consulting and business solutions organization.',
      website: 'https://tcs.com',
      status: 'PENDING',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      softDeleted: false
    }
  ];

  // 4. Initial Jobs
  db.jobs = [
    {
      id: 'job-1',
      companyId: 'employer@meta.com',
      title: 'Senior Frontend Architect',
      location: 'Bengaluru, India',
      workMode: 'hybrid',
      experienceRange: '5-8 Yrs',
      salaryRange: '24 - 36 LPA',
      tags: ['React', 'Vite', 'TailwindCSS', 'TypeScript'],
      description: 'We are seeking a Senior Frontend Architect to spearhead design and implementation of highly scalable, accessible user interfaces for our ads engine product suite. Work closely with product managers and backend engineering teams to deploy micro-frontends.',
      status: 'PUBLISHED',
      postedDate: '2026-07-01',
      deadline: '2026-08-15',
      applicantsCount: 15,
      featured: true,
      createdBy: 'employer@meta.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      softDeleted: false
    },
    {
      id: 'job-2',
      companyId: 'employer@meta.com',
      title: 'AI Fullstack Developer',
      location: 'Remote',
      workMode: 'remote',
      experienceRange: '3-6 Yrs',
      salaryRange: '18 - 30 LPA',
      tags: ['NextJS', 'Python', 'FastAPI', 'Gemini API'],
      description: 'Join our special projects task force to build groundbreaking AI assistant pipelines. You will leverage the latest Gemini SDK models to craft features such as auto-summarization, vector-grounded document search, and real-time audio chat engines.',
      status: 'PUBLISHED',
      postedDate: '2026-07-04',
      deadline: '2026-08-30',
      applicantsCount: 24,
      featured: true,
      createdBy: 'employer@meta.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      softDeleted: false
    },
    {
      id: 'job-3',
      companyId: 'employer@meta.com',
      title: 'UI Developer (Product Design)',
      location: 'Hyderabad, India',
      workMode: 'onsite',
      experienceRange: '1-3 Yrs',
      salaryRange: '8 - 14 LPA',
      tags: ['React', 'CSS Grid', 'Framer Motion'],
      description: 'Craft beautiful UI designs from Figma prototypes, and animate user workflows with Framer Motion. Ensure flawless responsive rendering across diverse devices.',
      status: 'DRAFT',
      postedDate: '2026-07-05',
      deadline: '2026-09-01',
      applicantsCount: 0,
      featured: false,
      createdBy: 'employer@meta.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      softDeleted: false
    }
  ];

  // 5. Initial Applications
  db.applications = [
    {
      id: 'app-1',
      jobId: 'job-1',
      candidateId: 'sneha@email.com',
      status: 'Shortlisted',
      appliedDate: '2026-07-02',
      resumeUrl: 'Standard Digital Resume',
      resumeScore: 88,
      timeline: [
        { status: 'Applied', timestamp: '2026-07-02T10:00:00Z', note: 'Application dispatched successfully.' },
        { status: 'Screening', timestamp: '2026-07-03T14:30:00Z', note: 'Parsed attributes match core skillset constraints.' },
        { status: 'Shortlisted', timestamp: '2026-07-05T09:00:00Z', note: 'Recommended for Round 1 technical interview.' }
      ],
      notes: 'Strong understanding of React Hooks and client rendering performance.',
      rankingScore: 92,
      softDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'sneha@email.com'
    }
  ];

  // 6. System Logs
  db.systemLogs = [
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      type: 'AUDIT',
      message: 'System databases successfully booted and seeded.'
    }
  ];
}

// Read database from disk
export function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(raw);
    } else {
      seedDatabase();
      saveDatabase();
    }

    // Self-healing check for hr@acme.com in db
    let changed = false;
    if (!db.users) db.users = [];
    if (!db.users.some(u => u.email.toLowerCase() === 'hr@acme.com')) {
      db.users.push({
        email: 'hr@acme.com',
        phone: '+919876543212',
        passwordHash: 'Password@123',
        role: 'RECRUITER',
        status: 'ACTIVE',
        name: 'Rahul Malhotra',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        failedAttempts: 0,
        isLocked: false,
        otpVerified: true
      });
      changed = true;
    }
    if (!db.employers) db.employers = [];
    if (!db.employers.some(e => e.userId.toLowerCase() === 'hr@acme.com')) {
      db.employers.push({
        userId: 'hr@acme.com',
        companyName: 'Acme Technologies',
        industry: 'Information Technology',
        location: 'Bengaluru, India',
        employees: '51-200',
        rating: 4.5,
        responseRate: '95%',
        about: 'A leading global consulting and software engineering firm.',
        website: 'https://acme.com',
        status: 'APPROVED',
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        softDeleted: false
      });
      changed = true;
    }
    if (changed) {
      saveDatabase();
    }
  } catch (err) {
    console.error('Error loading database, seeding fallback', err);
    seedDatabase();
  }
  return db;
}

// Save database to disk
export function saveDatabase(): void {
  try {
    const parentDir = path.dirname(DB_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database to file system', err);
  }
}

// Expose transactional helper functions to the REST API endpoints
export const DB = {
  getUsers: () => { loadDatabase(); return db.users; },
  getCandidates: () => { loadDatabase(); return db.candidates.filter(c => !c.softDeleted); },
  getEmployers: () => { loadDatabase(); return db.employers.filter(e => !e.softDeleted); },
  getJobs: () => { loadDatabase(); return db.jobs.filter(j => !j.softDeleted); },
  getApplications: () => { loadDatabase(); return db.applications.filter(a => !a.softDeleted); },
  getInterviews: () => { loadDatabase(); return db.interviews; },
  getLogs: () => { loadDatabase(); return db.systemLogs; },

  insertUser: (user: UserRow) => {
    loadDatabase();
    db.users.push(user);
    saveDatabase();
    return user;
  },

  updateUser: (email: string, updates: Partial<UserRow>) => {
    loadDatabase();
    const idx = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      return db.users[idx];
    }
    return null;
  },

  insertCandidate: (candidate: CandidateRow) => {
    loadDatabase();
    db.candidates.push(candidate);
    saveDatabase();
    return candidate;
  },

  updateCandidate: (userId: string, updates: Partial<CandidateRow>) => {
    loadDatabase();
    const idx = db.candidates.findIndex(c => c.userId.toLowerCase() === userId.toLowerCase());
    if (idx !== -1) {
      db.candidates[idx] = { ...db.candidates[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      return db.candidates[idx];
    }
    return null;
  },

  insertEmployer: (employer: EmployerRow) => {
    loadDatabase();
    db.employers.push(employer);
    saveDatabase();
    return employer;
  },

  updateEmployer: (userId: string, updates: Partial<EmployerRow>) => {
    loadDatabase();
    const idx = db.employers.findIndex(e => e.userId.toLowerCase() === userId.toLowerCase());
    if (idx !== -1) {
      db.employers[idx] = { ...db.employers[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      return db.employers[idx];
    }
    return null;
  },

  insertJob: (job: JobRow) => {
    loadDatabase();
    db.jobs.push(job);
    saveDatabase();
    return job;
  },

  updateJob: (id: string, updates: Partial<JobRow>) => {
    loadDatabase();
    const idx = db.jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
      db.jobs[idx] = { ...db.jobs[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      return db.jobs[idx];
    }
    return null;
  },

  insertApplication: (appRow: ApplicationRow) => {
    loadDatabase();
    db.applications.push(appRow);
    saveDatabase();
    return appRow;
  },

  updateApplication: (id: string, updates: Partial<ApplicationRow>) => {
    loadDatabase();
    const idx = db.applications.findIndex(a => a.id === id);
    if (idx !== -1) {
      db.applications[idx] = { ...db.applications[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      return db.applications[idx];
    }
    return null;
  },

  insertInterview: (interview: InterviewRow) => {
    loadDatabase();
    db.interviews.push(interview);
    saveDatabase();
    return interview;
  },

  updateInterview: (id: string, updates: Partial<InterviewRow>) => {
    loadDatabase();
    const idx = db.interviews.findIndex(i => i.id === id);
    if (idx !== -1) {
      db.interviews[idx] = { ...db.interviews[idx], ...updates, updatedAt: new Date().toISOString() };
      saveDatabase();
      return db.interviews[idx];
    }
    return null;
  },

  addLog: (type: 'AUTH' | 'SECURITY' | 'AUDIT' | 'AI', message: string, email?: string) => {
    loadDatabase();
    const log: SystemLogRow = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      type,
      message,
      email
    };
    db.systemLogs.unshift(log); // newest first
    // keep max 500 logs
    if (db.systemLogs.length > 500) {
      db.systemLogs = db.systemLogs.slice(0, 500);
    }
    saveDatabase();
    return log;
  }
};
