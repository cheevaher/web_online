// ไฟล์: CourseManagementPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CourseManagementPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setError('กรุณาเข้าสู่ระบบ');
        navigate('/login', { replace: true });
        return;
      }

      const userRole = user.role || user.user?.role;

      if (userRole?.toLowerCase() !== 'instructor') {
        setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        navigate('/', { replace: true });
        return;
      }
    }
  }, [user, isLoading, navigate]);

  const getActiveMenu = () => {
    if (location.pathname.includes('create-course')) return 'create-course';
    if (location.pathname.includes('settings')) return 'settings';
    return 'my-courses';
  };

  const activeMenu = getActiveMenu();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">เมนูผู้สอน</h2>

        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/course-management/my-courses')}
                className={`w-full text-left px-4 py-2 rounded transition ${activeMenu === 'my-courses' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                คอร์สเรียนของฉัน
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/course-management/create-course')}
                className={`w-full text-left px-4 py-2 rounded transition ${activeMenu === 'create-course' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                สร้างคอร์สเรียน
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/course-management/settings')}
                className={`w-full text-left px-4 py-2 rounded transition ${activeMenu === 'settings' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                ตั้งค่า
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <Outlet /> {/* แสดงเนื้อหา route ย่อย */}
      </div>
    </div>
  );
};

export default CourseManagementPage;
