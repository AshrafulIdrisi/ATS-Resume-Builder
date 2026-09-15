import React from 'react';
import { EducationItem } from '../../types';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface EducationFormProps {
  education: EducationItem[];
  onChange: (items: EducationItem[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  const addEducation = () => {
    const newItem: EducationItem = {
      id: 'edu-' + Date.now(),
      degree: '',
      school: '',
      location: '',
      startYear: '',
      graduationYear: '',
      gpa: '',
      coursework: '',
    };
    onChange([...education, newItem]);
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    onChange(
      education.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const deleteEducation = (id: string) => {
    onChange(education.filter((item) => item.id !== id));
  };

  return (
    <div id="section-education" className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Education ({education.length})
          </span>
          <p className="text-[11px] text-slate-500">Add degrees, colleges, or bootcamps.</p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
          <p className="text-xs text-slate-600">No education entries added yet.</p>
          <button
            type="button"
            onClick={addEducation}
            className="mt-2 text-xs text-blue-700 font-semibold hover:underline"
          >
            + Add Degree or School
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div key={edu.id} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Education #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => deleteEducation(edu.id)}
                  className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Degree / Certificate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="e.g. B.S. in Computer Science"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    School / University <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder="e.g. University of California, Berkeley"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    placeholder="e.g. Berkeley, CA"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Start Year</label>
                    <input
                      type="text"
                      value={edu.startYear}
                      onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                      placeholder="e.g. 2017"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                      placeholder="e.g. 2021"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">GPA / Honors (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="e.g. 3.9 / 4.0 or Magna Cum Laude"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Relevant Coursework (Optional)</label>
                  <input
                    type="text"
                    value={edu.coursework}
                    onChange={(e) => updateEducation(edu.id, 'coursework', e.target.value)}
                    placeholder="e.g. Algorithms, Machine Learning, Distributed Systems"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
