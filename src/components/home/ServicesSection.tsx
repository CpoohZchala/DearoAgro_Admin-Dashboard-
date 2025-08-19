import React, { JSX } from "react";
import servicesData from "@/data/servicesData.json";
import { Building, Lightbulb, BookOpen } from "lucide-react";

const iconMap: Record<string, JSX.Element> = {
  Building: <Building className="w-8 h-8 text-white" />,
  Lightbulb: <Lightbulb className="w-8 h-8 text-white" />,
  BookOpen: <BookOpen className="w-8 h-8 text-white" />
};

const ServicesSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-green-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full bg-green-200"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2334d399' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold text-green-950 p-6 rounded-2xl mb-2">
            Our Services
          </h2>
          <p className="text-xl text-green-800 md:text-2xl font-semibold mx-auto leading-relaxed bg-white/50 px-6 py-3 rounded-xl shadow mb-8">
            Empowering agricultural excellence through innovative solutions and expert guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100 hover:border-green-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {iconMap[service.icon]}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-700 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
