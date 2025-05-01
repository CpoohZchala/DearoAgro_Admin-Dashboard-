import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import {
  FaUserFriends,
  FaUsers,
  FaCalendarAlt,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaBars,
  FaBookReader,
} from 'react-icons/fa';
import { FaBookQuran, FaCircleQuestion, FaList } from 'react-icons/fa6';

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
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    navigate('/signin');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Sidebar */}
      <div
        className={`${
          isSidebarExpanded ? 'w-64' : 'w-16'
        } flex-shrink-0 flex flex-col transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-green-900 text-white'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarExpanded && (
            <div className="flex items-center">
              <img src="/Dearo Agro.png" alt="Dearo Agro Logo" className="h-12 mr-2" />
              <div>
                <h1 className="text-2xl font-bold">Dearo Agro</h1>
              </div>
            </div>
          )}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <FaBars />
          </button>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto">
        <Link to="/dashboard" className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center">
            <FaBookReader className="mr-2" />
            {isSidebarExpanded && 'Main Dashboard'}
          </Link>
          <Link to="/dashboard/farmers" className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center">
            <FaUserFriends className="mr-2" />
            {isSidebarExpanded && 'Farmers Information'}
          </Link>
          <Link to="/dashboard/groups" className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center">
            <FaUsers className="mr-2" />
            {isSidebarExpanded && 'Farmer Groups'}
          </Link>
          <Link to="/dashboard/inqueries" className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center">
            <FaCircleQuestion className="mr-2" />
            {isSidebarExpanded && 'Farmer Inquiries'}
          </Link>
          <Link to="/dashboard/updates" className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center">
            <FaList className="mr-2" />
            {isSidebarExpanded && 'Cultivational Updates'}
          </Link>
          <Link to="/dashboard/calendar" className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center">
            <FaCalendarAlt className="mr-2" />
            {isSidebarExpanded && 'Calendar'}
          </Link>
          <Link to="/dashboard/profile" className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center">
            <FaUserCircle className="mr-2" />
            {isSidebarExpanded && 'User Profile'}
          </Link>
        </nav>

        <div className="py-4 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-yellow-500 text-white py-2 px-4 rounded-md"
          >
            {isSidebarExpanded && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Navbar */}
        <div className={`flex items-center justify-between px-6 py-3 border-b fixed top-0 left-0 right-0 z-10 ${
          isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-green-900 text-white border-gray-700'
        }`} style={{ marginLeft: isSidebarExpanded ? '16rem' : '4rem', transition: 'margin-left 0.3s ease' }}>
          <div>{formattedDateTime}</div>
          <button onClick={toggleTheme} className="text-xl focus:outline-none">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Content below navbar */}
        <div className="mt-16 p-6 overflow-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
