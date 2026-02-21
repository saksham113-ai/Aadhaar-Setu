
import React, { useState } from 'react';
import { Upload as UploadIcon, FileJson, CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { AadhaarRecord } from '../types';

interface UploadProps {
  onDataUpdate: (newData: AadhaarRecord[]) => void;
}

const Upload: React.FC<UploadProps> = ({ onDataUpdate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFile = (file: File) => {
    if (file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          // Simple mock parsing logic
          // In a real app, we'd use a CSV library, here we simulate it
          let parsed: AadhaarRecord[] = [];
          
          if (file.name.endsWith('.json')) {
            parsed = JSON.parse(content);
          } else {
            // Simplified CSV parsing for demo
            const lines = content.split('\n').slice(1);
            parsed = lines.filter(l => l.trim()).map(line => {
              const [state, district, enrolled, updates, rejected, age] = line.split(',');
              return {
                state,
                district,
                enrolled: parseInt(enrolled) || 0,
                updates: parseInt(updates) || 0,
                rejected: parseInt(rejected) || 0,
                gender_m: Math.floor(parseInt(enrolled) * 0.52) || 0,
                gender_f: Math.floor(parseInt(enrolled) * 0.48) || 0,
                age_group: (age as any) || '19-45',
                month: 'Jun'
              };
            });
          }

          if (parsed.length > 0) {
            onDataUpdate(parsed);
            setUploadStatus('success');
          } else {
            setUploadStatus('error');
          }
        } catch (err) {
          console.error(err);
          setUploadStatus('error');
        }
      };
      reader.readAsText(file);
    } else {
      setUploadStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#003366] mb-2">Ingest National Data</h1>
        <p className="text-gray-500">Upload statewide Aadhaar summary reports for consolidated analysis</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div 
          className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-[#003366] bg-gray-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleChange}
            accept=".csv,.json"
          />
          
          {uploadStatus === 'idle' && (
            <>
              <div className="p-4 bg-white rounded-full shadow-md mb-4 text-[#003366]">
                <UploadIcon size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Click or drag CSV file here</h3>
              <p className="text-sm text-gray-400 mt-2">Supports .CSV, .JSON (Max 50MB)</p>
            </>
          )}

          {uploadStatus === 'success' && (
            <div className="text-center animate-in zoom-in duration-300">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-700">File Ingested Successfully</h3>
              <p className="text-sm text-gray-500 mt-2">Filename: {fileName}</p>
              <button 
                onClick={() => setUploadStatus('idle')}
                className="mt-6 text-sm font-bold text-[#003366] underline"
              >
                Upload another file
              </button>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="text-center animate-in zoom-in duration-300">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700">Upload Failed</h3>
              <p className="text-sm text-gray-500 mt-2">The file format is invalid or corrupted.</p>
              <button 
                onClick={() => setUploadStatus('idle')}
                className="mt-6 text-sm font-bold text-red-600 underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
              <FileJson size={18} /> Required CSV Schema
            </h4>
            <div className="text-xs text-blue-700 font-mono space-y-2">
              <p>state, district, enrolled, updates, rejected, age_group</p>
              <hr className="border-blue-200" />
              <p>Maharashtra, Mumbai, 450, 120, 15, 19-45</p>
              <p>Karnataka, Bangalore, 600, 200, 40, 0-18</p>
            </div>
          </div>
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex flex-col justify-center">
            <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-3">
              <Info size={18} /> Integration Notice
            </h4>
            <p className="text-xs text-orange-700 leading-relaxed">
              Upon successful upload, the dashboard metrics, demographic charts, and AI insight modules will be 
              re-calculated in real-time based on the provided dataset. Large datasets may take a few seconds to process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
