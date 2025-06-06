import React, { useState, useEffect } from "react";
import axios from "axios";

interface Farmer {
  _id: string;
  fullName: string;
}

interface Inquiry {
  _id: string;
  title: string;
  description: string;
  date: string;
  imagePath?: string;
  documentPath?: string;
  status: string;
}

const FarmerInquirie: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingFarmers, setLoadingFarmers] = useState<boolean>(true);
  const [loadingInquiries, setLoadingInquiries] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all farmers on component mount
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get<Farmer[]>("/api/farmers");
        if (
          response.headers["content-type"]?.includes("application/json") &&
          Array.isArray(response.data)
        ) {
          setFarmers(response.data);
        } else {
          throw new Error("Invalid data format or non-JSON response");
        }
      } catch (err) {
        setError("Failed to fetch farmers");
        setFarmers([]);
        console.error("Error fetching farmers:", err);
      } finally {
        setLoadingFarmers(false);
      }
    };

    fetchFarmers();
  }, []);

  // Fetch inquiries when selected farmer changes
  useEffect(() => {
    if (!selectedFarmer) return;

    const fetchInquiries = async () => {
      setLoadingInquiries(true);
      try {
        const url = `/tinquiries/farmer/${selectedFarmer._id}`;
        const response = await axios.get<Inquiry[]>(url);
        setInquiries(response.data);
      } catch (err) {
        setError("Failed to fetch inquiries");
        console.error("Error fetching inquiries:", err);
      } finally {
        setLoadingInquiries(false);
      }
    };

    fetchInquiries();
  }, [selectedFarmer]);

  const handleFarmerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const farmerId = e.target.value;
    const farmer = farmers.find((f) => f._id === farmerId) || null;
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
      <h1 className="text-2xl font-bold mb-6">Farmer Inquiries</h1>

      {/* Farmer Selection Dropdown */}
      <div className="mb-8">
        <label
          htmlFor="farmer-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Farmer
        </label>
        <select
          id="farmer-select"
          onChange={handleFarmerChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedFarmer?._id || ""}
        >
          <option value="">-- Select a farmer --</option>
          {farmers.map((farmer) => (
            <option key={farmer._id} value={farmer._id}>
              {farmer.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Inquiry Details */}
      {loadingInquiries && selectedFarmer && (
        <div className="text-center py-4">Loading inquiries...</div>
      )}

      {!loadingInquiries && inquiries.length > 0 && (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-4 text-indigo-500">
                Inquiry Details
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <span className="ml-2 text-gray-900">{inquiry.title}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <span className="ml-2 text-gray-900">{inquiry.description}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(inquiry.date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2 text-gray-900">{inquiry.status}</span>
                </div>
                {inquiry.imagePath && (
                  <div>
                    <span className="font-medium text-gray-700">Image:</span>
                    <a
                      href={inquiry.imagePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-indigo-500 underline"
                    >
                      View Image
                    </a>
                  </div>
                )}
                {inquiry.documentPath && (
                  <div>
                    <span className="font-medium text-gray-700">Document:</span>
                    <a
                      href={inquiry.documentPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-indigo-500 underline"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loadingInquiries && selectedFarmer && inquiries.length === 0 && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg">
          No inquiries found for selected farmer.
        </div>
      )}
    </div>
  );
};

export default FarmerInquirie;