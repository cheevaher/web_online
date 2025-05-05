import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับลบคอร์ส
  const handleDelete = async (courseId) => {
    if (window.confirm('คุณแน่ใจหรือว่าต้องการลบคอร์สนี้?')) {
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
          throw new Error(errorData.message || 'Failed to delete course');
        }

        // หลังจากลบคอร์สแล้ว ให้รีเฟรชข้อมูลคอร์ส
        setCourses(courses.filter(course => course.id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
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
          throw new Error('ไม่มีข้อมูลผู้ใช้หรือ token');
        }

        const response = await fetch('http://localhost:4000/api/courses/mine', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch courses');
        }

        const data = await response.json();
        console.log('Courses data:', data); 
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
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
          <p className="mt-2">กำลังโหลดคอร์สเรียน...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>เกิดข้อผิดพลาด: {error}</p>
        <p>กรุณาลองใหม่อีกครั้ง</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-6">คอร์สเรียนของฉัน</h1>
        <p className="text-gray-600">คุณยังไม่มีคอร์สเรียน</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">คอร์สเรียนของฉัน</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={course.thumbnail || 'https://via.placeholder.com/400x200.png?text=No+Image'}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {course.description || 'ไม่มีคำอธิบาย'}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                หมวดหมู่: {course.category || 'ไม่ระบุ'}
              </div>
              <div className="mt-2 font-bold text-blue-600">
                ราคา: {course.price ? `${course.price} บาท` : 'ฟรี'}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => navigate(`/courses/${course.id}/edit`)}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  จัดการคอร์ส
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  ลบคอร์ส
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
