"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload, CheckCircle2, Circle, Briefcase, FileText, CheckSquare, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CareerState, initialCareerState } from "@/lib/langgraph/state";

const STEPS = [
  { id: "resumeAnalysis", label: "Resume Analysis", icon: <FileText className="w-4 h-4" /> },
  { id: "jobMatching", label: "Job Matching", icon: <Briefcase className="w-4 h-4" /> },
  { id: "resumeTailoring", label: "Resume Tailoring (if ATS < 70)", icon: <CheckSquare className="w-4 h-4" /> },
  { id: "coverLetter", label: "Cover Letter Generation", icon: <FileText className="w-4 h-4" /> },
  { id: "interviewPrep", label: "Interview Preparation", icon: <MessageSquare className="w-4 h-4" /> },
];

export default function CareerCopilotPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [state, setState] = useState<CareerState>(initialCareerState);
  const [isFinished, setIsFinished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startWorkflow = async () => {
    if (!file) {
      toast.error("Please upload a resume first");
      return;
    }

    setIsProcessing(true);
    setIsFinished(false);
    setState(initialCareerState);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/career-copilot", {
        method: "POST",
        body: formData,
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          const lines = event.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr && dataStr !== "{}") {
                try {
                  const parsedState = JSON.parse(dataStr);
                  setState(parsedState);
                } catch (e) {
                  console.error("Error parsing SSE JSON", e);
                }
              }
            } else if (line.startsWith("event: done")) {
              setIsFinished(true);
              setIsProcessing(false);
              toast.success("Application Package Completed!");
            } else if (line.startsWith("event: error")) {
              setIsFinished(true);
              setIsProcessing(false);
              toast.error("Workflow encountered an error");
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to execute workflow");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Career Copilot</h1>
        <p className="text-muted-foreground mt-2">
          Upload your resume and let LangGraph orchestrate all agents to generate a complete application package.
        </p>
      </div>

      {!isProcessing && !isFinished && (
        <Card>
          <CardHeader>
            <CardTitle>Start Workflow</CardTitle>
            <CardDescription>Upload your PDF resume to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto justify-start sm:justify-center">
                <Upload className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">{file ? file.name : "Select Resume PDF"}</span>
              </Button>
              <Button onClick={startWorkflow} disabled={!file} className="w-full sm:w-auto whitespace-normal h-auto text-left sm:text-center py-2">
                Generate Complete Application Package
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(isProcessing || isFinished) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar: Progress Tracker */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Workflow Execution</CardTitle>
              <CardDescription>LangGraph Agent Progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {STEPS.map((step, index) => {
                  const isCompleted = state.completedSteps.includes(step.id);
                  const isCurrent = isProcessing && !isCompleted && 
                    (index === 0 || state.completedSteps.includes(STEPS[index - 1].id));
                  
                  // Special logic for tailoring: it might be skipped
                  const isSkipped = isFinished && step.id === "resumeTailoring" && !isCompleted;

                  return (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        ) : isSkipped ? (
                          <CheckCircle2 className="w-5 h-5 text-muted-foreground opacity-50" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        {isSkipped && <p className="text-xs text-muted-foreground">Skipped (ATS &gt;= 70)</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Main Content: Final Dashboard */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">ATS Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {state.atsScore > 0 ? state.atsScore : "--"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Match</CardTitle>
                </CardHeader>
                <CardContent>
                  {state.selectedJob ? (
                    <div>
                      <p className="font-semibold truncate">{state.selectedJob.title}</p>
                      <p className="text-sm text-muted-foreground">{state.selectedJob.company}</p>
                      <div className="text-2xl font-bold text-green-500 mt-2">
                        {state.selectedJob.matchScore}% Match
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Waiting for Job Agent...</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {state.missingSkills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Missing Skills (Gap Analysis)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {state.missingSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {state.tailoredResume && (
              <Card>
                <CardHeader>
                  <CardTitle>Tailored Resume</CardTitle>
                  <CardDescription>Optimized for {state.selectedJob?.company}</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{state.tailoredResume}</ReactMarkdown>
                </CardContent>
              </Card>
            )}

            {state.coverLetter && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Cover Letter</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto whitespace-pre-wrap text-sm">
                  {state.coverLetter}
                </CardContent>
              </Card>
            )}

            {state.interviewPlan && (
              <Card>
                <CardHeader>
                  <CardTitle>Interview Preparation Roadmap</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto prose prose-sm dark:prose-invert">
                  <ReactMarkdown>{state.interviewPlan}</ReactMarkdown>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
