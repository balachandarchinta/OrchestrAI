import { Bell, Search, User, LogOut, Settings, HelpCircle, Info, Sparkles } from 'lucide-react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import AIBriefingModal from './AIBriefingModal';

export default function Header() {
  const location = useLocation();
  const isWorkspacePage = location.pathname.startsWith('/workspace/');
  const pathMatch = location.pathname.match(/\/workspace\/([^/]+)/);
  const workspaceId = pathMatch ? pathMatch[1] : undefined;
  const { workspaces } = useWorkspaceContext();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const activeWorkspace = isWorkspacePage && workspaceId
    ? workspaces.find(ws => ws.id === workspaceId) ?? null
    : null;

  let title = 'OrchestrAI';
  if (location.pathname === '/') title = 'Dashboard';
  else if (isWorkspacePage && activeWorkspace) title = activeWorkspace.name;
  else if (isWorkspacePage) title = 'Active Workspace';
  else if (location.pathname === '/workspaces') title = 'Workspaces';
  else if (location.pathname === '/new-workspace') title = 'New Workspace';
  else if (location.pathname === '/insights') title = 'Insights';
  else if (location.pathname === '/settings') title = 'Settings';
  else if (location.pathname === '/help') title = 'Help & Documentation';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-10 relative">
        <div className="flex items-center text-slate-800 font-semibold text-lg">
          {title}
        </div>

        <div className="flex items-center gap-3">
          {/* AI Briefing — only on workspace detail pages */}
          {isWorkspacePage && (
            <button
              onClick={() => setShowBriefing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors uppercase tracking-wide"
            >
              <Sparkles size={13} />
              AI Briefing
            </button>
          )}

          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Workspaces..."
              className="h-8 w-64 rounded-md border border-slate-300 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div className="relative" ref={notificationsRef}>
            <button
              className="text-slate-500 hover:text-slate-700 relative flex items-center justify-center p-1"
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <p className="text-sm text-slate-800 font-medium">Q3 Pricing Review</p>
                    <p className="text-xs text-slate-500 mt-1">AI analysis has completed. 2 new risks identified.</p>
                    <p className="text-xs text-slate-400 mt-2">10 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <p className="text-sm text-slate-800 font-medium">Vendor Negotiation</p>
                    <p className="text-xs text-slate-500 mt-1">ACME Corp contract missing indemnification clause.</p>
                    <p className="text-xs text-slate-400 mt-2">1 hour ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                    <p className="text-sm text-slate-800 font-medium">System Update</p>
                    <p className="text-xs text-slate-500 mt-1">Gemini 2.5 Pro model is now active for all workspaces.</p>
                    <p className="text-xs text-slate-400 mt-2">Yesterday</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300"
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            >
              <User size={18} />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-semibold text-slate-800">Guest Session</p>
                  <p className="text-xs text-slate-500">OrchestrAI Enterprise MVP</p>
                </div>
                <div className="py-1">
                  <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" onClick={() => setShowProfile(false)}>
                    <Settings size={16} />
                    Settings
                  </Link>
                  <Link to="/help" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" onClick={() => setShowProfile(false)}>
                    <HelpCircle size={16} />
                    Help
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" onClick={() => alert('OrchestrAI v1.3.0-beta\nEnterprise Decision Intelligence')}>
                    <Info size={16} />
                    About
                  </button>
                  <div className="border-t border-slate-200 my-1"></div>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 cursor-not-allowed opacity-75">
                    <LogOut size={16} />
                    Sign Out (Coming Soon)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* AI Briefing Modal — mounted at header level so it overlays everything */}
      <AIBriefingModal
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
        workspace={activeWorkspace}
      />
    </>
  );
}
