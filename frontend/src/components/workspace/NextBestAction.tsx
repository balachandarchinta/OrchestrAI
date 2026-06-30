import { useState } from 'react';
import { Play, User, Calendar, HelpCircle, CheckCircle, Briefcase, Clock } from 'lucide-react';
import type { WorkspaceData } from '../../types/workspace';
import ExplainabilityPanel from './ExplainabilityPanel';
import ExecuteActionModal from './Modals/ExecuteActionModal';

interface NextBestActionProps {
  workspace: WorkspaceData;
  onWorkspaceUpdate?: (updated: WorkspaceData) => void;
}

export default function NextBestAction({ workspace, onWorkspaceUpdate }: NextBestActionProps) {
  const [showWhy, setShowWhy] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);

  const lastExecuted = workspace.executedActions?.[workspace.executedActions.length - 1];
  const hasBeenExecuted = !!lastExecuted;

  const nba = workspace.analysis?.nextBestAction ?? workspace.nextBestAction;

  const handleSuccess = (updated: WorkspaceData) => {
    if (onWorkspaceUpdate) onWorkspaceUpdate(updated);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-md shadow-sm mb-6 overflow-hidden">
        <div className="bg-slate-900 text-white p-3 flex items-center gap-2">
          {hasBeenExecuted ? (
            <CheckCircle size={16} className="text-emerald-400" />
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.6)] relative">
              <span className="animate-ping absolute h-4 w-4 rounded-full bg-red-400 opacity-75"></span>
              !
            </span>
          )}
          <h2 className="font-bold text-sm uppercase tracking-wide">
            {hasBeenExecuted ? 'Action Completed' : 'Next Best Action'}
          </h2>
        </div>

        <div className="p-5">
          {hasBeenExecuted ? (
            /* ── Completed State ── */
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={20} className="text-emerald-500" />
                  <h3 className="text-xl font-bold text-slate-800">✓ Completed</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-slate-50 rounded border border-slate-200 px-3 py-2">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Briefcase size={11} /> Work Item
                    </p>
                    <p className="font-bold text-blue-600 font-mono text-sm">{lastExecuted.workItemRef}</p>
                  </div>
                  <div className="bg-slate-50 rounded border border-slate-200 px-3 py-2">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                      <User size={11} /> Executed By
                    </p>
                    <p className="font-semibold text-slate-700 text-sm">{lastExecuted.executedBy ?? 'Bala'}</p>
                  </div>
                  <div className="bg-slate-50 rounded border border-slate-200 px-3 py-2 md:col-span-2">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Clock size={11} /> Completed
                    </p>
                    <p className="font-semibold text-slate-700 text-sm">{lastExecuted.executedAt}</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <span className="w-full md:w-auto px-5 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded border border-emerald-200 flex items-center gap-2">
                  <CheckCircle size={15} />
                  Action Executed
                </span>
              </div>
            </div>
          ) : (
            /* ── Pending State ── */
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{nba?.title}</h3>
                <p className="text-slate-600 mb-4">{nba?.reason}</p>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    <User size={14} className="text-slate-400" />
                    <span className="font-medium text-slate-700">Owner:</span> {nba?.owner}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="font-medium text-slate-700">Due:</span> {nba?.due}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-2">
                <button
                  onClick={() => setShowExecuteModal(true)}
                  className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={15} fill="currentColor" />
                  Execute Action
                </button>
                <button
                  onClick={() => setShowWhy(v => !v)}
                  className="w-full md:w-auto px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <HelpCircle size={14} className="text-blue-500" />
                  {showWhy ? 'Hide Explanation' : 'Why?'}
                </button>
              </div>
            </div>
          )}

          {/* Explainability panel */}
          {showWhy && !hasBeenExecuted && (
            <ExplainabilityPanel workspace={workspace} onClose={() => setShowWhy(false)} />
          )}
        </div>
      </div>

      <ExecuteActionModal
        isOpen={showExecuteModal}
        workspace={workspace}
        onClose={() => setShowExecuteModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
