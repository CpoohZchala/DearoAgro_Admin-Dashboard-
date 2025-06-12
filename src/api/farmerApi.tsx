const BASE_URL = 'https://dearoagro-backend.onrender.com/api/farmers';

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
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Fetch a single farmer by ID
export const getFarmerById = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Create a new farmer
export const createFarmer = async (farmerData: FarmerData): Promise<ApiResponse> => {
  try {
    console.log('Creating farmer with data:', farmerData); // Debug log

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('Error in createFarmer:', error); // Log detailed error
    return { success: false, message: error.message };
  }
};

// Update a farmer by ID
export const updateFarmer = async (id: string, farmerData: FarmerData): Promise<ApiResponse> => {
  try {
    if (!id || id === 'undefined') {
      throw new Error('Invalid farmer ID');
    }
    
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('Error in updateFarmer:', error);
    return { success: false, message: error.message };
  }
};

// Delete a farmer by ID
export const deleteFarmer = async (id: string): Promise<ApiResponse> => {
  console.log("Deleting farmer with ID:", id); // 🐞 DEBUG LOG

  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
