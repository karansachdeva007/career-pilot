import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Briefcase, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const resumesCount = await prisma.resume.count({
    where: { userId },
  });

  const latestResume = await prisma.resume.findFirst({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {session?.user?.name?.split(" ")[0]}!</h2>
          <p className="text-muted-foreground mt-2">Here is an overview of your job search progress.</p>
        </div>
        <Link href="/resume">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumesCount}</div>
            <p className="text-xs text-muted-foreground">Uploaded to your account</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Matches</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Available</div>
            <p className="text-xs text-muted-foreground">Check your Job Matches tab</p>
          </CardContent>
        </Card>
      </div>

      {latestResume && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Latest Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You uploaded <strong>{latestResume.fileName}</strong> on {latestResume.uploadedAt.toLocaleDateString()}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
