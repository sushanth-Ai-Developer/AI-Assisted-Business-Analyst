
import { BrdDecisionRouter } from './brdDecisionRouter';
import { BrdToolExecutor } from './brdToolExecutor';
import { WorkflowState } from './schema';
import { updateStateWithLog } from './workflowState';

export class BrdAgentOrchestrator {
  private router: BrdDecisionRouter;
  private executor: BrdToolExecutor;
  private maxIterations = 5;

  constructor() {
    this.router = new BrdDecisionRouter();
    this.executor = new BrdToolExecutor();
  }

  async run(initialState: WorkflowState, onUpdate?: (state: WorkflowState) => void): Promise<WorkflowState> {
    let currentState: WorkflowState = { ...initialState, status: 'processing' };
    let iterations = 0;

    if (onUpdate) onUpdate(currentState);

    while (currentState.status === 'processing' && iterations < this.maxIterations) {
      iterations++;
      console.log(`Agent Iteration ${iterations}`);

      try {
        // 1. Get next decision from Router
        const decisionOutput = await this.router.getNextDecision(currentState);
        
        // 2. Log the decision
        currentState = updateStateWithLog(
          currentState, 
          decisionOutput.decision, 
          decisionOutput.reason, 
          decisionOutput.confidence
        );
        if (onUpdate) onUpdate(currentState);

        // 3. Execute the tool
        const stateUpdate = await this.executor.execute(decisionOutput.decision, currentState);
        
        // 4. Merge update into state
        currentState = { ...currentState, ...stateUpdate };
        
        // Handle terminal decisions from router
        if (decisionOutput.decision === 'STOP_WITH_REASON' || decisionOutput.decision === 'REJECT_NON_BRD') {
          currentState.status = 'completed';
        }

        if (onUpdate) onUpdate(currentState);

      } catch (error) {
        console.error("Orchestrator Loop Error:", error);
        currentState.status = 'failed';
        if (onUpdate) onUpdate(currentState);
        break;
      }
    }

    if (iterations >= this.maxIterations && currentState.status === 'processing') {
      currentState.status = 'completed'; // Safety break
      if (onUpdate) onUpdate(currentState);
    }

    return currentState;
  }
}
