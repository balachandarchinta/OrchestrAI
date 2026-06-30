import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import type { WorkspaceData } from '../types/workspace';
import Timeline from '../components/workspace/Timeline';
import NextBestAction from '../components/workspace/NextBestAction';
import ExecutiveBriefTab from '../components/workspace/Tabs/ExecutiveBriefTab';
import ActionPlanTab from '../components/workspace/Tabs/ActionPlanTab';
import RisksTab from '../components/workspace/Tabs/RisksTab';
import GeneratedContentTab from '../components/workspace/Tabs/GeneratedContentTab';
import DeleteWorkspaceModal from '../components/workspace/Modals/DeleteWorkspaceModal';
import UploadArea from '../components/workspace/UploadArea';
import { ArrowLeft, Loader2, Sparkles, AlertCircle, Trash2, Info } from 'lucide-react';

const LOADING_MESSAGES = [
  'Reading Documents...',
  'Understanding Business Context...',
  'Generating Decision Intelligence...',
  'Building Recommendations...',
  'Finalizing Analysis...',
];

export default function WorkspaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workspaces, loading, analyzeWorkspace, deleteWorkspace } = useWorkspaceContext();

  const [activeTab, setActiveTab] = useState('brief');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [isDeletingModalOpen, setIsDeletingModalOpen] = useState(false);
  const [isDeletingWorkspace, setIsDeletingWorkspace] = useState(false);

  // Local workspace state — updated after executeAction without full re-fetch flicker
  const [localWorkspace, setLocalWorkspace] = useState<WorkspaceData | null>(null);

  // Find workspace from context
  const contextWorkspace = workspaces.find(ws => ws.id === id) ?? null;
  // Prefer localWorkspace if it's for the same ID (most up-to-date after action execution)
  const workspace = (localWorkspace?.id === id ? localWorkspace : contextWorkspace);

  // Sync local workspace when context workspace changes (e.g., from fetch)
  useEffect(() => {
    if (contextWorkspace) {
      setLocalWorkspace(contextWorkspace);
    }
  }, [contextWorkspace]);

  const handleWorkspaceUpdate = useCallback((updated: WorkspaceData) => {
    setLocalWorkspace(updated);
  }, []);

  const handleDeleteWorkspace = async () => {
    if (!id) return;
    setIsDeletingWorkspace(true);
    try {
      await deleteWorkspace(id);
      navigate('/workspaces');
    } catch (err: any) {
      console.error('Failed to delete workspace', err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Failed to delete workspace. Please try again.';
      alert(backendMessage);
    } finally {
      setIsDeletingWorkspace(false);
      setIsDeletingModalOpen(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (loading && !workspace) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Loading workspace data...</p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center h-64 text-slate-500">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Workspace Not Found</h2>
        <p className="mb-6">The workspace you are looking for does not exist.</p>
        <Link
          to="/workspaces"
          className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors"
        >
          Return to Workspaces
        </Link>
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (!id) return;
    setIsAnalyzing(true);
    setAnalyzeError(null);
    setLoadingMsgIdx(0);
    try {
      await analyzeWorkspace(id);
    } catch (err: any) {
      setAnalyzeError(err.response?.data?.detail || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentBrief   = workspace.analysis?.decisionBrief ?? workspace.decisionBrief;
  const currentPlan    = workspace.analysis?.actionItems    ?? workspace.actionItems;
  const currentRisks   = workspace.analysis?.risks          ?? workspace.risks;
  const currentContent = workspace.analysis?.generatedContent ?? workspace.generatedContent;
  const isDemoMode     = workspace.analysis?.metadata?.demoMode === true;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link
          to="/workspaces"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Workspaces
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{workspace.name}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDeletingModalOpen(true)}
            disabled={isAnalyzing}
            title={isAnalyzing ? 'Cannot delete while analysis is in progress.' : 'Delete Workspace'}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-sm font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-slate-300"
          >
            <Trash2 size={16} /> Delete
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`px-4 py-2 text-white text-sm font-medium rounded transition-colors flex items-center gap-2 ${
              isAnalyzing ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                {LOADING_MESSAGES[loadingMsgIdx]}
              </>
            ) : (
              <>
                <Sparkles size={16} /> Analyze Workspace
              </>
            )}
          </button>
        </div>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="mb-5 bg-blue-50 border border-blue-200 rounded-md px-4 py-3 flex items-start gap-3">
          <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Demo Mode</p>
            <p className="text-xs text-blue-600 mt-0.5">
              The AI service is temporarily unavailable. Displaying cached enterprise analysis for demonstration purposes.
            </p>
          </div>
        </div>
      )}

      {/* Analysis Error */}
      {analyzeError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{analyzeError}</p>
        </div>
      )}

      {/* Metadata Bar */}
      <div className="flex gap-8 mb-8 text-sm bg-white p-4 rounded-md border border-slate-200 shadow-sm flex-wrap">
        <div>
          <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Documents</span>
          <span className="font-medium text-slate-800">{workspace.documents}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Last Updated</span>
          <span className="font-medium text-slate-800">{workspace.updated}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Analysis Status</span>
          <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {workspace.analysis?.metadata?.status ?? workspace.status}
          </span>
        </div>
        {workspace.analysis && (
          <>
            <div>
              <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Last Analyzed</span>
              <span className="font-medium text-slate-800">{workspace.analysis.metadata.analysisTimestamp}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">AI Model</span>
              <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {workspace.analysis.metadata.modelName}
              </span>
            </div>
          </>
        )}
        {(workspace.executedActions?.length ?? 0) > 0 && (
          <div>
            <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Actions Executed</span>
            <span className="font-medium text-emerald-700">{workspace.executedActions!.length}</span>
          </div>
        )}
      </div>

      {/* Next Best Action */}
      <NextBestAction workspace={workspace} onWorkspaceUpdate={handleWorkspaceUpdate} />

      {/* Upload Area */}
      <UploadArea />

      {/* Timeline */}
      <Timeline workspace={workspace} />

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 mt-8">
        <nav className="-mb-px flex space-x-6">
          {[
            { id: 'brief',   label: 'Decision Brief' },
            { id: 'plan',    label: 'Pending Action Items' },
            { id: 'risks',   label: 'Identified Risks' },
            { id: 'content', label: 'Draft Communications' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mb-6">
        {activeTab === 'brief'   && currentBrief   && <ExecutiveBriefTab sections={currentBrief} />}
        {activeTab === 'plan'    && currentPlan     && <ActionPlanTab items={currentPlan} />}
        {activeTab === 'risks'   && currentRisks    && <RisksTab risks={currentRisks} />}
        {activeTab === 'content' && currentContent  && <GeneratedContentTab content={currentContent} />}
      </div>

      <DeleteWorkspaceModal
        isOpen={isDeletingModalOpen}
        isDeleting={isDeletingWorkspace}
        onClose={() => setIsDeletingModalOpen(false)}
        onConfirm={handleDeleteWorkspace}
      />
    </div>
  );
}
