import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { MapCanvas } from '../components/MapCanvas';
import { ArrowLeft, Layers, Map as MapIcon, Check } from 'lucide-react';
import { ZoneType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { MOCK_MAPS, MOCK_FLOORS } from '../constants';

export const ZoneSelectScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentFloor, points, zones, robot, addZone, setFloor, setMapName, scannedFloors } = useApp();
  
  const [showMapSelect, setShowMapSelect] = useState(false);
  const [showFloorSelect, setShowFloorSelect] = useState(false);
  const [showZoneTypeModal, setShowZoneTypeModal] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{x: number, y: number} | null>(null);

  const handleZoneSelect = (x: number, y: number) => {
    setSelectedCoords({ x, y });
    setShowZoneTypeModal(true);
  };

  const confirmZone = (type: ZoneType) => {
    if (!selectedCoords) return;
    // We simulate a 50x50 block for the click
    addZone({
        id: uuidv4(),
        x: selectedCoords.x - 25,
        y: selectedCoords.y - 25,
        width: 50,
        height: 50,
        type: type,
        floor: currentFloor
    });
    setShowZoneTypeModal(false);
  };

  const handleFinish = () => {
    navigate('/report');
  };

  return (
    <div className="h-full flex flex-col bg-white">
        <header className="bg-white p-4 flex items-center justify-between border-b border-slate-100 shadow-sm z-10">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-semibold text-slate-800">区域选择</h1>
            </div>
            <div className="flex gap-2">
                 <button onClick={() => setShowMapSelect(true)} className="p-2 text-slate-500 hover:text-brand-600"><MapIcon size={20}/></button>
                 <button onClick={() => setShowFloorSelect(true)} className="p-2 text-slate-500 hover:text-brand-600"><Layers size={20}/></button>
            </div>
        </header>

        <div className="flex-1 relative bg-slate-50">
            <MapCanvas mode="zone" points={points} zones={zones} floor={currentFloor} onZoneSelect={handleZoneSelect} />
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md">
                    在地图上手动选择区域
                </span>
            </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white">
            <Button fullWidth size="lg" onClick={handleFinish} className="bg-brand-600">
                完成
            </Button>
        </div>

        {/* Modals same as before for map/floor */}
        <Modal isOpen={showMapSelect} onClose={() => setShowMapSelect(false)} title="切换地图">
             <div className="space-y-2">
                {MOCK_MAPS.map(m => (
                    <button key={m.id} onClick={() => { setMapName(m.name); setShowMapSelect(false); }} className="w-full text-left p-3 hover:bg-slate-50 rounded">{m.name}</button>
                ))}
            </div>
        </Modal>

        <Modal isOpen={showFloorSelect} onClose={() => setShowFloorSelect(false)} title="切换楼层">
             <div className="space-y-2">
                {(scannedFloors.length > 0 ? scannedFloors : MOCK_FLOORS).map(f => (
                    <button key={f} onClick={() => { setFloor(f); setShowFloorSelect(false); }} className="w-full text-left p-3 hover:bg-slate-50 rounded">{f}</button>
                ))}
            </div>
        </Modal>

        {/* Zone Type Selection */}
        <Modal isOpen={showZoneTypeModal} onClose={() => setShowZoneTypeModal(false)} title="选择区域类型">
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => confirmZone(ZoneType.CARPET)}
                    className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                >
                    <div className="w-12 h-12 bg-amber-100 rounded-full mb-3 flex items-center justify-center text-amber-600 font-bold">C</div>
                    <span className="font-medium text-slate-800">地毯</span>
                </button>
                <button 
                    onClick={() => confirmZone(ZoneType.MARBLE)}
                    className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all"
                >
                     <div className="w-12 h-12 bg-sky-100 rounded-full mb-3 flex items-center justify-center text-sky-600 font-bold">M</div>
                    <span className="font-medium text-slate-800">大理石</span>
                </button>
            </div>
        </Modal>
    </div>
  );
};