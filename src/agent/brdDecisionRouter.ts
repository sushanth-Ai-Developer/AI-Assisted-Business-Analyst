
import { GoogleGenAI } from "@google/genai";
import { AGENT_ROUTER_PROMPT } from './prompts';
import { WorkflowState, DecisionOutput } from './schema';

export class BrdDecisionRouter {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.VITE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found for Agent Router.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async getNextDecision(state: WorkflowState): Promise<DecisionOutput> {
    // Prepare the state for the prompt (remove large data blobs to save tokens)
    const stateSummary = {
      isValidated: state.isValidated,
      isRejected: state.isRejected,
      needsMoreDetail: state.needsMoreDetail,
      hasSummary: state.hasSummary,
      hasRequirements: state.hasRequirements,
      hasEpics: state.hasEpics,
      hasStories: state.hasStories,
      hasRaci: state.hasRaci,
      hasDiagrams: state.hasDiagrams,
      hasApiSpecs: state.hasApiSpecs,
      hasExports: state.hasExports,
      logCount: state.logs.length
    };

    const prompt = AGENT_ROUTER_PROMPT
      .replace('{{STATE_JSON}}', JSON.stringify(stateSummary, null, 2))
      .replace('{{DOCUMENT_CONTENT}}', state.documentContent.substring(0, 10000)); // Limit content size

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1, // Low temperature for deterministic routing
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from Router LLM");
      
      // Robust extraction in case the model still wraps in markdown
      let jsonString = text.trim();
      const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonString = jsonMatch[1].trim();
      } else {
        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonString = jsonString.substring(firstBrace, lastBrace + 1).trim();
        }
      }

      return JSON.parse(jsonString) as DecisionOutput;
    } catch (error) {
      console.error("Router Error:", error);
      throw error;
    }
  }
}
