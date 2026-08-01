import { Booking } from '../types';
import { getISODateString } from '../utils/dateUtils';

/**
 * Generate initial realistic seed bookings centered around current week
 */
export function getInitialBookings(): Booking[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0: Sun, 1: Mon, ...
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMon);

  const getDateOffset = (dayOffset: number) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + dayOffset);
    return getISODateString(d);
  };

  const monStr = getDateOffset(0); // Mon
  const tueStr = getDateOffset(1); // Tue
  const wedStr = getDateOffset(2); // Wed
  const thuStr = getDateOffset(3); // Thu
  const friStr = getDateOffset(4); // Fri

  return [
    // Monday
    {
      id: 'book-1',
      roomId: 'room-1',
      date: monStr,
      startTime: '09:00',
      endTime: '11:00',
      bookerName: 'ครูสมชาย ใจดี',
      department: 'ฝ่ายบริหารงานวิชาการ',
      purpose: 'ประชุมชี้แจงแนวทางการจัดการเรียนการสอน ภาคเรียนที่ 1',
      attendees: 120,
      phone: '081-234-5678',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'book-2',
      roomId: 'room-2',
      date: monStr,
      startTime: '10:00',
      endTime: '12:00',
      bookerName: 'ครูวิภาดา พรหมณี',
      department: 'กลุ่มสาระฯ ภาษาไทย',
      purpose: 'ประชุมจัดทำแผนการเรียนรู้และข้อสอบกลางภาค',
      attendees: 12,
      phone: '089-876-5432',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'book-3',
      roomId: 'room-3',
      date: monStr,
      startTime: '13:00',
      endTime: '15:00',
      bookerName: 'ครูประเสริฐ ช่างคิด',
      department: 'กลุ่มสาระฯ วิทยาศาสตร์และเทคโนโลยี',
      purpose: 'ฉายภาพยนตร์สั้นวิทยาศาสตร์และดาราศาสตร์ ระดับชั้น ม.3',
      attendees: 55,
      phone: '086-111-2233',
      createdAt: new Date().toISOString(),
    },

    // Tuesday
    {
      id: 'book-4',
      roomId: 'room-1',
      date: tueStr,
      startTime: '13:00',
      endTime: '16:00',
      bookerName: 'ครูสุวรรณา ศรีสุข',
      department: 'ฝ่ายกิจการนักเรียน',
      purpose: 'การอบรมเชิงปฏิบัติการ "ผู้นำเยาวชนพฤติกรรมดี"',
      attendees: 90,
      phone: '082-999-8877',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'book-5',
      roomId: 'room-3',
      date: tueStr,
      startTime: '08:00',
      endTime: '10:00',
      bookerName: 'ครูธนากร รุ่งเรือง',
      department: 'กลุ่มสาระฯ ภาษาต่างประเทศ',
      purpose: 'กิจกรรม English Movie Club และการทดสอบ listening test',
      attendees: 48,
      phone: '084-555-6677',
      createdAt: new Date().toISOString(),
    },

    // Wednesday
    {
      id: 'book-6',
      roomId: 'room-2',
      date: wedStr,
      startTime: '09:00',
      endTime: '11:00',
      bookerName: 'ครูวรรณนี เพชรดี',
      department: 'กลุ่มสาระฯ คณิตศาสตร์',
      purpose: 'หารือการจัดแข่งขันทักษะคณิตศาสตร์ระดับจังหวัด',
      attendees: 15,
      phone: '085-333-2211',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'book-7',
      roomId: 'room-3',
      date: wedStr,
      startTime: '10:00',
      endTime: '12:00',
      bookerName: 'ครูเกริกเกียรติ สื่อไทย',
      department: 'ฝ่ายบริหารทั่วไป',
      purpose: 'สาธิตและแนะนำการใช้งานระบบนวัตกรรมสื่อการเรียนรู้ใหม่',
      attendees: 40,
      phone: '087-444-1122',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'book-8',
      roomId: 'room-1',
      date: wedStr,
      startTime: '13:00',
      endTime: '15:00',
      bookerName: 'ผู้อำนวยการโรงเรียน',
      department: 'ฝ่ายบริหารงานวิชาการ',
      purpose: 'ประชุมคณะกรรมการสถานศึกษาขั้นพื้นฐาน',
      attendees: 80,
      phone: '081-000-9988',
      createdAt: new Date().toISOString(),
    },

    // Thursday
    {
      id: 'book-9',
      roomId: 'room-2',
      date: thuStr,
      startTime: '13:00',
      endTime: '15:00',
      bookerName: 'ครูอารีรัตน์ โอบอ้อม',
      department: 'กลุ่มสาระฯ สังคมศึกษา ศาสนา และวัฒนธรรม',
      purpose: 'เตรียมการจัดกิจกรรมวันสำคัญทางศาสนาและวัฒนธรรมไทย',
      attendees: 18,
      phone: '083-222-1100',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'book-10',
      roomId: 'room-3',
      date: thuStr,
      startTime: '14:00',
      endTime: '16:00',
      bookerName: 'ครูฉัตรชัย มีชัย',
      department: 'กลุ่มสาระฯ ศิลปะ',
      purpose: 'ฝึกซ้อมการบรรยายภาพนิ่งและประวัติศาสตร์ศิลป์',
      attendees: 35,
      phone: '088-777-6655',
      createdAt: new Date().toISOString(),
    },

    // Friday
    {
      id: 'book-11',
      roomId: 'room-1',
      date: friStr,
      startTime: '08:00',
      endTime: '11:00',
      bookerName: 'ครูชลธิชา สายนที',
      department: 'สภานักเรียน / กิจกรรมพัฒนาผู้เรียน',
      purpose: 'การประชุมสรุปผลการดำเนินกิจกรรมสภานักเรียน ประจำเดือน',
      attendees: 110,
      phone: '086-555-4433',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'book-12',
      roomId: 'room-2',
      date: friStr,
      startTime: '14:00',
      endTime: '16:00',
      bookerName: 'ครูณรงค์ ศักดิ์สิทธิ์',
      department: 'ฝ่ายงบประมาณและแผนงาน',
      purpose: 'สรุปการจัดทำงบประมาณโครงการพัฒนาโรงเรียน',
      attendees: 10,
      phone: '089-111-3355',
      createdAt: new Date().toISOString(),
    },
  ];
}
