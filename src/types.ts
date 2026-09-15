export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  github: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startYear: string;
  graduationYear: string;
  gpa: string;
  coursework: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  technologies: string;
  description: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  url: string;
}

export interface AdditionalItem {
  id: string;
  type: 'award' | 'language' | 'volunteer' | 'publication' | 'interest';
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  additional: AdditionalItem[];
}

export type TemplateId = 'classic' | 'modern' | 'executive';
export type FontSizeOption = 'sm' | 'base' | 'lg';
export type SpacingOption = 'compact' | 'normal' | 'relaxed';
export type FontFamilyOption = 'sans' | 'serif' | 'garamond' | 'merriweather';

export interface ResumeThemeSettings {
  template: TemplateId;
  fontSize: FontSizeOption;
  spacing: SpacingOption;
  fontFamily: FontFamilyOption;
}

export interface ATSIssue {
  id: string;
  type: 'critical' | 'warning' | 'success';
  section: string;
  title: string;
  message: string;
  tip?: string;
}

export interface ATSAnalysis {
  overallScore: number;
  contactScore: number;
  summaryScore: number;
  experienceScore: number;
  educationScore: number;
  skillsScore: number;
  actionVerbsScore: number;
  metricsScore: number;
  actionVerbsFound: string[];
  metricsFound: string[];
  issues: ATSIssue[];
  wordCount: number;
  estimatedPages: number;
}

export interface JobMatchResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}
