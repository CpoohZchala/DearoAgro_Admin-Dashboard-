import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';

import {
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
  type Order,
} from '@/api/orderApi';


// =========================================================
// BUYER TYPE
// =========================================================

interface Buyer {
  _id: string;

  fullName: string;

  mobileNumber: string;
}


// Backend buyer API response may be wrapped or direct
interface BuyerApiResponse {
  success?: boolean;

  buyer?: Buyer;

  data?: Buyer;

  _id?: string;

  fullName?: string;

  mobileNumber?: string;
}


// =========================================================
// PROPS
// =========================================================

interface Props {
  token: string;
}


// =========================================================
// FILTER TYPE
// =========================================================

type FilterType =
  | 'all'
  | 'pending'
  | 'completed';


const BUYER_API_URL =
  'https://dearoagro-backend.onrender.com/api/buyers';


// =========================================================
// COMPONENT
// =========================================================

const OrderDetails: React.FC<Props> = ({
  token,
}) => {

  const [
    orders,
    setOrders,
  ] = useState<Order[]>([]);


  const [
    buyers,
    setBuyers,
  ] = useState<Record<string, Buyer>>({});


  const [
    loading,
    setLoading,
  ] = useState<boolean>(true);


  const [
    error,
    setError,
  ] = useState<string>('');


  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string>('');


  const [
    filter,
    setFilter,
  ] = useState<FilterType>('all');


  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(null);


  const [
    updatingId,
    setUpdatingId,
  ] = useState<string | null>(null);


  // =======================================================
  // LOAD ORDERS
  // =======================================================

  const loadOrders = async () => {

    if (!token) {

      setError(
        'Authentication token is required'
      );

      setLoading(false);

      return;
    }


    try {

      setLoading(true);

      setError('');


      // ---------------------------------------------------
      // GET ORDERS
      // ---------------------------------------------------

      const ordersData =
        await fetchOrders(token);


      setOrders(ordersData);


      // ---------------------------------------------------
      // GET UNIQUE BUYER IDS
      // ---------------------------------------------------

      const buyerIds = [
        ...new Set(
          ordersData
            .map(
              (order) =>
                order.buyerId
            )
            .filter(Boolean)
        ),
      ];


      // ---------------------------------------------------
      // LOAD BUYER DETAILS
      // ---------------------------------------------------

      const buyerResults =
        await Promise.allSettled(

          buyerIds.map(
            async (buyerId) => {

              const response =
                await axios.get<BuyerApiResponse>(
                  `${BUYER_API_URL}/${buyerId}`,

                  {
                    headers: {
                      Authorization:
                        `Bearer ${token}`,
                    },
                  }
                );


              const responseData =
                response.data;


              let buyer:
                Buyer | undefined;


              // API:
              // { buyer: {...} }
              if (responseData.buyer) {

                buyer =
                  responseData.buyer;

              }

              // API:
              // { data: {...} }
              else if (responseData.data) {

                buyer =
                  responseData.data;

              }

              // API directly returns:
              // { _id, fullName, mobileNumber }
              else if (responseData._id) {

                buyer = {
                  _id:
                    responseData._id,

                  fullName:
                    responseData.fullName ||
                    'Unknown Buyer',

                  mobileNumber:
                    responseData.mobileNumber ||
                    '-',
                };
              }


              if (!buyer) {

                throw new Error(
                  `Buyer ${buyerId} not found`
                );
              }


              return buyer;
            }
          )
        );


      // ---------------------------------------------------
      // CREATE BUYER MAP
      // ---------------------------------------------------

      const buyersMap:
        Record<string, Buyer> = {};


      buyerResults.forEach(
        (result) => {

          if (
            result.status ===
            'fulfilled'
          ) {

            buyersMap[
              result.value._id
            ] =
              result.value;
          }
        }
      );


      setBuyers(buyersMap);

    } catch (error) {

      console.error(
        'Error fetching order data:',
        error
      );


      setError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch orders'
      );

    } finally {

      setLoading(false);
    }
  };


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    loadOrders();

  }, [token]);


  // =======================================================
  // COMPLETE ORDER
  // =======================================================

  const handleMarkAsComplete =
    async (
      orderId: string
    ) => {

      try {

        setUpdatingId(orderId);

        setError('');


        const updatedOrder =
          await updateOrderStatus(
            orderId,
            token,
            'Completed'
          );


        setOrders(
          (previousOrders) =>
            previousOrders.map(
              (order) =>
                order._id ===
                updatedOrder._id

                  ? updatedOrder

                  : order
            )
        );


        setSuccessMessage(
          'Order marked as completed successfully'
        );


        setTimeout(
          () =>
            setSuccessMessage(''),
          3000
        );

      } catch (error) {

        console.error(
          'Failed to update order:',
          error
        );


        setError(
          error instanceof Error
            ? error.message
            : 'Failed to update order status'
        );

      } finally {

        setUpdatingId(null);
      }
    };


  // =======================================================
  // DELETE ORDER
  // =======================================================

  const handleDeleteOrder =
    async (
      orderId: string
    ) => {

      const confirmed =
        window.confirm(
          'Are you sure you want to delete this order?'
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeletingId(orderId);

        setError('');


        await deleteOrder(
          orderId,
          token
        );


        setOrders(
          (previousOrders) =>
            previousOrders.filter(
              (order) =>
                order._id !==
                orderId
            )
        );


        setSuccessMessage(
          'Order deleted successfully'
        );


        setTimeout(
          () =>
            setSuccessMessage(''),
          3000
        );

      } catch (error) {

        console.error(
          'Failed to delete order:',
          error
        );


        setError(
          error instanceof Error
            ? error.message
            : 'Failed to delete order'
        );

      } finally {

        setDeletingId(null);
      }
    };


  // =======================================================
  // FILTER + SORT
  // =======================================================

  const filteredOrders =
    useMemo(() => {

      const result =
        orders.filter(
          (order) => {

            if (filter === 'all') {
              return true;
            }


            return (
              order.status || ''
            ).toLowerCase() ===
              filter;
          }
        );


      return [...result].sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      );

    }, [
      orders,
      filter,
    ]);


  // =======================================================
  // MONEY FORMAT
  // =======================================================

  const formatMoney = (
    value: number | string
  ) => {

    const amount =
      Number(value);


    if (Number.isNaN(amount)) {
      return '0.00';
    }


    return amount.toFixed(2);
  };


  // =======================================================
  // DATE FORMAT
  // =======================================================

  const formatDate = (
    date: string
  ) => {

    if (!date) {
      return '-';
    }


    return new Date(
      date
    ).toLocaleString();
  };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (

      <div className="flex justify-center items-center h-40">

        <svg
          className="animate-spin h-8 w-8 text-green-600"

          xmlns="http://www.w3.org/2000/svg"

          fill="none"

          viewBox="0 0 24 24"
        >

          <circle
            className="opacity-25"

            cx="12"

            cy="12"

            r="10"

            stroke="currentColor"

            strokeWidth="4"
          />


          <path
            className="opacity-75"

            fill="currentColor"

            d="M4 12a8 8 0 018-8v8H4z"
          />

        </svg>

      </div>
    );
  }


  // =======================================================
  // UI
  // =======================================================

  return (

    <div className="p-6 max-w-6xl mx-auto bg-green-50 rounded-xl shadow-md">


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <h2 className="text-3xl font-bold text-green-800">

            Order Summary

          </h2>


          <p className="text-sm text-gray-500 mt-1">

            {orders.length}{' '}

            order
            {orders.length === 1
              ? ''
              : 's'}

          </p>

        </div>


        {/* =============================================== */}
        {/* FILTER BUTTONS */}
        {/* =============================================== */}

        <div className="flex flex-wrap gap-2">

          {[
            {
              label: 'All',
              value: 'all',
            },

            {
              label: 'Pending',
              value: 'pending',
            },

            {
              label: 'Completed',
              value: 'completed',
            },
          ].map(
            (option) => {

              const active =
                filter ===
                option.value;


              return (

                <button
                  key={
                    option.value
                  }

                  onClick={() =>
                    setFilter(
                      option.value as FilterType
                    )
                  }

                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                    transition

                    ${
                      active

                        ? option.value ===
                          'pending'

                          ? 'bg-yellow-500 text-white'

                          : 'bg-green-600 text-white'

                        : 'bg-white text-green-800 border border-green-200 hover:bg-green-100'
                    }
                  `}
                >

                  {option.label}

                </button>
              );
            }
          )}

        </div>

      </div>


      {/* ================================================= */}
      {/* SUCCESS MESSAGE */}
      {/* ================================================= */}

      {successMessage && (

        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg">

          {successMessage}

        </div>
      )}


      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (

        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">

          {error}

        </div>
      )}


      {/* ================================================= */}
      {/* EMPTY */}
      {/* ================================================= */}

      {filteredOrders.length === 0 ? (

        <div className="bg-white border border-green-100 rounded-xl py-14 text-center">

          <p className="text-gray-500">

            No{' '}

            {filter === 'all'
              ? ''
              : filter}{' '}

            orders found.

          </p>

        </div>

      ) : (

        // =================================================
        // ORDERS
        // =================================================

        <div className="space-y-6">

          {filteredOrders.map(
            (order) => {

              const buyer =
                buyers[
                  order.buyerId
                ];


              const isCompleted =
                order.status
                  .toLowerCase() ===
                'completed';


              return (

                <div
                  key={order._id}

                  className="
                    bg-white
                    rounded-xl
                    shadow-md
                    border
                    border-green-200
                    p-5
                    transition
                    hover:shadow-lg
                  "
                >


                  {/* ===================================== */}
                  {/* ORDER HEADER */}
                  {/* ===================================== */}

                  <div className="border-b border-gray-200 pb-4 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">


                    <div>

                      <h3 className="text-lg font-bold text-green-700">

                        Order #

                        {order._id.substring(
                          0,
                          8
                        )}

                      </h3>


                      <p className="text-sm text-gray-700 mt-1">

                        Buyer:{' '}

                        <span className="font-semibold">

                          {buyer?.fullName ||
                            'Unknown Buyer'}

                        </span>

                      </p>


                      <p className="text-sm text-gray-500">

                        {buyer?.mobileNumber ||
                          'Mobile number unavailable'}

                      </p>

                    </div>


                    <div className="sm:text-right">

                      <span
                        className={`
                          inline-flex
                          items-center
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold

                          ${
                            isCompleted

                              ? 'bg-green-100 text-green-800'

                              : 'bg-yellow-100 text-yellow-800'
                          }
                        `}
                      >

                        {order.status}

                      </span>


                      <p className="text-sm text-gray-500 mt-2">

                        {formatDate(
                          order.createdAt
                        )}

                      </p>

                    </div>

                  </div>


                  {/* ===================================== */}
                  {/* PAYMENT + SHIPPING */}
                  {/* ===================================== */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">


                    <div className="bg-green-50 p-4 rounded-lg">

                      <h4 className="font-semibold text-green-800 mb-2">

                        Payment Info

                      </h4>


                      <p className="text-sm text-gray-700">

                        Method:{' '}

                        <span className="font-medium">

                          {order.paymentMethod}

                        </span>

                      </p>


                      <p className="text-sm text-gray-700 mt-1">

                        Amount:{' '}

                        <span className="font-semibold">

                          Rs.{' '}

                          {formatMoney(
                            order.totalAmount
                          )}

                        </span>

                      </p>

                    </div>


                    <div className="bg-green-50 p-4 rounded-lg">

                      <h4 className="font-semibold text-green-800 mb-2">

                        Shipping Address

                      </h4>


                      <p className="text-sm text-gray-700 whitespace-pre-line">

                        {order.shippingAddress}

                      </p>

                    </div>

                  </div>


                  {/* ===================================== */}
                  {/* ORDER ITEMS */}
                  {/* ===================================== */}

                  <div>

                    <h4 className="font-semibold text-green-800 mb-2">

                      Order Items

                    </h4>


                    <div className="border border-green-200 rounded-lg overflow-x-auto">


                      <table className="min-w-full divide-y divide-green-200">


                        <thead className="bg-green-100">

                          <tr>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">

                              Product

                            </th>


                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">

                              Price / kg

                            </th>


                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">

                              Quantity

                            </th>


                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase">

                              Total

                            </th>

                          </tr>

                        </thead>


                        <tbody className="bg-white divide-y divide-green-100">


                          {order.items.map(
                            (
                              item,
                              index
                            ) => (

                              <tr
                                key={
                                  item._id ||
                                  item.stockId ||
                                  index
                                }
                              >

                                <td className="px-4 py-3 text-sm font-medium text-gray-800">

                                  {item.name}

                                </td>


                                <td className="px-4 py-3 text-sm text-gray-600">

                                  Rs.{' '}

                                  {formatMoney(
                                    item.price
                                  )}

                                </td>


                                <td className="px-4 py-3 text-sm text-gray-600">

                                  {item.quantity}{' '}

                                  kg

                                </td>


                                <td className="px-4 py-3 text-sm font-semibold text-gray-700">

                                  Rs.{' '}

                                  {formatMoney(
                                    Number(
                                      item.price
                                    ) *
                                    Number(
                                      item.quantity
                                    )
                                  )}

                                </td>

                              </tr>
                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>


                  {/* ===================================== */}
                  {/* ACTION BUTTONS */}
                  {/* ===================================== */}

                  <div className="mt-5 flex flex-wrap justify-end gap-3">


                    {!isCompleted && (

                      <button
                        onClick={() =>
                          handleMarkAsComplete(
                            order._id
                          )
                        }

                        disabled={
                          updatingId ===
                          order._id
                        }

                        className={`
                          px-4
                          py-2
                          rounded-lg
                          text-sm
                          font-medium
                          text-white
                          transition

                          ${
                            updatingId ===
                            order._id

                              ? 'bg-gray-400 cursor-not-allowed'

                              : 'bg-green-600 hover:bg-green-700'
                          }
                        `}
                      >

                        {updatingId ===
                        order._id

                          ? 'Updating...'

                          : 'Mark as Completed'}

                      </button>
                    )}


                    <button
                      onClick={() =>
                        handleDeleteOrder(
                          order._id
                        )
                      }

                      disabled={
                        deletingId ===
                        order._id
                      }

                      className={`
                        px-4
                        py-2
                        rounded-lg
                        text-sm
                        font-medium
                        text-white
                        transition

                        ${
                          deletingId ===
                          order._id

                            ? 'bg-gray-400 cursor-not-allowed'

                            : 'bg-red-500 hover:bg-red-600'
                        }
                      `}
                    >

                      {deletingId ===
                      order._id

                        ? 'Deleting...'

                        : 'Delete'}

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


export default OrderDetails;