import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Building,
  FileText,
  Users,
  Phone,
  Trash2,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Room, Booking } from '../types';
import { formatThaiDateLong } from '../utils/dateUtils';

interface BookingDetailModalProps {
  booking: Booking | null;
  rooms: Room[];
  onClose: () => void;
  onDeleteBooking: (bookingId: string) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  rooms,
  onClose,
  onDeleteBooking,
}) => {
  if (!booking) return null;

  const room = rooms.find((r) => r.id === booking.roomId);

  const handleDelete = () => {
    if (window.confirm(`ยืนยันการยกเลิกรายการจอง "${booking.purpose}" หรือไม่?`)) {
      onDeleteBooking(booking.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-[#006064]/20 dark:border-slate-800 w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between ${room?.headerBg || 'bg-[#004d40] text-white'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-md">
              <Building2 className="w-6 h-6 text-[#80cbc4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b2dfdb]">
                BOOKING DETAILS
              </span>
              <h3 className="font-extrabold text-lg text-white">
                {room?.name}
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

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Purpose & Status */}
          <div className="p-4 rounded-md bg-[#e0f2f1]/80 dark:bg-teal-950/40 border border-[#004d40]/20 dark:border-teal-900">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#004d40] dark:text-teal-300">
                วัตถุประสงค์การใช้ห้อง
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#004d40] bg-white px-2.5 py-0.5 rounded border border-[#004d40]/30">
                <CheckCircle2 className="w-3 h-3 text-[#00695c]" /> จองสำเร็จ
              </span>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {booking.purpose}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            
            {/* Date */}
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-[#00695c]" />
                <span>วันที่</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {formatThaiDateLong(booking.date)}
              </p>
            </div>

            {/* Time */}
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#00695c]" />
                <span>ช่วงเวลา</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {booking.startTime} - {booking.endTime} น.
              </p>
            </div>

            {/* Booker */}
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                <User className="w-3.5 h-3.5 text-[#00695c]" />
                <span>ผู้จอง</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {booking.bookerName}
              </p>
            </div>

            {/* Department */}
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                <Building className="w-3.5 h-3.5 text-[#00695c]" />
                <span>หน่วยงาน / กลุ่มสาระ</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5 line-clamp-2">
                {booking.department}
              </p>
            </div>

            {/* Attendees */}
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                <Users className="w-3.5 h-3.5 text-[#00695c]" />
                <span>ผู้เข้าร่วมประมาณ</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {booking.attendees ? `${booking.attendees} คน` : '-'}
              </p>
            </div>

            {/* Phone */}
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#00695c]" />
                <span>เบอร์ติดต่อ</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {booking.phone || '-'}
              </p>
            </div>

          </div>

          {/* Room Features */}
          {room && (
            <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                อุปกรณ์ในห้อง {room.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {room.amenities.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 rounded text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                  >
                    • {item}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-900 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>ยกเลิกรายการจองนี้</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
