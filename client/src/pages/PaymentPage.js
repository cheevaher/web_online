// // File: PaymentPage.js
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import PaymentForm from './PaymentForm';

// // ໂຫຼດ Stripe.js ດ້ວຍ publishable key ຂອງທ່ານ
// const stripePromise = loadStripe('pk_test_51QeHn3JHCf0lE6qqMCJiwVdcTNoFewxXC42ENeepcNc3aJOzwRJ5OfTkCZHbFC1gStNeX0QT9qjlLBaZwBqtwDh600pmXbYHuB');

// const PaymentPage = () => {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // ດຶງຂໍ້ມູນຄອສຈາກ server
//     const fetchCourse = async () => {
//       const res = await fetch(`http://localhost:4000/api/courses/${id}`);
//       const data = await res.json();
//       setCourse(data);
//       setLoading(false);
//     };

//     fetchCourse();
//   }, [id]);

//   if (loading) return <p className="text-center mt-10">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>;

//   return (
//     <div className="max-w-xl mx-auto px-6 py-12">
//       <h1 className="text-2xl font-bold mb-4 text-gray-800">{course.title}</h1>
//       <p className="text-lg text-gray-600 mb-6">ລາຄາ: ₭{course.price}</p>

//       {/* ເປີດ Elements ສໍາລັບຊຳລະເງິນ */}
//       <Elements stripe={stripePromise}>
//         <PaymentForm amount={course.price} courseId={id} />
//       </Elements>
//     </div>
//   );
// };

// export default PaymentPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { useAuth } from '../context/AuthContext'; // เพิ่มตรงนี้

const stripePromise = loadStripe('pk_test_51QeHn3JHCf0lE6qqMCJiwVdcTNoFewxXC42ENeepcNc3aJOzwRJ5OfTkCZHbFC1gStNeX0QT9qjlLBaZwBqtwDh600pmXbYHuB');

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();  // ดึง user จาก context
  const token = user?.token;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login'); // ถ้าไม่มี token ให้ไปหน้า login เลย
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // ใช้ token จาก context
          },
        });

        if (!res.ok) throw new Error('Unauthorized');

        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error('Fetch error:', error);
        navigate('/login'); // ถ้า token หมดอายุหรือ fetch ไม่ได้
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate, token]);

  if (loading) return <p className="text-center mt-10">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>;

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">{course.title}</h1>
      <p className="text-lg text-gray-600 mb-6">ລາຄາ: ₭{course.price}</p>

      <Elements stripe={stripePromise}>
        <PaymentForm amount={course.price} courseId={id} />
      </Elements>
    </div>
  );
};

export default PaymentPage;