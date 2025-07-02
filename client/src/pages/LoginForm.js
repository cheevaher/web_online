import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');
      if (!data.token) throw new Error('Invalid server response');

      const decoded = jwtDecode(data.token);
      let userName = data.user.name || 'Admin';

      login({
        token: data.token,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: userName,
          role: decoded.role,
        },
      });

      // Navigate after login
      if (decoded.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/courses');
      }

    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການເຂົ້າລະບົບ';

      if (error.message.includes('credentials')) {
        errorMessage = 'ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ';
      } else if (error.message.includes('network')) {
        errorMessage = 'ບໍ່ສາມາດເຊື່ອມກັບເຊີບເວີ';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-md mb-3">
            <img src="/logowhite2.png" alt="Logo" className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">ເຂົ້າສູ່ລະບົບ</h2>
          <p className="text-sm text-gray-500 mt-1">ກະລຸນາໃສ່ຂໍ້ມູນຂອງທ່ານ</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg border border-red-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                ອີເມວ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                ລະຫັດຜ່ານ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-500"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                ຈື່ຈຳຂ້ອຍ
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                ລືມລະຫັດຜ່ານ?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ກຳລັງເຂົ້າ...
                </>
              ) : (
                'ເຂົ້າລະບົບ'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500">
          ຍັງບໍ່ໄດ້ເປັນສະມາຊິກ?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            ສະໝັກສະມາຊິກໃໝ່
          </Link>
        </div>

        {/* Social Login */}
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ຫຼືເຂົ້າລະບົບດ້ວຍ</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">GitHub</span>
              </button>
            </div>

            <div>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.145-2.675-6.735-2.675-5.522 0-10 4.479-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.67-0.069-1.325-0.189-1.955h-9.811z" fill="#EA4335" />
                  <path d="M5.545 12c0-0.843 0.145-1.65 0.406-2.397l-3.2-2.489c-0.832 1.678-1.302 3.58-1.302 5.586 0 1.966 0.453 3.828 1.253 5.478l3.251-2.518c-0.263-0.801-0.408-1.66-0.408-2.56z" fill="#FBBC05" />
                  <path d="M12.545 4.75c1.688 0 3.204 0.581 4.396 1.716l3.299-3.299c-2.008-1.864-4.615-2.99-7.695-2.99-4.522 0-8.432 2.62-10.25 6.43l3.2 2.489c0.78-2.34 2.92-4.346 5.45-4.346z" fill="#4285F4" />
                  <path d="M12.545 19.25c-2.53 0-4.67-1.987-5.45-4.326l-3.2 2.489c1.818 3.81 5.728 6.43 10.25 6.43 3.015 0 5.734-1.093 7.781-2.89l-3.251-2.518c-1.178 0.791-2.67 1.235-4.33 1.235z" fill="#34A853" />
                </svg>
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LoginForm;