import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { CheckCircle, PiggyBank, CalendarCheck } from "lucide-react";
import featuresData from "../../data/features.json";

type IconName = 'CalendarCheck' | 'PiggyBank' | 'CheckCircle';

const iconMap: Record<IconName, React.ReactElement> = {
  CalendarCheck: <CalendarCheck className="w-8 h-8 text-white" />,
  PiggyBank: <PiggyBank className="w-8 h-8 text-white" />,
  CheckCircle: <CheckCircle className="w-8 h-8 text-white" />,
};

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-8 w-full max-w-6xl mx-auto">
      {featuresData.map((feature, index) => (
        <Card
          key={index}
          className="mt-4 w-full rounded-3xl border border-white/30 bg-white/30 backdrop-blur-lg shadow-2xl transition-transform transform hover:scale-105 hover:shadow-green-200 flex flex-col items-center glass-card"
          style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
        >
          <div className="flex flex-col items-center gap-3 text-xl font-semibold text-white bg-gradient-to-br from-green-900 via-green-700 to-green-500 p-6 rounded-2xl w-20 h-20 -mt-8 shadow-lg border-4 border-white/40">
            {iconMap[feature.icon as IconName]}
          </div>
          <span className="mt-4 text-lg font-bold text-green-950 tracking-wide">{feature.title}</span>
          <CardContent className="mt-2 w-full flex-1 flex items-center justify-center">
            <p className="text-base text-gray-700 leading-relaxed font-medium">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AboutUs = () => (
  <section className="flex flex-col items-center text-center px-4 md:px-16 lg:px-24 py-16 min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-50 to-green-200 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-300 opacity-30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl" />
    </div>
    <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold text-green-950 p-6 rounded-2xl  mb-2">
      About Dearo Agro
    </h1>
    <p className="relative z-10 text-xl md:text-2xl font-semibold text-green-800 mt-4 max-w-3xl bg-white/50 px-6 py-3 rounded-xl shadow mb-8">
      ඉදිරි පරම්පරාව සඳහා තිරසාර අනාගතයක් නිර්මාණය කරමින්, කෘෂිකර්මය බුද්ධිමත් විසඳුම් සමඟ ශක්තිමත් කරමු
    </p>
    <FeatureCards />
  </section>
);

export default AboutUs;
