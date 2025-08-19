import axios from "axios";

const BASE_URL = "https://dearoagro-backend.onrender.com/api/farmers";

export interface FarmerData {
  fullName: string;
  mobileNumber: string;
  password?: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

// Fetch all farmers
export const getFarmers = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(BASE_URL);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Fetch a single farmer by ID
export const getFarmerById = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Create a new farmer
export const createFarmer = async (farmerData: FarmerData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(BASE_URL, farmerData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Update a farmer by ID
export const updateFarmer = async (id: string, farmerData: FarmerData): Promise<ApiResponse> => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, farmerData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

// Delete a farmer by ID
export const deleteFarmer = async (id: string): Promise<ApiResponse> => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || error.message };
  }
};
