import { Copy, PlusSquare } from 'lucide-react';
import type { GeneratedContent } from '../../../types/workspace';

interface GeneratedContentTabProps {
  content: GeneratedContent;
}

export default function GeneratedContentTab({ content }: GeneratedContentTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden flex flex-col">
        <div className="bg-slate-50 border-b border-slate-200 p-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Draft Email</h3>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <textarea 
            className="w-full h-40 p-3 text-sm text-slate-700 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none mb-4"
            defaultValue={content.draftEmail}
          />
          <button className="mt-auto w-full py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <Copy size={16} />
            Copy to Clipboard
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden flex flex-col">
        <div className="bg-slate-50 border-b border-slate-200 p-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Draft Work Item</h3>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Title</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              defaultValue={content.draftWorkItem.title}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</label>
            <textarea 
              className="w-full h-20 p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              defaultValue={content.draftWorkItem.description}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Priority</label>
            <select className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white" defaultValue={content.draftWorkItem.priority}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button className="mt-auto w-full py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
            <PlusSquare size={16} />
            Create in Jira
          </button>
        </div>
      </div>
    </div>
  );
}
