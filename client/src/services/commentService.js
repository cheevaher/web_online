// /services/commentService.js
const API_URL = 'http://localhost:4000/api/comments';

// แก้ชื่อฟังก์ชันให้ตรงกับที่ใช้ในหน้า CourseLearnPage

export const getCommentsByLesson = async (courseId, lessonId, token) => {
  const res = await fetch(`http://localhost:4000/api/comments/${courseId}/${lessonId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('ไม่สามารถโหลดความคิดเห็นได้');
  }

  return res.json();
};

export const createComment = async ({ courseId, lessonId, content, token }) => {
  const res = await fetch(`http://localhost:4000/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ course_id: courseId, lesson_id: lessonId, content }),
  });

  if (!res.ok) {
    throw new Error('ไม่สามารถส่งความคิดเห็นได้');
  }

  return res.json();
};
