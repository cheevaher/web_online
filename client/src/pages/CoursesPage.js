import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/courses', {
          credentials: 'include'
        });

        if (res.status === 401) {
          console.warn('ບໍ່ໄດ້ຮັບອະນຸຍາດ: ກະລຸນາເຂົ້າລະບົບກ່ອນ');
          setCourses([]);
          return;
        }

        const data = await res.json();
        console.log("Courses Data:", data);
        setCourses(data);
      } catch (error) {
        console.error('ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຄອສ:', error);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ສ່ວນຄຳອະທິບາຍ */}
      <section className="bg-purple-100 text-center py-6 px-6 rounded-b-3xl shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-purple-800">ຄອສທັງໝົດ</h1>
        <p className="text-lg text-purple-700 max-w-2xl mx-auto">
          {/* ຈັດການ ແລະ ເບິ່ງຄອສທີ່ທ່ານໄດ້ສ້າງໄວ້ໃນລະບົບ */}
        </p>
      </section>

      {/* ສ່ວນແສດງຄໍສ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition">
              <img 
                src={course.course_image} 
                alt={course.course_name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1 text-gray-800">{course.course_name}</h2>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.course_description}</p>
                <p className="text-purple-600 font-semibold mb-2">₭{course.course_price}</p>
                <Link 
                  to={`/courses/${course.id}`} 
                  className="text-purple-700 font-medium hover:underline"
                >
                  ເບິ່ງລາຍລະອຽດ
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">ທ່ານຍັງບໍ່ໄດ້ສ້າງຄອສໃດໆ</p>
        )}
      </section>
    </div>
  );
};

export default CoursesPage;
