import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ຄ່າງຂ້າງ (Sidebar) */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-xl font-bold border-b">ເມນູນຈັດການຂໍ້ມູນ</div>
        <nav className="p-4">
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/admin/instructor-report"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300 font-semibold' : ''}`
                }
              >
                ລາຍງານຜູ້ສອນ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/approve-instructor"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300 font-semibold' : ''}`
                }
              >
                ອະນຸມັດຜູ້ສອນ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users-report"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300 font-semibold' : ''}`
                }
              >
                ລາຍງານຜູ້ໃຊ້
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/course-report"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300 font-semibold' : ''}`
                }
              >
                ລາຍງານຄອສ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/sales-report"
                className={({ isActive }) =>
                  `block p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300 font-semibold' : ''}`
                }
              >
                ລາຍງານການຂາຍ
              </NavLink>
            </li>
            {/* ເພີ່ມເມນູອື່ນໆ */}
          </ul>
        </nav>
      </aside>

      {/* ເນື້ອຫາຫຼັກທີ່ປ່ຽນຕາມໜ້າ */}
      <main className="flex-1 p-8 bg-white shadow-inner">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
