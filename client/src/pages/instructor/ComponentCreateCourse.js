import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // เรียกใช้ Hook ทั้งหมดที่ด้านบนสุดของ component
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

  // ตรวจสอบการยืนยันตัวตนและดึงข้อมูล
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }

      try {
        // ดึงรายการหมวดหมู่
        const categoriesResponse = await fetch('/api/categories', {
          headers: {
            'Authorization': `Bearer ${user.token}` // ส่ง token ด้วย
          }
        });
        
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
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
      console.error('No image file selected');
      return null;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedImageUrl = await handleImageUpload();
      if (!uploadedImageUrl) {
        alert('Image upload failed');
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
        throw new Error('Failed to create course');
      }

      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  if (!isAuthenticated() || isLoading) {
    return null; // หรือแสดง loading spinner
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">สร้างคอร์สเรียนใหม่</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block mb-2">ชื่อคอร์ส</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">คำอธิบาย</label>
          <textarea
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">ราคา</label>
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
          <label className="block mb-2">อัปโหลดรูปภาพ</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
            accept="image/*"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">หมวดหมู่</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          สร้างคอร์ส
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;