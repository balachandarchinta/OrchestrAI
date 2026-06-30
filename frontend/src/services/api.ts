import axios from 'axios';
import type { WorkspaceData } from '../types/workspace';

const API_BASE_URL = 'http://localhost:8001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getWorkspaces = async (): Promise<WorkspaceData[]> => {
  const response = await apiClient.get('/workspaces/');
  return response.data;
};

export const createWorkspace = async (name: string, scenario: string): Promise<WorkspaceData> => {
  const response = await apiClient.post('/workspaces/', { name, scenario });
  return response.data;
};

export const uploadDocuments = async (workspaceId: string, files: File[]): Promise<any> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const response = await apiClient.post(`/workspaces/${workspaceId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDocument = async (workspaceId: string, docId: string): Promise<any> => {
  const response = await apiClient.delete(`/workspaces/${workspaceId}/documents/${docId}`);
  return response.data;
};

export const previewDocument = async (workspaceId: string, docId: string): Promise<{metadata: any, preview: string}> => {
  const response = await apiClient.get(`/workspaces/${workspaceId}/documents/${docId}/preview`);
  return response.data;
};

export const analyzeWorkspace = async (workspaceId: string): Promise<WorkspaceData> => {
  const response = await apiClient.post(`/workspaces/${workspaceId}/analyze`);
  return response.data;
};

export const deleteWorkspaceAPI = async (workspaceId: string): Promise<any> => {
  const url = `/workspaces/${workspaceId}`;
  console.log(`[API Client] DELETE Request to: ${API_BASE_URL}${url}`);
  try {
    const response = await apiClient.delete(url);
    console.log(`[API Client] DELETE Response Status: ${response.status}`);
    console.log(`[API Client] DELETE Response Body:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`[API Client] Error on DELETE ${url}:`, error);
    throw error;
  }
};

export const executeActionAPI = async (
  workspaceId: string,
  payload: {
    actionTitle: string;
    actionOwner: string;
    actionDue: string;
    priority?: string;
    businessImpact?: string;
    executedBy?: string;
  }
): Promise<any> => {
  const response = await apiClient.patch(`/workspaces/${workspaceId}/execute-action`, payload);
  return response.data;
};

