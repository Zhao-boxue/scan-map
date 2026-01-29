import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { VoiceInput } from '../components/VoiceInput';
import { MapCanvas } from '../components/MapCanvas';
import { ArrowLeft, Play, Pause, MapPin, Upload, RotateCcw, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const ScanMapScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { robot, points, zones, currentFloor, setScanning, addPoint, setFloor, finishFloorScan } = useApp();
  
  const [showNextFloorModal, setShowNextFloorModal] = useState(false);
  const [showRescanModal, setShowRescanModal] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');

  // 1. Import Handler
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      alert("地图文件已导入! (模拟)");
    }
  };

  // 2. Add Point Handler
  const handleAddPoint = () => {
    addPoint({
      id: uuidv4(),
      x: robot.x,
      y: robot.y,
      name: `标记点 ${points.length + 1}`,
      floor: currentFloor
    });
  };

  // 3. Toggle Scan
  const toggleScan = () => {
    setScanning(!robot.isScanning);
  };

  // 4. Rescan Handler
  const handleRescan = () => {
    setNewFloorName(''); // Clear for re-entry
    setShowRescanModal(true);
  };

  // 5. Finish Handler
  const handleFinish = () => {
    finishFloorScan();
    setScanning(false);
    setShowNextFloorModal(true);
  };

  const handleNextFloorYes = () => {
    setShowNextFloorModal(false);
    setShowRescanModal(true); // Reuse the floor input modal
  };

  const handleNextFloorNo = () => {
    navigate('/marking');
  };

  const handleFloorSubmit = () => {
    if (newFloorName) {
      setFloor(newFloorName);
      setScanning(false); // Stop scan on new floor
      setShowRescanModal(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3 text-white">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-700 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-semibold text-sm opacity-70">正在扫描楼层</h1>
            <p className="text-lg font-bold text-brand-400">{currentFloor}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${robot.isScanning ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-slate-700 text-slate-400'}`}>
          {robot.isScanning ? '自动探索' : '手动模式'}
        </div>
      </header>

      {/* Map Area */}
      <div className="flex-1 relative">
        <MapCanvas mode="scan" robotState={robot} points={points} zones={zones} floor={currentFloor} />
      </div>

      {/* Bottom Controls */}
      <div className="bg-slate-800 p-4 pb-8 border-t border-slate-700">
        <div className="grid grid-cols-5 gap-2">
          {/* 1. Import */}
          <button onClick={handleImportClick} className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
            <div className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600">
              <Upload size={20} />
            </div>
            <span className="text-[10px]">导入</span>
            <input type="file" ref={fileInputRef} className="hidden" accept=".png,.jpg,.json" onChange={handleFileChange} />
          </button>

          {/* 2. Point */}
          <button onClick={handleAddPoint} className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
            <div className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600">
              <MapPin size={20} />
            </div>
            <span className="text-[10px]">点位输入</span>
          </button>

          {/* 3. Start/Stop - Prominent */}
          <button onClick={toggleScan} className="flex flex-col items-center gap-1 -mt-6">
            <div className={`p-5 rounded-full shadow-lg border-4 border-slate-800 transition-all ${robot.isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-500 hover:bg-brand-600'}`}>
              {robot.isScanning ? <Pause fill="white" size={24} className="text-white" /> : <Play fill="white" size={24} className="text-white ml-1" />}
            </div>
            <span className="text-xs font-medium text-white">{robot.isScanning ? '结束' : '启动'}</span>
          </button>

          {/* 4. Rescan */}
          <button onClick={handleRescan} className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
            <div className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600">
              <RotateCcw size={20} />
            </div>
            <span className="text-[10px]">重新扫图</span>
          </button>

          {/* 5. Finish */}
          <button onClick={handleFinish} className="flex flex-col items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors">
            <div className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle size={20} />
            </div>
            <span className="text-[10px]">完成扫图</span>
          </button>
        </div>
      </div>

      {/* Modal: Scan Next Floor? */}
      <Modal 
        isOpen={showNextFloorModal} 
        onClose={() => setShowNextFloorModal(false)}
        title="楼层扫图完成"
      >
        <p className="text-slate-600 mb-6">是否进入其他楼层扫图？</p>
        <div className="flex gap-4">
          <Button variant="secondary" fullWidth onClick={handleNextFloorNo}>否，完成</Button>
          <Button fullWidth onClick={handleNextFloorYes}>是，进入下一层</Button>
        </div>
      </Modal>

      {/* Modal: Floor Input (Used for Rescan and Next Floor) */}
      <Modal
        isOpen={showRescanModal}
        onClose={() => setShowRescanModal(false)}
        title="请输入楼层编号"
        footer={<Button onClick={handleFloorSubmit} disabled={!newFloorName}>确认</Button>}
      >
        <VoiceInput 
          value={newFloorName}
          onChange={(e) => setNewFloorName(e.target.value)}
          onVoiceResult={setNewFloorName}
          placeholder="例如：2楼"
          label="楼层名称"
        />
      </Modal>
    </div>
  );
};