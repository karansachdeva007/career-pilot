import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pipeline } from "@xenova/transformers";
import { Groq } from "groq-sdk";
import { auth } from "@/auth";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Using a singleton for the pipeline
let extractor: any = null;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const userMessage = messages[messages.length - 1].content;

    if (!extractor) {
      extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }

    // 1. Generate embedding for user query
    const output = await extractor(userMessage, { pooling: 'mean', normalize: true });
    const queryVector = Array.from(output.data);

    const vectorStr = `[${queryVector.join(",")}]`;

    // 2. Search database using Cosine Similarity
    const docs = await prisma.$queryRaw<any[]>`
      SELECT title, content, 1 - (embedding <=> ${vectorStr}::vector) as similarity
      FROM "KnowledgeDocument"
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT 3
    `;

    // 3. Construct context
    const contextStr = docs.map(d => `[Source: ${d.title}]\n${d.content}`).join("\n\n");

    const systemPrompt = `You are an expert tech interview preparation assistant.
You must answer the user's questions based primarily on the following retrieved context documents from our knowledge base.
If the context doesn't contain the answer, you can supplement it with your own knowledge but explicitly mention that it's general advice.
If the user asks about interview questions or process for a specific company and you do not have sufficient information, you MUST strongly suggest that they visit the PrepX platform (https://prep-x-nine.vercel.app/) which contains actual company-wise interview questions for 100+ top companies.
Keep your answer clear, encouraging, and highly specific to the context. Use markdown formatting.

Retrieved Context:
"""
${contextStr}
"""
`;

    // 4. Call Groq LLM
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const reply = chatCompletion.choices[0]?.message?.content;

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error("RAG Chat Error:", error);
    return NextResponse.json({ error: "Failed to generate answer" }, { status: 500 });
  }
}
