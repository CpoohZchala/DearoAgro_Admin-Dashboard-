import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus, deleteOrder } from '@/api/orderApi';
import axios from 'axios';
import { Order } from '@/models/orderModel';

interface Buyer {
  _id: string;
  fullName: string;
  mobileNumber: string;
}

interface Props {
  token: string;
}

const OrderDetails: React.FC<Props> = ({ token }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [buyers, setBuyers] = useState<Record<string, Buyer>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'complete'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Authentication token is required');
        setLoading(false);
        return;
      }

      try {
        const ordersData = await fetchOrders(token);
        const buyerIds = [...new Set(ordersData.map(order => order.buyerId))];

        const buyersResponse = await Promise.all(
          buyerIds.map(id =>
            axios.get<Buyer>(`https://dearoagro-backend.onrender.com/api/buyers/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          )
        );

        const buyersMap = buyersResponse.reduce((acc, response) => {
          const buyer = response.data as Buyer;
          acc[buyer._id] = buyer;
          return acc;
        }, {} as Record<string, Buyer>);

        setBuyers(buyersMap);
        setOrders(ordersData);
        setError('');
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleMarkAsComplete = async (orderId: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, token);
      setOrders(prevOrders =>
        prevOrders.map(order => (order._id === updatedOrder._id ? updatedOrder : order))
      );
      setSuccessMessage('✅ Order marked as complete successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update order status');
      console.error('Failed to update order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      setDeletingId(orderId);
      await deleteOrder(orderId, token);
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      setSuccessMessage('🗑 Order deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete order');
      console.error('Failed to delete order:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <svg
          className="animate-spin h-8 w-8 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center font-medium mt-6">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="text-gray-500 text-center mt-6">No orders found.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-green-50 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-800">Order Summary</h2>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {['all', 'pending', 'complete'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-1 text-sm rounded-full shadow-sm transition-all ${
                filter === f
                  ? f === 'pending'
                    ? 'bg-yellow-400 text-white'
                    : f === 'complete'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-300 shadow-sm">
          {successMessage}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No {filter === 'all' ? '' : filter} orders found.
        </p>
      ) : (
        <div className="space-y-6">
          {filteredOrders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition p-5"
              >
                {/* Order Header */}
                <div className="border-b pb-4 mb-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-green-700">
                      Order #{order._id.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-green-600">
                      Buyer: {buyers[order.buyerId]?.fullName || 'Loading...'} | {buyers[order.buyerId]?.mobileNumber || 'Loading...'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'complete'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status === 'complete' ? 'Completed' : 'Pending'}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Payment & Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-1">Payment Info</h4>
                    <p className="text-gray-700">Method: {order.paymentMethod}</p>
                    <p className="text-gray-700">Amount: Rs. {order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-1">Shipping Address</h4>
                    <p className="text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Order Items</h4>
                  <div className="border border-green-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-green-200">
                      <thead className="bg-green-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase">Product</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase">Qty</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-green-100">
                        {order.items.map((item) => (
                          <tr key={item.productId}>
                            <td className="px-4 py-3 text-sm text-gray-800">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Rs. {item.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              Rs. {(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end space-x-3">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleMarkAsComplete(order._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                      Mark as Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={deletingId === order._id}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      deletingId === order._id
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {deletingId === order._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
