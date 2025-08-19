import { useEffect, useState } from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { getFarmers } from '../../api/farmerApi';
import { getGroups } from '../../api/groupApi';
import { Farmer } from '../../models/Farmer';
import { Leaf, Users, Calendar } from 'lucide-react';
import { GrOrderedList } from 'react-icons/gr';
import { BsQuestion } from 'react-icons/bs';

const DashboardHome: FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await getFarmers();
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch farmers.');
        }
        setFarmers(response.data.map((farmer: any) => new Farmer(farmer)));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getGroups();
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch groups.');
        }
        setGroups(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black mb-6 text-center sm:text-left">
          🌿 Super Admin Dashboard
        </h1>

        {/* Quick Stats */}
        <div className="bg-white border border-green-100 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-green-700 mb-4 text-center sm:text-left">
            📊 Quick Stats
          </h2>
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
              <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm text-center border border-yellow-400 hover:shadow-md transition-shadow">
                <h3 className="text-lg sm:text-xl text-gray-900">Total Farmers</h3>
                <p className="mt-3 sm:mt-5 text-2xl sm:text-3xl font-bold text-black">{farmers.length}</p>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm text-center border border-yellow-400 hover:shadow-md transition-shadow">
                <h3 className="text-lg sm:text-xl text-gray-900">Active Groups</h3>
                <p className="mt-3 sm:mt-5 text-2xl sm:text-3xl font-bold text-black">{groups.length}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {/* Farmers Management */}
          <div className="bg-white border border-green-200 p-4 sm:p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="text-green-600 flex-shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-bold text-green-800 leading-tight">
                Farmers Management
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              View, add, edit, and delete farmers
            </p>
            <Link 
              to="/dashboard/farmers"
              className="inline-block text-yellow-400 hover:text-yellow-800 font-medium text-sm sm:text-base transition-colors"
            >
              Go to Farmers →
            </Link>
          </div>

          {/* Groups */}
          <div className="bg-white border border-green-200 p-4 sm:p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-green-600 flex-shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-bold text-green-800 leading-tight">
                Farmer Groups
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Manage farmer groups and assignments
            </p>
            <Link 
              to="/dashboard/groups"
              className="inline-block text-yellow-400 hover:text-yellow-800 font-medium text-sm sm:text-base transition-colors"
            >
              Go to Groups →
            </Link>
          </div>

          {/* Cultivational Details*/}
          <div className="bg-white border border-green-200 p-4 sm:p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <GrOrderedList className="text-green-600 flex-shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-bold text-green-800 leading-tight">
                Farmer Cultivational Details
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Can view updated cultivational details
            </p>
            <Link 
              to="/dashboard/cropdetails"
              className="inline-block text-yellow-400 hover:text-yellow-800 font-medium text-sm sm:text-base transition-colors"
            >
              Go to Details →
            </Link>
          </div>

          {/* Farmer Inquiries */}
          <div className="bg-white border border-green-200 p-4 sm:p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <BsQuestion className="text-green-600 flex-shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-bold text-green-800 leading-tight">
                Farmer Inquiries
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Can view farmer inquiries
            </p>
            <Link 
              to="/dashboard/farmerinquiries"
              className="inline-block text-yellow-400 hover:text-yellow-800 font-medium text-sm sm:text-base transition-colors"
            >
              Go to Inquiries →
            </Link>
          </div>

          {/* Calendar */}
          <div className="bg-white border border-green-200 p-4 sm:p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-green-600 flex-shrink-0" size={24} />
              <h2 className="text-base sm:text-lg font-bold text-green-800 leading-tight">
                Calendar
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              View and manage events and schedules
            </p>
            <Link 
              to="/dashboard/calendar"
              className="inline-block text-yellow-400 hover:text-yellow-800 font-medium text-sm sm:text-base transition-colors"
            >
              Go to Calendar →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
