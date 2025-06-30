import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function SalesReportPage() {
  const [report, setReport] = useState([]);
  const [groupBy, setGroupBy] = useState('day'); // ເລີ່ມຕົ້ນເປັນລາຍວັນ
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

  // ຟັງຊັນແປງວັນທີ
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

  // ຟັງຊັນ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // ຊື່ລາຍງານ
    doc.setFontSize(18);
    doc.text('ລາຍງານການຂາຍ', 14, 22);

    // ວັນທີ່ສ້າງລາຍງານ
    doc.setFontSize(11);
    const today = new Date().toLocaleDateString('lo-LA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`ວັນທີ່ສ້າງ: ${today}`, 14, 30);

    // ເຮັດຫົວຕາຕາງ
    const tableColumn = [
      'ໄລຍະເວລາ',
      'ຊື່ຄໍສ',
      'ຊື່ຜູ້ສອນ',
      'ຈຳນວນຂາຍ (ເທື່ອ)',
      'ລາຄາຕໍ່ເທື່ອ',
      'ຍອດຂາຍລວມ',
    ];

    // ເຮັດຂໍ້ມູນແຖວ
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

    // ສ້າງຕາຕາງ PDF ໂດຍ autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    // ບັນທຶກເປັນໄຟລ໌ PDF
    doc.save('sales_report.pdf');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ລາຍງານການຂາຍ</h1>
        <button
          onClick={exportPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          title="Export ລາຍງານເປັນ PDF"
        >
          Export PDF
        </button>
      </div>

      <div className="mb-4 space-x-2">
        {['day', 'week', 'month'].map((period) => (
          <button
            key={period}
            className={`px-4 py-2 rounded ${
              groupBy === period ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setGroupBy(period)}
          >
            {period === 'day' ? 'ລາຍວັນ' : period === 'week' ? 'ລາຍອາທິດ' : 'ລາຍເດືອນ'}
          </button>
        ))}
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
              <th className="border p-2">ຊື່ຄໍສ</th>
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
