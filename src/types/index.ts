/* ------------------------------------------------------------------ */
/*  Learner – based on ALS Form 1 data elements                        */
/* ------------------------------------------------------------------ */
export interface Learner {
  id: string;

  // Administrative
  region: string;
  division: string;
  district: string;
  calendarYear: number;
  mappedBy: string;

  // Personal Information
  lastName: string;
  firstName: string;
  middleName: string;
  nameExtension?: string;
  sex: 'Male' | 'Female';
  civilStatus: string;
  birthdate: string; // ISO date string
  age: number;
  motherTongue: string;
  isIP: boolean;
  ipTribe?: string;
  religion?: string;
  is4PsMember: boolean;
  fourPsOrIp?: string;
  isPwd: boolean;
  pwdType?: string;
  pwdTypeOther?: string;

  // Address
  barangay: string;
  completeAddress: string;

  // Family
  roleInFamily: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  guardianOccupation?: string;

  // Educational Background
  schoolName?: string;
  currentlyStudying: string;
  lastGradeCompleted: string;
  reasonForNotAttending: string;
  reasonForNotAttendingOther?: string;

  // Employment / Socio-economic
  isBlp: boolean;
  occupationType?: string;
  employmentStatus?: string;
  monthlyIncome?: string;
  interestedInALS: string;
  contactNumber?: string;

  // Logistics
  distanceKm: number;
  travelTime: string;
  transportMode: string;
  preferredSessionTime: string;
  dateMapped: string; // ISO date string
}

/* ------------------------------------------------------------------ */
/*  Form data – mirrors Learner but all fields are strings for forms   */
/* ------------------------------------------------------------------ */
export interface LearnerFormData {
  // Administrative
  region: string;
  division: string;
  district: string;
  calendarYear: number;
  mappedBy: string;

  // Personal
  lastName: string;
  firstName: string;
  middleName: string;
  nameExtension: string;
  sex: 'Male' | 'Female' | '';
  civilStatus: string;
  birthdate: string;
  age: string;
  motherTongue: string;
  isIP: string;
  ipTribe: string;
  religion: string;
  is4PsMember: string;
  fourPsOrIp: string;
  isPwd: string;
  pwdType: string;
  pwdTypeOther: string;

  // Address
  barangay: string;
  completeAddress: string;

  // Family
  roleInFamily: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  guardianOccupation: string;

  // Education
  schoolName: string;
  currentlyStudying: string;
  lastGradeCompleted: string;
  reasonForNotAttending: string;
  reasonForNotAttendingOther: string;
  isBlp: string;
  occupationType: string;
  employmentStatus: string;
  monthlyIncome: string;
  interestedInALS: string;
  contactNumber: string;

  // Logistics
  distanceKm: string;
  travelTime: string;
  transportMode: string;
  preferredSessionTime: string;
  dateMapped: string;
}

export type ValidationErrors = Record<string, string>;

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export interface User {
  name: string;
  email: string;
}
