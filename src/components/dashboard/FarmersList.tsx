import { useState, useEffect } from 'react';
import { getFarmers, deleteFarmer, getFarmerById } from '../../api/farmerApi';
import { Farmer } from '../../models/Farmer';
import FarmerForm from './FarmerForm';
import AssignToGroupModal from './AssignToGroupModal';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

const FarmersList = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await getFarmers();
        console.log('API Response:', response);
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch farmers. Please try again later.');
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      try {
        const response = await deleteFarmer(id);
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete farmer');
        }
        setFarmers(farmers.filter(farmer => farmer.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setShowForm(true);
  };

  const handleAssign = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setShowAssignModal(true);
  };

  const handleFormSubmit = (newFarmer: Farmer) => {
    if (editingFarmer) {
      setFarmers(farmers.map(f => f.id === newFarmer.id ? newFarmer : f));
    } else {
      setFarmers([...farmers, newFarmer]);
    }
    setShowForm(false);
    setEditingFarmer(null);
  };

  const handleFetchFarmerById = async (id: string) => {
    try {
      const response = await getFarmerById(id);
      console.log('Farmer Details:', response);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch farmer details.');
      }
      alert(`Farmer Details: ${JSON.stringify(response.data)}`);
    } catch (err: any) {
      console.error('Error fetching farmer details:', err);
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Farmers Management</h2>
        <button
          onClick={() => { setShowForm(true); setEditingFarmer(null); }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
           <FaPlus></FaPlus>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">
            Total Farmers: <span className="text-2xl">{farmers.length}</span>
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {farmers.map((farmer) => (
                  <tr key={farmer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{farmer.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.mobileNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{typeof farmer.groupName === 'string' ? farmer.groupName : 'Unassigned'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => handleEdit(farmer)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(farmer.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleAssign(farmer)}
                        className="text-green-600 hover:underline"
                      >
                        Assign to Group
                      </button>
                      <button
                        onClick={() => handleFetchFarmerById(farmer.id)}
                        className="text-purple-600 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <FarmerForm
          farmer={editingFarmer || undefined}
          onClose={() => { setShowForm(false); setEditingFarmer(null); }}
          onSubmit={handleFormSubmit}
        />
      )}

      {showAssignModal && selectedFarmer && (
        <AssignToGroupModal
          farmer={selectedFarmer}
          onClose={() => setShowAssignModal(false)}
          onAssign={(groupId: string) => {
            if (selectedFarmer) {
              const updatedFarmer = { ...selectedFarmer, groupId };
              setFarmers(farmers.map(f => f.id === updatedFarmer.id ? updatedFarmer : f));
            }
            setShowAssignModal(false);
          }}
        />
      )}
    </div>
  );
};

export default FarmersList;
