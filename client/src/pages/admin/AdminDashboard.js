// src/pages/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ສ່ວນຂ້າງຂວາ (Sidebar) */}


      {/* ສ່ວນເນື້ອຫາຫຼັກ */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">ເຂົ້າສູ່ໜ້າລາຍງານຂໍ້ມູນສໍາລັບ Admin ສຳເລັດ</h1>
        <p>ຂໍ້ມູນສະຫຼຸບ ຫຼື ການລາຍງານຕ່າງໆຈະຢູ່ໃນຫນ້ານີ້</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
