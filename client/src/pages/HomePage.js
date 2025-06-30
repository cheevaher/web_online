import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-learning.jpg";
import instructorImage from "../assets/Instructor.webp";
import CategorySection from "../components/CategorySection"; // ✅ นำเข้า

export default function HomePage() {
  const [popularCourses, setPopularCourses] = useState([]);
  const [categories, setCategories] = useState([]);

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
    <div className="font-lao text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 via-white to-blue-50 py-10 border-b">
        <div className="max-w-7xl mx-auto px-2 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-bold leading-tight mb-6 text-blue-800">
              ຮຽນອອນລາຍແບບງ່າຍໆ<br />ຈາກເວັບໄຊທ໌ຂອງເຮົາ
            </h1>
            <Link
              to="/register"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-lg transition text-lg font-semibold"
            >
              ລົງທະບຽນເລີຍ
            </Link>
          </div>
          <div className="flex justify-center">
            <img
              src={heroImage}
              alt="Learning"
              className="w-full max-w-md rounded-2xl shadow-xl ring-2 ring-blue-200 hover:scale-105 hover:brightness-105 hover:saturate-150 transition duration-300 ease-in-out"
            />
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="bg-gray-50 py-16 border-t border-b">
        <div className="max-w-7xl mx-auto px-3">
          <h2 className="text-3xl font-bold mb-10 text-blue-900">ຄອສທີ່ນິຍົມ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCourses.length > 0 ? (
              popularCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <img
                    src={course.course_image}
                    alt={course.course_name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-bold text-md mb-2 text-gray-800 truncate">{course.course_name}</p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.course_description}
                    </p>
                    <p className="text-blue-600 font-semibold mb-2">
                      ₭{course.course_price}
                    </p>
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      ເບິ່ງລາຍລະອຽດ
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                ບໍ່ມີຄອສໃດໆໃນຂະນະນີ້
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ✅ Categories Section */}
      <CategorySection categories={categories} />

      {/* Instructor Section */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex items-center gap-4">
            <img
              src={instructorImage}
              alt="Instructor"
              className="rounded-full w-20 h-20 object-cover shadow"
            />
            <div>
              <p className="text-xl font-semibold text-blue-900">ອາຈານ ຈອນ</p>
              <p className="text-sm text-gray-600">ວິຊາ:ໄອທີ ແລະ ຄອມພິວເຕີ</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            ພວກເຮົາໄດ້ຄັດເລືອກຜູ້ສອນທີ່ມີຄວາມຮູ້, ຄວາມສາມາດ ແລະ ມີປະສົບການເພື່ອໃຫ້ການຮຽນຂອງທ່ານມີຄຸນນະພາບສູງທີ່ສຸດ.
          </p>
        </div>
      </section>
    </div>
  );
}
