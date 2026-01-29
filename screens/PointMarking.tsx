import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { MapCanvas } from '../components/MapCanvas';
import { ArrowLeft, Map as MapIcon, Layers, Crosshair, Plus, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MOCK_FLOORS, MOCK_MAPS } from '../constants';

export const PointMarkingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentFloor, points, robot, addPoint, setFloor, setMapName, scannedFloors, moveRobot } = useApp();
  
  const [showMapSelect, setShowMapSelect] = useState(false);
  const [showFloorSelect, setShowFloorSelect] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [pointName, setPointName] = useState('');

  // 3. Auto Locate
  const handleAutoLocate = () => {
    setIsLocating(true);
    // Simulation
    setTimeout(() => {
        setIsLocating(false);
        // Random success/fail
        if (Math.random() > 0.1) {
            // Success: move robot visual to center
            moveRobot(400, 300); 
            alert("自动定位成功 (400, 300)");
        } else {
            alert("定位失败，请手动移动机器人。");
        }
    }, 2000);
  };

  // 4. Mark Current Point
  const handleMarkClick = () => {
    setShowNameModal(true);
  };

  const confirmMark = () => {
    if (!pointName) return;
    addPoint({
        id: uuidv4(),
        x: robot.x,
        y: robot.y,
        name: pointName,
        floor: currentFloor
    });
    setPointName('');
    setShowNameModal(false);
  };

  const handleFinish = () => {
      navigate('/zones');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="bg-white p-4 flex items-center justify-between border-b border-slate-100 shadow-sm z-10">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
                <ArrowLeft size={20} />
            </button>
            <h1 className="font-semibold text-slate-800">点位标记</h1>
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative bg-slate-100">
        <MapCanvas mode="view" robotState={robot} points={points} floor={currentFloor} />
        
        {/* Floating Controls for Map/Floor */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button onClick={() => setShowMapSelect(true)} className="bg-white p-2 rounded-lg shadow-md text-slate-600 hover:text-brand-600">
                <MapIcon size={20} />
            </button>
            <button onClick={() => setShowFloorSelect(true)} className="bg-white p-2 rounded-lg shadow-md text-slate-600 hover:text-brand-600">
                <Layers size={20} />
            </button>
        </div>

        {/* Locate Overlay */}
        {isLocating && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col text-white backdrop-blur-sm">
                <Crosshair size={48} className="animate-spin mb-4" />
                <p className="font-medium">正在定位...</p>
            </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bg-white p-4 border-t border-slate-100 safe-bottom">
        <div className="grid grid-cols-2 gap-4 mb-4">
            <Button variant="secondary" onClick={handleAutoLocate} icon={<Crosshair size={18}/>}>
                自动定位
            </Button>
            <Button onClick={handleMarkClick} icon={<Plus size={18}/>}>
                当前点位标记
            </Button>
        </div>
        <Button fullWidth variant="primary" size="lg" onClick={handleFinish} className="bg-slate-900 hover:bg-slate-800">
            完成点位标记
        </Button>
      </div>

      {/* Modals */}
      <Modal isOpen={showMapSelect} onClose={() => setShowMapSelect(false)} title="切换地图">
        <div className="space-y-2">
            {MOCK_MAPS.map(m => (
                <button key={m.id} onClick={() => { setMapName(m.name); setShowMapSelect(false); }} className="w-full text-left p-3 hover:bg-slate-50 rounded">
                    {m.name}
                </button>
            ))}
        </div>
      </Modal>

      <Modal isOpen={showFloorSelect} onClose={() => setShowFloorSelect(false)} title="切换楼层">
        <div className="space-y-2">
            {(scannedFloors.length > 0 ? scannedFloors : MOCK_FLOORS).map(f => (
                <button key={f} onClick={() => { setFloor(f); setShowFloorSelect(false); }} className={`w-full text-left p-3 rounded ${currentFloor === f ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50'}`}>
                    {f}
                </button>
            ))}
        </div>
      </Modal>

      <Modal isOpen={showNameModal} onClose={() => setShowNameModal(false)} title="请输入点位名称" footer={<Button onClick={confirmMark}>完成</Button>}>
        <input 
            autoFocus
            className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="例如：厨房入口"
            value={pointName}
            onChange={e => setPointName(e.target.value)}
        />
      </Modal>
    </div>
  );
};