import React, { useState, useRef } from 'react';
import { ATSAnalysis, JobMatchResult, ResumeData } from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Target,
  RefreshCw,
  UploadCloud,
  FileText,
  Eye,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Check,
  X,
} from 'lucide-react';
import { matchJobDescriptionClient } from '../../utils/atsAnalyzer';
import { parseAndAuditUploadedResume, UploadedResumeScanResult } from '../../utils/resumeFileParser';

interface ATSCheckerPanelProps {
  analysis: ATSAnalysis;
  resumeRawText: string;
  onImportResume?: (importedData: ResumeData) => void;
  onGoToEditor?: () => void;
}

export const ATSCheckerPanel: React.FC<ATSCheckerPanelProps> = ({
  analysis: currentAnalysis,
  resumeRawText: currentResumeRawText,
  onImportResume,
  onGoToEditor,
}) => {
  // Mode: 'current' (builder resume) or 'upload' (scanned uploaded resume)
  const [activeSource, setActiveSource] = useState<'current' | 'upload'>('current');
  
  // Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [isScanningFile, setIsScanningFile] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [uploadedScanResult, setUploadedScanResult] = useState<UploadedResumeScanResult | null>(null);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [hasImportedNotice, setHasImportedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Job Matcher State
  const [jobDescInput, setJobDescInput] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);

  // Active Data Selection depending on active source
  const effectiveAnalysis =
    activeSource === 'upload' && uploadedScanResult
      ? uploadedScanResult.analysis
      : currentAnalysis;

  const effectiveRawText =
    activeSource === 'upload' && uploadedScanResult
      ? uploadedScanResult.extractedRawText
      : currentResumeRawText;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 65) return 'text-blue-600 border-blue-500 bg-blue-50';
    if (score >= 45) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-red-600 border-red-500 bg-red-50';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'Exceptional ATS Readiness';
    if (score >= 65) return 'Good ATS Compatibility';
    if (score >= 45) return 'Moderate - Needs Tailoring';
    return 'Low - Incomplete Sections';
  };

  const handleProcessFile = async (file: File) => {
    if (!file) return;
    setIsScanningFile(true);
    setScanError(null);
    setJobMatchResult(null);

    try {
      const result = await parseAndAuditUploadedResume(file);
      setUploadedScanResult(result);
      setActiveSource('upload');
    } catch (err: any) {
      console.error('File scan error:', err);
      setScanError(err.message || 'Failed to parse resume file. Please try uploading a PDF, DOCX, or TXT file.');
    } finally {
      setIsScanningFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleMatchJob = async () => {
    if (!jobDescInput.trim()) return;
    setIsMatching(true);

    try {
      const response = await fetch('/api/ai/match-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: jobDescInput,
          resumeText: effectiveRawText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.matchScore !== undefined) {
          setJobMatchResult({
            score: data.matchScore,
            matchedKeywords: data.matchedKeywords || [],
            missingKeywords: data.missingKeywords || [],
            recommendations: data.topRecommendations || [],
          });
          return;
        }
      }

      // Client-side fallback matcher
      const clientResult = matchJobDescriptionClient(jobDescInput, effectiveRawText);
      setJobMatchResult(clientResult);
    } catch {
      const clientResult = matchJobDescriptionClient(jobDescInput, effectiveRawText);
      setJobMatchResult(clientResult);
    } finally {
      setIsMatching(false);
    }
  };

  const handleImportUploadedToBuilder = () => {
    if (uploadedScanResult && onImportResume) {
      onImportResume(uploadedScanResult.resumeData);
      setHasImportedNotice(true);
      setTimeout(() => setHasImportedNotice(false), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Source Selector Tabs & Upload Prompt */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setActiveSource('current');
              setJobMatchResult(null);
            }}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSource === 'current'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Active Builder Resume</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSource('upload');
              setJobMatchResult(null);
            }}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSource === 'upload'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {uploadedScanResult ? `Uploaded: ${uploadedScanResult.fileName.slice(0, 15)}...` : 'Upload & Scan Resume'}
            </span>
          </button>
        </div>

        {uploadedScanResult && activeSource === 'upload' && onImportResume && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleImportUploadedToBuilder}
              className="w-full sm:w-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Import into Builder</span>
            </button>
          </div>
        )}
      </div>

      {hasImportedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Success!</strong> Uploaded resume content has been imported into the editor. You can switch to the <strong>Builder</strong> tab anytime to edit.
            </span>
          </div>
          {onGoToEditor && (
            <button
              type="button"
              onClick={onGoToEditor}
              className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 shrink-0"
            >
              Open Editor →
            </button>
          )}
        </div>
      )}

      {/* Upload Dropzone Section (Always visible or primary in Upload mode) */}
      {(!uploadedScanResult || activeSource === 'upload') && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upload Your Resume File to Check ATS Compatibility</h3>
                <p className="text-xs text-slate-500">
                  Upload an existing resume (PDF, Word DOCX, TXT, JSON, PNG/JPG) to audit parsing readiness, layout vulnerabilities, and keyword matching.
                </p>
              </div>
            </div>

            {uploadedScanResult && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
              >
                Upload Different File
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf,.docx,.doc,.txt,.json,.md,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/70'
            }`}
          >
            {isScanningFile ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-4">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-800">Scanning & Parsing Resume with AI...</div>
                  <div className="text-xs text-slate-500">Extracting sections, contact details, action verbs, and formatting rules.</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 py-2">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-700 hover:underline">Click to browse</span>
                  <span className="text-xs text-slate-500"> or drag and drop your resume file here</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Supports <strong>PDF, DOCX, TXT, JSON, PNG, JPG</strong> (Max 20MB) • Secure client & server scanning
                </div>
              </div>
            )}
          </div>

          {scanError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}

          {/* Uploaded File Meta Badge */}
          {uploadedScanResult && activeSource === 'upload' && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{uploadedScanResult.fileName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 bg-blue-100 text-blue-800 rounded-full">
                      {(uploadedScanResult.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Scanned at {uploadedScanResult.scanTimestamp} • {uploadedScanResult.extractedRawText.split(/\s+/).length} words extracted
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowExtractedText(!showExtractedText)}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>{showExtractedText ? 'Hide Extracted Text' : 'View Extracted Text'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Extracted Text Inspector (Shows exactly what ATS robots see) */}
          {showExtractedText && uploadedScanResult && activeSource === 'upload' && (
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 font-sans font-bold text-slate-300">
                  <FileCode className="w-4 h-4 text-blue-400" />
                  <span>Raw Text Extracted by ATS Scanner:</span>
                </div>
                <span className="text-[11px]">How automated ATS parsers read your file</span>
              </div>
              <pre className="whitespace-pre-wrap max-h-60 overflow-y-auto text-[11px] leading-relaxed text-slate-300">
                {uploadedScanResult.extractedRawText}
              </pre>
            </div>
          )}

          {/* Uploaded File Machine Format Audit */}
          {uploadedScanResult && uploadedScanResult.fileFormatAudit && activeSource === 'upload' && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    File Format & Layout Machine Audit
                  </h4>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    uploadedScanResult.fileFormatAudit.atsRiskRating === 'Low'
                      ? 'bg-emerald-100 text-emerald-800'
                      : uploadedScanResult.fileFormatAudit.atsRiskRating === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  ATS Formatting Risk: {uploadedScanResult.fileFormatAudit.atsRiskRating || 'Low'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-white rounded-lg border border-blue-100 flex items-center justify-between">
                  <span className="text-slate-600">Single Column Layout:</span>
                  <span className="font-bold text-slate-900">
                    {uploadedScanResult.fileFormatAudit.isSingleColumn ? '✓ Yes (Optimal)' : '⚠️ Multi-column detected'}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-100 flex items-center justify-between">
                  <span className="text-slate-600">Complex Tables/Graphics:</span>
                  <span className="font-bold text-slate-900">
                    {uploadedScanResult.fileFormatAudit.hasTablesOrGraphics ? '⚠️ Found (High Risk)' : '✓ None (Safe)'}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-100 flex items-center justify-between">
                  <span className="text-slate-600">Standard Heading Structure:</span>
                  <span className="font-bold text-slate-900">
                    {uploadedScanResult.fileFormatAudit.hasStandardHeadings ? '✓ Recognized' : '⚠️ Non-standard'}
                  </span>
                </div>
              </div>

              {uploadedScanResult.fileFormatAudit.structuralHighlights && uploadedScanResult.fileFormatAudit.structuralHighlights.length > 0 && (
                <div className="text-[11px] text-blue-900 space-y-1">
                  <span className="font-bold">Observations:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {uploadedScanResult.fileFormatAudit.structuralHighlights.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${getScoreColor(
                effectiveAnalysis.overallScore
              )}`}
            >
              <span className="text-2xl font-black">{effectiveAnalysis.overallScore}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Score</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">ATS Readiness Score</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {getScoreBadge(effectiveAnalysis.overallScore)}
                </span>
                {activeSource === 'upload' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    Uploaded Resume
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Estimated parsing compatibility based on heading hierarchy, action verbs, measurable metrics, and keyword richness.
              </p>
              <p className="text-[10px] text-slate-400 italic mt-0.5">
                * Note: Score is an estimate and guidance tool, not a guarantee of ATS system pass.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <div className="text-xs text-slate-500">Document Length:</div>
            <div className="text-sm font-bold text-slate-800">
              {effectiveAnalysis.wordCount} words (~{effectiveAnalysis.estimatedPages} Page{effectiveAnalysis.estimatedPages > 1 ? 's' : ''})
            </div>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Contact Info</span>
              <span className="font-bold text-slate-800">{effectiveAnalysis.contactScore}/20</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(effectiveAnalysis.contactScore / 20) * 100}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Summary & Goals</span>
              <span className="font-bold text-slate-800">{effectiveAnalysis.summaryScore}/15</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(effectiveAnalysis.summaryScore / 15) * 100}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Work Experience</span>
              <span className="font-bold text-slate-800">{effectiveAnalysis.experienceScore}/25</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(effectiveAnalysis.experienceScore / 25) * 100}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Skills & Keywords</span>
              <span className="font-bold text-slate-800">{effectiveAnalysis.skillsScore}/15</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(effectiveAnalysis.skillsScore / 15) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Verbs & Metrics Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Action Verbs */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Action Verbs Detected ({effectiveAnalysis.actionVerbsFound.length})
            </h4>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              {effectiveAnalysis.actionVerbsScore}/8 pts
            </span>
          </div>
          <p className="text-xs text-slate-500">
            ATS scanners favor statements beginning with high-impact power verbs.
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {effectiveAnalysis.actionVerbsFound.length > 0 ? (
              effectiveAnalysis.actionVerbsFound.map((verb) => (
                <span key={verb} className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded text-[11px] capitalize font-medium">
                  ✓ {verb}
                </span>
              ))
            ) : (
              <span className="text-xs text-amber-700 italic">No strong action verbs detected yet. Try verbs like Spearheaded, Architected, Automated, Optimized.</span>
            )}
          </div>
        </div>

        {/* Quantifiable Metrics */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600" />
              Measurable Achievements ({effectiveAnalysis.metricsFound.length})
            </h4>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {effectiveAnalysis.metricsScore}/7 pts
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Numbers, percentages, and dollar amounts validate your business impact.
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {effectiveAnalysis.metricsFound.length > 0 ? (
              effectiveAnalysis.metricsFound.map((metric, i) => (
                <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium">
                  ✓ {metric}
                </span>
              ))
            ) : (
              <span className="text-xs text-amber-700 italic">No metrics found. Add percentages (e.g. 25%), dollar savings ($100K), or user counts.</span>
            )}
          </div>
        </div>
      </div>

      {/* Issues & Recommendations Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Actionable ATS Recommendations ({effectiveAnalysis.issues.length})
        </h4>

        <div className="space-y-2">
          {effectiveAnalysis.issues.map((issue) => (
            <div
              key={issue.id}
              className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                issue.type === 'critical'
                  ? 'bg-red-50/70 border-red-200 text-red-900'
                  : issue.type === 'warning'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              }`}
            >
              {issue.type === 'critical' ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              ) : issue.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-bold flex items-center gap-1.5">
                  <span>{issue.title}</span>
                  <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-white/70">
                    {issue.section}
                  </span>
                </div>
                <p className="text-[11px] opacity-90">{issue.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 8: Job Description Keyword Matcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Job Description Keyword Matcher</h4>
              <p className="text-xs text-slate-500">
                Paste a target job posting to scan for matched and missing keywords against the active resume.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">Paste Job Description</label>
          <textarea
            rows={4}
            value={jobDescInput}
            onChange={(e) => setJobDescInput(e.target.value)}
            placeholder="Paste the target job posting requirements and responsibilities here..."
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={!jobDescInput.trim() || isMatching}
            onClick={handleMatchJob}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            {isMatching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Comparing Keywords...
              </>
            ) : (
              <>
                <Target className="w-3.5 h-3.5" />
                Analyze Keyword Match
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {jobMatchResult && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs font-bold text-slate-800">Job Match Alignment Score</span>
              <span className="text-sm font-extrabold text-blue-700">
                {jobMatchResult.score}% Match
              </span>
            </div>

            {/* Matched Keywords */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Found in Resume ({jobMatchResult.matchedKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {jobMatchResult.matchedKeywords.map((kw) => (
                  <span key={kw} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md text-xs font-medium">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Missing from Resume ({jobMatchResult.missingKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {jobMatchResult.missingKeywords.slice(0, 15).map((kw) => (
                  <span key={kw} className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-md text-xs font-medium">
                    ! {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-950 space-y-1.5">
              <div className="font-bold">Tailoring Advice:</div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                {jobMatchResult.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
