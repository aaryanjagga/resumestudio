import React from 'react';
import { PersonalDetails } from '../../types/resume';
import { ExternalLink, Sparkles, User, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { formatLinkDisplay } from '../../lib/linkUtils';

interface PersonalInfoEditorProps {
  data: PersonalDetails;
  onChange: (updated: PersonalDetails) => void;
}

export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({
  data,
  onChange,
}) => {
  const handleChange = (field: keyof PersonalDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const summaryCharCount = data.summary?.length || 0;
  const isSummaryOptimal = summaryCharCount >= 180 && summaryCharCount <= 500;

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-sm font-bold text-slate-900">Personal Information</h2>
        <p className="text-xs text-slate-500">Essential contact details and professional positioning.</p>
      </div>

      {/* Name and Headline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Alex Morgan"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Professional Headline
          </label>
          <input
            type="text"
            placeholder="e.g. Staff Software Engineer & Architect"
            value={data.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="alex@example.com"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 019-2831"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="San Francisco, CA"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Online Profiles & Link Masking */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">
            Online Profiles & Links (Auto-Masked)
          </label>
          <span className="text-[11px] text-slate-400">
            Full URLs are hidden on resumes and rendered as clean clickable labels (e.g. "LinkedIn")
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* LinkedIn */}
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>LinkedIn Profile URL</span>
                {data.linkedinUrl && (
                  <span className="text-[10px] text-emerald-600 font-medium">Active Link</span>
                )}
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={data.linkedinUrl}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                Display Text on Resume (Masked)
              </label>
              <input
                type="text"
                placeholder="LinkedIn"
                value={data.linkedinLabel || ''}
                onChange={(e) => handleChange('linkedinLabel', e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
              />
            </div>
            {data.linkedinUrl && (
              <div className="text-[10.5px] text-slate-500 pt-0.5 flex items-center gap-1">
                <span>Resume preview:</span>
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  {formatLinkDisplay(data.linkedinUrl, 'LinkedIn', data.linkedinLabel)} ↗
                </span>
              </div>
            )}
          </div>

          {/* GitHub */}
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>GitHub Profile URL</span>
                {data.githubUrl && (
                  <span className="text-[10px] text-emerald-600 font-medium">Active Link</span>
                )}
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={data.githubUrl}
                onChange={(e) => handleChange('githubUrl', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                Display Text on Resume (Masked)
              </label>
              <input
                type="text"
                placeholder="GitHub"
                value={data.githubLabel || ''}
                onChange={(e) => handleChange('githubLabel', e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
              />
            </div>
            {data.githubUrl && (
              <div className="text-[10.5px] text-slate-500 pt-0.5 flex items-center gap-1">
                <span>Resume preview:</span>
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  {formatLinkDisplay(data.githubUrl, 'GitHub', data.githubLabel)} ↗
                </span>
              </div>
            )}
          </div>

          {/* Portfolio / Website */}
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Portfolio / Any Link URL</span>
                {data.websiteUrl && (
                  <span className="text-[10px] text-emerald-600 font-medium">Active Link</span>
                )}
              </label>
              <input
                type="url"
                placeholder="https://mywebsite.com or https://x.com/..."
                value={data.websiteUrl}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                Display Text on Resume (Masked)
              </label>
              <input
                type="text"
                placeholder="Portfolio / Website"
                value={data.websiteLabel || ''}
                onChange={(e) => handleChange('websiteLabel', e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
              />
            </div>
            {data.websiteUrl && (
              <div className="text-[10.5px] text-slate-500 pt-0.5 flex items-center gap-1">
                <span>Resume preview:</span>
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  {formatLinkDisplay(data.websiteUrl, 'Portfolio', data.websiteLabel)} ↗
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="space-y-1">
        <div className="flex justify-between items-baseline">
          <label className="block text-xs font-semibold text-slate-700">
            Professional Summary
          </label>
          <span
            className={`font-mono text-[11px] tabular-nums ${
              isSummaryOptimal
                ? 'text-emerald-600'
                : summaryCharCount > 500
                ? 'text-amber-600'
                : 'text-slate-400'
            }`}
          >
            {summaryCharCount} chars {isSummaryOptimal ? '· Optimal' : '(aim for 200–450)'}
          </span>
        </div>
        <textarea
          rows={4}
          placeholder="Briefly state your core background, highest-leverage accomplishments, and primary technical or leadership focus..."
          value={data.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white leading-relaxed"
        />
        <p className="text-[11px] text-slate-400">
          Tip: Keep your summary concise and focused on high-level impact and core strengths.
        </p>
      </div>
    </div>
  );
};
