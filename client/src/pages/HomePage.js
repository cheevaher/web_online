import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-1 text-center p-10">
        <h1 className="text-4xl font-bold mb-4">
          {user ? `ยินดีต้อนรับกลับ, ${user.name}!` : 'Learn Anytime, Anywhere'}
        </h1>
        <p className="text-lg mb-6">
          {user ? 'เริ่มการเรียนรู้ของคุณวันนี้' : 'Join thousands of students and enhance your skills'}
        </p>
        <Link 
          to={user ? "/courses" : "/login"} 
          className="px-6 py-3 bg-purple-500 text-white text-lg rounded-lg hover:bg-purple-600"
        >
          {user ? "ดูคอร์สเรียน" : "เริ่มต้นใช้งาน"}
        </Link>
      </header>
    </div>
  );
};

export default HomePage;
