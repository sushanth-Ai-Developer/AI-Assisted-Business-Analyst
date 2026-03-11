import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { UploadIcon } from './icons/UploadIcon';
import { SAMPLE_BRD } from '../constants';

// Set worker source for pdf.js to work correctly from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.5.136/build/pdf.worker.mjs`;

interface BrdInputProps {
  value: string;
  onTextChange: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const BrdInput: React.FC<BrdInputProps> = ({ value, onTextChange, onGenerate, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      let text = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const pageTexts = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
          pageTexts.push(pageText);
        }
        text = pageTexts.join('\n\n');
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
      }
      onTextChange(text);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read file content.';
      console.error('File parsing error:', err);
      setUploadError(message);
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = ''; // Allow re-uploading the same file
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
      <div className="flex justify-between items-center mb-3">
        <label htmlFor="brd-input" className="block text-lg font-semibold text-slate-800">
          1. Provide Business Requirements
        </label>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onTextChange(SAMPLE_BRD.trim())}
            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
          >
            Try Sample BRD
          </button>
          {value && (
            <button 
              onClick={() => onTextChange('')}
              className="text-xs text-slate-500 hover:text-red-500 transition-colors"
            >
              Clear Text
            </button>
          )}
        </div>
      </div>
      <textarea
        id="brd-input"
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste your BRD content here, or upload a file below..."
        className="w-full h-64 p-4 bg-slate-100/70 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 resize-y transition-colors"
        disabled={isLoading || isUploading}
      />
      {value.length > 15000 && (
        <p className="mt-2 text-xs text-amber-600 font-medium">
          Note: Your BRD is quite large ({Math.round(value.length / 1024)} KB). The analysis will prioritize breadth across all modules.
        </p>
      )}
      <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={isLoading || isUploading}
          />
          <button
            onClick={handleUploadClick}
            disabled={isLoading || isUploading}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {isUploading ? (
               <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadIcon className="h-5 w-5" />
                <span>Upload BRD (.pdf, .docx)</span>
              </>
            )}
          </button>
          {uploadError && <p className="text-red-600 text-sm mt-2">{uploadError}</p>}
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading || isUploading || !value.trim()}
          className="px-8 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 disabled:translate-y-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            '2. Generate Architecture'
          )}
        </button>
      </div>
    </div>
  );
};

export default BrdInput;