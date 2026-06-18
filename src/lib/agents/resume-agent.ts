import Groq from "groq-sdk";

export async function analyzeResume(extractedText: string) {
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error("No text provided for resume analysis");
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `You are an expert ATS (Applicant Tracking System) and senior technical recruiter with 15+ years screening resumes across software engineering, data science, and related technical roles.

Your evaluation must be unbiased: ignore the candidate's name, gender, age, photo, address, nationality, or the prestige of their school. Score strictly based on demonstrated skills, experience, and measurable impact in the resume text.

Resume Text:
"""
${extractedText}
"""

SCORING RUBRIC (use this to compute ats_score out of 100; weigh each category internally before producing the final number — do not just guess a round number):
- Technical Skills & Keywords (0-25 pts): exact and semantic matches to common industry standards.
- Projects & Experience relevance (0-25 pts): complexity, tech stack used, recency.
- Quantifiable achievements & impact (0-15 pts): metrics, results, percentages, scale.
- Education & Certifications (0-10 pts).
- Formatting & ATS Compatibility (0-25 pts): clear sections, bullet points, no complex tables/graphics.

When evaluating impact, extract any already-present quantified claims verbatim or near-verbatim from the resume (e.g. "improved page load time by 40%") into a separate quantified_achievements array. If the resume has zero quantified claims, return an empty array — do not invent metrics.

Respond ONLY with a JSON object exactly matching this structure:
{
  "ats_score": number (0-100),
  "score_breakdown": {
    "technical_skills": number,
    "projects": number,
    "experience": number,
    "achievements_impact": number,
    "education_certifications": number,
    "formatting_ats_compatibility": number
  },
  "skills": ["skill1", "skill2"],
  "quantified_achievements": ["metric1"],
  "missing_keywords": ["keyword1"],
  "experience_level": "entry" | "mid" | "senior" | "unclear",
  "strengths": ["strength1"],
  "weaknesses": ["weakness1"],
  "formatting_issues": ["issue1"],
  "recommended_improvements": ["improvement1"]
}
`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  const aiText = chatCompletion.choices[0]?.message?.content;
  if (!aiText) {
    throw new Error("No response from Groq");
  }

  return JSON.parse(aiText);
}
