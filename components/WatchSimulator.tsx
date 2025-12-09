import React, { useState, useEffect, useRef } from 'react';
import { Medication, EmergencySettings } from '../types';
import { Check, Clock, AlertTriangle, HeartPulse, Zap } from 'lucide-react';

interface WatchSimulatorProps {
  medications: Medication[];
  onToggleTaken: (id: string) => void;
  syncStatus: 'synced' | 'syncing' | 'offline';
  emergencySettings: EmergencySettings;
  onEmergencyTrigger: (source: 'manual' | 'vitals', value?: number) => void;
}

export const WatchSimulator: React.FC<WatchSimulatorProps> = ({ 
  medications, 
  onToggleTaken, 
  syncStatus,
  emergencySettings,
  onEmergencyTrigger
}) => {
  const nextMed = medications.find(m => !m.takenToday);
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  
  // Vitals State
  const [heartRate, setHeartRate] = useState(72);
  const [isSimulatingHighHR, setIsSimulatingHighHR] = useState(false);
  
  // Ref to track if we've already triggered for the current high event to prevent loop
  const hasTriggeredRef = useRef(false);

  // Time update
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Heart Rate Simulation
  useEffect(() => {
    const hrTimer = setInterval(() => {
      setHeartRate(prev => {
        let change = Math.floor(Math.random() * 5) - 2; // -2 to +2 variation normally
        
        if (isSimulatingHighHR) {
           // Quickly ramp up
           return Math.min(prev + 5, 180); 
        } else {
           // Return to normal 70-80 range
           if (prev > 80) return prev - 2;
           if (prev < 60) return prev + 2;
           return Math.max(60, Math.min(100, prev + change));
        }
      });
    }, 1000);

    return () => clearInterval(hrTimer);
  }, [isSimulatingHighHR]);

  // Check for emergency condition
  useEffect(() => {
    if (
      emergencySettings.enabled && 
      emergencySettings.autoDispatch && 
      heartRate > emergencySettings.heartRateThreshold
    ) {
      if (!hasTriggeredRef.current) {
        onEmergencyTrigger('vitals', heartRate);
        hasTriggeredRef.current = true;
      }
    } else {
      if (heartRate < emergencySettings.heartRateThreshold) {
        hasTriggeredRef.current = false;
      }
    }
  }, [heartRate, emergencySettings, onEmergencyTrigger]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[300px] bg-gray-900 rounded-full border-8 border-gray-800 shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Watch Bezel/Glass Reflection effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-20"></div>
        
        {/* Screen Content */}
        <div className={`w-full h-full bg-black text-white p-6 flex flex-col items-center justify-between z-10 font-mono transition-colors duration-500 ${heartRate > 120 ? 'shadow-[inset_0_0_50px_rgba(220,38,38,0.5)]' : ''}`}>
          
          {/* Top Status Bar */}
          <div className="w-full flex justify-between items-center text-[10px] text-gray-400 mt-2 px-2">
            <div className="flex items-center gap-1">
               <div className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-green-500' : syncStatus === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
               <span className="uppercase">Medtracker</span>
            </div>
            {emergencySettings.enabled && (
               <div className={`flex items-center gap-1 ${heartRate > 100 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
                  <HeartPulse size={10} />
                  <span>{heartRate}</span>
               </div>
            )}
          </div>

          {/* Main Content */}
          {nextMed ? (
            <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-xs text-blue-400 uppercase tracking-widest mb-1">Up Next</span>
              <h3 className="text-xl font-bold text-white leading-tight mb-1">{nextMed.name}</h3>
              <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                <Clock size={14} />
                <span>{nextMed.time}</span>
              </div>
              
              {nextMed.aiAnalysis?.adviceType === 'With Meal' && (
                <div className="text-[10px] text-orange-300 bg-orange-900/30 px-2 py-0.5 rounded-full mb-2">
                  Eat Food
                </div>
              )}

              <button 
                onClick={() => onToggleTaken(nextMed.id)}
                className="bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all rounded-full w-12 h-12 flex items-center justify-center shadow-lg shadow-blue-900/50"
              >
                <Check size={24} className="text-white" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mb-2">
                  <Check size={24} className="text-green-500" />
              </div>
              <p className="text-sm text-gray-300">All Done!</p>
            </div>
          )}

          {/* SOS Button (if enabled) */}
          {emergencySettings.enabled && (
             <button 
               onClick={() => onEmergencyTrigger('manual')}
               className="absolute bottom-16 right-4 w-10 h-10 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors border border-red-900/50"
               title="Emergency SOS"
             >
                <AlertTriangle size={18} />
             </button>
          )}

          {/* Bottom Time */}
          <div className="text-lg font-medium text-gray-300 mb-6">
            {timeStr}
          </div>
        </div>

        {/* Physical Button Simulation */}
        <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-3 h-12 bg-gray-700 rounded-r-md border-l border-gray-900 shadow-sm cursor-pointer hover:bg-gray-600 active:bg-gray-800" title="Home Button"></div>
      </div>

      {/* Simulator Controls */}
      <div className="mt-6 flex gap-3">
         {emergencySettings.enabled && emergencySettings.autoDispatch && (
           <button 
             onMouseDown={() => setIsSimulatingHighHR(true)}
             onMouseUp={() => setIsSimulatingHighHR(false)}
             onMouseLeave={() => setIsSimulatingHighHR(false)}
             className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2 ${isSimulatingHighHR ? 'bg-red-100 text-red-600 border-red-200 scale-95' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}
           >
             <Zap size={14} className={isSimulatingHighHR ? 'fill-red-600' : ''} />
             {isSimulatingHighHR ? 'Spiking HR...' : 'Hold to Spike HR'}
           </button>
         )}
      </div>
    </div>
  );
};