import { CareerState } from "./state";
import { analyzeResume } from "../agents/resume-agent";
import { matchJobs } from "../agents/job-agent";
import { tailorResume } from "../agents/tailoring-agent";
import { generateCoverLetter } from "../agents/cover-letter-agent";
import { generateInterviewPlan } from "../agents/interview-agent";

export const resumeNode = async (state: CareerState): Promise<Partial<CareerState>> => {
  try {
    const analysis = await analyzeResume(state.resumeText);
    
    return {
      extractedSkills: analysis.skills || [],
      atsScore: analysis.ats_score || 0,
      completedSteps: [...state.completedSteps, "resumeAnalysis"]
    };
  } catch (error: any) {
    return { errors: [...state.errors, `Resume Analysis Error: ${error.message}`] };
  }
};

export const jobMatchNode = async (state: CareerState): Promise<Partial<CareerState>> => {
  try {
    const jobs = await matchJobs(state.extractedSkills);
    const topJob = jobs.length > 0 ? jobs[0] : null;

    // Detect missing skills for the top job
    let missingSkills: string[] = [];
    if (topJob) {
      const jobSkills = topJob.requiredSkills.split(",").map((s: string) => s.trim().toLowerCase());
      const userSkillsLower = state.extractedSkills.map(s => s.toLowerCase());
      missingSkills = jobSkills.filter((js: string) => 
        !userSkillsLower.some(us => us.includes(js) || js.includes(us))
      ).filter(Boolean);
    }

    return {
      matchedJobs: jobs,
      selectedJob: topJob,
      missingSkills,
      completedSteps: [...state.completedSteps, "jobMatching"]
    };
  } catch (error: any) {
    return { errors: [...state.errors, `Job Match Error: ${error.message}`] };
  }
};

export const tailoringNode = async (state: CareerState): Promise<Partial<CareerState>> => {
  try {
    if (!state.selectedJob) return {};

    const tailoredText = await tailorResume(state.resumeText, state.selectedJob.description);
    
    // Simulate re-running ATS score for the newly tailored resume
    const reAnalysis = await analyzeResume(tailoredText);

    return {
      tailoredResume: tailoredText,
      atsScore: reAnalysis.ats_score || state.atsScore,
      extractedSkills: reAnalysis.skills || state.extractedSkills,
      completedSteps: [...state.completedSteps, "resumeTailoring"]
    };
  } catch (error: any) {
    return { errors: [...state.errors, `Tailoring Error: ${error.message}`] };
  }
};

export const coverLetterNode = async (state: CareerState): Promise<Partial<CareerState>> => {
  try {
    if (!state.selectedJob) return {};

    const activeResume = state.tailoredResume || state.resumeText;
    const cl = await generateCoverLetter(activeResume, state.selectedJob.description, state.userName);

    return {
      coverLetter: cl,
      completedSteps: [...state.completedSteps, "coverLetter"]
    };
  } catch (error: any) {
    return { errors: [...state.errors, `Cover Letter Error: ${error.message}`] };
  }
};

export const interviewNode = async (state: CareerState): Promise<Partial<CareerState>> => {
  try {
    if (!state.selectedJob) return {};

    const activeResume = state.tailoredResume || state.resumeText;
    const prep = await generateInterviewPlan(activeResume, state.selectedJob.description);

    return {
      interviewPlan: prep,
      completedSteps: [...state.completedSteps, "interviewPrep"]
    };
  } catch (error: any) {
    return { errors: [...state.errors, `Interview Prep Error: ${error.message}`] };
  }
};
