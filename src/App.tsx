/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ResumeData, ResumeThemeSettings, TemplateId } from './types';
import { SAMPLE_DATA_SCIENTIST_RESUME, BLANK_RESUME } from './data/sampleResumes';
import { analyzeResumeATS, extractResumeRawText } from './utils/atsAnalyzer';
import { Navbar } from './components/navigation/Navbar';
import { LandingPage } from './components/pages/LandingPage';
import { ResumeBuilderView } from './components/builder/ResumeBuilderView';
import { TemplatesGallery } from './components/pages/TemplatesGallery';
import { ATSCheckerPanel } from './components/ats/ATSCheckerPanel';
import { AboutPrivacyPage } from './components/pages/AboutPrivacyPage';
import { ExportModal } from './components/modals/ExportModal';
import { LoadSampleConfirmModal } from './components/modals/LoadSampleConfirmModal';

const STORAGE_KEY_DATA = 'ats_resume_data_v1';
const STORAGE_KEY_SETTINGS = 'ats_resume_settings_v1';
const STORAGE_KEY_IS_SAMPLE = 'ats_resume_is_sample_v1';
const STORAGE_KEY_SAMPLE_NAME = 'ats_resume_sample_name_v1';

const DEFAULT_SETTINGS: ResumeThemeSettings = {
  template: 'classic',
  fontFamily: 'sans',
  fontSize: 'base',
  spacing: 'normal',
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'builder' | 'templates' | 'ats' | 'about'>('home');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLoadSampleModalOpen, setIsLoadSampleModalOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Sample data active tracking
  const [isSampleActive, setIsSampleActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_IS_SAMPLE) !== 'false';
    } catch {
      return true;
    }
  });

  const [activeSampleName, setActiveSampleName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SAMPLE_NAME) || 'Data Scientist (Alex Johnson)';
    } catch {
      return 'Data Scientist (Alex Johnson)';
    }
  });

  // Resume Data state with LocalStorage hydration
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.personalInfo) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return SAMPLE_DATA_SCIENTIST_RESUME;
  });

  // Settings State
  const [themeSettings, setThemeSettings] = useState<ResumeThemeSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.template) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(resumeData));
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(themeSettings));
      localStorage.setItem(STORAGE_KEY_IS_SAMPLE, String(isSampleActive));
      localStorage.setItem(STORAGE_KEY_SAMPLE_NAME, activeSampleName);
      setLastSaved(new Date());
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [resumeData, themeSettings, isSampleActive, activeSampleName]);

  // Live ATS Analysis calculation
  const atsAnalysis = useMemo(() => {
    return analyzeResumeATS(resumeData);
  }, [resumeData]);

  const rawResumeText = useMemo(() => {
    return extractResumeRawText(resumeData);
  }, [resumeData]);

  const hasExistingContent = useMemo(() => {
    return Boolean(
      (resumeData.personalInfo.fullName && resumeData.personalInfo.fullName.trim().length > 0) ||
      resumeData.experience.length > 0 ||
      resumeData.education.length > 0
    );
  }, [resumeData]);

  // Handlers
  const handleConfirmLoadSample = (sample: ResumeData, sampleName: string) => {
    setResumeData(sample);
    setIsSampleActive(true);
    setActiveSampleName(sampleName);
    setActiveTab('builder');
  };

  const handleClearResume = () => {
    setResumeData({
      ...BLANK_RESUME,
      id: 'resume-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsSampleActive(false);
  };

  const handlePurgeAllData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_DATA);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_IS_SAMPLE);
      localStorage.removeItem(STORAGE_KEY_SAMPLE_NAME);
      setResumeData(BLANK_RESUME);
      setThemeSettings(DEFAULT_SETTINGS);
      setIsSampleActive(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectTemplate = (templateId: TemplateId) => {
    setThemeSettings((prev) => ({ ...prev, template: templateId }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastSaved={lastSaved}
        onOpenLoadSampleModal={() => setIsLoadSampleModalOpen(true)}
        onClearResume={handleClearResume}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        atsScore={atsAnalysis.overallScore}
      />

      {/* Main Content Router */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <LandingPage
            onStartBuilding={() => setActiveTab('builder')}
            onOpenLoadSampleModal={() => setIsLoadSampleModalOpen(true)}
            onOpenAtsScanner={() => setActiveTab('ats')}
            onSelectTemplate={(t) => {
              handleSelectTemplate(t);
              setActiveTab('builder');
            }}
          />
        )}

        {activeTab === 'builder' && (
          <ResumeBuilderView
            data={resumeData}
            settings={themeSettings}
            analysis={atsAnalysis}
            onUpdateData={(updated) => {
              setResumeData(updated);
            }}
            onUpdateSettings={setThemeSettings}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenAtsTab={() => setActiveTab('ats')}
            onOpenLoadSampleModal={() => setIsLoadSampleModalOpen(true)}
            isSampleDataActive={isSampleActive}
            sampleName={activeSampleName}
            onClearToBlank={handleClearResume}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesGallery
            currentTemplate={themeSettings.template}
            onSelectTemplate={handleSelectTemplate}
            data={resumeData}
            settings={themeSettings}
            onGoToEditor={() => setActiveTab('builder')}
          />
        )}

        {activeTab === 'ats' && (
          <div className="max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">ATS Resume Scanner & Tailoring</h1>
                <p className="text-xs text-slate-500">
                  Comprehensive audit of machine-readability, structure, and keyword matching.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('builder')}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
              >
                Back to Editor
              </button>
            </div>
            <ATSCheckerPanel
              analysis={atsAnalysis}
              resumeRawText={rawResumeText}
              onImportResume={(imported) => {
                setResumeData(imported);
                setIsSampleActive(false);
              }}
              onGoToEditor={() => setActiveTab('builder')}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <AboutPrivacyPage onPurgeAllData={handlePurgeAllData} />
        )}
      </main>

      {/* Export & Download Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={resumeData}
        onImportData={(imported) => {
          setResumeData(imported);
          setIsSampleActive(false);
          setActiveTab('builder');
        }}
      />

      {/* Load Sample Resume Confirmation Modal */}
      <LoadSampleConfirmModal
        isOpen={isLoadSampleModalOpen}
        onClose={() => setIsLoadSampleModalOpen(false)}
        onConfirmLoad={handleConfirmLoadSample}
        hasExistingContent={hasExistingContent}
      />
    </div>
  );
}
