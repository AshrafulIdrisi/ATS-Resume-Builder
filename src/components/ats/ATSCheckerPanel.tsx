import React, { useState } from 'react';
import { ATSAnalysis, JobMatchResult } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Target, RefreshCw, HelpCircle, ChevronRight } from 'lucide-react';
import { matchJobDescriptionClient } from '../../utils/atsAnalyzer';

interface ATSCheckerPanelProps {
  analysis: ATSAnalysis;
  resumeRawText: string;
  onOpenJobMatcher?: () => void;
}

export const ATSCheckerPanel: React.FC<ATSCheckerPanelProps> = ({ analysis, resumeRawText }) => {
  const [jobDescInput, setJobDescInput] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);

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

  const handleMatchJob = async () => {
    if (!jobDescInput.trim()) return;
    setIsMatching(true);

    try {
      const response = await fetch('/api/ai/match-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: jobDescInput,
          resumeText: resumeRawText,
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
      const clientResult = matchJobDescriptionClient(jobDescInput, resumeRawText);
      setJobMatchResult(clientResult);
    } catch {
      const clientResult = matchJobDescriptionClient(jobDescInput, resumeRawText);
      setJobMatchResult(clientResult);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${getScoreColor(
                analysis.overallScore
              )}`}
            >
              <span className="text-2xl font-black">{analysis.overallScore}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Score</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">ATS Readiness Score</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {getScoreBadge(analysis.overallScore)}
                </span>
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
              {analysis.wordCount} words (~{analysis.estimatedPages} Page{analysis.estimatedPages > 1 ? 's' : ''})
            </div>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Contact Info</span>
              <span className="font-bold text-slate-800">{analysis.contactScore}/20</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(analysis.contactScore / 20) * 100}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Summary & Goals</span>
              <span className="font-bold text-slate-800">{analysis.summaryScore}/15</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(analysis.summaryScore / 15) * 100}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Work Experience</span>
              <span className="font-bold text-slate-800">{analysis.experienceScore}/25</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(analysis.experienceScore / 25) * 100}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Skills & Keywords</span>
              <span className="font-bold text-slate-800">{analysis.skillsScore}/15</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(analysis.skillsScore / 15) * 100}%` }}></div>
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
              Action Verbs Detected ({analysis.actionVerbsFound.length})
            </h4>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              {analysis.actionVerbsScore}/8 pts
            </span>
          </div>
          <p className="text-xs text-slate-500">
            ATS scanners favor statements beginning with high-impact power verbs.
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {analysis.actionVerbsFound.length > 0 ? (
              analysis.actionVerbsFound.map((verb) => (
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
              Measurable Achievements ({analysis.metricsFound.length})
            </h4>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {analysis.metricsScore}/7 pts
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Numbers, percentages, and dollar amounts validate your business impact.
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {analysis.metricsFound.length > 0 ? (
              analysis.metricsFound.map((metric, i) => (
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
          Actionable ATS Recommendations ({analysis.issues.length})
        </h4>

        <div className="space-y-2">
          {analysis.issues.map((issue) => (
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
                Paste a target job posting to scan for matched and missing keywords.
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
            placeholder="Paste the full job posting requirements and responsibilities here..."
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
