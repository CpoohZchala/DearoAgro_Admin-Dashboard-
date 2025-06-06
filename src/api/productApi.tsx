import axios from 'axios';
import { Product } from '../models/Product';

const API_URL = '/api/products';

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
