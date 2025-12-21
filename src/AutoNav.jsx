import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Navigation, Eye } from 'lucide-react';

const AutoNav = () => {
  const [scanning, setScanning] = useState(true);
  
  // Simulated Detected Objects
  const [objects, setObjects] = useState([
    { id: 1, type: 'CAR', x: 20, y: 40, w: 15, h: 20, dist: 45, color: '#3b82f6' }, // Blue
    { id: 2, type: 'PEDESTRIAN', x: 65, y: 45, w: 5, h: 12, dist: 12, color: '#ef4444' }, // Red (Danger)
    { id: 3, type: 'SIGN', x: 80, y: 30, w: 8, h: 8, dist: 30, color: '#eab308' }, // Yellow
  ]);

  // Simulation Loop to make numbers fluctuate slightly (Live System feel)
  useEffect(() => {
    const interval = setInterval(() => {
      setObjects(prev => prev.map(obj => ({
        ...obj,
        dist: Math.max(0, obj.dist + (Math.random() - 0.5)), // Distance fluctuates
        x: Math.min(90, Math.max(10, obj.x + (Math.random() - 0.5) * 0.2)) // Slight drift
      })));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full bg-gray-900 text-cyan-400 font-mono relative overflow-hidden flex flex-col">
      
      {/* HUD HEADER */}
      <div className="bg-black/80 p-4 flex justify-between items-center border-b border-cyan-500/30 z-10">
        <div className="flex items-center gap-3">
          <Eye className="animate-pulse" />
          <h2 className="text-xl font-bold tracking-widest">AUTONAV VISION v4.2</h2>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-xs">SYSTEM STATUS</span>
            <span className="text-green-400 font-bold">ONLINE</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-gray-500 text-xs">LATENCY</span>
             <span>14ms</span>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 relative bg-gray-800">
        
        {/* Background Image (Road) */}
        <div className="absolute inset-0">
            <img 
              src="/pictures/road.jpg" 
              alt="Road View" 
              className="w-full h-full object-cover opacity-60"
              onError={(e) => {
                e.target.style.display = 'none'; // Hide if missing
                e.target.parentElement.style.background = 'linear-gradient(to bottom, #111, #333)';
              }} 
            />
            {/* Fallback Grid if no image */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] perspective-grid"></div>
        </div>

        {/* OVERLAY: BOUNDING BOXES */}
        {objects.map(obj => (
          <div 
            key={obj.id}
            className="absolute border-2 transition-all duration-100 ease-linear flex flex-col"
            style={{
              left: `${obj.x}%`, 
              top: `${obj.y}%`, 
              width: `${obj.w}%`, 
              height: `${obj.h}%`,
              borderColor: obj.color,
              boxShadow: `0 0 10px ${obj.color}`
            }}
          >
            {/* Label Tag */}
            <div 
              className="absolute -top-6 left-0 text-xs font-bold px-1 py-0.5 text-black"
              style={{ backgroundColor: obj.color }}
            >
              {obj.type} [{obj.dist.toFixed(1)}m]
            </div>
          </div>
        ))}

        {/* CENTER LANE MARKERS (Decoration) */}
        <div className="absolute bottom-0 left-1/2 w-48 h-32 border-l border-r border-cyan-500/20 transform -translate-x-1/2 perspective-3d"></div>

      </div>

      {/* FOOTER DASHBOARD */}
      <div className="bg-black/90 p-6 grid grid-cols-3 gap-4 border-t border-cyan-500/30 z-10">
        
        {/* Metric 1 */}
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Navigation size={14} /> SPEED
          </div>
          <div className="text-2xl font-bold text-white">45 <span className="text-sm text-gray-500">MPH</span></div>
        </div>

        {/* Metric 2 */}
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
           <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Activity size={14} /> CONFIDENCE
          </div>
          <div className="text-2xl font-bold text-white">98.4<span className="text-sm text-gray-500">%</span></div>
        </div>

        {/* Metric 3 (Alert) */}
        <div className={`p-3 rounded border ${objects[1].dist < 15 ? 'bg-red-900/30 border-red-500 animate-pulse' : 'bg-gray-900/50 border-gray-700'}`}>
           <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <ShieldAlert size={14} className={objects[1].dist < 15 ? 'text-red-500' : ''} /> THREAT LEVEL
          </div>
          <div className={`text-2xl font-bold ${objects[1].dist < 15 ? 'text-red-500' : 'text-green-500'}`}>
            {objects[1].dist < 15 ? 'HIGH' : 'LOW'}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AutoNav;