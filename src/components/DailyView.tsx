import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Users,
  Info,
  Clock,
  Sparkles,
  AlertCircle,
  Building2,
  Tv,
  Radio,
  CheckCircle,
} from 'lucide-react';
import { Room, Booking } from '../types';
import {
  OPERATING_SLOTS,
  formatThaiDateLong,
  getWeekDays,
  getISODateString,
  getBookingForSlot,
  isWeekday,
} from '../utils/dateUtils';

interface DailyViewProps {
  rooms: Room[];
  bookings: Booking[];
  currentDateStr: string;
  setCurrentDateStr: (date: string) => void;
  onSelectVacantSlot: (roomId: string, startTime: string, endTime: string) => void;
  onSelectBooking: (booking: Booking) => void;
  onOpenBookingModal: () => void;
}

export const DailyView: React.FC<DailyViewProps> = ({
  rooms,
  bookings,
  currentDateStr,
  setCurrentDateStr,
  onSelectVacantSlot,
  onSelectBooking,
  onOpenBookingModal,
}) => {
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('all');

  // Handle date step
  const handleStepDay = (deltaDays: number) => {
    const cur = new Date(currentDateStr + 'T00:00:00');
    cur.setDate(cur.getDate() + deltaDays);
    setCurrentDateStr(getISODateString(cur));
  };

  // Handle Jump to Today
  const handleJumpToday = () => {
    const today = new Date();
    setCurrentDateStr(getISODateString(today));
  };

  // Get week days for fast navigation
  const weekDays = getWeekDays(currentDateStr);
  const isWeekendSelected = !isWeekday(currentDateStr);

  // Helper icon for room
  const getRoomIcon = (roomId: string) => {
    if (roomId === 'room-1') return <Building2 className="w-5 h-5" />;
    if (roomId === 'room-2') return <Tv className="w-5 h-5" />;
    return <Radio className="w-5 h-5" />;
  };

  const filteredRooms = selectedRoomFilter === 'all'
    ? rooms
    : rooms.filter((r) => r.id === selectedRoomFilter);

  return (
    <div className="space-y-6">
      {/* 1. Date Navigation Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-[#006064]/20 dark:border-slate-800 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Main Date Display & Prev/Next Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => handleStepDay(-1)}
              className="p-2 sm:p-2.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-[#e0f2f1]/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              title="วันก่อนหน้า"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleJumpToday}
              className="px-3.5 py-2 rounded-md border border-[#004d40]/20 bg-[#e0f2f1] dark:bg-slate-800 dark:border-slate-700 hover:bg-[#b2dfdb] text-[#004d40] dark:text-teal-300 font-bold text-xs sm:text-sm transition-colors shadow-2xs"
            >
              วันนี้
            </button>

            <button
              onClick={() => handleStepDay(1)}
              className="p-2 sm:p-2.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-[#e0f2f1]/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              title="วันถัดไป"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="pl-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#004d40] hidden sm:block" />
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {formatThaiDateLong(currentDateStr)}
                </h2>
              </div>
              {isWeekendSelected && (
                <span className="inline-flex items-center text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  วันเสาร์-อาทิตย์ (นอกเวลาทำการหลัก)
                </span>
              )}
            </div>
          </div>

          {/* Quick Date Picker & Weekday Jump Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Weekday Chips (Mon-Fri) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-md border border-slate-200 dark:border-slate-700 overflow-x-auto">
              {weekDays.map((wd) => {
                const isSelected = wd.date === currentDateStr;
                return (
                  <button
                    key={wd.date}
                    onClick={() => setCurrentDateStr(wd.date)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#004d40] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-[#004d40] hover:bg-white dark:hover:bg-slate-700'
                    }`}
                  >
                    {wd.dayName.replace('วัน', '')}
                  </button>
                );
              })}
            </div>

            {/* Date Input Selector */}
            <div className="relative">
              <input
                type="date"
                value={currentDateStr}
                onChange={(e) => e.target.value && setCurrentDateStr(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004d40] shadow-2xs"
              />
            </div>
          </div>

        </div>

        {/* Room Filter Pills & Legend Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Room Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
              เลือกดูห้อง:
            </span>
            <button
              onClick={() => setSelectedRoomFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                selectedRoomFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              แสดงทุกห้อง (3)
            </button>
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomFilter(room.id)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all border ${room.badgeBg} ${room.badgeText} ${room.borderColor} ${
                  selectedRoomFilter === room.id ? 'ring-2 ring-[#004d40] font-bold shadow-2xs' : 'opacity-85 hover:opacity-100'
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>

          {/* Visual Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#e0f2f1] border border-[#00897b]/40 inline-block"></span>
              <span>ว่าง (คลิกเพื่อจอง)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#004d40] inline-block"></span>
              <span>จองแล้ว</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>08.00 - 16.00 น.</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Daily Schedule Matrix Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-[#006064]/20 dark:border-slate-800 overflow-hidden">
        
        {/* Responsive Desktop & Tablet Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900">
                {/* Time Slot Column Header */}
                <th className="py-3.5 px-4 text-left text-[11px] font-extrabold text-[#004d40] dark:text-teal-300 uppercase tracking-widest w-36 border-r border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#00695c]" />
                    <span>ช่วงเวลา</span>
                  </div>
                </th>

                {/* Rooms Column Headers */}
                {filteredRooms.map((room) => (
                  <th
                    key={room.id}
                    className="py-3.5 px-4 text-left border-r border-slate-200 dark:border-slate-800 last:border-r-0"
                    style={{ width: `${88 / filteredRooms.length}%` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`p-1.5 rounded-md ${room.badgeBg} ${room.badgeText} border ${room.borderColor}`}>
                          {getRoomIcon(room.id)}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {room.name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${room.badgeBg} ${room.badgeText} ${room.borderColor}`}>
                              {room.capacity} คน
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium mt-0.5">
                            {room.amenities.slice(0, 2).join(' • ')}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={onOpenBookingModal}
                        className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#004d40] bg-[#e0f2f1] hover:bg-[#b2dfdb] dark:bg-teal-950/60 dark:text-teal-300 rounded border border-[#004d40]/20 dark:border-teal-800 transition-colors"
                        title="จองห้องนี้"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>จอง</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {OPERATING_SLOTS.map((slot) => {
                return (
                  <tr key={slot.label} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    
                    {/* Time Label */}
                    <td className="py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#00897b]"></span>
                        <span>{slot.label} น.</span>
                      </div>
                    </td>

                    {/* Room Slots */}
                    {filteredRooms.map((room) => {
                      const booking = getBookingForSlot(
                        room.id,
                        currentDateStr,
                        slot.startTime,
                        slot.endTime,
                        bookings
                      );

                      if (booking) {
                        return (
                          <td
                            key={room.id}
                            className="p-1.5 border-r border-slate-200 dark:border-slate-800 last:border-r-0 align-top"
                          >
                            <div
                              onClick={() => onSelectBooking(booking)}
                              className="group relative p-2.5 rounded-md bg-[#004d40] text-white shadow-xs hover:bg-[#00382f] transition-all cursor-pointer border border-[#00382f]"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className="text-[11px] font-bold text-[#e0f2f1] bg-black/20 px-2 py-0.5 rounded">
                                  {booking.startTime} - {booking.endTime} น.
                                </span>
                                <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                  จองแล้ว
                                </span>
                              </div>

                              <p className="font-extrabold text-xs sm:text-sm text-white mt-1.5 line-clamp-1 group-hover:underline">
                                {booking.purpose}
                              </p>

                              <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-[11px] text-[#b2dfdb] mt-1">
                                <span className="font-semibold text-white">
                                  👤 {booking.bookerName}
                                </span>
                                <span className="opacity-60">•</span>
                                <span className="opacity-90 font-medium">
                                  🏢 {booking.department}
                                </span>
                              </div>
                            </div>
                          </td>
                        );
                      }

                      // Vacant Cell
                      return (
                        <td
                          key={room.id}
                          className="p-1.5 border-r border-slate-200 dark:border-slate-800 last:border-r-0 align-top"
                        >
                          <button
                            onClick={() =>
                              onSelectVacantSlot(room.id, slot.startTime, slot.endTime)
                            }
                            className="w-full h-full min-h-[52px] p-2 rounded-md border border-dashed border-[#00897b]/40 dark:border-slate-700 bg-[#e0f2f1]/30 hover:bg-[#e0f2f1] dark:hover:bg-teal-950/40 hover:border-[#004d40] text-[#004d40] dark:text-teal-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 group"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#00695c] dark:text-teal-300 group-hover:scale-110 transition-transform" />
                            <span className="opacity-90 group-hover:opacity-100 font-bold">
                              ว่าง (จองเวลานี้)
                            </span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* 3. Summary & Quick Stats Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const roomBookingsToday = bookings.filter(
            (b) => b.roomId === room.id && b.date === currentDateStr
          );
          const totalHoursBooked = roomBookingsToday.reduce((acc, b) => {
            const [sh] = b.startTime.split(':').map(Number);
            const [eh] = b.endTime.split(':').map(Number);
            return acc + (eh - sh);
          }, 0);

          return (
            <div
              key={room.id}
              className={`p-4 rounded-xl bg-white dark:bg-slate-900 border ${room.borderColor} shadow-2xs flex items-center justify-between`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-md ${room.badgeBg} ${room.badgeText}`}>
                  {getRoomIcon(room.id)}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {room.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    วันนี้จองไปแล้ว: <strong className="text-[#004d40] dark:text-teal-300 font-bold">{totalHoursBooked} ชม.</strong> ({roomBookingsToday.length} รายการ)
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded text-xs font-extrabold border ${room.badgeBg} ${room.badgeText} ${room.borderColor}`}>
                {8 - totalHoursBooked} ชม. ว่าง
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
