import React, { useEffect, useState } from 'react';
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
    <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-extrabold text-black mb-6">🌿 Super Admin Dashboard</h1>

      {/* Quick Stats */}
      <div className="bg-white border border-green-100 p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-green-700 mb-4">📊 Quick Stats</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2  gap-10">
            <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-yellow-400">
              <h3 className="text-xl text-gray-900">Total Farmers</h3>
              <p className="mt-5 text-3xl font-bold text-black">{farmers.length}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm text-center  border border-yellow-400">
              <h3 className="text-xl text-gray-900 ">Active Groups</h3>
              <p className="mt-5 text-3xl font-bold text-black">{groups.length}</p>
            </div>
             <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-yellow-400">
              <h3 className="text-xl text-gray-900">Total Marketing Officers</h3>
              <p className="mt-5 text-3xl font-bold text-black">{farmers.length}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-10">
        {/* Farmers Management */}
        <div className="bg-white border border-green-200 p-6 rounded-xl hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="text-green-600" size={28} />
            <h2 className="text-lg font-bold text-green-800">Farmers Management</h2>
          </div>
          <p className="text-gray-600 mb-4">View, add, edit, and delete farmers</p>
          <Link 
            to="/dashboard/farmers"
            className="text-yellow-400 hover:text-yellow-800 font-medium"
          >
            Go to Farmers →
          </Link>
        </div>

        {/* Groups */}
        <div className="bg-white border border-green-200 p-6 rounded-xl hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-green-600" size={28} />
            <h2 className="text-lg font-bold text-green-800">Farmer Groups</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage farmer groups and assignments</p>
          <Link 
            to="/dashboard/groups"
            className="text-yellow-400 hover:text-yellow-800 font-medium"
          >
            Go to Groups →
          </Link>
        </div>

         {/* Cultivational Details*/}
         <div className="bg-white border border-green-200 p-6 rounded-xl hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <GrOrderedList className="text-green-600" size={28} />
            <h2 className="text-lg font-bold text-green-800">Farmer Cultivational Details</h2>
          </div>
          <p className="text-gray-600 mb-4">Can view updated cultivational details</p>
          <Link 
            to="/dashboard/cropdetails"
            className="text-yellow-400 hover:text-yellow-800 font-medium"
          >
            Go to Details →
          </Link>
        </div>

        {/* Farmer Inquiries */}
        <div className="bg-white border border-green-200 p-6 rounded-xl hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <BsQuestion className="text-green-600" size={28} />
            <h2 className="text-lg font-bold text-green-800">Farmer Inquiries</h2>
          </div>
          <p className="text-gray-600 mb-4">Can view  farmer inquiries</p>
          <Link 
            to="/dashboard/cropdetails"
            className="text-yellow-400 hover:text-yellow-800 font-medium"
          >
            Go to Details →
          </Link>
        </div>

        {/* Calendar */}
        <div className="bg-white border border-green-200 p-6 rounded-xl hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-green-600" size={28} />
            <h2 className="text-lg font-bold text-green-800">Calendar</h2>
          </div>
          <p className="text-gray-600 mb-4">View and manage events and schedules</p>
          <Link 
            to="/dashboard/calendar"
            className="text-yellow-400 hover:text-yellow-800 font-medium"
          >
            Go to Calendar →
          </Link>
        </div>
      </div>

      
    </div>
  );
};

export default DashboardHome;
