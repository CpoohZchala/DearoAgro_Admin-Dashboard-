import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/dashboard/DashboardLayout';
import FarmersList from './components/dashboard/FarmersList';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import DashboardHome from './components/dashboard/DashboardHome';
import SuperAdminProfile from './components/dashboard/SuperAdminProfile';
import GroupManagement from './components/dashboard/GroupManagement';
import Calendar from './components/dashboard/Calendar';
import { FC } from 'react';
import React from 'react';
import CropDetails from './components/dashboard/CropDetails.tsx';
import FarmerInquirie from './components/dashboard/FarmerInquirie.tsx';
import MarketingOfficers from './components/dashboard/MarketingOfficers.tsx';
import ProductManagement from './components/dashboard/ProductManagement.tsx';

const App: FC = () => {
  const isAuthenticated: boolean = !!localStorage.getItem('token');
  const userType: string | null = localStorage.getItem('userType');

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={isAuthenticated && userType === 'Super Admin' ? (<DashboardLayout />) : (<Navigate to="/signin" replace />)}>
          <Route index element={<DashboardHome />} />
          <Route path="farmers" element={<FarmersList />} />
          <Route path="profile" element={<SuperAdminProfile />} />
          <Route path="groups" element={<GroupManagement />} />
          <Route path="calendar" element={<Calendar />}/>
          <Route path="cropdetails" element={<CropDetails />} />
          <Route path="inqueries" element={<FarmerInquirie/>} />
          <Route path="officers" element={<MarketingOfficers/>} />
          <Route path="products" element={<ProductManagement/>} />         
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
