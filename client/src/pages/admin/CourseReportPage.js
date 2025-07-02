import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import saysetthaFont from './Saysettha-normal'; // Base64 ของฟอนต์ลาว

const CourseReportPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/api/reports/courses')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched course report:', data);
        setCourses(data);
      })
      .catch(err => console.error('Error fetching course report:', err));
  }, []);

  // 🔵 Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.addFileToVFS('Saysettha.ttf', saysetthaFont);
    doc.addFont('Saysettha.ttf', 'Saysettha', 'normal');
    doc.setFont('Saysettha');
    doc.setFontSize(18);
    doc.text('ລາຍງານຫຼັກສູດ', 14, 22);

    const tableColumn = [
      "ID", "ຊື່ຫຼັກສູດ", "ລາຄາ (ກີບ)", "ຜູ້ສ້າງ",
      "ໝວດໝູ່", "ຈຳນວນວິດີໂອ", "ຈຳນວນການຊື້", "ວັນທີສ້າງ"
    ];

    const tableRows = courses.map(course => [
      course.id,
      course.course_name,
      Number(course.course_price).toFixed(2),
      course.instructor || '-',
      course.category || '-',
      course.video_count || 0,
      course.purchase_count || 0,
      new Date(course.created_at).toLocaleDateString('lo-LA')
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        font: 'Saysettha',
        fontSize: 10
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 30 }
    });

    doc.save(`ລາຍງານຫຼັກສູດ_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // 🟢 Export Excel
  const exportExcel = () => {
    const worksheetData = courses.map(course => ({
      ID: course.id,
      'ຊື່ຫຼັກສູດ': course.course_name,
      'ລາຄາ (ກີບ)': Number(course.course_price).toFixed(2),
      'ຜູ້ສ້າງ': course.instructor || '-',
      'ໝວດໝູ່': course.category || '-',
      'ຈຳນວນວິດີໂອ': course.video_count || 0,
      'ຈຳນວນການຊື້': course.purchase_count || 0,
      'ວັນທີສ້າງ': new Date(course.created_at).toLocaleDateString('lo-LA')
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Course Report');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `ລາຍງານຫຼັກສູດ_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="p-5 font-lao">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ລາຍງານຜູ້ຄອສ</h1>
        <div className="flex space-x-2">
          <button
            onClick={exportPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            ດາວໂຫຼດເປັນ PDF
          </button>

          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            ດາວໂຫຼດເປັນ Excel
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>ຊື່ຫຼັກສູດ</th>
            <th style={thStyle}>ລາຄາ (ກີບ)</th>
            <th style={thStyle}>ຜູ້ສ້າງ</th>
            <th style={thStyle}>ໝວດໝູ່</th>
            <th style={thStyle}>ຈຳນວນວິດີໂອ</th>
            <th style={thStyle}>ຈຳນວນການຊື້</th>
            <th style={thStyle}>ວັນທີສ້າງ</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}>{course.id}</td>
              <td style={tdStyle}>{course.course_name}</td>
              <td style={tdStyle}>{Number(course.course_price).toFixed(2)}</td>
              <td style={tdStyle}>{course.instructor || '-'}</td>
              <td style={tdStyle}>{course.category || '-'}</td>
              <td style={tdStyle}>{course.video_count || 0}</td>
              <td style={tdStyle}>{course.purchase_count || 0}</td>
              <td style={tdStyle}>{new Date(course.created_at).toLocaleDateString('lo-LA')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  textAlign: 'left',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '12px',
  border: '1px solid #ddd',
};

export default CourseReportPage;