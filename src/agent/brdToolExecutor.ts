
import { GoogleGenAI } from "@google/genai";
import { WorkflowState, AgentDecision } from './schema';
import { generateProductArchitecture } from '../../services/geminiService';

export class BrdToolExecutor {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.VITE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found for Tool Executor.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async execute(decision: AgentDecision, state: WorkflowState): Promise<Partial<WorkflowState>> {
    console.log(`Executing tool for decision: ${decision}`);
    
    switch (decision) {
      case 'VALIDATE_DOCUMENT_TYPE':
        return this.validateDocument(state);
      case 'SUMMARIZE_BRD':
      case 'GENERATE_EPICS':
      case 'GENERATE_USER_STORIES':
      case 'GENERATE_DIAGRAMS':
      case 'GENERATE_API_SPECS':
        // For now, we reuse the main generator but we could make it more granular
        // The user wants to reuse existing generators.
        return this.runFullGeneration(state);
      case 'REJECT_NON_BRD':
        return { isRejected: true, status: 'completed' };
      case 'REQUEST_MORE_DETAIL':
        return { needsMoreDetail: true, status: 'awaiting_input' };
      case 'STOP_WITH_REASON':
        return { status: 'completed' };
      default:
        return {};
    }
  }

  private async validateDocument(state: WorkflowState): Promise<Partial<WorkflowState>> {
    const prompt = `
      Analyze the following document content and determine if it is a Business Requirements Document (BRD) or a software requirements artifact.
      
      Content:
      ${state.documentContent.substring(0, 5000)}
      
      Return JSON:
      {
        "isValidBRD": boolean,
        "reason": "string",
        "confidence": number,
        "isWeak": boolean
      }
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const result = JSON.parse(response.text);
    return {
      isValidated: true,
      isRejected: !result.isValidBRD,
      rejectionReason: result.isValidBRD ? undefined : result.reason,
      needsMoreDetail: result.isWeak
    };
  }

  private async runFullGeneration(state: WorkflowState): Promise<Partial<WorkflowState>> {
    // Reuse the existing generator
    const data = await generateProductArchitecture(state.documentContent);
    return {
      data,
      hasSummary: !!data.summary,
      hasEpics: data.epics.length > 0,
      hasStories: data.epics.some(e => e.stories.length > 0),
      hasDiagrams: !!data.visuals,
      hasApiSpecs: !!data.api_docs,
      status: 'completed' // In this simple version, full generation completes the task
    };
  }
}
