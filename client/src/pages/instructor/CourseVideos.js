// pages/CourseVideos.js

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseVideos = () => {
  const { courseId } = useParams(); // ดึง course_id จาก URL
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/courses/${courseId}/lessons`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLessons(res.data); // เพราะ backend ส่งมาเป็น array ตรง ๆ
      } catch (err) {
        console.error('Error loading lessons:', err);
      }
    };
    

    fetchLessons();
  }, [courseId]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">วิดีโอของคอร์ส</h2>
        <button
          onClick={() => navigate(`/course-management/courses/${courseId}/lessons`)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + เพิ่มวิดีโอ
        </button>
      </div>

      {lessons.length === 0 ? (
        <p>ยังไม่มีวิดีโอในคอร์สนี้</p>
      ) : (
        <ul className="space-y-4">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold">{lesson.lesson_name}</h3>
              <p className="text-sm text-gray-600">ประเภท: {lesson.lesson_type}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseVideos;
