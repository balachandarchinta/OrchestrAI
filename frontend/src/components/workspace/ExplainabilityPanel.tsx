import { X, Sparkles, FileText, Brain, ShieldCheck } from 'lucide-react';
import type { WorkspaceData } from '../../types/workspace';

interface ExplainabilityPanelProps {
  workspace: WorkspaceData;
  onClose: () => void;
}

function ConfidenceBadge({ score }: { score: number }) {
  if (score >= 85) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        High Confidence
      </span>
    );
  }
  if (score >= 60) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        Medium Confidence
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
      Low Confidence
    </span>
  );
}

export default function ExplainabilityPanel({ workspace, onClose }: ExplainabilityPanelProps) {
  const nba = workspace.analysis?.nextBestAction ?? workspace.nextBestAction;
  const confidence = workspace.analysis?.aiConfidence ?? workspace.aiConfidence ?? 0;
  const evidence = nba?.evidence ?? [];

  return (
    <div className="mt-4 border border-slate-200 rounded-md bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-blue-500" />
          <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">AI Explainability</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Evidence */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Evidence</span>
          </div>
          {evidence.length > 0 ? (
            <div className="flex flex-col gap-2">
              {evidence.map((ev, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-xs font-semibold text-slate-700 truncate">{ev.source}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed italic">"{ev.quote}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Run AI analysis to generate evidence.</p>
          )}
        </div>

        {/* AI Reasoning */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">AI Reasoning</span>
          </div>
          <div className="bg-white border border-slate-200 rounded p-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              {nba?.whyDescription || 'No reasoning available. Run AI analysis first.'}
            </p>
          </div>
        </div>

        {/* Confidence */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={14} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Confidence</span>
          </div>
          <div className="bg-white border border-slate-200 rounded p-4 flex flex-col items-center gap-3">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={confidence >= 85 ? '#10b981' : confidence >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${confidence}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-slate-800">{confidence}%</span>
              </div>
            </div>
            <ConfidenceBadge score={confidence} />
            <p className="text-xs text-slate-400 text-center">
              {confidence >= 85
                ? 'Strong evidence base supports this recommendation.'
                : confidence >= 60
                ? 'Moderate confidence. Review supporting documents.'
                : 'Limited data. Upload more documents for better accuracy.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
