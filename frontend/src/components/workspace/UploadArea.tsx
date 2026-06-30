import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Trash2, Eye, X, Loader2, FileSpreadsheet, File as FileIcon } from 'lucide-react';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { useParams } from 'react-router-dom';
import { previewDocument } from '../../services/api';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['pdf', 'txt', 'xlsx'];

export default function UploadArea() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { workspaces, uploadDocs, deleteDoc } = useWorkspaceContext();
  const workspace = workspaces.find((w) => w.id === workspaceId);
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [previewData, setPreviewData] = useState<{ metadata: any, preview: string } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const processFiles = async (files: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(files);
    
    if (fileArray.length > 5) {
      setError("Maximum 5 files per upload allowed.");
      return;
    }
    
    const validFiles: File[] = [];
    for (const file of fileArray) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setError(`Unsupported file type: ${ext}. Allowed: PDF, TXT, XLSX.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} exceeds the 10MB limit.`);
        return;
      }
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;
    
    if (workspaceId) {
      try {
        setUploading(true);
        await uploadDocs(workspaceId, validFiles);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Upload failed.");
      } finally {
        setUploading(false);
      }
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDelete = async (docId: string) => {
    if (workspaceId && window.confirm("Are you sure you want to delete this document?")) {
      await deleteDoc(workspaceId, docId);
    }
  };
  
  const handlePreview = async (docId: string) => {
    if (workspaceId) {
      try {
        setLoadingPreview(true);
        const data = await previewDocument(workspaceId, docId);
        setPreviewData(data);
      } catch (err) {
        alert("Failed to load preview.");
      } finally {
        setLoadingPreview(false);
      }
    }
  };
  
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const getFileIcon = (ext: string) => {
    if (ext === 'pdf') return <FileIcon size={16} className="text-red-500" />;
    if (ext === 'xlsx') return <FileSpreadsheet size={16} className="text-green-600" />;
    return <FileText size={16} className="text-slate-500" />;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-md p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Upload Documents</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group mb-6
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
      >
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.txt,.xlsx"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center text-blue-600">
            <Loader2 size={40} className="mb-4 animate-spin" />
            <p className="text-sm font-medium">Uploading documents...</p>
          </div>
        ) : (
          <>
            <UploadCloud size={40} className={`mb-4 transition-colors ${isDragging ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
            
            <p className="text-sm font-medium text-slate-700 mb-1">
              📄 Drag & Drop
            </p>
            <p className="text-xs text-slate-500 mb-3">or</p>
            
            <button type="button" className="px-4 py-2 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-4">
              Browse Files
            </button>
            
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Supports (Max 10MB, up to 5 files)</span>
              <span className="font-semibold px-2 py-0.5 bg-slate-200 text-slate-600 rounded">PDF</span>
              <span className="font-semibold px-2 py-0.5 bg-slate-200 text-slate-600 rounded">TXT</span>
              <span className="font-semibold px-2 py-0.5 bg-slate-200 text-slate-600 rounded">XLSX</span>
            </div>
          </>
        )}
      </div>

      {workspace?.files && workspace.files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Uploaded Documents ({workspace.files.length})</h3>
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">File Name</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Uploaded</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workspace.files.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 flex items-center gap-2 font-medium text-slate-700">
                      {getFileIcon(file.extension)}
                      {file.filename}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatSize(file.size)}</td>
                    <td className="px-4 py-3 text-slate-500">{file.uploadedAt}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium 
                        ${file.status === 'Ready' ? 'bg-green-100 text-green-700' : 
                          file.status === 'Failed' ? 'bg-red-100 text-red-700' : 
                          'bg-blue-100 text-blue-700'}`}>
                        {file.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-end gap-2">
                      <button 
                        onClick={() => handlePreview(file.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Preview Text"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(file.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                {getFileIcon(previewData.metadata.extension)}
                <h3 className="font-semibold text-slate-800">{previewData.metadata.filename}</h3>
              </div>
              <button 
                onClick={() => setPreviewData(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 flex gap-4">
              <span>Status: {previewData.metadata.status}</span>
              <span>Characters: {previewData.metadata.characterCount?.toLocaleString() || 'N/A'}</span>
              <span>Uploaded: {previewData.metadata.uploadedAt}</span>
            </div>
            <div className="p-4 overflow-y-auto flex-1 text-sm text-slate-700 font-mono whitespace-pre-wrap">
              {previewData.preview}
            </div>
            <div className="p-4 border-t border-slate-200 text-right">
              <button 
                onClick={() => setPreviewData(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {loadingPreview && (
        <div className="fixed inset-0 bg-slate-900/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <span className="font-medium text-slate-700">Loading preview...</span>
          </div>
        </div>
      )}
    </div>
  );
}
