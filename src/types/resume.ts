import { z } from 'zod';

export type TemplateId =
  | 'classic-ats'
  | 'modern'
  | 'developer'
  | 'executive'
  | 'compact'
  | 'editorial';

export type SectionId =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications';

export const PersonalDetailsSchema = z.object({
  fullName: z.string().default(''),
  headline: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  summary: z.string().default(''),
  linkedinUrl: z.string().default(''),
  linkedinLabel: z.string().optional().default(''),
  githubUrl: z.string().default(''),
  githubLabel: z.string().optional().default(''),
  websiteUrl: z.string().default(''),
  websiteLabel: z.string().optional().default(''),
});

export type PersonalDetails = z.infer<typeof PersonalDetailsSchema>;

export const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().default(''),
  position: z.string().default(''),
  location: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  current: z.boolean().default(false),
  bullets: z.array(z.string()).default([]),
});

export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

export const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().default(''),
  degree: z.string().default(''),
  fieldOfStudy: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  honors: z.string().default(''),
});

export type EducationItem = z.infer<typeof EducationItemSchema>;

export const SkillCategorySchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  skills: z.array(z.string()).default([]),
});

export type SkillCategory = z.infer<typeof SkillCategorySchema>;

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  description: z.string().default(''),
  technologies: z.array(z.string()).default([]),
  url: z.string().default(''),
  urlLabel: z.string().optional().default(''),
  role: z.string().default(''),
});

export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export const CertificationItemSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  issuer: z.string().default(''),
  issueDate: z.string().default(''),
  url: z.string().default(''),
  urlLabel: z.string().optional().default(''),
});

export type CertificationItem = z.infer<typeof CertificationItemSchema>;

export const ResumeDataSchema = z.object({
  id: z.string(),
  title: z.string().default('Untitled Resume'),
  createdAt: z.string(),
  updatedAt: z.string(),
  schemaVersion: z.number().default(1),
  templateId: z.enum([
    'classic-ats',
    'modern',
    'developer',
    'executive',
    'compact',
    'editorial',
  ]).default('classic-ats'),
  accentColor: z.string().default('#4338CA'), // Default Indigo-700
  fontSize: z.enum(['sm', 'base', 'lg']).default('base'),
  sectionOrder: z.array(z.enum([
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
  ])).default(['summary', 'experience', 'education', 'skills', 'projects', 'certifications']),
  sectionVisibility: z.object({
    summary: z.boolean().default(true),
    experience: z.boolean().default(true),
    education: z.boolean().default(true),
    skills: z.boolean().default(true),
    projects: z.boolean().default(true),
    certifications: z.boolean().default(true),
  }).default({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
  }),
  personal: PersonalDetailsSchema.default({
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
  }),
  experience: z.array(ExperienceItemSchema).default([]),
  education: z.array(EducationItemSchema).default([]),
  skills: z.array(SkillCategorySchema).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  certifications: z.array(CertificationItemSchema).default([]),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;

export const BackupFileSchema = z.object({
  version: z.number(),
  exportedAt: z.string(),
  app: z.literal('Resume Studio'),
  resumes: z.array(ResumeDataSchema),
});

export type BackupFile = z.infer<typeof BackupFileSchema>;
