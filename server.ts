import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", hasAiKey: !!process.env.GEMINI_API_KEY });
});

// API: AI Summary Generator
app.post("/api/ai/generate-summary", async (req, res) => {
  try {
    const { jobTitle, yearsOfExperience, skills, careerGoals } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: "AI service not configured on server",
        fallback: true,
      });
    }

    const prompt = `You are a professional ATS resume optimizer and career coach.
Generate a concise, impactful, 3-4 sentence professional resume summary for:
- Professional Title: ${jobTitle || "Professional"}
- Experience Level: ${yearsOfExperience ? yearsOfExperience + " years" : "Mid-level"}
- Key Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || "Industry relevant skills"}
- Career Goals/Focus: ${careerGoals || "Driving impact, scaling processes, and delivering high-quality results"}

Requirements:
1. ATS-Friendly: Use strong keywords, clear concise sentence structures, and zero fluff or buzzwords like "guru" or "rockstar".
2. First-person implied (No "I", "He", or "She" pronouns - e.g., "Results-driven Data Scientist with 4+ years of experience...").
3. Highlight core competencies, technical proficiency, and quantifiable value creation.
4. Output ONLY the summary paragraph without preamble, bullet points, quotes, or markdown formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const summary = response.text?.trim() || "";
    return res.json({ summary });
  } catch (error: any) {
    console.error("AI Summary generation error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate summary" });
  }
});

// API: AI Bullet Point Improver
app.post("/api/ai/improve-bullet", async (req, res) => {
  try {
    const { bullet, jobTitle, context } = req.body;
    const ai = getGeminiClient();

    if (!bullet || typeof bullet !== "string") {
      return res.status(400).json({ error: "Bullet text is required" });
    }

    if (!ai) {
      return res.status(503).json({
        error: "AI service not configured on server",
        fallback: true,
      });
    }

    const prompt = `You are an expert ATS resume writer and career coach.
A candidate has provided a basic description of a job duty or achievement:
Candidate Input: "${bullet}"
Target Role/Context: ${jobTitle || "Professional"} ${context ? `(${context})` : ""}

Task:
Generate 1 to 3 professional, action-verb-driven ATS resume bullet points that refine and elevate the user's input.

Strict Rules:
1. ZERO INVENTED METRICS OR RESPONSIBILITIES: Do NOT invent untrue specific metrics, imaginary revenue numbers, fake company names, or unmentioned tools.
2. REFINE THE USER'S ACTUAL INPUT: Clarify what was done, the tools/methods used, and the resulting business value based solely on what the candidate described.
3. PLACEHOLDER USAGE: If suggesting a quantifiable impact structure, use clear bracketed placeholders like "[by X%]", "[saving X hours/week]", or "[for X+ clients]" so the user can insert their actual numbers.
4. ACTION VERBS: Each bullet MUST begin with a powerful past-tense action verb (e.g., Spearheaded, Architected, Automated, Optimized, Engineered, Streamlined, Orchestrated, Executed).
5. PROVIDE 3 DISTINCT VARIATIONS:
   - Variation 1: Impact & Outcome-focused (highlights the end result and value delivered)
   - Variation 2: Technical & Execution-focused (highlights tools, architecture, or methodology)
   - Variation 3: Process & Efficiency-focused (highlights workflow streamlining or collaboration)

Return JSON in this format:
{
  "suggestions": [
    "string",
    "string",
    "string"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    const suggestions: string[] = Array.isArray(parsed.suggestions)
      ? parsed.suggestions.filter((s: any) => typeof s === "string" && s.trim().length > 0)
      : [];

    const improved = suggestions[0] || "";
    return res.json({ suggestions, improved });
  } catch (error: any) {
    console.error("AI Bullet improvement error:", error);
    return res.status(500).json({ error: error.message || "Failed to improve bullet" });
  }
});

// API: Job Description Keyword Matcher Analysis
app.post("/api/ai/match-job", async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: "AI service not configured on server",
        fallback: true,
      });
    }

    if (!jobDescription) {
      return res.status(400).json({ error: "Job description is required" });
    }

    const prompt = `You are an ATS parser evaluating a resume against a target job description.
Analyze both texts and extract relevant technical skills, hard skills, certifications, and domain keywords.

Job Description:
"""
${jobDescription.slice(0, 3000)}
"""

Resume Content:
"""
${(resumeText || "").slice(0, 3000)}
"""

Return a valid JSON object matching this schema:
{
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"],
  "matchScore": number (integer 0-100),
  "topRecommendations": ["string"]
}

Important:
- matchedKeywords: keywords present in both the JD and the resume.
- missingKeywords: critical keywords from the JD that are NOT found in the resume.
- matchScore: estimated percentage fit (0-100).
- topRecommendations: 2-4 practical tips for tailoring the resume without fabricating false credentials.
- Output strictly JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("AI Job Matcher error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze job match" });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ATS Resume Builder server running on port ${PORT}`);
  });
}

startServer();
