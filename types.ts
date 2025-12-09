
export enum AdviceType {
  BEFORE_MEAL = 'Before Meal',
  AFTER_MEAL = 'After Meal',
  WITH_MEAL = 'With Meal',
  NO_RESTRICTION = 'No Restriction',
}

export interface MedicationAIAnalysis {
  adviceType: AdviceType;
  instructions: string;
  activitiesToAvoid: string[];
  sideEffects: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "Daily", "Twice Daily"
  time: string; // HH:mm
  aiAnalysis?: MedicationAIAnalysis;
  takenToday: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string; // e.g., "Spouse", "Parent", "Friend"
  phone: string;
}

export interface EmergencySettings {
  enabled: boolean;
  doctorName: string;
  doctorContact: string;
  hospitalName: string;
  hospitalContact: string;
  contacts: EmergencyContact[]; // Family and friends
  autoDispatch: boolean; // Trigger on bad vitals
  heartRateThreshold: number; // BPM to trigger auto-dispatch
}

export interface UserSettings {
  userName: string;
  age: number; // Age affects medication metabolism and risks
  appMode: 'patient' | 'hospital'; // Toggle between Personal and Hospital view
  syncEnabled: boolean;
  notificationsEnabled: boolean;
  reminderLeadTimeMinutes: number;
  emergency: EmergencySettings;
}

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Guest',
  age: 30,
  appMode: 'patient',
  syncEnabled: true,
  notificationsEnabled: true,
  reminderLeadTimeMinutes: 15,
  emergency: {
    enabled: false,
    doctorName: '',
    doctorContact: '',
    hospitalName: '',
    hospitalContact: '',
    contacts: [],
    autoDispatch: false,
    heartRateThreshold: 120,
  }
};
