import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import RegisterForm from './pages/RegisterForm';
import LoginForm from './pages/LoginForm';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import RegisterInstructorPage from './pages/RegisterInstructorPage';
import CourseManagementPage from './pages/instructor/CourseManagementPage';
import ComponentCreateCourse from './pages/instructor/ComponentCreateCourse';
import MyCourses from './pages/instructor/ComponentMyCourses';
import EditCoursePage from './pages/instructor/EditCoursePage';
import ManageLessonsPage from './pages/instructor/ManageLessonsPage';
import CourseVideos from './pages/instructor/CourseVideos';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseLearnPage from './pages/CourseLearnPage';
import PaymentPage from './pages/PaymentPage';
import MyCoursesPage from './pages/MyCoursesPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApproveInstructors from './pages/admin/AdminApproveInstructors';
import AdminLayout from './pages/admin/AdminLayout';
import InstructorReportPage from './pages/admin/InstructorReportPage';
import UsersReportPage from './pages/admin/UsersReportPage';
import CourseReportPage from './pages/admin/CourseReportPage';
import SalesReportPage from './pages/admin/SalesReportPage';
import InstructorSalesReport from './pages/instructor/InstructorSalesReport';

import CategoryCoursesPage from './pages/CategoryCoursesPage';
import AboutPage from './pages/AboutPage';

// ✅ Route ที่ต้องตรวจสอบสิทธิ์
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>ກຳລັງໂຫຼດ...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role || user.user?.role;
  if (requiredRole && userRole?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }
  return element;
};

// ✅ Route ทั้งหมดของระบบ
const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<HomePage />} />
    <Route path="/register" element={<RegisterForm />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/courses" element={<CoursesPage />} />
    <Route path="/register-instructor" element={<RegisterInstructorPage />} />
    <Route path="/courses/:id" element={<CourseDetailPage />} />
    <Route path="/learn/:id" element={<CourseLearnPage />} />
    <Route path="/payment/:id" element={<PaymentPage />} />
    <Route path="/my-courses" element={<MyCoursesPage />} />
    <Route path="/courses/category/:id" element={<CategoryCoursesPage />} />
    <Route path="/about" element={<AboutPage />} />

    {/* Admin Routes */}
    <Route
      path="/admin/*"
      element={<ProtectedRoute requiredRole="admin" element={<AdminLayout />} />}
    >
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="approve-instructor" element={<AdminApproveInstructors />} />
      <Route path="instructor-report" element={<InstructorReportPage />} />
      <Route path="users-report" element={<UsersReportPage />} />
      <Route path="course-report" element={<CourseReportPage />} />
      <Route path="sales-report" element={<SalesReportPage />} />
    </Route>

    {/* Instructor Routes */}
    <Route
      path="/course-management"
      element={<ProtectedRoute element={<CourseManagementPage />} requiredRole="instructor" />}
    >
      <Route index element={<MyCourses />} />
      <Route path="my-courses" element={<MyCourses />} />
      <Route path="create-course" element={<ComponentCreateCourse />} />
      <Route path="instructor-sales-report" element={<InstructorSalesReport />} />
    </Route>

    <Route
      path="/courses/:id/edit"
      element={<ProtectedRoute element={<EditCoursePage />} requiredRole="instructor" />}
    />
    <Route
      path="/course-management/courses/:courseId/lessons"
      element={<ProtectedRoute element={<ManageLessonsPage />} requiredRole="instructor" />}
    />
    <Route
      path="/course-management/courses/:courseId/videos"
      element={<ProtectedRoute element={<CourseVideos />} requiredRole="instructor" />}
    />

    {/* Not Found Route */}
    <Route path="*" element={<div className="text-center py-10 text-red-500">ບໍ່ພົບໜ້າທີ່ທ່ານຕ້ອງການ</div>} />
  </Routes>
);

// ✅ App หลัก
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Navbar />
        <AppRoutes />
        <Footer />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
