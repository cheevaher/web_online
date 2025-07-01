// import React, { useEffect, useState } from 'react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// const CourseReportPage = () => {
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     fetch('/api/reports/courses')
//       .then(res => res.json())
//       .then(data => {
//         console.log('Fetched course report:', data); // Debug
//         setCourses(data);
//       })
//       .catch(err => console.error('Error fetching course report:', err));
//   }, []);

//   const exportPDF = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text('ລາຍງານຫຼັກສູດ', 14, 22);

//     const tableColumn = [
//       "ID",
//       "ຊື່ຫຼັກສູດ",
//       "ລາຄາ (ກີບ)",
//       "ຜູ້ສ້າງ",
//       "ໝວດໝູ່",
//       "ຈຳນວນວິດີໂອ",
//       "ຈຳນວນການຊື້",
//       "ວັນທີສ້າງ"
//     ];
//     const tableRows = [];

//     courses.forEach(course => {
//       const courseData = [
//         course.id,
//         course.course_name,
//         Number(course.course_price).toFixed(2),
//         course.instructor || '-',
//         course.category || '-',
//         course.video_count || 0,
//         course.purchase_count || 0,
//         new Date(course.created_at).toLocaleDateString(),
//       ];
//       tableRows.push(courseData);
//     });

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 30,
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [63, 81, 181] }, // ສີຫົວຕາຕາລາງເປັນສີນ້ຳເງິນເຂັມ
//       alternateRowStyles: { fillColor: [240, 240, 240] }, // ແຖວສລັບສີເທາອ່ອນ
//     });

//     doc.save('course_report.pdf');
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>ລາຍງານຫຼັກສູດ</h1>

//       <button
//         onClick={exportPDF}
//         style={{
//           marginBottom: '15px',
//           backgroundColor: '#3f51b5',
//           color: 'white',
//           border: 'none',
//           padding: '10px 20px',
//           borderRadius: '5px',
//           cursor: 'pointer',
//           fontWeight: 'bold',
//           fontSize: '16px'
//         }}
//       >
//         ດາວໂຫຼດເປັນ PDF
//       </button>

//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr style={{ backgroundColor: '#f2f2f2' }}>
//             <th style={thStyle}>ID</th>
//             <th style={thStyle}>ຊື່ຫຼັກສູດ</th>
//             <th style={thStyle}>ລາຄາ (ກີບ)</th>
//             <th style={thStyle}>ຜູ້ສ້າງ</th>
//             <th style={thStyle}>ໝວດໝູ່</th>
//             <th style={thStyle}>ຈຳນວນວິດີໂອ</th>
//             <th style={thStyle}>ຈຳນວນການຊື້</th>
//             <th style={thStyle}>ວັນທີສ້າງ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {courses.map(course => (
//             <tr key={course.id} style={{ borderBottom: '1px solid #ddd' }}>
//               <td style={tdStyle}>{course.id}</td>
//               <td style={tdStyle}>{course.course_name}</td>
//               <td style={tdStyle}>{Number(course.course_price).toFixed(2)}</td>
//               <td style={tdStyle}>{course.instructor || '-'}</td>
//               <td style={tdStyle}>{course.category || '-'}</td>
//               <td style={tdStyle}>{course.video_count || 0}</td>
//               <td style={tdStyle}>{course.purchase_count || 0}</td>
//               <td style={tdStyle}>{new Date(course.created_at).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const thStyle = {
//   padding: '12px',
//   border: '1px solid #ddd',
//   textAlign: 'left',
// };

// const tdStyle = {
//   padding: '12px',
//   border: '1px solid #ddd',
// };

// export default CourseReportPage;


import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import saysetthaFont from './Saysettha-normal'; // ต้องเป็น Base64 string ของฟอนต์ Saysettha

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

  const exportPDF = () => {
    const doc = new jsPDF();

    // Load Lao font (Saysettha OT)
    doc.addFileToVFS('Saysettha.ttf', saysetthaFont);
    doc.addFont('Saysettha.ttf', 'Saysettha', 'normal');
    doc.setFont('Saysettha');

    doc.setFontSize(18);
    doc.text('ລາຍງານຫຼັກສູດ', 14, 22);

    const tableColumn = [
      "ID",
      "ຊື່ຫຼັກສູດ",
      "ລາຄາ (ກີບ)",
      "ຜູ້ສ້າງ",
      "ໝວດໝູ່",
      "ຈຳນວນວິດີໂອ",
      "ຈຳນວນການຊື້",
      "ວັນທີສ້າງ"
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

  return (
    <div className="p-5 font-lao">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">ລາຍງານຫຼັກສູດ</h1>
        <button
          onClick={exportPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          ດາວໂຫຼດເປັນ PDF
        </button>
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
