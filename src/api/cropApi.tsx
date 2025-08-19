const API_BASE_URL = 'https://dearoagro-backend.onrender.com/api';

export interface Crop {
  _id?: string;
  name: string;
  category: string;
  imageUrl: string;
}

// Fetch all crops
export const fetchCrops = async (): Promise<Crop[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/crops`);
    if (!response.ok) throw new Error('Failed to fetch crops');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch crops');
  }
};

// Fetch crop by ID
export const fetchCropById = async (id: string): Promise<Crop> => {
  try {
    const response = await fetch(`${API_BASE_URL}/crops/${id}`);
    if (!response.ok) throw new Error('Failed to fetch crop');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch crop');
  }
};

// Add new crop
export const addCrop = async (cropData: Omit<Crop, '_id'>): Promise<Crop> => {
  try {
    const response = await fetch(`${API_BASE_URL}/crops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cropData),
    });
    
    if (!response.ok) throw new Error('Failed to add crop');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to add crop');
  }
};

// Update crop
export const updateCrop = async (id: string, cropData: Omit<Crop, '_id'>): Promise<Crop> => {
  try {
    const response = await fetch(`${API_BASE_URL}/crops/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cropData),
    });
    
    if (!response.ok) throw new Error('Failed to update crop');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to update crop');
  }
};

// Delete crop
export const deleteCrop = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/crops/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete crop');
  } catch (error) {
    throw new Error('Failed to delete crop');
  }
};