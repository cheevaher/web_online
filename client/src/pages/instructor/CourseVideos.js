import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const getVideoThumbnail = (videoUrl) => {
  if (!videoUrl) return 'https://via.placeholder.com/400x200?text=No+Video';
  if (videoUrl.includes('cloudinary')) {
    return videoUrl
      .replace('/upload/', '/upload/so_1/')
      .replace(/\.(mp4|webm|mov)$/i, '.jpg');
  }
  return 'https://via.placeholder.com/400x200?text=Video';
};

const CourseVideos = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [newLessonData, setNewLessonData] = useState({
    lesson_name: '',
    description: '',
    video_url: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
          alert('ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່');
          navigate('/login');
          return;
        }
        const res = await axios.get(`/api/courses/${courseId}/lessons`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setLessons(res.data);
      } catch (err) {
        console.error('Error loading lessons:', err);
      }
    };

    fetchLessons();
  }, [courseId, navigate]);

  const handleEditClick = (lesson) => {
    setEditingLesson(lesson);
    setNewLessonData({
      lesson_name: lesson.lesson_name,
      description: lesson.description,
      video_url: lesson.video_url,
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (!newLessonData.lesson_name.trim()) {
      alert('ກະລຸນາປ້ອນຊື່ບົດຮຽນ');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        alert('ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່');
        navigate('/login');
        return;
      }

      await axios.put(
        `/api/lessons/${editingLesson.lesson_id}`, 
        newLessonData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setEditingLesson(null);
      setLessons(prevLessons => 
        prevLessons.map(lesson => 
          lesson.lesson_id === editingLesson.lesson_id ? { ...lesson, ...newLessonData } : lesson
        )
      );
    } catch (err) {
      console.error('Error updating lesson:', err);
      alert('ອັບເດດບົດຮຽນບໍ່ສຳເລັດ: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteClick = async (lessonId) => {
    const confirmDelete = window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບບົດຮຽນນີ້?');
    if (!confirmDelete) return;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        alert('ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່');
        navigate('/login');
        return;
      }

      await axios.delete(`/api/courses/${courseId}/lessons/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setLessons(lessons.filter((lesson) => lesson.lesson_id !== lessonId));
    } catch (err) {
      console.error('Error deleting lesson:', err);
      alert('ລຶບບົດຮຽນບໍ່ສຳເລັດ: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">ວິດີໂອຂອງຄອສ</h2>
        <button
          onClick={() => navigate(`/course-management/courses/${courseId}/lessons`)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + ເພີ່ມວິດີໂອ
        </button>
      </div>

      {lessons.length === 0 ? (
        <p>ຍັງບໍ່ມີວິດີໂອໃນຄອສນີ້</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, index) => (
            <li key={`${lesson.lesson_id}-${index}`} className="border rounded shadow-sm bg-white overflow-hidden">
              <img
                src={getVideoThumbnail(lesson.video_url)}
                alt={lesson.lesson_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{lesson.lesson_name}</h3>
                <p className="text-sm text-gray-600 mb-1">ປະເພດ: {lesson.lesson_type}</p>
                {lesson.description && (
                  <p className="text-sm text-gray-700 mb-1">{lesson.description}</p>
                )}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEditClick(lesson)}
                    className="text-blue-600 hover:underline"
                  >
                    ແກ້ໄຂ
                  </button>
                  <button
                    onClick={() => setLessonToDelete(lesson)}
                    className="text-red-600 hover:underline"
                  >
                    ລຶບ
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">ແກ້ໄຂຄອສ</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">ຊື່ຄອສ</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={newLessonData.lesson_name}
                  onChange={(e) =>
                    setNewLessonData({
                      ...newLessonData,
                      lesson_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">ຄໍາອະທິບາຍ</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={newLessonData.description}
                  onChange={(e) =>
                    setNewLessonData({
                      ...newLessonData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setEditingLesson(null)} className="text-gray-600">
                  ຍົກເລີກ
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  ອັບເດດ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {lessonToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold text-red-600 mb-4">ຢືນຢັນການລືບ</h3>
            <p className="mb-4">ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບບົດຮຽນ <strong>{lessonToDelete.lesson_name}</strong>?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setLessonToDelete(null)}
              >
                ຍົກເລີກ
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => {
                  handleDeleteClick(lessonToDelete.lesson_id);
                  setLessonToDelete(null);
                }}
              >
                ລຶບ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseVideos;
