import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/workspace/Sidebar';
import Header from './components/workspace/Header';
import Dashboard from './pages/Dashboard';
import WorkspaceDetail from './pages/WorkspaceDetail';
import Workspaces from './pages/Workspaces';
import NewWorkspace from './pages/NewWorkspace';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Help from './pages/Help';
import { WorkspaceProvider } from './context/WorkspaceContext';
import ToastContainer from './components/ToastContainer';


function App() {
  return (
    <WorkspaceProvider>
      <BrowserRouter>
        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workspaces" element={<Workspaces />} />
                <Route path="/workspace/:id" element={<WorkspaceDetail />} />
                <Route path="/new-workspace" element={<NewWorkspace />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
              </Routes>
            </main>
          </div>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </WorkspaceProvider>
  );
}

export default App;

