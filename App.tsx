import React, { useState, useCallback, useEffect } from 'react';
import { GeneratedOutput } from './types';
import { generateProductArchitecture } from './services/geminiService';
import BrdInput from './components/BrdInput';
import { LogoIcon } from './components/icons/LogoIcon';
import ProgressIndicator from './components/ProgressIndicator';
import DashboardLayout from './components/DashboardLayout';
import { Welcome } from './components/Welcome';


type GenerationStatus = 'idle' | 'analyzing' | 'success' | 'error';

const App: React.FC = () => {
  const [brdText, setBrdText] = useState<string>('');
  const [generatedData, setGeneratedData] = useState<GeneratedOutput | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isTakingLong, setIsTakingLong] = useState(false);

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
    }, 30000); // 30 seconds

    try {
      const result = await generateProductArchitecture(brdText);
      clearTimeout(longTimer);
      setGeneratedData(result);
      setStatus('success');
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
              <div className="flex flex-col items-center">
                <ProgressIndicator />
                {isTakingLong && (
                  <p className="mt-4 text-amber-600 animate-pulse font-medium">
                    This is taking longer than usual. Please wait, or refresh if it takes more than 2 minutes.
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