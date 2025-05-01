const BASE_URL = 'https://dearoagro-backend.onrender.com/api/groups';
export interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

// Fetch all groups
export const getGroups = async (): Promise<ApiResponse> => {
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

// Create a new group
export const createGroup = async (groupData: { name: string }): Promise<ApiResponse> => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupData),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Assign a farmer to a group
export const assignFarmerToGroup = async (groupId: string, farmerId: string): Promise<ApiResponse> => {
  try {
    console.log('Assigning farmer to group:', { groupId, farmerId });

    const decodedGroupId = decodeURIComponent(groupId);

    const response = await fetch(`${BASE_URL}/${decodedGroupId}/assign-farmer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmerId }),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Edit a group
export const editGroup = async (groupId: string, groupData: { name: string }): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${groupId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupData),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Delete a group
export const deleteGroup = async (groupId: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${groupId}`, {
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

// Fetch members of a specific group
export const getGroupMembers = async (groupId: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${groupId}/members`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};