import { FileText, PlayCircle, Info } from 'lucide-react';

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Help & Documentation</h1>
        <p className="text-slate-500 mt-1">Learn how to use OrchestrAI to manage your enterprise documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Start Guide */}
        <div className="bg-white border border-slate-200 rounded-md shadow-sm p-6 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <PlayCircle className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-800">Application Workflow</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center mt-6">
            <div className="flex-1 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mx-auto mb-2">1</div>
              <h3 className="font-semibold text-slate-700 text-sm">Create Workspace</h3>
              <p className="text-xs text-slate-500 mt-1">Define your business scenario</p>
            </div>
            <div className="hidden md:block text-slate-300">➔</div>
            <div className="flex-1 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mx-auto mb-2">2</div>
              <h3 className="font-semibold text-slate-700 text-sm">Upload Documents</h3>
              <p className="text-xs text-slate-500 mt-1">Add context for analysis</p>
            </div>
            <div className="hidden md:block text-slate-300">➔</div>
            <div className="flex-1 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mx-auto mb-2">3</div>
              <h3 className="font-semibold text-slate-700 text-sm">Analyze Workspace</h3>
              <p className="text-xs text-slate-500 mt-1">Run AI-powered extraction</p>
            </div>
            <div className="hidden md:block text-slate-300">➔</div>
            <div className="flex-1 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mx-auto mb-2">4</div>
              <h3 className="font-semibold text-slate-700 text-sm">Review Results</h3>
              <p className="text-xs text-slate-500 mt-1">Review insights and actions</p>
            </div>
          </div>
        </div>

        {/* Supported File Types */}
        <div className="bg-white border border-slate-200 rounded-md shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-800">Supported File Types</h2>
          </div>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
              <div className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold mt-0.5">PDF</div>
              <div>
                <p className="text-sm font-medium text-slate-700">Portable Document Format</p>
                <p className="text-xs text-slate-500">Standard documents, contracts, and proposals.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold mt-0.5">XLSX</div>
              <div>
                <p className="text-sm font-medium text-slate-700">Excel Spreadsheets</p>
                <p className="text-xs text-slate-500">Budgets, financial models, and tabular data.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-bold mt-0.5">TXT</div>
              <div>
                <p className="text-sm font-medium text-slate-700">Plain Text Files</p>
                <p className="text-xs text-slate-500">Transcripts, meeting notes, and raw text.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* About OrchestrAI */}
        <div className="bg-white border border-slate-200 rounded-md shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-slate-800">About OrchestrAI</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            OrchestrAI is an Enterprise Decision Intelligence platform designed to accelerate workflows and uncover insights from scattered business documents.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            By leveraging advanced AI models like Google Gemini, it automatically structures unstructured data into actionable insights, risks, and next steps.
          </p>
        </div>
      </div>
    </div>
  );
}
