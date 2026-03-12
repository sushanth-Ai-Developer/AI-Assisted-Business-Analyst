
import { WorkflowState, AgentLog, AgentDecision } from './schema';

export const createInitialState = (content: string, name: string, type: string, size: number): WorkflowState => ({
  documentContent: content,
  documentMetadata: { name, type, size },
  isValidated: false,
  isRejected: false,
  needsMoreDetail: false,
  hasSummary: false,
  hasRequirements: false,
  hasEpics: false,
  hasStories: false,
  hasDiagrams: false,
  hasApiSpecs: false,
  hasExports: false,
  data: {
    meta: {
      title: "Product Architecture Blueprint",
      source: "BRD Analysis",
      generated_at: new Date().toISOString(),
      confidence_note: ""
    },
    summary: null,
    epics: [],
    ui_blueprint: null,
    visuals: null,
    api_docs: null,
    tables_for_excel: null,
    files: {}
  },
  logs: [],
  status: 'idle'
});

export const updateStateWithLog = (state: WorkflowState, decision: AgentDecision, reason: string, confidence: number): WorkflowState => {
  const newLog: AgentLog = {
    timestamp: new Date().toISOString(),
    decision,
    reason,
    confidence
  };
  return {
    ...state,
    logs: [...state.logs, newLog]
  };
};
