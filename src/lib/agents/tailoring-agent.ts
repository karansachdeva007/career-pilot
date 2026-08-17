import Groq from "groq-sdk";

export async function tailorResume(resumeText: string, jobDescription: string) {
  if (!resumeText || !jobDescription) {
    throw new Error("Resume text and job description are required for tailoring");
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `You are an expert resume writer. 
I have a candidate's resume and a job description. 
I need you to tailor the resume to specifically match the job description.
Highlight the most relevant skills, experiences, and achievements that align with the job requirements.
Provide the tailored resume in a clear, professional Markdown format.

Original Resume Text:
"""
${resumeText}
"""

Target Job Description:
"""
${jobDescription}
"""

Provide ONLY the updated, tailored resume content in Markdown. Do not include any introductory or concluding remarks.`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "openai/gpt-oss-120b",
    temperature: 0.5,
  });

  const tailoredResume = chatCompletion.choices[0]?.message?.content;

  if (!tailoredResume) {
    throw new Error("Failed to generate tailored resume");
  }

  return tailoredResume;
}
