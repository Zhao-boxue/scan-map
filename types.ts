export enum ZoneType {
  CARPET = 'Carpet',
  MARBLE = 'Marble',
  NONE = 'None'
}

export interface MapPoint {
  id: string;
  x: number;
  y: number;
  name: string;
  floor: string;
}

export interface MapZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: ZoneType;
  floor: string;
}

export interface RobotState {
  x: number;
  y: number;
  isScanning: boolean;
  battery: number;
}

export interface AppState {
  currentMapName: string;
  currentFloor: string;
  points: MapPoint[];
  zones: MapZone[];
  scannedFloors: string[];
}
