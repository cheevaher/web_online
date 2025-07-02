import React, { useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  CheckCircle,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  // scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const menuItems = [
    {
      to: '/admin/approve-instructor',
      label: 'ອະນຸມັດຜູ້ສອນ',
      icon: <CheckCircle size={18} />,
    },
    {
      to: '/admin/instructor-report',
      label: 'ລາຍງານຜູ້ສອນ',
      icon: <Users size={18} />,
    },
    {
      to: '/admin/users-report',
      label: 'ລາຍງານຜູ້ຮຽນ',
      icon: <GraduationCap size={18} />,
    },
    {
      to: '/admin/course-report',
      label: 'ລາຍງານຄອສ',
      icon: <BookOpen size={18} />,
    },
    {
      to: '/admin/sales-report',
      label: 'ລາຍງານການຂາຍ',
      icon: <BarChart3 size={18} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-white p-2">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-blue-50 shadow-lg rounded-r-3xl">
        <div className="p-6 text-2xl font-extrabold border-b border-blue-700 tracking-wide">
          ເມນູຈັດການ
        </div>
        <nav className="p-4">
          <ul className="space-y-2 text-sm">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-blue-700 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 bg-blue-40 shadow-inner rounded-l-3xl ml-2 md:ml-4">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
