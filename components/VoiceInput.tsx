import React, { useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';

interface VoiceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onVoiceResult: (text: string) => void;
  label?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceResult, label, className = '', ...props }) => {
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    if (isListening) return;
    setIsListening(true);
    // Simulate voice recognition delay
    setTimeout(() => {
      setIsListening(false);
      const mockResults = ["1楼 办公区", "会议室 A", "大厅区域", "仓库 3区"];
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      onVoiceResult(randomResult);
    }, 2000);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <div className="relative">
        <input 
          {...props}
          className={`w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all ${className}`}
        />
        <button
          type="button"
          onClick={handleMicClick}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
            isListening ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-brand-600 hover:bg-brand-50'
          }`}
        >
          {isListening ? <Loader2 size={20} className="animate-spin" /> : <Mic size={20} />}
        </button>
      </div>
      {isListening && <p className="text-xs text-brand-600 mt-1 ml-1 animate-pulse">正在聆听...</p>}
    </div>
  );
};