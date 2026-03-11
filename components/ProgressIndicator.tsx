
import React, { useState, useEffect } from 'react';

const analysisSteps = [
  "Parsing Business Requirements Document...",
  "Identifying key entities and user roles...",
  "Structuring epics and business value...",
  "Decomposing features into user stories...",
  "Generating BDD acceptance criteria...",
  "Creating process flow diagrams...",
  "Finalizing API specifications...",
  "Assembling the final architecture...",
];

const ProgressIndicator: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState(analysisSteps[0]);

  useEffect(() => {
    // Animate progress from 0 to 99% over ~25 seconds to give a realistic feel for deep analysis.
    const totalDuration = 25000;
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const progressValue = Math.min(Math.floor((elapsed / totalDuration) * 100), 99);
      setProgress(progressValue);

      if (elapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    // Update the descriptive text based on the current progress percentage.
    const stepsCount = analysisSteps.length;
    const stepIndex = Math.min(Math.floor(progress / (100 / stepsCount)), stepsCount - 1);
    setStepText(analysisSteps[stepIndex]);
  }, [progress]);

  return (
    <div className="mt-8 flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto text-center">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-4 border-blue-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-4 border-t-blue-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-blue-600">
            {progress}%
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Architecting Your Product</h2>
      <p className="text-lg text-slate-500 w-full overflow-hidden">
        {stepText}
      </p>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-linear" 
            style={{ width: `${progress}%` }}>
          </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;