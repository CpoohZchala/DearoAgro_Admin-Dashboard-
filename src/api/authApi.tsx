import axios from 'axios';

const API_BASE_URL = 'https://dearoagro-backend.onrender.com/api/auth';

export interface ApiResponse {
  userId: any;
  token?: string;
  userType?: string;
  id?: string;
  message?: string;
}

export const signIn = async (userData: any): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signin`, userData);
    return response.data as ApiResponse; // Ensure the response is typed as ApiResponse
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Sign in failed');
  }
};

export const signUp = async (userData: any): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data as ApiResponse; // Ensure the response is typed as ApiResponse
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Sign up failed');
  }
};

export const getCurrentUser = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};