import { ResumeData, ATSAnalysis } from '../types';
import { analyzeResume } from './atsAnalyzer';

export interface FileFormatAudit {
  isSingleColumn?: boolean;
  hasTablesOrGraphics?: boolean;
  hasStandardHeadings?: boolean;
  contactInfoInHeaderFooter?: boolean;
  atsRiskRating?: 'Low' | 'Medium' | 'High';
  structuralHighlights?: string[];
  criticalFixes?: string[];
}

export interface UploadedResumeScanResult {
  fileName: string;
  fileSize: number;
  mimeType: string;
  extractedRawText: string;
  resumeData: ResumeData;
  analysis: ATSAnalysis;
  fileFormatAudit?: FileFormatAudit;
  scanTimestamp: string;
}

/**
 * Reads a browser File object as Base64 data URL
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Reads a browser File object as plain UTF-8 text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}

/**
 * Basic client-side text extractor / heuristic parser for offline fallback
 */
export function parseClientTextToResume(rawText: string, _fileName: string): ResumeData {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  // Extract emails and phones
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);

  const fullName = lines[0] && lines[0].length < 40 ? lines[0] : 'Candidate';
  const jobTitle = lines[1] && lines[1].length < 50 && !lines[1].includes('@') ? lines[1] : 'Professional';

  // Extract skills from lines mentioning skills
  const skillsList: string[] = [];
  const skillKeywords = ['python', 'javascript', 'typescript', 'react', 'sql', 'node.js', 'aws', 'docker', 'git', 'excel', 'c++', 'java', 'html', 'css', 'data analysis', 'machine learning', 'project management'];
  skillKeywords.forEach((kw) => {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(rawText)) {
      skillsList.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  });

  // Basic experience placeholder extraction from bullets or lines
  const bullets = lines.filter((l) => /^[•\-\*]/.test(l) || /^[A-Z][a-z]+ed\b/.test(l)).slice(0, 5);

  return {
    personalInfo: {
      fullName: fullName,
      jobTitle: jobTitle,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      location: '',
      linkedin: linkedinMatch ? linkedinMatch[0] : '',
      portfolio: '',
      github: githubMatch ? githubMatch[0] : '',
    },
    summary: lines.find((l) => l.length > 50 && !l.includes('@')) || '',
    experience: [
      {
        id: 'exp-uploaded-1',
        jobTitle: jobTitle || 'Professional Role',
        company: 'Previous Company',
        location: '',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        description: '',
        bullets: bullets.length > 0 ? bullets.map((b) => b.replace(/^[•\-\*]\s*/, '')) : ['Delivered key business deliverables and optimized core operations.'],
      },
    ],
    education: [
      {
        id: 'edu-uploaded-1',
        degree: 'Bachelor Degree',
        school: 'University',
        location: '',
        startYear: '',
        graduationYear: '2020',
        gpa: '',
        coursework: '',
      },
    ],
    skillCategories: [
      {
        id: 'sk-uploaded-1',
        name: 'Core Competencies & Tools',
        skills: skillsList.length > 0 ? skillsList : ['Problem Solving', 'Data Analysis', 'Communication', 'Project Execution'],
      },
    ],
    projects: [],
    certifications: [],
    additional: [],
  };
}

/**
 * Main function: parses an uploaded resume file via AI service or client fallback
 */
export async function parseAndAuditUploadedResume(file: File): Promise<UploadedResumeScanResult> {
  const fileName = file.name;
  const fileSize = file.size;
  const mimeType = file.type || 'application/octet-stream';

  let base64Data = '';
  let rawText = '';

  try {
    base64Data = await readFileAsBase64(file);
  } catch (e) {
    console.warn('Could not read file as base64:', e);
  }

  if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.md')) {
    try {
      rawText = await readFileAsText(file);
    } catch (e) {
      console.warn('Could not read file as text:', e);
    }
  }

  // Handle direct JSON import
  if (file.name.endsWith('.json') && rawText) {
    try {
      const parsedJson = JSON.parse(rawText);
      if (parsedJson.personalInfo) {
        const fullResume: ResumeData = {
          personalInfo: {
            fullName: parsedJson.personalInfo.fullName || '',
            jobTitle: parsedJson.personalInfo.jobTitle || '',
            email: parsedJson.personalInfo.email || '',
            phone: parsedJson.personalInfo.phone || '',
            location: parsedJson.personalInfo.location || '',
            linkedin: parsedJson.personalInfo.linkedin || '',
            portfolio: parsedJson.personalInfo.portfolio || '',
            github: parsedJson.personalInfo.github || '',
          },
          summary: parsedJson.summary || '',
          experience: (parsedJson.experience || []).map((e: any, i: number) => ({
            id: e.id || `exp-json-${i}`,
            jobTitle: e.jobTitle || '',
            company: e.company || '',
            location: e.location || '',
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            current: Boolean(e.current),
            description: e.description || '',
            bullets: Array.isArray(e.bullets) ? e.bullets : [],
          })),
          education: (parsedJson.education || []).map((ed: any, i: number) => ({
            id: ed.id || `edu-json-${i}`,
            degree: ed.degree || '',
            school: ed.school || ed.institution || '',
            location: ed.location || '',
            startYear: ed.startYear || '',
            graduationYear: ed.graduationYear || '',
            gpa: ed.gpa || '',
            coursework: ed.coursework || '',
          })),
          skillCategories: (parsedJson.skillCategories || parsedJson.skills || []).map((s: any, i: number) => ({
            id: s.id || `sk-json-${i}`,
            name: s.name || s.category || 'Skills',
            skills: Array.isArray(s.skills) ? s.skills : [],
          })),
          projects: (parsedJson.projects || []).map((p: any, i: number) => ({
            id: p.id || `proj-json-${i}`,
            name: p.name || '',
            link: p.link || '',
            description: p.description || '',
            technologies: typeof p.technologies === 'string' ? p.technologies : Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
            bullets: Array.isArray(p.bullets) ? p.bullets : [],
          })),
          certifications: (parsedJson.certifications || []).map((c: any, i: number) => ({
            id: c.id || `cert-json-${i}`,
            name: c.name || '',
            issuer: c.issuer || '',
            issueDate: c.issueDate || c.date || '',
            url: c.url || '',
          })),
          additional: parsedJson.additional || [],
        };

        const analysis = analyzeResume(fullResume);
        return {
          fileName,
          fileSize,
          mimeType,
          extractedRawText: rawText,
          resumeData: fullResume,
          analysis,
          fileFormatAudit: {
            isSingleColumn: true,
            hasTablesOrGraphics: false,
            hasStandardHeadings: true,
            contactInfoInHeaderFooter: false,
            atsRiskRating: 'Low',
            structuralHighlights: ['Direct clean ATS JSON schema format parsed successfully.'],
          },
          scanTimestamp: new Date().toLocaleTimeString(),
        };
      }
    } catch {
      // Continue to AI parsing
    }
  }

  // Call Server-Side Gemini API Parser
  try {
    const res = await fetch('/api/ai/parse-resume-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileBase64: base64Data,
        mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain'),
        fileName,
        rawText,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.personalInfo || data.extractedRawText) {
        const structuredResume: ResumeData = {
          personalInfo: {
            fullName: data.personalInfo?.fullName || 'Candidate',
            jobTitle: data.personalInfo?.jobTitle || '',
            email: data.personalInfo?.email || '',
            phone: data.personalInfo?.phone || '',
            location: data.personalInfo?.location || '',
            linkedin: data.personalInfo?.linkedin || '',
            portfolio: data.personalInfo?.portfolio || data.personalInfo?.website || '',
            github: data.personalInfo?.github || '',
          },
          summary: data.summary || '',
          experience: (data.experience || []).map((exp: any, i: number) => ({
            id: `exp-parsed-${i}-${Date.now()}`,
            jobTitle: exp.jobTitle || 'Role',
            company: exp.company || 'Company',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: Boolean(exp.current),
            description: exp.description || '',
            bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
          })),
          education: (data.education || []).map((edu: any, i: number) => ({
            id: `edu-parsed-${i}-${Date.now()}`,
            degree: edu.degree || 'Degree',
            school: edu.school || edu.institution || 'University',
            location: edu.location || '',
            startYear: edu.startYear || '',
            graduationYear: edu.graduationYear || '',
            gpa: edu.gpa || '',
            coursework: edu.coursework || '',
          })),
          skillCategories: (data.skills || []).map((sk: any, i: number) => ({
            id: `sk-parsed-${i}-${Date.now()}`,
            name: sk.name || sk.category || 'Skills',
            skills: Array.isArray(sk.skills) ? sk.skills : [],
          })),
          projects: (data.projects || []).map((proj: any, i: number) => ({
            id: `proj-parsed-${i}-${Date.now()}`,
            name: proj.name || 'Project',
            link: proj.link || '',
            description: proj.description || '',
            technologies: typeof proj.technologies === 'string' ? proj.technologies : Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
            bullets: Array.isArray(proj.bullets) ? proj.bullets : [],
          })),
          certifications: (data.certifications || []).map((c: any, i: number) => ({
            id: `cert-parsed-${i}-${Date.now()}`,
            name: c.name || '',
            issuer: c.issuer || '',
            issueDate: c.issueDate || c.date || '',
            url: c.url || '',
          })),
          additional: [],
        };

        const analysis = analyzeResume(structuredResume);
        return {
          fileName,
          fileSize,
          mimeType,
          extractedRawText: data.extractedRawText || rawText || 'Extracted resume content',
          resumeData: structuredResume,
          analysis,
          fileFormatAudit: data.fileFormatAudit || {
            isSingleColumn: true,
            hasTablesOrGraphics: false,
            hasStandardHeadings: true,
            contactInfoInHeaderFooter: false,
            atsRiskRating: 'Low',
            structuralHighlights: ['Document parsed into standard ATS hierarchy.'],
          },
          scanTimestamp: new Date().toLocaleTimeString(),
        };
      }
    }
  } catch (err) {
    console.warn('AI Parsing call failed, falling back to local extractor:', err);
  }

  // Fallback if network or AI unavailable
  const fallbackResume = parseClientTextToResume(rawText || fileName, fileName);
  const fallbackAnalysis = analyzeResume(fallbackResume);

  return {
    fileName,
    fileSize,
    mimeType,
    extractedRawText: rawText || `Resume extracted from ${fileName}`,
    resumeData: fallbackResume,
    analysis: fallbackAnalysis,
    fileFormatAudit: {
      isSingleColumn: true,
      hasTablesOrGraphics: false,
      hasStandardHeadings: true,
      contactInfoInHeaderFooter: false,
      atsRiskRating: 'Medium',
      structuralHighlights: ['Parsed with standard offline heuristic parser.'],
      criticalFixes: ['Consider verifying all extracted bullet points and dates.'],
    },
    scanTimestamp: new Date().toLocaleTimeString(),
  };
}
