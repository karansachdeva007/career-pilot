export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string;
  applyUrl: string;
  location: string;
  matchScore: number;
}

export interface CareerState {
  userId: string;
  userName: string;
  resumeText: string;
  extractedSkills: string[];
  atsScore: number;
  matchedJobs: Job[];
  selectedJob: Job | null;
  missingSkills: string[];
  tailoredResume: string;
  coverLetter: string;
  interviewPlan: string;
  completedSteps: string[];
  errors: string[];
  [key: string]: any;
}

export const initialCareerState: CareerState = {
  userId: "",
  userName: "",
  resumeText: "",
  extractedSkills: [],
  atsScore: 0,
  matchedJobs: [],
  selectedJob: null,
  missingSkills: [],
  tailoredResume: "",
  coverLetter: "",
  interviewPlan: "",
  completedSteps: [],
  errors: [],
};
