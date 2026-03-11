
export interface Meta {
  title: string;
  source: string;
  generated_at: string;
  confidence_note: string;
}

export interface Summary {
  business_objective: string;
  kpis: string[];
  assumptions: string[];
  open_questions: string[];
}

export interface Task {
  id: string;
  task: string;
  estimate_points: number;
  assignee_suggested: string;
}

export interface Story {
  id: string;
  title: string;
  user_story: string;
  description: string;
  acceptance_criteria_bdd: string[];
  definition_of_done: string[];
  tasks: Task[];
  estimate_points: number;
  non_functional_requirements: string[];
  dependencies: string[];
  risks: string[];
}

export interface Epic {
  id: string;
  name: string;
  business_value: string;
  priority: 'High' | 'Medium' | 'Low';
  target_duration_weeks: number;
  owner_team: string;
  dependencies: string[];
  risks: string[];
  stories: Story[];
}

export interface Panel {
  id: string;
  title: string;
  widgets: string[];
}

export interface DownloadAction {
  id: string;
  label: string;
  file_ref: string;
}

export interface Accessibility {
  wcag: string;
  keyboard_support: boolean;
  prefers_reduced_motion: boolean;
}

export interface UiBlueprint {
  panels: Panel[];
  download_actions: DownloadAction[];
  accessibility: Accessibility;
}

export interface Visuals {
  process_flow_mermaid: string;
  sequence_mermaid: string;
  swimlane_mermaid: string;
  dependency_mermaid: string;
}

export interface ErrorCatalogItem {
  code: string;
  http: number;
  message: string;
  remediation: string;
}

export interface ApiDocs {
  openapi_yaml: string;
  examples: {
    curl: string[];
  };
  error_catalog: ErrorCatalogItem[];
}

export interface SheetData {
  [key: string]: Record<string, string | number>[];
}

export interface TablesForExcel {
  sheets: SheetData;
}

export interface Files {
  excel_base64: string;
  csv_fallback: {
    [key: string]: string;
  };
}

export interface GeneratedOutput {
  meta: Meta;
  summary: Summary;
  epics: Epic[];
  ui_blueprint: UiBlueprint;
  visuals: Visuals;
  api_docs: ApiDocs;
  tables_for_excel: TablesForExcel;
  files: Files;
}
