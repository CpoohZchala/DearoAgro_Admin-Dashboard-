import React from 'react';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
      
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      
    </div>
  );
};

export default Home;