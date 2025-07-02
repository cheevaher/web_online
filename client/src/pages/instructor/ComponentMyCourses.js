import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (courseId) => {
    if (window.confirm('ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລົບຄອສນີ້?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'ລົບຄອສບໍ່ສຳເລັດ');
        }

        setCourses(courses.filter(course => course.id !== courseId));
      } catch (error) {
        console.error('ຜິດພາດໃນການລົບຄອສ:', error);
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.token) {
          throw new Error('ບໍ່ມີຂໍ້ມູນຜູ້ໃຊ້ ຫຼື token');
        }

        const response = await fetch('http://localhost:4000/api/courses/mine', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'ດຶງຂໍ້ມູນຄອສບໍ່ສຳເລັດ');
        }

        const data = await response.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('ຜິດພາດໃນການດຶງຂໍ້ມູນຄອສ:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">ກຳລັງໂຫຼດຄອສຮຽນ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>ເກີດຂໍ້ຜິດພາດ: {error}</p>
        <p>ກະລຸນາລອງໃໝ່ອີກຄັ້ງ</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold mb-6">ຄອສຮຽນທັງໝົດທີ່ທ່ານສ້າງໄວ</h1>
        <p className="text-gray-600">ທ່ານຍັງບໍ່ໄດ້ສ້າງຄອສຮຽນໃດໆ</p>
      </div>
    );
  }

  return (
    <div >
      <h1 className="text-4xl text-blue-600 font-bold mb-6 text-center p-6">ຄອສຮຽນທັງໝົດທີ່ທ່ານສ້າງໄວ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/learn/${course.id}`)}
            className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={course.thumbnail || 'https://via.placeholder.com/400x200.png?text=No+Image'}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {course.description || 'ບໍ່ມີຄຳອະທິບາຍ'}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                ໝວດໝູ່: {course.category || 'ບໍ່ໄດ້ລະບຸ'}
              </div>
              <div className="mt-2 font-bold text-blue-600">
                ລາຄາ: {course.price ? `${course.price} ກີບ` : 'ຟຣີ'}
              </div>
              <div
                className="mt-4 flex justify-between items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => navigate(`/courses/${course.id}/edit`)}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  ຈັດການຄອສ
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  ລົບຄອສ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;