import React, { useState, useEffect } from "react";
import axios from "axios";

interface Farmer {
  _id: string;
  fullName: string;
  mobileNumber: string;
  groupName?: string;
  branchName?: string;
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
  nic: string;
  cropYieldSize: number;
}

interface CropUpdate {
  _id: string;
  memberId: string;
  addDate: string;
  description: string;
  fertilizerType?: string;
  fertilizerAmount?: number;
  fertilizerUnit?: string;
  fertilizerDetails?: {
    fertilizerType?: string;
    fertilizerAmount?: number;
    fertilizerUnit?: string;
  };
}

interface CropExpense {
  _id: string;
  memberId: string;
  addDate: string;
  description: string;
  expense: number;
}

const CropDetails: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [cropDetails, setCropDetails] = useState<CropDetail[]>([]);
  const [cropUpdates, setCropUpdates] = useState<CropUpdate[]>([]);
  const [cropExpenses, setCropExpenses] = useState<CropExpense[]>([]);
  const [loadingFarmers, setLoadingFarmers] = useState<boolean>(true);
  const [loadingCrops, setLoadingCrops] = useState<boolean>(false);
  const [loadingUpdates, setLoadingUpdates] = useState<boolean>(false);
  const [loadingExpenses, setLoadingExpenses] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("currentMonth");

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

  // Fetch crop details when selected farmer changes
  useEffect(() => {
    if (!selectedFarmer) return;

    const fetchCropDetails = async () => {
      setLoadingCrops(true);
      try {
        const url = `/api/fetch/${selectedFarmer._id}`;
        console.log("Fetching crop details from:", url);
        const response = await axios.get<CropDetail[]>(url);
        setCropDetails(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("No crop details found for this farmer");
        } else {
          setError("Failed to fetch crop details");
        }
        console.error("Error fetching crop details:", err);
      } finally {
        setLoadingCrops(false);
      }
    };

    const fetchCropUpdates = async () => {
      setLoadingUpdates(true);
      try {
        const url = `/api/cropfetch/${selectedFarmer._id}`;
        console.log("Fetching crop updates from:", url);
        const response = await axios.get<CropUpdate[]>(url);
        setCropUpdates(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("No crop updates found for this farmer");
        } else {
          setError("Failed to fetch crop updates");
        }
        console.error("Error fetching crop updates:", err);
      } finally {
        setLoadingUpdates(false);
      }
    };

    const fetchCropExpenses = async () => {
      setLoadingExpenses(true);
      try {
        const url = `/api/efetch/${selectedFarmer._id}`;
        console.log("Fetching crop expenses from:", url);
        const response = await axios.get<CropExpense[]>(url);
        setCropExpenses(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("No crop expenses found for this farmer");
        } else {
          setError("Failed to fetch crop expenses");
        }
        console.error("Error fetching crop expenses:", err);
      } finally {
        setLoadingExpenses(false);
      }
    };

    fetchCropDetails();
    fetchCropUpdates();
    fetchCropExpenses();
  }, [selectedFarmer]);

  const handleFarmerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const farmerId = e.target.value;
    const farmer = farmers.find((f) => f._id === farmerId) || null;
    setSelectedFarmer(farmer);
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
  };

  const handleFilterOptionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterOption(e.target.value);
  };

  const filteredUpdates = cropUpdates.filter((update) => {
    const updateDate = new Date(update.addDate);

    if (filterOption === "currentMonth") {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return (
        updateDate.getMonth() === currentMonth &&
        updateDate.getFullYear() === currentYear
      );
    } else if (filterOption === "specificDate" && filterDate) {
      const formattedUpdateDate = updateDate.toLocaleDateString("en-CA");
      return formattedUpdateDate === filterDate;
    }

    return true;
  });

  const updatesWithFertilizerDetails = filteredUpdates.map((update) => {
    if (update.description === "පොහොර යෙදීම") {
      return {
        ...update,
        fertilizerDetails: {
          fertilizerType: update.fertilizerType,
          fertilizerAmount: update.fertilizerAmount,
          fertilizerUnit: update.fertilizerUnit,
        },
      };
    }
    return update;
  });

  if (loadingFarmers) {
    return <div className="text-center py-8">Loading farmers...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Farmer Crop Details</h1>

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
          {Array.isArray(farmers) &&
            farmers.map((farmer) => (
              <option key={farmer._id} value={farmer._id}>
                {farmer.fullName} ({farmer.mobileNumber})
              </option>
            ))}
        </select>
      </div>

      {/* Farmer Information */}
      {selectedFarmer && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-amber-400">
            Farmer Information
          </h2>
          <div className="bg-green-100 rounded-lg shadow-md p-6 mb-8 border border-gray-200">
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
                <span className="font-medium text-gray-700">Branch:</span>
                <span className="ml-2">{selectedFarmer.branchName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Group:</span>
                <span className="ml-2">
                  {selectedFarmer.groupName || "N/A"}
                </span>
              </div>
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
          <h2 className="text-xl font-semibold mb-4 text-amber-400">
            Crop Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropDetails.map((crop) => (
              <div
                key={crop._id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Crop Name:</span>
                    <span className="ml-2">{crop.cropName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2">{crop.cropCategory}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Address:</span>
                    <span className="ml-2">{crop.address}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Start Date:
                    </span>
                    <span className="ml-2">
                      {new Date(crop.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">District:</span>
                    <span className="ml-2">{crop.district}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">City:</span>
                    <span className="ml-2">{crop.city}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">NIC:</span>
                    <span className="ml-2">{crop.nic}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Yield Size:</span>
                    <span className="ml-2">{crop.cropYieldSize}</span>
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

      {/* Crop Updates */}
      {loadingUpdates && selectedFarmer && (
        <div className="text-center py-4">Loading crop updates...</div>
      )}

      {!loadingUpdates && cropUpdates.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-4 mb-4 text-yellow-500">
            Crop Updates
          </h2>

          {/* Filter Option Dropdown */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="mb-8">
              <label
                htmlFor="filter-option"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter Option
              </label>
              <select
                id="filter-option"
                value={filterOption}
                onChange={handleFilterOptionChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="currentMonth">Current Month</option>
                <option value="specificDate">Specific Date</option>
              </select>
            </div>

            {/* Show date input only if specificDate is selected */}
            {filterOption === "specificDate" && (
              <div className="mb-8">
                <label
                  htmlFor="date-filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Date
                </label>
                <input
                  type="date"
                  id="date-filter"
                  value={filterDate}
                  onChange={handleDateFilterChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700 w-3/4">
                      Description
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700 w-1/4">
                      Added On
                    </th>
                    
                  </tr>
                </thead>
                <tbody>
                  {updatesWithFertilizerDetails.map((update, index) => (
                    <tr
                      key={update._id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2 border-b text-sm text-gray-700 w-3/4">
                        {update.description}
                        {update.description === "පොහොර යෙදීම" && update.fertilizerDetails && (
                          <div className="mt-2 text-sm text-gray-500">
                            <div>Type: {update.fertilizerDetails.fertilizerType}</div>
                            <div>Amount: {update.fertilizerDetails.fertilizerAmount}</div>
                            <div>Unit: {update.fertilizerDetails.fertilizerUnit}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 border-b text-sm text-gray-500 w-1/4">
                        {new Date(update.addDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loadingUpdates && selectedFarmer && cropUpdates.length === 0 && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg">
          No crop updates found for selected farmer.
        </div>
      )}

      {/* Crop Expenses */}
      {loadingExpenses && selectedFarmer && (
        <div className="text-center py-4">Loading crop expenses...</div>
      )}

      {!loadingExpenses && cropExpenses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-4 mb-4 text-yellow-500">
            Crop Expenses
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700 w-1/4">
                      Description
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700 w-1/4">
                      Expense
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700 w-1/4">
                      Added On
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cropExpenses.map((expense, index) => (
                    <tr
                      key={expense._id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2 border-b text-sm text-gray-700 w-1/4">
                        {expense.description}
                      </td>
                      <td className="px-4 py-2 border-b text-sm text-gray-700 w-1/4">
                        Rs.{expense.expense.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border-b text-sm text-gray-500 w-1/4">
                        {new Date(expense.addDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loadingExpenses && selectedFarmer && cropExpenses.length === 0 && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg">
          No crop expenses found for selected farmer.
        </div>
      )}
    </div>
  );
};

export default CropDetails;
