import { useState } from 'react';
import { Play, CheckCircle, Loader2, X, Briefcase, User, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import type { WorkspaceData } from '../../../types/workspace';
import { useWorkspaceContext } from '../../../context/WorkspaceContext';

interface ExecuteActionModalProps {
  isOpen: boolean;
  workspace: WorkspaceData;
  onClose: () => void;
  onSuccess: (updatedWorkspace: WorkspaceData) => void;
}

type Stage = 'review' | 'executing' | 'success';

export default function ExecuteActionModal({ isOpen, workspace, onClose, onSuccess }: ExecuteActionModalProps) {
  const { executeAction, addToast } = useWorkspaceContext();
  const [stage, setStage] = useState<Stage>('review');
  const [result, setResult] = useState<{ workItemRef: string } | null>(null);

  const nba = workspace.analysis?.nextBestAction ?? workspace.nextBestAction;
  const priority = workspace.priority ?? 'High';
  const confidence = workspace.analysis?.aiConfidence ?? workspace.aiConfidence ?? 0;

  const businessImpact = workspace.analysis?.decisionBrief?.find(s => s.title === 'Business Impact')?.content
    ?? 'Execution of this action is expected to unblock downstream work and advance the current business objective.';

  const handleApprove = async () => {
    setStage('executing');
    try {
      const updated = await executeAction(workspace.id, {
        actionTitle: nba?.title ?? 'Action',
        actionOwner: nba?.owner ?? 'Team',
        actionDue: nba?.due ?? 'Today',
        priority,
        businessImpact,
      });
      const workItemRef = updated.executedActions?.[updated.executedActions.length - 1]?.workItemRef ?? 'WI-Unknown';
      setResult({ workItemRef });
      setStage('success');
      addToast(
        `Action Executed Successfully`,
        'success',
        `Work Item ${workItemRef} created successfully.`
      );
      onSuccess(updated);
    } catch (err) {
      console.error('Execute action failed:', err);
      addToast('Execution Failed', 'warning', 'Could not execute action. Please try again.');
      setStage('review');
    }
  };

  const handleClose = () => {
    setStage('review');
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Play size={16} className="text-blue-600" fill="currentColor" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              {stage === 'success' ? 'Execution Complete' : 'Review Action'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Review Stage */}
        {stage === 'review' && (
          <>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                You are about to execute the following action:
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Briefcase size={15} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Task</p>
                    <p className="text-sm font-bold text-slate-800">{nba?.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-start gap-2">
                    <User size={13} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Owner</p>
                      <p className="text-xs font-semibold text-slate-700">{nba?.owner}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={13} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Due</p>
                      <p className="text-xs font-semibold text-slate-700">{nba?.due}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={13} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Priority</p>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        priority === 'High' ? 'bg-red-50 text-red-700' :
                        priority === 'Medium' ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>{priority}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Estimated Business Impact</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-blue-50 border border-blue-100 rounded p-3">
                  {businessImpact.length > 240 ? businessImpact.slice(0, 240) + '...' : businessImpact}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded p-2">
                <span className="text-slate-400">AI Confidence:</span>
                <span className="font-bold text-slate-700">{confidence}%</span>
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${confidence >= 85 ? 'bg-emerald-500' : confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Play size={14} fill="currentColor" />
                Approve & Execute
              </button>
            </div>
          </>
        )}

        {/* Executing Stage */}
        {stage === 'executing' && (
          <div className="p-10 flex flex-col items-center gap-4">
            <Loader2 size={36} className="text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-700">Creating Work Item...</p>
            <p className="text-xs text-slate-400">Updating workspace timeline and records.</p>
          </div>
        )}

        {/* Success Stage */}
        {stage === 'success' && result && (
          <>
            <div className="p-6">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                  <CheckCircle size={28} className="text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800">Work Item Created</p>
                  <p className="text-sm text-slate-500 mt-1">Action has been executed successfully.</p>
                </div>
              </div>

              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-md divide-y divide-slate-100">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Reference</span>
                  <span className="text-sm font-bold text-blue-600 font-mono">{result.workItemRef}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</span>
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                    Completed
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Executed By</span>
                  <span className="text-sm font-semibold text-slate-700">Bala</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Timeline</span>
                  <span className="text-xs text-slate-500">Action Executed ✓</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={handleClose}
                className="px-5 py-2 text-sm font-bold text-white bg-slate-800 rounded hover:bg-slate-700 transition-colors"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
