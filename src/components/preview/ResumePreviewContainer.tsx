import React, { useState } from 'react';
import { ResumeData, ResumeThemeSettings, TemplateId, FontFamilyOption, SpacingOption, FontSizeOption } from '../../types';
import { ResumeDocument } from '../templates/ResumeDocument';
import { ZoomIn, ZoomOut, RotateCcw, Download, Printer, Copy, FileText, Check, LayoutTemplate, Sliders } from 'lucide-react';
import { extractResumeRawText } from '../../utils/atsAnalyzer';

interface ResumePreviewContainerProps {
  data: ResumeData;
  settings: ResumeThemeSettings;
  onUpdateSettings: (settings: ResumeThemeSettings) => void;
  onOpenExportModal: () => void;
}

export const ResumePreviewContainer: React.FC<ResumePreviewContainerProps> = ({
  data,
  settings,
  onUpdateSettings,
  onOpenExportModal,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const [showStyleControls, setShowStyleControls] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 130));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 70));
  const handleResetZoom = () => setZoom(100);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPlainText = () => {
    const text = extractResumeRawText(data);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-200/70 border border-slate-300 rounded-xl overflow-hidden shadow-xs">
      {/* Top Preview Controls Toolbar */}
      <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 z-10">
        {/* Template Selector */}
        <div className="flex items-center gap-1.5">
          <LayoutTemplate className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Template:</span>
          <select
            value={settings.template}
            onChange={(e) => onUpdateSettings({ ...settings, template: e.target.value as TemplateId })}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="classic">Classic ATS (Standard B&W)</option>
            <option value="modern">Modern Professional (Navy Accents)</option>
            <option value="executive">Executive Resume (Elegant Serif)</option>
          </select>
        </div>

        {/* Style & Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowStyleControls(!showStyleControls)}
            className={`p-1.5 text-xs font-medium rounded-md border flex items-center gap-1 transition-colors ${
              showStyleControls
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            title="Formatting & Typography"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Formatting</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 rounded-md border border-slate-200 p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 70}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-semibold text-slate-700 w-10 text-center">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 130}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoom !== 100 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-white ml-0.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick PDF button */}
          <button
            type="button"
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Formatting & Spacing Collapsible Bar */}
      {showStyleControls && (
        <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Font Family */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Font Family</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => onUpdateSettings({ ...settings, fontFamily: e.target.value as FontFamilyOption })}
              className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
            >
              <option value="sans">Source Sans 3 (Standard Clean)</option>
              <option value="garamond">EB Garamond (Classic Executive)</option>
              <option value="merriweather">Merriweather (Refined Serif)</option>
            </select>
          </div>

          {/* Spacing */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Line & Section Spacing</label>
            <select
              value={settings.spacing}
              onChange={(e) => onUpdateSettings({ ...settings, spacing: e.target.value as SpacingOption })}
              className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
            >
              <option value="compact">Compact (Fit more content on 1 page)</option>
              <option value="normal">Normal (Standard balanced ATS)</option>
              <option value="relaxed">Relaxed (Spacious)</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Font Size Scale</label>
            <select
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ ...settings, fontSize: e.target.value as FontSizeOption })}
              className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
            >
              <option value="sm">Small (Dense)</option>
              <option value="base">Standard (11-12pt)</option>
              <option value="lg">Large (Readability)</option>
            </select>
          </div>
        </div>
      )}

      {/* Preview Scroll Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-300/60 print:p-0 print:bg-white">
        <div
          className="transition-transform duration-150 origin-top shadow-xl print:shadow-none print:transform-none"
          style={{
            transform: `scale(${zoom / 100})`,
            width: '210mm',
            minHeight: '297mm',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Actual Resume Content Canvas */}
          <div className="relative">
            <ResumeDocument data={data} settings={settings} />

            {/* Page 1 Visual Guideline Watermark (Non-printable) */}
            <div className="print:hidden border-t-2 border-dashed border-red-300/70 absolute top-[297mm] left-0 right-0 pointer-events-none">
              <span className="absolute -top-3 right-4 bg-red-100 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-300">
                End of Page 1 (A4 Guide)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 print:hidden text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>100% Real-time ATS Preview</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyPlainText}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Text!' : 'Copy Plain Text'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
