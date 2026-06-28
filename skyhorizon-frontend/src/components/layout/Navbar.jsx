import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/images/logo.png';
import { 
  IoAirplaneOutline, 
  IoBedOutline, 
  IoPricetagOutline, 
  IoBriefcaseOutline, 
  IoHeadsetOutline, 
  IoMenuOutline, 
  IoCloseOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoChevronDownOutline
} from 'react-icons/io5';
import { useBooking } from '../../context/BookingContext';

// Derive initials from a name string
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useBooking();
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Flights', path: '/flights', icon: <IoAirplaneOutline className="w-4 h-4" /> },
    { name: 'Hotels', path: '#hotels', icon: <IoBedOutline className="w-4 h-4" /> },
    { name: 'Offers', path: '#offers', icon: <IoPricetagOutline className="w-4 h-4" /> },
    { name: 'My Trips', path: '/my-bookings', icon: <IoBriefcaseOutline className="w-4 h-4" /> },
    { name: 'Support', path: '#support', icon: <IoHeadsetOutline className="w-4 h-4" /> },
  ];

  const isActive = (path) => {
    if (path.startsWith('#')) return false;
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const initials = getInitials(user?.name);

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 ${
          isScrolled 
            ? 'glass shadow-[0_8px_32px_0_rgba(15,23,42,0.3)] border-b border-white/5' 
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="flex items-center justify-center overflow-hidden h-16 w-52 relative"
            >
              <img 
                src={logoImg} 
                alt="SkyHorizon Airways" 
                className="absolute w-[240%] h-[240%] max-w-none object-contain left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              />
            </motion.div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 group ${
                    active 
                      ? 'text-gold' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  <span className="tracking-wide">{link.name}</span>
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0.5 left-4 right-4 h-[1.5px] bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-5">
            {user ? (
              /* ── Logged-in: Profile Avatar Dropdown ── */
              <div className="relative" ref={profileMenuRef}>
                <button
                  id="profile-menu-trigger"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 group cursor-pointer focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isProfileMenuOpen}
                >
                  {/* Initials Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center text-navy-950 text-xs font-black shadow-md border border-gold/30 flex-shrink-0">
                    {initials}
                  </div>
                  <span className="text-xs font-bold text-slate-200 max-w-[100px] truncate">
                    {user.name?.split(' ')[0] || 'Account'}
                  </span>
                  <IoChevronDownOutline
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-52 bg-navy-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs font-black text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        <Link
                          to="/profile"
                          id="nav-my-profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <IoPersonOutline className="w-4 h-4 text-gold" />
                          My Profile
                        </Link>
                        <Link
                          to="/my-bookings"
                          id="nav-my-trips"
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <IoBriefcaseOutline className="w-4 h-4 text-gold" />
                          My Trips
                        </Link>
                        <div className="border-t border-white/5 mt-1 pt-1">
                          <button
                            id="nav-logout"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors cursor-pointer"
                          >
                            <IoLogOutOutline className="w-4 h-4" />
                            Log Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Logged-out: Log In + Sign Up ── */
              <>
                <Link to="/login" id="nav-login" className="text-xs font-bold tracking-wider text-slate-300 hover:text-white uppercase transition-colors">
                  Log in
                </Link>
                
                <Link to="/register" id="nav-signup">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 15px rgba(245, 166, 35, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-navy-950 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 shadow-md cursor-pointer"
                  >
                    Sign up
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile avatar when logged in */}
            {user && (
              <Link to="/profile">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center text-navy-950 text-xs font-black shadow-md border border-gold/30">
                  {initials}
                </div>
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <IoCloseOutline className="w-8 h-8" /> : <IoMenuOutline className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Slide-out Drawer Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-navy-950/80 z-40 lg:hidden backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-navy-950/95 border-l border-white/5 z-50 lg:hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center justify-center overflow-hidden h-12 w-40 relative">
                  <img 
                    src={logoImg} 
                    alt="SkyHorizon Airways" 
                    className="absolute w-[240%] h-[240%] max-w-none object-contain left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
                >
                  <IoCloseOutline className="w-8 h-8" />
                </button>
              </div>

              {/* User info in drawer when logged in */}
              {user && (
                <div className="flex items-center gap-3 mt-6 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center text-navy-950 text-sm font-black border border-gold/30 flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black text-white truncate">{user.name}</span>
                    <span className="text-[10px] text-slate-500 font-semibold truncate">{user.email}</span>
                  </div>
                </div>
              )}

              {/* Menu Navigation */}
              <div className="flex flex-col gap-2 mt-6">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all duration-200 ${
                        active 
                          ? 'bg-gold/10 text-gold' 
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.icon}
                      <span className="text-sm tracking-wide">{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex flex-col gap-4">
                {user ? (
                  <>
                    <Link to="/profile" className="w-full">
                      <button className="w-full py-3.5 rounded-lg font-bold text-center text-slate-300 border border-slate-700 hover:border-gold/50 active:scale-95 transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2">
                        <IoPersonOutline className="w-4 h-4 text-gold" />
                        My Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3.5 rounded-lg font-bold text-center text-red-400 border border-red-500/20 hover:bg-red-500/10 active:scale-95 transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <IoLogOutOutline className="w-4 h-4" />
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="w-full">
                      <button className="w-full py-3.5 rounded-lg font-bold text-center text-slate-300 border border-slate-700 hover:border-gold/50 active:scale-95 transition-all uppercase tracking-wider text-xs">
                        Log in
                      </button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <button className="w-full py-3.5 rounded-lg font-bold text-center text-navy-950 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 shadow-lg active:scale-95 transition-all uppercase tracking-wider text-xs">
                        Sign up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
