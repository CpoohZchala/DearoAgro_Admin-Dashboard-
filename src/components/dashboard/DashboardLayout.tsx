import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import { FaUserFriends, FaUsers, FaCalendarAlt, FaUserCircle, FaSun, FaMoon, FaBars, FaRegQuestionCircle } from 'react-icons/fa'; // Import icons
import { FaCircleQuestion, FaList } from 'react-icons/fa6';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark/light mode
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // State for sidebar expansion

  

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'Super Admin') {
      navigate('/signin');
    }
  }, [navigate]);

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
                <p className="text-green-200 text-sm">Super Admin Dashboard</p>
              </div>
            </div>
          )}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <FaBars />
          </button>
        </div>
        <nav className="mt-6 flex-1 overflow-y-auto">
          <div>
            <Link
              to="/dashboard/farmers"
              className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center"
            >
              <FaUserFriends className="mr-2" />
              {isSidebarExpanded && 'Farmers Information'}
            </Link>
            <Link
              to="/dashboard/groups"
              className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center"
            >
              <FaUsers className="mr-2" />
              {isSidebarExpanded && 'Farmer Groups'}
            </Link>
            <Link
              to="/dashboard/groups"
              className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center"
            >
              <FaCircleQuestion className="mr-2" />
              {isSidebarExpanded && 'Farmer Inqueries'}
            </Link>
            <Link
              to="/dashboard/groups"
              className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center"
            >
              <FaList className="mr-2" />
              {isSidebarExpanded && 'Cultivational Updates'}
            </Link>
            <Link
              to="/dashboard/calendar"
              className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center"
            >
              <FaCalendarAlt className="mr-2" />
              {isSidebarExpanded && 'Calendar'}
            </Link>
            <Link
              to="/dashboard/profile"
              className="py-2 px-4 hover:bg-green-700 rounded-md mx-2 flex items-center"
            >
              <FaUserCircle className="mr-2" />
              {isSidebarExpanded && 'User Profile'}
            </Link>
          </div>
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navigation Bar */}
        <div className={`p-4 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            onClick={toggleTheme}
            className="flex items-center px-4 py-2 rounded-md focus:outline-none"
          >
            {isDarkMode ? (
              <><FaSun className="mr-2" /> Light Mode</>
            ) : (
              <><FaMoon className="mr-2" /> Dark Mode</>
            )}
          </button>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
