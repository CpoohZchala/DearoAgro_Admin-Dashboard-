import { Link } from "react-router-dom";
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhone, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-br from-green-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-1/3 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative group">
                  <img
                    src="/navBar/logo.png"
                    alt="Dearo Investment Limited"
                    className="h-16 w-auto drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Dearo Investment Limited
                  </h3>
                  <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mt-1"></div>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Secure your future by investing in our company and enjoy consistent long-term profits with trusted growth and innovative solutions.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 font-medium">Follow us:</span>
              <div className="flex gap-3">
                {[
                  { icon: FaFacebookF, href: "https://www.facebook.com/dearoinvestmentlimited/", color: "from-blue-600 to-blue-500" },
                  // { icon: FaTwitter, href: "#", color: "from-sky-500 to-blue-400" },
                  { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/dearoinvestmentlimited/?lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3BpU8y6WIISbCTKAWTBSKzrQ%3D%3D", color: "from-blue-700 to-blue-600" },
                  // { icon: FaInstagram, href: "#", color: "from-purple-600 to-pink-500" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative w-12 h-12 rounded-2xl bg-gradient-to-br ${social.color} flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1`}
                  >
                    <social.icon className="text-white text-lg group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold mb-6 text-white relative">
                Quick Links
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
              </h4>
              <ul className="space-y-4">
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About Us" },
                  { to: "/products", label: "Our Services" },
                  { to: "/contact", label: "Contact" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="group flex items-center text-gray-300 hover:text-white transition-all duration-300"
                    >
                      <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-300 mr-0 group-hover:mr-3"></div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold mb-6 text-white relative">
                Get In Touch
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
              </h4>
              <ul className="space-y-6">
                {[
                  { 
                    icon: FaMapMarkerAlt, 
                    text: "8th floor, Ceylinco House, No 69, Janadhipathi Mawatha, Colombo 01.",
                    color: "text-red-400"
                  },
                  { 
                    icon: FaPhone, 
                    text: "+94743665263",
                    color: "text-green-400"
                  },
                  { 
                    icon: FaEnvelope, 
                    text: "agri@dearoinvestment.com",
                    color: "text-blue-400"
                  },
                  { 
                    icon: FaClock, 
                    text: "8:30 AM - 5:30 PM",
                    color: "text-yellow-400"
                  }
                ].map((contact, index) => (
                  <li key={index} className="group flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center ${contact.color} group-hover:scale-110 transition-transform duration-300`}>
                      <contact.icon className="text-lg" />
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                      {contact.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                &copy; 2025 <span className="text-white font-semibold">Dearo Investment Limited</span>. All Rights Reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Designed with ❤️ for your financial future
              </p>
            </div>
            
            {/* <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <Link to="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <Link to="/sitemap" className="hover:text-white transition-colors duration-300">Sitemap</Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"></div>
    </footer>
  );
};

export default Footer;
