"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";

export default function TailorResumePage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tailoredResume, setTailoredResume] = useState("");

  useEffect(() => {
    // Fetch user's resumes
    const fetchResumes = async () => {
      // We don't have a specific endpoint just for getting resumes, but the job match route fetches the latest one.
      // Wait, let's create a quick way to fetch resumes or just use a generic fetch if we have an endpoint.
      // Actually, I'll need to create an endpoint for getting resumes if it doesn't exist.
      // For now, let's assume there is /api/resume or we can add it.
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
    setTailoredResume("");

    try {
      const res = await fetch("/api/resume/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: selectedResume, jobDescription }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      setTailoredResume(data.tailoredResume);
      toast.success("Resume tailored successfully!");
    } catch (error) {
      toast.error("An error occurred while tailoring the resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Tailor Resume</h1>
      <p className="text-muted-foreground">Modify your resume to perfectly match a specific job description.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Details</CardTitle>
            <CardDescription>Select your base resume and paste the job description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Base Resume</label>
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
              {resumes.length === 0 && (
                <p className="text-xs text-red-500">Please upload a resume first in the Resume Analysis section.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description</label>
              <Textarea 
                placeholder="Paste the job description here..." 
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
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Generate Tailored Resume
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tailored Output</CardTitle>
            <CardDescription>Your generated markdown resume.</CardDescription>
          </CardHeader>
          <CardContent>
            {tailoredResume ? (
              <div className="bg-muted p-4 rounded-md h-[400px] overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                {tailoredResume}
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center border-2 border-dashed rounded-md text-muted-foreground">
                Output will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
