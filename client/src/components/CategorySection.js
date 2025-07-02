// // src/components/CategorySection.js
// import React from "react";
// import { Link } from "react-router-dom";

// export default function CategorySection({ categories }) {
//   const getCategoryIcon = (name) => {
//     const nameLower = name.toLowerCase();
//     if (nameLower.includes("math")) return "➗";
//     if (nameLower.includes("tech")) return "💻";
//     if (nameLower.includes("engineer")) return "🏗️";
//     if (nameLower.includes("language")) return "🈳";
//     if (nameLower.includes("business")) return "💼";
//     return "📚";
//   };

//   return (
//     <section className="bg-white py-16">
//       <div className="max-w-6xl mx-auto px-6">
//         <h2 className="text-3xl font-bold mb-10 text-center text-blue-900">ໝວດໝູ່ວິຊາ</h2>
//         <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6 text-center">
//           {categories.length > 0 ? (
//             categories.map((cat) => (
//               <Link
//                 to={`/courses/category/${cat.id}`}
//                 key={cat.id}
//                 className="bg-blue-50 border border-blue-100 rounded-xl p-4 hover:shadow-xl transition transform hover:-translate-y-1"
//               >
//                 <div className="bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center text-2xl">
//                   {getCategoryIcon(cat.name)}
//                 </div>
//                 <p className="font-medium text-gray-700 text-sm">{cat.name}</p>
//               </Link>
//             ))
//           ) : (
//             <p className="col-span-full text-gray-400 text-center">
//               ບໍ່ມີໝວດໝູ່ໃດໆໃນຂະນະນີ້
//             </p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }



import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CategorySection({ categories }) {
  const getCategoryIcon = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("math")) return "🧮";
    if (nameLower.includes("tech") || nameLower.includes("computer")) return "💻";
    if (nameLower.includes("engineer")) return "⚙️";
    if (nameLower.includes("language")) return "🌐";
    if (nameLower.includes("business")) return "📊";
    if (nameLower.includes("science")) return "🔬";
    if (nameLower.includes("art")) return "🎨";
    if (nameLower.includes("health")) return "🏥";
    return "📚";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <section className="py-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-1xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            ໝວດໝູ່ວິຊາຮຽນ
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
              >
                <Link
                  to={`/courses/category/${cat.id}`}
                  className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {getCategoryIcon(cat.name)}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
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
                ກຳລັງກຽມໝວດໝູ່ວິຊານຳສະເໜີທ່ານ...
              </p>
            </motion.div>
          )}
        </div>

        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            {/* <Link
              to="/courses"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:opacity-90"
            >
              ເບິ່ງຄອສຮຽນທັງໝົດ
            </Link> */}
          </motion.div>
        )}
      </div>
    </section>
  );
}