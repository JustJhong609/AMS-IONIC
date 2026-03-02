// ─── Administrative ───────────────────────────────────────────────────────────
export const REGION   = 'Region X (Northern Mindanao)';
export const DIVISION = 'Bukidnon Cluster I';
export const DISTRICT = 'Manolo Fortich District I';

// ─── Picker options ───────────────────────────────────────────────────────────
export const SEX_OPTIONS             = ['Male', 'Female']                  as const;
export const CIVIL_STATUS_OPTIONS    = ['Single', 'Married', 'Widow/er', 'Separated', 'Live-in'] as const;
export const YES_NO_OPTIONS          = ['Yes', 'No']                       as const;
export const CURRENTLY_STUDYING_OPTIONS = ['Yes', 'No']                    as const;

export const FAMILY_ROLE_OPTIONS = [
  'Head', 'Spouse', 'Daughter/Son', 'Stepson/Stepdaughter',
  'Son-in-law/Daughter-in-law', 'Grandson/Granddaughter',
  'Father/Mother', 'Brother/Sister', 'Uncle/Aunt',
  'Nephew/Niece', 'Houseboy/Housegirl', 'Others (Non-relative/Boarder)',
] as const;

export const MOTHER_TONGUE_OPTIONS = [
  'Tagalog', 'Kapampangan', 'Pangasinense', 'Iloko', 'Bikol',
  'Cebuano', 'Hiligaynon', 'Waray', 'Tausug', 'Maguindanaoan',
  'Maranao', 'Chabacano', 'Ybanag', 'Ivatan', 'Samal',
  'Aklanon', 'Kinaray-a', 'Yakan', 'Surigaonon',
] as const;

export const OCCUPATION_TYPE_OPTIONS = ['Government', 'Private', 'Self-employed', 'None'] as const;

export const EMPLOYMENT_STATUS_OPTIONS = ['Regular', 'Contractual', 'Casual', 'JO'] as const;

export const REASON_OPTIONS = [
  'Schools are very far',
  'No school within the barangay',
  'No regular transportation',
  'High cost of education',
  'Illness / Disability',
  'Housekeeping / Housework',
  'Employment / Looking for work',
  'Lack of personal interest',
  'Cannot cope with school work',
  'Others (Specify)',
] as const;

export const BARANGAY_OPTIONS = [
  'Ticala', 'Santo Niño', 'Dicklum', 'Tankulan', 'Lingion', 'San Miguel',
] as const;

export const PWD_TYPE_OPTIONS = [
  'Partially Hearing Impaired',
  'Totally Hearing Impaired',
  'Partially Visually Impaired',
  'Totally Visually Impaired',
  'Physically Impaired',
  'W/ Special Needs',
  'Others (Please Specify)',
] as const;

export const FOURPS_IP_OPTIONS = ["4P's", "IP"] as const;

export const TRANSPORT_OPTIONS = [
  'Walking', 'Tricycle', 'Habal-habal', 'Jeepney', 'Multicab',
  'Private Vehicle', 'Bicycle',
] as const;

export const GRADE_LEVELS = [
  'G1 – G6 (Elementary)', '1st Year HS / Grade 7', '2nd Year HS / Grade 8',
  '3rd Year HS / Grade 9', '4th Year HS / Grade 10', 'High School Graduate',
  'Grade 11 Vocational', 'Senior HS Graduate',
] as const;

export const SESSION_TIME_OPTIONS = [
  'Morning (8:00 AM – 12:00 PM)',
  'Afternoon (1:00 PM – 5:00 PM)',
  'Evening (6:00 PM – 9:00 PM)',
  'Weekends Only',
] as const;

export const FORM_SECTIONS = [
  'Personal Info',
  'Education',
  'Address',
  'Family',
  'Logistics',
] as const;

// ─── Theme colours ────────────────────────────────────────────────────────────
export const COLORS = {
  primary:       '#1565C0',
  primaryDark:   '#0D47A1',
  primaryLight:  '#42A5F5',
  accent:        '#FF6F00',
  success:       '#2E7D32',
  error:         '#D32F2F',
  text:          '#212121',
  textSecondary: '#757575',
  border:        '#E0E0E0',
  background:    '#F5F5F5',
  white:         '#FFFFFF',
  surface:       '#FFFFFF',
} as const;
