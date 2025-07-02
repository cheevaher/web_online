import React, { useEffect } from 'react';
import teamworkImage from '../assets/teamwork.avif';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="font-lao text-gray-800">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-24 overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.6, -0.05, 0.01, 0.99]
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="text-yellow-400">L-Learning</span> ເວັບໄຊຮຽນອອນລາຍ
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            ພວກເຮົາແມ່ນແພັດຟ້ອມໃນການພັດທະນາທັກສະ ແລະ ຄວາມຮູ້ດ້ວຍຫຼັກສູດອອນໄລນ໌ທີ່ມີຄຸນນະພາບສູງ
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 0.8
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2 className="text-3xl font-bold mb-6 text-black">
              ເປົ້າໝາຍຂອງພວກເຮົາ
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              ສ້າງໂອກາດການຮຽນຮູ້ທີ່ເທົ່າທຽມກັນສຳລັບທຸກຄົນ ໂດຍຜ່ານເທັກໂນໂລຊີ ແລະ ວິທີການສອນທີ່ທັນສະໄໝ.
            </p>
            <div className="space-y-4">
              {[
                "✔ ຫຼັກສູດອອກແບບໂດຍຜູ້ຊ່ຽວຊານດ້ານວິຊາຊີບ",
                "✔ ຮຽນຕາມຈັງຫວະຂອງຕົນເອງ ແລະ ທຸກບ່ອນ",
                "✔ ການຮຽນຮູ້ທີ່ເນັ້ນປະສົບການຈິງ"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 15,
              duration: 0.8,
              delay: 0.2
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="shadow-2xl rounded-2xl overflow-hidden border-4 border-white"
          >
            <img
              src={teamworkImage}
              alt="ທີມງານທີ່ເຮັດວຽກຮ່ວມກັນ"
              className="w-full h-auto object-cover transition-all duration-500 hover:scale-105"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "ຫຼັກສູດຮຽນ" },
              { number: "500+", label: "ນັກຮຽນ" },
              { number: "98%", label: "ຄວາມພໍໃຈ" },
              { number: "50+", label: "ຜູ້ສອນຜູ້ຊ່ຽວຊານ" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <motion.section
        className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>

        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="text-yellow-400">ເຫດຜົນ</span>
            <span className='text-white'> ທີ່ຄວນເລືອກພວກເຮົາ</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mt-12"
          >
            {[
              {
                icon: "🌐",
                title: "ຮຽນໄດ້ທຸກບ່ອນ",
                desc: "ພຽງແຕ່ມີອິນເຕີເນັດ ທ່ານກໍ່ສາມາດເຂົ້າເຖິງບົດຮຽນໄດ້ທຸກບ່ອນ"
              },
              {
                icon: "⏱️",
                title: "ຈັດເວລາເອງໄດ້",
                desc: "ຮຽນຕາມເວລາທີ່ສະດວກ ບໍ່ຕ້ອງກັງວົນກ່ຽວກັບເວລາ"
              },
              {
                icon: "🎯",
                title: "ຜົນການຮຽນຈິງ",
                desc: "ຫຼັກສູດອອກແບບເພື່ອປະສົບຜົນສຳເລັດໃນການເຮັດວຽກຈິງ"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-900 p-8 rounded-xl hover:bg-gray-700 transition-colors"
                whileHover={{ y: -10 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400">{item.title}</h3>
                <p className="text-white">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Link
              to="/register"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              ເລີ່ມຕົ້ນການຮຽນຮູ້ວັນນີ້
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-black">
            ທີມງານຂອງ<span className="text-blue-600"> ພວກເຮົາ</span> 
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              // {
              //   name: "ທ ສຸກສະຫວັນ",
              //   role: "ຜູ້ພັດທະນາອອກແບບ backend",
              //   bio: "ອອກແບບລະບົບຖານຂໍ້ມູນ ແລະ ຈັດການ API"
              // },
              // {
              //   name: "ທ ສັນຕິລີ",
              //   role: "ຜູ້ຄິດຫົວຂໍ້ໃນຄັ້ງນີ້ ແລະ ພັດທະນາ frontend",
              //   bio: "ຜູ້ສຶກສາລະບົບຂາຍຫຼັກສູດທາງອອນລາຍ"
              // },
              // {
              //   name: "ທ ຈີ ວາເຮີ",
              //   role: "ຜູ້ອອກແບບ UX/UI ແລະ ພັດທະນາ frontend",
              //   bio: "ຜູ້ເກັບຂໍ້ມູນ ແລະ ສັງລວມງານ"
              // }
              {
                name: "ທ ສຸກສະຫວັນ",
                role: "ຜູ້ພັດທະນາ backend ແລະ ຈັດການ API",
                bio: "ຊ່ອງທາງຕິດຕໍ່: +856 20 94 012 094"
              },
              {
                name: "ທ ສັນຕິລີ",
                role: "ຜູ້ຄິດຫົວຂໍ້ນີ້ຂຶ້ນມາ ແລະ ພັດທະນາ frontend",
                bio: "ຊ່ອງທາງຕິດຕໍ່: +856 20 96 326 530"
              },
              {
                name: "ທ ຈີ ວາເຮີ",
                role: "ຜູ້ອອກແບບ UX/UI ແລະ ພັດທະນາ frontend",
                bio: "ຊ່ອງທາງຕິດຕໍ່: +856 20 77 668 374"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-lg shadow-md text-center"
              >
                {/* ✅ รูปจาก public/image1.png, image2.png, image3.png */}
                <div className="w-32 h-39 mx-auto mb-4 rounded-full bg-gray-300 overflow-hidden shadow-inner">
                  <img
                    src={`/image${index + 1}.jpeg`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>
    </div>
  );
}