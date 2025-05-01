import React, { useState, useEffect } from 'react';
import {assignFarmerToGroup, getGroups } from '../../api/groupApi';
import{getFarmers} from '../../api/farmerApi'

interface Farmer {
  _id: string;
  fullName: string;
}

interface AssignToGroupModalProps {
  groupId: string;
  onClose: () => void;
  onAssign: (groupId: string, farmerId: string) => void;
  onAssignComplete?: (groupId: string) => Promise<void>; // Add optional onAssignComplete property
  farmer?: Farmer;
}

const AssignToGroupModal: React.FC<AssignToGroupModalProps> = ({ groupId, onClose, onAssign }) => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await getFarmers();
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch farmers');
        }
        setFarmers(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchFarmers();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getGroups(); // Assuming getGroups is imported from groupApi
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch groups');
        }
        setGroups(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchGroups();
  }, []);

  const handleAssign = async () => {
    if (!selectedGroup) {
      setError('Please select a group');
      return;
    }

    if (!selectedFarmer) {
      setError('Please select a farmer');
      return;
    }

    console.log('Selected Group:', selectedGroup);
    console.log('Selected Farmer:', selectedFarmer);

    try {
      const response = await assignFarmerToGroup(selectedGroup, selectedFarmer);
      if (!response.success) {
        throw new Error(response.message || 'Failed to assign farmer');
      }
      onAssign(selectedGroup, selectedFarmer);
      onClose();
    } catch (err: any) {
      console.error('Error assigning farmer:', err);
      setError(err.message || 'Failed to assign farmer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Farmer to Group</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <select
          value={selectedFarmer || ''}
          onChange={(e) => setSelectedFarmer(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select a Farmer</option>
          {farmers.map((farmer: Farmer) => (
            <option key={farmer._id} value={farmer._id}>
              {farmer.fullName}
            </option>
          ))}
        </select>
        <select
          value={selectedGroup || ''}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select a Group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={handleAssign} className="bg-green-600 text-white px-4 py-2 rounded">
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignToGroupModal;
