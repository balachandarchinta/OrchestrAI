import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import type { Toast } from '../types/workspace';

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useWorkspaceContext();

  const styles = {
    success: {
      bar: 'bg-emerald-500',
      icon: <CheckCircle size={18} className="text-emerald-600 shrink-0" />,
      border: 'border-emerald-200',
    },
    info: {
      bar: 'bg-blue-500',
      icon: <Info size={18} className="text-blue-600 shrink-0" />,
      border: 'border-blue-200',
    },
    warning: {
      bar: 'bg-amber-500',
      icon: <AlertTriangle size={18} className="text-amber-600 shrink-0" />,
      border: 'border-amber-200',
    },
  };

  const s = styles[toast.type];

  return (
    <div
      className={`relative bg-white border ${s.border} rounded-md shadow-lg overflow-hidden w-80 animate-slide-in`}
      style={{ animation: 'slideInRight 0.25s ease-out' }}
    >
      <div className={`h-0.5 ${s.bar} w-full`} />
      <div className="p-4 flex items-start gap-3">
        {s.icon}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">{toast.message}</p>
          {toast.subtext && (
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.subtext}</p>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useWorkspaceContext();

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
      </div>
    </>
  );
}
