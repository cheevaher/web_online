import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      // แสดงข้อความผิดพลาดให้ผู้ใช้เห็น (เช่น ใช้ state สำหรับ error message)
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username, // ใช้ค่าจาก state username
          email: email,       // ใช้ค่าจาก state email
          password: password  // ใช้ค่าจาก state password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration success:', data);
      // ทำอะไรต่อหลังจากลงทะเบียนสำเร็จ เช่น navigate ไปหน้า login
      navigate('/login');
    } catch (error) {
      console.error("Registration error:", error);
      // แสดง error ให้ผู้ใช้เห็น (เช่น ใช้ state สำหรับ error message)
    }
  };

  return (
    <div className="register-form-container">
      <h2>Register Form</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>

        <div className="button-container">
          <button type="submit" className="register-btn">Register</button>

          {/* ลิงก์ไปหน้า Login */}
          <button
            type="button"
            className="login-btn"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>

        {/* ลิงก์สำหรับผู้สอนลงทะเบียน */}
        <div className="text-center mt-4">
          <p>ต้องการลงทะเบียนเป็นผู้สอน? <span
            onClick={() => navigate('/register-instructor')}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            คลิกที่นี่
          </span></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;