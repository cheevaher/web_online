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
        if (!user?.token) throw new Error('ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ');

        const [courseRes, categoryRes] = await Promise.all([
          fetch(`http://localhost:4000/api/courses/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          fetch(`http://localhost:4000/api/categories`) // ສົມຸດທ່ານມີ endpoint ນີ້
        ]);

        const courseData = await courseRes.json();
        const categoryData = await categoryRes.json();

        if (!courseRes.ok) throw new Error(courseData.message);
        if (!categoryRes.ok) throw new Error('ບໍ່ສາມາດໂຫຼດໝວດໝູ່ໄດ້');

        setFormData({
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          thumbnail: courseData.thumbnail,
          category_id: courseData.category_id || ''
        });

        setCategories(categoryData); // ເນື່ອງຈາກ API ສົ່ງ array ໂດຍກົງ

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
    form.append('upload_preset', 'unsigned_preset'); // ປ່ຽນເປັນ preset ທີ່ Cloudinary ຕັ້ງໄວ້

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
      alert('ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫຼດຮູບພາບ');
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

      setSuccessMsg('ອັບເດດຄອສສຳເລັດແລ້ວ');
      setTimeout(() => navigate('/course-management/my-courses'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4 text-center">ກຳລັງໂຫຼດ...</div>;

  if (error) return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>ເກີດຂໍ້ຜິດພາດ: {error}</p>
        <button onClick={() => navigate(-1)} className="mt-2 text-blue-600 hover:text-blue-800">
          ກັບໄປໜ້າກ່ອນໜ້າ
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">ແກ້ໄຂຄອສ</h2>

      {successMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">ຊື່ຄອສ</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">ຄໍາອະທິບາຍ</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" rows="4" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">ລາຄາ</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border px-3 py-2 rounded" min="0" required />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">ໝວດໝູ່</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
            <option value="">-- ເລືອກໝວດໝູ່ --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">ຮູບພາບປະຈຸບັນ</label>
          {formData.thumbnail && <img src={formData.thumbnail} alt="Thumbnail ຄອສ" className="w-40 h-auto mb-2 rounded" />}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
          {uploading && <p className="text-sm text-gray-500 mt-1">ກຳລັງອັບໂຫຼດ...</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => navigate(`/course-management/courses/${id}/videos`)} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            ຈັດການບົດຮຽນ
          </button>
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">ຍົກເລີກ</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">ບັນທຶກການແປງແປງ</button>
        </div>
      </form>
    </div>
  );
};

export default EditCoursePage;