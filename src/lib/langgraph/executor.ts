import { careerCopilotGraph } from "./workflow";
import { CareerState, initialCareerState } from "./state";

export const executeWorkflow = async (
  userId: string,
  userName: string,
  resumeText: string,
  onProgress?: (state: CareerState) => void
): Promise<CareerState> => {
  const initialState: CareerState = {
    ...initialCareerState,
    userId,
    userName,
    resumeText,
  };

  try {
    let currentState: CareerState = initialState;

    // Use stream to get step-by-step progress
    const stream = await careerCopilotGraph.stream(initialState as any);
    
    for await (const chunk of stream) {
      // The chunk contains the output of the node that just finished
      // We merge it into our tracking state
      const nodeName = Object.keys(chunk)[0];
      const nodeUpdate = (chunk as any)[nodeName] as Partial<CareerState>;
      
      currentState = { ...currentState, ...nodeUpdate };
      
      if (onProgress) {
        onProgress(currentState);
      }
    }

    return currentState;
  } catch (error: any) {
    console.error("Workflow Execution Failed:", error);
    throw error;
  }
};
