import React, { useEffect, useRef, useState } from 'react';
import { RobotState, MapPoint, MapZone, ZoneType } from '../types';
import { ROBOT_COLOR, SAFE_AREA_COLOR } from '../constants';
import { MapPin } from 'lucide-react';

interface MapCanvasProps {
  mode: 'scan' | 'point' | 'zone' | 'view';
  robotState?: RobotState;
  points?: MapPoint[];
  zones?: MapZone[];
  floor: string;
  onPointClick?: (point: MapPoint) => void;
  onZoneSelect?: (x: number, y: number) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({ 
  mode, 
  robotState, 
  points = [], 
  zones = [], 
  floor,
  onZoneSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanOffset, setScanOffset] = useState(0);

  // Animation loop for scanning mode
  useEffect(() => {
    if (mode !== 'scan' || !robotState?.isScanning) return;
    
    let animationFrameId: number;
    const animate = () => {
      setScanOffset(prev => (prev + 1) % 100);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, robotState?.isScanning]);

  // Drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1e293b'; // slate-800 background for map
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Zones (Simulated map walls/areas)
    // We mock some fixed walls based on "floor" hash just to make it look different per floor
    const floorSeed = floor.length; 
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.rect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.stroke();
    
    // Draw Generated Zones (Carpet/Marble)
    zones.forEach(zone => {
      if (zone.floor === floor) {
        ctx.fillStyle = zone.type === ZoneType.CARPET ? 'rgba(245, 158, 11, 0.3)' : 'rgba(14, 165, 233, 0.3)'; // Amber for carpet, Sky for marble
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        ctx.strokeStyle = zone.type === ZoneType.CARPET ? '#f59e0b' : '#0ea5e9';
        ctx.lineWidth = 1;
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
      }
    });

    // Draw Points
    points.forEach(point => {
      if (point.floor === floor) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fill();
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = '10px sans-serif';
        ctx.fillText(point.name, point.x + 8, point.y + 3);
      }
    });

    // Draw Robot & Scanner
    if (robotState) {
      const rx = robotState.x;
      const ry = robotState.y;

      // Scanning Effect
      if (robotState.isScanning) {
        ctx.beginPath();
        ctx.arc(rx, ry, 100 + (scanOffset / 2), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${1 - scanOffset / 100})`; // Fade out emerald
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Lidar rays
        for(let i=0; i<12; i++) {
            const angle = (Date.now() / 1000) + (i * (Math.PI / 6));
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + Math.cos(angle) * 80, ry + Math.sin(angle) * 80);
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
            ctx.stroke();
        }
      }

      // Robot Body
      ctx.fillStyle = ROBOT_COLOR;
      ctx.beginPath();
      ctx.arc(rx, ry, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Direction Indicator
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx, ry - 16);
      ctx.stroke();
    }

  }, [scanOffset, robotState, points, zones, floor, mode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode === 'zone' && onZoneSelect) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onZoneSelect(x, y);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden rounded-lg shadow-inner">
        <canvas 
            ref={canvasRef} 
            width={800} 
            height={600} 
            className="w-full h-full object-cover cursor-crosshair"
            onClick={handleCanvasClick}
        />
        {/* Overlay Info */}
        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
            楼层: {floor}
            {mode === 'scan' && robotState?.isScanning && <span className="ml-2 text-emerald-400 animate-pulse">● 扫描中</span>}
        </div>
    </div>
  );
};