import React, { useState } from 'react';
import { GeneratedOutput } from '../types';
import SidebarNav from './SidebarNav';
import SummaryView from './SummaryView';
import EpicsView from './EpicsView';
import ApiDocsView from './ApiDocsView';
import DiagramsView from './DiagramsView';

interface DashboardLayoutProps {
  data: GeneratedOutput;
  onReset: () => void;
}

type View = 'summary' | 'epics' | 'diagrams' | 'api';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ data, onReset }) => {
  const [activeView, setActiveView] = useState<View>('summary');

  const renderContent = () => {
    switch (activeView) {
      case 'summary':
        return <SummaryView summary={data.summary} meta={data.meta} epics={data.epics} />;
      case 'epics':
        return <EpicsView epics={data.epics} />;
      case 'diagrams':
        return <DiagramsView visuals={data.visuals} />;
      case 'api':
        return <ApiDocsView apiDocs={data.api_docs} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start gap-8">
      <div className="w-full md:w-64 lg:w-72 md:sticky md:top-28">
        <SidebarNav 
            activeView={activeView} 
            setActiveView={setActiveView}
            data={data}
        />
      </div>
      <div className="flex-1 w-full min-w-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardLayout;