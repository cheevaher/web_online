import React from 'react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  return (
    <div className=" text-center">
      {/* ສ່ວນເນື້ອຫາຫຼັກ */}
      <main className="flex-1 flex items-center justify-center md:p-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-extrabold text-indigo-700 mb-6 tracking-wide drop-shadow"
          >
            ເຂົ້າສູ່ໜ້າລາຍງານຂໍ້ມູນສໍາລັບ Admin
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-gray-600 text-base md:text-lg leading-relaxed"
          >
            ຂໍ້ມູນສະຫຼຸບ ຫຼື ການລາຍງານຕ່າງໆຈະຢູ່ໃນຫນ້ານີ້<br />
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
