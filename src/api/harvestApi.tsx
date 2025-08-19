import axios from "axios";

const BASE_URL = "https://dearoagro-backend.onrender.com/api/stocks";

export interface HarvestData {
  memberId: string;
  fullName: string;
  mobileNumber: string;
  address: string;
  cropName: string;
  totalAmount: number;
  currentAmount: number;
  pricePerKg: number;
  harvestDate: string;
  currentPrice?: number;
  quantity?: number;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export const getHarvestRecords = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(BASE_URL);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

export const getHarvestById = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

export const getHarvestByFarmerId = async (memberId: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch/${memberId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

export const createHarvestRecord = async (harvestData: HarvestData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(BASE_URL, harvestData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

export const updateHarvestRecord = async (id: string, harvestData: Partial<HarvestData>): Promise<ApiResponse> => {
  try {
    const updatePayload = { id, ...harvestData };
    const response = await axios.put(`${BASE_URL}/update`, updatePayload);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

export const deleteHarvestRecord = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};

// Add this new function to fetch dashboard stock summary
export const getStockSummary = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/summary`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.error || error.message };
  }
};
