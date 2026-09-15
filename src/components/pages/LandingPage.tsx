import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, FileText, Zap, Eye, Download, Layout, HelpCircle } from 'lucide-react';
import { SAMPLE_DATA_SCIENTIST_RESUME } from '../../data/sampleResumes';
import { ResumeData, TemplateId } from '../../types';

interface LandingPageProps {
  onStartBuilding: () => void;
  onOpenLoadSampleModal: () => void;
  onSelectTemplate: (template: TemplateId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartBuilding,
  onOpenLoadSampleModal,
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>100% Free • No Login Required • ATS Optimized</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Build Your Resume.{' '}
          <span className="text-blue-700">Get Hired.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Create a professional ATS-friendly resume in minutes. Free to build, edit, preview, and download as clean vector PDF.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onStartBuilding}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-700/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            <span>Create My Resume</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onOpenLoadSampleModal}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-sm font-bold shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Load Sample Resume</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Zero Watermarks
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            No Account Needed
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Workday & Greenhouse Compatible
          </span>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for Top Applicant Tracking Systems
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Most creative resume templates fail ATS parsing due to columns, tables, and icons. Our templates follow proven ATS parsing standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">ATS-Friendly Layouts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard single-column hierarchy, clear section headings, and clean typographic spacing guaranteed to pass automated scanners.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Instant Live Preview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Watch your resume update in real-time as you type. Zoom in, adjust spacing, switch fonts, and check A4 page breaks effortlessly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Bullet & Summary Enhancer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transform basic duty descriptions into high-impact bullet points with action verbs and quantifiable results.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Free Vector PDF Export</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct high-resolution print-to-PDF export. Machine-readable selectable text with zero rasterization and zero hidden costs.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Private & Local Storage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your personal data stays strictly in your browser's LocalStorage. No user accounts, passwords, or tracking databases required.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Job Description Keyword Matcher</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paste target job requirements to instantly identify matched and missing keywords for tailored applications.
            </p>
          </div>
        </div>
      </section>

      {/* Template Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Three Battle-Tested ATS Templates
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Clean, structured, and recruiter-approved designs ready for any industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Template 1: Classic ATS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 transition-colors">
            <div className="space-y-3">
              <div className="h-44 bg-slate-100 rounded-xl border border-slate-200 p-3 overflow-hidden text-[9px] text-slate-600 font-sans space-y-1.5 pointer-events-none select-none">
                <div className="text-center font-bold text-slate-900 border-b border-slate-300 pb-1">
                  ALEX JOHNSON • SENIOR ENGINEER
                </div>
                <div className="font-bold uppercase text-slate-800 text-[8px] border-b border-slate-200">EXPERIENCE</div>
                <div className="flex justify-between font-bold"><span>Lead Engineer</span><span>2021-Present</span></div>
                <div className="text-slate-500">• Spearheaded cloud architecture migration</div>
                <div className="font-bold uppercase text-slate-800 text-[8px] border-b border-slate-200 pt-1">SKILLS</div>
                <div className="text-slate-600">Python, SQL, React, AWS, Docker</div>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Classic ATS (Standard)</h3>
              <p className="text-xs text-slate-600">
                The gold-standard high-contrast black-and-white layout. 100% parseable by every legacy and modern ATS engine.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectTemplate('classic');
                onStartBuilding();
              }}
              className="w-full py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold rounded-lg text-xs transition-colors"
            >
              Use Classic ATS
            </button>
          </div>

          {/* Template 2: Modern Professional */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 transition-colors">
            <div className="space-y-3">
              <div className="h-44 bg-slate-100 rounded-xl border border-slate-200 p-3 overflow-hidden text-[9px] text-slate-600 font-sans space-y-1.5 pointer-events-none select-none">
                <div className="border-b-2 border-blue-800 pb-1">
                  <div className="font-bold text-blue-900 text-[10px]">SARAH CHEN</div>
                  <div className="text-slate-600 text-[8px]">Software Engineer | San Francisco</div>
                </div>
                <div className="font-bold uppercase text-blue-800 text-[8px] border-b border-blue-200">EXPERIENCE</div>
                <div className="flex justify-between font-bold"><span>Senior Developer</span><span>2022-Present</span></div>
                <div className="text-slate-500">• Optimized distributed API microservices</div>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Modern Professional</h3>
              <p className="text-xs text-slate-600">
                Subtle navy blue accents with crisp typography dividers. Highly recommended for tech, finance, and consulting.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectTemplate('modern');
                onStartBuilding();
              }}
              className="w-full py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold rounded-lg text-xs transition-colors"
            >
              Use Modern Professional
            </button>
          </div>

          {/* Template 3: Executive */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 transition-colors">
            <div className="space-y-3">
              <div className="h-44 bg-slate-100 rounded-xl border border-slate-200 p-3 overflow-hidden text-[9px] text-slate-600 font-serif space-y-1.5 pointer-events-none select-none">
                <div className="text-center font-bold text-slate-900 border-b border-slate-300 pb-1">
                  MARCUS VANCE • VP OF ENGINEERING
                </div>
                <div className="font-bold uppercase text-slate-800 text-[8px] border-b border-slate-200">EXECUTIVE SUMMARY</div>
                <div className="text-slate-600 text-[8px] italic">Strategic technology leader with 10+ years experience...</div>
                <div className="font-bold uppercase text-slate-800 text-[8px] border-b border-slate-200 pt-1">EXPERIENCE</div>
                <div className="flex justify-between font-bold"><span>VP Engineering</span><span>2020-Present</span></div>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Executive Resume</h3>
              <p className="text-xs text-slate-600">
                Refined serif typography with centered header layout tailored for managers, directors, and senior leaders.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelectTemplate('executive');
                onStartBuilding();
              }}
              className="w-full py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold rounded-lg text-xs transition-colors"
            >
              Use Executive Resume
            </button>
          </div>
        </div>
      </section>

      {/* ATS Best Practices FAQ */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions & ATS Rules</h2>
          <p className="text-xs text-slate-600">How to guarantee your resume passes automated screening</p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Why are single-column resumes best for ATS?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Multi-column designs, tables, text boxes, and sidebars frequently cause ATS parsers (like Workday, Taleo, and Lever) to read text across columns left-to-right out of order, scrambling your job titles, dates, and bullet points. Single-column layouts guarantee linear reading order.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Should I use icons for phone, email, and location?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Standard text labels (e.g. Email: alex@example.com) or clean text rows separated by pipes (|) are safest. Some ATS parsers drop contact details completely when they are hidden inside icon elements.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Is this really 100% free with no hidden charges?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Yes! There are no paid tiers, no watermarks, no subscriptions, and no email sign-ups required. You can build, edit, and download your resume completely free forever.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-blue-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to build an interview-winning resume?
          </h2>
          <p className="text-blue-200 text-xs sm:text-sm max-w-xl mx-auto">
            Take the guesswork out of job applications. Build an ATS-optimized resume in under 10 minutes.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onStartBuilding}
              className="px-8 py-3.5 bg-white text-blue-950 hover:bg-blue-50 active:bg-blue-100 rounded-xl text-sm font-bold shadow-lg transition-all"
            >
              Start Building Now — Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
