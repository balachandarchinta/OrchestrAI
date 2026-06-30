import { LayoutDashboard, FileText, Settings, HelpCircle, Lightbulb } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const isActiveWorkspace = location.pathname.startsWith('/workspace/');

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-tight">OrchestrAI</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Enterprise Intelligence</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive && location.pathname === '/' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`
              }
            >
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/workspaces" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`
              }
            >
              <FileText size={18} />
              <span className="text-sm font-medium">Workspaces</span>
            </NavLink>
          </li>
          {isActiveWorkspace && (
            <li>
              <NavLink 
                to={location.pathname} 
                className={() => 
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors bg-slate-800 text-white`
                }
              >
                <FileText size={18} />
                <span className="text-sm font-medium">Active Workspace</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink 
              to="/insights" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`
              }
            >
              <Lightbulb size={18} />
              <span className="text-sm font-medium">Insights</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`
              }
            >
              <Settings size={18} />
              <span className="text-sm font-medium">Settings</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/help" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white'}`
              }
            >
              <HelpCircle size={18} />
              <span className="text-sm font-medium">Help</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
