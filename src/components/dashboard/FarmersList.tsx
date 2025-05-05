import { useState, useEffect } from 'react';
import { getFarmers, deleteFarmer, getFarmerById } from '../../api/farmerApi';
import { assignFarmerToGroup, getGroups } from '../../api/groupApi';
import { Farmer } from '../../models/Farmer';
import FarmerForm from './FarmerForm';
import AssignToGroupModal from './AssignToGroupModal';
import ConfirmDialog from '../dialogs/ConfirmDialog';
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [farmerToDelete, setFarmerToDelete] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<{ [key: string]: string }>({});
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchFarmersAndGroups = async () => {
      try {
        const [farmersResponse, groupsResponse] = await Promise.all([getFarmers(), getGroups()]);

        console.log('Raw Farmers Data:', farmersResponse.data); // Debugging log
        console.log('Groups Response:', groupsResponse); // Debugging log

        if (!farmersResponse.success || !groupsResponse.success) {
          throw new Error('Failed to fetch farmers or groups.');
        }

        const groupsMap = new Map(
          groupsResponse.data.map((group: any) => [group._id, group.name])
        );

        console.log('Groups Map:', groupsMap); // Debugging log

        farmersResponse.data.forEach((farmer: any) => {
          console.log('Farmer groupId:', farmer.groupId, 'Mapped groupName:', groupsMap.get(farmer.groupId));
        });

        const farmersWithGroupNames = farmersResponse.data.map((farmer: any) => ({
          ...farmer,
          groupName: groupsMap.get(farmer.groupId) || 'Unassigned',
        }));

        console.log('Farmers with Group Names:', farmersWithGroupNames); // Debugging log

        setFarmers(farmersWithGroupNames);
      } catch (err: any) {
        console.error('Error fetching farmers or groups:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmersAndGroups();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await getGroups();
      if (response.success) {
        setGroups(response.data);
      } else {
        console.error('Failed to fetch groups:', response.message);
      }
    };

    fetchGroups();
  }, []);

  const handleDeleteClick = (id: string) => {
    setFarmerToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (farmerToDelete) {
      try {
        const response = await deleteFarmer(farmerToDelete);
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete farmer');
        }
        setFarmers(farmers.filter(farmer => farmer._id !== farmerToDelete));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setShowConfirmDialog(false);
        setFarmerToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setFarmerToDelete(null);
  };

  const handleEdit = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setShowForm(true);
  };

  const handleAssign = (farmer: Farmer) => {
    if (!farmer.groupId) {
      setError('This farmer is not associated with any group. Please assign a group first.');
      return;
    }
    setSelectedFarmer(farmer);
    setShowAssignModal(true);
  };

  const handleAssignGroup = async (farmerId: string) => {
    const groupId = selectedGroupId[farmerId];
    if (!groupId) {
      alert('Please select a group before assigning.');
      return;
    }

    try {
      const response = await assignFarmerToGroup(groupId, farmerId);
      if (response.success) {
        alert('Farmer assigned to group successfully!');
        setFarmers(prevFarmers => prevFarmers.map(farmer =>
          farmer._id === farmerId ? { ...farmer, groupId, groupName: groups.find(group => group._id === groupId)?.name || 'Unassigned' } : farmer
         ));
        // Clear the selected group for the farmer after assignment
        setSelectedGroupId(prev => ({ ...prev, [farmerId]: '' }));
      } else {
        throw new Error(response.message || 'Failed to assign farmer to group.');
      }
    } catch (error: any) {
      console.error('Error assigning farmer to group:', error);
      alert(error.message);
    }
  };

  const renderAssignGroupButton = (farmer: Farmer) => (
    <div className="flex items-center space-x-2">
      <select
        value={selectedGroupId[farmer._id] || ''}
        onChange={(e) => setSelectedGroupId(prev => ({ ...prev, [farmer._id]: e.target.value }))}
        className="border border-gray-300 rounded-md px-2 py-1"
      >
        <option value="">Select Group</option>
        {groups.map(group => (
          <option key={group._id} value={group._id}>{group.name}</option>
        ))}
      </select>
      <button
        onClick={() => handleAssignGroup(farmer._id)}
        className="text-orange-600 hover:underline"
      >
        Assign Group
      </button>
    </div>
  );

  const handleFormSubmit = (newFarmer: Farmer) => {
    if (editingFarmer) {
      setFarmers(farmers.map(f => f._id === newFarmer._id ? newFarmer : f));
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
        <h2 className="text-3xl font-extrabold text-black  px-4 py-2 ">📂Farmers Management</h2>
        <button
          onClick={() => { setShowForm(true); setEditingFarmer(null); }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
           <FaPlus />
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
                  <tr key={farmer._id?.toString()}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{farmer.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.mobileNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{typeof farmer.groupName === 'string' ? farmer.groupName : 'Unassigned'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-y-2">
                      <button
                        onClick={() => handleEdit(farmer)}
                        className="text-blue-600 hover:underline block"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(farmer._id?.toString() || '')}
                        className="text-red-600 hover:underline block"
                      >
                        Delete
                      </button>
                      {renderAssignGroupButton(farmer)}
                      <button
                        onClick={() => handleFetchFarmerById(farmer._id?.toString() || '')}
                        className="text-purple-600 hover:underline block"
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
          groupId={selectedFarmer.groupId || ''} // Pass an empty string if groupId is missing
          farmer={selectedFarmer}
          onClose={() => setShowAssignModal(false)}
          onAssign={(groupId: string) => {
            if (selectedFarmer) {
              const updatedFarmer = { ...selectedFarmer, groupId };
              setFarmers(farmers.map(f => f._id === updatedFarmer._id ? updatedFarmer : f));
            }
            setShowAssignModal(false);
          }}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this farmer?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default FarmersList;
