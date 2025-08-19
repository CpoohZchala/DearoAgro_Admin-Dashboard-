import axios from 'axios';
import { Product } from '../models/Product';

const API_URL = 'https://dearoagro-backend.onrender.com/api/products';

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(API_URL);
  return response.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/${id}`);
  return response.data;
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await axios.post<Product>(API_URL, product);
  return response.data;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  try {
    const response = await axios.put<Product>(`${API_URL}/${id}`, product);
    console.log('Product updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    console.log('Deleting product with id:', id); // Debugging log
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log('Product deleted successfully:', response.data);
  } catch (error: any) {
    if (error.response) {
      console.error(`Backend error: ${error.response.status} - ${error.response.data}`);
    } else {
      console.error('Error deleting product:', error.message);
    }
    throw error;
  }
};

export const addProductFromHarvest = async (harvestData: {
  name: string;
  category: string;
  quantity: number;
  pricePerKg: number;
  harvestId: string;
  farmerName: string;
}): Promise<Product> => {
  try {
    const productData = {
      name: harvestData.name,
      price: harvestData.pricePerKg,
      image: '/images/default-crop.jpg',
      category: harvestData.category || 'Agricultural',
      quantity: harvestData.quantity,
      harvestId: harvestData.harvestId

    };
    
    console.log('Sending product data to backend:', productData);
    
    const response = await axios.post<Product>(API_URL, productData);
    console.log('Product created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating product from harvest:', error);
    
    if (error.response) {
      console.error('Backend error details:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error: Unable to reach server');
    } else {
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
};

export const removeProductByHarvestId = async (harvestId: string): Promise<void> => {
  try {
    console.log('Removing product with harvestId:', harvestId);
    // Since your backend doesn't have harvestId field, we'll need to find by name or implement a different approach
    // For now, let's use a different endpoint or modify this based on your backend capabilities
    const response = await axios.delete(`${API_URL}/by-harvest/${harvestId}`);
    console.log('Product removed successfully:', response.data);
  } catch (error: any) {
    console.error('Error removing product by harvest ID:', error);
    
    if (error.response?.status === 404) {
      console.warn('Product not found, might already be removed');
      return;
    }
    
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else {
      throw new Error(`Network error: ${error.message}`);
    }
  }
};


// Simplified crop creation endpoint
export const createCrop = async (cropData: {
  name: string;
  category: string;
  image: string;
}): Promise<Product> => {
  try {
    // Include required fields with default values
    const payload = {
      ...cropData,
      price: 0,
      quantity: 0,
      harvestId: 'default-harvest-id' // Or null if your backend allows it
    };

    const response = await axios.post<Product>(API_URL, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error creating crop:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create crop');
  }
};

