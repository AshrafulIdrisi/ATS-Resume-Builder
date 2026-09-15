import React, { useState } from 'react';
import { ExperienceItem } from '../../types';
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, RefreshCw, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { ACTION_VERBS } from '../../utils/atsAnalyzer';
import { AIBulletImproverModal } from '../modals/AIBulletImproverModal';

interface ExperienceFormProps {
  experience: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onChange }) => {
  const [expandedId, setExpandedId] = useState<string>(experience[0]?.id || '');
  const [showVerbPalette, setShowVerbPalette] = useState(false);

  // Modal State for AI Bullet Improver
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    expId: string;
    bulletIdx: number;
    initialText: string;
    jobTitle: string;
    context: string;
  }>({
    isOpen: false,
    expId: '',
    bulletIdx: 0,
    initialText: '',
    jobTitle: '',
    context: '',
  });

  const addExperience = () => {
    const newId = 'exp-' + Date.now();
    const newItem: ExperienceItem = {
      id: newId,
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      bullets: [''],
    };
    onChange([...experience, newItem]);
    setExpandedId(newId);
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      experience.map((exp) => {
        if (exp.id === id) {
          return { ...exp, [field]: value };
        }
        return exp;
      })
    );
  };

  const deleteExperience = (id: string) => {
    onChange(experience.filter((exp) => exp.id !== id));
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experience.length) return;
    const newItems = [...experience];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    onChange(newItems);
  };

  // Bullets handling
  const addBullet = (expId: string) => {
    onChange(
      experience.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            bullets: [...(exp.bullets || []), ''],
          };
        }
        return exp;
      })
    );
  };

  const updateBullet = (expId: string, bulletIdx: number, value: string) => {
    onChange(
      experience.map((exp) => {
        if (exp.id === expId) {
          const newBullets = [...(exp.bullets || [])];
          newBullets[bulletIdx] = value;
          return { ...exp, bullets: newBullets };
        }
        return exp;
      })
    );
  };

  const deleteBullet = (expId: string, bulletIdx: number) => {
    onChange(
      experience.map((exp) => {
        if (exp.id === expId) {
          const newBullets = (exp.bullets || []).filter((_, i) => i !== bulletIdx);
          return { ...exp, bullets: newBullets.length > 0 ? newBullets : [''] };
        }
        return exp;
      })
    );
  };

  const openBulletImprover = (expId: string, bulletIdx: number, currentText: string, jobTitle: string, company: string) => {
    setModalState({
      isOpen: true,
      expId,
      bulletIdx,
      initialText: currentText || '',
      jobTitle: jobTitle || 'Professional Role',
      context: company ? `at ${company}` : '',
    });
  };

  return (
    <div id="section-experience" className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Work Experience ({experience.length})
          </span>
          <p className="text-[11px] text-slate-500">
            List in reverse chronological order (latest job first).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowVerbPalette(!showVerbPalette)}
            className="text-xs text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 transition-colors"
          >
            {showVerbPalette ? 'Hide Action Verbs' : 'Action Verbs Ideas'}
          </button>
          <button
            type="button"
            onClick={addExperience}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Position
          </button>
        </div>
      </div>

      {showVerbPalette && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
          <p className="font-semibold text-slate-800 mb-2">
            ATS-Recommended Power Action Verbs (Click to copy):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ACTION_VERBS.slice(0, 36).map((verb) => (
              <button
                key={verb}
                type="button"
                onClick={() => navigator.clipboard.writeText(verb.charAt(0).toUpperCase() + verb.slice(1))}
                title="Click to copy"
                className="px-2 py-0.5 bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 rounded text-[11px] capitalize transition-colors"
              >
                {verb}
              </button>
            ))}
          </div>
        </div>
      )}

      {experience.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-6">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-700">No Experience Added Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-3">
            Add your work history, internships, contract gigs, or freelance work.
          </p>
          <button
            type="button"
            onClick={addExperience}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experience.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            return (
              <div
                key={exp.id}
                className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <div
                  className="flex items-center justify-between p-3 bg-slate-50/80 hover:bg-slate-100/80 cursor-pointer border-b border-slate-200"
                  onClick={() => setExpandedId(isExpanded ? '' : exp.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900">
                        {exp.jobTitle || 'New Position'}
                      </span>
                      {exp.company && (
                        <span className="text-xs text-slate-600 ml-1.5">
                          at {exp.company}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveExperience(index, 'up')}
                      title="Move Up"
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === experience.length - 1}
                      onClick={() => moveExperience(index, 'down')}
                      title="Move Down"
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExperience(exp.id)}
                      title="Delete Experience"
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? '' : exp.id)}
                      className="p-1 text-slate-500 hover:text-slate-800"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                          placeholder="e.g. Senior Data Scientist"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Company / Organization <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="e.g. Example Corp"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Location (City, State / Remote)
                        </label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="e.g. San Francisco, CA / Remote"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            placeholder="e.g. Mar 2022"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="text"
                            disabled={exp.current}
                            value={exp.current ? 'Present' : exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            placeholder="e.g. Present, Dec 2024"
                            className="w-full px-3 py-1.5 bg-white disabled:bg-slate-100 border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-700 cursor-pointer font-medium">
                        I am currently working in this role
                      </label>
                    </div>

                    {/* Bullet Points Section */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-800">
                          Accomplishments & Responsibilities (Bullet Points)
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openBulletImprover(exp.id, (exp.bullets || []).length, '', exp.jobTitle, exp.company)}
                            className="text-xs text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200 transition-colors"
                          >
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            AI Bullet Assistant (1–3 Suggestions)
                          </button>
                          <button
                            type="button"
                            onClick={() => addBullet(exp.id)}
                            className="text-xs text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Bullet
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {(exp.bullets || ['']).map((bullet, bIdx) => {
                          return (
                            <div key={bIdx} className="flex items-start gap-2">
                              <span className="text-slate-400 text-xs mt-2">•</span>
                              <div className="flex-1 space-y-1">
                                <textarea
                                  rows={2}
                                  value={bullet}
                                  onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)}
                                  placeholder="Action verb + core task + measurable impact (e.g. Spearheaded migration to microservices, decreasing latency by 35%)..."
                                  className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-600 focus:border-transparent leading-relaxed"
                                />
                                <div className="flex justify-between items-center">
                                  <button
                                    type="button"
                                    onClick={() => openBulletImprover(exp.id, bIdx, bullet, exp.jobTitle, exp.company)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200 transition-colors shadow-2xs"
                                  >
                                    <Sparkles className="w-3 h-3 text-purple-600" />
                                    AI Improve (Get 1–3 Bullet Options)
                                  </button>
                                  {exp.bullets && exp.bullets.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => deleteBullet(exp.id, bIdx)}
                                      className="text-[11px] text-slate-400 hover:text-red-600"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* AI Bullet Improver Modal */}
      <AIBulletImproverModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        initialText={modalState.initialText}
        jobTitle={modalState.jobTitle}
        context={modalState.context}
        onApplyBullet={(improved) => {
          if (modalState.bulletIdx < (experience.find((e) => e.id === modalState.expId)?.bullets?.length || 0)) {
            updateBullet(modalState.expId, modalState.bulletIdx, improved);
          } else {
            // Append as new bullet
            onChange(
              experience.map((exp) => {
                if (exp.id === modalState.expId) {
                  return { ...exp, bullets: [...(exp.bullets || []), improved] };
                }
                return exp;
              })
            );
          }
        }}
      />
    </div>
  );
};

