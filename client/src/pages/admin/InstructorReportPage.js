// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import saysetthaFont from './Saysettha-normal';

// const InstructorReportPage = () => {
//   const [instructors, setInstructors] = useState([]);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   useEffect(() => {
//     const fetchInstructors = async () => {
//       try {
//         const res = await axios.get('/api/admin/instructor-report');
//         setInstructors(res.data);
//       } catch (err) {
//         console.error('Failed to fetch instructors:', err);
//         setError('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນຜູ້ສອນໄດ້');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInstructors();
//   }, []);

//   const toggleCourses = async (instructorId) => {
//     if (expandedRows[instructorId]) {
//       setExpandedRows(prev => ({ ...prev, [instructorId]: undefined }));
//       return;
//     }

//     setExpandedRows(prev => ({ ...prev, [instructorId]: null }));

//     try {
//       const res = await axios.get(`/api/admin/instructor-courses/${instructorId}`);
//       setExpandedRows(prev => ({
//         ...prev,
//         [instructorId]: Array.isArray(res.data) ? res.data : []
//       }));
//     } catch (err) {
//       console.error(`Failed to fetch courses for instructor ${instructorId}:`, err);
//       setExpandedRows(prev => ({ ...prev, [instructorId]: [] }));
//     }
//   };

//   const handleDelete = async (courseId) => {
//     if (!window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຫຼັກສູດນີ້?')) return;

//     try {
//       const response = await fetch(`http://localhost:4000/api/courses/${courseId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete course');
//       }

//       setExpandedRows(prev => {
//         const updated = { ...prev };
//         for (const key in updated) {
//           if (Array.isArray(updated[key])) {
//             updated[key] = updated[key].filter(c => c.id !== courseId);
//           }
//         }
//         return updated;
//       });
//     } catch (error) {
//       console.error('ລຶບຫຼັກສູດບໍ່ສຳເລັດ:', error.message);
//       alert('ເກີດຂໍ້ຜິດພາດໃນການລຶບຫຼັກສູດ');
//     }
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: 'a4'
//     });

//     doc.addFileToVFS('Saysettha.ttf', saysetthaFont);
//     doc.addFont('Saysettha.ttf', 'Saysettha', 'normal');
//     doc.setFont('Saysettha');

//     doc.setFontSize(18);
//     doc.setTextColor(0, 0, 0);
//     doc.text('ລາຍງານຜູ້ສອນ', 105, 20, { align: 'center' });

//     doc.setFontSize(12);
//     doc.text(`ວັນທີ: ${new Date().toLocaleDateString('lo-LA')}`, 14, 30);

//     const tableColumn = [
//       "#", 
//       "ຊື່ຜູ້ສອນ", 
//       "ອີເມວ", 
//       "ເບີໂທ", 
//       "ຈຳນວນຫຼັກສູດ", 
//       "ລາຍໄດ້ລວມ (₭)", 
//       "ວັນທີລົງທະບຽນ"
//     ];

//     const tableRows = instructors.map((ins, index) => [
//       index + 1,
//       ins.instructor_name,
//       ins.instructor_email,
//       ins.instructor_tel || "-",
//       ins.total_courses,
//       new Intl.NumberFormat('lo-LA').format(ins.total_earnings || 0),
//       new Date(ins.created_at).toLocaleDateString('lo-LA')
//     ]);

//     autoTable(doc, {
//       startY: 40,
//       head: [tableColumn],
//       body: tableRows,
//       styles: {
//         font: 'Saysettha',
//         fontSize: 10,
//         cellPadding: 3,
//         halign: 'center',
//         valign: 'middle'
//       },
//       headStyles: {
//         fillColor: [41, 128, 185],
//         textColor: [255, 255, 255],
//         fontStyle: 'bold'
//       },
//       alternateRowStyles: {
//         fillColor: [245, 245, 245]
//       },
//       columnStyles: {
//         0: { cellWidth: 10 },
//         1: { cellWidth: 30 },
//         2: { cellWidth: 40 },
//         3: { cellWidth: 25 },
//         4: { cellWidth: 25 },
//         5: { cellWidth: 25 },
//         6: { cellWidth: 25 }
//       },
//       margin: { top: 40 }
//     });

//     doc.setFontSize(10);
//     doc.setTextColor(150);
//     doc.text('ສະບັບລົງວັນທີ: ' + new Date().toLocaleDateString('lo-LA'), 14, doc.internal.pageSize.height - 10);

//     doc.save(`ລາຍງານຜູ້ສອນ_${new Date().toISOString().slice(0, 10)}.pdf`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-red-500 text-center">
//         {error}
//         <button 
//           onClick={() => window.location.reload()}
//           className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
//         >
//           ລອງໃໝ່
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">ລາຍງານຜູ້ສອນ</h1>
//         <button
//           onClick={exportPDF}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//           </svg>
//           ດາວໂຫຼດ PDF
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left text-gray-700">
//             <thead className="bg-gray-100 text-gray-800">
//               <tr>
//                 <th className="p-3 text-center">#</th>
//                 <th className="p-3">ຊື່ຜູ້ສອນ</th>
//                 <th className="p-3">ອີເມວ</th>
//                 <th className="p-3">ເບີໂທ</th>
//                 <th className="p-3 text-center">ຈຳນວນຫຼັກສູດ</th>
//                 <th className="p-3 text-right">ລາຍໄດ້ລວມ (₭)</th>
//                 <th className="p-3 text-center">ວັນທີລົງທະບຽນ</th>
//                 <th className="p-3 text-center">ຈັດການ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {instructors.length > 0 ? (
//                 instructors.map((ins, index) => (
//                   <React.Fragment key={ins.id}>
//                     <tr className="border-b hover:bg-gray-50">
//                       <td className="p-3 text-center">{index + 1}</td>
//                       <td className="p-3 font-medium">{ins.instructor_name}</td>
//                       <td className="p-3">{ins.instructor_email}</td>
//                       <td className="p-3">{ins.instructor_tel || '-'}</td>
//                       <td className="p-3 text-center">{ins.total_courses}</td>
//                       <td className="p-3 text-right">
//                         {new Intl.NumberFormat('lo-LA').format(ins.total_earnings || 0)}
//                       </td>
//                       <td className="p-3 text-center">
//                         {new Date(ins.created_at).toLocaleDateString('lo-LA')}
//                       </td>
//                       <td className="p-3 text-center">
//                         <button
//                           onClick={() => toggleCourses(ins.id)}
//                           className="text-blue-600 hover:text-blue-800 font-medium"
//                         >
//                           {expandedRows[ins.id] ? 'ປິດ' : 'ເບິ່ງຫຼັກສູດ'}
//                         </button>
//                       </td>
//                     </tr>

//                     {expandedRows[ins.id] !== undefined && (
//                       <tr>
//                         <td colSpan="8" className="p-4 bg-gray-50">
//                           {expandedRows[ins.id] === null ? (
//                             <div className="flex justify-center py-4">
//                               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//                             </div>
//                           ) : expandedRows[ins.id].length === 0 ? (
//                             <p className="text-center text-gray-500 py-4">ບໍ່ມີຫຼັກສູດ</p>
//                           ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                               {expandedRows[ins.id].map((course) => (
//                                 <div key={course.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
//                                   <div className="relative h-40 bg-gray-200">
//                                     <img
//                                       src={course.course_image || 'https://via.placeholder.com/400x200.png?text=No+Image'}
//                                       alt={course.course_name}
//                                       className="absolute inset-0 w-full h-full object-cover"
//                                     />
//                                   </div>
//                                   <div className="p-4">
//                                     <h3 className="font-bold text-lg mb-2">{course.course_name}</h3>
//                                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                                       {course.course_description || 'ບໍ່ມີຄຳອະທິບາຍ'}
//                                     </p>
//                                     <div className="flex justify-between items-center mb-3">
//                                       <span className="text-sm bg-gray-100 px-2 py-1 rounded">
//                                         {course.category_name || 'ບໍ່ມີປະເພດ'}
//                                       </span>
//                                       <span className="font-bold text-blue-600">
//                                         {course.course_price > 0 ? 
//                                           `${new Intl.NumberFormat('lo-LA').format(course.course_price)} ₭` : 
//                                           'ຟຣີ'}
//                                       </span>
//                                     </div>
//                                     <div className="flex space-x-2">
//                                       <button
//                                         onClick={() => navigate(`/learn/${course.id}`)}
//                                         className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
//                                       >
//                                         ເບິ່ງບົດຮຽນ
//                                       </button>
//                                       <button
//                                         onClick={() => handleDelete(course.id)}
//                                         className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
//                                       >
//                                         ລຶບ
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="p-4 text-center text-gray-500">
//                     ບໍ່ມີຂໍ້ມູນຜູ້ສອນ
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InstructorReportPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import saysetthaFont from './Saysettha-normal';

const InstructorReportPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get('/api/admin/instructor-report');
        setInstructors(res.data);
      } catch (err) {
        console.error('Failed to fetch instructors:', err);
        setError('Failed to load instructor data');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const toggleCourses = async (instructorId) => {
    if (expandedRows[instructorId]) {
      setExpandedRows(prev => ({ ...prev, [instructorId]: undefined }));
      return;
    }

    setExpandedRows(prev => ({ ...prev, [instructorId]: null }));

    try {
      const res = await axios.get(`/api/admin/instructor-courses/${instructorId}`);
      setExpandedRows(prev => ({
        ...prev,
        [instructorId]: Array.isArray(res.data) ? res.data : []
      }));
    } catch (err) {
      console.error(`Failed to fetch courses for instructor ${instructorId}:`, err);
      setExpandedRows(prev => ({ ...prev, [instructorId]: [] }));
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຫຼັກສູດນີ້?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setExpandedRows(prev => {
        const updated = { ...prev };
        for (const key in updated) {
          if (Array.isArray(updated[key])) {
            updated[key] = updated[key].filter(c => c.id !== courseId);
          }
        }
        return updated;
      });
    } catch (error) {
      console.error('ລຶບຫຼັກສູດບໍ່ສຳເລັດ:', error.message);
      alert('ເກີດຂໍ້ຜິດພາດໃນການລຶບຫຼັກສູດ');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add and set Lao font
    doc.addFileToVFS('Saysettha.ttf', saysetthaFont);
    doc.addFont('Saysettha.ttf', 'Saysettha', 'normal');
    doc.setFont('Saysettha');

    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('ລາຍງານຜູ້ສອນ', 105, 20, { align: 'center' });

    // Date
    doc.setFontSize(12);
    doc.text(`ວັນທີ: ${new Date().toLocaleDateString('lo-LA')}`, 14, 30);

    // Table data
    const tableColumn = [
      "#",
      "ຊື່ຜູ້ສອນ",
      "ອີເມວ",
      "ເບີໂທ",
      "ຈຳນວນຫຼັກສູດ",
      "ລາຍໄດ້ລວມ (₭)",
      "ວັນທີລົງທະບຽນ"
    ];

    const tableRows = instructors.map((ins, index) => [
      index + 1,
      ins.instructor_name,
      ins.instructor_email,
      ins.instructor_tel || "-",
      ins.total_courses,
      new Intl.NumberFormat('lo-LA').format(ins.total_earnings || 0),
      new Date(ins.created_at).toLocaleDateString('lo-LA')
    ]);

    // Generate table
    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      styles: {
        font: 'Saysettha',
        fontSize: 10,
        cellPadding: 3,
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 }
      },
      margin: { top: 40 }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('ສະບັບລົງວັນທີ: ' + new Date().toLocaleDateString('lo-LA'), 14, doc.internal.pageSize.height - 10);

    doc.save(`ລາຍງານຜູ້ສອນ_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          ລອງໃໝ່
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ລາຍງານຜູ້ສອນ</h1>
        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          ດາວໂຫຼດເປັນ PDF
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="p-3 text-center">#</th>
                <th className="p-3">ຊື່ຜູ້ສອນ</th>
                <th className="p-3">ອີເມວ</th>
                <th className="p-3">ເບີໂທ</th>
                <th className="p-3 text-center">ຈຳນວນຫຼັກສູດ</th>
                <th className="p-3 text-right">ລາຍໄດ້ລວມ (₭)</th>
                <th className="p-3 text-center">ວັນທີລົງທະບຽນ</th>
                <th className="p-3 text-center">ຈັດການ</th>
              </tr>
            </thead>
            <tbody>
              {instructors.length > 0 ? (
                instructors.map((ins, index) => (
                  <React.Fragment key={ins.id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 text-center">{index + 1}</td>
                      <td className="p-3 font-medium">{ins.instructor_name}</td>
                      <td className="p-3">{ins.instructor_email}</td>
                      <td className="p-3">{ins.instructor_tel || '-'}</td>
                      <td className="p-3 text-center">{ins.total_courses}</td>
                      <td className="p-3 text-right">
                        {new Intl.NumberFormat('lo-LA').format(ins.total_earnings || 0)}
                      </td>
                      <td className="p-3 text-center">
                        {new Date(ins.created_at).toLocaleDateString('lo-LA')}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleCourses(ins.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {expandedRows[ins.id] ? 'ປິດ' : 'ເບິ່ງຫຼັກສູດ'}
                        </button>
                      </td>
                    </tr>

                    {expandedRows[ins.id] !== undefined && (
                      <tr>
                        <td colSpan="8" className="p-4 bg-gray-50">
                          {expandedRows[ins.id] === null ? (
                            <div className="flex justify-center py-4">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                          ) : expandedRows[ins.id].length === 0 ? (
                            <p className="text-center text-gray-500 py-4">ບໍ່ມີຫຼັກສູດ</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {expandedRows[ins.id].map((course) => (
                                <div key={course.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                  <div className="relative h-40 bg-gray-200">
                                    <img
                                      src={course.course_image || 'https://via.placeholder.com/400x200.png?text=No+Image'}
                                      alt={course.course_name}
                                      className="absolute inset-0 w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{course.course_name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                      {course.course_description || 'ບໍ່ມີຄຳອະທິບາຍ'}
                                    </p>
                                    <div className="flex justify-between items-center mb-3">
                                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                        {course.category_name || 'ບໍ່ມີປະເພດ'}
                                      </span>
                                      <span className="font-bold text-blue-600">
                                        {course.course_price > 0 ?
                                          `${new Intl.NumberFormat('lo-LA').format(course.course_price)} ₭` :
                                          'ຟຣີ'}
                                      </span>
                                    </div>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => navigate(`/learn/${course.id}`)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
                                      >
                                        ເບິ່ງບົດຮຽນ
                                      </button>
                                      <button
                                        onClick={() => handleDelete(course.id)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                                      >
                                        ລຶບ
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນຜູ້ສອນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorReportPage;