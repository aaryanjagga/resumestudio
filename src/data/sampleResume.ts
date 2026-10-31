import { ResumeData, TemplateId } from '../types/resume';

export const ACCENT_COLORS = [
  { id: 'indigo', name: 'Deep Indigo', hex: '#4338CA', light: '#EEF2FF' },
  { id: 'slate', name: 'Modern Slate', hex: '#334155', light: '#F1F5F9' },
  { id: 'navy', name: 'Classic Navy', hex: '#1E3A8A', light: '#EFF6FF' },
  { id: 'emerald', name: 'Forest Emerald', hex: '#065F46', light: '#ECFDF5' },
  { id: 'crimson', name: 'Crimson Wine', hex: '#991B1B', light: '#FEF2F2' },
  { id: 'espresso', name: 'Warm Charcoal', hex: '#27272A', light: '#F4F4F5' },
];

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createSampleResume(templateId: TemplateId = 'classic-ats'): ResumeData {
  const now = new Date().toISOString();
  return {
    id: generateUUID(),
    title: 'Senior Software Engineer — 2026',
    createdAt: now,
    updatedAt: now,
    schemaVersion: 1,
    templateId,
    accentColor: '#4338CA',
    fontSize: 'base',
    sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
    sectionVisibility: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
    },
    personal: {
      fullName: 'Alex Morgan',
      headline: 'Staff Software Engineer & Distributed Systems Architect',
      email: 'alex.morgan.eng@example.com',
      phone: '+1 (415) 555-0192',
      location: 'San Francisco, CA',
      summary:
        'Staff Software Engineer with 8+ years designing high-throughput distributed systems, real-time streaming architectures, and resilient developer platforms. Proven track record scaling low-latency services to 45M+ DAU while reducing cloud operating expenditures by 32%. Passionate about local-first design, type-safe APIs, and developer productivity.',
      linkedinUrl: 'https://www.linkedin.com/in/alex-morgan-lead',
      linkedinLabel: 'LinkedIn',
      githubUrl: 'https://github.com/alexmorgan-eng',
      githubLabel: 'GitHub',
      websiteUrl: 'https://alexmorgan.dev',
      websiteLabel: 'Portfolio',
    },
    experience: [
      {
        id: generateUUID(),
        company: 'Vanguard Systems',
        position: 'Staff Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected a multi-region event-streaming pipeline handling 140,000 events/sec with sub-25ms end-to-end latency.',
          'Spearheaded the migration of 18 critical microservices to Go and TypeScript, cutting 99th percentile response times by 44%.',
          'Mentored 12 mid-level and senior engineers across three teams, initiating company-wide distributed systems RFC standards.',
        ],
      },
      {
        id: generateUUID(),
        company: 'Krypton Technologies',
        position: 'Senior Backend Engineer',
        location: 'Seattle, WA',
        startDate: '2019-06',
        endDate: '2022-02',
        current: false,
        bullets: [
          'Designed and scaled PostgreSQL and Redis caching tiers supporting 12M global user accounts with 99.995% uptime.',
          'Engineered automated canary deployment infrastructure using Kubernetes, reducing production incident rollbacks by 70%.',
          'Authored high-performance asynchronous data ingest workers, reducing nightly ETL job runtime from 6.5 hours to 42 minutes.',
        ],
      },
      {
        id: generateUUID(),
        company: 'Aether Software',
        position: 'Software Engineer',
        location: 'Austin, TX',
        startDate: '2017-08',
        endDate: '2019-05',
        current: false,
        bullets: [
          'Developed full-stack web applications and REST APIs using React, Node.js, and Docker in a fast-paced agile environment.',
          'Built internal tooling used daily by 200+ customer operations specialists, eliminating 15 hours of manual ticket resolution per week.',
        ],
      },
    ],
    education: [
      {
        id: generateUUID(),
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science & Engineering',
        startDate: '2013-09',
        endDate: '2017-05',
        honors: 'Magna Cum Laude · Dean’s Honors List (6 consecutive semesters)',
      },
    ],
    skills: [
      {
        id: generateUUID(),
        name: 'Languages & Core',
        skills: ['TypeScript', 'JavaScript (ESNext)', 'Go', 'Python', 'Rust', 'SQL'],
      },
      {
        id: generateUUID(),
        name: 'Backend & Cloud',
        skills: ['Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'AWS', 'GCP'],
      },
      {
        id: generateUUID(),
        name: 'Frontend & Architecture',
        skills: ['React 19', 'Next.js', 'Vite', 'Tailwind CSS', 'IndexedDB', 'REST & GraphQL', 'Distributed Systems'],
      },
    ],
    projects: [
      {
        id: generateUUID(),
        name: 'Chronicle — Distributed Audit Log Engine',
        description:
          'Open-source append-only verifiable audit logging engine with Merkle tree tamper-evident verification and local SQLite snapshots.',
        technologies: ['Go', 'gRPC', 'RocksDB', 'Docker'],
        url: 'https://github.com/alexmorgan-eng/chronicle',
        urlLabel: 'GitHub',
        role: 'Creator & Maintainer',
      },
      {
        id: generateUUID(),
        name: 'StreamSync — Local-First Realtime CRDT Client',
        description:
          'Lightweight state synchronization library enabling peer-to-peer browser collaboration with zero backend coordinator.',
        technologies: ['TypeScript', 'WebRTC', 'IndexedDB'],
        url: 'https://streamsync.dev',
        urlLabel: 'Live Demo',
        role: 'Lead Architect',
      },
    ],
    certifications: [
      {
        id: generateUUID(),
        name: 'AWS Certified Solutions Architect — Professional',
        issuer: 'Amazon Web Services',
        issueDate: '2024-04',
        url: 'https://aws.amazon.com/verification',
        urlLabel: 'Verify Credential',
      },
      {
        id: generateUUID(),
        name: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'Cloud Native Computing Foundation',
        issueDate: '2023-11',
        url: 'https://cncf.io/certification/cka',
        urlLabel: 'Verify Credential',
      },
    ],
  };
}

export function createBlankResume(title = 'New Resume', templateId: TemplateId = 'classic-ats'): ResumeData {
  const now = new Date().toISOString();
  return {
    id: generateUUID(),
    title,
    createdAt: now,
    updatedAt: now,
    schemaVersion: 1,
    templateId,
    accentColor: '#4338CA',
    fontSize: 'base',
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
    sectionVisibility: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
    },
    personal: {
      fullName: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      linkedinUrl: '',
      linkedinLabel: '',
      githubUrl: '',
      githubLabel: '',
      websiteUrl: '',
      websiteLabel: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };
}
