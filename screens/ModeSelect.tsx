import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { VoiceInput } from '../components/VoiceInput';
import { ArrowLeft, Upload, MapPlus, Loader2 } from 'lucide-react';
import { MOCK_MAPS } from '../constants';

export const ModeSelectScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setMapName, setFloor, resetScan } = useApp();
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [showNewMapModal, setShowNewMapModal] = useState(false);
  const [showFloorModal, setShowFloorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Temp state for inputs
  const [tempMapName, setTempMapName] = useState('');
  const [tempFloor, setTempFloor] = useState('L1');

  const handleBack = () => navigate(-1);

  // Flow A: Import
  const handleImportSelect = (mapName: string) => {
    setMapName(mapName);
    setShowImportModal(false);
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      resetScan();
      navigate('/marking'); // Jump straight to point marking as per req
    }, 2000);
  };

  // Flow B: New Map
  const handleNewMapConfirm = () => {
    if (!tempMapName) return;
    setMapName(tempMapName);
    setShowNewMapModal(false);
    setShowFloorModal(true);
  };

  const handleFloorConfirm = () => {
    if (!tempFloor) return;
    setFloor(tempFloor);
    setShowFloorModal(false);
    resetScan();
    navigate('/scan');
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white">
        <Loader2 size={48} className="text-brand-600 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-slate-700">正在加载地图数据...</h2>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <header className="bg-white p-4 shadow-sm flex items-center gap-3">
        <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">选择扫图模式</h1>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-6 justify-center">
        <button 
          onClick={() => setShowImportModal(true)}
          className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors">
              <Upload size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">导入勘察地图</h2>
              <p className="text-slate-500 text-sm">选择并加载已有客户/场景地图</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setShowNewMapModal(true)}
          className="group relative overflow-hidden bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-brand-50 text-brand-600 rounded-xl group-hover:bg-brand-100 transition-colors">
              <MapPlus size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">新建地图</h2>
              <p className="text-slate-500 text-sm">创建新地图并开始扫描</p>
            </div>
          </div>
        </button>
      </main>

      {/* Import Modal */}
      <Modal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)}
        title="选择地图"
      >
        <div className="space-y-2">
          {MOCK_MAPS.map(map => (
            <button
              key={map.id}
              onClick={() => handleImportSelect(map.name)}
              className="w-full text-left p-4 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all flex items-center justify-between"
            >
              <span className="font-medium text-slate-700">{map.name}</span>
              <span className="text-xs text-slate-400">ID: {map.id}</span>
            </button>
          ))}
        </div>
      </Modal>

      {/* New Map Name Modal */}
      <Modal
        isOpen={showNewMapModal}
        onClose={() => setShowNewMapModal(false)}
        title="请输入地图名称"
        footer={
          <Button onClick={handleNewMapConfirm} disabled={!tempMapName}>确认</Button>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">支持手动输入或语音输入。</p>
          <VoiceInput 
            value={tempMapName} 
            onChange={(e) => setTempMapName(e.target.value)}
            onVoiceResult={setTempMapName}
            placeholder="例如：市中心办公楼"
          />
        </div>
      </Modal>

      {/* Floor Input Modal */}
      <Modal
        isOpen={showFloorModal}
        onClose={() => setShowFloorModal(false)}
        title="请输入当前所在楼层"
        footer={
          <Button onClick={handleFloorConfirm} disabled={!tempFloor}>开始扫图</Button>
        }
      >
         <div className="space-y-4">
          <p className="text-sm text-slate-500">支持手动输入或语音输入。</p>
          <VoiceInput 
            value={tempFloor} 
            onChange={(e) => setTempFloor(e.target.value)}
            onVoiceResult={setTempFloor}
            placeholder="例如：1楼"
          />
        </div>
      </Modal>
    </div>
  );
};