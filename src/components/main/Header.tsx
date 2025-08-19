import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`z-50 w-full fixed top-0 left-0 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/98 backdrop-blur-2xl border-b border-gray-200/60 shadow-2xl shadow-gray-900/10' 
        : 'bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-xl shadow-gray-900/5'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-2 -right-2 w-32 h-32 bg-gradient-to-br from-green-400/5 to-emerald-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-4 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto flex items-center justify-between py-3 px-6 lg:px-8 h-[90px]">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-4 group z-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl scale-110"></div>
            <img 
              src='/navBar/logo-main.png' 
              alt="Logo" 
              className="relative w-auto h-16 drop-shadow-2xl rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-2.5 border-2 border-gray-100/80 group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 shadow-xl shadow-gray-900/10" 
            />
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-emerald-600 bg-clip-text text-transparent tracking-tight group-hover:scale-105 transition-transform duration-300">
                Dearo Agro
              </h1>
              <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full transition-all duration-500"></div>
              <div className="absolute -bottom-0.5 left-0 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full transition-all duration-700 delay-100"></div>
            </div>
            <p className="text-xs text-gray-500 font-medium tracking-wide mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
              Investment Excellence
            </p>
          </div>
        </NavLink>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden relative group text-gray-700 text-xl p-3 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            {menuOpen ? (
              <FaTimes className="text-red-500" />
            ) : (
              <FaBars className="text-green-600" />
            )}
          </div>
        </button>

        {/* Navigation Links */}
        <ul
          className={`lg:flex lg:items-center lg:space-x-1 font-medium 
          lg:static absolute top-[90px] left-0 w-full bg-white/98 backdrop-blur-2xl lg:bg-transparent 
          lg:w-auto shadow-2xl lg:shadow-none rounded-b-3xl border-x-2 border-b-2 border-gray-200/60 lg:border-none
          transition-all duration-700 ease-out transform
          ${menuOpen ? "translate-y-0 opacity-100 visible scale-100" : "-translate-y-6 opacity-0 invisible scale-95 lg:translate-y-0 lg:opacity-100 lg:visible lg:scale-100 lg:flex"}`}
        >
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About Us" },
            { to: "/products", label: "Our Services" },
            { to: "/contact", label: "Contact" }
          ].map((item, index) => (
            <li 
              key={item.to} 
              className="group my-2 lg:my-0 transform transition-all duration-300" 
              style={{ 
                animationDelay: `${index * 100}ms`,
                transitionDelay: menuOpen ? `${index * 50}ms` : '0ms'
              }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) => {
                  const baseClasses = `relative block px-6 py-3 mx-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 overflow-hidden group-hover:scale-105`;
                  
                  if (isActive) {
                    return `${baseClasses} bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/25 scale-105 ring-2 ring-green-400/60 border border-green-400/30`;
                  }
                  
                  return `${baseClasses} text-gray-700 hover:text-green-700 hover:bg-gradient-to-br hover:from-green-50 hover:via-emerald-50 hover:to-teal-50 hover:shadow-lg hover:shadow-green-100/50 border border-transparent hover:border-green-200/50`;
                }}
                onClick={closeMenu}
              >
                {({ isActive }) => (
                  <>
                    <div className="relative z-10">
                      <span className="font-medium tracking-wide text-base">{item.label}</span>
                    </div>
                    {!isActive && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300 rounded-full"></div>
                      </>
                    )}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 rounded-xl"></div>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
          
          {/* Mobile Sign In Button */}
          <li className="lg:hidden mx-6 my-4">
            <NavLink
              to="/signin"
              className="group relative block px-8 py-3 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 text-center border border-orange-400/30 overflow-hidden"
              onClick={closeMenu}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <span className="relative z-10 text-base">
                Sign In
              </span>
            </NavLink>
          </li>
        </ul>
        {/* Desktop Sign In Button */}
        <div className="hidden lg:flex items-center space-x-4 ml-6">
          <NavLink
            to="/signin"
            className="group relative px-8 py-3 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400/60 overflow-hidden border border-orange-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <span className="relative z-10 text-base font-medium tracking-wide">
              Sign In
            </span>
          </NavLink>
        </div>
      </div>

      {/* Floating gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-30"></div>
    </nav>
  );
}
