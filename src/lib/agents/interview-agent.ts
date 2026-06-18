import Groq from "groq-sdk";
import { pipeline } from "@xenova/transformers";
import { prisma } from "@/lib/db";

let extractor: any = null;

export async function generateInterviewPlan(resumeText: string, jobDescription: string) {
  if (!resumeText || !jobDescription) {
    throw new Error("Resume text and job description are required for interview prep");
  }

  // Use RAG to get company-specific info if possible
  let contextStr = "";
  try {
    if (!extractor) {
      extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }

    const output = await extractor(jobDescription, { pooling: 'mean', normalize: true });
    const queryVector = Array.from(output.data);
    const vectorStr = `[${queryVector.join(",")}]`;

    const docs = await prisma.$queryRaw<any[]>`
      SELECT title, content, 1 - (embedding <=> ${vectorStr}::vector) as similarity
      FROM "KnowledgeDocument"
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT 3
    `;
    contextStr = docs.map(d => `[Source: ${d.title}]\n${d.content}`).join("\n\n");
  } catch (error) {
    console.error("RAG retrieval failed, falling back to base model", error);
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `You are an expert technical interviewer and hiring manager.
I will provide you with a candidate's resume, a target job description, and some retrieved knowledge base context about the company or role.
Based on the intersection of the candidate's skills and the job's requirements, generate a detailed interview preparation roadmap.

Include:
1. 3-4 Behavioral questions tailored to the candidate's experience.
2. 3-4 Technical/Domain-specific questions based on the job requirements.
3. Brief tips on how the candidate should answer each based on their resume.

Retrieved Company/Domain Context:
"""
${contextStr}
"""

Original Resume Text:
"""
${resumeText}
"""

Target Job Description:
"""
${jobDescription}
"""

Provide the output in a clean Markdown format.`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.6,
  });

  const interviewPrep = chatCompletion.choices[0]?.message?.content;

  if (!interviewPrep) {
    throw new Error("Failed to generate interview prep");
  }

  return interviewPrep;
}
