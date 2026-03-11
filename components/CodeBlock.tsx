import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-slate-100/70 rounded-lg border border-slate-200 relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-white/50 backdrop-blur-sm rounded-md text-slate-600 hover:bg-white/80 hover:text-slate-900 opacity-50 group-hover:opacity-100 transition-all"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <CheckIcon className="h-5 w-5 text-green-600" />
        ) : (
          <ClipboardIcon className="h-5 w-5" />
        )}
      </button>
      <pre className="p-4 text-sm text-slate-800 overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;