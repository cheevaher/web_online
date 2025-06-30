import { Fragment, useEffect, useRef, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFixedNavbar, setShowFixedNavbar] = useState(false);
  const navRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      const nav = navRef.current;
      if (!nav) return;
      const navBottom = nav.getBoundingClientRect().bottom;
      const isOutOfView = navBottom < 0;
      setShowFixedNavbar(isOutOfView);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) return null;
  const role = user?.role?.toLowerCase();

  const NavContent = ({ mobile = false }) => (
    <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img src="/logowhite2.png" alt="Logo" className="w-8 h-8 object-contain" />
        <Link to="/" className="text-2xl font-bold tracking-wide whitespace-nowrap">
          L - Learning
        </Link>
      </div>

      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="hover:underline">ໜ້າຫຼັກ</Link>
          <Link to="/about" className="hover:underline">ກ່ຽວກັບເຮົາ</Link>
          <Link to="/courses" className="hover:underline">ຄອສທັງໝົດ</Link>
        </div>
        {user ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex items-center justify-center w-full rounded-md bg-white bg-opacity-10 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-20 transition">
              👤 {user.name}
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800">
                <div className="py-1">
                  {role === 'admin' && (
                    <>
                      <Menu.Item>{({ active }) => (
                        <Link to="/admin/dashboard" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm')}>🏠 ໜ້າຫຼັກ Admin</Link>
                      )}</Menu.Item>
                      <Menu.Item>{({ active }) => (
                        <Link to="/admin/approve-instructor" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm')}>✅ ອະນຸມັດຜູ້ສອນ</Link>
                      )}</Menu.Item>
                    </>
                  )}
                  {role === 'instructor' && (
                    <Menu.Item>{({ active }) => (
                      <Link to="/course-management" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm')}>🎓 ຈັດການຄອສ</Link>
                    )}</Menu.Item>
                  )}
                  {role !== 'admin' && role !== 'instructor' && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/my-courses" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm')}>
                          📘 ຄອສຂອງຂ້ອຍ
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>{({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={classNames(active ? 'bg-gray-100 text-red-700' : 'text-red-600', 'block w-full text-left px-4 py-2 text-sm')}
                    >
                      🚪 ອອກຈາກລະບົບ
                    </button>
                  )}</Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="bg-white text-indigo-600 font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition text-sm">ເຂົ້າລະບົບ</Link>
            <Link to="/register" className="bg-yellow-400 text-gray-800 font-medium px-4 py-2 rounded-md hover:bg-yellow-300 transition text-sm">ລົງທະບຽນ</Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <nav ref={navRef} className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-md text-white">
        <NavContent />
      </nav>

      {showFixedNavbar && (
        <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-md text-white">
          <NavContent />
        </nav>
      )}

      {menuOpen && (
        <div className="fixed top-12 w-full z-40 md:hidden px-4 pb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
          <div className="flex flex-col gap-2 text-sm font-medium">
            <Link to="/" onClick={() => setMenuOpen(false)}>ໜ້າຫຼັກ</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>ກ່ຽວກັບເຮົາ</Link>
            <Link to="/courses" onClick={() => setMenuOpen(false)}>ຄອສທັງໝົດ</Link>
            {user && role === 'admin' && (
              <>
                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>🏠 ໜ້າຫຼັກ Admin</Link>
                <Link to="/admin/approve-instructor" onClick={() => setMenuOpen(false)}>✅ ອະນຸມັດຜູ້ສອນ</Link>
              </>
            )}
            {user && role === 'instructor' && (
              <Link to="/course-management" onClick={() => setMenuOpen(false)}>🎓 ຈັດການຄອສ</Link>
            )}
            {user && role !== 'admin' && role !== 'instructor' && (
              <Link to="/my-courses" onClick={() => setMenuOpen(false)}>📘 ຄອສຂອງຂ້ອຍ</Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-left text-red-300"
              >
                🚪 ອອກຈາກລະບົບ
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>ເຂົ້າລະບົບ</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>ລົງທະບຽນ</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;