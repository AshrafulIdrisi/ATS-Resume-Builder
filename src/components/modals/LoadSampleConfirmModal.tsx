import React from 'react';
import { AlertTriangle, Sparkles, FileText, CheckCircle, X } from 'lucide-react';
import { ResumeData } from '../../types';
import { SAMPLE_DATA_SCIENTIST_RESUME, SAMPLE_SOFTWARE_ENGINEER_RESUME } from '../../data/sampleResumes';

interface LoadSampleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLoad: (sample: ResumeData, sampleName: string) => void;
  hasExistingContent: boolean;
}

export const LoadSampleConfirmModal: React.FC<LoadSampleConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmLoad,
  hasExistingContent,
}) => {
  const [selectedSample, setSelectedSample] = React.useState<'data-scientist' | 'software-engineer'>('data-scientist');

  if (!isOpen) return null;

  const currentSampleData = selectedSample === 'data-scientist'
    ? SAMPLE_DATA_SCIENTIST_RESUME
    : SAMPLE_SOFTWARE_ENGINEER_RESUME;

  const sampleLabel = selectedSample === 'data-scientist'
    ? 'Data Scientist (Alex Johnson)'
    : 'Senior Software Engineer (Sarah Chen)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Load Sample Resume</h3>
              <p className="text-xs text-slate-500">Populate with pre-structured, ATS-verified content.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning if existing content exists */}
        {hasExistingContent && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Overwrite Confirmation:</p>
              <p className="text-amber-800 mt-0.5">
                Loading sample data will replace your current resume fields with the sample profile. Make sure you don't have unsaved personal work you wish to keep.
              </p>
            </div>
          </div>
        )}

        {/* Sample Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Role Sample:
          </label>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => setSelectedSample('data-scientist')}
              className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                selectedSample === 'data-scientist'
                  ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Data Scientist (Recommended)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                    Full ML Profile
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Alex Johnson • Python, SQL, ML Models, UC Berkeley, 5+ yrs experience.
                </p>
              </div>
              {selectedSample === 'data-scientist' && (
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setSelectedSample('software-engineer')}
              className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                selectedSample === 'software-engineer'
                  ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Senior Software Engineer
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sarah Chen • React, TypeScript, Node.js, Go, Microservices.
                </p>
              </div>
              {selectedSample === 'software-engineer' && (
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Clear labeling notice */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Sample Data Notice:</span>
          </div>
          <p className="text-[11px] text-slate-500">
            This realistic dataset includes complete contact info, professional summary, work history with measurable bullets, degree, skills, and projects to demonstrate optimal ATS parsing.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmLoad(currentSampleData, sampleLabel);
              onClose();
            }}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Confirm & Load Sample</span>
          </button>
        </div>
      </div>
    </div>
  );
};
