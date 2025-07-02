import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CategoryCoursesPage() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchCoursesByCategory = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:4000/api/categories/${id}/courses`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setCourses(data.courses);
        setCategoryName(data.categoryName || "");
      } catch {
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoursesByCategory();
  }, [id]);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5
      }
    }
  };

  return (
    <div className="font-lao text-gray-800 bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
              ຄອສໃນໝວດໝູ່
            </span>
            <br />
            <span className="text-white">{categoryName || "ກຳລັງໂຫຼດ..."}</span>
          </motion.h1>
          <motion.p
            className="text-lg text-blue-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            ຄົ້ນຫາຄອສຮຽນທີ່ເໝາະສົມກັບຄວາມສົນໃຈຂອງທ່ານ
          </motion.p>
        </div>
      </motion.section>

      {/* Courses Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : courses.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  variants={cardVariants}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.course_image}
                      alt={course.course_name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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
                        ເບິ່ງລາຍລະອຽດ
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-gray-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                ບໍ່ມີຄອສໃນໝວດໝູ່ນີ້
              </h3>
              <p className="text-gray-500 mb-6">
                ພວກເຮົາຈະເພີ່ມຄອສໃຫມ່ໃນໄວໆນີ້
              </p>
              <Link
                to="/courses"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                ເບິ່ງຄອສທັງໝົດ
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}