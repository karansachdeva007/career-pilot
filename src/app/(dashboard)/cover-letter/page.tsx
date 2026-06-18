"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Loader2, Copy } from "lucide-react";

export default function CoverLetterPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

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
    setCoverLetter("");

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: selectedResume, jobDescription }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      setCoverLetter(data.coverLetter);
      toast.success("Cover letter generated successfully!");
    } catch (error) {
      toast.error("An error occurred while generating the cover letter.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Cover Letter Generator</h1>
      <p className="text-muted-foreground">Instantly craft a compelling cover letter tailored to the job you want.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
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
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Generate Cover Letter
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Your Cover Letter</CardTitle>
              <CardDescription>Ready to send.</CardDescription>
            </div>
            {coverLetter && (
              <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {coverLetter ? (
              <div className="bg-muted p-4 rounded-md h-[400px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed">
                {coverLetter}
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
