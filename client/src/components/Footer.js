import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white border-t border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
        {/* Brand Column */}
        <div className="space-y-6 md:col-span-2">
          <div className="flex items-center space-x-3">
            <img
              src="/logowhite2.png"
              alt="L-Learning Logo"
              className="w-10 h-10 object-contain"
            />
            <Link
              to="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white"
            >
              L-Learning
            </Link>
          </div>

          <p className="text-blue-100 leading-relaxed">
            ພັດທະນາທັກສະຂອງທ່ານດ້ວຍຫຼັກສູດອອນລາຍທີ່ອອກແບບໂດຍຜູ້ຊ່ຽວຊານດ້ານວິຊາຊີບ
          </p>

          <div className="flex space-x-4">
            {/* Facebook */}
            <a
              href="#"
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            {/* Messenger */}
            <a
              href="#"
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              aria-label="Messenger"
            >
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 0C7.164 0 0 6.716 0 15c0 4.5 2.078 8.517 5.39 11.23v5.485l4.948-2.727C12.316 29.416 14.119 30 16 30c8.836 0 16-6.716 16-15S24.836 0 16 0zm2.253 19.386l-3.678-3.865-7.513 3.865 8.878-9.232 3.596 3.956 7.487-3.956-8.77 9.232z" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href="#"
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653
                -2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
                -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01
                -5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815
                 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-white border-b border-blue-700 pb-2">
            ເມນູຫຼັກ
          </h3>
          <ul className="space-y-3">
            {[
              { path: "/", label: "ໜ້າຫຼັກ", icon: "🏠" },
              { path: "/courses", label: "ຄອສຮຽນ", icon: "📚" },
              { path: "/about", label: "ກ່ຽວກັບເຮົາ", icon: "ℹ️" },
              { path: "/", label: "ຕິດຕໍ່", icon: "📞" }
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center text-blue-100 hover:text-white transition-colors duration-300 group"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-white border-b border-blue-700 pb-2">
            ຕິດຕໍ່ພວກເຮົາ
          </h3>
          <address className="not-italic space-y-4">
            {/* Email */}
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-0.5 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:support@l-learning.com" className="text-blue-100 hover:text-white">
                support@l-learning.com
              </a>
            </div>
            {/* Phone */}
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-0.5 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+85620xxxxxxx" className="text-blue-100 hover:text-white">
                +856 20 77668374
              </a>
            </div>
            {/* Location */}
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-0.5 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-blue-100">ນະຄອນຫຼວງວຽງຈັນ, ປະເທດລາວ</span>
            </div>
          </address>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-blue-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} L-Learning. ສະຫງວນລິຂະສິດທັງໝົດ.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
