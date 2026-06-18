import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { matchJobs } from "@/lib/agents/job-agent";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const latestResume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
    });

    if (!latestResume || !latestResume.skills) {
      return NextResponse.json({ jobs: [], message: "No skills found. Upload a resume." }, { status: 200 });
    }

    const userSkills = latestResume.skills
      .toLowerCase()
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const matchedJobs = await matchJobs(userSkills);

    return NextResponse.json({ jobs: matchedJobs }, { status: 200 });
  } catch (error) {
    console.error("Job matching error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
