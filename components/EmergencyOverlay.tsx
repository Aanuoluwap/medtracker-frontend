
import React, { useEffect, useState } from 'react';
import { Phone, MapPin, XCircle, HeartPulse, Siren, Users, Loader2 } from 'lucide-react';
import { UserSettings } from '../types';

interface EmergencyOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  triggerSource: 'manual' | 'vitals';
  currentHeartRate?: number;
}

export const EmergencyOverlay: React.FC<EmergencyOverlayProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  triggerSource,
  currentHeartRate 
}) => {
  const [status, setStatus] = useState<'analyzing' | 'locating' | 'contacting'>('analyzing');
  const [countdown, setCountdown] = useState(5);
  const [isDispatched, setIsDispatched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      setStatus('analyzing');
      setIsDispatched(false);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsDispatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const statusTimer1 = setTimeout(() => setStatus('locating'), 1500);
      const statusTimer2 = setTimeout(() => setStatus('contacting'), 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(statusTimer1);
        clearTimeout(statusTimer2);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-red-600/95 backdrop-blur-xl flex flex-col items-center justify-center text-white animate-in fade-in duration-300 p-4">
      
      <div className="w-full max-w-lg text-center flex flex-col items-center h-full justify-center">
        
        {!isDispatched ? (
          <>
             <div className="mb-8 relative">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white text-red-600 p-8 rounded-full shadow-2xl">
                   <span className="text-6xl font-black font-mono">{countdown}</span>
                </div>
             </div>
             
             <h1 className="text-3xl font-bold mb-2">EMERGENCY DETECTED</h1>
             <p className="text-red-100 mb-8 max-w-xs mx-auto">
               Preparing to call doctor, hospital, and emergency contacts in {countdown} seconds.
             </p>

             <button 
                onClick={onClose}
                className="w-full max-w-sm bg-white text-red-600 hover:bg-gray-100 active:scale-95 transition-all py-6 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 group"
             >
                <XCircle size={32} className="group-hover:scale-110 transition-transform" />
                Cancel Alert
             </button>
             
             <p className="mt-6 text-sm text-white/70 font-medium">Tap to abort immediately</p>
          </>
        ) : (
          <>
            <div className="animate-pulse mb-6 flex justify-center">
               <div className="bg-white text-red-600 p-6 rounded-full shadow-2xl shadow-red-900/50">
                 <Siren size={64} />
               </div>
            </div>

            <h1 className="text-4xl font-black uppercase tracking-wider mb-2">DISPATCHED</h1>
            
            {triggerSource === 'vitals' && (
              <p className="text-red-100 text-lg mb-6 font-medium bg-red-800/50 py-2 px-4 rounded-lg inline-block">
                 Critical Vitals Detected: {currentHeartRate} BPM
              </p>
            )}

            {triggerSource === 'manual' && (
              <p className="text-red-100 text-lg mb-6 font-medium">
                 Manual SOS Activated
              </p>
            )}

            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 mb-8 space-y-4 text-left w-full">
              
              {/* Step 1: Locating / Hospital */}
              <div className={`flex items-center gap-4 transition-all duration-500 ${status === 'analyzing' ? 'opacity-50' : 'opacity-100'}`}>
                 <div className="bg-white/20 p-2 rounded-lg">
                    <MapPin size={24} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-lg">
                       {settings.emergency.hospitalName ? 'Preferred Hospital' : 'Nearest Hospital'}
                    </h3>
                    {status !== 'analyzing' && (
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-sm text-green-300 truncate">
                          {settings.emergency.hospitalName 
                            ? settings.emergency.hospitalName
                            : "St. Mary's General Hospital (0.8 mi)"
                          }
                        </p>
                        <a 
                           href={`tel:${settings.emergency.hospitalContact || '911'}`}
                           className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors flex-shrink-0 font-bold no-underline"
                        >
                           <Phone size={12} /> {settings.emergency.hospitalContact ? 'Call' : '911'}
                        </a>
                      </div>
                    )}
                 </div>
              </div>

              {/* Step 2: Contacting Doctor */}
              <div className={`flex items-center gap-4 transition-all duration-500 ${status !== 'contacting' ? 'opacity-50' : 'opacity-100'}`}>
                 <div className="bg-white/20 p-2 rounded-lg">
                    <Phone size={24} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-lg">Doctor</h3>
                    {settings.emergency.doctorName ? (
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-sm text-red-100 truncate">
                          Dr. {settings.emergency.doctorName}
                        </p>
                        {settings.emergency.doctorContact && (
                           <a 
                              href={`tel:${settings.emergency.doctorContact}`}
                              className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors flex-shrink-0 font-bold no-underline"
                           >
                              <Phone size={12} /> Call
                           </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-100 italic">No primary doctor configured</p>
                    )}
                 </div>
              </div>

               {/* Step 3: Contacting Family (Only if contacts exist) */}
               {settings.emergency.contacts.length > 0 && (
                 <div className={`flex items-center gap-4 transition-all duration-500 ${status !== 'contacting' ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="bg-white/20 p-2 rounded-lg">
                       <Users size={24} />
                    </div>
                    <div className="flex-1">
                       <h3 className="font-bold text-lg">Emergency Contacts</h3>
                       <div className="mt-1 space-y-2">
                          {settings.emergency.contacts.map((c) => (
                             <div key={c.id} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                                <span className="text-sm text-red-100 truncate w-24">{c.name}</span>
                                <a 
                                   href={`tel:${c.phone}`}
                                   className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-colors flex-shrink-0 font-bold no-underline"
                                >
                                   <Phone size={10} /> Call
                                </a>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
               )}

              {/* Data Sent */}
              <div className="mt-4 pt-4 border-t border-white/10">
                 <div className="flex items-center gap-2 text-sm text-red-100">
                    <HeartPulse size={16} />
                    <span>Transmitting Vitals & Medical History...</span>
                 </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-bold flex items-center justify-center gap-3 mx-auto transition-transform active:scale-95 shadow-xl border border-gray-700 w-full max-w-xs"
            >
              <XCircle size={24} />
              I AM SAFE - CLOSE
            </button>
            <p className="mt-4 text-xs opacity-60">Tap to deactivate emergency mode</p>
          </>
        )}
      </div>
    </div>
  );
};
