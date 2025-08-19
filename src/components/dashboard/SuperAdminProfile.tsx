import React, { useEffect, useState } from 'react';
import { getSuperAdminProfile } from '../../api/superAdminApi';
import { UserCircle2, ShieldCheck } from 'lucide-react'; // Make sure to install lucide-react

const SuperAdminProfile: React.FC = () => {
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userId = localStorage.getItem('userId');
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

  if (loading) return <p className="text-center text-gray-500 mt-10 animate-pulse">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white text-center">
          <h1 className="text-3xl font-bold tracking-wide">Welcome, Super Admin!</h1>
          <p className="text-sm opacity-90 mt-1">Your secure dashboard</p>
        </div>

        {/* Profile Card */}
        <div className="p-6 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full ring-4 ring-green-400 flex items-center justify-center">
              <UserCircle2 className="text-green-600 w-16 h-16" />
            </div>
          </div>

          {adminData && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Full Name</p>
                <h2 className="text-xl font-semibold text-gray-800">{adminData.fullName}</h2>
              </div>

              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="text-green-600" />
                <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  {adminData.userType}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminProfile;
