import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import SignalControl from './components/SignalControl';
import Roads from './components/Roads';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-[#050914]">
        <Sidebar className="w-64 flex-shrink-0 z-20" />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/signals" element={<SignalControl />} />
              <Route path="/roads" element={<Roads />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
