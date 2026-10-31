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

export const Compact: React.FC<TemplateProps> = ({ data, accentColor = '#334155' }) => {
  const { personal, experience, education, skills, projects, certifications, sectionVisibility, sectionOrder } = data;

  const contactItems = [
    personal.email && (
      <a key="email" href={`mailto:${personal.email}`} className="hover:underline">
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
        className="hover:underline font-medium"
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
        className="hover:underline font-medium"
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
        className="hover:underline font-medium"
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
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1" style={{ color: accentColor }}>
              Summary
            </h2>
            <p className="text-[11px] leading-snug text-slate-700">
              {personal.summary}
            </p>
          </div>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <div key="experience" className="mb-2.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5" style={{ color: accentColor }}>
              Experience
            </h2>
            <div className="space-y-2">
              {experience.map((exp) => (
                <div key={exp.id} className="text-[11px]">
                  <div className="flex justify-between items-baseline font-semibold text-slate-950">
                    <span>
                      <strong className="font-bold text-slate-900">{exp.position}</strong>, {exp.company}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal tabular-nums">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-slate-700 leading-tight mt-0.5">
                      {exp.bullets.filter(Boolean).map((b, idx) => (
                        <li key={idx}>{b}</li>
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
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1" style={{ color: accentColor }}>
              Skills
            </h2>
            <div className="space-y-0.5 text-[11px] text-slate-700">
              {skills.map((cat) => (
                <div key={cat.id} className="flex">
                  <span className="font-semibold text-slate-900 w-32 shrink-0">{cat.name}:</span>
                  <span className="text-slate-700">{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <div key="projects" className="mb-2.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1" style={{ color: accentColor }}>
              Projects
            </h2>
            <div className="space-y-1.5 text-[11px]">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline font-semibold text-slate-950">
                    <span>{proj.name} {proj.role && <span className="font-normal text-slate-500">({proj.role})</span>}</span>
                    {proj.url && (
                      <a
                        href={ensureValidHref(proj.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-slate-600 hover:text-indigo-600 hover:underline inline-flex items-center gap-0.5 font-medium"
                      >
                        <span>{formatProjectLinkLabel(proj.url, proj.urlLabel)}</span>
                        <span aria-hidden="true" className="text-[9px]">↗</span>
                      </a>
                    )}
                  </div>
                  {proj.description && <p className="text-slate-700 text-[10.5px] leading-tight">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <div key="education" className="mb-2.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1" style={{ color: accentColor }}>
              Education
            </h2>
            <div className="space-y-1 text-[11px]">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <span className="text-slate-700"> — {edu.degree} in {edu.fieldOfStudy}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 tabular-nums">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <div key="certifications" className="mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1" style={{ color: accentColor }}>
              Certifications
            </h2>
            <div className="space-y-0.5 text-[11px] text-slate-700">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <div>
                    <span>{cert.name} ({cert.issuer})</span>
                    {cert.url && (
                      <a
                        href={ensureValidHref(cert.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9.5px] text-indigo-700 hover:underline ml-1.5 inline-flex items-center gap-0.5 font-medium"
                      >
                        <span>{formatCertificationLinkLabel(cert.url, cert.urlLabel)}</span>
                        <span aria-hidden="true" className="text-[8px]">↗</span>
                      </a>
                    )}
                  </div>
                  {cert.issueDate && <span className="text-[10px] text-slate-500 tabular-nums">{cert.issueDate}</span>}
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
    <div className="bg-white text-slate-900 w-[210mm] h-[297mm] max-h-[297mm] overflow-hidden p-6 font-sans box-border print:p-5">
      {/* Compact Header */}
      <div className="border-b border-slate-300 pb-2 mb-2.5 flex justify-between items-baseline flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
            {personal.fullName || 'Candidate Name'}
          </h1>
          {personal.headline && (
            <p className="text-[11px] font-medium text-slate-600">
              {personal.headline}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-600">
          {contactItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>·</span>}
              {item}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div>{sectionOrder.map((sectionId) => renderSection(sectionId))}</div>
    </div>
  );
};
