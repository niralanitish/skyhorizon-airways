import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  IoLogOutOutline, 
  IoPersonCircleOutline,
  IoPersonOutline,
  IoMailOutline,
  IoShieldOutline,
  IoBriefcaseOutline,
  IoAirplaneOutline
} from 'react-icons/io5';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/home/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Derive initials from a name string
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Format role string for display
function formatRole(role) {
  if (!role) return 'Member';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, bookings } = useBooking();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Guest / not logged in state
  if (!user) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow pt-24 pb-20 flex items-center justify-center px-6">
          <Card variant="glass" className="p-8 border border-white/5 max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-4">
              <IoPersonCircleOutline className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Guest Session</h3>
            <p className="text-slate-400 font-semibold text-xs mt-2 max-w-xs leading-relaxed">
              Log in or create a free membership profile to track flights and manage your bookings.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <Button
                onClick={() => navigate('/login')}
                variant="primary"
                className="w-full text-xs uppercase tracking-wider"
              >
                Log In
              </Button>
              <button
                onClick={() => navigate('/register')}
                className="py-2.5 rounded-full text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider"
              >
                Sign Up
              </button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const initials = getInitials(user.name);
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      <Navbar />

      <div className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-left">
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">My Profile</h2>
          <p className="text-slate-400 font-semibold text-xs border-b border-white/10 pb-5 mb-8">
            View and manage your account details.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* User Profile Card */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <Card variant="glass" className="p-6 text-center border border-white/5">

                {/* Initials Avatar */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold via-yellow-500 to-amber-600 flex items-center justify-center text-navy-950 text-3xl font-black shadow-lg border-2 border-gold/40 select-none"
                >
                  {initials}
                </motion.div>
                
                <h3 className="text-lg font-black text-white leading-none">{user.name}</h3>

                {/* Role badge */}
                <span className="text-[10px] font-bold uppercase tracking-wider mt-2 inline-block px-2.5 py-0.5 rounded bg-gold/10 border border-gold/15 text-gold">
                  {formatRole(user.role)}
                </span>
                
                <p className="text-xs font-semibold text-slate-500 mt-4 truncate">{user.email}</p>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 mt-6 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-transparent hover:border-red-500/20 cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <IoLogOutOutline className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </Card>
            </div>

            {/* Account Details Panel */}
            <div className="md:col-span-8 flex flex-col gap-6">
              
              {/* Account Information */}
              <Card variant="glass" className="p-6 border border-white/5">
                <span className="text-xs font-bold text-gold uppercase tracking-widest">Account Details</span>
                <h3 className="text-lg font-extrabold text-white mt-1 border-b border-white/10 pb-3 mb-5">
                  Personal Information
                </h3>
                
                <div className="flex flex-col gap-4">
                  {/* Name */}
                  <div className="flex items-start gap-4 p-4 bg-navy-900 border border-slate-800 rounded-xl">
                    <div className="p-2.5 bg-white/5 border border-slate-800 rounded-xl text-gold">
                      <IoPersonOutline className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</span>
                      <span className="text-sm font-extrabold text-white mt-0.5 truncate">{user.name || '—'}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 p-4 bg-navy-900 border border-slate-800 rounded-xl">
                    <div className="p-2.5 bg-white/5 border border-slate-800 rounded-xl text-gold">
                      <IoMailOutline className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</span>
                      <span className="text-sm font-extrabold text-white mt-0.5 truncate">{user.email || '—'}</span>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-start gap-4 p-4 bg-navy-900 border border-slate-800 rounded-xl">
                    <div className="p-2.5 bg-white/5 border border-slate-800 rounded-xl text-gold">
                      <IoShieldOutline className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Role</span>
                      <span className="text-sm font-extrabold text-white mt-0.5">{formatRole(user.role)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Links */}
              <Card variant="glass" className="p-6 border border-white/5">
                <span className="text-xs font-bold text-gold uppercase tracking-widest">Quick Actions</span>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className="flex items-center gap-3 p-4 bg-navy-900 border border-slate-800 hover:border-gold/30 rounded-xl transition-all cursor-pointer group text-left"
                  >
                    <div className="p-2.5 bg-white/5 border border-slate-800 rounded-xl text-gold group-hover:bg-gold/10 transition-colors">
                      <IoBriefcaseOutline className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-white">My Trips</span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        {confirmedBookings} active booking{confirmedBookings !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/flights')}
                    className="flex items-center gap-3 p-4 bg-navy-900 border border-slate-800 hover:border-gold/30 rounded-xl transition-all cursor-pointer group text-left"
                  >
                    <div className="p-2.5 bg-white/5 border border-slate-800 rounded-xl text-gold group-hover:bg-gold/10 transition-colors">
                      <IoAirplaneOutline className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-white">Book a Flight</span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Search available routes</span>
                    </div>
                  </button>
                </div>
              </Card>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
