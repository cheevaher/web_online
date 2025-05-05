import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: '',
    category_id: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) throw new Error('กรุณาเข้าสู่ระบบก่อน');

        const [courseRes, categoryRes] = await Promise.all([
          fetch(`http://localhost:4000/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          fetch(`http://localhost:4000/api/categories`) // สมมุติคุณมี endpoint นี้
        ]);

        const courseData = await courseRes.json();
        const categoryData = await categoryRes.json();

        if (!courseRes.ok) throw new Error(courseData.message);
        if (!categoryRes.ok) throw new Error('ไม่สามารถโหลดหมวดหมู่ได้');

        setFormData({
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          thumbnail: courseData.thumbnail,
          category_id: courseData.category_id || ''
        });

        setCategories(categoryData); // เพราะ API ส่ง array ตรง ๆ

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.token]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'unsigned_preset'); // เปลี่ยนเป็น preset ที่ Cloudinary ตั้งไว้

    try {
      setUploading(true);
      const res = await fetch('https://api.cloudinary.com/v1_1/dy0ivdkgg/image/upload', {
        method: 'POST',
        body: form
      });

      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        thumbnail: data.secure_url
      }));
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`http://localhost:4000/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccessMsg('อัปเดตคอร์สเรียบร้อยแล้ว');
      setTimeout(() => navigate('/course-management/my-courses'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4 text-center">กำลังโหลด...</div>;

  if (error) return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>เกิดข้อผิดพลาด: {error}</p>
        <button onClick={() => navigate(-1)} className="mt-2 text-blue-600 hover:text-blue-800">
          กลับไปหน้าก่อนหน้า
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">แก้ไขคอร์ส</h2>

      {successMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">ชื่อคอร์ส</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">คำอธิบาย</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows="4" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">ราคา</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border px-3 py-2 rounded" min="0" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">หมวดหมู่</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
            <option value="">-- เลือกหมวดหมู่ --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">รูปภาพปัจจุบัน</label>
          {formData.thumbnail && <img src={formData.thumbnail} alt="Course Thumbnail" className="w-40 h-auto mb-2 rounded" />}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
          {uploading && <p className="text-sm text-gray-500 mt-1">กำลังอัปโหลด...</p>}
        </div>

        {/* เพิ่มปุ่มไปหน้าจัดการบทเรียน */}
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => navigate(`/course-management/courses/${id}/lessons`)} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            จัดการบทเรียน
          </button>
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">ยกเลิก</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">บันทึกการเปลี่ยนแปลง</button>
        </div>
      </form>
    </div>
  );
};

export default EditCoursePage;
