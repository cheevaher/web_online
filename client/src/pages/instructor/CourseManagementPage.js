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
        setError('ກະລຸນາເຂົ້າລະບົບ');
        navigate('/login', { replace: true });
        return;
      }

      const userRole = user.role || user.user?.role;

      if (userRole?.toLowerCase() !== 'instructor') {
        setError('ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້ານີ້');
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
        <p className="text-xl">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
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
      {/* ຂ້າງຂວາເປັນແຖບເມນູ */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">ເມນູຂອງຜູ້ສອນ</h2>

        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/course-management/my-courses')}
                className={`w-full text-left px-4 py-2 rounded transition ${activeMenu === 'my-courses' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                ຄອສຂອງຂ້ອຍ
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/course-management/create-course')}
                className={`w-full text-left px-4 py-2 rounded transition ${activeMenu === 'create-course' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                ສ້າງຄອສຮຽນ
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/course-management/instructor-sales-report')}
                className={`w-full text-left px-4 py-2 rounded transition ${activeMenu === 'settings' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                ລາຍງານການຂາຍ
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* ເນື້ອຫາຫຼັກ */}
      <div className="flex-1 overflow-auto p-8">
        <Outlet /> {/* ສະແດງເນື້ອຫາຂອງ Route ຍ່ອຍ */}
      </div>
    </div>
  );
};

export default CourseManagementPage;
