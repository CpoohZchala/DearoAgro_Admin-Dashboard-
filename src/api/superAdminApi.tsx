import axios from 'axios';

const API_BASE_URL = 'http://192.168.8.125:5000';

export const getSuperAdminProfile = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/superAdminRoutes/${userId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch Super Admin profile.',
    };
  }
};