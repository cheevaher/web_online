import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UsersReportPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/reports/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("ລາຍງານຜູ້ໃຊ້", 14, 15);

    const tableColumn = [
      "ID ຜູ້ໃຊ້",
      "ຊື່ຜູ້ໃຊ້",
      "ອີເມວ",
      "ຈຳນວນຫຼັກສູດທີ່ຊື້",
      "ຊື່ຄໍສທີ່ຊື້",
      "ວັນທີລົງທະບຽນ"
    ];
    const tableRows = [];

    users.forEach(user => {
      const courseTitles = user.courses?.map(c => `+ ${c.title}`).join('\n') || '—';
      const userData = [
        user.id,
        user.username,
        user.email,
        user.courses?.length || 0,
        courseTitles,
        new Date(user.registered_date).toLocaleDateString('lo-LA')
      ];
      tableRows.push(userData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: {
        4: { cellWidth: 60 }, // ປັບຄວາມກວ້າງຄໍລັມນຊື່ຄໍສໃຫ້ພໍດີ
      }
    });
    doc.save("users_report.pdf");
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    fontFamily: 'Arial, sans-serif',
  };

  const thStyle = {
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
    padding: '12px',
    border: '1px solid #ddd',
  };

  const tdStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    verticalAlign: 'top',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ລາຍງານຜູ້ໃຊ້</h1>
      <button
        onClick={exportPDF}
        style={{
          padding: '10px 15px',
          marginBottom: '20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        Export ເປັນ PDF
      </button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID ຜູ້ໃຊ້</th>
            <th style={thStyle}>ຊື່ຜູ້ໃຊ້</th>
            <th style={thStyle}>ອີເມວ</th>
            <th style={thStyle}>ຈຳນວນຫຼັກສູດທີ່ຊື້</th>
            <th style={thStyle}>ຊື່ຄໍສທີ່ຊື້</th>
            <th style={thStyle}>ວັນທີລົງທະບຽນ</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={tdStyle}>{u.id}</td>
              <td style={tdStyle}>{u.username}</td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.courses?.length || 0}</td>
              <td style={tdStyle}>
                {u.courses?.length ? (
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {u.courses.map((c, idx) => (
                      <li key={idx} style={{ color: '#007bff', fontWeight: 'bold' }}>
                        + {c.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>—</span>
                )}
              </td>
              <td style={tdStyle}>{new Date(u.registered_date).toLocaleDateString('lo-LA')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersReportPage;
