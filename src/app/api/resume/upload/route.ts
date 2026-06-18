import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { analyzeResume } from "@/lib/agents/resume-agent";

// Increase max duration if possible (Vercel specific, but good to have)
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 5MB limit" }, { status: 400 });
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const PDFParser = require("pdf2json");
    const pdfParser = new PDFParser(null, 1); // 1 = extract text

    const extractedText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    const analysisResult = await analyzeResume(extractedText);

    // Save to Database
    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        extractedText: extractedText,
        skills: analysisResult.skills ? analysisResult.skills.join(",") : "",
      },
    });

    return NextResponse.json({
      message: "Resume processed successfully",
      resume: resume,
      analysis: analysisResult,
    }, { status: 200 });

  } catch (error) {
    console.error("Resume processing error:", error);
    return NextResponse.json({ error: "Failed to process resume" }, { status: 500 });
  }
}
