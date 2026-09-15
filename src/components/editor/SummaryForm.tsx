import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check, Lightbulb } from 'lucide-react';

interface SummaryFormProps {
  summary: string;
  jobTitle?: string;
  skills?: string[];
  onChange: (value: string) => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ summary, jobTitle, skills, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [yearsOfExp, setYearsOfExp] = useState('4+');
  const [careerGoals, setCareerGoals] = useState('Scaling data-driven systems and delivering quantifiable impact');
  const [successMsg, setSuccessMsg] = useState(false);

  const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;
  const charCount = summary.length;

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: jobTitle || 'Experienced Professional',
          yearsOfExperience: yearsOfExp,
          skills: skills || [],
          careerGoals,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.summary) {
          onChange(data.summary);
          setShowAiHelper(false);
          setSuccessMsg(true);
          setTimeout(() => setSuccessMsg(false), 3000);
          return;
        }
      }
      // Fallback offline generation template
      generateLocalSummary();
    } catch {
      generateLocalSummary();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLocalSummary = () => {
    const title = jobTitle || 'Dedicated Professional';
    const skillsList = skills && skills.length > 0 ? skills.slice(0, 4).join(', ') : 'strategic planning, cross-functional collaboration, and technical execution';
    const generated = `Results-driven ${title} with ${yearsOfExp} years of hands-on experience specializing in ${skillsList}. Proven track record of improving operational efficiency, driving measurable business growth, and delivering scalable solutions in fast-paced environments. Adept at bridging technical capabilities with organizational objectives to maximize product quality and customer satisfaction.`;
    onChange(generated);
    setShowAiHelper(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const exampleSummaries = [
    {
      title: 'Technical / Engineering',
      text: 'Results-oriented Full-Stack Engineer with 5+ years of experience building resilient cloud-native web applications and microservices using TypeScript, React, and Node.js. Successfully scaled architectures to support 2M+ monthly active users while reducing p99 response times by 35%. Passionate about engineering excellence and automated CI/CD workflows.',
    },
    {
      title: 'Data & Analytics',
      text: 'Analytical Data Scientist with 4+ years of expertise in machine learning, statistical modeling, and Python/SQL analytics pipelines. Spearheaded predictive modeling initiatives that decreased customer churn by 18% and drove $850K in incremental revenue. Proven ability to translate complex data insights into strategic executive decisions.',
    },
    {
      title: 'Management / Executive',
      text: 'Strategic Senior Product Manager with 7+ years directing cross-functional teams across product lifecycle from zero-to-one through rapid scale. Delivered 6 enterprise SaaS products generating over $12M in ARR with a consistent 96% CSAT score. Skilled in customer discovery, roadmapping, and agile execution.',
    },
  ];

  return (
    <div id="section-summary" className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <label htmlFor="textarea-summary" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Executive Summary / Profile
        </label>
        <button
          type="button"
          onClick={() => setShowAiHelper(!showAiHelper)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          {showAiHelper ? 'Close AI Assistant' : 'AI Summary Generator'}
        </button>
      </div>

      {showAiHelper && (
        <div className="bg-slate-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Generate ATS-Optimized Summary
            </h4>
            <span className="text-[11px] text-slate-500">AI & Keyword Powered</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Target Role Title</label>
              <input
                type="text"
                value={jobTitle || ''}
                readOnly
                placeholder="From Personal Info"
                className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-300 rounded text-slate-700"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Years of Experience</label>
              <input
                type="text"
                value={yearsOfExp}
                onChange={(e) => setYearsOfExp(e.target.value)}
                placeholder="e.g. 5+, 3 years, Entry-level"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Career Focus / Key Achievements</label>
            <input
              type="text"
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="e.g. High-throughput distributed systems, conversion rate optimization"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateSummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded text-xs font-medium shadow-sm transition-colors"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Crafting Summary...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Professional Summary
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Summary generated and inserted into your resume!
        </div>
      )}

      <div>
        <textarea
          id="textarea-summary"
          rows={4}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Briefly state your target title, years of experience, core competencies, and high-level quantifiable achievements. Keep it between 40–80 words."
          className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow leading-relaxed"
        />

        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
          <span>
            {wordCount} words / {charCount} characters (Target: 40–80 words)
          </span>
          <span className={wordCount >= 30 && wordCount <= 90 ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
            {wordCount === 0 ? 'Empty' : wordCount < 30 ? 'A bit brief' : wordCount <= 90 ? 'Optimal ATS Length' : 'Consider tightening'}
          </span>
        </div>
      </div>

      {/* Quick Example Templates */}
      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Inspiration Templates (Click to insert):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {exampleSummaries.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(ex.text)}
              className="text-left p-2.5 rounded border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 transition-all text-xs"
            >
              <div className="font-semibold text-slate-900 mb-1">{ex.title}</div>
              <p className="text-[11px] text-slate-600 line-clamp-2">{ex.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
