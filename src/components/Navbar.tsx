import React from 'react';
import { Calendar, BarChart3, ListFilter, Plus, Printer, School, CheckCircle2, Clock } from 'lucide-react';
import { Room, Booking } from '../types';

interface NavbarProps {
  activeTab: 'daily' | 'weekly' | 'all';
  setActiveTab: (tab: 'daily' | 'weekly' | 'all') => void;
  onOpenBookingModal: () => void;
  onOpenExportModal: () => void;
  todayBookingsCount: number;
  rooms: Room[];
  bookings: Booking[];
  currentDateStr: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBookingModal,
  onOpenExportModal,
  todayBookingsCount,
  currentDateStr,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-[#006064]/20 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
      {/* Top Brand & Editorial Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Logo & Editorial Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-md bg-[#004d40] text-white flex items-center justify-center shadow-sm ring-1 ring-[#006064]/30">
              <School className="w-6 h-6 text-[#80cbc4]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold tracking-widest text-[#00695c] dark:text-[#4db6ac] uppercase">
                  RESOURCE MANAGEMENT SYSTEM
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#e0f2f1] text-[#004d40] dark:bg-teal-950 dark:text-teal-300 border border-[#004d40]/20">
                  โรงเรียน
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                ระบบจองห้องประชุมและห้องโสตทัศนศึกษา
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span>วันจันทร์ - วันศุกร์ เวลา 08:00 - 16:00 น.</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-[#00695c] font-semibold dark:text-teal-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00897b]" /> ตรวจสอบการชนเวลาอัตโนมัติ
                </span>
              </p>
            </div>
          </div>

          {/* Quick Info & Action Buttons */}
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#e0f2f1]/80 dark:bg-slate-800 text-[#004d40] dark:text-teal-300 text-xs font-semibold border border-[#004d40]/15 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5 text-[#00695c]" />
              <span>รายการจองวันที่ ({currentDateStr}): <strong className="text-[#004d40] dark:text-teal-200">{todayBookingsCount}</strong> รายการ</span>
            </div>

            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors border border-slate-200 dark:border-slate-700"
              title="พิมพ์ตาราง หรือ ส่งออกข้อมูล"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">พิมพ์ / Export</span>
            </button>

            <button
              onClick={onOpenBookingModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#004d40] hover:bg-[#00382f] active:bg-[#002820] rounded-md transition-all shadow-md shadow-[#004d40]/20 hover:shadow-[#004d40]/30 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>จองห้องประชุม</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 border-t border-slate-100 dark:border-slate-800 mt-3 pt-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('daily')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'daily'
                ? 'bg-[#004d40] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-[#e0f2f1]/50 dark:hover:bg-slate-800 hover:text-[#004d40]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>ตารางประจำวัน (Daily View)</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'weekly'
                ? 'bg-[#004d40] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-[#e0f2f1]/50 dark:hover:bg-slate-800 hover:text-[#004d40]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>สถิติประจำสัปดาห์ (Weekly Stats)</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#004d40] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-[#e0f2f1]/50 dark:hover:bg-slate-800 hover:text-[#004d40]'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>รายการจองทั้งหมด (All Bookings)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
