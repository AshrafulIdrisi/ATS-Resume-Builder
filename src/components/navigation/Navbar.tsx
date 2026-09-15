import React, { useState } from 'react';
import { FileText, Sparkles, Download, RotateCcw, Check, ChevronDown, Shield, LayoutTemplate, Target, Info } from 'lucide-react';
import { SAMPLE_DATA_SCIENTIST_RESUME, SAMPLE_SOFTWARE_ENGINEER_RESUME } from '../../data/sampleResumes';
import { ResumeData } from '../../types';

interface NavbarProps {
  activeTab: 'home' | 'builder' | 'templates' | 'ats' | 'about';
  setActiveTab: (tab: 'home' | 'builder' | 'templates' | 'ats' | 'about') => void;
  lastSaved: Date | null;
  onOpenLoadSampleModal: () => void;
  onClearResume: () => void;
  onOpenExportModal: () => void;
  atsScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lastSaved,
  onOpenLoadSampleModal,
  onClearResume,
  onOpenExportModal,
  atsScore,
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black shadow-xs group-hover:bg-blue-800 transition-colors">
              <FileText className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>ATS Resume</span>
                <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                  Free
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">Applicant Tracking System Optimized</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'home' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'builder' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              Resume Builder
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'templates' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              Templates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ats')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'ats' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>ATS Checker</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                atsScore >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {atsScore}%
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'about' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Privacy
            </button>
          </nav>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Autosave badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Saved locally</span>
          </div>

          {/* Load Sample Resume Button with Confirmation Modal */}
          <button
            type="button"
            onClick={onOpenLoadSampleModal}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Load realistic ATS-optimized sample resume data"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Load Sample Resume</span>
            <span className="sm:hidden">Sample</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={() => setShowConfirmClear(true)}
            title="Clear Resume Form"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Main Primary Download CTA */}
          <button
            type="button"
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="flex md:hidden border-t border-slate-200 overflow-x-auto text-xs font-semibold px-2 py-1 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'home' ? 'bg-blue-100 text-blue-800' : 'text-slate-600'
          }`}
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'builder' ? 'bg-blue-100 text-blue-800' : 'text-slate-600'
          }`}
        >
          Builder
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'templates' ? 'bg-blue-100 text-blue-800' : 'text-slate-600'
          }`}
        >
          Templates
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ats')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'ats' ? 'bg-blue-100 text-blue-800' : 'text-slate-600'
          }`}
        >
          ATS Checker ({atsScore}%)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'about' ? 'bg-blue-100 text-blue-800' : 'text-slate-600'
          }`}
        >
          Privacy
        </button>
      </div>

      {/* Confirmation Modal for Clearing */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Reset & Clear Resume?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to clear all entered resume fields? You can also load sample data at any time.
            </p>
            <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearResume();
                  setShowConfirmClear(false);
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
