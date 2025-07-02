import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const InstructorSalesReport = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!user || !user.token) {
        setError('ບໍ່ພົບຂໍ້ມູນອາຈານທີ່ເຂົ້າລະບົບ');
        setLoading(false);
        return;
      }

      const instructorId = Number(user.id);
      if (isNaN(instructorId) || instructorId <= 0) {
        setError('ລະຫັດອາຈານບໍ່ຖືກຕ້ອງ');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/reports/instructor-sales/${instructorId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດລາຍງານ');
        }

        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center p-6">
        <p className="text-lg animate-pulse">ກຳລັງໂຫຼດລາຍງານການຂາຍ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-600">
        <p>ເກີດຂໍ້ຜິດພາດ: {error}</p>
      </div>
    );
  }

  if (!report || !report.courses || report.courses.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-lg">ທ່ານຍັງບໍ່ມີການຂາຍຄອສໃດໆ</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 border-b border-gray-300 pb-2 text-center">
        ລາຍງານການຂາຍຂອງທ່ານ
      </h1>

      {/* ລາຍໄດ້ລວມທັງໝົດ */}
      <div className="mb-8 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg p-6 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-wide">ລາຍໄດ້ລວມທັງໝົດ</span>
        <span className="text-4xl font-extrabold drop-shadow-lg">{report.totalRevenue.toLocaleString()} ກີບ</span>
      </div>

      {/* ຕາຕະລາງລາຍງານ */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-gray-700">
              <th className="px-6 py-3 text-left text-sm font-semibold">ຊື່ຄອສ</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">ລາຄາ</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">ຈຳນວນທີ່ຂາຍໄດ້</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">ລາຍໄດ້ລວມ</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">ການຂາຍລ່າສຸດ</th>
            </tr>
          </thead>
          <tbody>
            {report.courses.map((course) => (
              <tr key={course.course_id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{course.course_name}</td>
                <td className="px-6 py-4 text-center text-gray-700">{course.course_price.toLocaleString()} ກີບ</td>
                <td className="px-6 py-4 text-center text-gray-700">{course.sales_count}</td>
                <td className="px-6 py-4 text-center text-green-600 font-semibold">{course.total_revenue.toLocaleString()} ກີບ</td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {course.latest_sale ? new Date(course.latest_sale).toLocaleString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorSalesReport;
