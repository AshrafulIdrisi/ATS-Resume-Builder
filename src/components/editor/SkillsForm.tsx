import React, { useState } from 'react';
import { SkillCategory } from '../../types';
import { Plus, X, Tag, Sparkles, FolderPlus, Trash2 } from 'lucide-react';

interface SkillsFormProps {
  categories: SkillCategory[];
  onChange: (categories: SkillCategory[]) => void;
}

const POPULAR_SKILL_SUGGESTIONS = [
  'Python', 'SQL', 'Machine Learning', 'Power BI', 'AWS', 'Excel', 'Data Analysis',
  'TypeScript', 'React', 'Node.js', 'Docker', 'Git', 'Tableau', 'Scikit-Learn',
  'PostgreSQL', 'Project Management', 'Agile / Scrum', 'Problem Solving', 'Communication'
];

export const SkillsForm: React.FC<SkillsFormProps> = ({ categories, onChange }) => {
  const [newSkillInput, setNewSkillInput] = useState<{ [catId: string]: string }>({});
  const [newCatName, setNewCatName] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  const addSkill = (catId: string, skillText: string) => {
    const trimmed = skillText.trim();
    if (!trimmed) return;

    // Handle comma-separated bulk paste
    const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);

    onChange(
      categories.map((cat) => {
        if (cat.id === catId) {
          const existing = new Set(cat.skills || []);
          parts.forEach((p) => existing.add(p));
          return { ...cat, skills: Array.from(existing) };
        }
        return cat;
      })
    );

    setNewSkillInput({ ...newSkillInput, [catId]: '' });
  };

  const removeSkill = (catId: string, skillToRemove: string) => {
    onChange(
      categories.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            skills: (cat.skills || []).filter((s) => s !== skillToRemove),
          };
        }
        return cat;
      })
    );
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: SkillCategory = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      skills: [],
    };
    onChange([...categories, newCat]);
    setNewCatName('');
    setShowAddCat(false);
  };

  const deleteCategory = (catId: string) => {
    onChange(categories.filter((cat) => cat.id !== catId));
  };

  const updateCategoryName = (catId: string, name: string) => {
    onChange(
      categories.map((cat) => (cat.id === catId ? { ...cat, name } : cat))
    );
  };

  return (
    <div id="section-skills" className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Skills & Competencies
          </span>
          <p className="text-[11px] text-slate-500">
            Categorized keywords allow ATS parsers to detect your core strengths.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddCat(!showAddCat)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          {showAddCat ? 'Cancel' : 'New Category'}
        </button>
      </div>

      {showAddCat && (
        <div className="flex gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Cloud & DevOps, Soft Skills, Certifications..."
            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCategory();
              }
            }}
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-3 py-1.5 bg-blue-700 text-white rounded text-xs font-semibold hover:bg-blue-800"
          >
            Create Category
          </button>
        </div>
      )}

      {/* Skill Categories */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const inputVal = newSkillInput[cat.id] || '';
          return (
            <div key={cat.id} className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2.5">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                  className="text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5"
                />
                {categories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Remove Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 border border-slate-200 rounded-md">
                {(cat.skills || []).length === 0 ? (
                  <span className="text-[11px] text-slate-400 italic">No skills added in this category yet.</span>
                ) : (
                  (cat.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-slate-300 text-slate-800 text-xs font-medium rounded-full shadow-2xs"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(cat.id, skill)}
                        className="text-slate-400 hover:text-red-600 focus:outline-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add Skill Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setNewSkillInput({ ...newSkillInput, [cat.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(cat.id, inputVal);
                      }
                    }}
                    placeholder="Type skill & press Enter (or comma-separated e.g. Python, SQL, AWS)"
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => addSkill(cat.id, inputVal)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Popular Skills */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Quick Add Popular ATS Keywords (Click to add to first category):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SKILL_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                if (categories.length > 0) {
                  addSkill(categories[0].id, s);
                }
              }}
              className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-900 rounded-md text-[11px] font-medium transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
