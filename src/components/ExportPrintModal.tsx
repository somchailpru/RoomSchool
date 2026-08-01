import React from 'react';
import {
  X,
  Printer,
  FileSpreadsheet,
  FileCode,
  Download,
  Calendar,
  CheckCircle2,
  School,
} from 'lucide-react';
import { Room, Booking } from '../types';
import { formatThaiDateLong, OPERATING_SLOTS, getBookingForSlot } from '../utils/dateUtils';

interface ExportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  bookings: Booking[];
  currentDateStr: string;
}

export const ExportPrintModal: React.FC<ExportPrintModalProps> = ({
  isOpen,
  onClose,
  rooms,
  bookings,
  currentDateStr,
}) => {
  if (!isOpen) return null;

  // Trigger browser print dialog
  const handlePrint = () => {
    window.print();
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'วันที่',
      'ห้องประชุม',
      'เวลาเริ่ม',
      'เวลาสิ้นสุด',
      'ชื่อผู้จอง',
      'แผนก/กลุ่มสาระ',
      'วัตถุประสงค์',
      'จำนวนผู้เข้าร่วม',
      'เบอร์โทรศัพท์',
    ];

    const rows = bookings.map((b) => {
      const roomName = rooms.find((r) => r.id === b.roomId)?.name || '';
      return [
        b.id,
        b.date,
        `"${roomName}"`,
        b.startTime,
        b.endTime,
        `"${b.bookerName}"`,
        `"${b.department}"`,
        `"${b.purpose}"`,
        b.attendees || '',
        `"${b.phone || ''}"`,
      ];
    });

    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Excel
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ตารางจองห้องประชุม_${currentDateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Standalone Single HTML File
  const handleDownloadSingleHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ตารางจองห้องประชุมโรงเรียน</title>
  <style>
    body { font-family: 'Sarabun', system-ui, sans-serif; background: #f8fafc; color: #1e293b; padding: 20px; line-height: 1.5; }
    .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #ccfbf1; max-width: 1000px; margin: 0 auto; }
    h1 { color: #0d9488; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; font-size: 13px; }
    th { background: #0d9488; color: white; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-weight: bold; font-size: 11px; }
    .badge-teal { background: #ccfbf1; color: #115e59; }
    .badge-cyan { background: #cffafe; color: #155e75; }
    .badge-emerald { background: #d1fae5; color: #065f46; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🏢 ระบบจองห้องประชุมและห้องโสตทัศนศึกษา โรงเรียน</h1>
    <p>ตารางการจองประจำวันที่: <strong>${formatThaiDateLong(currentDateStr)}</strong></p>
    <table>
      <thead>
        <tr>
          <th>ช่วงเวลา</th>
          ${rooms.map((r) => `<th>${r.name}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${OPERATING_SLOTS.map((slot) => {
          return `<tr>
            <td><strong>${slot.label} น.</strong></td>
            ${rooms
              .map((r) => {
                const b = getBookingForSlot(r.id, currentDateStr, slot.startTime, slot.endTime, bookings);
                if (b) {
                  return `<td style="background:#0d9488; color:white; border-radius:6px;">
                    <strong>${b.purpose}</strong><br>
                    <small>👤 ${b.bookerName} (${b.department})</small>
                  </td>`;
                }
                return `<td style="color:#10b981;">ว่าง</td>`;
              })
              .join('')}
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ระบบจองห้องประชุม_โรงเรียน.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-[#006064]/20 dark:border-slate-800 w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#004d40] text-white px-6 py-4 flex items-center justify-between border-b border-[#00382f]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-md">
              <Printer className="w-6 h-6 text-[#80cbc4]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b2dfdb]">
                EXPORT & PRINT
              </span>
              <h3 className="font-extrabold text-lg text-white">
                พิมพ์ หรือ ส่งออกข้อมูลตารางจอง
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

        {/* Options */}
        <div className="p-6 space-y-4">
          
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="w-full p-4 rounded-md border border-[#004d40]/20 bg-[#e0f2f1]/40 dark:bg-slate-800 dark:border-slate-700 hover:bg-[#e0f2f1] dark:hover:bg-slate-700 transition-all text-left flex items-start space-x-4 group"
          >
            <div className="p-3 rounded-md bg-[#004d40] text-white group-hover:scale-105 transition-transform">
              <Printer className="w-6 h-6 text-[#80cbc4]" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                1. พิมพ์ตารางจอง (Print / Save as PDF)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                เปิดหน้าต่างพิมพ์รายงานรูปแบบสวยงามสำหรับติดหน้าห้องประชุมหรือบันทึกเป็น PDF
              </p>
            </div>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="w-full p-4 rounded-md border border-emerald-200 bg-emerald-50/50 dark:bg-slate-800 dark:border-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-700 transition-all text-left flex items-start space-x-4 group"
          >
            <div className="p-3 rounded-md bg-[#00695c] text-white group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-6 h-6 text-[#a7ffeb]" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                2. ส่งออกไฟล์ CSV (Excel / Google Sheets)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                ดาวน์โหลดข้อมูลรายการจองทั้งหมดเป็นไฟล์ CSV ภาษาไทย นำไปเปิดใน Excel ได้ทันที
              </p>
            </div>
          </button>

          {/* Download Standalone Single HTML */}
          <button
            onClick={handleDownloadSingleHtml}
            className="w-full p-4 rounded-md border border-cyan-200 bg-cyan-50/50 dark:bg-slate-800 dark:border-slate-700 hover:bg-cyan-100 dark:hover:bg-slate-700 transition-all text-left flex items-start space-x-4 group"
          >
            <div className="p-3 rounded-md bg-[#006064] text-white group-hover:scale-105 transition-transform">
              <FileCode className="w-6 h-6 text-[#80deea]" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                3. ดาวน์โหลดไฟล์ HTML เดี่ยว (Single File Webpage)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                ดาวน์โหลดเว็บแอปเปจไฟล์เดียว สามารถดับเบิ้ลคลิกเปิดใช้งานบนคอมพิวเตอร์ได้เลยโดยไม่ต้องพึ่งเซิร์ฟเวอร์
              </p>
            </div>
          </button>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
