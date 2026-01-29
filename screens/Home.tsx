import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Scan, AlertTriangle } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-500 blur-3xl opacity-20 rounded-full"></div>
          <div className="relative bg-slate-800 p-8 rounded-full border border-slate-700 shadow-2xl">
            <Scan size={64} className="text-brand-400" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">开始扫图</h1>
          <p className="text-slate-400">机器人地图扫描系统</p>
        </div>

        <Button 
          size="lg" 
          onClick={() => navigate('/mode')}
          className="w-64 h-16 text-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] animate-pulse hover:animate-none"
        >
          扫图
        </Button>
      </div>

      {/* Footer Warnings */}
      <div className="bg-slate-800 p-6 rounded-t-3xl border-t border-slate-700">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-500">注意事项</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              扫图过程中请跟随机器人，确保机器人在自动扫图时不会进入危险区域；
              <br />
              <span className="text-white font-medium">如出现危险区域，需进行急停操作。</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};