// src/components/CategorySection.js
import React from "react";
import { Link } from "react-router-dom";

export default function CategorySection({ categories }) {
  const getCategoryIcon = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("math")) return "➗";
    if (nameLower.includes("tech")) return "💻";
    if (nameLower.includes("engineer")) return "🏗️";
    if (nameLower.includes("language")) return "🈳";
    if (nameLower.includes("business")) return "💼";
    return "📚";
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center text-blue-900">ໝວດໝູ່ວິຊາ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6 text-center">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                to={`/courses/category/${cat.id}`}
                key={cat.id}
                className="bg-blue-50 border border-blue-100 rounded-xl p-4 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center text-2xl">
                  {getCategoryIcon(cat.name)}
                </div>
                <p className="font-medium text-gray-700 text-sm">{cat.name}</p>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-gray-400 text-center">
              ບໍ່ມີໝວດໝູ່ໃດໆໃນຂະນະນີ້
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
