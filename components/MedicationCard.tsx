import React from 'react';
import { Medication, AdviceType } from '../types';
import { Check, Clock, Utensils, AlertTriangle, Pill, Info } from 'lucide-react';

interface MedicationCardProps {
  medication: Medication;
  onToggle: (id: string) => void;
}

const getAdviceColor = (type?: AdviceType) => {
  switch (type) {
    case AdviceType.BEFORE_MEAL: return 'text-orange-600 bg-orange-100';
    case AdviceType.AFTER_MEAL: return 'text-green-600 bg-green-100';
    case AdviceType.WITH_MEAL: return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onToggle }) => {
  const { name, dosage, time, takenToday, aiAnalysis } = medication;

  return (
    <div className={`relative group overflow-hidden rounded-2xl border transition-all duration-300 ${takenToday ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}>
      
      {/* Taken Overlay Stripe */}
      {takenToday && (
         <div className="absolute inset-y-0 left-0 w-1 bg-green-500"></div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
             <div className={`p-2.5 rounded-xl ${takenToday ? 'bg-green-100' : 'bg-blue-50 text-blue-600'}`}>
                {takenToday ? <Check size={24} className="text-green-600" /> : <Pill size={24} />}
             </div>
             <div>
                <h3 className={`font-bold text-lg ${takenToday ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{name}</h3>
                <p className="text-sm text-gray-500">{dosage} • {medication.frequency}</p>
             </div>
          </div>
          
          <button 
             onClick={() => onToggle(medication.id)}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${takenToday ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-lg'}`}
          >
             {takenToday ? 'Undo' : 'Take'}
          </button>
        </div>

        {/* AI Insights Section */}
        {aiAnalysis && !takenToday && (
           <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                 <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    <Clock size={12} /> {time}
                 </span>
                 <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getAdviceColor(aiAnalysis.adviceType)}`}>
                    <Utensils size={12} /> {aiAnalysis.adviceType}
                 </span>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 flex gap-3 items-start border border-slate-100">
                  <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p>{aiAnalysis.instructions}</p>
              </div>

              {aiAnalysis.activitiesToAvoid.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-amber-600 font-medium">
                   <AlertTriangle size={12} />
                   <span>Avoid: {aiAnalysis.activitiesToAvoid.slice(0, 2).join(", ")}</span>
                </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
};