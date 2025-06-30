import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [course, setCourse] = useState(null);
  const [lessonCount, setLessonCount] = useState(0); 
  const [firstLesson, setFirstLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);  // ກວດສອບການຊຳລະເງິນ

  // ສຳລັບຄອສຟຣີ
  const handleStartFreeCourse = async () => {
    if (!user?.token) {
      alert('ກະລຸນາເຂົ້າລະບົບກ່ອນເລີ່ມຮຽນ');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          courseId: id,
          price: 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຄອສຟຣີ');
      }

      setIsPaid(true);
      alert('ບັນທຶກຄອສຟຣີສຳເລັດ! ເລີ່ມຮຽນໄດ້ເລີຍ');
      navigate(`/learn/${id}`);
    } catch (error) {
      console.error('ເກີດຂໍ້ຜິດພາດ:', error);
      alert(error.message || 'ບໍ່ສາມາດເລີ່ມຄອສໄດ້');
    }
  };

  useEffect(() => {
    const fetchCourseAndPaymentStatus = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/courses/${id}`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນຄອສໄດ້');

        const data = await res.json();

        setCourse(data);
        if (data.lesson_count) {
          setLessonCount(parseInt(data.lesson_count, 10));
        }

        let paidStatus = data.price === "0.00";

        if (user?.token && !paidStatus) {
          const paymentRes = await fetch(`http://localhost:4000/api/purchase/check/${id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          if (paymentRes.ok) {
            const paymentData = await paymentRes.json();
            paidStatus = paymentData.hasPurchased;
          } else {
            paidStatus = false;
          }
        }

        setIsPaid(paidStatus);

        const lessonRes = await fetch(`http://localhost:4000/api/courses/${id}/lessons`, {
          headers: {
            Authorization: `Bearer ${user?.token || ''}`,
          },
        });

        if (!lessonRes.ok) throw new Error('ບໍ່ສາມາດໂຫຼດບົດຮຽນໄດ້');

        const lessonData = await lessonRes.json();
        if (Array.isArray(lessonData) && lessonData.length > 0) {
          setFirstLesson(lessonData[0]);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndPaymentStatus();
  }, [id, user]);

  if (loading) return <p className="text-center mt-10 text-lg text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>;
  if (!course) return <p className="text-center mt-10 text-lg text-red-500">ບໍ່ພົບຂໍ້ມູນຄອສ</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="rounded-3xl overflow-hidden shadow-lg mb-10">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-[400px] object-cover"
        />
      </div>

      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">{course.title}</h1>
        <p className="text-lg text-gray-600">{course.description}</p>

        <p className="text-base text-gray-500">
          ຜູ້ສອນ: <span className="font-semibold text-purple-700">{course.instructor_name}</span>
        </p>

        <p className="text-base text-gray-500">
          ຄອສນີ້ມີທັງໝົດ <span className="font-semibold text-purple-600">{lessonCount}</span> ວິດີໂອ
        </p>

        {firstLesson && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800">ຕົວຢ່າງ: {firstLesson.title}</h2>
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <iframe
                src={firstLesson.video_url}
                title={firstLesson.title}
                allowFullScreen
                className="w-full h-[450px] rounded-xl shadow-md"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4 bg-purple-50 p-6 rounded-xl shadow-inner">
          <div>
            <p className="text-gray-600 text-sm">ໝວດໝູ່</p>
            <p className="text-purple-700 font-medium text-base">{course.category}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">ລາຄາ</p>
            <p className="text-purple-700 font-bold text-xl">₭{course.price}</p>
          </div>

          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full transition"
            onClick={() => {
              if (isPaid) {
                navigate(`/learn/${id}`);
              } else {
                if (course.price === "0.00") {
                  handleStartFreeCourse();
                } else {
                  navigate(`/payment/${id}`);
                }
              }
            }}
          >
            {isPaid
              ? "ເລີ່ມຮຽນ"
              : (course.price === "0.00" ? "ເລີ່ມຮຽນຟຣີ" : "ຊື້ຄອສນີ້")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
