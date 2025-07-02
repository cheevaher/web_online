import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

function SalesReportPage() {
  const [report, setReport] = useState([]);
  const [groupBy, setGroupBy] = useState('day');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReport(groupBy);
  }, [groupBy]);

  const loadReport = async (group) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/api/reports/sales?groupBy=${group}`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Failed to load report:', err);
      setError('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້ ກະລຸນາລອງໃໝ່');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatWeekRange = (start, end) => {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    const options = { month: 'short', year: 'numeric' };
    const monthYear = endDate.toLocaleDateString('lo-LA', options);

    return `${startDay} - ${endDay} ${monthYear}`;
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', { month: 'short', year: 'numeric' });
  };

  // ฟังก์ชัน Export PDF (เดิม)
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('ລາຍງານການຂາຍ', 14, 22);

    doc.setFontSize(11);
    const today = new Date().toLocaleDateString('lo-LA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`ວັນທີ່ສ້າງ: ${today}`, 14, 30);

    const tableColumn = [
      'ໄລຍະເວລາ',
      'ຊື່ຄໍສ',
      'ຊື່ຜູ້ສອນ',
      'ຈຳນວນຂາຍ (ເທື່ອ)',
      'ລາຄາຕໍ່ເທື່ອ',
      'ຍອດຂາຍລວມ',
    ];

    const tableRows = report.map((row) => [
      groupBy === 'day'
        ? formatDate(row.period_start)
        : groupBy === 'week'
          ? formatWeekRange(row.period_start, row.period_end)
          : formatMonthYear(row.period_start),
      row.course_name,
      row.instructor_name,
      row.sales_count,
      `₭${row.price_per_unit}`,
      `₭${row.total_revenue}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save('sales_report.pdf');
  };

  // ฟังก์ชัน Export Excel (ใหม่)
  const exportExcel = () => {
    // เตรียมข้อมูลสำหรับ Excel
    const excelData = report.map((row) => ({
      'ໄລຍະເວລາ': groupBy === 'day'
        ? formatDate(row.period_start)
        : groupBy === 'week'
          ? formatWeekRange(row.period_start, row.period_end)
          : formatMonthYear(row.period_start),
      'ຊື່ຄອສ': row.course_name,
      'ຊື່ຜູ້ສອນ': row.instructor_name,
      'ຈຳນວນຂາຍ (ເທື່ອ)': row.sales_count,
      'ລາຄາຕໍ່ເທື່ອ': `₭${row.price_per_unit}`,
      'ຍອດຂາຍລວມ': `₭${row.total_revenue}`,
    }));

    // สร้าง worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // สร้าง workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    // สร้างไฟล์ Excel
    const today = new Date().toLocaleDateString('lo-LA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    XLSX.writeFile(workbook, `sales_report_${today}.xlsx`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">ລາຍງານການຂາຍ</h1>
      <div className="flex justify-between mb-6 flex-wrap gap-4">
        {/* ปุ่มเลือกช่วงเวลา */}
        <div className="flex space-x-2">
          {['day', 'week', 'month'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded ${groupBy === period ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              onClick={() => setGroupBy(period)}
            >
              {period === 'day'
                ? 'ລາຍວັນ'
                : period === 'week'
                  ? 'ລາຍອາທິດ'
                  : 'ລາຍເດືອນ'}
            </button>
          ))}
        </div>

        {/* ปุ่ม export */}
        <div className="flex space-x-2">
          <button
            onClick={exportPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            ດາວໂຫຼດເປັນ PDF
          </button>

          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            ດາວໂຫຼດເປັນ Excel
          </button>
        </div>
      </div>

      {loading ? (
        <p>ກຳລັງໂຫຼດ...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ໄລຍະເວລາ</th>
              <th className="border p-2">ຊື່ຄອສ</th>
              <th className="border p-2">ຊື່ຜູ້ສອນ</th>
              <th className="border p-2">ຈຳນວນຂາຍ (ເທື່ອ)</th>
              <th className="border p-2">ລາຄາຕໍ່ເທື່ອ</th>
              <th className="border p-2">ຍອດຂາຍລວມ</th>
            </tr>
          </thead>
          <tbody>
            {report.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  ບໍ່ພົບຂໍ້ມູນ
                </td>
              </tr>
            ) : (
              report.map((row, idx) => (
                <tr key={idx}>
                  <td className="border p-2">
                    {groupBy === 'day'
                      ? formatDate(row.period_start)
                      : groupBy === 'week'
                        ? formatWeekRange(row.period_start, row.period_end)
                        : formatMonthYear(row.period_start)}
                  </td>
                  <td className="border p-2">{row.course_name}</td>
                  <td className="border p-2">{row.instructor_name}</td>
                  <td className="border p-2">{row.sales_count}</td>
                  <td className="border p-2">₭{row.price_per_unit}</td>
                  <td className="border p-2">₭{row.total_revenue}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalesReportPage;