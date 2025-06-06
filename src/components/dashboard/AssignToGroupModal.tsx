import React, { useState, useEffect } from 'react';
import { assignFarmerToGroup } from '../../api/groupApi';
import { getFarmers } from '../../api/farmerApi';

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
  const [selectedFarmer, setSelectedFarmer] = useState<string | null>(null);
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

  const handleAssign = async () => {
    if (!selectedFarmer) {
      setError('Please select a farmer');
      return;
    }

    try {
      const response = await assignFarmerToGroup(groupId, selectedFarmer);
      if (!response.success) {
        throw new Error(response.message || 'Failed to assign farmer');
      }
      onAssign(groupId, selectedFarmer);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to assign farmer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Farmer</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <select
          value={selectedFarmer || ''}
          onChange={(e) => setSelectedFarmer(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select a Farmer</option>
          {farmers.map((farmer) => (
            <option key={farmer._id} value={farmer._id}>
              {farmer.fullName}
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
