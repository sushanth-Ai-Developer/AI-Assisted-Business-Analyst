
export type AgentDecision = 
  | 'VALIDATE_DOCUMENT_TYPE'
  | 'SUMMARIZE_BRD'
  | 'EXTRACT_REQUIREMENTS'
  | 'GENERATE_EPICS'
  | 'GENERATE_USER_STORIES'
  | 'GENERATE_DIAGRAMS'
  | 'GENERATE_API_SPECS'
  | 'REQUEST_MORE_DETAIL'
  | 'REJECT_NON_BRD'
  | 'GENERATE_EXPORTS'
  | 'STOP_WITH_REASON';

export interface DecisionOutput {
  decision: AgentDecision;
  confidence: number;
  reason: string;
  next_step: string;
  allow_export: boolean;
  needs_user_action: boolean;
}

export interface AgentLog {
  timestamp: string;
  decision: AgentDecision;
  reason: string;
  confidence: number;
}

export interface WorkflowState {
  documentContent: string;
  documentMetadata: {
    name: string;
    type: string;
    size: number;
  };
  isValidated: boolean;
  isRejected: boolean;
  rejectionReason?: string;
  needsMoreDetail: boolean;
  clarificationRequest?: string;
  
  // Progress flags
  hasSummary: boolean;
  hasRequirements: boolean;
  hasEpics: boolean;
  hasStories: boolean;
  hasDiagrams: boolean;
  hasApiSpecs: boolean;
  hasExports: boolean;
  
  // Data storage
  data: any; // This will store the generated pieces
  logs: AgentLog[];
  status: 'idle' | 'processing' | 'completed' | 'failed' | 'awaiting_input';
}
