import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Folder, UploadCloud, ArrowLeft } from 'lucide-react';
import { useWorkspaceContext } from '../context/WorkspaceContext';

export default function NewWorkspace() {
  const navigate = useNavigate();
  const { addWorkspace } = useWorkspaceContext();
  const [name, setName] = useState('');
  const [scenario, setScenario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !scenario) return;
    
    setIsSubmitting(true);
    try {
      const newId = await addWorkspace(name, scenario);
      navigate(`/workspace/${newId}`);
    } catch (err) {
      console.error('Failed to create workspace', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Link to="/workspaces" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={16} />
          Back to Workspaces
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Create New Workspace</h1>
        <p className="text-slate-500 text-sm mt-1">Set up a new AI-powered decision environment.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-md shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-800 mb-1">Workspace Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q4 Marketing Budget Review"
                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              />
            </div>
            
            <div>
              <label htmlFor="scenario" className="block text-sm font-semibold text-slate-800 mb-1">Business Scenario</label>
              <select
                id="scenario"
                required
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white"
              >
                <option value="" disabled>Select a scenario...</option>
                <option value="Financial Strategy">Financial Strategy</option>
                <option value="Procurement">Procurement & Contracts</option>
                <option value="Marketing & Sales">Marketing & Sales</option>
                <option value="Product Development">Product Development</option>
                <option value="HR & Operations">HR & Operations</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Initial Documents (Optional)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-md p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <UploadCloud size={32} className="mx-auto text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-800 mb-1">Drag and drop files here</p>
              <p className="text-xs text-slate-500">Supports PDF, TXT, XLSX (Max 10MB)</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/workspaces')}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
            >
              <Folder size={16} />
              {isSubmitting ? 'Creating...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
