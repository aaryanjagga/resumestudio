import React from 'react';
import { ResumeData } from '../types/resume';
import {
  ensureValidHref,
  formatLinkDisplay,
  formatProjectLinkLabel,
  formatCertificationLinkLabel,
} from '../lib/linkUtils';

interface TemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const ClassicATS: React.FC<TemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, projects, certifications, sectionOrder, sectionVisibility } = data;

  const contactItems = [
    personal.email && (
      <a key="email" href={`mailto:${personal.email}`} className="hover:underline text-inherit">
        {personal.email}
      </a>
    ),
    personal.phone && <span key="phone">{personal.phone}</span>,
    personal.location && <span key="location">{personal.location}</span>,
    personal.linkedinUrl && (
      <a
        key="linkedin"
        href={ensureValidHref(personal.linkedinUrl)}
        target="_blank"
        rel="noreferrer"
        className="hover:underline text-inherit font-medium"
      >
        {formatLinkDisplay(personal.linkedinUrl, 'LinkedIn', personal.linkedinLabel)}
      </a>
    ),
    personal.githubUrl && (
      <a
        key="github"
        href={ensureValidHref(personal.githubUrl)}
        target="_blank"
        rel="noreferrer"
        className="hover:underline text-inherit font-medium"
      >
        {formatLinkDisplay(personal.githubUrl, 'GitHub', personal.githubLabel)}
      </a>
    ),
    personal.websiteUrl && (
      <a
        key="website"
        href={ensureValidHref(personal.websiteUrl)}
        target="_blank"
        rel="noreferrer"
        className="hover:underline text-inherit font-medium"
      >
        {formatLinkDisplay(personal.websiteUrl, 'Portfolio', personal.websiteLabel)}
      </a>
    ),
  ].filter(Boolean);

  const renderSection = (sectionId: string) => {
    if (!sectionVisibility[sectionId as keyof typeof sectionVisibility]) return null;

    switch (sectionId) {
      case 'summary':
        if (!personal.summary) return null;
        return (
          <div key="summary" className="mb-2.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
              Professional Summary
            </h2>
            <p className="text-[11px] leading-snug text-slate-800 text-justify">
              {personal.summary}
            </p>
          </div>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <div key="experience" className="mb-2.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              Work Experience
            </h2>
            <div className="space-y-2">
              {experience.map((exp) => (
                <div key={exp.id} className="text-[11px]">
                  <div className="flex justify-between items-baseline font-semibold text-slate-900">
                    <span className="text-xs font-bold text-slate-950">{exp.position}</span>
                    <span className="text-[10px] font-normal text-slate-600 tabular-nums">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-slate-700 italic mb-0.5">
                    <span>{exp.company}</span>
                    {exp.location && <span className="not-italic text-[10px] text-slate-500">{exp.location}</span>}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-slate-800 leading-tight">
                      {exp.bullets.filter(Boolean).map((b, idx) => (
                        <li key={idx} className="pl-0.5">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (!skills || skills.length === 0) return null;
        return (
          <div key="skills" className="mb-2.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
              Technical Skills
            </h2>
            <div className="space-y-0.5 text-[11px] text-slate-800">
              {skills.map((cat) => (
                <div key={cat.id} className="flex">
                  <span className="font-semibold text-slate-950 w-32 shrink-0">{cat.name}:</span>
                  <span className="text-slate-800">{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <div key="projects" className="mb-2.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
              Key Projects
            </h2>
            <div className="space-y-1.5">
              {projects.map((proj) => (
                <div key={proj.id} className="text-[11px]">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-slate-950">
                      {proj.name}
                      {proj.role && <span className="font-normal text-slate-600 italic"> · {proj.role}</span>}
                    </div>
                    {proj.url && (
                      <a
                        href={ensureValidHref(proj.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-slate-700 hover:text-indigo-700 hover:underline inline-flex items-center gap-0.5 font-medium"
                      >
                        <span>{formatProjectLinkLabel(proj.url, proj.urlLabel)}</span>
                        <span aria-hidden="true" className="text-[9px]">↗</span>
                      </a>
                    )}
                  </div>
                  {proj.description && <p className="text-slate-800 mt-0.5 leading-tight">{proj.description}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      <span className="font-medium text-slate-700">Technologies: </span>
                      {proj.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <div key="education" className="mb-2.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
              Education
            </h2>
            <div className="space-y-1">
              {education.map((edu) => (
                <div key={edu.id} className="text-[11px]">
                  <div className="flex justify-between items-baseline font-bold text-slate-950">
                    <span>{edu.institution}</span>
                    <span className="font-normal text-[10px] text-slate-600 tabular-nums">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="text-slate-800">
                    {edu.degree} in {edu.fieldOfStudy}
                  </div>
                  {edu.honors && <div className="text-[10px] text-slate-500 italic">{edu.honors}</div>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <div key="certifications" className="mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
              Certifications & Credentials
            </h2>
            <div className="space-y-0.5 text-[11px] text-slate-800">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-slate-950">{cert.name}</span>
                    <span className="text-slate-600"> — {cert.issuer}</span>
                    {cert.url && (
                      <a
                        href={ensureValidHref(cert.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-indigo-700 hover:underline ml-1.5 inline-flex items-center gap-0.5 font-medium"
                      >
                        <span>{formatCertificationLinkLabel(cert.url, cert.urlLabel)}</span>
                        <span aria-hidden="true" className="text-[9px]">↗</span>
                      </a>
                    )}
                  </div>
                  {cert.issueDate && <span className="text-[10px] text-slate-600 tabular-nums">{cert.issueDate}</span>}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white text-slate-900 w-[210mm] h-[297mm] max-h-[297mm] overflow-hidden p-7 font-sans box-border print:p-6">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-2 mb-2.5 text-center">
        <h1 className="text-xl font-bold tracking-tight text-slate-950 mb-0.5 uppercase">
          {personal.fullName || 'Candidate Name'}
        </h1>
        {personal.headline && (
          <p className="text-[11px] font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
            {personal.headline}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-600">
          {contactItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span aria-hidden="true" className="text-slate-400">·</span>}
              {item}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Ordered Sections */}
      <div>{sectionOrder.map((sectionId) => renderSection(sectionId))}</div>
    </div>
  );
};
