import { useEffect, useState } from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { getFarmers } from '../../api/farmerApi';
import { getGroups } from '../../api/groupApi';
import { Farmer } from '../../models/Farmer';
import { Leaf, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { GrOrderedList } from 'react-icons/gr';
import { BsQuestion } from 'react-icons/bs';

const DashboardHome: FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await getFarmers();
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch farmers.');
        }
        setFarmers(response.data.map((farmer: any) => new Farmer(farmer)));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getGroups();
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch groups.');
        }
        setGroups(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchGroups();
  }, []);

  const dashboardCards = [
    {
      title: 'Farmers Management',
      description: 'View, add, edit, and delete farmers',
      link: '/dashboard/farmers',
      action: 'Go to Farmers',
      icon: Leaf,
      badge: 'Farmers',
      gradient: 'from-green-500 to-emerald-600',
      bg: 'from-green-50 to-emerald-50',
    },
    {
      title: 'Farmer Groups',
      description: 'Manage farmer groups and assignments',
      link: '/dashboard/groups',
      action: 'Go to Groups',
      icon: Users,
      badge: 'Groups',
      gradient: 'from-lime-500 to-green-600',
      bg: 'from-lime-50 to-green-50',
    },
    {
      title: 'Farmer Cultivational Details',
      description: 'Can view updated cultivational details',
      link: '/dashboard/cropdetails',
      action: 'Go to Details',
      icon: GrOrderedList,
      badge: 'Cultivation',
      gradient: 'from-yellow-500 to-amber-500',
      bg: 'from-yellow-50 to-amber-50',
    },
    {
      title: 'Farmer Inquiries',
      description: 'Can view farmer inquiries',
      link: '/dashboard/farmerinquiries',
      action: 'Go to Inquiries',
      icon: BsQuestion,
      badge: 'Support',
      gradient: 'from-orange-500 to-yellow-500',
      bg: 'from-orange-50 to-yellow-50',
    },
    {
      title: 'Calendar',
      description: 'View and manage events and schedules',
      link: '/dashboard/calendar',
      action: 'Go to Calendar',
      icon: Calendar,
      badge: 'Schedule',
      gradient: 'from-teal-500 to-green-600',
      bg: 'from-teal-50 to-green-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 p-6 sm:p-8 lg:p-10 mb-8 shadow-xl">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-yellow-300/20 rounded-full"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/20">
                <Sparkles size={16} />
                Welcome back, Super Admin
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                🌿 Super Admin Dashboard
              </h1>

              <p className="mt-4 text-green-50 text-sm sm:text-base max-w-2xl">
                Manage farmers, groups, cultivation details, inquiries, and schedules from one clean dashboard.
              </p>
            </div>

            <div className="bg-white/15 border border-white/20 rounded-2xl p-5 backdrop-blur-sm text-white min-w-[220px]">
              <p className="text-sm text-green-50">Dashboard Overview</p>
              <p className="text-3xl font-extrabold mt-2">
                {loading ? '...' : farmers.length + groups.length}
              </p>
              <p className="text-sm text-green-50 mt-1">
                Total records loaded
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                📊 Quick Stats
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Live overview of your platform
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white border border-green-100 p-8 rounded-2xl shadow-sm">
              <p className="text-gray-500 text-center">Loading...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 p-8 rounded-2xl shadow-sm">
              <p className="text-red-500 text-center">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-28 h-28 bg-green-100 rounded-bl-full"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Total Farmers
                    </p>
                    <p className="mt-3 text-4xl font-extrabold text-gray-900">
                      {farmers.length}
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      Registered farmers
                    </p>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Leaf className="text-white" size={28} />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-md border border-yellow-100 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-100 rounded-bl-full"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Active Groups
                    </p>
                    <p className="mt-3 text-4xl font-extrabold text-gray-900">
                      {groups.length}
                    </p>
                    <p className="text-sm text-yellow-600 mt-2">
                      Farmer groups
                    </p>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <Users className="text-white" size={28} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Management Cards */}
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Management Tools
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose a section to manage
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-6 sm:mb-10">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon;

            return (
              <Link
                key={card.title}
                to={card.link}
                className={`group relative overflow-hidden bg-gradient-to-br ${card.bg} border border-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/60 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                <div className="absolute right-5 bottom-5 w-16 h-16 bg-white/40 rounded-full"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg text-white`}>
                      <IconComponent size={28} />
                    </div>

                    <span className="text-xs font-bold text-green-700 bg-white/80 border border-green-100 px-3 py-1 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight mb-3">
                    {card.title}
                  </h3>

                  <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                    {card.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-700 group-hover:text-green-900 transition-colors">
                      {card.action}
                    </span>

                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-green-600 transition-colors">
                      <ArrowRight
                        size={18}
                        className="text-green-700 group-hover:text-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;