
import React from 'react';
import { User, Activity, AlertCircle, CheckCircle, Clock, HeartPulse } from 'lucide-react';

// Simulated Patient Data
const MOCK_PATIENTS = [
  { id: 1, name: "Alice Jenkins", age: 72, condition: "Hypertension", adherence: 95, lastVitals: { hr: 78, status: 'normal' }, medsTaken: 3, medsTotal: 4 },
  { id: 2, name: "Marcus Thorne", age: 45, condition: "Post-Op Recovery", adherence: 100, lastVitals: { hr: 82, status: 'normal' }, medsTaken: 2, medsTotal: 2 },
  { id: 3, name: "Sarah Lin", age: 29, condition: "Asthma", adherence: 60, lastVitals: { hr: 110, status: 'elevated' }, medsTaken: 1, medsTotal: 3 },
  { id: 4, name: "Robert Fox", age: 61, condition: "Diabetes T2", adherence: 88, lastVitals: { hr: 72, status: 'normal' }, medsTaken: 4, medsTotal: 4 },
];

export const HospitalDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
               <User size={24} />
            </div>
            <div>
               <p className="text-sm text-gray-500 font-medium">Total Patients</p>
               <h3 className="text-2xl font-bold text-gray-900">{MOCK_PATIENTS.length}</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
               <CheckCircle size={24} />
            </div>
            <div>
               <p className="text-sm text-gray-500 font-medium">Avg. Adherence</p>
               <h3 className="text-2xl font-bold text-gray-900">85.7%</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
               <AlertCircle size={24} />
            </div>
            <div>
               <p className="text-sm text-gray-500 font-medium">Critical Alerts</p>
               <h3 className="text-2xl font-bold text-gray-900">1</h3>
            </div>
         </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-lg text-gray-800">Patient Monitoring</h3>
            <span className="text-xs text-gray-500 flex items-center gap-1">
               <Activity size={12} /> Live Sync Active
            </span>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500">
                  <tr>
                     <th className="px-6 py-4 font-medium">Patient Name</th>
                     <th className="px-6 py-4 font-medium">Age</th>
                     <th className="px-6 py-4 font-medium">Condition</th>
                     <th className="px-6 py-4 font-medium">Adherence Today</th>
                     <th className="px-6 py-4 font-medium">Live Vitals</th>
                     <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {MOCK_PATIENTS.map((patient) => (
                     <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-semibold text-gray-900">{patient.name}</div>
                           <div className="text-xs text-gray-400">ID: #00{patient.id}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{patient.age}</td>
                        <td className="px-6 py-4 text-gray-600">{patient.condition}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full ${patient.adherence >= 90 ? 'bg-green-500' : patient.adherence >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                    style={{ width: `${patient.adherence}%` }}
                                 ></div>
                              </div>
                              <span className="text-xs font-medium text-gray-600">{patient.medsTaken}/{patient.medsTotal}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${patient.lastVitals.status === 'elevated' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                              <HeartPulse size={12} />
                              {patient.lastVitals.hr} BPM
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           {patient.lastVitals.status === 'elevated' ? (
                              <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                                 <AlertCircle size={14} /> Attention
                              </span>
                           ) : patient.medsTaken === patient.medsTotal ? (
                              <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                                 <CheckCircle size={14} /> Complete
                              </span>
                           ) : (
                              <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                                 <Clock size={14} /> Tracking
                              </span>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
