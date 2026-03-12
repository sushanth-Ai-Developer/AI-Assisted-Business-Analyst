import React, { useState, useCallback, useEffect } from 'react';
import { GeneratedOutput } from './types';
import BrdInput from './components/BrdInput';
import { LogoIcon } from './components/icons/LogoIcon';
import ProgressIndicator from './components/ProgressIndicator';
import DashboardLayout from './components/DashboardLayout';
import { Welcome } from './components/Welcome';
import { BrdAgentOrchestrator } from './src/agent/brdAgentOrchestrator';
import { createInitialState } from './src/agent/workflowState';
import { WorkflowState } from './src/agent/schema';
import AgentLogView from './src/components/AgentLogView';

type GenerationStatus = 'idle' | 'analyzing' | 'success' | 'error';

const App: React.FC = () => {
  const [brdText, setBrdText] = useState<string>('');
  const [generatedData, setGeneratedData] = useState<GeneratedOutput | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [agentState, setAgentState] = useState<WorkflowState | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!brdText.trim()) {
      setError('BRD text cannot be empty.');
      return;
    }
    setStatus('analyzing');
    setError(null);
    setGeneratedData(null);
    setIsTakingLong(false);

    const longTimer = setTimeout(() => {
      setIsTakingLong(true);
    }, 45000); // 45 seconds for agentic flow

    try {
      const orchestrator = new BrdAgentOrchestrator();
      const initialState = createInitialState(brdText, "Uploaded Document", "text/plain", brdText.length);
      
      const finalState = await orchestrator.run(initialState, (updatedState) => {
        setAgentState(updatedState);
      });

      clearTimeout(longTimer);

      if (finalState.isRejected) {
        setError(`Document Rejected: ${finalState.rejectionReason || 'The uploaded file does not appear to be a valid BRD.'}`);
        setStatus('error');
      } else if (finalState.needsMoreDetail) {
        setError(`More Detail Required: The document is too high-level. Please provide more functional requirements.`);
        setStatus('error');
      } else if (finalState.status === 'failed') {
        setError('Agent failed to complete the analysis. Please check the logs.');
        setStatus('error');
      } else {
        setGeneratedData(finalState.data);
        setStatus('success');
      }
    } catch (err) {
      clearTimeout(longTimer);
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate architecture. Details: ${errorMessage}`);
      setStatus('error');
    }
  }, [brdText]);

  const handleReset = () => {
    setBrdText('');
    setGeneratedData(null);
    setStatus('idle');
    setError(null);
    setAgentState(null);
  };

  const renderContent = () => {
    switch (status) {
      case 'success':
        return generatedData ? <DashboardLayout data={generatedData} onReset={handleReset} /> : null;
      case 'error':
         return (
          <div className="mt-6 p-6 bg-red-50 border border-red-200 text-red-900 rounded-lg max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-2">Generation Failed</h3>
            <p className="mb-4">{error}</p>
            <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
                Try Again
            </button>
          </div>
        );
      case 'analyzing':
      case 'idle':
      default:
        return (
          <>
            <BrdInput
              value={brdText}
              onTextChange={setBrdText}
              onGenerate={handleGenerate}
              isLoading={status === 'analyzing'}
            />
            {status === 'analyzing' && (
              <div className="flex flex-col items-center w-full">
                <ProgressIndicator />
                {agentState && <AgentLogView logs={agentState.logs} />}
                {isTakingLong && (
                  <p className="mt-4 text-amber-600 animate-pulse font-medium">
                    This is taking longer than usual. The agent is performing deep reasoning.
                  </p>
                )}
              </div>
            )}
            {status === 'idle' && <Welcome />}
          </>
        )
    }
  }

  return (
    <div className="min-h-screen font-sans">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/80">
        <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                  <LogoIcon className="h-10 w-10 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">AI-Assisted Business Analyst</h1>
                    <p className="text-slate-500">Converts BRD/business inputs into user stories, diagrams, and API specs.</p>
                  </div>
              </div>
               {status === 'success' && (
                   <button 
                      onClick={handleReset} 
                      className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg border border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                      New Analysis
                  </button>
               )}
            </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      
      <footer className="text-center p-4 text-slate-500 text-sm mt-8">
        Powered by Gemini API
      </footer>
    </div>
  );
};

export default App;