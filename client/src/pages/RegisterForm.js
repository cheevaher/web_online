import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const navigate = useNavigate();

  const checkEmailExists = async (emailToCheck) => {
    setCheckingEmail(true);
    try {
      const res = await fetch(`http://localhost:4000/api/check-email/${emailToCheck}`);
      if (!res.ok) throw new Error('ການກວດສອບ email ລົ້ມເຫຼວ');
      const data = await res.json();
      setEmailExists(data.exists);
      return data.exists;
    } catch (error) {
      console.error('ຜິດພາດໃນການກວດອີເມວ:', error);
      setEmailExists(false);
      return false;
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleEmailChange = async (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) {
      await checkEmailExists(newEmail);
    } else {
      setEmailExists(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('ລະຫັດຜ່ານບໍ່ກົງກັນ');
      return;
    }

    if (!email) {
      alert('ກະລຸນາປ້ອນອີເມວ');
      return;
    }

    const exists = await checkEmailExists(email);
    if (exists) {
      alert('ອີເມວນີ້ຖືກໃຊ້ແລ້ວ ກະລຸນາໃຊ້ອີເມວອື່ນ');
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ການລົງທະບຽນລົ້ມເຫຼວ');
      }

      const data = await response.json();
      alert('ລົງທະບຽນສຳເລັດແລ້ວ');
      navigate('/login');
    } catch (error) {
      console.error("ເກີດຂໍ້ຜິດພາດໃນການລົງທະບຽນ:", error);
      alert(error.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົງທະບຽນ');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">ລົງທະບຽນ</h2>
          <p className="mt-2 text-sm text-gray-600">
            ຫຼື{' '}
            <span
              onClick={() => navigate('/login')}
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
            >
              ເຂົ້າລະບົບ
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                ຊື່ຜູ້ໃຊ້
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ປ້ອນຊື່ຜູ້ໃຊ້"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                ອີເມວ
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="your@email.com"
              />
              {emailExists && (
                <p className="text-red-600 text-sm mt-1">ອີເມວນີ້ໄດ້ຖືກໃຊ້ແລ້ວ</p>
              )}
              {checkingEmail && (
                <p className="text-sm text-gray-500 mt-1">ກຳລັງກວດອີເມວ...</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                ລະຫັດຜ່ານ
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                ຢືນຢັນລະຫັດຜ່ານ
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={checkingEmail}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              ລົງທະບຽນ
            </button>

            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => navigate('/login')}
            >
              ເຂົ້າລະບົບ
            </button>
          </div>

          {/* <div className="text-center mt-4">
            <p className="text-sm">
              ຕ້ອງການລົງທະບຽນເປັນຜູ້ສອນ?{' '}
              <span
                onClick={() => navigate('/register-instructor')}
                className="text-blue-600 font-medium hover:underline cursor-pointer"
              >
                ກົດທີ່ນີ້
              </span>
            </p>
          </div> */}
          <div className="text-center mt-6">
            <p className="text-lg font-semibold text-gray-800">
              ຕ້ອງການລົງທະບຽນເປັນຜູ້ສອນ?{' '}
              <span
                onClick={() => navigate('/register-instructor')}
                className="text-blue-700 underline hover:text-blue-900 cursor-pointer transition"
              >
                ກົດທີ່ນີ້
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
