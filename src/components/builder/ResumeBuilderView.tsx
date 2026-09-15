import React, { useState } from 'react';
import { ResumeData, ResumeThemeSettings, ATSAnalysis } from '../../types';
import { PersonalInfoForm } from '../editor/PersonalInfoForm';
import { SummaryForm } from '../editor/SummaryForm';
import { ExperienceForm } from '../editor/ExperienceForm';
import { EducationForm } from '../editor/EducationForm';
import { SkillsForm } from '../editor/SkillsForm';
import { ProjectsForm } from '../editor/ProjectsForm';
import { CertificationsForm } from '../editor/CertificationsForm';
import { AdditionalSectionsForm } from '../editor/AdditionalSectionsForm';
import { ResumePreviewContainer } from '../preview/ResumePreviewContainer';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Award,
  Layers,
  CheckCircle2,
  ChevronRight,
  Eye,
  Edit3,
  SlidersHorizontal,
} from 'lucide-react';

interface ResumeBuilderViewProps {
  data: ResumeData;
  settings: ResumeThemeSettings;
  analysis: ATSAnalysis;
  onUpdateData: (data: ResumeData) => void;
  onUpdateSettings: (settings: ResumeThemeSettings) => void;
  onOpenExportModal: () => void;
  onOpenAtsTab: () => void;
  onOpenLoadSampleModal: () => void;
  isSampleDataActive?: boolean;
  sampleName?: string;
  onClearToBlank?: () => void;
}

type EditorSectionId =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'additional';

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({
  data,
  settings,
  analysis,
  onUpdateData,
  onUpdateSettings,
  onOpenExportModal,
  onOpenAtsTab,
  onOpenLoadSampleModal,
  isSampleDataActive = false,
  sampleName = 'Data Scientist',
  onClearToBlank,
}) => {
  const [activeSection, setActiveSection] = useState<EditorSectionId>('personal');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  const sectionsList: Array<{
    id: EditorSectionId;
    label: string;
    icon: React.ReactNode;
    isComplete: boolean;
    badgeCount?: number;
  }> = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: <User className="w-4 h-4" />,
      isComplete: Boolean(data.personalInfo.fullName && data.personalInfo.email),
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: <FileText className="w-4 h-4" />,
      isComplete: Boolean(data.summary && data.summary.length > 20),
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: <Briefcase className="w-4 h-4" />,
      isComplete: data.experience.length > 0,
      badgeCount: data.experience.length,
    },
    {
      id: 'education',
      label: 'Education',
      icon: <GraduationCap className="w-4 h-4" />,
      isComplete: data.education.length > 0,
      badgeCount: data.education.length,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Sparkles className="w-4 h-4" />,
      isComplete: data.skillCategories.some((c) => c.skills && c.skills.length > 0),
      badgeCount: data.skillCategories.reduce((acc, c) => acc + (c.skills?.length || 0), 0),
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderGit2 className="w-4 h-4" />,
      isComplete: data.projects.length > 0,
      badgeCount: data.projects.length,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: <Award className="w-4 h-4" />,
      isComplete: data.certifications.length > 0,
      badgeCount: data.certifications.length,
    },
    {
      id: 'additional',
      label: 'Additional',
      icon: <Layers className="w-4 h-4" />,
      isComplete: data.additional.length > 0,
      badgeCount: data.additional.length,
    },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Mobile Editor/Preview Toggle Bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors ${
              mobileView === 'editor' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors ${
              mobileView === 'preview' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>

        {/* ATS score pill on mobile */}
        <button
          type="button"
          onClick={onOpenAtsTab}
          className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200 flex items-center gap-1"
        >
          <span>ATS: {analysis.overallScore}%</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Split-Pane Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Form Editor */}
        <div
          className={`w-full lg:w-1/2 flex flex-col bg-slate-50 border-r border-slate-200 ${
            mobileView === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Section Navigation Pills */}
          <div className="bg-white border-b border-slate-200 px-3 py-2.5 overflow-x-auto shrink-0 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {sectionsList.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSection(sec.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>{sec.icon}</span>
                    <span>{sec.label}</span>
                    {sec.badgeCount !== undefined && sec.badgeCount > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {sec.badgeCount}
                      </span>
                    )}
                    {sec.isComplete && !sec.badgeCount && (
                      <CheckCircle2 className={`w-3 h-3 ${isActive ? 'text-blue-200' : 'text-emerald-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onOpenLoadSampleModal}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg whitespace-nowrap transition-colors"
              title="Load realistic ATS-formatted sample resume"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Load Sample</span>
            </button>
          </div>

          {/* Sample Data Active Banner */}
          {isSampleDataActive && !isBannerDismissed && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-blue-900">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                <span>
                  <strong>Sample Data Active ({sampleName}):</strong> Pre-filled with ATS-optimized content. Edit any field below to tailor for your application.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onClearToBlank && (
                  <button
                    type="button"
                    onClick={onClearToBlank}
                    className="text-[11px] font-semibold text-slate-600 hover:text-red-700 underline"
                  >
                    Clear to Blank
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsBannerDismissed(true)}
                  className="text-xs text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded hover:bg-white/60"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Editor Section Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activeSection === 'personal' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">Personal Information</h2>
                  <p className="text-xs text-slate-500">
                    Include your full name, title, contact details, and portfolio or LinkedIn link.
                  </p>
                </div>
                <PersonalInfoForm
                  data={data.personalInfo}
                  onChange={(updated) => onUpdateData({ ...data, personalInfo: updated })}
                />
              </div>
            )}

            {activeSection === 'summary' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">Professional Summary</h2>
                  <p className="text-xs text-slate-500">
                    A concise 3-4 sentence pitch highlighting your career achievements, core strengths, and goals.
                  </p>
                </div>
                <SummaryForm
                  summary={data.summary}
                  jobTitle={data.personalInfo.jobTitle}
                  skills={data.skillCategories.flatMap((c) => c.skills || [])}
                  onChange={(updated) => onUpdateData({ ...data, summary: updated })}
                />
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">Work Experience</h2>
                  <p className="text-xs text-slate-500">
                    List previous roles with bullet points focusing on action verbs and measurable business results.
                  </p>
                </div>
                <ExperienceForm
                  experience={data.experience}
                  onChange={(updated) => onUpdateData({ ...data, experience: updated })}
                />
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">Education</h2>
                  <p className="text-xs text-slate-500">
                    Degrees, colleges, universities, bootcamps, or academic honors.
                  </p>
                </div>
                <EducationForm
                  education={data.education}
                  onChange={(updated) => onUpdateData({ ...data, education: updated })}
                />
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">Skills & Competencies</h2>
                  <p className="text-xs text-slate-500">
                    Categorized keyword tags for technical skills, tools, and domain proficiencies.
                  </p>
                </div>
                <SkillsForm
                  categories={data.skillCategories}
                  onChange={(updated) => onUpdateData({ ...data, skillCategories: updated })}
                />
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">Projects & Portfolio</h2>
                  <p className="text-xs text-slate-500">
                    Highlight notable technical projects, open-source repositories, or business deliverables.
                  </p>
                </div>
                <ProjectsForm
                  projects={data.projects}
                  onChange={(updated) => onUpdateData({ ...data, projects: updated })}
                />
              </div>
            )}

            {activeSection === 'certifications' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">Certifications & Licenses</h2>
                  <p className="text-xs text-slate-500">
                    Professional credentials, cloud certificates (AWS, Azure, GCP), Scrum, PMP, etc.
                  </p>
                </div>
                <CertificationsForm
                  certifications={data.certifications}
                  onChange={(updated) => onUpdateData({ ...data, certifications: updated })}
                />
              </div>
            )}

            {activeSection === 'additional' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="text-sm font-bold text-slate-900">Additional Sections</h2>
                  <p className="text-xs text-slate-500">
                    Honors, awards, spoken languages, volunteer experience, or publications.
                  </p>
                </div>
                <AdditionalSectionsForm
                  items={data.additional}
                  onChange={(updated) => onUpdateData({ ...data, additional: updated })}
                />
              </div>
            )}

            {/* Section Next / Prev Stepper Footer */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs font-semibold">
              {(() => {
                const currentIndex = sectionsList.findIndex((s) => s.id === activeSection);
                const prev = sectionsList[currentIndex - 1];
                const next = sectionsList[currentIndex + 1];

                return (
                  <>
                    {prev ? (
                      <button
                        type="button"
                        onClick={() => setActiveSection(prev.id)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg"
                      >
                        ← {prev.label}
                      </button>
                    ) : (
                      <div></div>
                    )}

                    {next ? (
                      <button
                        type="button"
                        onClick={() => setActiveSection(next.id)}
                        className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg"
                      >
                        Next: {next.label} →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onOpenExportModal}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                      >
                        Finish & Export PDF →
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Right Column: Live Resume Preview */}
        <div
          className={`w-full lg:w-1/2 flex flex-col bg-slate-100 ${
            mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <ResumePreviewContainer
            data={data}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onOpenExportModal={onOpenExportModal}
          />
        </div>
      </div>
    </div>
  );
};
