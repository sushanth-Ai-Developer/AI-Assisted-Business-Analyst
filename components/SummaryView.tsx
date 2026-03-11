import React from 'react';
import type { Summary, Meta, Epic } from '../types';

interface SummaryViewProps {
  summary: Summary;
  meta: Meta;
  epics: Epic[];
}

const InfoCard: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 h-full">
        <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
        {children}
    </div>
);

const SummaryView: React.FC<SummaryViewProps> = ({ summary, meta, epics }) => {
  const storyCount = epics.reduce((acc, epic) => acc + epic.stories.length, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{meta.title}</h2>
            <p className="text-slate-500">
              Generated on {new Date(meta.generated_at).toLocaleString()} with <span className="font-semibold text-slate-600">{meta.confidence_note}</span> confidence.
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-center">
              <div className="text-2xl font-bold text-blue-700">{epics.length}</div>
              <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Epics</div>
            </div>
            <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 text-center">
              <div className="text-2xl font-bold text-indigo-700">{storyCount}</div>
              <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Stories</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
          <InfoCard title="Business Objective">
            <p className="text-slate-700">{summary.business_objective}</p>
          </InfoCard>

          <InfoCard title="Key Performance Indicators (KPIs)">
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {summary.kpis.map((kpi, index) => <li key={index}>{kpi}</li>)}
            </ul>
          </InfoCard>

          <InfoCard title="Assumptions">
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {summary.assumptions.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </InfoCard>

          <InfoCard title="Open Questions">
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {summary.open_questions.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </InfoCard>
      </div>
    </div>
  );
};

export default SummaryView;