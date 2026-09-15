import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, CheckCircle2, HelpCircle, FileCheck, EyeOff, AlertTriangle } from 'lucide-react';

interface AboutPrivacyPageProps {
  onPurgeAllData: () => void;
}

export const AboutPrivacyPage: React.FC<AboutPrivacyPageProps> = ({ onPurgeAllData }) => {
  const [purged, setPurged] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePurge = () => {
    onPurgeAllData();
    setShowConfirm(false);
    setPurged(true);
    setTimeout(() => setPurged(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Privacy-First & ATS Architecture</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy & ATS Guide</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Your personal data is yours alone. We believe resume builders should be free, secure, and respectful of your career confidentiality.
        </p>
      </div>

      {/* Privacy Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900">Local-Only Storage</h3>
          <p className="text-slate-600 leading-relaxed">
            All your resume inputs are saved exclusively in your browser's LocalStorage. No user profiles, databases, or cookies track you.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900">Zero Data Selling</h3>
          <p className="text-slate-600 leading-relaxed">
            We never harvest, sell, or share your contact information, employment history, or salary expectations with recruiters or advertisers.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <FileCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900">No Watermarks or Fees</h3>
          <p className="text-slate-600 leading-relaxed">
            Download your clean vector PDF without forced paywalls, recurring subscriptions, or branded footer badges.
          </p>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Manage Your Local Resume Data</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Because data is stored in your current web browser, clearing your browser cache or clicking the button below will immediately erase all stored resume records from this device.
        </p>

        {purged && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All local resume data and draft settings have been completely wiped from your browser.</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge All Local Data from Browser</span>
          </button>
        </div>
      </div>

      {/* ATS Educational Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Understanding ATS (Applicant Tracking Systems)</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Over 90% of Fortune 500 corporations and thousands of growing companies utilize ATS platforms like <strong>Workday, Greenhouse, Taleo, Lever, and iCIMS</strong> to triage incoming applications before a recruiter ever reviews them.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-emerald-700">✓ What ATS Systems Love:</h4>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Standard single-column top-to-bottom reading order</li>
              <li>Clear conventional section titles (Experience, Education, Skills)</li>
              <li>Quantified bullets with numbers, % metrics, and dollar amounts</li>
              <li>Specific technical and functional keywords from the job posting</li>
              <li>Clean, selectable text PDF format</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-red-700">✕ What Breaks ATS Systems:</h4>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Two-column or multi-column layouts (text gets intermixed)</li>
              <li>Information inside tables, header/footer zones, or shapes</li>
              <li>Icons used in place of standard text for phone/email</li>
              <li>Skill rating bars or progress circles (cannot be parsed as text)</li>
              <li>Saving as scanned images or non-selectable flattened PDFs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Data Wipe</span>
            </div>
            <p className="text-xs text-slate-600">
              This will permanently delete your stored resume draft from this browser. This action cannot be undone unless you have exported a JSON backup.
            </p>
            <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePurge}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Yes, Wipe Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
