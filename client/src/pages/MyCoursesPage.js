import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // <-- import useAuth

const MyCoursesPage = () => {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user?.token) {
        setMyCourses([]);
        return;
      }

      try {
        const res = await fetch('http://localhost:4000/api/purchase/my-courses', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (res.status === 401) {
          setMyCourses([]);
          return;
        }

        const data = await res.json();
        setMyCourses(data);
      } catch (error) {
        console.error('Error loading purchased courses:', error);
        setMyCourses([]);
      }
    };

    fetchMyCourses();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 font-lao">
      <section className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>

        <h1 className="text-4xl font-bold mb-4 text-white text-center">
          ຄອສທີ່ທ່ານໄດ້ຊື້ແລ້ວ
        </h1>
        <p className="text-lg text-white max-w-2xl mx-auto text-center">
          ເລີ່ມຮຽນຮູ້ຈາກຄອສທີ່ທ່ານໄດ້ຊື້ໄວ້ແລ້ວ
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10">
        {myCourses.length > 0 ? (
          myCourses.map(course => (
            <div key={course.id} className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition">
              <img
                src={course.course_image}
                alt={course.course_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1 text-gray-800">{course.course_name}</h2>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.course_description}</p>
                <p className="text-blue-600 font-semibold mb-2">₭{course.course_price}</p>
                <Link
                  to={`/courses/${course.id}`}
                  className="text-blue-700 font-medium hover:underline"
                >
                  ເບິ່ງລາຍລະອຽດ
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            ທ່ານຍັງບໍ່ໄດ້ຊື້ຄອສຮຽນໃດໆເລີຍ
          </p>
        )}
      </section>
    </div>
  );
};

export default MyCoursesPage;
