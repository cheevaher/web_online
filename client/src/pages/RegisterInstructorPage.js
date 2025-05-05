import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้เพื่อไปหน้าอื่นหลังจากลงทะเบียน
import './RegisterInstructorPage.css';

const RegisterInstructorPage = () => {
  const [instructorName, setInstructorName] = useState('');
  const [instructorTel, setInstructorTel] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [instructorPad, setInstructorPad] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');  // เพิ่ม state สำหรับรหัสผ่าน

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const instructorData = {
      instructor_name: instructorName,
      instructor_tel: instructorTel,
      instructor_email: instructorEmail,
      instructor_pad: instructorPad,
      address: address,
      password: password // เพิ่ม password ที่เคยลืมส่ง
    };
  
    try {
      const response = await fetch("http://localhost:4000/api/instructor/register-instructor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(instructorData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
  
      const data = await response.json();
      alert(data.message);
      navigate('/');
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "There was an error registering the instructor.");
    }
  };
  

  return (
    <div className="register-instructor-container">
      <h2>ลงทะเบียนผู้สอน</h2>
      <form onSubmit={handleSubmit} className="register-instructor-form">
        <div className="form-group">
          <label htmlFor="instructorName">ชื่อผู้สอน</label>
          <input
            type="text"
            id="instructorName"
            value={instructorName}
            onChange={(e) => setInstructorName(e.target.value)}
            required
            placeholder="กรุณากรอกชื่อผู้สอน"
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructorTel">เบอร์โทรศัพท์</label>
          <input
            type="tel"
            id="instructorTel"
            value={instructorTel}
            onChange={(e) => setInstructorTel(e.target.value)}
            required
            placeholder="กรุณากรอกเบอร์โทรศัพท์"
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructorEmail">อีเมล์</label>
          <input
            type="email"
            id="instructorEmail"
            value={instructorEmail}
            onChange={(e) => setInstructorEmail(e.target.value)}
            required
            placeholder="กรุณากรอกอีเมล์"
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructorPad">ประวัติการสอน</label>
          <textarea
            id="instructorPad"
            value={instructorPad}
            onChange={(e) => setInstructorPad(e.target.value)}
            required
            placeholder="กรุณากรอกประวัติการสอน"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">ที่อยู่</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="กรุณากรอกที่อยู่"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="กรุณากรอกรหัสผ่าน"
          />
        </div>

        <div className="button-container">
          <button type="submit" className="register-btn">ลงทะเบียนผู้สอน</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterInstructorPage;
