import React, { useState } from 'react';
import { ResumeData } from '../../types';
import { X, Download, Printer, Copy, FileCode, Upload, Check, ShieldCheck, FileText } from 'lucide-react';
import { extractResumeRawText } from '../../utils/atsAnalyzer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onImportData: (data: ResumeData) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data, onImportData }) => {
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrintPDF = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleDownloadTxt = () => {
    const rawText = generateStructuredPlainText(data);
    const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(data.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_ATS_Resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(data.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_data.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    const rawText = generateStructuredPlainText(data);
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object' && parsed.personalInfo) {
          onImportData(parsed);
          setImportSuccess(true);
          setImportError('');
          setTimeout(() => {
            setImportSuccess(false);
            onClose();
          }, 1500);
        } else {
          setImportError('Invalid resume JSON format.');
        }
      } catch {
        setImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Export & Download Resume</h3>
            <p className="text-xs text-slate-500">100% Free • No watermarks • No login required</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Main Primary CTA */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-center space-y-2">
            <button
              type="button"
              onClick={handlePrintPDF}
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume PDF — Free</span>
            </button>
            <div className="flex items-center justify-center gap-1 text-[11px] text-blue-900/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Standard A4 vector format, ATS machine-readable text</span>
            </div>
          </div>

          {/* Additional Export Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Direct Print */}
            <button
              type="button"
              onClick={handlePrintPDF}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left flex items-start gap-2.5 transition-all"
            >
              <Printer className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-800">Browser Print / PDF</div>
                <div className="text-[11px] text-slate-500">Select "Save as PDF" destination</div>
              </div>
            </button>

            {/* Plain Text (.txt) Export */}
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left flex items-start gap-2.5 transition-all"
            >
              <FileText className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-800">Export Plain Text (.txt)</div>
                <div className="text-[11px] text-slate-500">Pure ASCII formatted for legacy ATS</div>
              </div>
            </button>

            {/* Copy text */}
            <button
              type="button"
              onClick={handleCopyText}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left flex items-start gap-2.5 transition-all"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Copy className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold text-slate-800">{copied ? 'Copied!' : 'Copy to Clipboard'}</div>
                <div className="text-[11px] text-slate-500">Copy plain text to paste anywhere</div>
              </div>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJSON}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left flex items-start gap-2.5 transition-all"
            >
              <FileCode className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-800">Backup Data (JSON)</div>
                <div className="text-[11px] text-slate-500">Save raw JSON backup for future re-import</div>
              </div>
            </button>
          </div>

          {/* Import JSON file */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Import Resume from JSON:</span>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-[11px] transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {importError && <p className="text-red-600 text-[11px]">{importError}</p>}
            {importSuccess && (
              <p className="text-emerald-600 text-[11px] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Resume data imported successfully!
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function generateStructuredPlainText(resume: ResumeData): string {
  const lines: string[] = [];
  const pi = resume.personalInfo;

  lines.push(pi.fullName ? pi.fullName.toUpperCase() : 'CANDIDATE NAME');
  if (pi.jobTitle) lines.push(pi.jobTitle.toUpperCase());
  const contacts = [pi.email, pi.phone, pi.location, pi.linkedin, pi.portfolio, pi.github].filter(Boolean);
  if (contacts.length > 0) lines.push(contacts.join(' | '));
  lines.push('');

  if (resume.summary) {
    lines.push('====================');
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('====================');
    lines.push(resume.summary);
    lines.push('');
  }

  if (resume.experience.length > 0) {
    lines.push('===============');
    lines.push('WORK EXPERIENCE');
    lines.push('===============');
    resume.experience.forEach((exp) => {
      lines.push(`${exp.jobTitle} - ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})`);
      if (exp.location) lines.push(`Location: ${exp.location}`);
      if (exp.description) lines.push(exp.description);
      (exp.bullets || []).filter(Boolean).forEach((b) => {
        lines.push(`* ${b}`);
      });
      lines.push('');
    });
  }

  if (resume.education.length > 0) {
    lines.push('=========');
    lines.push('EDUCATION');
    lines.push('=========');
    resume.education.forEach((edu) => {
      lines.push(`${edu.degree} - ${edu.school} (${edu.startYear} - ${edu.graduationYear})`);
      if (edu.location) lines.push(`Location: ${edu.location}`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      if (edu.coursework) lines.push(`Coursework: ${edu.coursework}`);
      lines.push('');
    });
  }

  if (resume.skillCategories.some((c) => c.skills?.length > 0)) {
    lines.push('======');
    lines.push('SKILLS');
    lines.push('======');
    resume.skillCategories.forEach((cat) => {
      if (cat.skills?.length > 0) {
        lines.push(`${cat.name}: ${cat.skills.join(', ')}`);
      }
    });
    lines.push('');
  }

  if (resume.projects.length > 0) {
    lines.push('========');
    lines.push('PROJECTS');
    lines.push('========');
    resume.projects.forEach((proj) => {
      lines.push(`${proj.name}${proj.link ? ` [${proj.link}]` : ''}`);
      if (proj.technologies) lines.push(`Technologies: ${proj.technologies}`);
      if (proj.description) lines.push(proj.description);
      (proj.bullets || []).filter(Boolean).forEach((b) => {
        lines.push(`* ${b}`);
      });
      lines.push('');
    });
  }

  if (resume.certifications.length > 0) {
    lines.push('==============');
    lines.push('CERTIFICATIONS');
    lines.push('==============');
    resume.certifications.forEach((c) => {
      lines.push(`${c.name} - ${c.issuer} (${c.issueDate})`);
    });
    lines.push('');
  }

  if (resume.additional.length > 0) {
    lines.push('======================');
    lines.push('ADDITIONAL INFORMATION');
    lines.push('======================');
    resume.additional.forEach((a) => {
      lines.push(`${a.type.toUpperCase()}: ${a.title} ${a.subtitle ? `(${a.subtitle})` : ''} - ${a.description}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}
