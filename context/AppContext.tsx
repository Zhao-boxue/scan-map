import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppState, MapPoint, MapZone, RobotState } from '../types';

interface AppContextType extends AppState {
  robot: RobotState;
  setMapName: (name: string) => void;
  setFloor: (floor: string) => void;
  addPoint: (point: MapPoint) => void;
  addZone: (zone: MapZone) => void;
  setScanning: (isScanning: boolean) => void;
  moveRobot: (x: number, y: number) => void;
  finishFloorScan: () => void;
  resetScan: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mapName, setMapName] = useState('');
  const [floor, setFloor] = useState('L1');
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [zones, setZones] = useState<MapZone[]>([]);
  const [scannedFloors, setScannedFloors] = useState<string[]>([]);
  
  const [robot, setRobot] = useState<RobotState>({
    x: 400,
    y: 300,
    isScanning: false,
    battery: 85
  });

  const addPoint = useCallback((point: MapPoint) => {
    setPoints(prev => [...prev, point]);
  }, []);

  const addZone = useCallback((zone: MapZone) => {
    setZones(prev => [...prev, zone]);
  }, []);

  const finishFloorScan = useCallback(() => {
    if (!scannedFloors.includes(floor)) {
      setScannedFloors(prev => [...prev, floor]);
    }
    setRobot(prev => ({ ...prev, isScanning: false }));
  }, [floor, scannedFloors]);

  const resetScan = useCallback(() => {
    setPoints([]);
    setZones([]);
    setScannedFloors([]);
    setRobot({ x: 400, y: 300, isScanning: false, battery: 85 });
  }, []);

  // Simulate robot movement when scanning
  React.useEffect(() => {
    if (!robot.isScanning) return;
    const interval = setInterval(() => {
      setRobot(prev => {
        // Random walk simulation
        const dx = (Math.random() - 0.5) * 10;
        const dy = (Math.random() - 0.5) * 10;
        return {
          ...prev,
          x: Math.max(50, Math.min(750, prev.x + dx)),
          y: Math.max(50, Math.min(550, prev.y + dy))
        };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [robot.isScanning]);

  return (
    <AppContext.Provider value={{
      currentMapName: mapName,
      currentFloor: floor,
      points,
      zones,
      scannedFloors,
      robot,
      setMapName,
      setFloor,
      addPoint,
      addZone,
      setScanning: (isScanning) => setRobot(prev => ({ ...prev, isScanning })),
      moveRobot: (x, y) => setRobot(prev => ({ ...prev, x, y })),
      finishFloorScan,
      resetScan
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};