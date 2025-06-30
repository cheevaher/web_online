import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  // ดึง role จาก localStorage
  const role = localStorage.getItem('userRole');

  if (role !== 'admin') {
    // ไม่ใช่ admin ให้ไปหน้า login หรือหน้าอื่นได้เลย
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAdmin;
