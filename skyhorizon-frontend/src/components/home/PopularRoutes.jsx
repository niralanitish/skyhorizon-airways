import { motion } from 'framer-motion';
import { IoAirplaneOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { destinations } from '../../assets/data/destinations';

export default function PopularRoutes() {
  const navigate = useNavigate();
  const { setSearchQuery } = useBooking();

  const handleRouteClick = (destName) => {
    // Quick booking trigger
    setSearchQuery(prev => ({
      ...prev,
      from: 'Mumbai (BOM)',
      to: `${destName} (${destName === 'Goa' ? 'GOI' : destName === 'Dubai' ? 'DXB' : destName === 'Delhi' ? 'DEL' : destName === 'Bengaluru' ? 'BLR' : 'BOM'})`,
      tripType: 'One Way'
    }));
    navigate('/flights');
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Customized Header Section */}
        <div className="flex items-end justify-between border-b border-slate-100 pb-6 mb-10 text-left">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-gold">
              <IoAirplaneOutline className="w-5 h-5 rotate-45" />
              <span className="text-xs font-extrabold uppercase tracking-widest">Explore</span>
            </div>
            <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight mt-2">Popular routes</h2>
            <p className="text-slate-500 text-xs font-semibold mt-1">Top destinations loved by our travellers</p>
          </div>
          
          {/* Outlined Pill button for all routes link */}
          <button 
            onClick={() => navigate('/flights')}
            className="px-5 py-2 border border-slate-200 hover:border-slate-800 hover:text-navy-950 rounded-full text-xs font-bold text-slate-600 transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <span>View all routes</span>
            <span>→</span>
          </button>
        </div>

        {/* Route Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => handleRouteClick(dest.title)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black/50 transition-all border border-white/5"
            >
              {/* Background Destination Photo */}
              <img
                src={dest.image}
                alt={dest.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-black/5 group-hover:from-navy-950/70 transition-colors duration-300" />

              {/* Badge (e.g. Popular) */}
              {dest.badge === 'Popular' && (
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm z-10 bg-emerald-500 text-white">
                  {dest.badge}
                </div>
              )}

              {/* Card Contents bottom layout */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between z-10">
                <div className="flex flex-col text-left">
                  <h3 className="text-lg font-black text-white leading-none">
                    {dest.title}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-300 mt-1 leading-none">
                    from {dest.price}
                  </span>
                </div>
                
                {/* Circular white action button with black arrow */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-7 h-7 rounded-full bg-white text-navy-950 flex items-center justify-center transition-colors shadow-md shrink-0"
                >
                  <IoArrowForwardOutline className="w-4 h-4" />
                </motion.div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
