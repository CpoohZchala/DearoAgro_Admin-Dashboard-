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
import CropDetails from './components/dashboard/CropDetails';
import FarmerInquirie from './components/dashboard/FarmerInquirie';
import MarketingOfficers from './components/dashboard/MarketingOfficers';
import ProductManagement from './components/dashboard/ProductManagement';
import HarvestDetails from './components/dashboard/HarvestDetails';
import Home from './components/home/Home';
import About from '@/components/pages/About';
import Contact from './components/pages/Contact';
import Layout from './components/Layout';
import Products from './components/pages/products';
import OrderDetails from './components/dashboard/OrderDetails';
import ManageCrops from './components/dashboard/ManageCrops';
import ScrollToTop from './components/ScrollToTop';

const App: FC = () => {
  const isAuthenticated: boolean = !!localStorage.getItem('token');
  const userType: string | null = localStorage.getItem('userType');

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes with Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        
        {/* Auth routes without Layout */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Dashboard routes with their own DashboardLayout */}
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
          <Route path="harvest" element={<HarvestDetails/>} />  
          {/* <Route path="crop" element={<CropManagement/>} />  */}
          <Route path="managecrops" element={<ManageCrops/>} />

          <Route path="orders" element={<OrderDetails token={localStorage.getItem('token') || ''}/>} />   
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/signin"} replace />} />
      </Routes>
    </Router>
  );
};

export default App;