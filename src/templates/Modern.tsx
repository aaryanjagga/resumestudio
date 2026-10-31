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

export const Modern: React.FC<TemplateProps> = ({ data, accentColor = '#4338CA' }) => {
  const { personal, experience, education, skills, projects, certifications, sectionVisibility } = data;

  return (
    <div className="bg-white text-slate-900 w-[210mm] h-[297mm] max-h-[297mm] overflow-hidden p-6 font-sans box-border print:p-5">
      {/* Top Header */}
      <div className="pb-3 mb-3 border-b border-slate-200">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
              {personal.fullName || 'Candidate Name'}
            </h1>
            {personal.headline && (
              <p className="text-xs font-semibold tracking-wide mt-0.5" style={{ color: accentColor }}>
                {personal.headline}
              </p>
            )}
          </div>
          <div className="text-right text-[11px] text-slate-600 space-y-0.5 shrink-0 flex flex-col items-end">
            {personal.email && (
              <div>
                <a href={`mailto:${personal.email}`} className="hover:underline">{personal.email}</a>
              </div>
            )}
            {personal.phone && <div>{personal.phone}</div>}
            {personal.location && <div>{personal.location}</div>}
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 justify-end pt-0.5">
              {personal.linkedinUrl && (
                <a
                  href={ensureValidHref(personal.linkedinUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:underline text-slate-700"
                  style={{ color: accentColor }}
                >
                  {formatLinkDisplay(personal.linkedinUrl, 'LinkedIn', personal.linkedinLabel)}
                </a>
              )}
              {personal.githubUrl && (
                <a
                  href={ensureValidHref(personal.githubUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:underline text-slate-700"
                  style={{ color: accentColor }}
                >
                  {formatLinkDisplay(personal.githubUrl, 'GitHub', personal.githubLabel)}
                </a>
              )}
              {personal.websiteUrl && (
                <a
                  href={ensureValidHref(personal.websiteUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:underline text-slate-700"
                  style={{ color: accentColor }}
                >
                  {formatLinkDisplay(personal.websiteUrl, 'Portfolio', personal.websiteLabel)}
                </a>
              )}
            </div>
          </div>
        </div>

        {sectionVisibility.summary && personal.summary && (
          <p className="mt-2 text-[11px] leading-snug text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
            {personal.summary}
          </p>
        )}
      </div>

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Main Column (8 cols) */}
        <div className="col-span-8 space-y-3.5">
          {/* Experience */}
          {sectionVisibility.experience && experience && experience.length > 0 && (
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-2 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Experience
              </h2>
              <div className="space-y-2.5">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-[11px]">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span className="text-xs">{exp.position}</span>
                      <span className="text-[10px] font-normal text-slate-500 tabular-nums">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-slate-700 font-medium mb-0.5 flex justify-between text-[11px]">
                      <span>{exp.company}</span>
                      {exp.location && <span className="text-[10px] text-slate-500">{exp.location}</span>}
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
          )}

          {/* Projects */}
          {sectionVisibility.projects && projects && projects.length > 0 && (
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-2 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Featured Projects
              </h2>
              <div className="space-y-2">
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
                          className="text-[10px] hover:underline font-medium inline-flex items-center gap-0.5"
                          style={{ color: accentColor }}
                        >
                          <span>{formatProjectLinkLabel(proj.url, proj.urlLabel)}</span>
                          <span aria-hidden="true" className="text-[9px]">↗</span>
                        </a>
                      )}
                    </div>
                    {proj.description && <p className="text-slate-700 mt-0.5 leading-tight">{proj.description}</p>}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">Tech: </span>
                        {proj.technologies.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column (4 cols) */}
        <div className="col-span-4 space-y-3.5">
          {/* Skills */}
          {sectionVisibility.skills && skills && skills.length > 0 && (
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-2 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Skills
              </h2>
              <div className="space-y-2 text-[11px]">
                {skills.map((cat) => (
                  <div key={cat.id}>
                    <h3 className="font-semibold text-slate-900 text-[10px] uppercase tracking-wider mb-0.5">
                      {cat.name}
                    </h3>
                    <p className="text-slate-600 leading-snug text-[10.5px]">
                      {cat.skills.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {sectionVisibility.education && education && education.length > 0 && (
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-2 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Education
              </h2>
              <div className="space-y-2 text-[11px]">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-900">{edu.institution}</div>
                    <div className="text-slate-700 font-medium text-[10.5px]">
                      {edu.degree} in {edu.fieldOfStudy}
                    </div>
                    <div className="text-[10px] text-slate-500 tabular-nums">
                      {edu.startDate} – {edu.endDate}
                    </div>
                    {edu.honors && <div className="text-[10px] text-slate-500 italic mt-0.5">{edu.honors}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {sectionVisibility.certifications && certifications && certifications.length > 0 && (
            <div>
              <h2
                className="text-[11px] font-bold uppercase tracking-wider pb-0.5 mb-2 border-b"
                style={{ color: accentColor, borderColor: accentColor }}
              >
                Certifications
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="font-semibold text-slate-900 flex justify-between items-baseline">
                      <span>{cert.name}</span>
                      {cert.url && (
                        <a
                          href={ensureValidHref(cert.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[9.5px] hover:underline font-medium inline-flex items-center gap-0.5"
                          style={{ color: accentColor }}
                        >
                          <span>{formatCertificationLinkLabel(cert.url, cert.urlLabel)}</span>
                          <span aria-hidden="true" className="text-[8px]">↗</span>
                        </a>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-600">
                      {cert.issuer} {cert.issueDate && `· ${cert.issueDate}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
