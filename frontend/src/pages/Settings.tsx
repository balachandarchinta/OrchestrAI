export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Application configuration and preferences</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-800">System Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600 font-medium">Application Version</span>
            <span className="text-sm text-slate-800">1.2.0-beta</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600 font-medium">Backend Status</span>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Online</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-800">AI Configuration</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600 font-medium">AI Provider</span>
            <span className="text-sm text-slate-800">Google AI Studio</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600 font-medium">Current Model</span>
            <span className="text-sm text-slate-800">gemini-1.5-pro</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-800">Workspace Limits</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600 font-medium">Max Upload Size</span>
            <span className="text-sm text-slate-800">10 MB per file</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600 font-medium">Max Files Per Upload</span>
            <span className="text-sm text-slate-800">5 files</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-800">Appearance</h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-600 font-medium">Theme</span>
            <select disabled className="text-sm border border-slate-300 rounded px-3 py-1.5 bg-slate-50 text-slate-500 cursor-not-allowed">
              <option>Light (Default)</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
          <p className="text-xs text-slate-400 mt-2">Theme customization is currently disabled.</p>
        </div>
      </div>
    </div>
  );
}
