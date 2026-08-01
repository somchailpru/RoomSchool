export interface Room {
  id: string;
  name: string;
  capacity: number;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  accentColor: string;
  headerBg: string;
  description: string;
  amenities: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "08:00"
  endTime: string; // "10:00"
  bookerName: string;
  department: string;
  purpose: string;
  attendees?: number;
  phone?: string;
  createdAt: string;
}

export interface TimeSlot {
  label: string; // e.g. "08:00 - 09:00"
  startHour: number; // 8
  endHour: number; // 9
  startTime: string; // "08:00"
  endTime: string; // "09:00"
}

export const SCHOOL_DEPARTMENTS = [
  'กลุ่มสาระฯ วิทยาศาสตร์และเทคโนโลยี',
  'กลุ่มสาระฯ คณิตศาสตร์',
  'กลุ่มสาระฯ ภาษาไทย',
  'กลุ่มสาระฯ ภาษาต่างประเทศ',
  'กลุ่มสาระฯ สังคมศึกษา ศาสนา และวัฒนธรรม',
  'กลุ่มสาระฯ ศิลปะ',
  'กลุ่มสาระฯ สุขศึกษาและพลศึกษา',
  'กลุ่มสาระฯ การงานอาชีพ',
  'ฝ่ายบริหารงานวิชาการ',
  'ฝ่ายกิจการนักเรียน',
  'ฝ่ายบริหารทั่วไป',
  'ฝ่ายงบประมาณและแผนงาน',
  'สภานักเรียน / กิจกรรมพัฒนาผู้เรียน',
];
