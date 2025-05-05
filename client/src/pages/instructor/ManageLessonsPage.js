import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ManageLessonsPage = () => {
  const { id } = useParams();  // ใช้เพื่อให้ทราบว่าเป็นคอร์สไหน
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    videoUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setLessonData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/video/upload', {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      setLessonData(prev => ({
        ...prev,
        videoUrl: data.secure_url
      }));
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปโหลดวิดีโอ');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/api/courses/${id}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(lessonData)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert('เพิ่มบทเรียนใหม่เรียบร้อยแล้ว');
      navigate(`/courses/${id}/lessons`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">เพิ่มบทเรียนใหม่</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">ชื่อบทเรียน</label>
          <input 
            type="text" 
            name="title" 
            value={lessonData.title} 
            onChange={handleChange} 
            className="w-full border px-3 py-2 rounded" 
            required 
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">คำอธิบาย</label>
          <textarea 
            name="description" 
            value={lessonData.description} 
            onChange={handleChange} 
            className="w-full border px-3 py-2 rounded" 
            rows="4" 
            required 
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">อัปโหลดวิดีโอ</label>
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleVideoUpload} 
            className="w-full" 
            required
          />
          {uploading && <p>กำลังอัปโหลด...</p>}
        </div>

        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          บันทึกบทเรียน
        </button>
      </form>
    </div>
  );
};

export default ManageLessonsPage;
