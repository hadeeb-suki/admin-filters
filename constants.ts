
import { Doctor, Department } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Cardiology' },
  { id: 'dept-2', name: 'Neurology' },
  { id: 'dept-3', name: 'Pediatrics' },
  { id: 'dept-4', name: 'Oncology' },
  { id: 'dept-5', name: 'Orthopedics' },
  { id: 'dept-6', name: 'Emergency' },
];

export const DOCTORS: Doctor[] = [
  // Cardiology
  { id: 'dr-1', name: 'Dr. Sarah Chen', department: 'Cardiology', noteCount: 142 },
  { id: 'dr-2', name: 'Dr. James Wilson', department: 'Cardiology', noteCount: 98 },
  { id: 'dr-3', name: 'Dr. Elena Rodriguez', department: 'Cardiology', noteCount: 115 },
  // Neurology
  { id: 'dr-4', name: 'Dr. Michael Chang', department: 'Neurology', noteCount: 88 },
  { id: 'dr-5', name: 'Dr. Aisha Patel', department: 'Neurology', noteCount: 121 },
  { id: 'dr-6', name: 'Dr. Robert Miller', department: 'Neurology', noteCount: 76 },
  // Pediatrics
  { id: 'dr-7', name: 'Dr. Emily Blunt', department: 'Pediatrics', noteCount: 210 },
  { id: 'dr-8', name: 'Dr. David Okafor', department: 'Pediatrics', noteCount: 185 },
  { id: 'dr-9', name: 'Dr. Lisa Vanderpump', department: 'Pediatrics', noteCount: 164 },
  // Oncology
  { id: 'dr-10', name: 'Dr. Thomas Shelby', department: 'Oncology', noteCount: 132 },
  { id: 'dr-11', name: 'Dr. Grace Burgess', department: 'Oncology', noteCount: 95 },
  // Orthopedics
  { id: 'dr-12', name: 'Dr. Arthur Shelby', department: 'Orthopedics', noteCount: 78 },
  { id: 'dr-13', name: 'Dr. Polly Gray', department: 'Orthopedics', noteCount: 104 },
  // Emergency
  { id: 'dr-14', name: 'Dr. John Watson', department: 'Emergency', noteCount: 256 },
  { id: 'dr-15', name: 'Dr. Sherlock Holmes', department: 'Emergency', noteCount: 289 },
];
