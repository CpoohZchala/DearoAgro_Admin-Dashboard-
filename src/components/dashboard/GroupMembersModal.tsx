import React, { useEffect, useState } from 'react';
import { getGroupMembers } from '../../api/groupApi';
import ConfirmDialog from '../dialogs/ConfirmDialog';

interface GroupMembersModalProps {
  groupId: string;
  groupName: string;
  onClose: () => void;
}

const GroupMembersModal: React.FC<GroupMembersModalProps> = ({ groupId, groupName, onClose }) => {
  const [members, setMembers] = useState<any[]>([]);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Members of {groupName}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id} className="text-gray-700">
                {member.fullName} ({member.mobileNumber})
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupMembersModal;