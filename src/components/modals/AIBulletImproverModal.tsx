import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Copy, RefreshCw, X, ShieldCheck, ArrowRight, Lightbulb } from 'lucide-react';

interface AIBulletImproverModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  jobTitle?: string;
  context?: string;
  onApplyBullet: (improvedBullet: string) => void;
}

export const AIBulletImproverModal: React.FC<AIBulletImproverModalProps> = ({
  isOpen,
  onClose,
  initialText,
  jobTitle = '',
  context = '',
  onApplyBullet,
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [roleTitle, setRoleTitle] = useState(jobTitle);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [appliedIdx, setAppliedIdx] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setInputText(initialText || '');
      setRoleTitle(jobTitle || '');
      setSuggestions([]);
      setCopiedIdx(null);
      setAppliedIdx(null);
      setErrorMsg(null);
      if (initialText && initialText.trim().length > 5) {
        handleGenerateSuggestions(initialText, jobTitle);
      }
    }
  }, [isOpen, initialText, jobTitle]);

  if (!isOpen) return null;

  // Local offline fallback that generates 3 high-quality variations adhering to strict no-invented-metrics rules
  const generateOfflineFallback = (raw: string, role: string) => {
    const trimmed = raw.trim().replace(/^[-•*]\s*/, '');
    const lowerFirst = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);

    const v1 = `Spearheaded ${lowerFirst}, driving measurable improvements in process execution and team delivery [by X%].`;
    const v2 = `Architected and implemented ${lowerFirst} utilizing industry-standard tools to optimize workflow reliability and system performance.`;
    const v3 = `Automated and streamlined ${lowerFirst}, reducing manual overhead [saving X hours/week] while maintaining high quality standards.`;

    return [v1, v2, v3];
  };

  const handleGenerateSuggestions = async (textToImprove = inputText, targetRole = roleTitle) => {
    if (!textToImprove.trim()) {
      setErrorMsg('Please enter a basic description of your duty or achievement.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setCopiedIdx(null);
    setAppliedIdx(null);

    try {
      const res = await fetch('/api/ai/improve-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: textToImprove.trim(),
          jobTitle: targetRole || 'Professional Role',
          context: context || '',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSuggestions(data.suggestions.slice(0, 3));
          setLoading(false);
          return;
        } else if (data.improved) {
          // If only 1 string returned, expand to 3
          const fallbackList = generateOfflineFallback(textToImprove, targetRole);
          setSuggestions([data.improved, fallbackList[1], fallbackList[2]]);
          setLoading(false);
          return;
        }
      }

      // Offline / Fallback
      setSuggestions(generateOfflineFallback(textToImprove, targetRole));
    } catch {
      setSuggestions(generateOfflineFallback(textToImprove, targetRole));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleApply = (text: string, idx: number) => {
    setAppliedIdx(idx);
    onApplyBullet(text);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const sampleInputs = [
    'analyzed customer data with python and sql to find churn patterns',
    'created weekly financial reports in excel for management',
    'built frontend components using react and tailwind css',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Bullet Point Improver</h2>
              <p className="text-xs text-slate-500">
                Transforms basic job duties into 1–3 ATS-optimized, action-verb-driven bullet points.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guardrail badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-lg text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Authentic ATS Rule:</strong> AI refines your actual responsibilities and uses placeholders like <code className="bg-emerald-100 px-1 py-0.5 rounded text-[11px]">[by X%]</code> without inventing fake numbers or claims.
          </span>
        </div>

        {/* Input Form */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Basic Description of Duty or Achievement:
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. built automated data pipelines in python and airflow to load data into snowflake..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role / Title Context (Optional):
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Senior Data Scientist"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                disabled={loading || !inputText.trim()}
                onClick={() => handleGenerateSuggestions()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating 1-3 Suggestions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Suggest 1–3 Bullet Points
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Examples if empty */}
          {!inputText && (
            <div className="pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Try an example input:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleInputs.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setInputText(sample);
                      handleGenerateSuggestions(sample, roleTitle);
                    }}
                    className="text-[11px] bg-slate-100 hover:bg-purple-50 hover:text-purple-800 text-slate-700 border border-slate-200 rounded-md px-2 py-1 text-left transition-colors"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}
        </div>

        {/* Suggestions List */}
        {suggestions.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                AI Suggested Bullet Points ({suggestions.length})
              </h3>
              <span className="text-[11px] text-slate-500">
                Choose the best fit or edit after inserting
              </span>
            </div>

            <div className="space-y-2.5">
              {suggestions.map((suggestion, idx) => {
                const isApplied = appliedIdx === idx;
                const isCopied = copiedIdx === idx;
                const badges = [
                  { label: 'Impact & Result Focus', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                  { label: 'Technical & Execution', color: 'bg-purple-50 text-purple-800 border-purple-200' },
                  { label: 'Process & Efficiency', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                ];
                const badge = badges[idx % badges.length];

                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                        Option {idx + 1}: {badge.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(suggestion, idx)}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApply(suggestion, idx)}
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded transition-colors ${
                            isApplied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-purple-700 hover:bg-purple-800 text-white'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3 h-3" />
                              Applied!
                            </>
                          ) : (
                            <>
                              <span>Use This Bullet</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-900 leading-relaxed font-normal bg-white p-2.5 rounded-lg border border-slate-200">
                      • {suggestion}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
