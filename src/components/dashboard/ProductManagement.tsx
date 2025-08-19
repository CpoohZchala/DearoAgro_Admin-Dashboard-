import React, { useState, useEffect } from 'react';
import { getHarvestRecords } from '../../api/harvestApi';
import { fetchCrops } from '@/api/cropApi';
import { FaSearch, FaSync, FaExclamationTriangle, FaTimes, FaImage } from 'react-icons/fa';

interface StockCard {
  _id: string;
  cropName: string;
  currentAmount: number;
  pricePerKg: number;
  fullName: string;
  isProductListed: boolean;
  totalAmount: number;
  cropImageUrl?: string;
}

const StockCardsView: React.FC = () => {
  const [stockCards, setStockCards] = useState<StockCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>('');
  const [cropImages, setCropImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const initializeData = async () => {
      try {
        const crops = await fetchCrops();
        const imagesMap = crops.reduce((acc, crop) => {
          if (crop.name && crop.imageUrl) acc[crop.name] = crop.imageUrl;
          return acc;
        }, {} as Record<string, string>);
        setCropImages(imagesMap);

        // Fetch stock records after crop images are ready
        await fetchStockRecords(imagesMap);
      } catch (err) {
        console.error('Failed to initialize data:', err);
        setError('Failed to fetch crops or stock records');
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchStockRecords = async (imagesMap?: Record<string, string>) => {
    setLoading(true);
    setError('');
    try {
      const response = await getHarvestRecords();
      if (response.success) {
        const data = response.data?.data || response.data || [];
        if (Array.isArray(data)) {
          const listedStocks = data
            .filter(record => record.isProductListed)
            .map(record => ({
              _id: record._id,
              cropName: record.cropName,
              currentAmount: record.currentAmount || record.totalAmount,
              pricePerKg: record.pricePerKg,
              fullName: record.fullName,
              isProductListed: record.isProductListed || false,
              totalAmount: record.totalAmount,
              cropImageUrl: (imagesMap || cropImages)[record.cropName] || '/default-crop.jpg'
            }));
          setStockCards(listedStocks);
        } else {
          setStockCards([]);
          setError('Invalid data format received from server');
        }
      } else {
        setError(response.message || 'Failed to fetch stock records');
        setStockCards([]);
      }
    } catch (err: any) {
      setError(`Network error: ${err.response?.status || 'Connection failed'} - ${err.message}`);
      setStockCards([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = stockCards.filter(card =>
    card.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-600">Loading stock records...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Listed Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all currently listed agricultural products
          </p>
        </div>
        <button
          onClick={() => fetchStockRecords(cropImages)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          disabled={loading}
        >
          <FaSync className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={() => fetchStockRecords(cropImages)}
            className="text-red-800 underline hover:no-underline mt-1"
          >
            Try again
          </button>
        </div>
      )}

      {/* Search */}
      <div className="mb-6 relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by crop name or farmer name..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* No results */}
      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <FaTimes className="text-4xl text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600">
              {searchTerm ? 'No listed products match your search.' : 'No products are currently listed.'}
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-500 mt-2">
                Products will appear here when they are listed for sale.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map(card => {
            const stockPercentage = (card.currentAmount / card.totalAmount) * 100;
            const isLowStock = stockPercentage < 20 && card.currentAmount > 0;
            const isOutOfStock = card.currentAmount <= 0;

            return (
              <div key={card._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {card.cropImageUrl ? (
                    <img 
                      src={card.cropImageUrl} 
                      alt={card.cropName}
                      className="w-full h-full object-cover"
                      onError={(e) => {(e.target as HTMLImageElement).src = '/default-crop.jpg';}}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaImage className="text-5xl" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-green-800 truncate">{card.cropName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isOutOfStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {isOutOfStock ? 'Out of Stock' : 'Available'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">By: {card.fullName}</p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Available Quantity</p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold">{card.currentAmount} kg</p>
                        {isLowStock && <FaExclamationTriangle className="ml-2 text-yellow-500" title="Low stock" />}
                        {isOutOfStock && <FaTimes className="ml-2 text-red-500" title="Out of stock" />}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${isOutOfStock ? 100 : stockPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-xl font-bold text-green-600">Rs {card.pricePerKg} /kg</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Stock ID: {card._id.slice(-6).toUpperCase()}</span>
                  <button 
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                    onClick={() => {/* Add view details or edit functionality */}}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StockCardsView;
