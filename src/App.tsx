import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailyView } from './components/DailyView';
import { WeeklyAnalytics } from './components/WeeklyAnalytics';
import { AllBookingsTable } from './components/AllBookingsTable';
import { BookingModal } from './components/BookingModal';
import { BookingDetailModal } from './components/BookingDetailModal';
import { ExportPrintModal } from './components/ExportPrintModal';

import { ROOMS } from './data/rooms';
import { getInitialBookings } from './data/initialBookings';
import { Booking } from './types';
import { getInitialDate, formatThaiDateLong, OPERATING_SLOTS, getBookingForSlot } from './utils/dateUtils';
import { School, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'all'>('daily');
  const [currentDateStr, setCurrentDateStr] = useState<string>(getInitialDate());

  // Load bookings from localStorage or initial seed
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('school_room_bookings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Failed to load local bookings:', err);
    }
    return getInitialBookings();
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('school_room_bookings_v1', JSON.stringify(bookings));
    } catch (err) {
      console.error('Failed to save bookings:', err);
    }
  }, [bookings]);

  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPreset, setBookingPreset] = useState<{
    roomId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  }>({});

  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Handlers
  const handleOpenBookingModal = () => {
    setBookingPreset({
      date: currentDateStr,
      startTime: '09:00',
      endTime: '10:00',
    });
    setIsBookingModalOpen(true);
  };

  const handleSelectVacantSlot = (roomId: string, startTime: string, endTime: string) => {
    setBookingPreset({
      roomId,
      date: currentDateStr,
      startTime,
      endTime,
    });
    setIsBookingModalOpen(true);
  };

  const handleSaveBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `book-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const handleResetSampleData = () => {
    if (window.confirm('ต้องการรีเซ็ตข้อมูลการจองกลับเป็นข้อมูลตัวอย่างตั้งต้นหรือไม่?')) {
      const initial = getInitialBookings();
      setBookings(initial);
      localStorage.setItem('school_room_bookings_v1', JSON.stringify(initial));
    }
  };

  // Compute today's bookings count
  const todayStr = getInitialDate();
  const todayBookingsCount = bookings.filter((b) => b.date === currentDateStr).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        todayBookingsCount={todayBookingsCount}
        rooms={ROOMS}
        bookings={bookings}
        currentDateStr={currentDateStr}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'daily' && (
          <DailyView
            rooms={ROOMS}
            bookings={bookings}
            currentDateStr={currentDateStr}
            setCurrentDateStr={setCurrentDateStr}
            onSelectVacantSlot={handleSelectVacantSlot}
            onSelectBooking={(booking) => setSelectedBookingForDetail(booking)}
            onOpenBookingModal={handleOpenBookingModal}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyAnalytics
            rooms={ROOMS}
            bookings={bookings}
            currentDateStr={currentDateStr}
            setCurrentDateStr={setCurrentDateStr}
          />
        )}

        {activeTab === 'all' && (
          <AllBookingsTable
            rooms={ROOMS}
            bookings={bookings}
            onSelectBooking={(booking) => setSelectedBookingForDetail(booking)}
            onDeleteBooking={handleDeleteBooking}
            onOpenBookingModal={handleOpenBookingModal}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-teal-100 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <School className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              ระบบจองห้องประชุมและห้องโสตทัศนศึกษา โรงเรียน
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleResetSampleData}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-teal-600 transition-colors"
              title="คืนค่าข้อมูลตัวอย่าง"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>รีเซ็ตข้อมูลตัวอย่าง</span>
            </button>
            <span>•</span>
            <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ระบบตรวจสอบการชนเวลาอัตโนมัติ
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        rooms={ROOMS}
        bookings={bookings}
        initialRoomId={bookingPreset.roomId}
        initialDate={bookingPreset.date}
        initialStartTime={bookingPreset.startTime}
        initialEndTime={bookingPreset.endTime}
        onSaveBooking={handleSaveBooking}
      />

      <BookingDetailModal
        booking={selectedBookingForDetail}
        rooms={ROOMS}
        onClose={() => setSelectedBookingForDetail(null)}
        onDeleteBooking={handleDeleteBooking}
      />

      <ExportPrintModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        rooms={ROOMS}
        bookings={bookings}
        currentDateStr={currentDateStr}
      />

      {/* Print-Only Report Layout */}
      <div className="print-only p-8 text-black bg-white">
        <div className="text-center border-b-2 border-teal-600 pb-4 mb-6">
          <h1 className="text-2xl font-bold">โรงเรียน - ตารางการใช้ห้องประชุมและห้องโสตทัศนศึกษา</h1>
          <p className="text-sm text-slate-600 mt-1">
            ประจำ{formatThaiDateLong(currentDateStr)} (เวลาทำการ 08.00 - 16.00 น.)
          </p>
        </div>

        <table className="w-full border-collapse border border-slate-300 text-sm">
          <thead>
            <tr className="bg-teal-700 text-white">
              <th className="border border-slate-300 p-2 text-left w-36">ช่วงเวลา</th>
              {ROOMS.map((r) => (
                <th key={r.id} className="border border-slate-300 p-2 text-left">
                  {r.name} (จุ {r.capacity} คน)
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OPERATING_SLOTS.map((slot) => (
              <tr key={slot.label} className="border-b border-slate-200">
                <td className="border border-slate-300 p-2 font-bold bg-slate-50">
                  {slot.label} น.
                </td>
                {ROOMS.map((room) => {
                  const b = getBookingForSlot(room.id, currentDateStr, slot.startTime, slot.endTime, bookings);
                  if (b) {
                    return (
                      <td key={room.id} className="border border-slate-300 p-2 bg-teal-50">
                        <strong className="text-teal-900 block">{b.purpose}</strong>
                        <div className="text-xs text-slate-700 mt-1">
                          ผู้จอง: {b.bookerName} ({b.department})
                        </div>
                      </td>
                    );
                  }
                  return (
                    <td key={room.id} className="border border-slate-300 p-2 text-emerald-700 italic">
                      ว่าง
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 pt-8 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <p>ลงชื่อ..........................................................ผู้จัดทำรายงาน</p>
            <p className="mt-1">(เจ้าหน้าที่ดูแลห้องประชุม)</p>
          </div>
          <div>
            <p>ลงชื่อ..........................................................ผู้รับรอง</p>
            <p className="mt-1">(ฝ่ายบริหารงานทั่วไป/ผู้อำนวยการโรงเรียน)</p>
          </div>
        </div>
      </div>

    </div>
  );
}
