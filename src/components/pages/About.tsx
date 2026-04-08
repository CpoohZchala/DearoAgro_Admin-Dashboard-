import { Card } from "@/components/ui/card";
import { CalendarCheck, CheckCircle, PiggyBank } from "lucide-react";
import featuresData from "@/data/features.json";

// Define the icon type for better TypeScript support
type IconType = 'CalendarCheck' | 'PiggyBank' | 'CheckCircle';

const iconMap: Record<IconType, React.ReactElement> = {
  CalendarCheck: <CalendarCheck className="w-12 h-12 text-emerald-600" />, 
  PiggyBank: <PiggyBank className="w-12 h-12 text-blue-600" />, 
  CheckCircle: <CheckCircle className="w-12 h-12 text-green-600" />
};

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
    {/* Header Section with Image */}
    <section className="mt-15 w-full flex justify-center py-10">
      <img
        src="/about/about.png"
        alt="About Background"
        className="w-full h-full object-cover"
      />
    </section>

    {/* About Section with Modern Design */}
    <section className="px-6 md:px-16 lg:px-24 py-16 relative">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="mb-12 text-center">
          <h2 className="font-extrabold text-green-950 text-3xl lg:text-5xl mb-5">
            About Our Company
          </h2>
          {/* line */}
          <div className="w-32 h-1 bg-gradient-to-r from-green-800 to-emerald-800 mx-auto rounded-full mb-10"></div>
        
          {/* about our company image*/}
          <div className="relative max-w-4xl mx-auto group perspective-1000 mb-16">
            <div className="absolute inset-x-0 -bottom-10 h-24 bg-gradient-to-t from-gray-200/50 to-transparent blur-3xl rounded-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white transform-gpu group-hover:translate-y-[-8px] group-hover:rotate-x-2 transition-all duration-500 ease-out">
              <img
                src="/about/about2.webp"
                alt="About Our Company"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/10 p-8 lg:p-12 border border-gray-200/50">
          <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
            At <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Dearo Investment Limited</span>, we are committed to empowering Sri Lankan farmers by providing innovative agricultural solutions tailored to their needs. Our mission is to create opportunities for farmers to achieve agricultural excellence through modern farming techniques and sustainable practices.
          </p>
          <div className="my-8 w-16 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
          <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
            With a strong foundation in agricultural development, we help farmers and agricultural businesses secure stable, long-term growth. Whether you're looking for <span className="font-bold text-green-700">Smart Cultivation Planning</span>, <span className="font-bold text-blue-700">Financial Support</span>, or <span className="font-bold text-emerald-700">Expert Agricultural Guidance</span>, our services are designed to support your journey toward agricultural success.
          </p>
        </div>
      </div>
    </section>

    {/* Vision & Mission Sections with Modern Cards */}
    <section className="px-6 md:px-16 lg:px-24 py-16 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Vision Card */}
          <div className="group">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-500 hover:scale-105 border border-green-400/20">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-3xl font-black mb-6">Our Vision</h3>
                <div className="w-16 h-1 bg-white/40 mx-auto mb-6 rounded-full"></div>
                <p className="text-lg leading-relaxed text-green-50">
                  To be a leading agricultural technology company that empowers Sri Lankan farmers through accessible and innovative farming solutions, fostering economic growth and agricultural sustainability.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className="group">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 shadow-2xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-500 hover:scale-105 border border-blue-400/20">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-3xl font-black mb-6">Our Mission</h3>
                <div className="w-16 h-1 bg-white/40 mx-auto mb-6 rounded-full"></div>
                <p className="text-lg leading-relaxed text-blue-50">
                  At <span className="font-bold text-white">Dearo Agro</span>, our mission is to provide farmers with agricultural opportunities that enable them to achieve independence, grow their farming businesses, and secure a prosperous future. We are committed to offering tailored agricultural products, expert guidance, and long-term farming solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Why Choose Us Section with Enhanced Cards */}
    <section className="px-6 md:px-16 lg:px-24 py-16 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-800 via-purple-700 to-blue-600 bg-clip-text text-transparent mb-6">
            Why Choose Us?
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what makes us the preferred choice for agricultural excellence and sustainable farming solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div key={index} className="group">
              <Card className="relative overflow-hidden rounded-3xl border-0 shadow-2xl shadow-gray-900/10 hover:shadow-2xl hover:shadow-gray-900/20 transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-xl">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                <div className="relative p-8">
                  {/* Icon Container */}
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-gray-900/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-gray-200/50">
                      {iconMap[feature.icon as IconType]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    {feature.description && (
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    )}
                  </div>

                  {/* Hover Effect Gradient */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
