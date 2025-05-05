import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ส่วนคำอธิบาย */}
      <section className="bg-purple-100 text-center py-12 px-6 rounded-b-3xl shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-purple-800">คอร์สเรียนทั้งหมด</h1>
        <p className="text-lg text-purple-700 max-w-2xl mx-auto">
          เรียนรู้ได้ทุกที่ทุกเวลา กับคอร์สออนไลน์จากผู้สอนมืออาชีพ
          ครอบคลุมหลายหัวข้อ ทั้งเทคโนโลยี ภาษา ธุรกิจ และอื่นๆ อีกมากมาย
        </p>
      </section>

      {/* ส่วนแสดงคอร์ส */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="bg-white shadow rounded-2xl p-4 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>
              <Link 
                to={`/courses/${course.id}`} 
                className="text-purple-600 font-medium hover:underline"
              >
                ดูรายละเอียด
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">ยังไม่มีคอร์สในขณะนี้</p>
        )}
      </section>
    </div>
  );
};

export default CoursesPage;
