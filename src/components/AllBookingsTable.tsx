import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle2,
  ListFilter,
  Plus,
} from 'lucide-react';
import { Room, Booking, SCHOOL_DEPARTMENTS } from '../types';
import { formatThaiDateLong } from '../utils/dateUtils';

interface AllBookingsTableProps {
  rooms: Room[];
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
  onOpenBookingModal: () => void;
}

export const AllBookingsTable: React.FC<AllBookingsTableProps> = ({
  rooms,
  bookings,
  onSelectBooking,
  onDeleteBooking,
  onOpenBookingModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');

  const filteredBookings = bookings
    .filter((b) => {
      if (selectedRoomId !== 'all' && b.roomId !== selectedRoomId) return false;
      if (selectedDept !== 'all' && b.department !== selectedDept) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchBooker = b.bookerName.toLowerCase().includes(term);
        const matchPurpose = b.purpose.toLowerCase().includes(term);
        const matchDept = b.department.toLowerCase().includes(term);
        return matchBooker || matchPurpose || matchDept;
      }
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const getRoomName = (roomId: string) => {
    return rooms.find((r) => r.id === roomId)?.name || 'ห้องประชุม';
  };

  const getRoomBadge = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room
      ? `${room.badgeBg} ${room.badgeText} ${room.borderColor}`
      : 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="space-y-5">
      
      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-[#006064]/20 dark:border-slate-800 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-md bg-[#004d40] text-white">
              <ListFilter className="w-5 h-5 text-[#80cbc4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00695c] dark:text-teal-300">
                BOOKING LOGS
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                รายการประวัติการจองห้องทั้งหมด ({filteredBookings.length} รายการ)
              </h2>
              <p className="text-xs text-slate-500">
                ค้นหา และกรองรายการจองตามห้องหรือกลุ่มสาระการเรียนรู้
              </p>
            </div>
          </div>

          {/* Quick Action */}
          <button
            onClick={onOpenBookingModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-white bg-[#004d40] hover:bg-[#00382f] rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างรายการจองใหม่</span>
          </button>
        </div>

        {/* Filter inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้จอง, วัตถุประสงค์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#004d40] focus:outline-none"
            />
          </div>

          {/* Room Filter */}
          <div>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#004d40] focus:outline-none"
            >
              <option value="all">ทุกห้องประชุม (All Rooms)</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#004d40] focus:outline-none"
            >
              <option value="all">ทุกแผนก / กลุ่มสาระฯ</option>
              {SCHOOL_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-[#006064]/20 dark:border-slate-800 overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            <p className="text-sm">ไม่พบรายการจองตามเงื่อนไขที่ระบุ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-[#004d40]/5 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                  <th className="py-3.5 px-4">วันที่ / เวลา</th>
                  <th className="py-3.5 px-4">ห้อง</th>
                  <th className="py-3.5 px-4">วัตถุประสงค์</th>
                  <th className="py-3.5 px-4">ผู้จอง / แผนก</th>
                  <th className="py-3.5 px-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-[#e0f2f1]/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Date & Time */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {formatThaiDateLong(b.date)}
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5 font-semibold">
                        <Clock className="w-3 h-3 text-[#00695c]" />
                        <span>{b.startTime} - {b.endTime} น.</span>
                      </div>
                    </td>

                    {/* Room */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-extrabold border ${getRoomBadge(b.roomId)}`}>
                        {getRoomName(b.roomId)}
                      </span>
                    </td>

                    {/* Purpose */}
                    <td className="py-3 px-4 max-w-xs">
                      <p
                        onClick={() => onSelectBooking(b)}
                        className="font-extrabold text-slate-800 dark:text-slate-100 hover:text-[#004d40] cursor-pointer line-clamp-2"
                      >
                        {b.purpose}
                      </p>
                    </td>

                    {/* Booker & Department */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {b.bookerName}
                      </div>
                      <div className="text-slate-500 text-[11px] font-medium">
                        {b.department}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onSelectBooking(b)}
                          className="px-2.5 py-1 text-xs font-bold text-[#004d40] bg-[#e0f2f1] hover:bg-[#b2dfdb] dark:bg-teal-950 dark:text-teal-300 rounded-md border border-[#004d40]/20"
                        >
                          ดูรายละเอียด
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`ยกเลิกรายการจอง "${b.purpose}"?`)) {
                              onDeleteBooking(b.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/80 rounded-md transition-colors"
                          title="ยกเลิกการจอง"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
