import React from 'react';
import { TemplateId, ResumeData, ResumeThemeSettings } from '../../types';
import { CheckCircle2, LayoutTemplate, ArrowRight } from 'lucide-react';
import { ResumeDocument } from '../templates/ResumeDocument';

interface TemplatesGalleryProps {
  currentTemplate: TemplateId;
  onSelectTemplate: (template: TemplateId) => void;
  data: ResumeData;
  settings: ResumeThemeSettings;
  onGoToEditor: () => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({
  currentTemplate,
  onSelectTemplate,
  data,
  settings,
  onGoToEditor,
}) => {
  const templates: Array<{
    id: TemplateId;
    name: string;
    description: string;
    recommendedFor: string;
    color: string;
  }> = [
    {
      id: 'classic',
      name: 'Classic ATS Template',
      description: 'Clean black-and-white standard layout with horizontal rules. Optimized for maximum readability across legacy and modern ATS parsers.',
      recommendedFor: 'Engineering, Finance, Healthcare, Government, Academia',
      color: 'border-slate-800 text-slate-900',
    },
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Sophisticated deep navy accents with compact, elegant section dividers. Maintains 100% single-column ATS parsability.',
      recommendedFor: 'Tech Startups, Product Management, Marketing, Design, Consulting',
      color: 'border-blue-800 text-blue-900',
    },
    {
      id: 'executive',
      name: 'Executive Resume',
      description: 'Refined serif typography with centered header styling. Ideal for senior managers, directors, and executives with extensive achievements.',
      recommendedFor: 'Leadership, Executives, Directors, Legal, Senior Operations',
      color: 'border-slate-700 text-slate-800',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>ATS-Compliant Template Gallery</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Choose Your ATS Resume Style</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Switch between templates anytime without losing any of your typed data or formatting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const isSelected = currentTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              className={`bg-white rounded-2xl border-2 transition-all p-5 flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-blue-600 shadow-lg ring-2 ring-blue-600/20'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{tpl.name}</h3>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Active
                    </span>
                  )}
                </div>

                {/* Scaled Mini-preview container */}
                <div className="h-64 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-inner flex justify-center items-start p-2">
                  <div
                    className="origin-top pointer-events-none select-none bg-white shadow-xs"
                    style={{
                      transform: 'scale(0.32)',
                      width: '210mm',
                      minHeight: '297mm',
                    }}
                  >
                    <ResumeDocument data={data} settings={{ ...settings, template: tpl.id }} />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{tpl.description}</p>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong className="text-slate-700">Best for:</strong> {tpl.recommendedFor}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(tpl.id);
                    onGoToEditor();
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <span>{isSelected ? 'Continue in Editor' : 'Select This Template'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
