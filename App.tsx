
import React, { useState, useEffect } from 'react';
import { Plus, Smartphone, Watch, Activity, Settings, RefreshCw, Building2, Siren, HelpCircle } from 'lucide-react';
import { Medication, UserSettings, DEFAULT_SETTINGS } from './types';
import { MedicationCard } from './components/MedicationCard';
import { AddMedicationModal } from './components/AddMedicationModal';
import { WatchSimulator } from './components/WatchSimulator';
import { SettingsScreen } from './components/SettingsScreen';
import { EmergencyOverlay } from './components/EmergencyOverlay';
import { HospitalDashboard } from './components/HospitalDashboard';
import { TutorialModal } from './components/TutorialModal';

const App = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [showWatchView, setShowWatchView] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');
  
  // Emergency State
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyTrigger, setEmergencyTrigger] = useState<'manual' | 'vitals'>('manual');
  const [lastVitals, setLastVitals] = useState<number | undefined>(undefined);

  // Load data from local storage on mount
  useEffect(() => {
    const savedMeds = localStorage.getItem('medtracker_data');
    if (savedMeds) {
      setMedications(JSON.parse(savedMeds));
    }

    const savedSettings = localStorage.getItem('medtracker_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save meds and simulate sync
  useEffect(() => {
    localStorage.setItem('medtracker_data', JSON.stringify(medications));
    
    // Simulate Syncing only if enabled
    if (settings.syncEnabled) {
      setSyncStatus('syncing');
      const timeout = setTimeout(() => {
        setSyncStatus('synced');
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      setSyncStatus('offline');
    }
  }, [medications, settings.syncEnabled]);

  // Save settings
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('medtracker_settings', JSON.stringify(newSettings));
    setView('dashboard');
  };

  const handleClearData = () => {
    setMedications([]);
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('medtracker_data');
    localStorage.removeItem('medtracker_settings');
    setView('dashboard');
  };

  const addMedication = (med: Medication) => {
    setMedications(prev => [...prev, med].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const toggleMedicationTaken = (id: string) => {
    setMedications(prev => prev.map(m => 
      m.id === id ? { ...m, takenToday: !m.takenToday } : m
    ));
  };

  const handleEmergencyTrigger = (source: 'manual' | 'vitals', value?: number) => {
    setEmergencyTrigger(source);
    setLastVitals(value);
    setIsEmergencyActive(true);
    // In a real app, this would also initiate backend calls
  };

  const pendingCount = medications.filter(m => !m.takenToday).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 md:pb-0 font-sans">
      
      {/* Emergency Overlay - Only active in Patient Mode */}
      {settings.appMode === 'patient' && (
        <EmergencyOverlay 
          isOpen={isEmergencyActive}
          onClose={() => setIsEmergencyActive(false)}
          settings={settings}
          triggerSource={emergencyTrigger}
          currentHeartRate={lastVitals}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className={`p-2 rounded-lg ${settings.appMode === 'hospital' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
               {settings.appMode === 'hospital' ? (
                 <Building2 className="text-white w-6 h-6" />
               ) : (
                 <Activity className="text-white w-6 h-6" />
               )}
            </div>
            <h1 className={`text-xl font-bold bg-clip-text text-transparent ${settings.appMode === 'hospital' ? 'bg-gradient-to-r from-indigo-700 to-purple-500' : 'bg-gradient-to-r from-blue-700 to-cyan-500'}`}>
              {settings.appMode === 'hospital' ? 'Medtracker Pro' : 'Medtracker'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Desktop Watch Toggle - Only in Patient Mode */}
             {view === 'dashboard' && settings.appMode === 'patient' && (
               <button 
                  onClick={() => setShowWatchView(!showWatchView)}
                  className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${showWatchView ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
               >
                  <Watch size={16} />
                  {showWatchView ? 'Hide Watch' : 'Show Watch'}
               </button>
             )}

             <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
               <RefreshCw size={12} className={`${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
               {syncStatus === 'synced' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Offline'}
             </div>

             <button
               onClick={() => setIsTutorialOpen(true)}
               className="p-2 rounded-full transition-colors hover:bg-gray-100 text-gray-600"
               title="Tutorial"
             >
               <HelpCircle size={20} />
             </button>

             <button 
               onClick={() => setView(view === 'settings' ? 'dashboard' : 'settings')}
               className={`p-2 rounded-full transition-colors ${view === 'settings' ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`}
               title="Settings"
             >
               <Settings size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'settings' ? (
          <SettingsScreen 
            settings={settings} 
            onSave={handleSaveSettings}
            onBack={() => setView('dashboard')}
            onClearData={handleClearData}
          />
        ) : settings.appMode === 'hospital' ? (
          <HospitalDashboard />
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left Column: Medication Dashboard */}
            <div className={`flex-1 transition-all duration-500 ${showWatchView ? 'md:w-2/3' : 'w-full'}`}>
              
              {/* Greeting / Stats */}
              <div className="mb-8">
                 <h2 className="text-2xl font-bold text-gray-800">
                    Hello, {settings.userName} <span className="inline-block animate-pulse">👋</span>
                 </h2>
                 <p className="text-gray-500 mt-1">
                   You have <span className="font-semibold text-blue-600">{pendingCount}</span> medications left to take today.
                 </p>
                 {settings.age > 0 && (
                   <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                     AI Advice calibrated for age {settings.age}
                   </span>
                 )}
              </div>

              {/* Timeline / List */}
              <div className="space-y-4">
                 {medications.length === 0 ? (
                   <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                      <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                         <Smartphone className="text-blue-400 w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No medications yet</h3>
                      <p className="text-gray-500 max-w-sm mx-auto mt-2">Add your first prescription to let our AI analyze it and set up your schedule.</p>
                   </div>
                 ) : (
                   medications.map((med) => (
                     <MedicationCard 
                        key={med.id} 
                        medication={med} 
                        onToggle={toggleMedicationTaken} 
                     />
                   ))
                 )}
              </div>
            </div>

            {/* Right Column: Watch Simulator */}
            {showWatchView && (
               <div className="md:w-1/3 flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="sticky top-24 w-full flex flex-col items-center">
                     <div className="mb-4 text-center">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
                           <Watch className="text-gray-900" size={20} />
                           WearOS Companion
                        </h3>
                        <p className="text-xs text-gray-500">Real-time sync & vitals</p>
                     </div>
                     
                     <WatchSimulator 
                        medications={medications} 
                        onToggleTaken={toggleMedicationTaken}
                        syncStatus={syncStatus}
                        emergencySettings={settings.emergency}
                        onEmergencyTrigger={handleEmergencyTrigger}
                     />

                     <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-[300px]">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Sync Features</h4>
                        <ul className="text-xs text-gray-500 space-y-2">
                           <li className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'offline' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                              {syncStatus === 'offline' ? 'Sync Paused' : 'Bi-directional status updates'}
                           </li>
                           <li className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${settings.emergency.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              {settings.emergency.enabled ? (settings.emergency.autoDispatch ? 'Auto-Dispatch Active' : 'Manual SOS Active') : 'Emergency Mode Off'}
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            )}
          </div>
        )}
      </main>

      {/* SOS Floating Action Button - Only if enabled and on patient dashboard */}
      {view === 'dashboard' && settings.appMode === 'patient' && settings.emergency.enabled && (
        <button 
          onClick={() => handleEmergencyTrigger('manual')}
          className="fixed bottom-6 left-6 md:bottom-8 md:left-8 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl shadow-red-900/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-50 border-4 border-red-500 animate-in slide-in-from-bottom-10 fade-in duration-500"
          title="TRIGGER SOS"
        >
           <Siren size={32} className="text-white animate-pulse" />
        </button>
      )}

      {/* Add Medication Floating Action Button (Mobile) - Only on patient dashboard */}
      {view === 'dashboard' && settings.appMode === 'patient' && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40"
        >
           <Plus size={28} />
        </button>
      )}

      {/* Add Med Modal */}
      <AddMedicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addMedication} 
        userAge={settings.age}
      />

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

    </div>
  );
};

export default App;
