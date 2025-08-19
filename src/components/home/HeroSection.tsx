import ContactPop from "../dialogs/contact";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

const images = [
  "/heroSection/image1.png",
  "/heroSection/image2.png"
];

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="min-h-[100svh] bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      

      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center min-h-[calc(100vh-8rem)]">
          
          {/* Image Carousel - Responsive */}
          <div className="xl:col-span-7 order-2 xl:order-1 w-full">
            <div className="relative group max-w-full">
              {/* Decorative frame - Responsive */}
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-green-900 via-emerald-600 to-yellow-500 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              <div className="relative bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-xl sm:shadow-2xl">
                <Swiper
                  modules={[Pagination, Autoplay, EffectFade]}
                  spaceBetween={0}
                  slidesPerView={1}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  pagination={{ 
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-green-600 !w-2 !h-2 sm:!w-3 sm:!h-3',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-yellow-500'
                  }}
                  autoplay={{ 
                    delay: 4000,
                    disableOnInteraction: false
                  }}
                  loop={true}
                  className="rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl"
                >
                  {images.map((src, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
                        <img 
                          src={src} 
                          alt={`Agricultural Excellence ${index + 1}`} 
                          className="w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px] object-cover transition-transform duration-700 hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          {/* Content - Fully Responsive */}
          <div className="xl:col-span-5 order-1 xl:order-2 text-center xl:text-left mt-8 sm:px-0">
            {/* Main Heading - Responsive Typography */}
            <div className="space-y-2 sm:space-y-4 lg:space-y-6">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-black leading-tight">
                <span className="mt-7 block bg-gradient-to-r from-green-900 via-emerald-600 to-green-800 bg-clip-text text-transparent drop-shadow-sm">
                  ජාතිය ගොඩනගන
                </span>
                <span className="block bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm mt-1 sm:mt-2">
                  ශ්‍රී ලාංකීය හදගැස්ම
                </span>
              </h1>
              
              {/* Subtitle - Responsive */}
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl mx-auto xl:mx-0 leading-relaxed px-4 sm:px-0">
                Empowering Sri Lankan agriculture through innovation, dedication, and sustainable farming practices for a prosperous future.
              </p>
            </div>

            {/* Stats - Responsive Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 py-4 sm:py-6 lg:py-8 max-w-sm mx-auto xl:max-w-none xl:mx-0">
              <div className="text-center xl:text-left p-3 sm:p-4 bg-white/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-green-100">
                <div className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900">1000+</div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">Happy Farmers</div>
              </div>
              <div className="text-center xl:text-left p-3 sm:p-4 bg-white/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-yellow-100">
                <div className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-600">500+</div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">Projects Completed</div>
              </div>
            </div>

            {/* CTA Buttons - Fully Responsive */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center xl:justify-start max-w-md mx-auto xl:max-w-none xl:mx-0">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="group relative bg-gradient-to-r from-green-900 to-emerald-600 text-white px-4 xs:px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base lg:text-lg shadow-lg sm:shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full xs:w-auto">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Contact Us
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </DialogTrigger>
                <ContactPop />
              </Dialog>

             
            </div>

            {/* Trust Indicators - Mobile Friendly */}
            <div className="flex flex-wrap justify-center xl:justify-start gap-4 sm:gap-6 pt-4 sm:pt-6 lg:pt-8">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <svg className="w-4 h-4 text-green-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted by 1000+ farmers
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <svg className="w-4 h-4 text-green-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sustainable practices
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
};

export default HeroSection;
