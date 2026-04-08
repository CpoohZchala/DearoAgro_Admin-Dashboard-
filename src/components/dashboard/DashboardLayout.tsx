import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FaUserFriends, FaUsers, FaCalendarAlt, FaUserCircle,
  FaSun, FaMoon, FaBars, FaBookReader,
  FaLeaf, FaUser, FaCarrot, FaCartPlus, FaBell,
  FaCrop
} from 'react-icons/fa';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageTransition from '../PageTransition';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'Super Admin') navigate('/signin');
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentTime.toLocaleString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  const navItems = [
    { to: '/dashboard', label: 'Main Dashboard', icon: <FaBookReader /> },
    { to: '/dashboard/farmers', label: 'Farmers Information', icon: <FaUserFriends /> },
    { to: '/dashboard/groups', label: 'Farmer Groups', icon: <FaUsers /> },
    { to: '/dashboard/cropdetails', label: 'Crop Details', icon: <FaLeaf /> },
    // { to: '/dashboard/inqueries', label: 'Farmer Inquiries', icon: <FaQuestionCircle /> },
    { to: '/dashboard/officers', label: 'Marketing Officers', icon: <FaUser /> },
    { to: '/dashboard/managecrops', label: 'Manage Crops', icon: <FaCrop /> },
    { to: '/dashboard/products', label: 'Our Products', icon: <FaBell /> },
    //  { to: '/dashboard/crop', label: 'Create New Product', icon: <FaCartPlus /> },
    { to: '/dashboard/harvest', label: 'Harvest Details', icon: <FaCarrot /> },
    { to: '/dashboard/orders', label: 'Order Requests', icon: <FaCartPlus /> },
    { to: '/dashboard/calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
    { to: '/dashboard/profile', label: 'User Profile', icon: <FaUserCircle /> },

  ];

  return (
    <div className={`flex h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-20'} bg-green-900 shadow-lg text-white flex flex-col`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-800">
          {isSidebarExpanded && (
            <div className="flex items-center gap-2">
              <img src="/Dearo Agro.png" alt="Logo" className="h-12 w-12 rounded-full" />
              <h1 className="text-xl font-bold text-yellow-300">Dearo Agro</h1>
            </div>
          )}
          <button onClick={toggleSidebar} className="text-white text-lg hover:text-yellow-400">
            <FaBars />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <motion.div
              key={item.to}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link
                to={item.to}
                className="flex items-center gap-3 hover:bg-green-800 px-4 py-2 rounded-lg transition-colors duration-200"
                title={!isSidebarExpanded ? item.label : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                {isSidebarExpanded && <span className="text-sm">{item.label}</span>}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-green-800 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-md text-sm transition"
          >
            Logout
          </button>
          <button
            onClick={toggleTheme}
            className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-md flex items-center justify-center gap-2 text-sm"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
            {isSidebarExpanded && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className={`flex justify-end items-center p-4 shadow-md ${isDarkMode ? 'bg-green-950 text-white' : 'bg-white'}`}>
          <div className="text-sm font-medium">{formattedDateTime}</div>
        </header>

        {/* Main Outlet */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-green-950 dark:via-green-900 dark:to-green-800 transition-all duration-300">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
