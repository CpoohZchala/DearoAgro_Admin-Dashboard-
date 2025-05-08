import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FaUserFriends, FaUsers, FaCalendarAlt, FaUserCircle,
  FaSun, FaMoon, FaBars, FaBookReader,
  FaCrop,
  FaLeaf
} from 'react-icons/fa';
import { FaBookQuran, FaCircleQuestion, FaList, FaPlantWilt } from 'react-icons/fa6';
import React from 'react';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'Super Admin') {
      navigate('/signin');
    }
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
    { to: '/dashboard/cropdetails', label: 'Crop Details', icon: <FaLeaf/> },
    { to: '/dashboard/inqueries', label: 'Farmer Inquiries', icon: <FaCircleQuestion /> },
    { to: '/dashboard/calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
    { to: '/dashboard/profile', label: 'User Profile', icon: <FaUserCircle /> },
  ];

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} transition-colors`}>
      {/* Sidebar */}
      <div className={`${isSidebarExpanded ? 'w-64' : 'w-20'} flex flex-col bg-green-900 text-white transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b border-green-800">
          {isSidebarExpanded && (
            <div className="flex items-center">
              <img src="/Dearo Agro.png" alt="Logo" className="h-20 mr-2" />
              <h1 className="text-4xl font-bold text-yellow-300">Dearo Agro</h1>
            </div>
          )}
          <button onClick={toggleSidebar} className="text-white">
            <FaBars />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center space-x-3 hover:bg-green-800 px-3 py-2 rounded-md transition-colors"
              title={!isSidebarExpanded ? item.label : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {isSidebarExpanded && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-green-800 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full bg-yellow-400 hover:bg-white text-black font-bold py-2 rounded-md text-sm"
          >
            Logout
          </button>
          <button
            onClick={toggleTheme}
            className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-md flex font-bold items-center justify-center space-x-2 text-sm"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
            {isSidebarExpanded && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex justify-end items-center p-4 shadow-md bg-white dark:bg-green-900 dark:text-white">
          <div className="text-sm">{formattedDateTime}</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
