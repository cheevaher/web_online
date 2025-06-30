import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CourseReportPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/api/reports/courses')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched course report:', data); // Debug
        setCourses(data);
      })
      .catch(err => console.error('Error fetching course report:', err));
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('ລາຍງານຫຼັກສູດ', 14, 22);

    const tableColumn = [
      "ID",
      "ຊື່ຫຼັກສູດ",
      "ລາຄາ (ບາດ)",
      "ຜູ້ສ້າງ",
      "ໝວດໝູ່",
      "ຈຳນວນວິດີໂອ",
      "ຈຳນວນການຊື້",
      "ວັນທີສ້າງ"
    ];
    const tableRows = [];

    courses.forEach(course => {
      const courseData = [
        course.id,
        course.course_name,
        Number(course.course_price).toFixed(2),
        course.instructor || '-',
        course.category || '-',
        course.video_count || 0,
        course.purchase_count || 0,
        new Date(course.created_at).toLocaleDateString(),
      ];
      tableRows.push(courseData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [63, 81, 181] }, // ສີຫົວຕາຕາລາງເປັນສີນ້ຳເງິນເຂັມ
      alternateRowStyles: { fillColor: [240, 240, 240] }, // ແຖວສລັບສີເທາອ່ອນ
    });

    doc.save('course_report.pdf');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ລາຍງານຫຼັກສູດ</h1>

      <button
        onClick={exportPDF}
        style={{
          marginBottom: '15px',
          backgroundColor: '#3f51b5',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        Export ເປັນ PDF
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>ຊື່ຫຼັກສູດ</th>
            <th style={thStyle}>ລາຄາ (ບາດ)</th>
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
              <td style={tdStyle}>{new Date(course.created_at).toLocaleDateString()}</td>
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
};

const tdStyle = {
  padding: '12px',
  border: '1px solid #ddd',
};

export default CourseReportPage;
