import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  IoCloudUploadOutline, 
  IoDocumentTextOutline, 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline,
  IoDocumentAttachOutline
} from 'react-icons/io5';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/home/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import api from '../services/api';

export default function RagUpload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setUploadStatus('error');
      setErrorMessage('Unsupported file. Please upload a PDF.');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setUploadStatus('idle');
    setErrorMessage('');
    setUploadResult(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('error');
      setErrorMessage('No file selected. Please select a PDF to upload.');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/rag/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setUploadStatus('success');
      setUploadResult({
        filename: response.data?.filename || file.name,
        filesize: response.data?.filesize || formatFileSize(file.size),
        uploadTime: response.data?.uploadTime || new Date().toLocaleString()
      });
      setFile(null);
    } catch (error) {
      setUploadStatus('error');
      const msg = error.response?.data?.message || error.response?.data || error.message || 'Upload failed. Please try again.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Upload failed.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      <Navbar />

      <div className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">AI Knowledge Base</h2>
            <p className="text-slate-400 font-semibold max-w-xl mx-auto">
              Upload airline documents so the AI assistant can answer questions using company knowledge.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <Card variant="glass" className="p-8 border border-white/5 relative overflow-hidden">
              
              {/* Status Header */}
              {uploadStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
                  <IoCheckmarkCircleOutline className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-green-400">PDF Uploaded Successfully</h4>
                    {uploadResult && (
                      <div className="mt-2 text-xs text-slate-300 space-y-1">
                        <p><span className="text-slate-500">File:</span> {uploadResult.filename}</p>
                        <p><span className="text-slate-500">Size:</span> {uploadResult.filesize}</p>
                        <p><span className="text-slate-500">Time:</span> {uploadResult.uploadTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <IoCloseCircleOutline className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-red-400">Upload Failed</h4>
                    <p className="mt-1 text-xs text-slate-300">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer mb-6 ${
                  isDragging ? 'border-gold bg-gold/5' : 'border-slate-700 bg-navy-900/50 hover:border-slate-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,application/pdf" 
                />
                
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold mb-4 pointer-events-none">
                  <IoCloudUploadOutline className="w-8 h-8" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 pointer-events-none">
                  Drag & Drop your PDF here
                </h3>
                <p className="text-xs text-slate-400 pointer-events-none mb-6">
                  or click to browse your files
                </p>

                <Button variant="secondary" className="pointer-events-none text-xs uppercase tracking-wider py-2">
                  Choose PDF
                </Button>
                
                <p className="text-[10px] text-slate-500 mt-6 font-semibold uppercase tracking-widest pointer-events-none">
                  Supported format: PDF only • Max size: 50MB
                </p>
              </div>

              {/* Selected File Details */}
              {file && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-navy-900 border border-slate-700 rounded-xl p-4 mb-6 flex items-center gap-4"
                >
                  <div className="p-3 bg-white/5 rounded-lg text-gold">
                    <IoDocumentTextOutline className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                  </div>
                  {uploadStatus !== 'uploading' && (
                    <button 
                      onClick={() => setFile(null)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remove file"
                    >
                      <IoCloseCircleOutline className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              )}

              {/* Progress Bar */}
              {uploadStatus === 'uploading' && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400 font-semibold">Uploading...</span>
                    <span className="text-gold font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-navy-900 rounded-full h-1.5 border border-slate-800 overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-gold to-yellow-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button 
                variant="primary" 
                className="w-full text-sm uppercase tracking-widest font-extrabold"
                onClick={handleUpload}
                disabled={!file || uploadStatus === 'uploading'}
                isLoading={uploadStatus === 'uploading'}
              >
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Document'}
              </Button>

            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
