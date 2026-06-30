export interface TimelineStep {
  label: string;
  completed: boolean;
}

export interface Evidence {
  source: string;
  quote: string;
}

export interface NextBestActionType {
  title: string;
  owner: string;
  due: string;
  reason: string;
  whyDescription: string;
  evidence?: Evidence[];
}

export interface DecisionBriefSection {
  title: string;
  content: string;
}

export interface ActionItem {
  id: string;
  status: string;
  task: string;
  owner: string;
  due: string;
  source: string;
}

export interface RiskItem {
  id: string;
  risk: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface GeneratedContent {
  draftEmail: string;
  draftWorkItem: {
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
  };
}

export interface DocumentMetadata {
  id: string;
  filename: string;
  extension: string;
  size: number;
  uploadedAt: string;
  status: 'Uploading' | 'Extracting' | 'Ready' | 'Failed';
  characterCount?: number;
  storagePath?: string;
  extractedTextPath?: string;
}

export interface ExecutedAction {
  id: string;
  title: string;
  owner: string;
  executedBy: string;
  workItemRef: string;
  executedAt: string;
  priority: string;
}

export interface AnalysisData {
  decisionBrief: DecisionBriefSection[];
  actionItems: ActionItem[];
  risks: RiskItem[];
  nextBestAction: NextBestActionType;
  generatedContent: GeneratedContent;
  aiConfidence: number;
  metadata: {
    analysisTimestamp: string;
    modelName: string;
    status: string;
    demoMode?: boolean;
  };
}

export interface WorkspaceData {
  id: string;
  name: string;
  scenario: string;
  documents: number;
  updated: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  aiConfidence: number;
  nextBestAction: NextBestActionType;
  timeline: TimelineStep[];
  decisionBrief: DecisionBriefSection[];
  actionItems: ActionItem[];
  risks: RiskItem[];
  generatedContent: GeneratedContent;
  files?: DocumentMetadata[];
  analysis?: AnalysisData;
  executedActions?: ExecutedAction[];
}

export interface Toast {
  id: string;
  message: string;
  subtext?: string;
  type: 'success' | 'info' | 'warning';
}
