import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Plus, ShieldCheck, Sparkles, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  onNewResume?: () => void;
  showNewButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewResume, showNewButton = true }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCreateClick = () => {
    if (onNewResume) {
      onNewResume();
    } else {
      navigate('/resumes');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-slate-900 hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-indigo-600 transition-colors">
            RS
          </div>
          <span className="text-lg font-bold tracking-tight">Resume Studio</span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            to="/resumes"
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              location.pathname.startsWith('/resumes') ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/#templates"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Templates</span>
          </Link>
          <Link
            to="/#privacy"
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Local Privacy</span>
          </Link>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {showNewButton && (
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-sm transition-all active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Resume</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
