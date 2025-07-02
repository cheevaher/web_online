import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

// Animation configurations
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true, amount: 0.2 },
};

const courseCardAnimation = (index) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { delay: index * 0.05, duration: 0.4 },
  viewport: { once: true, amount: 0.2 },
});

// Course card component for better reusability
const CourseCard = ({ course }) => (
  <div className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition h-full flex flex-col">
    <div className="relative h-48 overflow-hidden">
      <img
        src={course.course_image || '/default-course-image.jpg'}
        alt={course.course_name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h2 className="text-xl font-semibold mb-1 text-gray-800">{course.course_name}</h2>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-grow">
        {course.course_description}
      </p>
      <div className="mt-auto">
        <p className="text-blue-600 font-semibold mb-2">
          {course.course_price ? `₭${course.course_price}` : 'ບໍ່ເສຍຄ່າ'}
        </p>
        <Link
          to={`/courses/${course.id}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-purple-200 transition-colors"
        >
          ເບິ່ງລາຍລະອຽດ
        </Link>
      </div>
    </div>
  </div>
);

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    course_name: PropTypes.string.isRequired,
    course_description: PropTypes.string.isRequired,
    course_price: PropTypes.number,
    course_image: PropTypes.string,
  }).isRequired,
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('http://localhost:4000/api/courses', {
          credentials: 'include'
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('ບໍ່ໄດ້ຮັບອະນຸຍາດ: ກະລຸນາເຂົ້າລະບົບກ່ອນ');
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຄອສ:', err);
        setError(err.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-lao">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 overflow-hidden"
        {...fadeInUp}
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>

        {/* Wavy bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-current text-blue-900"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-current text-blue-900"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-current text-blue-900"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ຄອສທັງໝົດ
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            ຄົ້ນຫາ ແລະ ເລືອກຄອສທີ່ທ່ານສົນໃຈເພື່ອເລີ່ມຮຽນ
          </motion.p>
        </div>
      </motion.section>

      {/* Courses Section */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                className="h-full"
                {...courseCardAnimation(index)}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">ບໍ່ພົບຄອສຮຽນ</h3>
            <p className="mt-1 text-gray-500">
              ທ່ານຍັງບໍ່ໄດ້ສ້າງຄອສໃດໆ ຫຼື ຍັງບໍ່ໄດ້ເຂົ້າລະບົບ
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CoursesPage;