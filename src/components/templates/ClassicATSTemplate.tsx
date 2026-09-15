import React from 'react';
import { ResumeData, ResumeThemeSettings } from '../../types';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeThemeSettings;
}

export const ClassicATSTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
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
      className={`w-full bg-white text-black ${fontClass} ${spacingClass} p-8 sm:p-10 select-text`}
      style={{ minHeight: '100%' }}
    >
      {/* Header */}
      <header className="text-center pb-2 border-b border-black">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-black">
          {personalInfo.fullName || 'YOUR FULL NAME'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-sm font-semibold tracking-wider uppercase mt-0.5 text-gray-800">
            {personalInfo.jobTitle}
          </p>
        )}
        {contactItems.length > 0 && (
          <p className="text-[11px] sm:text-xs text-gray-800 mt-1.5 flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5">
            {contactItems.map((item, index) => (
              <React.Fragment key={index}>
                <span>{item}</span>
                {index < contactItems.length - 1 && <span className="text-gray-500">•</span>}
              </React.Fragment>
            ))}
          </p>
        )}
      </header>

      {/* Professional Summary */}
      {summary.trim() && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-justify text-gray-900">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="text-left">
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span>{exp.jobTitle || 'Job Title'}</span>
                  <span className="text-[11px] font-normal text-gray-700">
                    {exp.startDate} {exp.startDate && (exp.current ? '– Present' : exp.endDate ? `– ${exp.endDate}` : '')}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs italic text-gray-800 mb-1">
                  <span>{exp.company || 'Company Name'}</span>
                  {exp.location && <span className="not-italic text-[11px]">{exp.location}</span>}
                </div>
                {exp.description && <p className="text-xs text-gray-800 mb-1">{exp.description}</p>}
                {exp.bullets && exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-gray-900">
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
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            EDUCATION
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span>{edu.school || 'University / Institution'}</span>
                  <span className="text-[11px] font-normal text-gray-700">
                    {edu.startYear} {edu.startYear && edu.graduationYear ? `– ${edu.graduationYear}` : edu.graduationYear}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-gray-800">
                  <span className="italic">{edu.degree || 'Degree Program'}</span>
                  {edu.location && <span className="text-[11px]">{edu.location}</span>}
                </div>
                {edu.gpa && <p className="text-[11px] text-gray-700 mt-0.5">GPA / Grade: {edu.gpa}</p>}
                {edu.coursework && (
                  <p className="text-[11px] text-gray-700 mt-0.5">
                    <span className="font-semibold">Relevant Coursework:</span> {edu.coursework}
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
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            SKILLS & COMPETENCIES
          </h2>
          <div className="space-y-1">
            {skillCategories
              .filter((cat) => cat.skills && cat.skills.length > 0)
              .map((cat) => (
                <p key={cat.id} className="text-xs">
                  <span className="font-bold text-gray-900">{cat.name}:</span>{' '}
                  <span className="text-gray-800">{cat.skills.join(', ')}</span>
                </p>
              ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2">
            KEY PROJECTS
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span>{proj.name}</span>
                  {proj.link && (
                    <span className="text-[11px] font-normal text-gray-600">
                      {proj.link.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[11px] text-gray-700 italic mb-0.5">
                    <span className="font-semibold not-italic">Tech Stack:</span> {proj.technologies}
                  </p>
                )}
                {proj.description && <p className="text-xs text-gray-800 mb-0.5">{proj.description}</p>}
                {proj.bullets && proj.bullets.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-900 text-xs">
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
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            CERTIFICATIONS & CREDENTIALS
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-gray-900">
            {certifications.map((cert) => (
              <li key={cert.id} className="pl-1">
                <span className="font-bold">{cert.name}</span>
                {cert.issuer && <span> – {cert.issuer}</span>}
                {cert.issueDate && <span className="text-gray-600"> ({cert.issueDate})</span>}
                {cert.url && <span className="text-[11px] text-gray-500"> [{cert.url.replace(/^https?:\/\//, '')}]</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Additional Sections (Awards, Languages, etc) */}
      {additional.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5">
            ADDITIONAL INFORMATION
          </h2>
          <div className="space-y-1.5 text-xs text-gray-900">
            {additional.map((item) => (
              <div key={item.id}>
                <span className="font-bold capitalize">{item.type}: </span>
                <span>{item.title}</span>
                {item.subtitle && <span className="text-gray-700"> – {item.subtitle}</span>}
                {item.date && <span className="text-gray-500"> ({item.date})</span>}
                {item.description && <p className="text-gray-700 mt-0.5">{item.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
