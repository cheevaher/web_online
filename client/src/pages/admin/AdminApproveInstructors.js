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
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">ລາຍການຜູ້ສອນທີ່ລໍຖ້າອະນຸມັດ</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700 text-sm md:text-base">
              <th className="border-b p-3 font-semibold text-left">ຊື່</th>
              <th className="border-b p-3 font-semibold text-left">ອີເມວ</th>
              <th className="border-b p-3 font-semibold text-left">ເບີໂທ</th>
              <th className="border-b p-3 font-semibold text-left">ປະຫວັດ</th>
              <th className="border-b p-3 font-semibold text-left">ສະຖານະ</th>
              <th className="border-b p-3 font-semibold text-left">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor, idx) => (
              <tr key={instructor.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 border-b text-sm md:text-base">{instructor.instructor_name}</td>
                <td className="p-3 border-b text-sm md:text-base">{instructor.instructor_email}</td>
                <td className="p-3 border-b text-sm md:text-base">{instructor.instructor_tel}</td>
                <td className="p-3 border-b">
                  {instructor.instructor_history ? (
                    <img
                      src={instructor.instructor_history}
                      alt={`ປະຫວັດ ${instructor.instructor_name}`}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded cursor-pointer border hover:shadow"
                      onClick={() => setModalImage(instructor.instructor_history)}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">ບໍ່ມີຮູບ</span>
                  )}
                </td>
                <td className="p-3 border-b">
                  {(() => {
                    const statusMap = {
                      true: {
                        text: '✅ ອະນຸມັດແລ້ວ',
                        color: 'text-green-600',
                      },
                      false: {
                        text: '❌ ບໍ່ອະນຸມັດ',
                        color: 'text-red-600',
                      },
                      null: {
                        text: '⏳ ລໍຖ້າອະນຸມັດ',
                        color: 'text-yellow-600',
                      },
                    };

                    const statusKey = instructor.is_approved === true
                      ? 'true'
                      : instructor.is_approved === false
                        ? 'false'
                        : 'null';

                    const { text, color } = statusMap[statusKey];

                    return (
                      <span className={`${color} font-bold flex items-center gap-1 text-sm md:text-base`}>
                        {text}
                      </span>
                    );
                  })()}
                </td>
                <td className="p-3 border-b space-x-2">
                  <button
                    onClick={() => handleApprove(instructor.id, true)}
                    className="px-3 py-1 text-xs md:text-sm bg-green-500 hover:bg-green-600 text-white rounded shadow transition font-semibold"
                  >
                    ອະນຸມັດ
                  </button>
                  <button
                    onClick={() => handleApprove(instructor.id, false)}
                    className="px-3 py-1 text-xs md:text-sm bg-red-500 hover:bg-red-600 text-white rounded shadow transition font-semibold"
                  >
                    ບໍ່ອະນຸມັດ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: responsive image preview */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 cursor-pointer px-4"
        >
          <img
            src={modalImage}
            alt="ຮູບໃຫຍ່"
            className="w-full max-w-[500px] max-h-[80vh] rounded-lg shadow-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default AdminApproveInstructors;
