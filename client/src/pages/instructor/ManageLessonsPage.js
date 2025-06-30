import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ManageLessonsPage = () => {
  const { courseId } = useParams();  // ດຶງ courseId ຈາກ URL params
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lessonData, setLessonData] = useState({
    lesson_name: '',
    description: '',
    video_url: '',
    lesson_type: 'video'
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setLessonData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.includes('video')) {
      setError('ກະລຸນາອັບໂຫຼດສະເພາະໄຟວິດີໂອເທົ່ານັ້ນ');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_preset');
    formData.append('cloud_name', 'dy0ivdkgg');
    formData.append('resource_type', 'video');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dy0ivdkgg/video/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('ອັບໂຫຼດວິດີໂບບໍ່ສຳເລັດ');
      const data = await res.json();
      setLessonData(prev => ({ ...prev, video_url: data.secure_url }));

    } catch (err) {
      console.error('Error uploading video:', err);
      setError(`ອັບໂຫຼດລົ້ມເຫຼວ: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lessonData.video_url) {
      setError('ກະລຸນາອັບໂຫຼດວິດີໂອກ່ອນ');
      return;
    }

    if (isNaN(courseId)) {
      setError('ລະຫັດຄອສບໍ່ຖືກຕ້ອງ');
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(lessonData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'ບໍ່ສາມາດສ້າງບົດຮຽນໄດ້');

      alert('ເພີ່ມບົດຮຽນສຳເລັດແລ້ວ');

      navigate(`/course-management/courses/${courseId}/videos`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">ເພີ່ມບົດຮຽນໃໝ່</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">ຊື່ບົດຮຽນ</label>
          <input type="text" name="lesson_name" value={lessonData.lesson_name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">ຄຳອະທິບາຍ</label>
          <textarea name="description" value={lessonData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows="4" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">ອັບໂຫຼດວິດີໂອ</label>
          <input type="file" accept="video/*" onChange={handleVideoUpload} className="w-full" required disabled={uploading} />
          {uploading && <p className="text-blue-600 mt-2">ກຳລັງອັບໂຫຼດວິດີໂອ...</p>}
          {lessonData.video_url && !uploading && <p className="text-green-600 mt-2">ອັບໂຫຼດສຳເລັດແລ້ວ</p>}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={uploading}>
          {uploading ? 'ກຳລັງປະມວນຜົນ...' : 'ບັນທຶກບົດຮຽນ'}
        </button>
      </form>
    </div>
  );
}; 

export default ManageLessonsPage; 
