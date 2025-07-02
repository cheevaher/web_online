import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import heroImage from "../assets/hero-learning.jpg";
import instructorImage from "../assets/Instructor.webp";
import CategorySection from "../components/CategorySection";

// Enhanced animation presets
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    type: "spring",
    stiffness: 100,
    damping: 15,
    duration: 0.8
  },
  viewport: { once: true, margin: "-50px" },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  transition: {
    type: "spring",
    stiffness: 70,
    damping: 15,
    duration: 0.8
  },
  viewport: { once: true, margin: "-50px" },
};

const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  transition: {
    type: "spring",
    stiffness: 70,
    damping: 15,
    duration: 0.8
  },
  viewport: { once: true, margin: "-50px" },
};

const cardPop = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9, y: 30 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  transition: {
    type: "spring",
    stiffness: 80,
    damping: 15,
    delay,
    duration: 0.7
  },
  viewport: { once: true, margin: "-50px" },
});

export default function HomePage() {
  const [popularCourses, setPopularCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/courses", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setPopularCourses(data.slice(0, 4));
      } catch {
        setPopularCourses([]);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/categories", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };

    fetchCourses();
    fetchCategories();
  }, []);

  return (
    <div className="font-lao text-gray-800 bg-white">
      {/* Hero Section - Redesigned with professional gradient */}
      <motion.section
        className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                ຍິນດີຕ້ອນຮັບສູ່<span className="text-yellow-400">L-Learning</span>
              </span></h1>
            <h1><span className="text-white text-4xl md:text-5xl lg:text-4xl font-bold leading-tight mb-6">
              ຍົກລະດັບທັກສະຂອງທ່ານດ້ວຍການຮຽນອອນລາຍທີ່ມີຄຸນນະພາບ</span></h1><br/>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0">
              ຄຸນນະພາບການສຶກສາທີ່ເຊື່ອຖືໄດ້ ຈາກຜູ້ຊ່ຽວຊານດ້ານວິຊາຊີບ
            </p> */}
            <div className="text-center lg:text-left">
              {/* ข้อความ 1: ยินดีต้อนรับ */}
              <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold leading-tight mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                  ຍິນດີຕ້ອນຮັບສູ່
                </span>{' '}
                <span className="text-yellow-400">L-Learning</span>
              </h1>
              {/* ข้อความ 2: ยกระดับ */}
              <h1><span className="text-white text-4xl md:text-5xl lg:text-4xl font-bold leading-tight mb-6">
              ຍົກລະດັບຄຸນນະພາບການສຶກສາທີ່ເຊື່ອຖືໄດ້ ຈາກຜູ້ຊ່ຽວຊານດ້ານວິຊາຊີບ</span></h1><br/>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                ລົງທະບຽນຕອນນີ້
              </Link>
              <Link
                to="/courses"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
              >
                ສຳຫຼວດຄອສຮຽນ
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6">
              {[
                { value: "99.99%", label: "ຄຸນນະພາບ" },
                { value: "24/7", label: "ຮຽນໄດ້ທຸກເວລາ" },
                { value: "500+", label: "ນັກຮຽນ" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="text-blue-200 text-sm">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-blue-600 rounded-2xl opacity-20 blur-lg"></div>
            <img
              src={heroImage}
              alt="Learning"
              className="relative w-full max-w-2xl rounded-2xl shadow-2xl border-4 border-white transform hover:scale-[1.01] transition duration-500 ease-out"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Popular Courses Section - More professional card design */}
      <motion.section {...fadeUp} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                ຫຼັກສູດຍອດນິຍົມ
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              ຄັດເລືອກຈາກຫຼັກສູດທີ່ມີຄຸນນະພາບສູງສຸດຂອງພວກເຮົາ
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {popularCourses.length > 0 ? (
              popularCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  variants={cardPop(index * 0.1)}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                  whileHover={{ y: -10 }}
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={course.course_image}
                      alt={course.course_name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                        ຍອດນິຍົມ
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                      {course.course_name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.course_description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold">
                        ₭{course.course_price}
                      </span>
                      <Link
                        to={`/courses/${course.id}`}
                        className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                      >
                        ລາຍລະອຽດ
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">
                  ກຳລັງກຽມຫຼັກສູດທີ່ດີທີ່ສຸດສຳຫຼັບທ່ານ...
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              to="/courses"
              className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300"
            >
              ເບິ່ງຫຼັກສູດທັງໝົດ
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.div {...fadeUp}>
        <CategorySection categories={categories} />
      </motion.div>

      {/* Instructor Section - More professional design */}
      <motion.section {...fadeUp} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 shadow-inner">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center gap-8"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-200 rounded-full opacity-30 blur-lg"></div>
                  <img
                    src={instructorImage}
                    alt="Instructor"
                    className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">ອາຈານ ຈອນ</h3>
                  <p className="text-blue-600 font-medium mb-3">ຜູ້ຊ່ຽວຊານດ້ານໄອທີ ແລະ ຄອມພິວເຕີ</p>
                  <div className="flex justify-center sm:justify-start gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-gray-600 text-sm">(100+ ຄຳຕິຊົມ)</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">ກ່ຽວກັບຜູ້ສອນຂອງເຮົາ</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  ພວກເຮົາມີຜູ້ສອນທີ່ຜ່ານການຄັດເລືອກຢ່າງເຂັ້ມງວດ, ທຸກທ່ານມີປະສົບການການສອນແລະການເຮັດວຽກໃນສະໜາມຈິງ. ພວກເຮົາເຊື່ອວ່າການສຶກສາທີ່ດີຕ້ອງມາຈາກຜູ້ສອນທີ່ດີ.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ມີປະສົບການ 5-10 ປີ
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    ຜູ້ຊ່ຽວຊານດ້ານວິຊາຊີບ
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    ວິທີສອນແບບໃໝ່
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Trust Badges Section */}
      <motion.section {...fadeUp} className="py-16 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "ຄຸນນະພາບແນ່ໃຈ",
                desc: "ຫຼັກສູດທີ່ຜ່ານການກວດສອບແລ້ວ"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "ຮຽນໄດ້ຕາມເວລາຂອງທ່ານ",
                desc: "ເຂົ້າເຖິງບົດຮຽນໄດ້ທຸກເວລາ"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                title: "ລາຄາເໝາະສົມ",
                desc: "ມີຫຼາກຫຼາຍລາຄາສຳຫຼັບທຸກຄົນ"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: "ສະຫນັບສະຫນູນ 24/7",
                desc: "ທີມງານພ້ອມຊ່ວຍເຫຼືອທ່ານຕະຫຼອດເວລາ"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-blue-600 mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}