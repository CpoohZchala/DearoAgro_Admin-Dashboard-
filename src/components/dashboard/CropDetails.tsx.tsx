import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Farmer {
  _id: string;
  fullName: string;
  mobileNumber: string;
  groupName?: string;
}

interface CropDetail {
  _id: string;
  memberId: string;
  cropCategory: string;
  cropName: string;
  address: string;
  startDate: string;
  district: string;
  city: string;
}

const CropDetails: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [cropDetails, setCropDetails] = useState<CropDetail[]>([]);
  const [loadingFarmers, setLoadingFarmers] = useState<boolean>(true);
  const [loadingCrops, setLoadingCrops] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all farmers on component mount
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get<Farmer[]>('/api/farmers');
        if (Array.isArray(response.data)) {
          setFarmers(response.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError('Failed to fetch farmers');
        setFarmers([]); // Ensure farmers is always an array
        console.error('Error fetching farmers:', err);
      } finally {
        setLoadingFarmers(false);
      }
    };

    fetchFarmers();
  }, []);

  // Fetch crop details when selected farmer changes
  useEffect(() => {
    if (!selectedFarmer) return;

    const fetchCropDetails = async () => {
      setLoadingCrops(true);
      try {
        const response = await axios.get<CropDetail[]>(`/api/cultivation/fetch/${selectedFarmer._id}`);
        setCropDetails(response.data);
        setLoadingCrops(false);
      } catch (err) {
        setError('Failed to fetch crop details');
        setLoadingCrops(false);
        console.error('Error fetching crop details:', err);
      }
    };

    fetchCropDetails();
  }, [selectedFarmer]);

  const handleFarmerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const farmerId = e.target.value;
    const farmer = farmers.find(f => f._id === farmerId) || null;
    setSelectedFarmer(farmer);
  };

  if (loadingFarmers) {
    return <div className="text-center py-8">Loading farmers...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Farmer Crop Details</h1>
      
      {/* Farmer Selection Dropdown */}
      <div className="mb-8">
        <label htmlFor="farmer-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Farmer
        </label>
        <select
          id="farmer-select"
          onChange={handleFarmerChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedFarmer?._id || ''}
        >
          <option value="">-- Select a farmer --</option>
          {Array.isArray(farmers) && farmers.map((farmer) => (
            <option key={farmer._id} value={farmer._id}>
              {farmer.fullName} ({farmer.mobileNumber})
            </option>
          ))}
        </select>
      </div>

      {/* Farmer Information */}
      {selectedFarmer && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Farmer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium text-gray-700">Full Name:</span>
              <span className="ml-2">{selectedFarmer.fullName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Mobile:</span>
              <span className="ml-2">{selectedFarmer.mobileNumber}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Group:</span>
              <span className="ml-2">{selectedFarmer.groupName || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Crop Details */}
      {loadingCrops && selectedFarmer && (
        <div className="text-center py-4">Loading crop details...</div>
      )}

      {!loadingCrops && cropDetails.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Crop Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropDetails.map((crop) => (
              <div key={crop._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">{crop.cropName}</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2">{crop.cropCategory}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Address:</span>
                    <span className="ml-2">{crop.address}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Start Date:</span>
                    <span className="ml-2">{new Date(crop.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">District:</span>
                    <span className="ml-2">{crop.district}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">City:</span>
                    <span className="ml-2">{crop.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loadingCrops && selectedFarmer && cropDetails.length === 0 && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg">
          No crop details found for selected farmer.
        </div>
      )}
    </div>
  );
};

export default CropDetails;