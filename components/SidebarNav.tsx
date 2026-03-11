import React, { useState } from 'react';
import type { GeneratedOutput } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { SummaryIcon, EpicsIcon, DiagramsIcon, ApiIcon } from './icons/NavIcons';
import JSZip from 'jszip';

type View = 'summary' | 'epics' | 'diagrams' | 'api';

interface SidebarNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
  data: GeneratedOutput;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
      }`}
    >
      <Icon className="h-6 w-6" />
      <span className={`font-semibold ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>{label}</span>
    </button>
  );
};

const SidebarNav: React.FC<SidebarNavProps> = ({ activeView, setActiveView, data }) => {
    const [isZipping, setIsZipping] = useState(false);

    const handleDownloadExcel = () => {
        if (!data.files.excel_base64) {
            alert('No Excel data available to download.');
            return;
        }
        const link = document.createElement('a');
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${data.files.excel_base64}`;
        link.download = `${data.meta.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadZip = async () => {
        setIsZipping(true);
        try {
            const zip = new JSZip();
            const timestamp = new Date().toISOString().split('T')[0];
            const baseName = data.meta.title.replace(/\s+/g, '_');

            // 1. Summary
            const summaryContent = `
# ${data.meta.title}
Generated at: ${data.meta.generated_at}
Confidence: ${data.meta.confidence_note}

## Business Objective
${data.summary.business_objective}

## KPIs
${data.summary.kpis.map(k => `- ${k}`).join('\n')}

## Assumptions
${data.summary.assumptions.map(a => `- ${a}`).join('\n')}

## Open Questions
${data.summary.open_questions.map(q => `- ${q}`).join('\n')}
            `.trim();
            zip.file("summary.md", summaryContent);

            // 2. User Stories
            let storiesContent = `# User Stories - ${data.meta.title}\n\n`;
            data.epics.forEach(epic => {
                storiesContent += `## Epic: ${epic.name} (${epic.id})\n`;
                storiesContent += `**Business Value:** ${epic.business_value}\n`;
                storiesContent += `**Priority:** ${epic.priority}\n\n`;
                
                epic.stories.forEach(story => {
                    storiesContent += `### ${story.title} (${story.id})\n`;
                    storiesContent += `**Story:** ${story.user_story}\n\n`;
                    storiesContent += `**Description:**\n${story.description}\n\n`;
                    storiesContent += `**Acceptance Criteria:**\n${story.acceptance_criteria_bdd.join('\n')}\n\n`;
                    storiesContent += `**Definition of Done:**\n${story.definition_of_done.map(d => `- ${d}`).join('\n')}\n\n`;
                    storiesContent += `---\n\n`;
                });
            });
            zip.file("user_stories.md", storiesContent);

            // 3. Excel File
            if (data.files.excel_base64) {
                zip.file("project_data.xlsx", data.files.excel_base64, { base64: true });
            }

            // 4. Diagrams
            const diagramsFolder = zip.folder("diagrams");
            if (diagramsFolder) {
                diagramsFolder.file("process_flow.mmd", data.visuals.process_flow_mermaid);
                diagramsFolder.file("sequence.mmd", data.visuals.sequence_mermaid);
                if (data.visuals.swimlane_mermaid) diagramsFolder.file("swimlane.mmd", data.visuals.swimlane_mermaid);
                if (data.visuals.dependency_mermaid) diagramsFolder.file("dependency.mmd", data.visuals.dependency_mermaid);
            }

            // 5. API Docs
            const apiFolder = zip.folder("api");
            if (apiFolder) {
                apiFolder.file("openapi.yaml", data.api_docs.openapi_yaml);
                apiFolder.file("error_catalog.json", JSON.stringify(data.api_docs.error_catalog, null, 2));
                apiFolder.file("curl_examples.txt", data.api_docs.examples.curl.join('\n\n'));
            }

            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `${baseName}_Full_Pack_${timestamp}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Failed to generate ZIP:", error);
            alert("Failed to generate ZIP file.");
        } finally {
            setIsZipping(false);
        }
    };

    const downloadAction = data.ui_blueprint.download_actions.find(a => a.id === 'download_excel');

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 space-y-2">
      <NavItem icon={SummaryIcon} label="Summary & Insights" isActive={activeView === 'summary'} onClick={() => setActiveView('summary')} />
      <NavItem icon={EpicsIcon} label="Epics & Stories" isActive={activeView === 'epics'} onClick={() => setActiveView('epics')} />
      <NavItem icon={DiagramsIcon} label="Visual Diagrams" isActive={activeView === 'diagrams'} onClick={() => setActiveView('diagrams')} />
      <NavItem icon={ApiIcon} label="API Specifications" isActive={activeView === 'api'} onClick={() => setActiveView('api')} />
      
      <div className="pt-2 border-t border-slate-200 space-y-2">
        {downloadAction && data.files.excel_base64 && (
            <button
              onClick={handleDownloadExcel}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg border border-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
            >
              <DownloadIcon className="h-5 w-5" />
              <span>{downloadAction.label}</span>
            </button>
        )}

        <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <DownloadIcon className="h-5 w-5" />
            <span>{isZipping ? 'Preparing ZIP...' : 'Download Complete Pack (.zip)'}</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;
