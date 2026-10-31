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

export const Developer: React.FC<TemplateProps> = ({ data, accentColor = '#334155' }) => {
  const { personal, experience, education, skills, projects, certifications, sectionVisibility, sectionOrder } = data;

  const renderSection = (sectionId: string) => {
    if (!sectionVisibility[sectionId as keyof typeof sectionVisibility]) return null;

    switch (sectionId) {
      case 'summary':
        if (!personal.summary) return null;
        return (
          <div key="summary" className="mb-2.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold text-slate-900 uppercase tracking-wider" style={{ color: accentColor }}>
                // ARCHITECTURE & BACKGROUND
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <p className="text-[11px] leading-snug text-slate-700">
              {personal.summary}
            </p>
          </div>
        );

      case 'skills':
        if (!skills || skills.length === 0) return null;
        return (
          <div key="skills" className="mb-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] font-bold text-slate-900 uppercase tracking-wider" style={{ color: accentColor }}>
                // TECHNICAL STACK
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <div className="space-y-1 text-[11px]">
              {skills.map((cat) => (
                <div key={cat.id} className="flex flex-wrap items-baseline gap-1">
                  <span className="font-mono text-[10px] font-semibold text-slate-900 w-32 shrink-0">{cat.name}:</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="font-mono text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.2 rounded border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <div key="experience" className="mb-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] font-bold text-slate-900 uppercase tracking-wider" style={{ color: accentColor }}>
                // PROFESSIONAL EXPERIENCE
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <div className="space-y-2.5">
              {experience.map((exp) => (
                <div key={exp.id} className="text-[11px]">
                  <div className="flex justify-between items-baseline font-bold text-slate-950">
                    <span className="text-xs">{exp.position} <span className="font-normal text-slate-600">@ {exp.company}</span></span>
                    <span className="font-mono text-[10px] font-normal text-slate-500 tabular-nums">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.location && (
                    <div className="font-mono text-[9px] text-slate-400 mb-0.5">
                      LOC: {exp.location}
                    </div>
                  )}
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

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <div key="projects" className="mb-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] font-bold text-slate-900 uppercase tracking-wider" style={{ color: accentColor }}>
                // OPEN SOURCE & SYSTEMS
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <div className="space-y-1.5">
              {projects.map((proj) => (
                <div key={proj.id} className="text-[11px]">
                  <div className="flex justify-between items-baseline font-bold text-slate-950">
                    <div>
                      <span>{proj.name}</span>
                      {proj.role && <span className="font-mono font-normal text-[10px] text-slate-500"> [{proj.role}]</span>}
                    </div>
                    {proj.url && (
                      <a
                        href={ensureValidHref(proj.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] text-indigo-600 hover:underline inline-flex items-center gap-0.5 font-medium"
                      >
                        <span>[{formatProjectLinkLabel(proj.url, proj.urlLabel)} ↗]</span>
                      </a>
                    )}
                  </div>
                  {proj.description && <p className="text-slate-700 mt-0.5 leading-tight">{proj.description}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="font-mono text-[9.5px] bg-slate-50 border border-slate-200 px-1 py-0.2 rounded text-slate-600">
                          {t}
                        </span>
                      ))}
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
          <div key="education" className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold text-slate-900 uppercase tracking-wider" style={{ color: accentColor }}>
                // ACADEMIC BACKGROUND
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <div className="space-y-1 text-[11px]">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <span className="text-slate-700"> — {edu.degree} in {edu.fieldOfStudy}</span>
                    {edu.honors && <div className="text-[10px] text-slate-500 italic">{edu.honors}</div>}
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 tabular-nums">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <div key="certifications" className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold text-slate-900 uppercase tracking-wider" style={{ color: accentColor }}>
                // CERTIFICATIONS
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <div className="space-y-0.5 text-[10.5px] text-slate-700">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-slate-950">{cert.name}</span>
                    <span className="text-slate-500"> ({cert.issuer})</span>
                    {cert.url && (
                      <a
                        href={ensureValidHref(cert.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[9.5px] text-indigo-600 hover:underline ml-1.5 inline-flex items-center gap-0.5 font-medium"
                      >
                        <span>[{formatCertificationLinkLabel(cert.url, cert.urlLabel)} ↗]</span>
                      </a>
                    )}
                  </div>
                  {cert.issueDate && <span className="font-mono text-[10px] text-slate-500 tabular-nums">{cert.issueDate}</span>}
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
      {/* Dev Header */}
      <div className="border-b border-slate-300 pb-2.5 mb-2.5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">
              {personal.fullName || 'Candidate Name'}
            </h1>
            {personal.headline && (
              <p className="font-mono text-[11px] font-semibold text-slate-700 mt-0.5">
                {personal.headline}
              </p>
            )}
          </div>
          <div className="font-mono text-[10px] text-right text-slate-600 space-y-0.5">
            {personal.email && (
              <div>
                <a href={`mailto:${personal.email}`} className="text-slate-900 hover:underline">{personal.email}</a>
              </div>
            )}
            {personal.phone && <div>{personal.phone}</div>}
            {personal.location && <div>{personal.location}</div>}
          </div>
        </div>

        {/* Links row */}
        <div className="flex flex-wrap gap-3 font-mono text-[10px] mt-2 pt-1.5 border-t border-slate-100 text-slate-600">
          {personal.githubUrl && (
            <a
              href={ensureValidHref(personal.githubUrl)}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline inline-flex items-center gap-0.5 font-semibold"
            >
              <span>{formatLinkDisplay(personal.githubUrl, 'GitHub', personal.githubLabel)}</span>
              <span aria-hidden="true" className="text-[9px]">↗</span>
            </a>
          )}
          {personal.linkedinUrl && (
            <a
              href={ensureValidHref(personal.linkedinUrl)}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline inline-flex items-center gap-0.5 font-semibold"
            >
              <span>{formatLinkDisplay(personal.linkedinUrl, 'LinkedIn', personal.linkedinLabel)}</span>
              <span aria-hidden="true" className="text-[9px]">↗</span>
            </a>
          )}
          {personal.websiteUrl && (
            <a
              href={ensureValidHref(personal.websiteUrl)}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline inline-flex items-center gap-0.5 font-semibold"
            >
              <span>{formatLinkDisplay(personal.websiteUrl, 'Portfolio', personal.websiteLabel)}</span>
              <span aria-hidden="true" className="text-[9px]">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* Sections */}
      <div>{sectionOrder.map((sectionId) => renderSection(sectionId))}</div>
    </div>
  );
};
