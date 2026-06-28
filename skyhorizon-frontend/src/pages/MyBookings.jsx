import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoAirplaneOutline, 
  IoCalendarOutline, 
  IoPersonOutline, 
  IoQrCodeOutline,
  IoTicketOutline,
  IoAlertCircleOutline,
  IoCloseOutline,
  IoWarningOutline,
  IoRefreshOutline
} from 'react-icons/io5';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/home/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { airportCodes } from '../services/api';

export default function MyBookings() {
  const navigate = useNavigate();
  const { user, bookings, cancelBooking, fetchBookings } = useBooking();

  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);   // booking.id being cancelled
  const [confirmCancelId, setConfirmCancelId] = useState(null); // booking.id waiting for confirm
  const [cancelError, setCancelError] = useState('');

  // Sync with backend on component mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        await fetchBookings();
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestCancel = (id) => {
    setCancelError('');
    setConfirmCancelId(id);
  };

  const handleCancelConfirmed = async () => {
    if (!confirmCancelId) return;
    setCancellingId(confirmCancelId);
    setConfirmCancelId(null);
    setCancelError('');
    try {
      await cancelBooking(confirmCancelId);
    } catch {
      setCancelError('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  // Redirect to login if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col">
        <Navbar />
        <div className="flex-grow pt-24 pb-20 flex items-center justify-center px-6">
          <Card variant="glass" className="p-8 border border-white/5 max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-4">
              <IoTicketOutline className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Sign In Required</h3>
            <p className="text-slate-400 font-semibold text-xs mt-2 max-w-xs leading-relaxed">
              Please log in to view your bookings and manage your trips.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={() => navigate('/login')} variant="primary" className="w-full text-xs uppercase tracking-wider">
                Log In
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      <Navbar />

      <div className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-left">
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 flex items-center gap-2.5">
            <IoTicketOutline className="text-gold w-8 h-8" />
            My Trips
          </h2>
          <p className="text-slate-400 font-semibold text-xs border-b border-white/10 pb-5 mb-8">
            Manage your flight bookings, view boarding passes, and download receipts.
          </p>

          {/* Error Banner */}
          <AnimatePresence>
            {cancelError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/25 text-red-300 rounded-2xl flex items-center gap-3 text-xs font-semibold"
              >
                <IoWarningOutline className="w-5 h-5 shrink-0" />
                <span>{cancelError}</span>
                <button onClick={() => setCancelError('')} className="ml-auto text-red-400 hover:text-red-300 cursor-pointer">
                  <IoCloseOutline className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col gap-5">
              {[1, 2].map(i => (
                <div key={i} className="h-52 rounded-3xl bg-navy-900/60 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {bookings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center flex flex-col items-center justify-center gap-4 border border-dashed border-slate-800 rounded-2xl p-6"
                >
                  <div className="p-4 bg-gold/10 text-gold rounded-full">
                    <IoAirplaneOutline className="w-8 h-8 -rotate-45" />
                  </div>
                  <span className="text-lg font-bold text-white">No active trips found</span>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-semibold">
                    You haven't scheduled any flight tickets yet. Book your flight and travel to your favorite destination now.
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    variant="primary"
                    className="mt-2 text-xs uppercase tracking-wider font-bold"
                  >
                    Book a Flight
                  </Button>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-8">
                  {bookings.map((booking) => {
                    const flight = booking.flight || {};
                    const stopsCount = flight.numberOfStops !== undefined ? flight.numberOfStops : (flight.stops || 0);
                    const departureTime = flight.departureTime || '—';
                    const arrivalTime = flight.arrivalTime || '—';
                    const duration = flight.duration || '—';
                    const fromCode = flight.fromCode || flight.sourceCode || airportCodes[flight.from] || airportCodes[flight.source] || (flight.from || flight.source || '').substring(0, 3).toUpperCase() || '—';
                    const toCode = flight.toCode || flight.destinationCode || airportCodes[flight.to] || airportCodes[flight.destination] || (flight.to || flight.destination || '').substring(0, 3).toUpperCase() || '—';
                    const fromCity = flight.from || flight.source || '—';
                    const toCity = flight.to || flight.destination || '—';
                    const flightNo = flight.flightNumber || '—';
                    const flightDate = flight.date || '—';
                    const isCancelling = cancellingId === booking.id;
                    const isConfirming = confirmCancelId === booking.id;
                    
                    return (
                      <motion.div
                        key={booking.bookingId}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                        layout
                      >
                        <Card variant="glass" className="overflow-hidden border border-white/5 relative">
                          
                          {/* Booking Top Status Bar */}
                          <div className="p-4 bg-navy-900 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3 text-xs font-semibold flex-wrap">
                              <span className="text-slate-400 uppercase tracking-widest">Booking ID:</span>
                              <span className="text-white font-extrabold">{booking.bookingId}</span>
                              <span className="text-slate-500 font-medium hidden sm:inline">|</span>
                              <span className="text-slate-400 hidden sm:inline">Booked: {booking.bookedAt}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                booking.status === 'Confirmed'
                                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/20'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/10'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>

                          {/* Flight Boarding Pass Visual Layout */}
                          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                            
                            {/* Left Details */}
                            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                              
                              {/* Route Code details */}
                              <div className="md:col-span-12 flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                                <div className="flex flex-col">
                                  <span className="text-2xl font-black text-white">{departureTime}</span>
                                  <span className="text-sm font-extrabold text-gold uppercase mt-0.5 tracking-widest">{fromCode}</span>
                                  <span className="text-xs font-semibold text-slate-400 mt-1">{fromCity}</span>
                                </div>

                                <div className="flex-grow flex flex-col items-center px-4">
                                  <span className="text-[10px] text-slate-400 font-semibold mb-1">{duration}</span>
                                  <div className="w-full h-[2px] bg-slate-800 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-0.5 bg-navy-950 text-gold rounded-full border border-slate-800">
                                      <IoAirplaneOutline className="w-3.5 h-3.5 rotate-90" />
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                                    {stopsCount === 0 ? 'Non-stop' : `${stopsCount} Stop${stopsCount > 1 ? 's' : ''}`}
                                  </span>
                                </div>

                                <div className="flex flex-col text-right">
                                  <span className="text-2xl font-black text-white">{arrivalTime}</span>
                                  <span className="text-sm font-extrabold text-gold uppercase mt-0.5 tracking-widest">{toCode}</span>
                                  <span className="text-xs font-semibold text-slate-400 mt-1">{toCity}</span>
                                </div>
                              </div>

                              {/* Ticket Meta Details */}
                              <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-400">
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Flight</span>
                                  <span className="text-sm font-bold text-white mt-1 uppercase">{flightNo}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Seat</span>
                                  <span className="text-sm font-bold text-white mt-1">{booking.seat || '—'}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Departure Date</span>
                                  <span className="text-sm font-bold text-white mt-1 flex items-center gap-1">
                                    <IoCalendarOutline className="text-gold" />
                                    {flightDate}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Passengers</span>
                                  <span className="text-sm font-bold text-white mt-1 flex items-center gap-1">
                                    <IoPersonOutline className="text-gold" />
                                    {booking.travellers}
                                  </span>
                                </div>
                              </div>

                            </div>

                            {/* Right Boarding pass barcode QR mockup */}
                            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-navy-950/60 border border-white/5 rounded-2xl relative">
                              {booking.status === 'Cancelled' ? (
                                <div className="flex flex-col items-center justify-center py-6 text-red-400 text-center gap-2">
                                  <IoAlertCircleOutline className="w-10 h-10" />
                                  <span className="text-xs font-black uppercase tracking-wider">Ticket Cancelled</span>
                                </div>
                              ) : (
                                <>
                                  <svg viewBox="0 0 100 100" className="w-24 h-24 fill-gold">
                                    <rect x="0" y="0" width="30" height="30" rx="3" />
                                    <rect x="5" y="5" width="20" height="20" fill="#0F172A" rx="1.5" />
                                    <rect x="10" y="10" width="10" height="10" rx="0.5" />
                                    <rect x="70" y="0" width="30" height="30" rx="3" />
                                    <rect x="75" y="5" width="20" height="20" fill="#0F172A" rx="1.5" />
                                    <rect x="80" y="10" width="10" height="10" rx="0.5" />
                                    <rect x="0" y="70" width="30" height="30" rx="3" />
                                    <rect x="5" y="75" width="20" height="20" fill="#0F172A" rx="1.5" />
                                    <rect x="10" y="80" width="10" height="10" rx="0.5" />
                                    <rect x="40" y="10" width="10" height="20" />
                                    <rect x="55" y="0" width="10" height="10" />
                                    <rect x="40" y="40" width="20" height="10" />
                                    <rect x="15" y="45" width="10" height="15" />
                                    <rect x="45" y="60" width="15" height="10" />
                                    <rect x="70" y="45" width="20" height="10" />
                                    <rect x="80" y="60" width="10" height="25" />
                                    <rect x="45" y="80" width="20" height="10" />
                                    <rect x="65" y="75" width="10" height="10" />
                                  </svg>
                                  <span className="text-[10px] text-slate-400 font-extrabold uppercase mt-3 tracking-widest flex items-center gap-1.5 leading-none">
                                    <IoQrCodeOutline className="text-gold" />
                                    Digital Pass Boarding
                                  </span>
                                </>
                              )}
                            </div>

                          </div>

                          {/* Cancel Booking Section */}
                          {booking.status === 'Confirmed' && (
                            <div className="px-6 py-3.5 bg-navy-950/40 border-t border-white/5">
                              
                              <AnimatePresence mode="wait">
                                {isConfirming ? (
                                  /* ── Premium inline cancel confirmation ── */
                                  <motion.div
                                    key="confirm"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="flex flex-col sm:flex-row items-center gap-3 justify-between"
                                  >
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                                      <IoWarningOutline className="w-4 h-4 shrink-0" />
                                      <span>Cancel this booking? This action is permanent.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => setConfirmCancelId(null)}
                                        className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-all cursor-pointer"
                                      >
                                        Keep Trip
                                      </button>
                                      <button
                                        onClick={handleCancelConfirmed}
                                        className="px-4 py-1.5 text-xs font-black text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all cursor-pointer"
                                      >
                                        Yes, Cancel
                                      </button>
                                    </div>
                                  </motion.div>
                                ) : isCancelling ? (
                                  /* ── Cancelling spinner ── */
                                  <motion.div
                                    key="cancelling"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 text-xs font-bold text-slate-400"
                                  >
                                    <IoRefreshOutline className="w-4 h-4 animate-spin text-gold" />
                                    <span>Cancelling booking…</span>
                                  </motion.div>
                                ) : (
                                  /* ── Default cancel button ── */
                                  <motion.div
                                    key="cancel-btn"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-end"
                                  >
                                    <button
                                      onClick={() => handleRequestCancel(booking.id)}
                                      className="px-4 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-all border border-transparent hover:border-red-500/20 cursor-pointer"
                                    >
                                      Cancel Flight Ticket
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                            </div>
                          )}

                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
