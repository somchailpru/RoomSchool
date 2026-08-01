import React, { useState } from 'react';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Calendar,
  Building2,
  PieChart,
  Users,
  Award,
} from 'lucide-react';
import { Room, Booking } from '../types';
import {
  getWeekDays,
  getISODateString,
  timeToMinutes,
  formatThaiDateShort,
} from '../utils/dateUtils';

interface WeeklyAnalyticsProps {
  rooms: Room[];
  bookings: Booking[];
  currentDateStr: string;
  setCurrentDateStr: (date: string) => void;
}

export const WeeklyAnalytics: React.FC<WeeklyAnalyticsProps> = ({
  rooms,
  bookings,
  currentDateStr,
  setCurrentDateStr,
}) => {
  const weekDays = getWeekDays(currentDateStr);
  const weekStart = weekDays[0].date;
  const weekEnd = weekDays[4].date;

  // Handle week step
  const handleStepWeek = (deltaWeeks: number) => {
    const cur = new Date(currentDateStr + 'T00:00:00');
    cur.setDate(cur.getDate() + deltaWeeks * 7);
    setCurrentDateStr(getISODateString(cur));
  };

  // Get all bookings in this Mon-Fri week
  const weekBookings = bookings.filter((b) => {
    return b.date >= weekStart && b.date <= weekEnd;
  });

  // Total operating hours per room per week = 5 days * 8 hours = 40 hours
  const MAX_WEEKLY_HOURS = 40;

  // Compute stats per room
  const roomStats = rooms.map((room) => {
    const roomBookings = weekBookings.filter((b) => b.roomId === room.id);
    
    // Total hours booked
    let totalMinutes = 0;
    roomBookings.forEach((b) => {
      const s = timeToMinutes(b.startTime);
      const e = timeToMinutes(b.endTime);
      if (e > s) totalMinutes += e - s;
    });

    const totalHours = totalMinutes / 60;
    const usagePercent = Math.min(100, Math.round((totalHours / MAX_WEEKLY_HOURS) * 100));

    return {
      room,
      totalBookings: roomBookings.length,
      totalHours,
      usagePercent,
    };
  });

  // Calculate department stats
  const deptMap: { [dept: string]: number } = {};
  weekBookings.forEach((b) => {
    const s = timeToMinutes(b.startTime);
    const e = timeToMinutes(b.endTime);
    const hrs = Math.max(0, (e - s) / 60);
    deptMap[b.department] = (deptMap[b.department] || 0) + hrs;
  });

  const sortedDeptStats = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);

  // Overall totals
  const totalSchoolHours = roomStats.reduce((acc, r) => acc + r.totalHours, 0);
  const overallCapacityHours = MAX_WEEKLY_HOURS * rooms.length; // 120 hours
  const overallPercent = Math.round((totalSchoolHours / overallCapacityHours) * 100);

  // Find top department
  const topDept = sortedDeptStats[0] ? sortedDeptStats[0][0] : 'ยังไม่มีข้อมูล';

  return (
    <div className="space-y-6">
      
      {/* Week Navigator Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-[#006064]/20 dark:border-slate-800 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-md bg-[#004d40] text-white shadow-xs">
              <BarChart3 className="w-5 h-5 text-[#80cbc4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00695c] dark:text-teal-300">
                WEEKLY UTILIZATION REPORT
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                รายงานสรุปสถิติอัตราการใช้งานประจำสัปดาห์
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                สัปดาห์ระหว่าง {formatThaiDateShort(weekStart)} - {formatThaiDateShort(weekEnd)} (คำนวณจาก 40 ชม./ห้อง/สัปดาห์)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStepWeek(-1)}
              className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-[#e0f2f1]/60 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>สัปดาห์ก่อนหน้า</span>
            </button>

            <button
              onClick={() => setCurrentDateStr(getISODateString(new Date()))}
              className="px-3 py-2 rounded-md border border-[#004d40]/20 bg-[#e0f2f1] text-[#004d40] font-bold text-xs hover:bg-[#b2dfdb]"
            >
              สัปดาห์นี้
            </button>

            <button
              onClick={() => handleStepWeek(1)}
              className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-[#e0f2f1]/60 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <span>สัปดาห์ถัดไป</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#006064]/20 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00695c]">ชั่วโมงการจองรวม</span>
            <Clock className="w-4 h-4 text-[#00695c]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalSchoolHours} <span className="text-xs font-bold text-slate-500">ชั่วโมง</span>
          </div>
          <p className="text-[11px] text-[#004d40] font-medium dark:text-teal-400 mt-1">
            จากโควตา 120 ชม./สัปดาห์ (3 ห้อง)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#006064]/20 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00695c]">อัตราการใช้งานเฉลี่ย</span>
            <TrendingUp className="w-4 h-4 text-[#00695c]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {overallPercent}%
          </div>
          <p className="text-[11px] text-[#004d40] font-medium dark:text-teal-400 mt-1">
            {overallPercent > 40 ? 'อัตราการใช้งานค่อนข้างสูง' : 'มีช่วงเวลาว่างพร้อมรองรับ'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#006064]/20 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00695c]">จำนวนรายการจอง</span>
            <Calendar className="w-4 h-4 text-[#00695c]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {weekBookings.length} <span className="text-xs font-bold text-slate-500">รายการ</span>
          </div>
          <p className="text-[11px] text-[#004d40] font-medium dark:text-teal-400 mt-1">
            ตลอดทั้ง 5 วันทำการ
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#006064]/20 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00695c]">หน่วยงานที่ใช้งานสูงสุด</span>
            <Award className="w-4 h-4 text-[#00695c]" />
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">
            {topDept}
          </div>
          <p className="text-[11px] text-[#004d40] font-medium dark:text-teal-400 mt-1">
            {sortedDeptStats[0] ? `${sortedDeptStats[0][1]} ชั่วโมงในสัปดาห์นี้` : '-'}
          </p>
        </div>

      </div>

      {/* Main Per-Room Utilization Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-[#006064]/20 dark:border-slate-800 p-5">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#00695c]" />
          <span>สรุปอัตราการใช้งานแยกตามรายห้อง (Per Room Utilization Rate)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roomStats.map(({ room, totalBookings, totalHours, usagePercent }) => {
            return (
              <div
                key={room.id}
                className={`p-5 rounded-md border ${room.borderColor} bg-slate-50/50 dark:bg-slate-800/40 relative overflow-hidden flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-extrabold border ${room.badgeBg} ${room.badgeText} ${room.borderColor}`}>
                      {room.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      ความจุ {room.capacity} คน
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-2 my-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {usagePercent}%
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      อัตราการจอง ({totalHours} / 40 ชม.)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden my-2">
                    <div
                      className="h-full bg-[#004d40] transition-all duration-500 rounded-full"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">จองทั้งหมด {totalBookings} รายการ</span>
                  <span className="font-extrabold text-[#004d40] dark:text-teal-300">
                    คงเหลือ {MAX_WEEKLY_HOURS - totalHours} ชม.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-[#006064]/20 dark:border-slate-800 p-5">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00695c]" />
          <span>อันดับการใช้งานแยกตามแผนก / กลุ่มสาระการเรียนรู้</span>
        </h3>

        {sortedDeptStats.length === 0 ? (
          <p className="text-sm font-medium text-slate-500 py-6 text-center">
            ยังไม่มีข้อมูลการจองในสัปดาห์นี้
          </p>
        ) : (
          <div className="space-y-3">
            {sortedDeptStats.map(([dept, hrs], idx) => {
              const deptPercent = Math.round((hrs / totalSchoolHours) * 100) || 0;
              return (
                <div
                  key={dept}
                  className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-md bg-[#e0f2f1] text-[#004d40] border border-[#004d40]/30 dark:bg-teal-900 dark:text-teal-200 text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {dept}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    <div className="w-32 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden hidden md:block">
                      <div
                        className="bg-[#004d40] h-full rounded-full"
                        style={{ width: `${deptPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {hrs} ชม. ({deptPercent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
