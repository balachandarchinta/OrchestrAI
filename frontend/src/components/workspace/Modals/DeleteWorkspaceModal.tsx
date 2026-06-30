import { X, AlertTriangle } from 'lucide-react';

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteWorkspaceModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm
}: DeleteWorkspaceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Delete Workspace</h3>
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <AlertTriangle size={24} />
          </div>
          <h4 className="text-center text-sm font-medium text-slate-800 mb-4">
            You are about to permanently delete:
          </h4>
          <ul className="text-sm text-slate-600 space-y-2 mb-6 list-disc list-inside">
            <li>Workspace metadata</li>
            <li>Uploaded documents</li>
            <li>Extracted text files</li>
            <li>AI analysis and generated content</li>
          </ul>
          <div className="p-3 bg-red-50 border border-red-100 rounded text-xs text-red-700 flex flex-col items-center text-center">
            <p className="font-semibold">This action cannot be undone.</p>
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]"
          >
            {isDeleting ? 'Deleting...' : 'Delete Workspace'}
          </button>
        </div>
      </div>
    </div>
  );
}
