import React from 'react';
import { Visuals } from '../types';
import MermaidDiagram from './MermaidDiagram';

interface DiagramsViewProps {
  visuals: Visuals;
}

const DiagramCard: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>
        <div className="overflow-x-auto">
          {children}
        </div>
    </div>
);

const DiagramsView: React.FC<DiagramsViewProps> = ({ visuals }) => {
  return (
    <div className="space-y-8">
      <DiagramCard title="Business Process Flow">
        <MermaidDiagram chart={visuals.process_flow_mermaid} id="flow-diagram" key={`flow-${visuals.process_flow_mermaid.length}`} />
      </DiagramCard>
      <DiagramCard title="System Sequence Diagram">
        <MermaidDiagram chart={visuals.sequence_mermaid} id="sequence-diagram" key={`seq-${visuals.sequence_mermaid.length}`} />
      </DiagramCard>
      {visuals.swimlane_mermaid && (
          <DiagramCard title="Team/Actor Swimlane Diagram">
              <MermaidDiagram chart={visuals.swimlane_mermaid} id="swimlane-diagram" key={`swim-${visuals.swimlane_mermaid.length}`} />
          </DiagramCard>
      )}
      {visuals.dependency_mermaid && (
          <DiagramCard title="Epic & Story Dependency Graph">
              <MermaidDiagram chart={visuals.dependency_mermaid} id="dependency-diagram" key={`dep-${visuals.dependency_mermaid.length}`} />
          </DiagramCard>
      )}
    </div>
  );
};

export default DiagramsView;