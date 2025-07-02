import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }

      try {
        const categoriesResponse = await fetch('/api/categories', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!categoriesResponse.ok) {
          throw new Error('ດຶງຂໍ້ມູນປະເພດບໍ່ສຳເລັດ');
        }

        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [isAuthenticated, navigate, user]);

  const handleImageUpload = async () => {
    if (!imageFile) {
      console.error('ຍັງບໍ່ໄດ້ເລືອກຮູບພາບ');
      return null;
    }

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'unsigned_preset');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dy0ivdkgg/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('ອັບໂຫຼດຮູບບໍ່ສຳເລັດ:', errorData.message || 'ຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກ');
        return null;
      }

      const data = await response.json();
      console.log('ອັບໂຫຼດຮູບສຳເລັດ:', data);
      return data.secure_url;
    } catch (error) {
      console.error('ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫຼດຮູບ:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const uploadedImageUrl = await handleImageUpload();
      if (!uploadedImageUrl) {
        alert('ອັບໂຫຼດຮູບບໍ່ສຳເລັດ');
        setIsSubmitting(false);
        return;
      }

      const dataToSend = {
        course_name: formData.title,
        course_description: formData.description,
        course_price: parseFloat(formData.price),
        course_image: uploadedImageUrl,
        category_id: parseInt(formData.categoryId),
        instructor_id: user.id
      };

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error('ສ້າງຄອສບໍ່ສຳເລັດ');
      }

      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated() || isLoading) {
    return null; // ຫຼືຈະໃສ່ loading spinner ກໍໄດ້
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ສ້າງຄອສຮຽນໃໝ່</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block mb-2">ຊື່ຄອສ</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">ຄຳອະທິບາຍ</label>
          <textarea
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">ລາຄາ</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            min="0"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">ອັບໂຫຼດຮໜ້າປົກ</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
            accept="image/*"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">ຫມວດໝູ່</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            <option value="">-- ເລືອກຫມວດໝູ່ --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'ກຳລັງສ້າງ...' : 'ສ້າງຄອສ'}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
