
import React, { useState } from 'react';
import { UserSettings, EmergencyContact } from '../types';
import { Save, ArrowLeft, User, Bell, Watch, Trash2, Siren, HeartPulse, Stethoscope, Building2, BriefcaseMedical, Users, Plus, X } from 'lucide-react';

interface SettingsScreenProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onBack: () => void;
  onClearData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onSave, onBack, onClearData }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  
  // Temporary state for adding a new contact
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const handleChange = (key: keyof UserSettings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleEmergencyChange = (key: keyof UserSettings['emergency'], value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      emergency: {
        ...prev.emergency,
        [key]: value
      }
    }));
  };

  const addContact = () => {
    if (newContactName && newContactPhone) {
      const newContact: EmergencyContact = {
        id: crypto.randomUUID(),
        name: newContactName,
        relation: newContactRelation || 'Friend',
        phone: newContactPhone
      };
      
      setFormData(prev => ({
        ...prev,
        emergency: {
          ...prev.emergency,
          contacts: [...prev.emergency.contacts, newContact]
        }
      }));

      setNewContactName('');
      setNewContactRelation('');
      setNewContactPhone('');
    }
  };

  const removeContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      emergency: {
        ...prev.emergency,
        contacts: prev.emergency.contacts.filter(c => c.id !== id)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300 pb-12">
      <div className="mb-6 flex items-center gap-4">
        <button 
          type="button"
          onClick={onBack} 
          className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <User size={24} />
            <h3 className="font-semibold text-lg text-gray-900">Profile</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => handleChange('userName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                min="0"
                max="120"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="30"
              />
              <p className="text-xs text-gray-500 mt-1">Used for age-specific AI medical advice.</p>
            </div>
          </div>
        </div>

        {/* Application Mode */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
           <div className="flex items-center gap-3 mb-4 text-blue-600">
              <BriefcaseMedical size={24} />
              <h3 className="font-semibold text-lg text-gray-900">App Mode</h3>
           </div>
           
           <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
              <button
                 type="button"
                 onClick={() => handleChange('appMode', 'patient')}
                 className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${formData.appMode === 'patient' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 <User size={16} />
                 Personal / Patient
              </button>
              <button
                 type="button"
                 onClick={() => handleChange('appMode', 'hospital')}
                 className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${formData.appMode === 'hospital' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 <Building2 size={16} />
                 Hospital / Doctor
              </button>
           </div>
           <p className="text-xs text-gray-500 mt-3 px-1">
              Switching to <strong>Hospital Mode</strong> enables the patient tracking dashboard.
           </p>
        </div>

        {/* Emergency Mode Section (Top Priority) */}
        <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Siren size={100} className="text-red-500" />
          </div>
          
          <div className="flex items-center gap-3 mb-6 text-red-600 relative z-10">
            <div className="p-2 bg-red-100 rounded-lg">
               <Siren size={24} />
            </div>
            <h3 className="font-bold text-lg text-red-800">Emergency & Safety</h3>
          </div>

          <div className="space-y-5 relative z-10">
             <div className="flex items-center justify-between bg-white/60 p-4 rounded-xl backdrop-blur-sm">
                <div>
                   <label className="font-bold text-gray-900 block">Enable Emergency Mode</label>
                   <p className="text-sm text-gray-500 max-w-[250px]">Allow SOS gestures and auto-alerts to emergency services.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.emergency.enabled}
                    onChange={(e) => handleEmergencyChange('enabled', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
             </div>

             {formData.emergency.enabled && (
               <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                  
                  {/* Doctor Info */}
                  <div className="bg-white/40 p-4 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2 mb-3 text-red-700 font-medium">
                      <Stethoscope size={18} />
                      <h4>Primary Doctor</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Doctor's Name</label>
                        <input
                          type="text"
                          value={formData.emergency.doctorName}
                          onChange={(e) => handleEmergencyChange('doctorName', e.target.value)}
                          className="w-full px-4 py-2 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white"
                          placeholder="Dr. Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Contact Number</label>
                        <input
                          type="tel"
                          value={formData.emergency.doctorContact}
                          onChange={(e) => handleEmergencyChange('doctorContact', e.target.value)}
                          className="w-full px-4 py-2 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white"
                          placeholder="555-0123"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hospital Info */}
                  <div className="bg-white/40 p-4 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2 mb-3 text-red-700 font-medium">
                      <Building2 size={18} />
                      <h4>Preferred Hospital</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Hospital Name</label>
                        <input
                          type="text"
                          value={formData.emergency.hospitalName}
                          onChange={(e) => handleEmergencyChange('hospitalName', e.target.value)}
                          className="w-full px-4 py-2 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white"
                          placeholder="City General Hospital"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Emergency Line</label>
                        <input
                          type="tel"
                          value={formData.emergency.hospitalContact}
                          onChange={(e) => handleEmergencyChange('hospitalContact', e.target.value)}
                          className="w-full px-4 py-2 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white"
                          placeholder="911 or Direct Line"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="bg-white/40 p-4 rounded-xl border border-red-100">
                     <div className="flex items-center gap-2 mb-3 text-red-700 font-medium">
                        <Users size={18} />
                        <h4>Emergency Contacts (Family & Friends)</h4>
                     </div>
                     
                     {/* List of existing contacts */}
                     <div className="space-y-2 mb-4">
                        {formData.emergency.contacts.length === 0 && (
                           <p className="text-sm text-gray-500 italic">No contacts added yet.</p>
                        )}
                        {formData.emergency.contacts.map((contact) => (
                           <div key={contact.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-100">
                              <div>
                                 <p className="font-medium text-gray-900">{contact.name} <span className="text-xs text-gray-500 font-normal">({contact.relation})</span></p>
                                 <p className="text-xs text-gray-600">{contact.phone}</p>
                              </div>
                              <button 
                                 type="button"
                                 onClick={() => removeContact(contact.id)}
                                 className="text-red-400 hover:text-red-600 p-1"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        ))}
                     </div>

                     {/* Add New Contact Form */}
                     <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                        <p className="text-xs font-medium text-red-600 mb-2">Add New Contact</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                           <input
                              type="text"
                              placeholder="Name"
                              value={newContactName}
                              onChange={(e) => setNewContactName(e.target.value)}
                              className="px-3 py-2 text-sm border border-red-200 rounded-lg outline-none focus:border-red-400"
                           />
                           <input
                              type="text"
                              placeholder="Relation"
                              value={newContactRelation}
                              onChange={(e) => setNewContactRelation(e.target.value)}
                              className="px-3 py-2 text-sm border border-red-200 rounded-lg outline-none focus:border-red-400"
                           />
                           <input
                              type="tel"
                              placeholder="Phone"
                              value={newContactPhone}
                              onChange={(e) => setNewContactPhone(e.target.value)}
                              className="px-3 py-2 text-sm border border-red-200 rounded-lg outline-none focus:border-red-400"
                           />
                        </div>
                        <button
                           type="button"
                           onClick={addContact}
                           disabled={!newContactName || !newContactPhone}
                           className="w-full py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                        >
                           <Plus size={16} /> Add Contact
                        </button>
                     </div>
                  </div>

                  <div className="border-t border-red-200 pt-4">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <HeartPulse size={18} className="text-red-500" />
                           <span className="font-medium text-gray-900">Auto-trigger on Vitals</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={formData.emergency.autoDispatch}
                             onChange={(e) => handleEmergencyChange('autoDispatch', e.target.checked)}
                             className="sr-only peer" 
                           />
                           <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                     </div>
                     
                     {formData.emergency.autoDispatch && (
                        <div>
                           <label className="block text-sm text-gray-600 mb-1">
                             Trigger when Heart Rate exceeds: <span className="font-bold text-red-600">{formData.emergency.heartRateThreshold} BPM</span>
                           </label>
                           <input 
                              type="range" 
                              min="100" 
                              max="200" 
                              step="5"
                              value={formData.emergency.heartRateThreshold}
                              onChange={(e) => handleEmergencyChange('heartRateThreshold', parseInt(e.target.value))}
                              className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                           />
                           <p className="text-xs text-red-500 mt-1">
                             *WearOS will monitor BPM in real-time and alert services if this threshold is sustained.
                           </p>
                        </div>
                     )}
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Bell size={24} />
            <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-900">Enable Notifications</label>
                <p className="text-sm text-gray-500">Receive alerts when it's time to take meds</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.notificationsEnabled}
                  onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {formData.notificationsEnabled && (
              <div className="pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Time</label>
                <select
                  value={formData.reminderLeadTimeMinutes}
                  onChange={(e) => handleChange('reminderLeadTimeMinutes', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                >
                  <option value={0}>At exact time</option>
                  <option value={5}>5 minutes before</option>
                  <option value={10}>10 minutes before</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Sync Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Watch size={24} />
            <h3 className="font-semibold text-lg text-gray-900">Device Sync</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">WearOS Sync</label>
              <p className="text-sm text-gray-500">Sync data with your smartwatch in real-time</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.syncEnabled}
                onChange={(e) => handleChange('syncEnabled', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-700 mb-2">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Permanently delete all medication data and settings</p>
            <button 
              type="button"
              onClick={() => {
                if(window.confirm('Are you sure? This cannot be undone.')) onClearData();
              }}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear Data
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
