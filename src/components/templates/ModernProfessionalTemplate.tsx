import React from 'react';
import { ResumeData, ResumeThemeSettings } from '../../types';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeThemeSettings;
}

export const ModernProfessionalTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  const { personalInfo, summary, experience, education, skillCategories, projects, certifications, additional } = data;

  const fontClass =
    settings.fontFamily === 'garamond'
      ? 'font-["EB_Garamond",serif]'
      : settings.fontFamily === 'merriweather'
      ? 'font-["Merriweather",serif]'
      : settings.fontFamily === 'serif'
      ? 'font-serif'
      : 'font-["Source_Sans_3",sans-serif]';

  const spacingClass =
    settings.spacing === 'compact'
      ? 'space-y-3 text-xs leading-tight'
      : settings.spacing === 'relaxed'
      ? 'space-y-5 text-sm leading-relaxed'
      : 'space-y-4 text-xs sm:text-[13px] leading-normal';

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin ? personalInfo.linkedin.replace(/^https?:\/\//, '') : '',
    personalInfo.portfolio ? personalInfo.portfolio.replace(/^https?:\/\//, '') : '',
    personalInfo.github ? personalInfo.github.replace(/^https?:\/\//, '') : '',
  ].filter(Boolean);

  return (
    <div
      id="resume-printable-area"
      className={`w-full bg-white text-slate-900 ${fontClass} ${spacingClass} p-8 sm:p-10 select-text`}
      style={{ minHeight: '100%' }}
    >
      {/* Header */}
      <header className="pb-3 border-b-2 border-slate-700">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {personalInfo.fullName || 'YOUR FULL NAME'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-sm font-semibold tracking-wide text-blue-900 mt-0.5">
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          {contactItems.length > 0 && (
            <div className="text-right text-[11px] sm:text-xs text-slate-700 flex flex-wrap sm:flex-col sm:items-end gap-x-2 gap-y-0.5">
              {contactItems.map((item, index) => (
                <span key={index} className="whitespace-nowrap">
                  {item}
                  {index < contactItems.length - 1 && <span className="sm:hidden ml-2 text-slate-400">•</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {summary.trim() && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-1.5 flex items-center justify-between">
            <span>PROFESSIONAL SUMMARY</span>
          </h2>
          <p className="text-slate-800 text-justify">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-2.5">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{exp.jobTitle || 'Job Title'}</span>
                  <span className="text-[11px] font-medium text-slate-600">
                    {exp.startDate} {exp.startDate && (exp.current ? '– Present' : exp.endDate ? `– ${exp.endDate}` : '')}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-slate-700 mb-1">
                  <span className="font-semibold text-blue-900">{exp.company || 'Company Name'}</span>
                  {exp.location && <span className="text-[11px] text-slate-500">{exp.location}</span>}
                </div>
                {exp.description && <p className="text-xs text-slate-700 mb-1">{exp.description}</p>}
                {exp.bullets && exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800">
                    {exp.bullets.filter(Boolean).map((bullet, idx) => (
                      <li key={idx} className="pl-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-2">
            EDUCATION
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{edu.degree || 'Degree Program'}</span>
                  <span className="text-[11px] font-medium text-slate-600">
                    {edu.startYear} {edu.startYear && edu.graduationYear ? `– ${edu.graduationYear}` : edu.graduationYear}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-slate-700">
                  <span className="text-blue-900 font-semibold">{edu.school || 'University / Institution'}</span>
                  {edu.location && <span className="text-[11px] text-slate-500">{edu.location}</span>}
                </div>
                {edu.gpa && <p className="text-[11px] text-slate-600 mt-0.5">GPA: {edu.gpa}</p>}
                {edu.coursework && (
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    <span className="font-semibold text-slate-700">Relevant Coursework:</span> {edu.coursework}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillCategories.some((cat) => cat.skills && cat.skills.length > 0) && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-1.5">
            SKILLS & TECHNOLOGIES
          </h2>
          <div className="space-y-1">
            {skillCategories
              .filter((cat) => cat.skills && cat.skills.length > 0)
              .map((cat) => (
                <p key={cat.id} className="text-xs">
                  <span className="font-bold text-slate-900">{cat.name}:</span>{' '}
                  <span className="text-slate-800">{cat.skills.join(' • ')}</span>
                </p>
              ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-2">
            PROJECTS
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{proj.name}</span>
                  {proj.link && (
                    <span className="text-[11px] font-normal text-blue-800 underline">
                      {proj.link.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[11px] text-slate-700 mb-0.5">
                    <span className="font-semibold">Technologies:</span> {proj.technologies}
                  </p>
                )}
                {proj.description && <p className="text-xs text-slate-700 mb-0.5">{proj.description}</p>}
                {proj.bullets && proj.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-800 text-xs">
                    {proj.bullets.filter(Boolean).map((bullet, idx) => (
                      <li key={idx} className="pl-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-1.5">
            CERTIFICATIONS
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-800">
            {certifications.map((cert) => (
              <li key={cert.id} className="pl-1">
                <span className="font-semibold text-slate-900">{cert.name}</span>
                {cert.issuer && <span> | {cert.issuer}</span>}
                {cert.issueDate && <span className="text-slate-500"> ({cert.issueDate})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Additional */}
      {additional.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 border-b border-slate-300 pb-1 mb-1.5">
            ADDITIONAL
          </h2>
          <div className="space-y-1 text-xs text-slate-800">
            {additional.map((item) => (
              <div key={item.id}>
                <span className="font-semibold text-slate-900 capitalize">{item.type}: </span>
                <span>{item.title}</span>
                {item.subtitle && <span className="text-slate-600"> – {item.subtitle}</span>}
                {item.date && <span className="text-slate-500"> ({item.date})</span>}
                {item.description && <p className="text-slate-700 mt-0.5">{item.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
