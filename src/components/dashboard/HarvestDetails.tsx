import React, { useState, useEffect } from 'react';
import { getHarvestRecords, HarvestData, deleteHarvestRecord } from '../../api/harvestApi';
import { addProductFromHarvest, removeProductByHarvestId } from '../../api/productApi';
import { FaSearch, FaSync, FaBoxOpen, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface HarvestRecord extends HarvestData {
  _id: string;
  isProductListed?: boolean;
  currentAmount?: number;
}

const HarvestDetails: React.FC = () => {
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string>('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const recordsPerPage = 10;

  useEffect(() => {
    fetchHarvestRecords();
  }, []);

  const fetchHarvestRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getHarvestRecords();
      if (response.success) {
        const data = response.data?.data || response.data || [];
        if (Array.isArray(data)) {
          const recordsWithCurrentAmount = data.map(record => ({
            ...record,
            currentAmount: record.currentAmount ?? record.totalAmount
          }));
          setHarvestRecords(recordsWithCurrentAmount);
        } else {
          setHarvestRecords([]);
          setError('Invalid data format received from server');
        }
      } else {
        setError(response.message || 'Failed to fetch harvest records');
        setHarvestRecords([]);
      }
    } catch (error: any) {
      setError(`Network error: ${error.response?.status || 'Connection failed'} - ${error.message}`);
      setHarvestRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, farmerName: string) => {
    if (!window.confirm(`Are you sure you want to delete the harvest record for ${farmerName}?`)) {
      return;
    }
    try {
      const response = await deleteHarvestRecord(id);
      if (response.success) {
        setHarvestRecords(prev => prev.filter(record => record._id !== id));
        alert('Harvest record deleted successfully');
      } else {
        alert(response.message || 'Failed to delete record');
      }
    } catch (error) {
      alert('Error occurred while deleting record');
    }
  };

  const handleToggleProduct = async (record: HarvestRecord) => {
    // Prevent listing if no stock available
    if ((record.currentAmount || 0) <= 0 && !record.isProductListed) {
      alert('Cannot list product with zero available stock');
      return;
    }

    const recordId = record._id;
    if (processingIds.has(recordId)) return;

    setProcessingIds(prev => new Set(prev).add(recordId));

    try {
      await fetch(`/api/stocks/toggle/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isProductListed: !record.isProductListed })
      });

      if (record.isProductListed) {
        await removeProductByHarvestId(recordId);
        setHarvestRecords(prev =>
          prev.map(r => r._id === recordId ? { ...r, isProductListed: false } : r)
        );
      } else {
        if (!record.cropName || !record.pricePerKg || !record.totalAmount) {
          throw new Error('Missing required fields: name, price, or quantity');
        }
        const productData = {
          name: record.cropName,
          category: 'Agricultural',
          quantity: Number(record.totalAmount),
          pricePerKg: Number(record.pricePerKg),
          harvestId: recordId,
          farmerName: record.fullName
        };
        await addProductFromHarvest(productData);
        setHarvestRecords(prev =>
          prev.map(r => r._id === recordId ? { ...r, isProductListed: true } : r)
        );
      }
    } catch (error: any) {
      alert(`Failed to ${record.isProductListed ? 'remove from' : 'add to'} product list: ${error.message}`);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(recordId);
        return newSet;
      });
    }
  };

  const filteredRecords = harvestRecords.filter((record) =>
    record.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.mobileNumber?.includes(searchTerm) ||
    record.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.memberId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-600">Loading harvest records...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Stock Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor your agricultural stock inventory
          </p>
        </div>
        <button
          onClick={fetchHarvestRecords}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          disabled={loading}
        >
          <FaSync className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={fetchHarvestRecords}
            className="text-red-800 underline hover:no-underline mt-1"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mb-4 relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, mobile, address, crop, or member ID..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="font-medium text-gray-500">Total Stock</h3>
          <p className="text-2xl font-bold">
            {harvestRecords.reduce((sum, r) => sum + r.totalAmount, 0)} kg
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="font-medium text-gray-500">Available Stock</h3>
          <p className="text-2xl font-bold">
            {harvestRecords.reduce((sum, r) => sum + (r.currentAmount || 0), 0)} kg
          </p>
        </div>
        {/* <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="font-medium text-gray-500">Low Stock Items</h3>
          <p className="text-2xl font-bold">
            {harvestRecords.filter(r => (r.currentAmount || 0) > 0 && (r.currentAmount || 0) / r.totalAmount < 0.2).length} items
          </p>
        </div> */}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Farmer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Crop Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Total (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Available (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Price (Rs/kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FaBoxOpen className="text-4xl text-gray-300 mb-2" />
                      <p className="text-lg font-medium">
                        {searchTerm ? 'No records match your search.' : 'No stock records available.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentRecords.map((record, index) => {
                  const stockPercentage = ((record.currentAmount || 0) / record.totalAmount) * 100;
                  const isLowStock = stockPercentage < 20 && (record.currentAmount || 0) > 0;
                  const isOutOfStock = (record.currentAmount || 0) <= 0;
                  
                  return (
                    <tr key={record._id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{record.fullName}</div>
                        <div className="text-xs text-gray-500">{record.mobileNumber}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{record.cropName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{record.totalAmount}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 w-12">
                            {record.currentAmount}
                          </span>
                          {isLowStock && (
                            <FaExclamationTriangle className="ml-2 text-yellow-500" title="Low stock" />
                          )}
                          {isOutOfStock && (
                            <FaTimes className="ml-2 text-red-500" title="Out of stock" />
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className={`h-1.5 rounded-full ${
                              isOutOfStock ? 'bg-red-500' :
                              isLowStock ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${isOutOfStock ? 100 : stockPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">Rs {record.pricePerKg}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isOutOfStock 
                            ? 'bg-red-100 text-red-800'
                            : record.isProductListed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isOutOfStock ? 'Out of Stock' : 
                           record.isProductListed ? 'Listed' : 'Not Listed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={record.isProductListed || false}
                          onChange={() => handleToggleProduct(record)}
                          disabled={processingIds.has(record._id) || isOutOfStock}
                          className={`h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 ${
                            (processingIds.has(record._id) || isOutOfStock) ? 'cursor-not-allowed' : 'cursor-pointer'
                          } disabled:opacity-50`}
                          title={isOutOfStock ? "Cannot list product with zero available stock" : ""}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 mt-4 rounded-b-lg">
          <div className="flex-1 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{' '}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredRecords.length)}</span> of{' '}
              <span className="font-medium">{filteredRecords.length}</span> results
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 border text-sm font-medium ${
                    currentPage === i + 1
                      ? 'bg-green-50 border-green-500 text-green-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarvestDetails;