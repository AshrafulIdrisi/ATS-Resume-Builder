import { ResumeData, ATSAnalysis, ATSIssue, JobMatchResult } from '../types';

export const ACTION_VERBS = [
  // Leadership & Management
  'spearheaded', 'orchestrated', 'championed', 'directed', 'managed', 'supervised', 'mentored', 'guided', 'cultivated', 'fostered', 'facilitated', 'negotiated',
  // Technical & Engineering
  'architected', 'engineered', 'developed', 'programmed', 'designed', 'deployed', 'configured', 'debugged', 'refactored', 'integrated', 'automated', 'migrated',
  // Innovation & Growth
  'pioneered', 'innovated', 'initiated', 'conceptualized', 'formulated', 'devised', 'created', 'launched', 'established', 'introduced',
  // Optimization & Analytics
  'optimized', 'accelerated', 'streamlined', 'maximized', 'minimized', 'reduced', 'increased', 'boosted', 'analyzed', 'evaluated', 'modeled', 'forecasted', 'audited', 'diagnosed',
  // Delivery & Execution
  'executed', 'delivered', 'implemented', 'administered', 'coordinated', 'published', 'authored', 'maintained', 'strengthened', 'resolved', 'achieved'
];

export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do',
  'does', 'doing', 'don', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you',
  'your', 'yours', 'yourself', 'yourselves', 'will', 'must', 'experience', 'responsible', 'duties', 'work',
  'looking', 'role', 'team', 'company', 'candidate', 'ability', 'strong', 'demonstrated', 'including'
]);

// Metric detection regex pattern: % changes, $ dollar amounts, k/M numbers, quantifiable counts
export const METRIC_REGEX = /(\b\d+(\.\d+)?%|\$\d+(\.\d+)?[kKmMbB]?|\b\d+[kKmMbB]\b|\b\d+\+\s*(years|users|clients|projects|accounts|teams|engineers|models)|\b\d+x\b|\breduced\s+by\s+\d+|\bincreased\s+by\s+\d+|\bcut\s+\d+|\bsaved\s+\$\d+)/i;

export function analyzeResume(resume: ResumeData): ATSAnalysis {
  const issues: ATSIssue[] = [];
  let contactScore = 0;
  let summaryScore = 0;
  let experienceScore = 0;
  let educationScore = 0;
  let skillsScore = 0;
  let actionVerbsScore = 0;
  let metricsScore = 0;

  // 1. Contact Info Assessment (20 pts max)
  const pi = resume.personalInfo;
  if (pi.fullName.trim()) contactScore += 5;
  else {
    issues.push({
      id: 'missing-name',
      type: 'critical',
      section: 'Personal Info',
      title: 'Missing Full Name',
      message: 'ATS scanners require a clear candidate name at the top of the document.',
    });
  }

  if (pi.jobTitle.trim()) contactScore += 3;
  else {
    issues.push({
      id: 'missing-title',
      type: 'warning',
      section: 'Personal Info',
      title: 'Missing Professional Target Title',
      message: 'Include a target professional title that matches your target role.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (pi.email.trim() && emailRegex.test(pi.email.trim())) {
    contactScore += 4;
  } else {
    issues.push({
      id: 'missing-email',
      type: 'critical',
      section: 'Personal Info',
      title: 'Missing or Invalid Email',
      message: 'Provide a valid professional email address.',
    });
  }

  if (pi.phone.trim()) contactScore += 4;
  else {
    issues.push({
      id: 'missing-phone',
      type: 'warning',
      section: 'Personal Info',
      title: 'Missing Phone Number',
      message: 'Recruiters and ATS parsers use phone numbers for verification and contact.',
    });
  }

  if (pi.location.trim()) contactScore += 2;
  if (pi.linkedin.trim() || pi.github.trim() || pi.portfolio.trim()) contactScore += 2;

  // 2. Professional Summary Assessment (15 pts max)
  const summaryWords = resume.summary.trim() ? resume.summary.trim().split(/\s+/).length : 0;
  if (summaryWords >= 30 && summaryWords <= 100) {
    summaryScore = 15;
  } else if (summaryWords > 0 && summaryWords < 30) {
    summaryScore = 8;
    issues.push({
      id: 'summary-too-short',
      type: 'warning',
      section: 'Summary',
      title: 'Summary is Brief',
      message: `Your summary is ${summaryWords} words. Aim for 40–80 words highlighting your core domain expertise and impact.`,
    });
  } else if (summaryWords > 100) {
    summaryScore = 10;
    issues.push({
      id: 'summary-too-long',
      type: 'warning',
      section: 'Summary',
      title: 'Summary is too Long',
      message: 'Keep your executive summary tight (3–5 sentences) so recruiters can scan quickly.',
    });
  } else {
    summaryScore = 0;
    issues.push({
      id: 'missing-summary',
      type: 'critical',
      section: 'Summary',
      title: 'Missing Professional Summary',
      message: 'An ATS-optimized summary primes the scanner with your top job-relevant keywords.',
    });
  }

  // 3. Work Experience Assessment (25 pts max)
  if (resume.experience.length > 0) {
    let totalBullets = 0;
    resume.experience.forEach((exp) => {
      totalBullets += (exp.bullets || []).filter((b) => b.trim().length > 0).length;
    });

    if (totalBullets >= 4) {
      experienceScore = 25;
    } else if (totalBullets >= 1) {
      experienceScore = 15;
      issues.push({
        id: 'few-bullets',
        type: 'warning',
        section: 'Experience',
        title: 'Limited Bullet Points',
        message: 'Add 2–4 detailed bullet points per work experience detailing your accomplishments.',
      });
    } else {
      experienceScore = 8;
      issues.push({
        id: 'missing-bullets',
        type: 'critical',
        section: 'Experience',
        title: 'No Bullet Points in Experience',
        message: 'ATS algorithms heavily weigh bulleted statements over plain paragraphs.',
      });
    }
  } else {
    experienceScore = 0;
    issues.push({
      id: 'missing-experience',
      type: 'critical',
      section: 'Experience',
      title: 'No Work Experience Added',
      message: 'Add past work, internships, contract roles, or freelance experience.',
    });
  }

  // 4. Education Assessment (10 pts max)
  if (resume.education.length > 0) {
    const hasDegree = resume.education.some((e) => e.degree.trim() && e.school.trim());
    if (hasDegree) {
      educationScore = 10;
    } else {
      educationScore = 5;
      issues.push({
        id: 'incomplete-education',
        type: 'warning',
        section: 'Education',
        title: 'Incomplete Education Entry',
        message: 'Ensure degree name and university/institution are both specified.',
      });
    }
  } else {
    educationScore = 0;
    issues.push({
      id: 'missing-education',
      type: 'warning',
      section: 'Education',
      title: 'No Education Listed',
      message: 'Most ATS algorithms filter by education requirements.',
    });
  }

  // 5. Skills Assessment (15 pts max)
  const allSkills: string[] = [];
  resume.skillCategories.forEach((cat) => {
    (cat.skills || []).forEach((s) => {
      if (s.trim()) allSkills.push(s.trim());
    });
  });

  if (allSkills.length >= 8) {
    skillsScore = 15;
  } else if (allSkills.length >= 4) {
    skillsScore = 10;
    issues.push({
      id: 'low-skills-count',
      type: 'warning',
      section: 'Skills',
      title: 'Add More Target Skills',
      message: `You have ${allSkills.length} skills. Aim for 8–15 relevant technical, soft, and tool skills.`,
    });
  } else {
    skillsScore = 3;
    issues.push({
      id: 'missing-skills',
      type: 'critical',
      section: 'Skills',
      title: 'Skills Section is Sparse',
      message: 'ATS scanners match your listed skills directly against job descriptions.',
    });
  }

  // 6. Action Verbs & Measurable Metrics Assessment (15 pts total)
  const allText = extractResumeRawText(resume).toLowerCase();
  const actionVerbsFound: string[] = [];
  ACTION_VERBS.forEach((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(allText)) {
      actionVerbsFound.push(verb);
    }
  });

  if (actionVerbsFound.length >= 6) {
    actionVerbsScore = 8;
  } else if (actionVerbsFound.length >= 3) {
    actionVerbsScore = 5;
  } else {
    actionVerbsScore = 2;
    issues.push({
      id: 'low-action-verbs',
      type: 'warning',
      section: 'Keywords',
      title: 'Use More Strong Action Verbs',
      message: 'Start bullet points with impactful verbs (e.g., Spearheaded, Architected, Optimized, Streamlined).',
    });
  }

  // Metrics search across all bullet points
  const metricsFound: string[] = [];
  resume.experience.forEach((exp) => {
    (exp.bullets || []).forEach((b) => {
      const match = b.match(METRIC_REGEX);
      if (match && !metricsFound.includes(match[0])) {
        metricsFound.push(match[0]);
      }
    });
  });
  resume.projects.forEach((proj) => {
    (proj.bullets || []).forEach((b) => {
      const match = b.match(METRIC_REGEX);
      if (match && !metricsFound.includes(match[0])) {
        metricsFound.push(match[0]);
      }
    });
  });

  if (metricsFound.length >= 3) {
    metricsScore = 7;
  } else if (metricsFound.length >= 1) {
    metricsScore = 4;
  } else {
    metricsScore = 1;
    issues.push({
      id: 'no-metrics',
      type: 'warning',
      section: 'Impact',
      title: 'Missing Quantifiable Achievements',
      message: 'Include numbers, percentages, dollar amounts, or metric improvements (e.g., "reduced latency by 40%", "managed $500K budget").',
    });
  }

  const rawScore = contactScore + summaryScore + experienceScore + educationScore + skillsScore + actionVerbsScore + metricsScore;
  const overallScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  if (issues.length === 0) {
    issues.push({
      id: 'all-clear',
      type: 'success',
      section: 'Readiness',
      title: 'Outstanding ATS Readiness',
      message: 'Your resume follows clean ATS standards with strong keywords, clear headings, and quantifiable achievements.',
    });
  }

  const wordCount = allText.split(/\s+/).filter(Boolean).length;
  const estimatedPages = wordCount > 450 ? 2 : 1;

  return {
    overallScore,
    contactScore,
    summaryScore,
    experienceScore,
    educationScore,
    skillsScore,
    actionVerbsScore,
    metricsScore,
    actionVerbsFound,
    metricsFound,
    issues,
    wordCount,
    estimatedPages,
  };
}

export function extractResumeRawText(resume: ResumeData): string {
  const parts: string[] = [];

  parts.push(resume.personalInfo.fullName);
  parts.push(resume.personalInfo.jobTitle);
  parts.push(resume.personalInfo.email);
  parts.push(resume.personalInfo.phone);
  parts.push(resume.personalInfo.location);
  parts.push(resume.personalInfo.linkedin);
  parts.push(resume.personalInfo.portfolio);
  parts.push(resume.personalInfo.github);

  if (resume.summary) parts.push(resume.summary);

  resume.experience.forEach((e) => {
    parts.push(e.jobTitle, e.company, e.location, e.description);
    if (e.bullets) parts.push(...e.bullets);
  });

  resume.education.forEach((ed) => {
    parts.push(ed.degree, ed.school, ed.location, ed.gpa, ed.coursework);
  });

  resume.skillCategories.forEach((cat) => {
    parts.push(cat.name);
    if (cat.skills) parts.push(...cat.skills);
  });

  resume.projects.forEach((p) => {
    parts.push(p.name, p.technologies, p.description);
    if (p.bullets) parts.push(...p.bullets);
  });

  resume.certifications.forEach((c) => {
    parts.push(c.name, c.issuer);
  });

  resume.additional.forEach((a) => {
    parts.push(a.title, a.subtitle, a.description);
  });

  return parts.filter(Boolean).join(' ');
}

// Client-side instant keyword extractor for Job Matcher
export function matchJobDescriptionClient(jobDesc: string, resumeText: string): JobMatchResult {
  if (!jobDesc.trim()) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      recommendations: ['Paste a job description above to analyze target keywords and compatibility.'],
    };
  }

  // Tokenize words and clean
  const words = jobDesc
    .toLowerCase()
    .replace(/[^a-z0-9#+.\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  // Count frequencies
  const freqMap: Record<string, number> = {};
  words.forEach((w) => {
    freqMap[w] = (freqMap[w] || 0) + 1;
  });

  // Extract key technical/domain terms
  const topKeywords = Object.keys(freqMap)
    .sort((a, b) => freqMap[b] - freqMap[a])
    .slice(0, 30);

  const lowerResume = resumeText.toLowerCase();
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  topKeywords.forEach((kw) => {
    const regex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'i');
    if (regex.test(lowerResume)) {
      matchedKeywords.push(capitalizeWord(kw));
    } else {
      missingKeywords.push(capitalizeWord(kw));
    }
  });

  const total = matchedKeywords.length + missingKeywords.length;
  const score = total > 0 ? Math.round((matchedKeywords.length / total) * 100) : 0;

  const recommendations: string[] = [];
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Consider incorporating legitimate missing keywords like ${missingKeywords.slice(0, 4).join(', ')} into your Skills or Experience bullet points if you possess this experience.`
    );
  }
  if (matchedKeywords.length >= 5) {
    recommendations.push(
      `Strong alignment found on core competencies: ${matchedKeywords.slice(0, 4).join(', ')}.`
    );
  }
  recommendations.push(
    'Remember: Never fabricate experience or skills. Only include keywords for technologies and methodologies you are genuinely qualified in.'
  );

  return {
    score,
    matchedKeywords,
    missingKeywords,
    recommendations,
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function capitalizeWord(str: string) {
  if (str.length <= 3) return str.toUpperCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const analyzeResumeATS = analyzeResume;
