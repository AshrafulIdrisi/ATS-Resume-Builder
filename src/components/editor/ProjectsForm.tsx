import React, { useState } from 'react';
import { ProjectItem } from '../../types';
import { Plus, Trash2, FolderGit2, Sparkles } from 'lucide-react';
import { AIBulletImproverModal } from '../modals/AIBulletImproverModal';

interface ProjectsFormProps {
  projects: ProjectItem[];
  onChange: (projects: ProjectItem[]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects, onChange }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    projId: string;
    bulletIdx: number;
    initialText: string;
    jobTitle: string;
    context: string;
  }>({
    isOpen: false,
    projId: '',
    bulletIdx: 0,
    initialText: '',
    jobTitle: '',
    context: '',
  });

  const addProject = () => {
    const newItem: ProjectItem = {
      id: 'proj-' + Date.now(),
      name: '',
      link: '',
      technologies: '',
      description: '',
      bullets: [''],
    };
    onChange([...projects, newItem]);
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(
      projects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const deleteProject = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const addBullet = (projId: string) => {
    onChange(
      projects.map((p) => {
        if (p.id === projId) {
          return { ...p, bullets: [...(p.bullets || []), ''] };
        }
        return p;
      })
    );
  };

  const updateBullet = (projId: string, bIdx: number, val: string) => {
    onChange(
      projects.map((p) => {
        if (p.id === projId) {
          const bullets = [...(p.bullets || [])];
          bullets[bIdx] = val;
          return { ...p, bullets };
        }
        return p;
      })
    );
  };

  const deleteBullet = (projId: string, bIdx: number) => {
    onChange(
      projects.map((p) => {
        if (p.id === projId) {
          const bullets = (p.bullets || []).filter((_, i) => i !== bIdx);
          return { ...p, bullets: bullets.length > 0 ? bullets : [''] };
        }
        return p;
      })
    );
  };

  const openBulletImprover = (projId: string, bulletIdx: number, currentText: string, projName: string) => {
    setModalState({
      isOpen: true,
      projId,
      bulletIdx,
      initialText: currentText || '',
      jobTitle: 'Technical Project',
      context: projName ? `Project: ${projName}` : '',
    });
  };

  return (
    <div id="section-projects" className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Key Projects ({projects.length})
          </span>
          <p className="text-[11px] text-slate-500">Showcase open-source code, products, or portfolios.</p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4">
          <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
          <p className="text-xs text-slate-600">No key projects added yet.</p>
          <button
            type="button"
            onClick={addProject}
            className="mt-2 text-xs text-blue-700 font-semibold hover:underline"
          >
            + Add Notable Project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj, idx) => (
            <div key={proj.id} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-blue-600" />
                  Project #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => deleteProject(proj.id)}
                  className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                    placeholder="e.g. Real-Time Fraud Detection Pipeline"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Project Link / Repository
                  </label>
                  <input
                    type="text"
                    value={proj.link}
                    onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                    placeholder="e.g. github.com/username/project"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Technologies Used
                  </label>
                  <input
                    type="text"
                    value={proj.technologies}
                    onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                    placeholder="e.g. Python, Kafka, Redis, Docker, AWS"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                    placeholder="e.g. Stream-processing fraud classifier analyzing transactions in sub-50ms."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Bullets */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">Project Highlights</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openBulletImprover(proj.id, (proj.bullets || []).length, '', proj.name)}
                      className="text-xs text-purple-700 hover:text-purple-900 font-semibold inline-flex items-center gap-1 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      AI Assistant
                    </button>
                    <button
                      type="button"
                      onClick={() => addBullet(proj.id)}
                      className="text-xs text-blue-700 font-medium inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Bullet
                    </button>
                  </div>
                </div>
                {(proj.bullets || ['']).map((bullet, bIdx) => {
                  return (
                    <div key={bIdx} className="space-y-1">
                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => updateBullet(proj.id, bIdx, e.target.value)}
                          placeholder="Quantifiable outcome or technical achievement..."
                          className="flex-1 p-2 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                        {proj.bullets && proj.bullets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteBullet(proj.id, bIdx)}
                            className="text-slate-400 hover:text-red-600 self-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => openBulletImprover(proj.id, bIdx, bullet, proj.name)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200"
                      >
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        AI Improve (Get 1–3 Options)
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
          if (modalState.bulletIdx < (projects.find((p) => p.id === modalState.projId)?.bullets?.length || 0)) {
            updateBullet(modalState.projId, modalState.bulletIdx, improved);
          } else {
            // Append as new bullet
            onChange(
              projects.map((p) => {
                if (p.id === modalState.projId) {
                  return { ...p, bullets: [...(p.bullets || []), improved] };
                }
                return p;
              })
            );
          }
        }}
      />
    </div>
  );
};
