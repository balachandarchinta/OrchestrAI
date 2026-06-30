import { Plus, FileText, ArrowRight, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import DeleteWorkspaceModal from '../components/workspace/Modals/DeleteWorkspaceModal';

export default function Workspaces() {
  const { workspaces, loading, deleteWorkspace } = useWorkspaceContext();
  const [workspaceToDelete, setWorkspaceToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const handleDeleteClick = (workspace: any) => {
    if (workspace.status === 'Analyzing') return;
    // Store only id + name — never store the full object reference
    setWorkspaceToDelete({ id: workspace.id, name: workspace.name });
  };

  const confirmDelete = async () => {
    if (!workspaceToDelete) return;
    setIsDeleting(true);
    try {
      await deleteWorkspace(workspaceToDelete.id);
      setDeleteSuccess(workspaceToDelete.name);
      setWorkspaceToDelete(null);
      setTimeout(() => setDeleteSuccess(null), 4000);
    } catch (err: any) {
      console.error('Delete failed:', err);
      const backendMessage = err.response?.data?.message || err.response?.data?.detail || err.message || 'Failed to delete workspace. Please try again.';
      alert(backendMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto relative">
      {deleteSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3">
          <div className="text-green-600 font-bold">✓</div>
          <div>
            <h4 className="text-sm font-bold text-green-900">Workspace Deleted Successfully</h4>
            <p className="text-sm text-green-700 mt-0.5">"{deleteSuccess}" has been permanently removed.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Workspaces</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and access enterprise workspaces</p>
        </div>
        <Link to="/new-workspace" className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          New Workspace
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-md shadow-sm">
            Loading workspaces...
          </div>
        ) : workspaces.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-md shadow-sm">
            No workspaces found. Create a new workspace to get started.
          </div>
        ) : (
          workspaces.map((ws) => (
            <div key={ws.id} className="bg-white border border-slate-200 rounded-md shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <FileText size={20} className={ws.priority === 'High' ? 'text-amber-500' : 'text-blue-500'} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-1">{ws.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">{ws.scenario}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><FileText size={14} /> {ws.documents} Documents</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> Updated {ws.updated}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    {ws.priority === 'High' && <AlertCircle size={14} className="text-amber-500" />}
                    <span className="text-sm font-semibold text-slate-700">{ws.status}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    ws.priority === 'High' ? 'bg-amber-100 text-amber-800' : 
                    ws.priority === 'Medium' ? 'bg-blue-100 text-blue-800' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {ws.priority} Priority
                  </span>
                </div>

                <Link 
                  to={`/workspace/${ws.id}`}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  Open Workspace <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => handleDeleteClick(ws)}
                  disabled={ws.status === 'Analyzing'}
                  title={ws.status === 'Analyzing' ? 'Workspace cannot be deleted while analysis is in progress.' : 'Delete Workspace'}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:hover:text-slate-400 disabled:hover:bg-transparent"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteWorkspaceModal
        isOpen={!!workspaceToDelete}
        isDeleting={isDeleting}
        onClose={() => setWorkspaceToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
