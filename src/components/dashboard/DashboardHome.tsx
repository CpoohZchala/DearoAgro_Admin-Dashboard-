import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { getFarmers } from '../../api/farmerApi';
import { Farmer } from '../../models/Farmer';

const DashboardHome: FC = () => {

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await getFarmers();
        console.log('Dashboard API Response:', response);
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch farmers.');
        }
        setFarmers(response.data.map((farmer: any) => new Farmer(farmer)));
      } catch (err: any) {
        console.error('Error fetching farmers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        {/* Farmers Management */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Farmers Management</h2>
          <p className="mb-4">View, add, edit, and delete farmers</p>
          <Link 
            to="/dashboard/farmers" 
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Go to Farmers →
          </Link>
        </div>


        {/* Farmer Groups */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Farmer Groups</h2>
          <p className="mb-4">Manage farmer groups and assignments</p>
          <Link 
            to="/dashboard/groups" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go to Groups →
          </Link>
        </div>

        {/* Calendar */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Calendar</h2>
          <p className="mb-4">View and manage events and schedules</p>
          <Link 
            to="/dashboard/calendar" 
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Go to Calendar →
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">Total Farmers</h3>
              <p className="text-2xl font-bold">{farmers.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">Active Groups</h3>
              <p className="text-2xl font-bold">0</p> {/* Static for now */}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700">Recent Activity</h3>
              <p className="text-2xl font-bold">0</p> {/* Static for now */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
