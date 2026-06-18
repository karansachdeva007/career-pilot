"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, HelpCircle, ExternalLink } from "lucide-react";

export default function InterviewPrepPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [interviewPrep, setInterviewPrep] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch("/api/resume");
        if (res.ok) {
          const data = await res.json();
          setResumes(data.resumes || []);
          if (data.resumes?.length > 0) {
            setSelectedResume(data.resumes[0].id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchResumes();
  }, []);

  const handleGenerate = async () => {
    if (!selectedResume || !jobDescription) {
      toast.error("Please select a resume and paste a job description.");
      return;
    }

    setIsGenerating(true);
    setInterviewPrep("");

    try {
      const res = await fetch("/api/interview-prep/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: selectedResume, jobDescription }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      setInterviewPrep(data.interviewPrep);
      toast.success("Interview prep material generated!");
    } catch (error) {
      toast.error("An error occurred while generating interview prep.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Interview Preparation</h1>
      <p className="text-muted-foreground">Generate tailored behavioral and technical questions based on your resume and the target job.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Role Context</CardTitle>
            <CardDescription>Select your resume and provide the job posting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Resume</label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedResume} 
                onChange={(e) => setSelectedResume(e.target.value)}
              >
                <option value="" disabled>Select a resume...</option>
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.fileName} ({new Date(r.uploadedAt).toLocaleDateString()})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description</label>
              <Textarea 
                placeholder="Paste the target job description here..." 
                className="h-[250px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleGenerate}
              disabled={isGenerating || !selectedResume || !jobDescription}
            >
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HelpCircle className="mr-2 h-4 w-4" />}
              Generate Interview Prep
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preparation Material</CardTitle>
            <CardDescription>Questions and answering tips.</CardDescription>
          </CardHeader>
          <CardContent>
            {interviewPrep ? (
              <div className="bg-muted p-4 rounded-md h-[400px] overflow-y-auto whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {interviewPrep}
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center border-2 border-dashed rounded-md text-muted-foreground">
                Output will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6">
            <div className="space-y-1 mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold flex items-center">
                Want company-specific questions?
              </h3>
              <p className="text-sm text-muted-foreground">
                Practice with real interview questions asked in rounds at 100+ top companies on PrepX.
              </p>
            </div>
            <a href="https://prep-x-nine.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button>
                Visit PrepX <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
