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

export const Editorial: React.FC<TemplateProps> = ({ data }) => {
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
          <div key="summary" className="grid grid-cols-12 gap-3 mb-2.5">
            <div className="col-span-3">
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Statement
              </h2>
            </div>
            <div className="col-span-9">
              <p className="text-[11px] leading-snug text-slate-800">
                {personal.summary}
              </p>
            </div>
          </div>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <div key="experience" className="grid grid-cols-12 gap-3 mb-2.5">
            <div className="col-span-3">
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Experience
              </h2>
            </div>
            <div className="col-span-9 space-y-2.5">
              {experience.map((exp) => (
                <div key={exp.id} className="text-[11px]">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                    <span className="text-[10px] font-normal text-slate-500 tabular-nums">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium mb-0.5 flex justify-between text-[10.5px]">
                    <span>{exp.company}</span>
                    {exp.location && <span className="text-[10px] text-slate-400">{exp.location}</span>}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-slate-700 leading-tight">
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
          <div key="skills" className="grid grid-cols-12 gap-3 mb-2.5">
            <div className="col-span-3">
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Expertise
              </h2>
            </div>
            <div className="col-span-9 space-y-0.5 text-[11px]">
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
          <div key="projects" className="grid grid-cols-12 gap-3 mb-2.5">
            <div className="col-span-3">
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Work
              </h2>
            </div>
            <div className="col-span-9 space-y-1.5">
              {projects.map((proj) => (
                <div key={proj.id} className="text-[11px]">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">
                      {proj.name}
                      {proj.role && <span className="font-normal text-slate-500"> · {proj.role}</span>}
                    </span>
                    {proj.url && (
                      <a
                        href={ensureValidHref(proj.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-slate-500 hover:text-slate-900 hover:underline inline-flex items-center gap-0.5 font-medium"
                      >
                        <span>{formatProjectLinkLabel(proj.url, proj.urlLabel)}</span>
                        <span aria-hidden="true" className="text-[9px]">↗</span>
                      </a>
                    )}
                  </div>
                  {proj.description && <p className="text-slate-700 mt-0.5 leading-tight">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <div key="education" className="grid grid-cols-12 gap-3 mb-2">
            <div className="col-span-3">
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Education
              </h2>
            </div>
            <div className="col-span-9 space-y-1 text-[11px]">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <span className="text-slate-600"> — {edu.degree} in {edu.fieldOfStudy}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 tabular-nums">{edu.startDate} — {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <div key="certifications" className="grid grid-cols-12 gap-3 mb-2">
            <div className="col-span-3">
              <h2 className="font-serif text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Credentials
              </h2>
            </div>
            <div className="col-span-9 space-y-0.5 text-[10.5px] text-slate-700">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <div>
                    <span>{cert.name} ({cert.issuer})</span>
                    {cert.url && (
                      <a
                        href={ensureValidHref(cert.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9.5px] text-slate-700 hover:text-slate-950 hover:underline ml-1.5 inline-flex items-center gap-0.5 font-medium"
                      >
                        <span>{formatCertificationLinkLabel(cert.url, cert.urlLabel)}</span>
                        <span aria-hidden="true" className="text-[8px]">↗</span>
                      </a>
                    )}
                  </div>
                  {cert.issueDate && <span className="text-[10px] text-slate-400 tabular-nums">{cert.issueDate}</span>}
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
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-3 mb-3">
        <h1 className="font-serif text-2xl font-normal tracking-tight text-slate-950">
          {personal.fullName || 'Candidate Name'}
        </h1>
        {personal.headline && (
          <p className="text-[10.5px] font-medium tracking-wide text-slate-600 mt-0.5 uppercase">
            {personal.headline}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10.5px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
          {contactItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span aria-hidden="true">/</span>}
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
