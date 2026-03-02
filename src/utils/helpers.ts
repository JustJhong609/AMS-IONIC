import { LearnerFormData } from '../types';
import { REGION, DIVISION, DISTRICT } from './constants';

export const createEmptyFormData = (): LearnerFormData => ({
  region: REGION,
  division: DIVISION,
  district: DISTRICT,
  calendarYear: new Date().getFullYear(),
  mappedBy: '',

  lastName: '',
  firstName: '',
  middleName: '',
  nameExtension: '',
  sex: '',
  civilStatus: '',
  birthdate: '',
  age: '',
  motherTongue: '',
  isIP: '',
  ipTribe: '',
  religion: '',
  is4PsMember: '',
  fourPsOrIp: '',
  isPwd: '',
  pwdType: '',
  pwdTypeOther: '',

  barangay: '',
  completeAddress: '',

  roleInFamily: '',
  fatherName: '',
  motherName: '',
  guardianName: '',
  guardianOccupation: '',

  schoolName: '',
  currentlyStudying: '',
  lastGradeCompleted: '',
  reasonForNotAttending: '',
  reasonForNotAttendingOther: '',
  isBlp: '',
  occupationType: '',
  employmentStatus: '',
  monthlyIncome: '',
  interestedInALS: '',
  contactNumber: '',

  distanceKm: '',
  travelTime: '',
  transportMode: '',
  preferredSessionTime: '',
  dateMapped: '',
});

/** Simple UUID-like ID generator */
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

/** Calculate age from an ISO date string */
export const calculateAge = (dateString: string): number => {
  const birth = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

/** Format ISO date string to Philippine locale */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
