import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-300 border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center space-x-3 mb-2.5"> {/* เพิ่ม mb-6 ตรงนี้ */}
            <img src="/logoblack1.png" alt="Logo" className="w-8 h-8 object-contain" />
            <Link to="/" className="text-2xl font-bold text-blue-800 tracking-wide whitespace-nowrap">
              L - Learning
            </Link>
          </div>

          <h3 className="text-lg font-semibold mb-4">
            ຮຽນຮູ້ໄດ້ທຸກທີ່ ແລະ ທຸກເວລາດ້ວຍຄອສອອນໄລນ໌ທີ່ມີຄຸນນະພາບຈາກຜູ້ຊ່ຽວຊານ
          </h3>
        </div>


        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">ເມນູຫຼັກ</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline hover:text-blue-700">🏠 ໜ້າຫຼັກ</Link></li>
            <li><Link to="/courses" className="hover:underline hover:text-blue-700">📚 ຄອສທັງໝົດ</Link></li>
            <li><Link to="/about" className="hover:underline hover:text-blue-700">ℹ️ ກ່ຽວກັບພວກເຮົາ</Link></li>
            <li><Link to="/contact" className="hover:underline hover:text-blue-700">📞 ຕິດຕໍ່</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">ຕິດຕໍ່ພວກເຮົາ</h3>
          <p className="text-sm">
            📧 <a href="mailto:support@l-learning.com" className="hover:underline hover:text-blue-700">support@l-learning.com</a>
          </p>
          <p className="text-sm">📱 ໂທ: +856 20 xxxxxxxx</p>
          <p className="text-sm mt-2">📍 ນະຄອນຫຼວງວຽງຈັນ ປະເທດລາວ</p>
        </div>
      </div>

      <div className="text-center py-4 text-sm bg-blue-100 dark:bg-gray-900 text-gray-700 dark:text-gray-400">
        © {new Date().getFullYear()} Website Selling Online Courses
      </div>
    </footer>
  );
};

export default Footer;
