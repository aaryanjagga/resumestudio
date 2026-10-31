import React from 'react';
import { ShieldCheck, HardDrive, Lock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                RS
              </div>
              <span className="font-bold text-slate-900">Resume Studio</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              A minimalist, privacy-first resume builder designed to run completely on your device.
              Zero subscriptions, zero tracking scripts, and no remote database.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Client-Side
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                IndexedDB Storage
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                Zero Tracking
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/resumes" className="hover:text-indigo-600 transition-colors">
                  Resume Dashboard
                </Link>
              </li>
              <li>
                <a href="/#templates" className="hover:text-indigo-600 transition-colors">
                  Explore 6 Templates
                </a>
              </li>
              <li>
                <a href="/#privacy" className="hover:text-indigo-600 transition-colors">
                  Privacy Architecture
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Important Notice
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your resumes reside strictly in this browser’s IndexedDB storage. If you clear browser cache or switch devices, use the <strong>Backup (JSON)</strong> feature in the dashboard to preserve your resumes safely.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>© {new Date().getFullYear()} Resume Studio. Open, private, and local-first.</div>
          <div className="flex gap-4">
            <span>Client-side A4 export</span>
            <span>·</span>
            <span>WCAG AA accessible</span>
            <span>·</span>
            <span>Standard compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
