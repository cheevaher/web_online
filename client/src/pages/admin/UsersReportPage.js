import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import saysetthaFont from './Saysettha-normal';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const UsersReportPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/reports/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('ດຶງຂໍ້ມູນຜູ້ໃຊ້ບໍ່ສຳເລັດ');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.addFileToVFS('Saysettha.ttf', saysetthaFont);
    doc.addFont('Saysettha.ttf', 'Saysettha', 'normal');
    doc.setFont('Saysettha');

    doc.setFontSize(18);
    doc.text('ລາຍງານຜູ້ໃຊ້', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`ວັນທີ: ${new Date().toLocaleDateString('lo-LA')}`, 14, 30);

    const tableColumn = [
      "#",
      "ຊື່ຜູ້ໃຊ້",
      "ອີເມວ",
      "ຈຳນວນຄອສ",
      "ລາຍຊື່ຄອສ",
      "ວັນທີລົງທະບຽນ"
    ];

    const tableRows = users.map((user, index) => [
      index + 1,
      user.username,
      user.email,
      user.courses?.length || 0,
      (user.courses?.map(c => c.title).join(', ')) || '—',
      new Date(user.registered_date).toLocaleDateString('lo-LA')
    ]);

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      styles: {
        font: 'Saysettha',
        fontSize: 10,
        halign: 'center',
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
        4: { cellWidth: 60 },
        5: { cellWidth: 25 }
      },
    });

    doc.save(`ລາຍງານຜູ້ໃຊ້_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // ฟังก์ชัน Export Excel
 const exportExcel = () => {
  const wsData = [
    [
      "#",
      "ຊື່ຜູ້ໃຊ້",
      "ອີເມວ",
      "ຈຳນວນຄອສ",
      "ລາຍຊື່ຄອສ",
      "ວັນທີລົງທະບຽນ"
    ],
    ...users.map((user, index) => [
      index + 1,
      user.username,
      user.email,
      user.courses?.length || 0,
      user.courses?.map(c => c.title).join('\n') || '—',  // ใช้ \n แทน ,
      new Date(user.registered_date).toLocaleDateString('lo-LA')
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // กำหนดความกว้างคอลัมน์ (ประมาณค่าเองตามความเหมาะสม)
  ws['!cols'] = [
    { wch: 5 },   // #
    { wch: 20 },  // ชื่อผู้ใช้
    { wch: 30 },  // อีเมล
    { wch: 10 },  // จำนวนคอร์ส
    { wch: 40 },  // รายชื่อคอร์ส (กว้างกว่า)
    { wch: 15 }   // วันที่ลงทะเบียน
  ];

  // สร้าง workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");

  // เขียนไฟล์ Excel และสร้าง Blob
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });

  saveAs(blob, `ລາຍງານຜູ້ໃຊ້_${new Date().toISOString().slice(0, 10)}.xlsx`);
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
        <button onClick={() => window.location.reload()} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded">
          ລອງໃໝ່
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ລາຍງານຜູ້ໃຊ້</h1>
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="p-3 text-center">#</th>
                <th className="p-3">ຊື່ຜູ້ໃຊ້</th>
                <th className="p-3">ອີເມວ</th>
                <th className="p-3 text-center">ຈຳນວນຄອສ</th>
                <th className="p-3">ລາຍຊື່ຄອສ</th>
                <th className="p-3 text-center">ວັນທີລົງທະບຽນ</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 font-medium">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 text-center">{user.courses?.length || 0}</td>
                    <td className="p-3">
                      {user.courses?.length ? (
                        <ul className="list-disc list-inside space-y-1">
                          {user.courses.map((c, i) => (
                            <li key={i} className="text-blue-600 font-semibold">
                              {c.title}
                            </li>
                          ))}
                        </ul>
                      ) : '—'}
                    </td>
                    <td className="p-3 text-center">{new Date(user.registered_date).toLocaleDateString('lo-LA')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນຜູ້ໃຊ້
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

export default UsersReportPage;