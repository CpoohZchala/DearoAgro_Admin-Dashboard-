import React from 'react';
import { Farmer } from '../../models/Farmer';

interface ViewDetailsDialogProps {
  farmer: Farmer | null;
  onClose: () => void;
}

const ViewDetailsDialog: React.FC<ViewDetailsDialogProps> = ({ farmer, onClose }) => {
  if (!farmer) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Farmer Details</h2>
        <div className="mb-4">
          <p className="text-gray-500 font-semibold">Name:</p>
          <p className="text-gray-800 text-lg font-medium">{farmer.fullName}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-500 font-semibold">Mobile Number:</p>
          <p className="text-gray-800 text-lg font-medium">{farmer.mobileNumber}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-500 font-semibold">Group Name:</p>
          <p className="text-gray-800 text-lg font-medium">{farmer.groupName || 'Unassigned'}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-4 font-semibold transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewDetailsDialog;