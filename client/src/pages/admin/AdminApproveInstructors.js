// import React, { useEffect, useState } from 'react';

// const AdminApproveInstructors = () => {
//   const [instructors, setInstructors] = useState([]);
//   const [modalImage, setModalImage] = useState(null); // เก็บ URL รูปที่คลิก

//   useEffect(() => {
//     fetchInstructors();
//   }, []);

//   const fetchInstructors = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/api/admin/instructors');
//       const data = await response.json();
//       setInstructors(data.instructors);
//     } catch (error) {
//       console.error('Error fetching instructors:', error);
//     }
//   };

//   const handleApprove = async (id, status) => {
//     try {
//       const response = await fetch(`http://localhost:4000/api/admin/approve-instructor/${id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status }) // true หรือ false
//       });

//       const data = await response.json();
//       alert(data.message);
//       fetchInstructors(); // รีโหลดข้อมูลหลังจากกดอนุมัติ
//     } catch (error) {
//       console.error('Approval error:', error);
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">รายการผู้สอนที่รอการอนุมัติ</h2>
//       <table className="w-full border-collapse border text-left">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">ชื่อ</th>
//             <th className="border p-2">อีเมล</th>
//             <th className="border p-2">เบอร์โทร</th>
//             <th className="border p-2">ประวัติ</th>
//             <th className="border p-2">สถานะ</th>
//             <th className="border p-2">การกระทำ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {instructors.map(instructor => (
//             <tr key={instructor.id}>
//               <td className="border p-2">{instructor.instructor_name}</td>
//               <td className="border p-2">{instructor.instructor_email}</td>
//               <td className="border p-2">{instructor.instructor_tel}</td>
//               <td className="border p-2">
//                 {instructor.instructor_history ? (
//                   <img
//                     src={instructor.instructor_history}
//                     alt={`ประวัติ ${instructor.instructor_name}`}
//                     style={{ width: '80px', cursor: 'pointer', borderRadius: '4px' }}
//                     onClick={() => setModalImage(instructor.instructor_history)}
//                   />
//                 ) : (
//                   'ไม่มีรูป'
//                 )}
//               </td>
//               <td className="border p-2">
//                 {instructor.is_approved ? '✅ อนุมัติแล้ว' : '⏳ รออนุมัติ'}
//               </td>
//               <td className="border p-2 space-x-2">
//                 <button
//                   onClick={() => handleApprove(instructor.id, true)}
//                   className="px-3 py-1 bg-green-500 text-white rounded"
//                 >
//                   อนุมัติ
//                 </button>
//                 <button
//                   onClick={() => handleApprove(instructor.id, false)}
//                   className="px-3 py-1 bg-red-500 text-white rounded"
//                 >
//                   ไม่อนุมัติ
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal แสดงรูปใหญ่ */}
//       {modalImage && (
//         <div
//           onClick={() => setModalImage(null)}
//           style={{
//             position: 'fixed',
//             top: 0, left: 0, right: 0, bottom: 0,
//             backgroundColor: 'rgba(0,0,0,0.7)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//             cursor: 'pointer'
//           }}
//         >
//           <img
//             src={modalImage}
//             alt="รูปใหญ่"
//             style={{
//               maxWidth: '90%',
//               maxHeight: '90%',
//               borderRadius: '8px',
//               boxShadow: '0 0 10px white'
//             }}
//             onClick={e => e.stopPropagation()} // คลิกที่รูปไม่ปิด modal
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminApproveInstructors;



import React, { useEffect, useState } from 'react';

const AdminApproveInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/instructors');
      const data = await response.json();
      setInstructors(data.instructors);
    } catch (error) {
      console.error('ຜິດພາດໃນການດຶງຂໍ້ມູນຜູ້ສອນ:', error);
    }
  };

  const handleApprove = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/approve-instructor/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      alert(data.message);
      fetchInstructors();
    } catch (error) {
      console.error('ການອະນຸມັດຜິດພາດ:', error);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ລາຍການຜູ້ສອນທີ່ລໍຖ້າອະນຸມັດ</h2>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700">
              <th className="border-b p-3 font-semibold">ຊື່</th>
              <th className="border-b p-3 font-semibold">ອີເມວ</th>
              <th className="border-b p-3 font-semibold">ເບີໂທ</th>
              <th className="border-b p-3 font-semibold">ປະຫວັດ</th>
              <th className="border-b p-3 font-semibold">ສະຖານະ</th>
              <th className="border-b p-3 font-semibold">ການຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor, idx) => (
              <tr key={instructor.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 border-b">{instructor.instructor_name}</td>
                <td className="p-3 border-b">{instructor.instructor_email}</td>
                <td className="p-3 border-b">{instructor.instructor_tel}</td>
                <td className="p-3 border-b">
                  {instructor.instructor_history ? (
                    <img
                      src={instructor.instructor_history}
                      alt={`ປະຫວັດ ${instructor.instructor_name}`}
                      className="w-20 h-20 object-cover rounded cursor-pointer border hover:shadow"
                      onClick={() => setModalImage(instructor.instructor_history)}
                    />
                  ) : (
                    <span className="text-gray-400">ບໍ່ມີຮູບ</span>
                  )}
                </td>
                <td className="p-3 border-b">
                  {instructor.is_approved === true ? (
                    <span className="text-green-600 font-bold flex items-center gap-1">✅ ອະນຸມັດແລ້ວ</span>
                  ) : instructor.is_approved === false ? (
                    <span className="text-red-600 font-bold flex items-center gap-1">❌ ບໍ່ອະນຸມັດ</span>
                  ) : (
                    <span className="text-yellow-600 font-bold flex items-center gap-1">⏳ ລໍຖ້າອະນຸມັດ</span>
                  )}
                </td>
                <td className="p-3 border-b space-x-2">
                  <button
                    onClick={() => handleApprove(instructor.id, true)}
                    className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded shadow transition font-semibold"
                  >
                    ອະນຸມັດ
                  </button>
                  <button
                    onClick={() => handleApprove(instructor.id, false)}
                    className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow transition font-semibold"
                  >
                    ບໍ່ອະນຸມັດ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal ສະແດງຮູບໃຫຍ່ */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 cursor-pointer"
        >
          <img
            src={modalImage}
            alt="ຮູບໃຫຍ່"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl border-4 border-white"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default AdminApproveInstructors;
