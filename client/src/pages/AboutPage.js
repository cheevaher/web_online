import React from 'react';
import teamworkImage from '../assets/teamwork.avif';

export default function AboutPage() {
  return (
    <div className="font-lao text-gray-800">
      {/* Section Header */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ກ່ຽວກັບພວກເຮົາ</h1>
          <p className="text-lg md:text-xl">
            ພວກເຮົາແມ່ນແພລດຟອມການຮຽນອອນໄລນ໌ທີ່ມີຈຸດປະສົງໃຫ້ການສຶກສາສາມາດເຂົ້າເຖິງໄດ້ທຸກໆຄົນໃນທຸກສະຖານທີ່ ແລະ ທຸກເວລາ.
          </p>
        </div>
      </section>

      {/* Section Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-blue-900">ພາລະກິດຂອງພວກເຮົາ</h2>
            <p className="text-gray-700 leading-relaxed">
              ເຮົາມີແນວຄິດທີ່ຈະເຮັດໃຫ້ການສຶກສາເປັນສິ່ງທີ່ເຂົ້າເຖິງໄດ້ງ່າຍຜ່ານການໃຊ້ເທັກໂນໂລຊີ. ພວກເຮົາສ້າງຄອສຮຽນທີ່ມີຄຸນນະພາບ ແລະ ມີຄວາມຫຼາກຫຼາຍເພື່ອໃຫ້ຜູ້ຮຽນສາມາດພັດທະນາຕົນເອງໄດ້ທຸກເວລາ.
            </p>
          </div>
          <div>
            <img
              src={teamworkImage}
              alt="Our Team"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Section Vision */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-900">ວິໄສທັດຂອງພວກເຮົາ</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            ການສຶກສາບໍ່ຄວນຈະຖືກຈຳກັດເພາະສະຖານທີ່ ຫຼື ເວລາເຊິ່ງເຮົາເຊື່ອວ່າທຸກຄົນສາມາດເພີ່ມພູນທັກສະໄດ້ຖ້າພວກເຂົາມີໂອກາດເຂົ້າເຖິງການຮຽນໃນຮູບແບບອອນລາຍ.
          </p>
        </div>
      </section>
    </div>
  );
}
