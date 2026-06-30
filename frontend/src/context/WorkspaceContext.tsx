import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { WorkspaceData, Toast } from '../types/workspace';
import {
  getWorkspaces,
  createWorkspace,
  uploadDocuments,
  deleteDocument,
  analyzeWorkspace as apiAnalyzeWorkspace,
  deleteWorkspaceAPI,
  executeActionAPI,
} from '../services/api';

interface ExecuteActionPayload {
  actionTitle: string;
  actionOwner: string;
  actionDue: string;
  priority?: string;
  businessImpact?: string;
}

interface WorkspaceContextType {
  workspaces: WorkspaceData[];
  loading: boolean;
  error: string | null;
  toasts: Toast[];
  addWorkspace: (name: string, scenario: string) => Promise<string>;
  refreshWorkspaces: () => Promise<void>;
  uploadDocs: (workspaceId: string, files: File[]) => Promise<void>;
  deleteDoc: (workspaceId: string, docId: string) => Promise<void>;
  analyzeWorkspace: (workspaceId: string) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  executeAction: (workspaceId: string, payload: ExecuteActionPayload) => Promise<WorkspaceData>;
  addToast: (message: string, type?: Toast['type'], subtext?: string) => void;
  removeToast: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success', subtext?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type, subtext }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const data = await getWorkspaces();
      setWorkspaces(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch workspaces:', err);
      setError('Failed to load workspaces.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const addWorkspace = async (name: string, scenario: string): Promise<string> => {
    try {
      const newWorkspace = await createWorkspace(name, scenario);
      setWorkspaces(prev => [newWorkspace, ...prev]);
      addToast(`Workspace "${name}" created successfully.`, 'success');
      return newWorkspace.id;
    } catch (err) {
      console.error('Failed to create workspace:', err);
      throw err;
    }
  };

  const uploadDocs = async (workspaceId: string, files: File[]) => {
    try {
      await uploadDocuments(workspaceId, files);
      await fetchWorkspaces();
    } catch (err) {
      console.error('Failed to upload documents:', err);
      throw err;
    }
  };

  const deleteDoc = async (workspaceId: string, docId: string) => {
    try {
      await deleteDocument(workspaceId, docId);
      await fetchWorkspaces();
    } catch (err) {
      console.error('Failed to delete document:', err);
      throw err;
    }
  };

  const analyzeWorkspace = async (workspaceId: string) => {
    try {
      const updatedWorkspace = await apiAnalyzeWorkspace(workspaceId);
      setWorkspaces(prev => prev.map(ws => ws.id === workspaceId ? updatedWorkspace : ws));
      const isDemo = updatedWorkspace.analysis?.metadata?.demoMode;
      if (isDemo) {
        addToast('Analysis Completed (Demo Mode)', 'info', 'Using cached enterprise analysis. AI service is temporarily unavailable.');
      } else {
        addToast('Analysis Completed Successfully', 'success', 'Decision Intelligence generated successfully.');
      }
    } catch (err) {
      console.error('Failed to analyze workspace:', err);
      throw err;
    }
  };

  const deleteWorkspace = async (workspaceId: string) => {
    console.log(`[WorkspaceContext] deleteWorkspace called for ID: ${workspaceId}`);
    console.log(`[WorkspaceContext] Workspace IDs before delete:`, workspaces.map(ws => `${ws.id} (${ws.name})`));
    try {
      await deleteWorkspaceAPI(workspaceId);
      // Optimistic update: remove by strict ID equality
      setWorkspaces(prev => {
        const filtered = prev.filter(ws => ws.id !== workspaceId);
        console.log(`[WorkspaceContext] Workspace IDs after optimistic delete:`, filtered.map(ws => `${ws.id} (${ws.name})`));
        return filtered;
      });
      await fetchWorkspaces();
    } catch (err: any) {
      console.error('[WorkspaceContext] Failed to delete workspace:', err);
      if (err.response) {
        console.error('Response Status:', err.response.status);
        console.error('Response Body:', err.response.data);
      }
      throw err;
    }
  };

  const executeAction = async (workspaceId: string, payload: ExecuteActionPayload): Promise<WorkspaceData> => {
    const updatedWorkspace = await executeActionAPI(workspaceId, payload);
    setWorkspaces(prev => prev.map(ws => ws.id === workspaceId ? updatedWorkspace : ws));
    return updatedWorkspace;
  };

  return (
    <WorkspaceContext.Provider value={{
      workspaces, loading, error, toasts,
      addWorkspace, refreshWorkspaces: fetchWorkspaces,
      uploadDocs, deleteDoc, analyzeWorkspace,
      deleteWorkspace, executeAction,
      addToast, removeToast,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
};
