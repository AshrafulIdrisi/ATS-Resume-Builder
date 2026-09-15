import React from 'react';
import { ResumeData, ResumeThemeSettings } from '../../types';
import { ClassicATSTemplate } from './ClassicATSTemplate';
import { ModernProfessionalTemplate } from './ModernProfessionalTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';

interface ResumeDocumentProps {
  data: ResumeData;
  settings: ResumeThemeSettings;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({ data, settings }) => {
  switch (settings.template) {
    case 'modern':
      return <ModernProfessionalTemplate data={data} settings={settings} />;
    case 'executive':
      return <ExecutiveTemplate data={data} settings={settings} />;
    case 'classic':
    default:
      return <ClassicATSTemplate data={data} settings={settings} />;
  }
};
