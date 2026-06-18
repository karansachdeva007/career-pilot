import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { generateCoverLetter } from "@/lib/agents/cover-letter-agent";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, jobDescription } = await req.json();

    if (!resumeId || !jobDescription) {
      return NextResponse.json({ error: "Resume ID and Job Description are required" }, { status: 400 });
    }

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId, userId: session.user.id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const coverLetter = await generateCoverLetter(resume.extractedText, jobDescription, session.user.name || "[Your Name]");

    return NextResponse.json({ coverLetter }, { status: 200 });
  } catch (error) {
    console.error("Cover letter error:", error);
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 });
  }
}
