import React, {
  useState,
  useEffect,
} from 'react';

import {
  getHarvestRecords,
} from '../../api/harvestApi';

import {
  fetchCrops,
} from '@/api/cropApi';

import {
  FaSearch,
  FaSync,
  FaTimes,
  FaImage,
} from 'react-icons/fa';


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


const StockCardsView:
  React.FC = () => {

  const [
    stockCards,
    setStockCards,
  ] = useState<StockCard[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    searchTerm,
    setSearchTerm,
  ] = useState('');


  const [
    error,
    setError,
  ] = useState<string>('');


  const [
    cropImages,
    setCropImages,
  ] = useState<
    Record<string, string>
  >({});


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    const initializeData =
      async () => {

      try {

        setLoading(true);

        setError('');


        // -----------------------------------------------
        // FETCH CROPS
        // -----------------------------------------------

        const crops =
          await fetchCrops();


        const imagesMap =
          crops.reduce(
            (
              acc,
              crop,
            ) => {

              if (
                crop.name &&
                crop.imageUrl
              ) {

                acc[
                  crop.name
                ] =
                  crop.imageUrl;
              }


              return acc;
            },

            {} as Record<
              string,
              string
            >
          );


        setCropImages(
          imagesMap
        );


        // -----------------------------------------------
        // FETCH STOCK AFTER CROPS
        // -----------------------------------------------

        await fetchStockRecords(
          imagesMap
        );

      } catch (err) {

        console.error(
          'Failed to initialize data:',
          err
        );


        setError(
          'Failed to fetch crops or stock records'
        );


        setLoading(false);
      }
    };


    initializeData();

  }, []);


  // =======================================================
  // FETCH LISTED STOCK
  // =======================================================

  const fetchStockRecords =
    async (
      imagesMap?: Record<
        string,
        string
      >
    ) => {

    setLoading(true);

    setError('');


    try {

      const response =
        await getHarvestRecords();


      if (response.success) {

        const data =
          response.data?.data ||
          response.data ||
          [];


        if (Array.isArray(data)) {

          const listedStocks =
            data

              // =========================================
              // IMPORTANT FIX
              //
              // Only display:
              // 1. Listed products
              // 2. Stock greater than zero
              // =========================================

              .filter(
                (record) => {

                  const amount =
                    Number(
                      record.currentAmount ??
                      record.totalAmount ??
                      0
                    );


                  return (
                    record.isProductListed ===
                      true &&
                    amount > 0
                  );
                }
              )

              .map(
                (record) => {

                  const currentAmount =
                    Number(
                      record.currentAmount ??
                      record.totalAmount ??
                      0
                    );


                  return {

                    _id:
                      record._id,


                    cropName:
                      record.cropName,


                    // IMPORTANT:
                    // Do NOT use ||
                    currentAmount:
                      currentAmount,


                    pricePerKg:
                      Number(
                        record.pricePerKg ??
                        0
                      ),


                    fullName:
                      record.fullName,


                    isProductListed:
                      record.isProductListed ===
                      true,


                    totalAmount:
                      Number(
                        record.totalAmount ??
                        0
                      ),


                    cropImageUrl:
                      (
                        imagesMap ||
                        cropImages
                      )[
                        record.cropName
                      ] ||
                      '/default-crop.jpg',

                  };
                }
              );


          setStockCards(
            listedStocks
          );

        } else {

          setStockCards([]);

          setError(
            'Invalid data format received from server'
          );
        }

      } else {

        setError(
          response.message ||
          'Failed to fetch stock records'
        );


        setStockCards([]);
      }

    } catch (err: any) {

      console.error(
        'Fetch stock error:',
        err
      );


      setError(
        `Network error: ${
          err.response?.status ||
          'Connection failed'
        } - ${err.message}`
      );


      setStockCards([]);

    } finally {

      setLoading(false);
    }
  };


  // =======================================================
  // SEARCH
  // =======================================================

  const filteredCards =
    stockCards.filter(
      (card) => {

        const search =
          searchTerm
            .toLowerCase()
            .trim();


        if (!search) {
          return true;
        }


        return (
          card.cropName
            ?.toLowerCase()
            .includes(search) ||

          card.fullName
            ?.toLowerCase()
            .includes(search)
        );
      }
    );


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (

      <div className="flex justify-center items-center h-64">

        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500" />

        <p className="ml-4 text-green-600">

          Loading stock records...

        </p>

      </div>
    );
  }


  // =======================================================
  // UI
  // =======================================================

  return (

    <div className="p-6">


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold text-green-800">

            Listed Products

          </h1>


          <p className="text-sm text-gray-500 mt-1">

            View all currently listed agricultural products

          </p>

        </div>


        <button
          onClick={() =>
            fetchStockRecords(
              cropImages
            )
          }

          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"

          disabled={
            loading
          }
        >

          <FaSync
            className={
              loading
                ? 'animate-spin'
                : ''
            }
          />

          Refresh

        </button>

      </div>


      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">

          <p>

            {error}

          </p>


          <button
            onClick={() =>
              fetchStockRecords(
                cropImages
              )
            }

            className="text-red-800 underline hover:no-underline mt-1"
          >

            Try again

          </button>

        </div>
      )}


      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="mb-6 relative">

        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />


        <input
          type="text"

          placeholder="Search by crop name or farmer name..."

          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"

          value={
            searchTerm
          }

          onChange={
            (e) =>
              setSearchTerm(
                e.target.value
              )
          }
        />

      </div>


      {/* ================================================= */}
      {/* EMPTY */}
      {/* ================================================= */}

      {filteredCards.length === 0 ? (

        <div className="bg-white rounded-lg shadow p-8 text-center">

          <div className="flex flex-col items-center justify-center">

            <FaTimes className="text-4xl text-gray-300 mb-4" />


            <p className="text-lg font-medium text-gray-600">

              {searchTerm
                ? 'No listed products match your search.'
                : 'No products are currently listed.'}

            </p>


            {!searchTerm && (

              <p className="text-sm text-gray-500 mt-2">

                Products with available stock will appear here when they are listed for sale.

              </p>

            )}

          </div>

        </div>

      ) : (

        // =================================================
        // CARDS
        // =================================================

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {filteredCards.map(
            (card) => {

              // -------------------------------------------
              // SAFE PERCENTAGE
              // -------------------------------------------

              const stockPercentage =
                card.totalAmount > 0

                  ? Math.min(
                      100,

                      Math.max(
                        0,

                        (
                          card.currentAmount /
                          card.totalAmount
                        ) *
                          100
                      )
                    )

                  : 0;


              return (

                <div
                  key={
                    card._id
                  }

                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >


                  {/* ===================================== */}
                  {/* IMAGE */}
                  {/* ===================================== */}

                  <div className="h-48 bg-gray-100 relative overflow-hidden">

                    {card.cropImageUrl ? (

                      <img
                        src={
                          card.cropImageUrl
                        }

                        alt={
                          card.cropName
                        }

                        className="w-full h-full object-cover"

                        onError={
                          (e) => {

                            (
                              e.target as
                              HTMLImageElement
                            ).src =
                              '/default-crop.jpg';
                          }
                        }
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center text-gray-400">

                        <FaImage className="text-5xl" />

                      </div>

                    )}

                  </div>


                  {/* ===================================== */}
                  {/* DETAILS */}
                  {/* ===================================== */}

                  <div className="p-4">

                    <div className="flex justify-between items-start gap-2 mb-2">

                      <h3 className="text-xl font-bold text-green-800 truncate">

                        {card.cropName}

                      </h3>


                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">

                        Available

                      </span>

                    </div>


                    <p className="text-sm text-gray-500 mb-4">

                      By: {card.fullName}

                    </p>


                    <div className="space-y-3">

                      <div>

                        <p className="text-sm text-gray-500">

                          Available Quantity

                        </p>


                        <p className="text-lg font-semibold">

                          {card.currentAmount} kg

                        </p>


                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">

                          <div
                            className="h-2 rounded-full bg-green-500"

                            style={{
                              width:
                                `${stockPercentage}%`,
                            }}
                          />

                        </div>

                      </div>


                      <div>

                        <p className="text-sm text-gray-500">

                          Price

                        </p>


                        <p className="text-xl font-bold text-green-600">

                          Rs {card.pricePerKg} /kg

                        </p>

                      </div>

                    </div>

                  </div>


                  {/* ===================================== */}
                  {/* FOOTER */}
                  {/* ===================================== */}

                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">

                    <span className="text-xs text-gray-500">

                      Stock ID:{' '}

                      {card._id
                        .slice(-6)
                        .toUpperCase()}

                    </span>


                    <button
                      className="text-sm text-green-600 hover:text-green-800 font-medium"
                    >

                      View Details

                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
};


export default StockCardsView;