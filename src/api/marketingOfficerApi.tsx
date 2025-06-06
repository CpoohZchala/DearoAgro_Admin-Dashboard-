import axios from "axios";

const API_URL = "https://dearoagro-backend.onrender.com/api/officers";

export const createMarketingOfficer = async (officerData: {
  fullName: string;
  mobileNumber: string;
  password: string;
  profileImage?: string;
  branchName: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, officerData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error creating marketing officer:", error);
    return { success: false, message: error.response?.data?.error || "Failed to create marketing officer" };
  }
};

export const getMarketingOfficers = async () => {
  try {
    const response = await axios.get(API_URL);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error fetching marketing officers:", error);
    return { success: false, message: error.response?.data?.error || "Failed to fetch marketing officers" };
  }
};

export const getMarketingOfficerById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error fetching marketing officer by ID:", error);
    return { success: false, message: error.response?.data?.error || "Failed to fetch marketing officer" };
  }
};

export const updateMarketingOfficer = async (
  id: string,
  officerData: {
    fullName?: string;
    mobileNumber?: string;
    profileImage?: string;
    branchName?: string;
  }
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, officerData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating marketing officer:", error);
    return { success: false, message: error.response?.data?.error || "Failed to update marketing officer" };
  }
};

export const deleteMarketingOfficer = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error deleting marketing officer:", error);
    return { success: false, message: error.response?.data?.error || "Failed to delete marketing officer" };
  }
};

export const changeMarketingOfficerPassword = async (
  id: string,
  passwordData: { oldPassword: string; newPassword: string }
) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/change-password`, passwordData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error changing marketing officer password:", error);
    return { success: false, message: error.response?.data?.error || "Failed to change password" };
  }
};
