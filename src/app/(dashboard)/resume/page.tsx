"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UploadCloud, File, Loader2, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge"; // Need to install badge if not there, but we can just use normal div for now, let's stick to standard Tailwind if Badge isn't installed. We didn't install badge.

interface AnalysisResult {
  ats_score: number;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  recommended_improvements: string[];
}

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to upload resume");
        return;
      }

      toast.success("Resume analyzed successfully!");
      setAnalysis(data.analysis);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during analysis.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Resume Analysis</h2>
        <p className="text-muted-foreground mt-2">
          Upload your resume to get an AI-powered ATS score and detailed feedback.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
          <CardDescription>Max file size: 5MB</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 bg-muted/10 hover:bg-muted/20 transition-colors">
            {file ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <File className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                    Remove
                  </Button>
                  <Button size="sm" onClick={handleUpload} disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Analyze Resume
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF (max. 5MB)</p>
                </div>
                <Input
                  id="resume-upload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button onClick={() => document.getElementById("resume-upload")?.click()}>
                  Select File
                </Button>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing with Gemini AI...</span>
              </div>
              <Progress value={null} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl">ATS Score</CardTitle>
                <CardDescription>Your resume matching potential</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-primary/20">
                  <span className="text-4xl font-bold text-primary">{analysis.ats_score}</span>
                  <svg className="absolute top-0 left-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="8"
                      strokeDasharray={`${analysis.ats_score * 2.83} 283`}
                      strokeLinecap="round"
                      fill="transparent"
                      r="45"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium mt-4 text-center">
                  {analysis.ats_score >= 80 ? "Excellent" : analysis.ats_score >= 60 ? "Good" : "Needs Improvement"}
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Extracted Skills</CardTitle>
                <CardDescription>Skills identified by our AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.map((skill, i) => (
                    <span key={i} className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80">
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {analysis.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-red-600 dark:text-red-400">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {analysis.weaknesses.map((weak, i) => (
                    <li key={i}>{weak}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recommended Improvements</CardTitle>
              <CardDescription>Actionable advice to boost your ATS score</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-decimal pl-5 space-y-3 text-sm">
                {analysis.recommended_improvements.map((rec, i) => (
                  <li key={i} className="pl-1">
                    <span className="font-medium text-foreground block mb-1">{rec.split(":")[0]}</span>
                    {rec.includes(":") && <span className="text-muted-foreground">{rec.split(":")[1]}</span>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
