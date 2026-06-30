import { X, Clock, Target, MessageSquare, AlertTriangle, HelpCircle, Lightbulb, Sparkles } from 'lucide-react';
import type { WorkspaceData } from '../../types/workspace';

interface AIBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: WorkspaceData | null;
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-400">{icon}</span>
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function AIBriefingModal({ isOpen, onClose, workspace }: AIBriefingModalProps) {
  if (!isOpen || !workspace) return null;

  const analysis = workspace.analysis;
  const brief = analysis?.decisionBrief ?? workspace.decisionBrief ?? [];
  const risks = analysis?.risks ?? workspace.risks ?? [];
  const actionItems = analysis?.actionItems ?? workspace.actionItems ?? [];

  const confidence = analysis?.aiConfidence ?? workspace.aiConfidence ?? 0;
  const timestamp = analysis?.metadata?.analysisTimestamp;

  const getSection = (title: string) =>
    brief.find(s => s.title.toLowerCase().includes(title.toLowerCase()))?.content ?? '';

  const summary    = getSection('Overall Summary');
  const impact     = getSection('Business Impact');
  const decisions  = getSection('Key Decisions');
  const openQs     = getSection('Open Questions');
  const recs       = getSection('Recommendations');

  const hasAnalysis = brief.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">AI Briefing</h2>
              <p className="text-xs text-slate-500">
                {workspace.name}
                {timestamp && <> &middot; {timestamp}</>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {confidence > 0 && (
              <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded">
                {confidence}% Confidence
              </span>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {!hasAnalysis ? (
            <div className="p-10 flex flex-col items-center gap-3 text-center">
              <Sparkles size={32} className="text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No AI Analysis Available</p>
              <p className="text-xs text-slate-400">
                Upload documents and run AI Analysis to generate an executive briefing.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {/* 30-Second Brief */}
              <Section icon={<Clock size={14} />} title="30-Second Executive Brief">
                <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
                  <p className="text-sm text-slate-700 leading-relaxed">{summary || impact || 'Summary not available.'}</p>
                </div>
              </Section>

              {/* Key Decisions */}
              {decisions && (
                <Section icon={<Target size={14} />} title="Key Decisions">
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                    <p className="text-sm text-slate-700 leading-relaxed">{decisions}</p>
                  </div>
                </Section>
              )}

              {/* Talking Points */}
              {actionItems.length > 0 && (
                <Section icon={<MessageSquare size={14} />} title="Talking Points">
                  <div className="space-y-2">
                    {actionItems.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded p-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{item.task}</p>
                          <p className="text-xs text-slate-500">Owner: {item.owner} · Due: {item.due}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Risks */}
              {risks.length > 0 && (
                <Section icon={<AlertTriangle size={14} />} title="Risks">
                  <div className="space-y-2">
                    {risks.slice(0, 3).map((risk, i) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded p-3">
                        <span className={`shrink-0 px-1.5 py-0.5 text-xs font-bold rounded ${
                          risk.impact === 'High' ? 'bg-red-50 text-red-700 border border-red-200' :
                          risk.impact === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>{risk.impact}</span>
                        <div>
                          <p className="text-sm text-slate-700">{risk.risk}</p>
                          <p className="text-xs text-slate-400 mt-1">{risk.mitigation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Likely Questions */}
              {openQs && (
                <Section icon={<HelpCircle size={14} />} title="Likely Questions">
                  <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                    <p className="text-sm text-slate-700 leading-relaxed">{openQs}</p>
                  </div>
                </Section>
              )}

              {/* Suggested Follow-ups */}
              {recs && (
                <Section icon={<Lightbulb size={14} />} title="Suggested Follow-ups">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-md p-4">
                    <p className="text-sm text-slate-700 leading-relaxed">{recs}</p>
                  </div>
                </Section>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
          <p className="text-xs text-slate-400">
            Generated from uploaded documents · No new AI request made
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
