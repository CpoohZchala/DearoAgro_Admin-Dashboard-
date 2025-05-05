import React, { useEffect, useState } from 'react';
import { getGroupMembers, removeFarmerFromGroup } from '../../api/groupApi';

interface Farmer {
  id: string;
  fullName: string;
  mobileNumber: string;
}

interface GroupMembersModalProps {
  groupId: string;
  groupName: string;
  onClose: () => void;
}

const GroupMembersModal: React.FC<GroupMembersModalProps> = ({ groupId, groupName, onClose }) => {
  const [members, setMembers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getGroupMembers(groupId);
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch group members.');
        }
        setMembers(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleDelete = async (farmerId: string) => {
    try {
      console.log('Deleting farmer with groupId:', groupId, 'and farmerId:', farmerId);
      const response = await removeFarmerFromGroup(groupId, farmerId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to remove farmer from group.');
      }
      setMembers((prevMembers) => prevMembers.filter((member) => member.id !== farmerId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-green-300">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Farmers in {groupName}</h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {members.map((member) => (
              <li key={member.id} className="py-4 flex items-center justify-between">
                <span className="text-gray-800 font-medium">{member.fullName}</span>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupMembersModal;