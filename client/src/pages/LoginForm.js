import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // ກວດສອບຟังก์ชัน login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('ກະລຸນາປ້ອນອີເມວ ແລະ ລະຫັດຜ່ານ');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.token) {
        throw new Error('Invalid server response');
      }

      // Decode token
      const decoded = jwtDecode(data.token);

      // ກຳນົດຊື່ user ຕາມ role
      let userName = data.user.name;
      if (decoded.role === 'admin') {
        // ສົມມຸດວ່າ admin ບໍ່ມີຊື່ໃນ data.user.name, ອາດຈະຕ້ອງໃຊ້ຊື່ອື່ນ ຫຼືພຽງແຕ່ຕັ້ງເປັນ 'Admin'
        userName = data.user.name || 'Admin';
      }

      login({
        token: data.token,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: userName,
          role: decoded.role,
        }
      });

      // ປ່ຽນເສັ້ນທາງຫຼັງຈາກເຂົ້າສູ່ລະບົບສຳເລັດ
      if (decoded.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (decoded.role === 'instructor') {
        navigate('/courses');
      } else {
        navigate('/courses');
      }

    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບກະລຸນາລອງໃໝ່ພາຍຫຼັງ';
      if (error.message.includes('credentials')) {
        errorMessage = 'ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ';
      } else if (error.message.includes('network')) {
        errorMessage = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີໄດ້';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">ເຂົ້າສູ່ລະບົບ</h2>
          <p className="mt-2 text-sm text-gray-600">
            ຫຼື{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              ສະໝັກສະມາຊິກໃໝ່
            </Link>
          </p>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                ອີເມວ
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 
                rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                ລະຫັດຜ່ານ
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500
                   text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 
                'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? 'ກຳລັງເຂົ້າສູ່ລະບົບ...' : 'ເຂົ້າສູ່ລະບົບ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;