import React, { useState, useRef } from 'react';
import { extractTextFromPdf } from '../services/pdfService';
import { UploadCloudIcon, ZapIcon, XCircleIcon, TrashIcon } from './Icons';

interface TextInputAreaProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
}

const TextInputArea: React.FC<TextInputAreaProps> = ({ onGenerate, isLoading }) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value && files.length > 0) {
      setFiles([]); 
    }
  };

  const processAndSetFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const pdfFiles = Array.from(fileList).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== fileList.length) {
      alert('Some selected files were not PDFs and have been ignored.');
    }
    
    if (pdfFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
        if (text) setText(''); 
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processAndSetFiles(event.target.files);

    if (event.target) {
        event.target.value = '';
    }
  };
  
  const handleGenerateClick = async () => {
    if (text.trim() && files.length === 0) {
      onGenerate(text);
      return;
    }

    if (files.length > 0) {
      setIsProcessingPdf(true);
      try {
        const allTextPromises = files.map(file => extractTextFromPdf(file));
        const allTexts = await Promise.all(allTextPromises);

        const combinedText = allTexts.join('\n\n--- [END OF DOCUMENT] ---\n\n'); 
        onGenerate(combinedText);
      } catch (error) {
        console.error('Error processing PDFs:', error);
        alert('There was an error processing one or more PDF files. Please check the console for details.');
      } finally {
        setIsProcessingPdf(false);
      }
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    processAndSetFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };
  
  const clearAllFiles = () => {
    setFiles([]);
  };

  const buttonText = isLoading ? 'Generating...' : (isProcessingPdf ? 'Processing PDFs...' : 'Generate Study Aids');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Input Your Material</h2>
      <div className="flex flex-col gap-4">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Paste your text here, or upload PDF(s) below."
          className="w-full h-48 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          disabled={isLoading || isProcessingPdf}
        />
        <div 
            className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
            multiple
          />
          <UploadCloudIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="text-slate-600">
            <span className="font-semibold text-cyan-600">Upload PDF(s)</span> or drag and drop.
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-600">Selected Files:</h3>
                <button onClick={clearAllFiles} className="text-sm font-semibold text-red-600 hover:text-red-500 flex items-center gap-1">
                    <TrashIcon className="w-4 h-4" />
                    Clear All
                </button>
            </div>
            <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-slate-100 p-2 rounded-md text-sm">
                  <span className="text-slate-700 truncate">{file.name}</span>
                  <button onClick={() => removeFile(index)} className="text-slate-500 hover:text-red-600">
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleGenerateClick}
          disabled={isLoading || isProcessingPdf || (!text.trim() && files.length === 0)}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow hover:shadow-md"
        >
          {buttonText}
          {!isLoading && !isProcessingPdf && <ZapIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default TextInputArea;