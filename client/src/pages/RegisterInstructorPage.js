import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterInstructorPage.css';

const RegisterInstructorPage = () => {
  const [instructorName, setInstructorName] = useState('');
  const [instructorTel, setInstructorTel] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [instructorHistory, setInstructorHistory] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);

  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const navigate = useNavigate();

  const checkEmailExists = async (email) => {
    setCheckingEmail(true);
    try {
      const res = await fetch(`http://localhost:4000/api/check-email/${email}`);
      if (!res.ok) throw new Error('ກວດອີເມວຜິດພາດ');
      const data = await res.json();
      setEmailExists(data.exists);
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailExists(false);
      return false;
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('ອັບໂຫຼດຟາຍບໍ່ສຳເລັດ');
      }

      const uploadData = await uploadRes.json();
      return uploadData.fileUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('ອັບໂຫຼດຟາຍບໍ່ສຳເລັດ');
      return null;
    }
  };

  const handleEmailChange = async (e) => {
    const email = e.target.value;
    setInstructorEmail(email);
    if (email) {
      await checkEmailExists(email);
    } else {
      setEmailExists(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!instructorEmail) {
      alert('ກະລຸນາປ້ອນອີເມວ');
      return;
    }

    const exists = await checkEmailExists(instructorEmail);
    if (exists) {
      alert('ອີເມວນີ້ຖືກນຳໃຊ້ແລ້ວ ກະລຸນາໃຊ້ອີເມວອື່ນ');
      return;
    }

    let fileUrl = instructorHistory;
    if (file) {
      const uploadedUrl = await handleFileUpload();
      if (!uploadedUrl) return;
      fileUrl = uploadedUrl;
    }

    const instructorData = {
      instructor_name: instructorName,
      instructor_tel: instructorTel,
      instructor_email: instructorEmail,
      instructor_history: fileUrl,
      address: address,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:4000/api/instructor/register-instructor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instructorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ການລົງທະບຽນຜິດພາດ');
      }

      const data = await response.json();
      alert(data.message || 'ລົງທະບຽນສຳເລັດ');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົງທະບຽນ');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">ລົງທະບຽນຜູ້ສອນ</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700 mb-1">ຊື່ຜູ້ສອນ</label>
              <input
                type="text"
                id="instructorName"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ປ້ອນຊື່"
              />
            </div>

            <div>
              <label htmlFor="instructorTel" className="block text-sm font-medium text-gray-700 mb-1">ເບີໂທ</label>
              <input
                type="tel"
                id="instructorTel"
                value={instructorTel}
                onChange={(e) => setInstructorTel(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="020xxxxxxxx"
              />
            </div>

            <div>
              <label htmlFor="instructorEmail" className="block text-sm font-medium text-gray-700 mb-1">ອີເມວ</label>
              <input
                type="email"
                id="instructorEmail"
                value={instructorEmail}
                onChange={handleEmailChange}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="your@email.com"
              />
              {emailExists && <p className="text-red-600 text-sm mt-1">ອີເມວນີ້ຖືກນຳໃຊ້ແລ້ວ</p>}
              {checkingEmail && <p className="text-sm text-gray-500 mt-1">ກຳລັງກວດອີເມວ...</p>}
            </div>

            <div>
              <label htmlFor="instructorHistory" className="block text-sm font-medium text-gray-700 mb-1">ເອກະສານຢັ້ງຍືນຕົວຕົ້ນ(ບັດປະຈຳຕົວ...)</label>
              <input
                type="file"
                id="instructorHistory"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="block w-full text-sm text-gray-700"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">ທີ່ຢູ່</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ປ້ອນທີ່ຢູ່"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">ລະຫັດຜ່ານ</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={checkingEmail}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ລົງທະບຽນຜູ້ສອນ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterInstructorPage;