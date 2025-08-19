import axios from 'axios';
import { Order } from '@/models/orderModel';

const API_BASE_URL = 'https://dearoagro-backend.onrender.com/api/orders';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
  orders?: Order[];
  order?: Order;
}

// Type guard for axios errors
function isAxiosError(error: unknown): error is { 
  isAxiosError: boolean; 
  response?: { 
    data?: any;
    status?: number;
  };
} {
  return (error as any).isAxiosError === true;
}

// Create order from cart
export const createOrder = async (
  orderData: { shippingAddress: string; paymentMethod: string }, 
  token: string
): Promise<Order> => {
  if (!token) throw new Error('Authentication token is required');

  try {
    const response = await axios.post<ApiResponse<{ order: Order }>>(
      API_BASE_URL,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.success || !response.data.order) {
      throw new Error(response.data.message || 'Failed to create order');
    }

    return response.data.order;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Network error while creating order'
      );
    }
    throw new Error('Unexpected error while creating order');
  }
};

// Get all orders
export const fetchOrders = async (token: string): Promise<Order[]> => {
  if (!token) throw new Error('Authentication token is required');

  try {
    const response = await axios.get<ApiResponse<Order[]>>(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch orders');
    }

    // Backend returns orders directly in response, not nested in data
    return response.data.orders || [];
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Network error while fetching orders'
      );
    }
    throw new Error('Unexpected error while fetching orders');
  }
};

// Get order by ID
export const getOrderById = async (orderId: string, token: string): Promise<Order> => {
  if (!token) throw new Error('Authentication token is required');
  if (!orderId) throw new Error('Order ID is required');

  try {
    const response = await axios.get<ApiResponse<Order>>(
      `${API_BASE_URL}/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success || !response.data.order) {
      throw new Error(response.data.message || 'Order not found');
    }

    return response.data.order;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Network error while fetching order details'
      );
    }
    throw new Error('Unexpected error while fetching order details');
  }
};

// Delete order
export const deleteOrder = async (orderId: string, token: string): Promise<string> => {
  if (!token) throw new Error('Authentication token is required');
  if (!orderId) throw new Error('Order ID is required');

  try {
    const response = await axios.delete<ApiResponse<{ deletedOrderId: string }>>(
      `${API_BASE_URL}/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete order');
    }

    return response.data.message || 'Order deleted successfully';
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Network error while deleting order'
      );
    }
    throw new Error('Unexpected error while deleting order');
  }
};

// Update order status (changed from PATCH to PUT and updated endpoint)
export const updateOrderStatus = async (orderId: string, token: string): Promise<Order> => {
  if (!token) throw new Error('Authentication token is required');
  if (!orderId) throw new Error('Order ID is required');

  try {
    const response = await axios.put<ApiResponse<Order>>(
      `${API_BASE_URL}/status/${orderId}`, // Updated endpoint
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.success || !response.data.order) {
      throw new Error(response.data.message || 'Failed to update order status');
    }

    return response.data.order;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Network error while updating order status'
      );
    }
    throw new Error('Unexpected error while updating order status');
  }
};