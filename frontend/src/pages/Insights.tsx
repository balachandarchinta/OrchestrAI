import { Lightbulb, ArrowRight, TrendingUp, AlertCircle, X, BarChart2 } from 'lucide-react';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Insights() {
  const { workspaces } = useWorkspaceContext();
  const navigate = useNavigate();
  
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [showEmptyStateModal, setShowEmptyStateModal] = useState(false);

  const handleViewAnalysis = () => {
    const analyzed = workspaces.filter(ws => ws.status === 'Analysis Complete');
    if (analyzed.length > 0) {
      // Navigate to the first (most recent) analyzed workspace and open the risks tab
      navigate(`/workspace/${analyzed[0].id}?tab=risks`);
    } else {
      setShowEmptyStateModal(true);
    }
  };

  // Metrics Calculations
  const totalWorkspaces = workspaces.length;
  const docsUploaded = workspaces.reduce((acc, ws) => acc + (ws.documents || 0), 0);
  const workspacesAnalyzed = workspaces.filter(ws => ws.status === 'Analysis Complete').length;
  const pendingActions = workspaces.filter(ws => ws.status !== 'Analysis Complete' && ws.status !== 'Completed').length;
  const completedActions = workspaces.filter(ws => ws.status === 'Completed').length;
  const highPriority = workspaces.filter(ws => ws.priority === 'High').length;
  const avgDocs = totalWorkspaces > 0 ? (docsUploaded / totalWorkspaces).toFixed(1) : 0;
  const analysisSuccessRate = totalWorkspaces > 0 ? Math.round((workspacesAnalyzed / totalWorkspaces) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Global Insights</h1>
          <p className="text-slate-500 text-sm mt-1">Cross-workspace analytics and AI findings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-md shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Risk Patterns</h2>
            <AlertCircle size={20} className="text-amber-500" />
          </div>
          <p className="text-sm text-slate-600 mb-4">
            AI has detected recurring risks across your active workspaces. Vendor contracts frequently lack indemnification clauses.
          </p>
          <button 
            onClick={handleViewAnalysis}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View Analysis <ArrowRight size={16} />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-md shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Workflow Efficiency</h2>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Workspace creation to analysis completion time has decreased by 15% this month.
          </p>
          <button 
            onClick={() => setShowMetricsModal(true)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View Metrics <ArrowRight size={16} />
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-md shadow-sm p-8 text-center col-span-1 md:col-span-2">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">More Insights Coming Soon</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Advanced cross-workspace correlations and AI-driven predictive intelligence will be available in Sprint 4.
          </p>
        </div>
      </div>

      {/* Empty State Modal for View Analysis */}
      {showEmptyStateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-800">No Analysis Available</h3>
              <button onClick={() => setShowEmptyStateModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                No AI analysis is available yet. Upload documents and analyze a workspace to view risk patterns.
              </p>
            </div>
            <div className="p-4 border-t border-slate-200 text-right">
              <button onClick={() => setShowEmptyStateModal(false)} className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Metrics Modal */}
      {showMetricsModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <BarChart2 size={18} className="text-slate-600" />
                <h3 className="font-semibold text-slate-800">Workflow Metrics</h3>
              </div>
              <button onClick={() => setShowMetricsModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-md">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Workspaces</p>
                  <p className="text-2xl font-bold text-slate-800">{totalWorkspaces}</p>
                </div>
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-md">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Docs Uploaded</p>
                  <p className="text-2xl font-bold text-slate-800">{docsUploaded}</p>
                </div>
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-md">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Analyzed</p>
                  <p className="text-2xl font-bold text-slate-800">{workspacesAnalyzed}</p>
                </div>
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-md">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-slate-800">{analysisSuccessRate}%</p>
                </div>
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-md">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pending Actions</p>
                  <p className="text-2xl font-bold text-slate-800">{pendingActions}</p>
                </div>
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-md">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Completed</p>
                  <p className="text-2xl font-bold text-slate-800">{completedActions}</p>
                </div>
                <div className="bg-red-50 p-4 border border-red-200 rounded-md">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">High Priority</p>
                  <p className="text-2xl font-bold text-red-700">{highPriority}</p>
                </div>
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-md">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Avg Docs / WS</p>
                  <p className="text-2xl font-bold text-slate-800">{avgDocs}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 text-right bg-slate-50">
              <button onClick={() => setShowMetricsModal(false)} className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded text-sm font-medium transition-colors">
                Close Metrics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
