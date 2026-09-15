import { ResumeData } from '../types';

export const BLANK_RESUME: ResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    github: '',
  },
  summary: '',
  experience: [],
  education: [],
  skillCategories: [
    {
      id: 'tech-skills',
      name: 'Technical Skills',
      skills: [],
    },
    {
      id: 'soft-skills',
      name: 'Soft Skills',
      skills: [],
    },
    {
      id: 'tools-skills',
      name: 'Tools & Technologies',
      skills: [],
    },
  ],
  projects: [],
  certifications: [],
  additional: [],
};

export const SAMPLE_DATA_SCIENTIST_RESUME: ResumeData = {
  personalInfo: {
    fullName: 'Alex Johnson',
    jobTitle: 'Senior Data Scientist',
    email: 'alex.johnson@email.com',
    phone: '(555) 382-9104',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson-ds',
    portfolio: 'alexjohnson.dev',
    github: 'github.com/alexjohnson',
  },
  summary:
    'Results-driven Data Scientist with 5+ years of experience architecting end-to-end machine learning pipelines, statistical modeling, and predictive analytics in high-growth tech environments. Proven track record of increasing model deployment throughput by 40% and saving $1.2M in annual customer churn through deep learning and automated feature engineering.',
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Data Scientist',
      company: 'Example Analytics Corp',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description: 'Lead the Core Machine Learning and Customer Intelligence initiatives.',
      bullets: [
        'Spearheaded the development and deployment of an XGBoost churn prediction model across 2.4M active user accounts, reducing churn by 14% and preserving $1.2M in annual recurring revenue.',
        'Architected a real-time feature store using Python, SQL, and AWS SageMaker, decreasing feature latency by 35% and accelerating ML experiment iteration cycles from weeks to days.',
        'Engineered dynamic customer lifetime value (LTV) forecasting models using Bayesian statistical methods, improving marketing budget allocation efficiency by 22%.',
        'Mentored 4 junior data scientists and established standardized ML code review, CI/CD pipelines, and automated model drift monitoring.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Data Scientist',
      company: 'Apex Digital Solutions',
      location: 'Austin, TX',
      startDate: '2019-08',
      endDate: '2022-02',
      current: false,
      description: 'Built customer recommendation engines and automated reporting pipelines.',
      bullets: [
        'Built a multi-modal recommendation engine using PyTorch and collaborative filtering, driving a 19% increase in click-through rates and $650K in incremental cart value.',
        'Automated ETL data pipelines in Apache Airflow and Snowflake, processing 50M+ daily telemetry events with 99.9% uptime.',
        'Created executive dashboards in Power BI and Tableau utilized weekly by senior leadership for KPI tracking and quarterly revenue forecasting.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Master of Science in Computer Science (Machine Learning Specialization)',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startYear: '2017',
      graduationYear: '2019',
      gpa: '3.92 / 4.00',
      coursework: 'Deep Learning, Advanced Statistical Modeling, Distributed Systems, Natural Language Processing',
    },
    {
      id: 'edu-2',
      degree: 'Bachelor of Science in Applied Mathematics and Statistics',
      school: 'University of Washington',
      location: 'Seattle, WA',
      startYear: '2013',
      graduationYear: '2017',
      gpa: '3.85 / 4.00',
      coursework: 'Linear Algebra, Probability Theory, Data Structures & Algorithms, Numerical Optimization',
    },
  ],
  skillCategories: [
    {
      id: 'cat-1',
      name: 'Programming & Data',
      skills: ['Python', 'SQL (PostgreSQL)', 'R', 'PySpark', 'C++'],
    },
    {
      id: 'cat-2',
      name: 'Machine Learning & AI',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-Learn', 'XGBoost', 'NLP', 'Computer Vision', 'LLMs', 'Statistical Modeling'],
    },
    {
      id: 'cat-3',
      name: 'Cloud & Infrastructure',
      skills: ['AWS (SageMaker, S3, EC2)', 'Docker', 'Kubernetes', 'Snowflake', 'Airflow', 'MLflow', 'Git'],
    },
    {
      id: 'cat-4',
      name: 'BI & Analytics',
      skills: ['Power BI', 'Tableau', 'A/B Testing', 'Hypothesis Testing', 'Data Storytelling'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Real-Time Fraud Detection Engine',
      link: 'github.com/alexjohnson/fraud-stream-ml',
      technologies: 'Python, Kafka, Redis, Scikit-Learn, Docker',
      description: 'Stream-processing fraud classifier analyzing financial transactions sub-50ms.',
      bullets: [
        'Engineered an anomaly detection pipeline capable of scoring 10,000+ transactions per second with a 98.4% precision rate.',
        'Implemented automated alert routing and continuous model evaluation to mitigate concept drift.',
      ],
    },
    {
      id: 'proj-2',
      name: 'Customer Sentiment & Topic Analysis Engine',
      link: 'github.com/alexjohnson/sentiment-nlp',
      technologies: 'BERT, HuggingFace, FastAPI, AWS ECS',
      description: 'NLP transformer model categorizing and summarizing 500K+ app reviews and support tickets.',
      bullets: [
        'Fine-tuned transformer models to automatically categorize product bug feedback, reducing support triage time by 45%.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Machine Learning – Specialty',
      issuer: 'Amazon Web Services',
      issueDate: '2023',
      url: 'aws.amazon.com/verification',
    },
    {
      id: 'cert-2',
      name: 'TensorFlow Developer Certificate',
      issuer: 'Google Developers',
      issueDate: '2022',
      url: 'certificate.google.com',
    },
  ],
  additional: [
    {
      id: 'add-1',
      type: 'award',
      title: 'Innovator of the Year',
      subtitle: 'Example Analytics Corp',
      date: '2023',
      description: 'Awarded for outstanding technical contribution in productionizing automated ML drift mitigation.',
    },
    {
      id: 'add-2',
      type: 'language',
      title: 'English (Native), Spanish (Professional Working)',
      subtitle: '',
      date: '',
      description: '',
    },
  ],
};

export const SAMPLE_SOFTWARE_ENGINEER_RESUME: ResumeData = {
  personalInfo: {
    fullName: 'Sarah Chen',
    jobTitle: 'Senior Full-Stack Software Engineer',
    email: 'sarah.chen.dev@email.com',
    phone: '(555) 729-4183',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/sarahchen-dev',
    portfolio: 'sarahchen.io',
    github: 'github.com/sarahchen',
  },
  summary:
    'Dedicated Full-Stack Software Engineer with 6+ years of experience designing scalable microservices, cloud-native architectures, and responsive web applications. Expert in TypeScript, React, Node.js, and distributed systems. Spearheaded architectural refactors that reduced p99 latency by 60% and scaled systems to handle 10M+ daily active requests.',
  experience: [
    {
      id: 'swe-1',
      jobTitle: 'Senior Software Engineer',
      company: 'CloudScale Technologies',
      location: 'Seattle, WA',
      startDate: '2021-06',
      endDate: '',
      current: true,
      description: 'Core infrastructure and frontend platform engineering.',
      bullets: [
        'Architected and led the migration from a legacy monolith to a microservices architecture using Go, Node.js, and Kubernetes, improving system throughput by 75%.',
        'Implemented modern React/Next.js design system utilized across 8 engineering teams, accelerating front-end feature release velocity by 35%.',
        'Optimized PostgreSQL database queries, indices, and connection pooling, cutting database CPU utilization by 42% during peak sales events.',
        'Established automated CI/CD deployment pipelines using GitHub Actions, decreasing build and deployment failure rates by 80%.',
      ],
    },
    {
      id: 'swe-2',
      jobTitle: 'Software Engineer',
      company: 'Beacon Web Systems',
      location: 'San Jose, CA',
      startDate: '2018-07',
      endDate: '2021-05',
      current: false,
      description: 'Full-stack application development for B2B SaaS client portal.',
      bullets: [
        'Developed real-time collaborative workspace features using WebSockets and TypeScript, increasing daily user engagement by 28%.',
        'Built secure REST and GraphQL APIs with OAuth2 authentication, handling 5M+ daily requests with 99.98% service reliability.',
        'Authored comprehensive unit and integration test suites with Jest and Playwright, lifting test coverage from 54% to 92%.',
      ],
    },
  ],
  education: [
    {
      id: 'swe-edu-1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Washington',
      location: 'Seattle, WA',
      startYear: '2014',
      graduationYear: '2018',
      gpa: '3.88 / 4.00',
      coursework: 'Operating Systems, Database Management Systems, Distributed Computing, Computer Networks',
    },
  ],
  skillCategories: [
    {
      id: 'swe-cat-1',
      name: 'Languages',
      skills: ['TypeScript', 'JavaScript (ES6+)', 'Go', 'Python', 'SQL', 'HTML5/CSS3'],
    },
    {
      id: 'swe-cat-2',
      name: 'Frameworks & Libraries',
      skills: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'GraphQL', 'Redux / Zustand'],
    },
    {
      id: 'swe-cat-3',
      name: 'Cloud & DevOps',
      skills: ['AWS (ECS, Lambda, S3, RDS)', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD (GitHub Actions)', 'Redis'],
    },
  ],
  projects: [
    {
      id: 'swe-proj-1',
      name: 'High-Throughput Task Orchestration Engine',
      link: 'github.com/sarahchen/task-runner',
      technologies: 'Go, Redis, Docker, gRPC',
      description: 'Distributed background job processing queue with at-least-once delivery guarantees.',
      bullets: [
        'Processes over 50,000 asynchronous jobs/min with automatic exponential backoff retry and Dead Letter Queue handling.',
      ],
    },
  ],
  certifications: [
    {
      id: 'swe-cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2022',
      url: 'aws.amazon.com/verify',
    },
  ],
  additional: [
    {
      id: 'swe-add-1',
      type: 'volunteer',
      title: 'Mentor & Code Instructor',
      subtitle: 'Girls Who Code',
      date: '2022 - Present',
      description: 'Volunteering weekly to teach web development fundamentals and computer science concepts to high school students.',
    },
  ],
};
