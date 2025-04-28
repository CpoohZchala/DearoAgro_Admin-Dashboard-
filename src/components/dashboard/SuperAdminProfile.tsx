import React, { useEffect, useState } from 'react';
import { getSuperAdminProfile } from '../../api/superAdminApi';

const SuperAdminProfile: React.FC = () => {
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('Retrieved userId:', userId);
        if (!userId) {
          throw new Error('User ID is missing. Please log in again.');
        }

        const response = await getSuperAdminProfile(userId);
        if (response.success) {
          setAdminData(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Super Admin Profile</h1>
      {adminData && (
        <div>
          <p><strong>Name:</strong> {adminData.fullName}</p>

          <p><strong>Role:</strong> {adminData.userType}</p>
        </div>
      )}
    </div>
  );
};

export default SuperAdminProfile;