"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Fallback to custom div if not installed
import { Building2, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string;
  applyUrl?: string;
  location?: string;
  matchScore?: number;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs/match");
        const data = await res.json();
        
        if (!res.ok) {
          toast.error(data.error || "Failed to fetch jobs");
          return;
        }

        if (data.message) {
          setMessage(data.message);
        }
        
        setJobs(data.jobs || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch job matches");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Job Matches</h2>
        <p className="text-muted-foreground mt-2">
          Based on your latest resume skills, here are your top matched jobs.
        </p>
      </div>

      {message && (
        <Card className="bg-muted/40">
          <CardContent className="p-6 text-center text-muted-foreground">
            {message}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-3/4 p-6 border-b md:border-b-0 md:border-r">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <div className="flex items-center text-muted-foreground mt-1 text-sm">
                      <Building2 className="mr-1 h-4 w-4" />
                      {job.company}
                      <MapPin className="ml-4 mr-1 h-4 w-4" />
                      {job.location || "Remote"}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-foreground/80 mb-6 line-clamp-3">
                  {job.description}
                </p>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.split(",").slice(0, 8).map((skill, i) => (
                      <span key={i} className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        {skill.trim()}
                      </span>
                    ))}
                    {job.requiredSkills.split(",").length > 8 && (
                      <span className="inline-flex items-center rounded-md border border-dashed px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        +{job.requiredSkills.split(",").length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/4 p-6 bg-muted/20 flex flex-col items-center justify-center border-l">
                {typeof job.matchScore !== "undefined" ? (
                  <>
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold text-primary">{job.matchScore}%</span>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-1">Match</p>
                    </div>
                    <Progress value={job.matchScore} className="h-2 w-full max-w-[120px] mb-6" />
                  </>
                ) : (
                  <div className="text-center text-muted-foreground text-sm mb-6">
                    No match score available
                  </div>
                )}

                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-auto text-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Apply Now
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {jobs.length === 0 && !message && (
          <div className="text-center p-12 border-2 border-dashed rounded-lg bg-muted/10">
            <h3 className="text-lg font-medium mb-1">No jobs found</h3>
            <p className="text-muted-foreground text-sm">Check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
}
