import { Folder, Clock, Calendar, CheckCircle, AlertTriangle, Play, FileText, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import { useState } from 'react';

export default function Dashboard() {
  const { workspaces, loading } = useWorkspaceContext();
  const navigate = useNavigate();
  const [showGlobalDocModal, setShowGlobalDocModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const analyzedWorkspaces = workspaces.filter(ws => ws.status === 'Analysis Complete' && ws.analysis);
  const allInsights = analyzedWorkspaces.flatMap(ws => {
    const insights: any[] = [];
    const analysis = ws.analysis!;
    const timestamp = analysis.metadata?.analysisTimestamp || ws.updated;
    const confidence = analysis.aiConfidence || 85;

    // 1. Risks
    (analysis.risks || []).forEach((risk: any, i: number) => {
      insights.push({
        id: `risk-${ws.id}-${i}`,
        workspaceId: ws.id,
        workspaceName: ws.name,
        category: 'Risk',
        title: risk.risk || 'Identified Risk',
        description: risk.mitigation || 'No mitigation provided.',
        priority: risk.impact || 'Medium',
        generatedAt: timestamp,
        confidence,
        tab: 'risks'
      });
    });

    // 2. Action Items
    (analysis.actionItems || []).forEach((item: any, i: number) => {
      insights.push({
        id: `action-${ws.id}-${i}`,
        workspaceId: ws.id,
        workspaceName: ws.name,
        category: 'Action Item',
        title: item.title || 'Action Required',
        description: item.description || 'Action item details.',
        priority: item.priority || 'Medium',
        generatedAt: timestamp,
        confidence,
        tab: 'plan'
      });
    });

    // 3. Next Best Action (Executive Summary)
    if (analysis.nextBestAction && analysis.nextBestAction.title) {
       insights.push({
        id: `nba-${ws.id}`,
        workspaceId: ws.id,
        workspaceName: ws.name,
        category: 'Executive Summary',
        title: analysis.nextBestAction.title,
        description: analysis.nextBestAction.whyDescription || 'Strategic recommendation based on recent analysis.',
        priority: 'High',
        generatedAt: timestamp,
        confidence,
        tab: 'brief'
      });
    }

    return insights;
  });

  const recentInsights = allInsights.sort((a, b) => {
    if (a.priority === 'High' && b.priority !== 'High') return -1;
    if (b.priority === 'High' && a.priority !== 'High') return 1;
    return 0;
  }).slice(0, 3);

  const handleWorkspaceAnalysis = (workspaceId: string, tab: string) => {
    navigate(`/workspace/${workspaceId}?tab=${tab}`);
  };

  const totalWorkspaces = workspaces.length;
  const analyzedCount = workspaces.filter(ws => ws.analysis || ws.status === 'Analysis Complete' || ws.status === 'Action Executed').length;
  const totalDocuments = workspaces.reduce((sum, ws) => sum + (ws.documents ?? 0), 0);
  const executedActions = workspaces.reduce((sum, ws) => sum + (ws.executedActions?.length ?? 0), 0);
  const pendingActions = workspaces.filter(ws =>
    ws.status !== 'Analysis Complete' && ws.status !== 'Action Executed' && ws.status !== 'Completed'
  ).length;
  const highPriorityCount = workspaces.filter(ws => ws.priority === 'High').length;
  const criticalRisks = workspaces.reduce((sum, ws) => {
    const risks = ws.analysis?.risks ?? ws.risks ?? [];
    return sum + risks.filter((r: any) => r.impact === 'High').length;
  }, 0);
  const avgDocsPerWorkspace = totalWorkspaces > 0 ? (totalDocuments / totalWorkspaces).toFixed(1) : '0';
  const avgConfidence = analyzedCount > 0
    ? Math.round(workspaces.filter(ws => ws.analysis).reduce((sum, ws) => sum + (ws.analysis!.aiConfidence ?? 0), 0) / analyzedCount)
    : 0;
  const successRate = totalWorkspaces > 0 ? Math.round((analyzedCount / totalWorkspaces) * 100) : 0;

  // Recent Activity: executed actions across all workspaces
  const recentActivity = workspaces
    .flatMap(ws => (ws.executedActions ?? []).map(a => ({ ...a, workspaceName: ws.name })))
    .sort((a, b) => b.executedAt.localeCompare(a.executedAt))
    .slice(0, 5);

  const recentWorkspaces = workspaces.slice(0, 3);


  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome to OrchestrAI</h1>
          <p className="text-slate-500 text-sm mt-1">Here is what's happening across your workspaces today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/insights" className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded hover:bg-slate-50 transition-colors">
            Recent Analysis
          </Link>
          <Link to="/new-workspace" className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors flex items-center gap-2">
            <Folder size={16} />
            New Workspace
          </Link>
        </div>
      </div>

      {/* KPI Cards — 8 Workflow Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 border border-slate-200 rounded-md shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Folder size={14} />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Total Workspaces</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{loading ? '-' : totalWorkspaces}</p>
        </div>
        <div className="bg-white p-4 border border-slate-200 rounded-md shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <CheckCircle size={14} className="text-blue-500" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Analyzed</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{loading ? '-' : analyzedCount}</p>
        </div>
        <div className="bg-white p-4 border border-slate-200 rounded-md shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <FileText size={14} />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Total Documents</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{loading ? '-' : totalDocuments}</p>
        </div>
        <div className="bg-white p-4 border border-red-200 rounded-md shadow-sm bg-red-50/30">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle size={14} />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Critical Risks</h3>
          </div>
          <p className="text-3xl font-bold text-red-700">{loading ? '-' : criticalRisks}</p>
        </div>
        <div className="bg-white p-4 border border-slate-200 rounded-md shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Clock size={14} />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Pending Actions</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{loading ? '-' : pendingActions}</p>
        </div>
        <div className="bg-white p-4 border border-emerald-200 rounded-md shadow-sm bg-emerald-50/30">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Play size={14} fill="currentColor" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Executed Actions</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-700">{loading ? '-' : executedActions}</p>
        </div>
        <div className="bg-white p-4 border border-slate-200 rounded-md shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Calendar size={14} />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Avg Docs / Workspace</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{loading ? '-' : avgDocsPerWorkspace}</p>
        </div>
        <div className="bg-white p-4 border border-blue-200 rounded-md shadow-sm bg-blue-50/20">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <CheckCircle size={14} />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Analysis Success</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700">{loading ? '-' : `${successRate}%`}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (2 columns wide) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Workspaces */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Recent Workspaces</h2>
              <Link to="/workspaces" className="text-xs font-semibold text-blue-600 hover:text-blue-800">View All</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-8 text-center text-slate-500">Loading workspaces...</div>
              ) : recentWorkspaces.map((ws) => (
                <Link to={`/workspace/${ws.id}`} key={ws.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      <FileText size={16} className={ws.priority === 'High' ? "text-amber-500" : "text-blue-500"} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors text-sm">{ws.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Updated {ws.updated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 rounded">
                      {ws.status}
                    </span>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-500" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent AI Insights */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Recent AI Insights</h2>
            </div>
            <div className="p-0 divide-y divide-slate-100">
              {recentInsights.length > 0 ? (
                recentInsights.map((insight) => (
                  <div key={insight.id} className="p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{insight.workspaceName}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-xs font-medium text-slate-500">{insight.category}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          {insight.category === 'Risk' && <AlertTriangle size={14} className={insight.priority === 'High' ? 'text-amber-500' : 'text-blue-500'} />}
                          {insight.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          insight.priority === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {insight.priority} Priority
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {insight.confidence}% Confidence
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {insight.description.includes('lack of data') || insight.description.includes('Failed') 
                        ? 'Insufficient business context detected. Upload additional business documents such as meeting transcripts, pricing proposals, contracts, or spreadsheets to generate meaningful enterprise insights.' 
                        : insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> Generated: {insight.generatedAt}
                      </span>
                      <button 
                        onClick={() => handleWorkspaceAnalysis(insight.workspaceId, insight.tab)} 
                        className="text-xs font-bold text-blue-700 hover:text-blue-800 uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        View Analysis <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2">No AI insights available.</h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                    Upload business documents and analyze a workspace to generate enterprise decision intelligence.
                  </p>
                  <button 
                    onClick={() => navigate('/workspaces')}
                    className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors"
                  >
                    Analyze a Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Column (1 column wide) */}
        <div className="space-y-8">

          {/* Recent Activity Feed */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Recent Activity</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.length > 0 ? recentActivity.map(a => (
                <div key={a.id} className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Work Item Created</p>
                      <p className="text-xs text-slate-500">{a.title}</p>
                      <p className="text-xs font-mono text-blue-600 mt-0.5">{a.workItemRef}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{a.workspaceName} · {a.executedAt}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="px-4 py-6 text-center text-xs text-slate-400">
                  No actions executed yet.
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Upcoming Meetings</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-red-500">Oct</span>
                  <span className="text-lg font-bold text-slate-800 leading-none">24</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Q3 Pricing Review Sync</h3>
                  <p className="text-xs text-slate-500 mt-1">10:00 AM - 11:00 AM</p>
                  <button onClick={() => setShowCalendarModal(true)} className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">
                    <Play size={12} /> Sync Calendar
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-red-500">Oct</span>
                  <span className="text-lg font-bold text-slate-800 leading-none">25</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Vendor Negotiations</h3>
                  <p className="text-xs text-slate-500 mt-1">2:30 PM - 3:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Quick Actions</h2>
            </div>
            <div className="p-2">
              <Link to="/new-workspace" className="w-full text-left px-3 py-2.5 rounded hover:bg-slate-50 flex items-center gap-3 text-sm font-medium text-slate-700 transition-colors">
                <Folder size={16} className="text-slate-400" /> Create New Workspace
              </Link>
              <button
                onClick={() => setShowGlobalDocModal(true)}
                className="w-full text-left px-3 py-2.5 rounded hover:bg-slate-50 flex items-center gap-3 text-sm font-medium text-slate-700 transition-colors"
              >
                <FileText size={16} className="text-slate-400" /> Upload Global Document
              </button>
              <button
                onClick={() => setShowCalendarModal(true)}
                className="w-full text-left px-3 py-2.5 rounded hover:bg-slate-50 flex items-center gap-3 text-sm font-medium text-slate-700 transition-colors"
              >
                <Calendar size={16} className="text-slate-400" /> Connect Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Document Modal */}
      {showGlobalDocModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Global Documents Repository</h3>
              <button 
                onClick={() => setShowGlobalDocModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Folder size={24} />
              </div>
              <h4 className="text-center text-sm font-medium text-slate-800 mb-2">Centralized Enterprise Knowledge</h4>
              <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
                The Global Documents repository serves as a shared enterprise-wide foundation. Documents uploaded here will be accessible across all workspaces for contextual AI analysis.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700 flex flex-col items-center text-center">
                <p className="font-medium">Coming Soon</p>
                <p className="mt-1">Enterprise knowledge-base integration is scheduled for the next release.</p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 text-right">
              <button 
                onClick={() => setShowGlobalDocModal(false)}
                className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded text-sm font-medium transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Connect Calendar</h3>
              <button 
                onClick={() => setShowCalendarModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Calendar size={24} />
              </div>
              <h4 className="text-center text-sm font-medium text-slate-800 mb-2">Calendar Integration</h4>
              <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
                Connect your Google Workspace or Microsoft 365 calendar to automatically sync upcoming meetings with relevant workspaces and generate preparation briefs.
              </p>
              <div className="space-y-3">
                <button className="w-full py-2.5 px-4 border border-slate-300 rounded hover:bg-slate-50 flex items-center justify-center gap-2 text-sm font-medium text-slate-700 opacity-50 cursor-not-allowed">
                  Connect Google Calendar
                </button>
                <button className="w-full py-2.5 px-4 border border-slate-300 rounded hover:bg-slate-50 flex items-center justify-center gap-2 text-sm font-medium text-slate-700 opacity-50 cursor-not-allowed">
                  Connect Outlook
                </button>
              </div>
              <div className="mt-6 text-center text-xs text-slate-400">
                Integration APIs are currently in testing.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
