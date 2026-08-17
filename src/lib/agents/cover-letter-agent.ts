import Groq from "groq-sdk";

export async function generateCoverLetter(resumeText: string, jobDescription: string, userName: string = "[Your Name]") {
  if (!resumeText || !jobDescription) {
    throw new Error("Resume text and job description are required for cover letter generation");
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `You are an expert career coach and professional writer.
I have a candidate's resume and a job description. 
I need you to write a compelling, tailored cover letter for this specific job.
It should be engaging, highlight the most relevant achievements from the resume, and show enthusiasm for the role.
The tone should be professional but conversational.

Candidate Name: ${userName}

Original Resume Text:
"""
${resumeText}
"""

Target Job Description:
"""
${jobDescription}
"""

Provide ONLY the cover letter content in clear text with paragraphs (no markdown formatting like bolding, just plain text with line breaks).`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
  });

  const coverLetter = chatCompletion.choices[0]?.message?.content;

  if (!coverLetter) {
    throw new Error("Failed to generate cover letter");
  }

  return coverLetter;
}
