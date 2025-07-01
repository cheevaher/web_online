import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactPlayer from 'react-player';
import {
  getCommentsByLesson,
  createComment,
} from '../services/commentService';

const CourseLearnPage = () => {
  const { id } = useParams(); // course id
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const navigate = useNavigate();

  const currentLesson = lessons[currentLessonIndex];

  // ໂຫຼດບົດຮຽນ
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/courses/${id}/lessons`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setLessons(data);
        } else {
          console.error('ຂໍ້ມູນບົດຮຽນບໍ່ແມ່ນ array:', data);
        }
      } catch (err) {
        console.error('ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດບົດຮຽນ:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchLessons();
  }, [id, user?.token]);

  // ໂຫຼດຄວາມຄິດເຫັນໃໝ່
  useEffect(() => {
    const fetchComments = async () => {
      if (!currentLesson?.lesson_id || !user?.token) {
        setComments([]);
        return;
      }
      try {
        const data = await getCommentsByLesson(id, currentLesson.lesson_id, user.token);
        setComments(data);
      } catch (err) {
        console.error('ໂຫຼດຄວາມຄິດເຫັນຜິດພາດ:', err);
      }
    };
    fetchComments();
  }, [currentLesson?.lesson_id, id, user?.token]);

  // ສົ່ງຄວາມຄິດເຫັນ
  const handleSubmitComment = async () => {
    if (!commentInput.trim()) return;
    if (!currentLesson?.lesson_id) {
      alert('ກະລຸນາເລືອກບົດຮຽນກ່ອນທີ່ຈະສົ່ງຄວາມຄິດເຫັນ');
      return;
    }
    try {
      const newComment = await createComment({
        courseId: id,
        lessonId: currentLesson.lesson_id,
        content: commentInput,
        token: user.token,
      });
      setComments(prev => [newComment, ...prev]);
      setCommentInput('');
    } catch (err) {
      console.error('ສົ່ງຄວາມຄິດເຫັນບໍ່ສຳເລັດ:', err);
    }
  };

  if (loading) return <p className="text-center mt-10">ກຳລັງໂຫຼດບົດຮຽນ...</p>;
  if (lessons.length === 0)
    return <p className="text-center mt-10 text-gray-500">ຍັງບໍ່ມີບົດຮຽນໃນຄອສນີ້</p>;

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-6">
      
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          ບົດທີ {currentLessonIndex + 1}: {currentLesson?.title || currentLesson?.lesson_name}
        </h1>

        {/* ReactPlayer */}
        <div className="mb-6 rounded-xl overflow-hidden shadow-md">
          <ReactPlayer
            url={currentLesson?.video_url}
            controls
            width="100%"
            height="450px"
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  disablePictureInPicture: true,
                },
              },
            }}
          />
        </div>

        <p className="text-gray-600 mt-4">
          {currentLesson?.description || 'ບໍ່ມີຄຳອະທິບາຍສຳລັບບົດຮຽນນີ້'}
        </p>

        {/* ຄວາມຄິດເຫັນ */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">ຄວາມຄິດເຫັນ</h3>
          <textarea
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="ປ້ອນຄວາມຄິດເຫັນ..."
            className="w-full border border-gray-300 rounded-md p-3 mb-3"
            rows={3}
          />
          <button
            onClick={handleSubmitComment}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            ສົ່ງຄວາມຄິດເຫັນ
          </button>

          <div className="mt-6 space-y-4">
            {comments.length === 0 && <p className="text-gray-500">ຍັງບໍ່ມີຄວາມຄິດເຫັນ</p>}
            {comments.map(comment => (
              <div key={comment.id || comment.created_at} className="bg-gray-100 p-3 rounded-md">
                <p className="text-gray-800 font-medium mb-1">{comment.username || 'ຜູ້ໃຊ້'}</p>
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ລາຍການບົດຮຽນ */}
      <div className="w-full lg:w-80 bg-gray-50 rounded-xl shadow-sm p-4 overflow-y-auto max-h-[600px]">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">ບົດຮຽນທັງໝົດ</h2>
        <ul className="space-y-2">
          {lessons.map((lesson, index) => (
            <li
              key={`${lesson.lesson_id}-${index}`}
              onClick={() => setCurrentLessonIndex(index)}
              className={`cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
                index === currentLessonIndex
                  ? 'bg-purple-100 text-purple-700 font-semibold'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              ບົດທີ {index + 1}: {lesson.title || lesson.lesson_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseLearnPage;
