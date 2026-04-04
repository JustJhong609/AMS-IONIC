import { Learner } from '../types';
import { supabase } from './supabaseClient';

type LearnerRow = {
  id: string;
  created_by: string;
  region: string;
  division: string;
  district: string;
  calendar_year: number;
  mapped_by: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  name_extension: string | null;
  sex: 'Male' | 'Female';
  civil_status: string;
  birthdate: string;
  age: number;
  mother_tongue: string;
  is_ip: boolean;
  ip_tribe: string | null;
  religion: string | null;
  is_4ps_member: boolean;
  four_ps_or_ip: string | null;
  is_pwd: boolean;
  pwd_type: string | null;
  pwd_type_other: string | null;
  barangay: string;
  complete_address: string;
  role_in_family: string;
  father_name: string | null;
  mother_name: string | null;
  guardian_name: string | null;
  guardian_occupation: string | null;
  school_name: string | null;
  currently_studying: string;
  last_grade_completed: string;
  reason_for_not_attending: string;
  reason_for_not_attending_other: string | null;
  is_blp: boolean;
  occupation_type: string | null;
  employment_status: string | null;
  monthly_income: string | null;
  interested_in_als: string;
  contact_number: string | null;
  distance_km: number;
  travel_time: string;
  transport_mode: string;
  preferred_session_time: string;
  date_mapped: string;
};

const rowToLearner = (row: LearnerRow): Learner => ({
  id: row.id,
  createdBy: row.created_by,
  region: row.region,
  division: row.division,
  district: row.district,
  calendarYear: row.calendar_year,
  mappedBy: row.mapped_by,
  lastName: row.last_name,
  firstName: row.first_name,
  middleName: row.middle_name,
  nameExtension: row.name_extension ?? undefined,
  sex: row.sex,
  civilStatus: row.civil_status,
  birthdate: row.birthdate,
  age: row.age,
  motherTongue: row.mother_tongue,
  isIP: row.is_ip,
  ipTribe: row.ip_tribe ?? undefined,
  religion: row.religion ?? undefined,
  is4PsMember: row.is_4ps_member,
  fourPsOrIp: row.four_ps_or_ip ?? undefined,
  isPwd: row.is_pwd,
  pwdType: row.pwd_type ?? undefined,
  pwdTypeOther: row.pwd_type_other ?? undefined,
  barangay: row.barangay,
  completeAddress: row.complete_address,
  roleInFamily: row.role_in_family,
  fatherName: row.father_name ?? undefined,
  motherName: row.mother_name ?? undefined,
  guardianName: row.guardian_name ?? undefined,
  guardianOccupation: row.guardian_occupation ?? undefined,
  schoolName: row.school_name ?? undefined,
  currentlyStudying: row.currently_studying,
  lastGradeCompleted: row.last_grade_completed,
  reasonForNotAttending: row.reason_for_not_attending,
  reasonForNotAttendingOther: row.reason_for_not_attending_other ?? undefined,
  isBlp: row.is_blp,
  occupationType: row.occupation_type ?? undefined,
  employmentStatus: row.employment_status ?? undefined,
  monthlyIncome: row.monthly_income ?? undefined,
  interestedInALS: row.interested_in_als,
  contactNumber: row.contact_number ?? undefined,
  distanceKm: Number(row.distance_km),
  travelTime: row.travel_time,
  transportMode: row.transport_mode,
  preferredSessionTime: row.preferred_session_time,
  dateMapped: row.date_mapped,
});

const learnerToRow = (learner: Learner) => ({
  id: learner.id,
  created_by: learner.createdBy,
  region: learner.region,
  division: learner.division,
  district: learner.district,
  calendar_year: learner.calendarYear,
  mapped_by: learner.mappedBy,
  last_name: learner.lastName,
  first_name: learner.firstName,
  middle_name: learner.middleName,
  name_extension: learner.nameExtension ?? null,
  sex: learner.sex,
  civil_status: learner.civilStatus,
  birthdate: learner.birthdate,
  age: learner.age,
  mother_tongue: learner.motherTongue,
  is_ip: learner.isIP,
  ip_tribe: learner.ipTribe ?? null,
  religion: learner.religion ?? null,
  is_4ps_member: learner.is4PsMember,
  four_ps_or_ip: learner.fourPsOrIp ?? null,
  is_pwd: learner.isPwd,
  pwd_type: learner.pwdType ?? null,
  pwd_type_other: learner.pwdTypeOther ?? null,
  barangay: learner.barangay,
  complete_address: learner.completeAddress,
  role_in_family: learner.roleInFamily,
  father_name: learner.fatherName ?? null,
  mother_name: learner.motherName ?? null,
  guardian_name: learner.guardianName ?? null,
  guardian_occupation: learner.guardianOccupation ?? null,
  school_name: learner.schoolName ?? null,
  currently_studying: learner.currentlyStudying,
  last_grade_completed: learner.lastGradeCompleted,
  reason_for_not_attending: learner.reasonForNotAttending,
  reason_for_not_attending_other: learner.reasonForNotAttendingOther ?? null,
  is_blp: learner.isBlp,
  occupation_type: learner.occupationType ?? null,
  employment_status: learner.employmentStatus ?? null,
  monthly_income: learner.monthlyIncome ?? null,
  interested_in_als: learner.interestedInALS,
  contact_number: learner.contactNumber ?? null,
  distance_km: learner.distanceKm,
  travel_time: learner.travelTime,
  transport_mode: learner.transportMode,
  preferred_session_time: learner.preferredSessionTime,
  date_mapped: learner.dateMapped,
});

export const fetchLearners = async (): Promise<Learner[]> => {
  const { data, error } = await supabase
    .from('learners')
    .select('*')
    .order('date_mapped', { ascending: false })
    .order('last_name', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as LearnerRow[]).map(rowToLearner);
};

export const createLearner = async (learner: Learner): Promise<void> => {
  const { error } = await supabase.from('learners').insert(learnerToRow(learner));
  if (error) throw error;
};

export const updateLearner = async (learner: Learner): Promise<void> => {
  const { id: _ignoredId, created_by: _ignoredCreatedBy, ...updatableRow } = learnerToRow(learner);
  const { error } = await supabase
    .from('learners')
    .update(updatableRow)
    .eq('id', learner.id);
  if (error) throw error;
};

export const deleteLearner = async (id: string): Promise<void> => {
  const { error } = await supabase.from('learners').delete().eq('id', id);
  if (error) throw error;
};
