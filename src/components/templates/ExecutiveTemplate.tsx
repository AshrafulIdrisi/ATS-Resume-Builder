import React from 'react';
import { ResumeData, ResumeThemeSettings } from '../../types';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeThemeSettings;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  const { personalInfo, summary, experience, education, skillCategories, projects, certifications, additional } = data;

  const fontClass =
    settings.fontFamily === 'sans'
      ? 'font-["Source_Sans_3",sans-serif]'
      : settings.fontFamily === 'merriweather'
      ? 'font-["Merriweather",serif]'
      : 'font-["EB_Garamond",serif]';

  const spacingClass =
    settings.spacing === 'compact'
      ? 'space-y-3 text-xs leading-tight'
      : settings.spacing === 'relaxed'
      ? 'space-y-5 text-sm leading-relaxed'
      : 'space-y-4 text-[13px] leading-normal';

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin ? personalInfo.linkedin.replace(/^https?:\/\//, '') : '',
    personalInfo.portfolio ? personalInfo.portfolio.replace(/^https?:\/\//, '') : '',
  ].filter(Boolean);

  return (
    <div
      id="resume-printable-area"
      className={`w-full bg-white text-zinc-900 ${fontClass} ${spacingClass} p-8 sm:p-12 select-text`}
      style={{ minHeight: '100%' }}
    >
      {/* Executive Header */}
      <header className="text-center pb-3 border-b border-zinc-400">
        <h1 className="text-2xl sm:text-3xl font-normal tracking-wide uppercase text-zinc-950 font-serif">
          {personalInfo.fullName || 'YOUR FULL NAME'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-xs sm:text-sm font-sans uppercase tracking-widest text-zinc-700 mt-1 font-medium">
            {personalInfo.jobTitle}
          </p>
        )}
        {contactItems.length > 0 && (
          <div className="text-[11px] sm:text-xs text-zinc-600 mt-2 flex flex-wrap justify-center items-center gap-x-3 gap-y-1 font-sans">
            {contactItems.map((item, index) => (
              <React.Fragment key={index}>
                <span>{item}</span>
                {index < contactItems.length - 1 && <span className="text-zinc-400">|</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* Executive Summary */}
      {summary.trim() && (
        <section>
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
            EXECUTIVE PROFILE
          </h2>
          <p className="text-justify text-zinc-800 leading-relaxed italic">{summary}</p>
        </section>
      )}

      {/* Leadership / Work Experience */}
      {experience.length > 0 && (
        <section>
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2.5">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-serif font-bold text-zinc-950 text-[14px]">
                  <span>{exp.jobTitle || 'Executive Title'}</span>
                  <span className="font-sans text-[11px] font-normal text-zinc-600">
                    {exp.startDate} {exp.startDate && (exp.current ? '– Present' : exp.endDate ? `– ${exp.endDate}` : '')}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-zinc-700 mb-1 font-sans font-medium">
                  <span className="text-zinc-900">{exp.company || 'Organization Name'}</span>
                  {exp.location && <span className="text-[11px] text-zinc-500">{exp.location}</span>}
                </div>
                {exp.description && <p className="text-xs text-zinc-700 mb-1">{exp.description}</p>}
                {exp.bullets && exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-zinc-800">
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

      {/* Areas of Expertise / Skills */}
      {skillCategories.some((cat) => cat.skills && cat.skills.length > 0) && (
        <section>
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
            AREAS OF EXPERTISE & CORE CAPABILITIES
          </h2>
          <div className="space-y-1 font-sans">
            {skillCategories
              .filter((cat) => cat.skills && cat.skills.length > 0)
              .map((cat) => (
                <p key={cat.id} className="text-xs">
                  <span className="font-bold text-zinc-900">{cat.name}:</span>{' '}
                  <span className="text-zinc-800">{cat.skills.join(', ')}</span>
                </p>
              ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">
            EDUCATION & CREDENTIALS
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-serif font-bold text-zinc-950">
                  <span>{edu.degree || 'Degree Program'}</span>
                  <span className="font-sans text-[11px] font-normal text-zinc-600">
                    {edu.startYear} {edu.startYear && edu.graduationYear ? `– ${edu.graduationYear}` : edu.graduationYear}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-zinc-700 font-sans">
                  <span>{edu.school || 'University Name'}</span>
                  {edu.location && <span className="text-[11px] text-zinc-500">{edu.location}</span>}
                </div>
                {edu.coursework && (
                  <p className="text-[11px] text-zinc-600 mt-0.5 font-sans">
                    <span className="font-semibold">Relevant Focus:</span> {edu.coursework}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2">
            NOTABLE INITIATIVES & VENTURES
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-bold font-serif text-zinc-900">
                  <span>{proj.name}</span>
                  {proj.link && (
                    <span className="font-sans text-[11px] font-normal text-zinc-600">
                      {proj.link.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[11px] text-zinc-700 font-sans mb-0.5">
                    <span className="font-semibold">Core Framework:</span> {proj.technologies}
                  </p>
                )}
                {proj.bullets && proj.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-zinc-800 text-xs">
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

      {/* Certifications & Additional */}
      {(certifications.length > 0 || additional.length > 0) && (
        <section>
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
            HONORS & PROFESSIONAL AFFILIATIONS
          </h2>
          <div className="space-y-1 font-sans text-xs text-zinc-800">
            {certifications.map((cert) => (
              <p key={cert.id}>
                <span className="font-semibold">{cert.name}</span> – {cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ''}
              </p>
            ))}
            {additional.map((item) => (
              <p key={item.id}>
                <span className="font-semibold capitalize">{item.type}:</span> {item.title}{' '}
                {item.subtitle ? `– ${item.subtitle}` : ''} {item.date ? `(${item.date})` : ''}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
