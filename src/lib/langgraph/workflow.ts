import { StateGraph, START, END } from "@langchain/langgraph";
import { CareerState, initialCareerState } from "./state";
import { resumeNode, jobMatchNode, tailoringNode, coverLetterNode, interviewNode } from "./nodes";
import { shouldTailor } from "./edges";

// State structure for LangGraph
const graphState = {
  userId: { value: (x: string, y: string) => y ?? x, default: () => initialCareerState.userId },
  userName: { value: (x: string, y: string) => y ?? x, default: () => initialCareerState.userName },
  resumeText: { value: (x: string, y: string) => y ?? x, default: () => initialCareerState.resumeText },
  extractedSkills: { value: (x: string[], y: string[]) => y ?? x, default: () => initialCareerState.extractedSkills },
  atsScore: { value: (x: number, y: number) => y ?? x, default: () => initialCareerState.atsScore },
  matchedJobs: { value: (x: any[], y: any[]) => y ?? x, default: () => initialCareerState.matchedJobs },
  selectedJob: { value: (x: any | null, y: any | null) => y ?? x, default: () => initialCareerState.selectedJob },
  missingSkills: { value: (x: string[], y: string[]) => y ?? x, default: () => initialCareerState.missingSkills },
  tailoredResume: { value: (x: string, y: string) => y ?? x, default: () => initialCareerState.tailoredResume },
  coverLetter: { value: (x: string, y: string) => y ?? x, default: () => initialCareerState.coverLetter },
  interviewPlan: { value: (x: string, y: string) => y ?? x, default: () => initialCareerState.interviewPlan },
  completedSteps: { value: (x: string[], y: string[]) => y ?? x, default: () => initialCareerState.completedSteps },
  errors: { value: (x: string[], y: string[]) => y ?? x, default: () => initialCareerState.errors },
};

const builder = new StateGraph<CareerState>({ channels: graphState as any });

// Add Nodes
builder.addNode("resumeNode", resumeNode);
builder.addNode("jobMatchNode", jobMatchNode);
builder.addNode("tailoringNode", tailoringNode);
builder.addNode("coverLetterNode", coverLetterNode);
builder.addNode("interviewNode", interviewNode);

// Add Edges
builder.addEdge(START, "resumeNode" as any);
builder.addEdge("resumeNode" as any, "jobMatchNode" as any);

// Conditional Edge
builder.addConditionalEdges("jobMatchNode" as any, shouldTailor as any);

// If tailoring is needed, loop back to job matching
builder.addEdge("tailoringNode" as any, "jobMatchNode" as any);

// Cover letter goes to Interview Prep
builder.addEdge("coverLetterNode" as any, "interviewNode" as any);

builder.addEdge("interviewNode" as any, END);

// Compile the workflow
export const careerCopilotGraph = builder.compile();
