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
  const [scrolled, setScrolled] = useState(false);

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

      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) return null;
  const role = user?.role?.toLowerCase();

  const NavContent = ({ mobile = false }) => (
    <div className={`max-w-[1440px] mx-auto px-4 py-3 flex items-center justify-between ${mobile ? 'flex-col' : ''}`}>
      <div className="flex items-center space-x-3">
        <img src="/logowhite2.png" alt="Logo" className="w-8 h-8 object-contain" />
        <Link to="/" className="text-xl font-bold tracking-wide whitespace-nowrap text-white">
          <span className="text-yellow-300">L</span>-Learning
        </Link>
      </div>

      <div className="w-full md:hidden mt-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-2xl focus:outline-none absolute top-3 right-4"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className={`${mobile ? 'w-full mt-4' : 'hidden md:flex items-center gap-8'}`}>
        <div className={`flex ${mobile ? 'flex-col gap-4' : 'items-center space-x-8'} text-sm font-medium`}>
          <NavLink to="/" mobile={mobile}>ໜ້າຫຼັກ</NavLink>
          <NavLink to="/about" mobile={mobile}>ກ່ຽວກັບເຮົາ</NavLink>
          <NavLink to="/courses" mobile={mobile}>ຄອສທັງໝົດ</NavLink>
        </div>
        {user ? (
          <Menu as="div" className={`relative inline-block text-left ${mobile ? 'mt-6 w-full' : ''}`}>
            <div className={mobile ? 'mt-6 border-t border-blue-400 pt-4' : ''}>
              <Menu.Button className={`inline-flex items-center justify-center w-full rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all duration-200 ${mobile ? 'w-full justify-between' : ''}`}>
                <div className="flex items-center">
                  <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <span className="text-white font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </div>
                <ChevronDownIcon className={`${mobile ? 'ml-2' : '-mr-1 ml-2'} h-5 w-5`} aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className={`absolute ${mobile ? 'relative mt-2 w-full' : 'right-0 mt-2 w-56'} z-50 origin-top rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 overflow-hidden`}>
                <div className="py-1">
                  {role === 'admin' && (
                    <>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/admin/dashboard"
                            className={classNames(
                              active ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
                              'block px-4 py-2.5 text-sm font-medium flex items-center transition-colors'
                            )}
                          >
                            <div className="w-5 h-5 bg-blue-100 rounded-md mr-3 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                              </svg>
                            </div>
                            ໜ້າຫຼັກ Admin
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/admin/approve-instructor"
                            className={classNames(
                              active ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
                              'block px-4 py-2.5 text-sm font-medium flex items-center transition-colors'
                            )}
                          >
                            <div className="w-5 h-5 bg-blue-100 rounded-md mr-3 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            ອະນຸມັດຜູ້ສອນ
                          </Link>
                        )}
                      </Menu.Item>
                    </>
                  )}
                  {role === 'instructor' && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/course-management"
                          className={classNames(
                            active ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
                            'block px-4 py-2.5 text-sm font-medium flex items-center transition-colors'
                          )}
                        >
                          <div className="w-5 h-5 bg-blue-100 rounded-md mr-3 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                          </div>
                          ຈັດການຄອສ
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                  {role !== 'admin' && role !== 'instructor' && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/my-courses"
                          className={classNames(
                            active ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
                            'block px-4 py-2.5 text-sm font-medium flex items-center transition-colors'
                          )}
                        >
                          <div className="w-5 h-5 bg-blue-100 rounded-md mr-3 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                          </div>
                          ຄອສຂອງຂ້ອຍ
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames(
                          active ? 'bg-red-50 text-red-700' : 'text-red-600',
                          'block w-full text-left px-4 py-2.5 text-sm font-medium flex items-center transition-colors'
                        )}
                      >
                        <div className="w-5 h-5 bg-red-100 rounded-md mr-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        ອອກຈາກລະບົບ
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <div className={`flex ${mobile ? 'flex-col gap-3 mt-6' : 'items-center gap-4'}`}>
            <Link
              to="/login"
              className="bg-white text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm shadow-sm border border-blue-100"
            >
              ເຂົ້າລະບົບ
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 text-sm shadow-md"
            >
              ລົງທະບຽນ
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const NavLink = ({ to, children, mobile }) => (
    <Link
      to={to}
      className={`
        relative text-white hover:text-yellow-300 transition-colors duration-200
        ${mobile ? 'py-2 border-b border-blue-700' : ''}
      `}
      onClick={() => mobile && setMenuOpen(false)}
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );

  return (
    <>
      <nav
        ref={navRef}
        className={`
          bg-gradient-to-r from-blue-800 to-blue-900 shadow-lg text-white
          transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}
        `}
      >
        <NavContent />
      </nav>

      {showFixedNavbar && (
        <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-800 to-blue-900 shadow-lg text-white animate-fadeIn py-3">
          <NavContent />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
        </nav>
      )}

      {menuOpen && (
        <div className="fixed top-12 w-full z-40 md:hidden px-4 pb-4 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-b-xl shadow-lg container mx-auto pt-10">
          <div className="flex flex-col gap-3 text-sm font-medium">
            <NavLink to="/" mobile={true}>ໜ້າຫຼັກ</NavLink>
            <NavLink to="/about" mobile={true}>ກ່ຽວກັບເຮົາ</NavLink>
            <NavLink to="/courses" mobile={true}>ຄອສທັງໝົດ</NavLink>

            {user && role === 'admin' && (
              <>
                <NavLink to="/admin/dashboard" mobile={true}>🏠 ໜ້າຫຼັກ Admin</NavLink>
                <NavLink to="/admin/approve-instructor" mobile={true}>✅ ອະນຸມັດຜູ້ສອນ</NavLink>
              </>
            )}
            {user && role === 'instructor' && (
              <NavLink to="/course-management" mobile={true}>🎓 ຈັດການຄອສ</NavLink>
            )}
            {user && role !== 'admin' && role !== 'instructor' && (
              <NavLink to="/my-courses" mobile={true}>📘 ຄອສຂອງຂ້ອຍ</NavLink>
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
                <Link
                  to="/login"
                  className="bg-white text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm shadow-sm border border-blue-100"
                >
                  ເຂົ້າລະບົບ
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 text-sm shadow-md"
                >
                  ລົງທະບຽນ
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
