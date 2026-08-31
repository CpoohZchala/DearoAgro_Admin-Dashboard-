import axios from 'axios';


// =========================================================
// TYPES
// No separate orderModel.ts file needed
// =========================================================

export interface OrderItem {
  _id?: string;

  stockId: string;

  name: string;

  image?: string;

  quantity: number;

  price: number;
}


export interface Order {
  _id: string;

  buyerId: string;

  items: OrderItem[];

  totalAmount: number;

  shippingAddress: string;

  status: 'Pending' | 'Completed';

  paymentMethod: string;

  createdAt: string;

  updatedAt: string;
}


// =========================================================
// API RESPONSE
// =========================================================

interface ApiResponse {
  success: boolean;

  message?: string;

  error?: string;

  count?: number;

  orders?: Order[];

  order?: Order;

  deletedOrderId?: string;
}


// =========================================================
// BASE URL
// =========================================================

const API_BASE_URL =
  'https://dearoagro-backend.onrender.com/api/orders';


// =========================================================
// AXIOS ERROR TYPE GUARD
// =========================================================

function isAxiosError(
  error: unknown
): error is {
  isAxiosError: boolean;

  response?: {
    data?: {
      message?: string;
      error?: string;
    };

    status?: number;
  };
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error
  );
}


// =========================================================
// CREATE ORDER
// POST /api/orders
// =========================================================

export const createOrder = async (
  orderData: {
    shippingAddress: string;
    paymentMethod: string;
  },

  token: string
): Promise<Order> => {

  if (!token) {
    throw new Error(
      'Authentication token is required'
    );
  }


  try {

    const response =
      await axios.post<ApiResponse>(
        API_BASE_URL,

        orderData,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            'Content-Type':
              'application/json',
          },
        }
      );


    if (
      !response.data.success ||
      !response.data.order
    ) {
      throw new Error(
        response.data.message ||
        'Failed to create order'
      );
    }


    return response.data.order;

  } catch (error) {

    if (isAxiosError(error)) {

      throw new Error(
        error.response?.data?.message ||
        'Network error while creating order'
      );
    }


    if (error instanceof Error) {
      throw error;
    }


    throw new Error(
      'Unexpected error while creating order'
    );
  }
};


// =========================================================
// ADMIN - FETCH ALL ORDERS
// GET /api/orders
// =========================================================

export const fetchOrders = async (
  token: string
): Promise<Order[]> => {

  if (!token) {
    throw new Error(
      'Authentication token is required'
    );
  }


  try {

    const response =
      await axios.get<ApiResponse>(
        API_BASE_URL,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    if (!response.data.success) {
      throw new Error(
        response.data.message ||
        'Failed to fetch orders'
      );
    }


    return response.data.orders || [];

  } catch (error) {

    if (isAxiosError(error)) {

      throw new Error(
        error.response?.data?.message ||
        'Network error while fetching orders'
      );
    }


    if (error instanceof Error) {
      throw error;
    }


    throw new Error(
      'Unexpected error while fetching orders'
    );
  }
};


// =========================================================
// GET SINGLE ORDER
// GET /api/orders/:orderId
// =========================================================

export const getOrderById = async (
  orderId: string,

  token: string
): Promise<Order> => {

  if (!token) {
    throw new Error(
      'Authentication token is required'
    );
  }


  if (!orderId) {
    throw new Error(
      'Order ID is required'
    );
  }


  try {

    const response =
      await axios.get<ApiResponse>(
        `${API_BASE_URL}/${orderId}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    if (
      !response.data.success ||
      !response.data.order
    ) {
      throw new Error(
        response.data.message ||
        'Order not found'
      );
    }


    return response.data.order;

  } catch (error) {

    if (isAxiosError(error)) {

      throw new Error(
        error.response?.data?.message ||
        'Network error while fetching order details'
      );
    }


    if (error instanceof Error) {
      throw error;
    }


    throw new Error(
      'Unexpected error while fetching order details'
    );
  }
};


// =========================================================
// ADMIN - UPDATE ORDER STATUS
// PUT /api/orders/:orderId/status
// =========================================================

export const updateOrderStatus = async (
  orderId: string,

  token: string,

  status: 'Pending' | 'Completed' = 'Completed'
): Promise<Order> => {

  if (!token) {
    throw new Error(
      'Authentication token is required'
    );
  }


  if (!orderId) {
    throw new Error(
      'Order ID is required'
    );
  }


  try {

    const response =
      await axios.put<ApiResponse>(
        `${API_BASE_URL}/${orderId}/status`,

        {
          status,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            'Content-Type':
              'application/json',
          },
        }
      );


    if (
      !response.data.success ||
      !response.data.order
    ) {
      throw new Error(
        response.data.message ||
        'Failed to update order status'
      );
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


    if (error instanceof Error) {
      throw error;
    }


    throw new Error(
      'Unexpected error while updating order status'
    );
  }
};


// =========================================================
// ADMIN - DELETE ORDER
// DELETE /api/orders/:orderId
// =========================================================

export const deleteOrder = async (
  orderId: string,

  token: string
): Promise<string> => {

  if (!token) {
    throw new Error(
      'Authentication token is required'
    );
  }


  if (!orderId) {
    throw new Error(
      'Order ID is required'
    );
  }


  try {

    const response =
      await axios.delete<ApiResponse>(
        `${API_BASE_URL}/${orderId}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    if (!response.data.success) {

      throw new Error(
        response.data.message ||
        'Failed to delete order'
      );
    }


    return (
      response.data.message ||
      'Order deleted successfully'
    );

  } catch (error) {

    if (isAxiosError(error)) {

      throw new Error(
        error.response?.data?.message ||
        'Network error while deleting order'
      );
    }


    if (error instanceof Error) {
      throw error;
    }


    throw new Error(
      'Unexpected error while deleting order'
    );
  }
};