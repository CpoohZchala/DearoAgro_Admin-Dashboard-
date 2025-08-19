export interface Buyer {
  _id: string;
  fullName: string;
  mobileNumber:number;

}

export interface OrderItem {
  productId: string;
  harvestId?: string; // Optional as it might not be required for all products
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  _id: string;
  buyerId: string;
  buyer: Buyer;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  status: 'pending' | 'complete';
  paymentMethod: string;
  createdAt: string; // ISO date string from backend
}

// Optional: If you need populated references
export interface PopulatedOrderItem extends Omit<OrderItem, 'productId' | 'harvestId'> {
  productId: {
    _id: string;
    name: string;
    // Add other product fields as needed
  };
  harvestId?: {
    _id: string;
    // Add other stock/harvest fields as needed
  };
  quantity: number;
  price: number;
  name: string;
}

export interface PopulatedOrder extends Omit<Order, 'items' | 'buyerId'> {
  buyerId: {
    _id: string;
    name: string;
    email: string;
    // Add other user fields as needed
  };
  items: PopulatedOrderItem[];
}
