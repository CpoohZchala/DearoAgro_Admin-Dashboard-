import React, { useState, useEffect } from "react";
import {
  getMarketingOfficers,
  updateMarketingOfficer,
  deleteMarketingOfficer,
  getMarketingOfficerById,
} from "../../api/marketingOfficerApi";
import MarketingOfficerForm from "./MarketingOfficerForm";
import { FaPlus } from "react-icons/fa";

const MarketingOfficers: React.FC = () => {
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editOfficerData, setEditOfficerData] = useState<any>(null);
  const [searchText, setSearchText] = useState<string>("");

  const branches = [
    "Head Office - Colombo",
    "Badulla",
    "Welimada",
    "Dambulla",
    "Mannar",
    "Chenkalady",
    "Muthur",
    "Nelliady",
    "Mahiyanganaya",
    "Polonnaruwa",
    "Thissamaharama",
    "Trincomalee",
    "Vavunathivu",
    "Kinniya",
    "Chunnakam",
    "Kaluwanchikudy",
    "Dehiattakandiya",
    "Batticaloa",
    "Vavuniya",
    "Ampara",
  ];

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await getMarketingOfficers();
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch marketing officers");
        }
        setOfficers(response.data as any[]);
      } catch (err: any) {
        console.error("Error fetching marketing officers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, []);

  const filteredOfficers = officers.filter((officer) => {
    const officerName = officer.fullName || "";
    return officerName.toLowerCase().includes(searchText.toLowerCase().trim());
  });

  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleFormSubmit = (newOfficer: any) => {
    setOfficers([...officers, newOfficer]);
    setShowForm(false);
  };

  const handleAssignBranch = async (officerId: string, branchName: string) => {
    try {
      const response = await updateMarketingOfficer(officerId, { branchName });
      if (!response.success) {
        throw new Error(response.message || "Failed to assign branch");
      }
      setOfficers((prevOfficers) =>
        prevOfficers.map((officer) =>
          officer._id === officerId ? { ...officer, branchName } : officer
        )
      );
      alert("Branch assigned successfully!");
    } catch (err: any) {
      console.error("Error assigning branch:", err);
      setError(err.message);
    }
  };

  const handleEditOfficer = async (officerId: string, updatedData: any) => {
    try {
      const response = await updateMarketingOfficer(officerId, updatedData);
      if (!response.success) {
        throw new Error(response.message || "Failed to update marketing officer");
      }
      setOfficers((prevOfficers) =>
        prevOfficers.map((officer) =>
          officer._id === officerId ? { ...officer, ...updatedData } : officer
        )
      );
      alert("Marketing officer updated successfully!");
    } catch (err: any) {
      console.error("Error updating marketing officer:", err);
      setError(err.message);
    }
  };

  const handleDeleteOfficer = async (officerId: string) => {
    try {
      const response = await deleteMarketingOfficer(officerId);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete marketing officer");
      }
      setOfficers((prevOfficers) =>
        prevOfficers.filter((officer) => officer._id !== officerId)
      );
      alert("Marketing officer deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting marketing officer:", err);
      setError(err.message);
    }
  };

  const handleEditClick = async (officerId: string) => {
    try {
      const response = await getMarketingOfficerById(officerId);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch marketing officer data");
      }
      setEditOfficerData(response.data);
    } catch (err: any) {
      console.error("Error fetching marketing officer data:", err);
      setError(err.message);
    }
  };

  const handleEditSubmit = async (updatedData: any) => {
    try {
      const filteredData = Object.keys(updatedData).reduce((acc: any, key) => {
        if (updatedData[key] !== editOfficerData[key]) {
          acc[key] = updatedData[key];
        }
        return acc;
      }, {});

      const response = await updateMarketingOfficer(editOfficerData._id, filteredData);
      if (!response.success) {
        throw new Error(response.message || "Failed to update marketing officer");
      }

      setOfficers((prevOfficers) =>
        prevOfficers.map((officer) =>
          officer._id === editOfficerData._id ? { ...officer, ...filteredData } : officer
        )
      );
      setEditOfficerData(null);
      alert("Marketing officer updated successfully!");
    } catch (err: any) {
      console.error("Error updating marketing officer:", err);
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-black px-4 py-2">
          📂 Marketing Officers
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Marketing Officer Search Top Bar */}
        <div className="sticky top-0 z-20 mb-6 bg-white/95 backdrop-blur-sm py-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Marketing Officer List
              </h3>
              <p className="text-sm text-gray-500">
                Showing {filteredOfficers.length} of {officers.length} officers
              </p>
            </div>

            <div className="w-full lg:w-96">
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search officer by name..."
                  className="w-full bg-white border border-gray-200 rounded-full py-3 pl-5 pr-12 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />

                {searchText && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
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
        ) : filteredOfficers.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No marketing officers found
            </h3>
            <p className="text-gray-500">
              Try another officer name
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOfficers.map((officer) => (
                  <tr key={officer._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {officer.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {officer.mobileNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {officer.branchName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-y-2">
                      <button
                        onClick={() => handleEditClick(officer._id)}
                        className="text-blue-600 hover:underline block"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteOfficer(officer._id)}
                        className="text-red-600 hover:underline block"
                      >
                        Delete
                      </button>

                      <select
                        className="border border-gray-300 rounded-md px-2 py-1"
                        value={officer.branchName || ""}
                        onChange={(e) => handleAssignBranch(officer._id, e.target.value)}
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <MarketingOfficerForm
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {editOfficerData && (
        <MarketingOfficerForm
          onClose={() => setEditOfficerData(null)}
          onSubmit={handleEditSubmit}
          initialData={editOfficerData}
        />
      )}
    </div>
  );
};

export default MarketingOfficers;