import { useState, useEffect } from 'react';
import { getFarmerGroups, assignFarmerToGroup } from '../../api/farmerApi';
import React from 'react';

interface Group {
  id: string;
  name: string;
}

interface Farmer {
  id: string;
  fullName: string;
  mobileNumber: string;
}

interface AssignToGroupModalProps {
  farmer: Farmer;
  onClose: () => void;
  onAssign: (groupId: string) => void;
}

const AssignToGroupModal = ({ farmer, onClose, onAssign }: AssignToGroupModalProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getFarmerGroups();
        if (response.success && Array.isArray(response.data)) {
          setGroups(response.data);
        } else {
          throw new Error(response.message || 'Invalid response format');
        }
      } catch (err) {
        setError('Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleAssign = async () => {
    if (!selectedGroup) return;

    try {
      const response = await assignFarmerToGroup(farmer.id, selectedGroup);
      if (response.success) {
        onAssign(selectedGroup);
      } else {
        throw new Error(response.message || 'Failed to assign group');
      }
    } catch (err) {
      setError('Failed to assign group');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Farmer to Group</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Farmer: {farmer.fullName} ({farmer.mobileNumber})
          </label>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="group">
              Select Group
            </label>
            <select
              id="group"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a group</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={!selectedGroup}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignToGroupModal;
