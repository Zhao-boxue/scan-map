import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapCanvas } from '../components/MapCanvas';
import { ArrowLeft, MapPin, Layers, Home } from 'lucide-react';
import { Button } from '../components/Button';

export const FinalReportScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentFloor, points, zones, currentMapName } = useApp();

  const currentPoints = points.filter(p => p.floor === currentFloor);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <header className="bg-white p-4 flex items-center justify-between border-b border-slate-200 shadow-sm">
         <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="font-bold text-slate-900">{currentMapName || '新地图'}</h1>
                <p className="text-xs text-slate-500">最终地图展示</p>
            </div>
        </div>
        <Button size="sm" variant="ghost" onClick={() => navigate('/')} icon={<Home size={16}/>}>首页</Button>
      </header>

      {/* Map Display */}
      <div className="h-1/2 bg-slate-200 relative border-b border-slate-300">
         <MapCanvas mode="view" points={points} zones={zones} floor={currentFloor} />
      </div>

      {/* Lists */}
      <div className="flex-1 bg-white overflow-y-auto p-4">
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-brand-600">
                <Layers size={18} />
                <h2 className="font-semibold">当前楼层: {currentFloor}</h2>
            </div>
        </div>

        <div>
            <div className="flex items-center gap-2 mb-3 text-slate-500">
                <MapPin size={18} />
                <h2 className="font-semibold text-sm uppercase tracking-wide">点位名称列表 ({currentPoints.length})</h2>
            </div>
            
            <div className="space-y-2">
                {currentPoints.length === 0 ? (
                    <p className="text-slate-400 italic text-sm">该楼层无标记点位。</p>
                ) : (
                    currentPoints.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="font-medium text-slate-700">{p.name}</span>
                            <span className="text-xs text-slate-400 font-mono">({Math.round(p.x)}, {Math.round(p.y)})</span>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};