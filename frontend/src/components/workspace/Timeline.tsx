
import type { WorkspaceData } from '../../types/workspace';

interface TimelineProps {
  workspace: WorkspaceData;
}

function deriveTimelineStages(workspace: WorkspaceData) {
  const hasDocuments = (workspace.files?.length ?? 0) > 0 || workspace.documents > 0;
  const hasAnalysis = !!workspace.analysis || workspace.status === 'Analysis Complete' || workspace.status === 'Action Executed';
  const hasDecision = hasAnalysis && !!(workspace.analysis?.nextBestAction ?? workspace.nextBestAction);
  const hasApproval = (workspace.executedActions?.length ?? 0) > 0 ||
    workspace.timeline?.some(s => s.label === 'Action Approved' && s.completed);
  const hasExecution = (workspace.executedActions?.length ?? 0) > 0 ||
    workspace.status === 'Action Executed' ||
    workspace.timeline?.some(s => s.label === 'Action Executed' && s.completed);

  return [
    { label: 'Workspace Created',    completed: true },
    { label: 'Documents Uploaded',   completed: hasDocuments },
    { label: 'AI Analysis Completed',completed: hasAnalysis },
    { label: 'Decision Generated',   completed: hasDecision },
    { label: 'Action Approved',      completed: hasApproval },
    { label: 'Action Executed',      completed: hasExecution },
  ];
}

export default function Timeline({ workspace }: TimelineProps) {
  const stages = deriveTimelineStages(workspace);
  const completedCount = stages.filter(s => s.completed).length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Workspace Progress</h2>
        <span className="text-xs font-semibold text-slate-500">{completedCount}/{stages.length} stages</span>
      </div>
      <div className="bg-white p-6 border border-slate-200 rounded-md shadow-sm">
        <div className="relative">
          {/* connector line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100" />
          {/* progress fill */}
          <div
            className="absolute top-4 left-4 h-0.5 bg-blue-500 transition-all duration-700"
            style={{ width: `calc(${Math.max(0, ((completedCount - 1) / (stages.length - 1))) * 100}% - 0px)` }}
          />

          <div className="relative flex justify-between">
            {stages.map((stage, i) => (
              <div key={i} className="flex flex-col items-center gap-2 relative" style={{ minWidth: 0, flex: 1 }}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 border-2 transition-all duration-300 ${
                    stage.completed
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200'
                      : 'bg-white border-slate-300 text-slate-300'
                  }`}
                >
                  {stage.completed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-200" />
                  )}
                </div>
                <span className={`text-xs text-center font-medium leading-tight px-1 ${
                  stage.completed ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
