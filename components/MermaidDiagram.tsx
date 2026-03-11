import React, { useEffect, useRef, useState } from 'react';
import { ExpandIcon } from './icons/ExpandIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import Modal from './ui/Modal';

declare global {
    interface Window {
        mermaid: any;
    }
}

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

const cleanMermaidChart = (chart: string): string => {
    if (!chart) return '';
    
    // Remove markdown code fences if they were accidentally included in the string
    let clean = chart.replace(/```mermaid\s*/g, '').replace(/```/g, '');

    // Remove all lines that look like "Mermaid version X.Y.Z" or similar meta-commentary
    // This handles various casings and positions
    clean = clean.replace(/^(mermaid\s+)?version.*$/gim, '');
    
    // Remove comments (%% ...)
    clean = clean.replace(/%%.*$/gm, '');
    
    // Trim whitespace
    clean = clean.trim();
    
    return clean;
};

// Function to perform a basic validation on the Mermaid chart string.
const isValidMermaidChart = (chart: string): boolean => {
    const cleanChart = cleanMermaidChart(chart);
    if (!cleanChart) return false;
    
    // A list of valid Mermaid diagram type declarations.
    const validStarters = [
        'flowchart', 
        'graph',
        'sequenceDiagram', 
        'gantt',
        'classDiagram',
        'stateDiagram',
        'erDiagram',
        'journey',
        'pie',
        'requirementDiagram',
        'mindmap',
        'timeline',
        'gitGraph',
        'C4Context',
        'C4Container',
        'C4Component',
        'C4Dynamic',
        'C4Deployment'
    ];
    
    // Check if the first non-empty line starts with a valid diagram type
    const lines = cleanChart.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return false; // Most diagrams need at least two lines (type + content)
    
    const firstLine = lines[0];
    return validStarters.some(starter => firstLine.startsWith(starter));
};


const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    if (!svg) return;
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagram-${id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (chart && window.mermaid) {
        const cleaned = cleanMermaidChart(chart);
        // Add a client-side check to ensure the diagram is valid before rendering.
        if (!isValidMermaidChart(cleaned)) {
            setError('Invalid diagram format: Missing or unknown diagram type declaration (e.g., "flowchart TD", "sequenceDiagram").');
            setSvg('');
            return;
        }

        window.mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, system-ui, sans-serif',
            flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
            gantt: { 
                axisFormat: '%m-%d',
                useMaxWidth: true,
                topPadding: 50,
                barHeight: 20,
                barGap: 4,
                gridLineStartPadding: 35,
                fontSize: 11,
                numberSectionStyles: 4,
            },
        });
      
        const renderMermaid = async () => {
          try {
            // Generate a unique ID for this specific render attempt to avoid conflicts
            const renderId = `mermaid-${id}-${Math.random().toString(36).substring(2, 9)}`;
            const { svg } = await window.mermaid.render(renderId, cleaned);
            setSvg(svg);
            setError('');
          } catch (e) {
            console.error("Mermaid rendering error:", e);
            let message = "An unknown error occurred during rendering.";
            if (e instanceof Error) {
                message = e.message;
            } else if (typeof e === 'string') {
                message = e;
            }
            
            // Clean up common Mermaid error noise
            const cleanMessage = message.split('</pre>')[0].replace(/<[^>]*>?/gm, '');
            setError(cleanMessage);
            setSvg('');
          }
        };

        renderMermaid();
    }
  }, [chart, id]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
        <p className="font-bold">Diagram Rendering Error</p>
        <p className="text-sm mt-1">{error}</p>
        <details className="mt-2 text-xs">
          <summary className="cursor-pointer font-semibold">Show Raw Diagram Code</summary>
          <pre className="mt-2 whitespace-pre-wrap font-mono bg-red-50 p-2 rounded">{chart}</pre>
        </details>
      </div>
    );
  }

  const diagramContent = (
      <div
        className="mermaid-container flex justify-center items-center w-full h-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
  );

  return (
    <div className="relative group border border-slate-100 rounded-lg bg-slate-50/50 p-2">
      <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-1.5 bg-white shadow-sm border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          title="Copy Mermaid Code"
        >
          {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <ClipboardIcon className="h-4 w-4" />}
        </button>
        <button
          onClick={handleDownload}
          className="p-1.5 bg-white shadow-sm border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          title="Download SVG"
          disabled={!svg}
        >
          <DownloadIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-1.5 bg-white shadow-sm border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          title="Expand View"
        >
          <ExpandIcon className="h-4 w-4" />
        </button>
      </div>
      
      <div className="overflow-hidden min-h-[200px] flex items-center justify-center" ref={containerRef}>
        {diagramContent}
      </div>
      
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="w-full h-full p-4 sm:p-8 bg-white overflow-auto flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="text-lg font-bold text-slate-800">Diagram Preview</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200"
                    >
                      {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <ClipboardIcon className="h-4 w-4" />}
                      <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      <span>Download SVG</span>
                    </button>
                  </div>
                </div>
                <div className="flex-grow flex items-center justify-center">
                  {diagramContent}
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default MermaidDiagram;
