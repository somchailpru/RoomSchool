import { Booking, TimeSlot } from '../types';

// Operating Time Slots (Mon-Fri 08:00 - 16:00, 1-hour slots)
export const OPERATING_SLOTS: TimeSlot[] = [
  { label: '08:00 - 09:00', startHour: 8, endHour: 9, startTime: '08:00', endTime: '09:00' },
  { label: '09:00 - 10:00', startHour: 9, endHour: 10, startTime: '09:00', endTime: '10:00' },
  { label: '10:00 - 11:00', startHour: 10, endHour: 11, startTime: '10:00', endTime: '11:00' },
  { label: '11:00 - 12:00', startHour: 11, endHour: 12, startTime: '11:00', endTime: '12:00' },
  { label: '12:00 - 13:00', startHour: 12, endHour: 13, startTime: '12:00', endTime: '13:00' },
  { label: '13:00 - 14:00', startHour: 13, endHour: 14, startTime: '13:00', endTime: '14:00' },
  { label: '14:00 - 15:00', startHour: 14, endHour: 15, startTime: '14:00', endTime: '15:00' },
  { label: '15:00 - 16:00', startHour: 15, endHour: 16, startTime: '15:00', endTime: '16:00' },
];

export const TIME_OPTIONS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

/**
 * Format date string YYYY-MM-DD to Thai full format (e.g., "วันจันทร์ที่ 4 สิงหาคม 2569")
 */
export function formatThaiDateLong(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  const dayNames = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const dayName = dayNames[date.getDay()];
  const dayNum = date.getDate();
  const monthName = monthNames[date.getMonth()];
  const yearBE = date.getFullYear() + 543;

  return `${dayName}ที่ ${dayNum} ${monthName} พ.ศ. ${yearBE}`;
}

/**
 * Format date string YYYY-MM-DD to Thai short format (e.g., "4 ส.ค. 69")
 */
export function formatThaiDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  const shortMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const dayNum = date.getDate();
  const monthName = shortMonths[date.getMonth()];
  const yearBE = (date.getFullYear() + 543).toString().slice(-2);

  return `${dayNum} ${monthName} ${yearBE}`;
}

/**
 * Get YYYY-MM-DD string from Date object
 */
export function getISODateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Get current date or nearest weekday (Mon-Fri)
 */
export function getInitialDate(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun, 6 = Sat
  if (dayOfWeek === 0) {
    // Sunday -> move to Monday
    today.setDate(today.getDate() + 1);
  } else if (dayOfWeek === 6) {
    // Saturday -> move to Monday
    today.setDate(today.getDate() + 2);
  }
  return getISODateString(today);
}

/**
 * Check if a date string falls on a weekday (Mon-Fri)
 */
export function isWeekday(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  return day >= 1 && day <= 5;
}

/**
 * Get Monday to Friday date strings for the week containing `dateStr`
 */
export function getWeekDays(dateStr: string): { date: string; dayName: string; formattedShort: string }[] {
  const current = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = current.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  
  // Calculate Monday of this week
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);

  const dayNames = ['วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์'];
  
  return dayNames.map((dayName, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const iso = getISODateString(d);
    return {
      date: iso,
      dayName,
      formattedShort: formatThaiDateShort(iso),
    };
  });
}

/**
 * Helper to convert "08:00" string to decimal hours (e.g. 8.5)
 */
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

/**
 * Check if a proposed booking time range overlaps with any existing booking for the same room & date
 */
export function checkTimeOverlap(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  bookings: Booking[],
  excludeBookingId?: string
): { hasConflict: boolean; conflictingBooking?: Booking } {
  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  if (newStart >= newEnd) {
    return { hasConflict: true };
  }

  for (const b of bookings) {
    if (b.id === excludeBookingId) continue;
    if (b.roomId === roomId && b.date === date) {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);

      // Overlap condition: newStart < bEnd AND newEnd > bStart
      if (newStart < bEnd && newEnd > bStart) {
        return { hasConflict: true, conflictingBooking: b };
      }
    }
  }

  return { hasConflict: false };
}

/**
 * Get booking occupied at a specific room, date, and hour slot
 */
export function getBookingForSlot(
  roomId: string,
  date: string,
  slotStartTime: string,
  slotEndTime: string,
  bookings: Booking[]
): Booking | undefined {
  const slotStartMin = timeToMinutes(slotStartTime);
  const slotEndMin = timeToMinutes(slotEndTime);

  return bookings.find((b) => {
    if (b.roomId !== roomId || b.date !== date) return false;
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);
    return slotStartMin >= bStart && slotEndMin <= bEnd;
  });
}
