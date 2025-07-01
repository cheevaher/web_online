// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// export default function CategoryCoursesPage() {
//   const { id } = useParams(); // ดึง category id จาก URL
//   const [courses, setCourses] = useState([]);
//   const [categoryName, setCategoryName] = useState("");

//   useEffect(() => {
//     const fetchCoursesByCategory = async () => {
//       try {
//         const res = await fetch(`http://localhost:4000/api/categories/${id}/courses`, {
//           credentials: "include",
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error();
//         setCourses(data.courses);
//         setCategoryName(data.categoryName || ""); // หาก API ส่งชื่อหมวดหมู่มาด้วย
//       } catch {
//         setCourses([]);
//       }
//     };

//     fetchCoursesByCategory();
//   }, [id]);

//   return (
//     <div className="font-lao text-gray-800">
//       <section className="bg-gradient-to-r from-blue-300 to-indigo-200 text-black py-16">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           <h1 className="text-4xl font-bold">
//             ຄອສໃນໝວດໝູ່: {categoryName || "ກຳລັງໂຫຼດ..."}
//           </h1>
//         </div>
//       </section>

//       <section className="py-16 bg-white border-t">
//         <div className="max-w-6xl mx-auto px-6">
//           {courses.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {courses.map((course) => (
//                 <div
//                   key={course.id}
//                   className="bg-blue-50 border border-blue-100 rounded-xl overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
//                 >
//                   <img
//                     src={course.course_image}
//                     alt={course.course_name}
//                     className="w-full h-40 object-cover"
//                   />
//                   <div className="p-4">
//                     <p className="font-bold text-md mb-2 text-gray-800 truncate">{course.course_name}</p>
//                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                       {course.course_description}
//                     </p>
//                     <p className="text-blue-600 font-semibold mb-2">
//                       ₭{course.course_price}
//                     </p>
//                     <Link
//                       to={`/courses/${course.id}`}
//                       className="text-blue-500 hover:underline text-sm"
//                     >
//                       ເບິ່ງລາຍລະອຽດ
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-center text-gray-500">ບໍ່ມີຄອສໃນໝວດໝູ່ນີ້</p>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function CategoryCoursesPage() {
  const { id } = useParams(); // ดึง category id จาก URL
  const [courses, setCourses] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCoursesByCategory = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/categories/${id}/courses`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setCourses(data.courses);
        setCategoryName(data.categoryName || ""); // หาก API ส่งชื่อหมวดหมู่มาด้วย
      } catch {
        setCourses([]);
      }
    };

    fetchCoursesByCategory();
  }, [id]);

  return (
    <div className="font-lao text-gray-800">
      <section className="bg-gradient-to-r from-blue-100 to-indigo-100 text-black py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">
            ຄອສທັງໝົດໃນໝວດໝູ່: {categoryName || "ກຳລັງໂຫຼດ..."}
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-blue-50 border border-blue-100 rounded-xl overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
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
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">ບໍ່ມີຄອສໃນໝວດໝູ່ນີ້</p>
          )}
        </div>
      </section>
    </div>
  );
}