import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpenCheck, PlusCircle, BarChart3 } from 'lucide-react';

const CourseManagementPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  // 🔒 Check permission
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

  // 🧭 Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const getActiveMenu = () => {
    if (location.pathname.includes('create-course')) return 'create-course';
    if (location.pathname.includes('instructor-sales-report')) return 'instructor-sales-report';
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

  const menuItems = [
    {
      key: 'my-courses',
      label: 'ຄອສທີ່ທ່ານສ້າງໄວ',
      icon: <BookOpenCheck size={18} />,
      onClick: () => navigate('/course-management/my-courses'),
    },
    {
      key: 'create-course',
      label: 'ສ້າງຄອສຮຽນ',
      icon: <PlusCircle size={18} />,
      onClick: () => navigate('/course-management/create-course'),
    },
    {
      key: 'instructor-sales-report',
      label: 'ລາຍງານການຂາຍ',
      icon: <BarChart3 size={18} />,
      onClick: () => navigate('/course-management/instructor-sales-report'),
    },
  ];

  return (
    <div className="flex min-h-screen bg-white p-2">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white shadow-lg rounded-r-3xl">
        <div className="p-6 text-2xl font-extrabold border-b border-blue-700 tracking-wide">
          ເມນູຜູ້ສອນ
        </div>
        <nav className="p-4">
          <ul className="space-y-2 text-sm">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={item.onClick}
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded-xl transition font-medium ${activeMenu === item.key
                      ? 'bg-blue-700 text-white'
                      : 'hover:bg-blue-700 hover:text-white'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 bg-blue-40 shadow-inner rounded-l-3xl ml-2 md:ml-4 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default CourseManagementPage;
