import { CareerState } from "./state";

export const shouldTailor = (state: CareerState): "tailoringNode" | "coverLetterNode" => {
  // Conditional Routing: IF ATS score < 70 -> Resume Tailoring Agent -> Re-run Job Matching Agent
  // ELSE Continue -> Cover Letter Agent
  if (state.atsScore < 70 && !state.completedSteps.includes("resumeTailoring")) {
    return "tailoringNode";
  }
  return "coverLetterNode";
};
