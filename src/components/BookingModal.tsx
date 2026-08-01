import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Building,
  FileText,
  Users,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { Room, Booking, SCHOOL_DEPARTMENTS } from '../types';
import {
  TIME_OPTIONS,
  checkTimeOverlap,
  formatThaiDateLong,
  isWeekday,
} from '../utils/dateUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  bookings: Booking[];
  initialRoomId?: string;
  initialDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  onSaveBooking: (newBooking: Omit<Booking, 'id' | 'createdAt'>) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  rooms,
  bookings,
  initialRoomId,
  initialDate,
  initialStartTime,
  initialEndTime,
  onSaveBooking,
}) => {
  const [roomId, setRoomId] = useState<string>(initialRoomId || rooms[0]?.id || 'room-1');
  const [date, setDate] = useState<string>(initialDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>(initialStartTime || '09:00');
  const [endTime, setEndTime] = useState<string>(initialEndTime || '10:00');
  const [bookerName, setBookerName] = useState<string>('');
  const [department, setDepartment] = useState<string>(SCHOOL_DEPARTMENTS[0]);
  const [purpose, setPurpose] = useState<string>('');
  const [attendees, setAttendees] = useState<number>(20);
  const [phone, setPhone] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form or set initial values when opened
  useEffect(() => {
    if (isOpen) {
      setRoomId(initialRoomId || rooms[0]?.id || 'room-1');
      setDate(initialDate || new Date().toISOString().split('T')[0]);
      setStartTime(initialStartTime || '09:00');
      setEndTime(initialEndTime || '10:00');
      setBookerName('');
      setPurpose('');
      setAttendees(20);
      setPhone('');
      setErrors({});
    }
  }, [isOpen, initialRoomId, initialDate, initialStartTime, initialEndTime, rooms]);

  if (!isOpen) return null;

  // Real-time conflict validation
  const timeOverlapCheck = checkTimeOverlap(roomId, date, startTime, endTime, bookings);
  const isTimeInvalid = startTime >= endTime;
  const isWeekend = !isWeekday(date);
  const selectedRoom = rooms.find((r) => r.id === roomId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!bookerName.trim()) {
      newErrors.bookerName = 'กรุณาระบุชื่อผู้จอง';
    }
    if (!purpose.trim()) {
      newErrors.purpose = 'กรุณาระบุวัตถุประสงค์การใช้ห้อง';
    }
    if (isTimeInvalid) {
      newErrors.time = 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น';
    }
    if (timeOverlapCheck.hasConflict) {
      newErrors.overlap = 'ช่วงเวลานี้มีการจองอยู่แล้ว';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSaveBooking({
      roomId,
      date,
      startTime,
      endTime,
      bookerName: bookerName.trim(),
      department,
      purpose: purpose.trim(),
      attendees,
      phone: phone.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-[#006064]/20 dark:border-slate-800 w-full max-w-2xl my-8 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#004d40] text-white px-6 py-4 flex items-center justify-between border-b border-[#00382f]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-md">
              <Calendar className="w-6 h-6 text-[#80cbc4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b2dfdb]">
                NEW RESERVATION FORM
              </span>
              <h3 className="font-extrabold text-lg text-white">
                แบบฟอร์มจองห้องประชุม / ห้องโสตทัศนศึกษา
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Room Selection */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#00695c]" />
              <span>เลือกห้องที่ต้องการจอง <span className="text-rose-500">*</span></span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rooms.map((room) => {
                const isSelected = room.id === roomId;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setRoomId(room.id)}
                    className={`p-3 rounded-md border text-left transition-all relative ${
                      isSelected
                        ? 'border-[#004d40] bg-[#e0f2f1] dark:bg-teal-950/60 ring-2 ring-[#004d40]/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${room.badgeBg} ${room.badgeText} ${room.borderColor}`}>
                        ความจุ {room.capacity} คน
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#004d40]" />
                      )}
                    </div>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">
                      {room.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Date */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00695c]" />
                <span>วันที่จอง <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-[#004d40] focus:outline-none"
                required
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00695c]" />
                <span>เวลาเริ่ม <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-[#004d40] focus:outline-none"
              >
                {TIME_OPTIONS.slice(0, -1).map((t) => (
                  <option key={t} value={t}>
                    {t} น.
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00695c]" />
                <span>เวลาสิ้นสุด <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-[#004d40] focus:outline-none"
              >
                {TIME_OPTIONS.slice(1).map((t) => (
                  <option key={t} value={t}>
                    {t} น.
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Conflict Status Notification Banner */}
          {isTimeInvalid ? (
            <div className="p-3.5 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 dark:text-rose-300">
                <strong className="font-bold">เวลาไม่ถูกต้อง!</strong> เวลาสิ้นสุด ({endTime} น.) ต้องมากกว่าเวลาเริ่มต้น ({startTime} น.)
              </div>
            </div>
          ) : timeOverlapCheck.hasConflict ? (
            <div className="p-3.5 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-start gap-3 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 dark:text-rose-300">
                <strong className="font-bold block text-rose-900 dark:text-rose-200">
                  ⚠️ ไม่สามารถจองได้! ช่วงเวลานี้ถูกจองไว้แล้ว
                </strong>
                <span>
                  ห้อง <strong>{selectedRoom?.name}</strong> ในวันที่ {formatThaiDateLong(date)} ช่วงเวลา{' '}
                  <strong>
                    {timeOverlapCheck.conflictingBooking?.startTime} - {timeOverlapCheck.conflictingBooking?.endTime} น.
                  </strong>{' '}
                  ถูกจองแล้วโดย{' '}
                  <strong>{timeOverlapCheck.conflictingBooking?.bookerName}</strong> ({timeOverlapCheck.conflictingBooking?.department})
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-md bg-[#e0f2f1] dark:bg-emerald-950/50 border border-[#00897b]/30 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-[#004d40] dark:text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#00695c] shrink-0" />
              <span>
                <strong>ช่วงเวลานี้ว่าง!</strong> สามารถทำการจองห้อง {selectedRoom?.name} ({startTime} - {endTime} น.) ได้
              </span>
            </div>
          )}

          {isWeekend && (
            <div className="p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>หมายเหตุ: วันที่เลือกตรงกับวันเสาร์-อาทิตย์ กรุณาประสานงานเจ้าหน้าที่ล่วงหน้า</span>
            </div>
          )}

          {/* Booker Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Booker Name */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00695c]" />
                <span>ชื่อ - นามสกุล ผู้จอง <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                placeholder="เช่น ครูสมชาย ใจดี"
                value={bookerName}
                onChange={(e) => {
                  setBookerName(e.target.value);
                  if (errors.bookerName) setErrors({ ...errors, bookerName: '' });
                }}
                className={`w-full px-3 py-2 rounded-md border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-[#004d40] focus:outline-none ${
                  errors.bookerName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.bookerName && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.bookerName}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#00695c]" />
                <span>แผนก / กลุ่มสาระการเรียนรู้ <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-[#004d40] focus:outline-none"
              >
                {SCHOOL_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#00695c]" />
              <span>วัตถุประสงค์การใช้ห้อง <span className="text-rose-500">*</span></span>
            </label>
            <textarea
              rows={2}
              placeholder="เช่น ประชุมกลุ่มสาระฯ ภาษาไทย เพื่อจัดทำแผนการสอน"
              value={purpose}
              onChange={(e) => {
                setPurpose(e.target.value);
                if (errors.purpose) setErrors({ ...errors, purpose: '' });
              }}
              className={`w-full px-3 py-2 rounded-md border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-[#004d40] focus:outline-none ${
                errors.purpose ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.purpose && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.purpose}</p>
            )}
          </div>

          {/* Attendees & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#00695c]" />
                <span>จำนวนผู้เข้าร่วม (คน)</span>
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-[#004d40] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#00695c]" />
                <span>เบอร์โทรศัพท์ติดต่อ</span>
              </label>
              <input
                type="tel"
                placeholder="เช่น 081-234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-[#004d40] focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold transition-colors"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={timeOverlapCheck.hasConflict || isTimeInvalid}
              className={`px-6 py-2.5 rounded-md font-bold text-sm text-white shadow-md transition-all ${
                timeOverlapCheck.hasConflict || isTimeInvalid
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-[#004d40] hover:bg-[#00382f] active:scale-[0.98] shadow-[#004d40]/25'
              }`}
            >
              ยืนยันการจองห้อง
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
