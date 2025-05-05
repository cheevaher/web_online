// ไฟล์: App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import RegisterForm from './pages/RegisterForm';
import LoginForm from './pages/LoginForm';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import RegisterInstructorPage from './pages/RegisterInstructorPage';
import CourseManagementPage from './pages/instructor/CourseManagementPage'; // ✅ แค่นี้พอ
import ComponentCreateCourse from './pages/instructor/ComponentCreateCourse';
import MyCourses from './pages/instructor/ComponentMyCourses'; // ✅ แค่นี้พอ
import EditCoursePage from './pages/instructor/EditCoursePage';
import ManageLessonsPage from './pages/instructor/ManageLessonsPage';

// ❌ ไม่ต้อง import ComponentCreateCourse ที่นี่นะ


// ProtectedRoute Component
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>กำลังโหลด...</div>;
  
  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  const userRole = user.role || user.user?.role;
  if (requiredRole && userRole?.toLowerCase() !== requiredRole.toLowerCase()) {
    console.log(`Role ${userRole} does not match required ${requiredRole}`);
    return <Navigate to="/" replace />;
  }
  
  return element;
};

// Routes ของ App
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/register-instructor" element={<RegisterInstructorPage />} />
       
      {/* ✅ ป้องกัน instructor เท่านั้น */}
      <Route 
        path="/course-management" 
        element={<ProtectedRoute element={<CourseManagementPage />} requiredRole="instructor" />}
      >
        {/* เส้นทางย่อยสำหรับ CourseManagementPage */}
        <Route index element={<MyCourses />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="create-course" element={<ComponentCreateCourse />} />
      </Route>
      {/* ✅ เส้นทางสำหรับแก้ไขคอร์ส */}
      <Route 
        path="/courses/:id/edit" 
        element={<ProtectedRoute element={<EditCoursePage />} requiredRole="instructor" />}
      />
      <Route 
  path="/course-management/courses/:id/lessons" 
  element={<ProtectedRoute element={<ManageLessonsPage />} requiredRole="instructor" />}
/>
      {/* เส้นทางสำหรับ 404 Not Found */}
      <Route path="*" element={<div>ไม่พบหน้าที่คุณต้องการ</div>} />
    </Routes>
  );
};

// App หลัก
function App() {
  return (
    <AuthProvider>
      <Navbar />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
