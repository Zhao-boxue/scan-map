import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { HomeScreen } from './screens/Home';
import { ModeSelectScreen } from './screens/ModeSelect';
import { ScanMapScreen } from './screens/ScanMap';
import { PointMarkingScreen } from './screens/PointMarking';
import { ZoneSelectScreen } from './screens/ZoneSelect';
import { FinalReportScreen } from './screens/FinalReport';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="w-full h-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/mode" element={<ModeSelectScreen />} />
                <Route path="/scan" element={<ScanMapScreen />} />
                <Route path="/marking" element={<PointMarkingScreen />} />
                <Route path="/zones" element={<ZoneSelectScreen />} />
                <Route path="/report" element={<FinalReportScreen />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;