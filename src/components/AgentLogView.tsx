
import React from 'react';
import { AgentLog } from '../agent/schema';

interface AgentLogViewProps {
  logs: AgentLog[];
}

const AgentLogView: React.FC<AgentLogViewProps> = ({ logs }) => {
  return (
    <div className="mt-6 w-full max-w-4xl mx-auto bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Agent Orchestration Logs</span>
        </div>
        <div className="text-slate-500 text-[10px] font-mono">v1.0.0-agentic</div>
      </div>
      <div className="p-4 font-mono text-sm h-64 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {logs.length === 0 && (
          <div className="text-slate-600 italic">Waiting for agent initialization...</div>
        )}
        {logs.map((log, index) => (
          <div key={index} className="animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className="text-emerald-400 font-bold shrink-0">{log.decision}</span>
              <span className="text-slate-500 shrink-0">conf: {(log.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="ml-6 text-slate-300 mt-1 leading-relaxed">
              <span className="text-slate-500 mr-2">reason:</span>
              {log.reason}
            </div>
            {index < logs.length - 1 && <div className="border-b border-slate-800/50 mt-3"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentLogView;
