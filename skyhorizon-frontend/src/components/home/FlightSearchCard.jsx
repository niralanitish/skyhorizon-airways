import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoAirplaneOutline, 
  IoSwapHorizontalOutline, 
  IoCalendarOutline, 
  IoPersonOutline, 
  IoArrowForwardOutline,
  IoSearchOutline,
  IoChevronDownOutline
} from 'react-icons/io5';
import { useBooking } from '../../context/BookingContext';
import api, { airportCodes } from "../../services/api";

const AIRPORTS = Object.keys(airportCodes).map(city => ({
  city,
  code: airportCodes[city]
}));

export default function FlightSearchCard() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useBooking();
  
  // Local state initialized with context
  const [tripType, setTripType] = useState(searchQuery.tripType);
  const [from, setFrom] = useState(searchQuery.from.split(' (')[0]);
  const [to, setTo] = useState(searchQuery.to.split(' (')[0]);
  const [departDate, setDepartDate] = useState('2025-06-22');
  const [travellers, setTravellers] = useState(searchQuery.travellers);
  const [flightClass, setFlightClass] = useState(searchQuery.flightClass);

  // Dropdown UI states
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showTravellerDropdown, setShowTravellerDropdown] = useState(false);

  // Search filter inputs
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');

  const dateInputRef = useRef(null);

  // Refs for closing dropdowns on click outside
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const travellerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (fromRef.current && !fromRef.current.contains(event.target)) setShowFromDropdown(false);
      if (toRef.current && !toRef.current.contains(event.target)) setShowToDropdown(false);
      if (travellerRef.current && !travellerRef.current.contains(event.target)) setShowTravellerDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const getDayName = (dateString) => {
    if (!dateString) return 'Sunday';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDateLabel = (dateString) => {
    if (!dateString) return '22 Jun, 2025';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Save selections back to global state
    const codeFrom = airportCodes[from] || 'HYD';
    const codeTo = airportCodes[to] || 'GOI';
    
    setSearchQuery({
      from: `${from} (${codeFrom})`,
      to: `${to} (${codeTo})`,
      departDate: formatDateLabel(departDate),
      departDay: getDayName(departDate),
      travellers,
      flightClass,
      tripType
    });

    navigate('/flights');
  };

  const filteredFromAirports = AIRPORTS.filter(ap => 
    ap.city.toLowerCase().includes(fromFilter.toLowerCase()) || 
    ap.code.toLowerCase().includes(fromFilter.toLowerCase())
  );

  const filteredToAirports = AIRPORTS.filter(ap => 
    ap.city.toLowerCase().includes(toFilter.toLowerCase()) || 
    ap.code.toLowerCase().includes(toFilter.toLowerCase())
  );

  const tripTabs = ['One Way', 'Round Trip', 'Multi-city'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full bg-slate-950/80 backdrop-blur-md rounded-3xl p-6 md:p-8 relative border border-white/10"
    >
      {/* Search Header Tabs */}
      <div className="flex pb-4 mb-5 gap-8 overflow-x-auto scrollbar-none">
        {tripTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setTripType(tab)}
            className={`relative pb-2.5 text-xs font-bold tracking-wider uppercase transition-colors focus:outline-none cursor-pointer whitespace-nowrap ${
              tripType === tab ? 'text-gold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
            {tripType === tab && (
              <motion.div
                layoutId="searchTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Origin Selector */}
        <div ref={fromRef} className="w-full lg:flex-1 relative">
          <div 
            onClick={() => setShowFromDropdown(true)}
            className="flex items-center gap-3.5 bg-navy-950/70 hover:bg-navy-900/70 border border-slate-800 hover:border-gold/30 rounded-xl px-4 py-3 cursor-pointer transition-all text-left"
          >
            <IoAirplaneOutline className="w-5 h-5 text-slate-400 -rotate-45 shrink-0" />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From</span>
              <span className="text-sm font-extrabold text-white truncate mt-0.5">{from}</span>
              <span className="text-[11px] font-semibold text-slate-400 mt-0.5">{airportCodes[from] || 'HYD'}</span>
            </div>
          </div>

          <AnimatePresence>
            {showFromDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 9999 }}
                className="mt-2 bg-navy-900 border border-slate-800 rounded-xl shadow-2xl max-h-72 overflow-hidden flex flex-col"
              >
                <div className="p-3 border-b border-white/5 flex items-center gap-2">
                  <IoSearchOutline className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search city or code..."
                    value={fromFilter}
                    onChange={(e) => setFromFilter(e.target.value)}
                    className="w-full bg-transparent text-xs text-white border-none focus:outline-none placeholder-slate-500"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto py-1">
                  {filteredFromAirports.map((ap) => (
                    <div
                      key={ap.code}
                      onClick={() => {
                        setFrom(ap.city);
                        setShowFromDropdown(false);
                        setFromFilter('');
                      }}
                      className="px-4 py-2.5 hover:bg-white/5 cursor-pointer flex justify-between items-center transition-colors text-left"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{ap.city}</span>
                        <span className="text-[10px] text-slate-500">India</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-gold tracking-wide">
                        {ap.code}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Swap Button */}
        <div className="shrink-0 flex items-center justify-center -my-1 lg:my-0">
          <motion.button
            type="button"
            onClick={handleSwap}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-navy-950 border border-slate-800 hover:border-gold hover:text-gold text-slate-400 flex items-center justify-center cursor-pointer shadow-md transition-colors z-10"
          >
            <IoSwapHorizontalOutline className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Destination Selector */}
        <div ref={toRef} className="w-full lg:flex-1 relative">
          <div 
            onClick={() => setShowToDropdown(true)}
            className="flex items-center gap-3.5 bg-navy-950/70 hover:bg-navy-900/70 border border-slate-800 hover:border-gold/30 rounded-xl px-4 py-3 cursor-pointer transition-all text-left"
          >
            <IoAirplaneOutline className="w-5 h-5 text-slate-400 rotate-45 shrink-0" />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">To</span>
              <span className="text-sm font-extrabold text-white truncate mt-0.5">{to}</span>
              <span className="text-[11px] font-semibold text-slate-400 mt-0.5">{airportCodes[to] || 'GOI'}</span>
            </div>
          </div>

          <AnimatePresence>
            {showToDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 9999 }}
                className="mt-2 bg-navy-900 border border-slate-800 rounded-xl shadow-2xl max-h-72 overflow-hidden flex flex-col"
              >
                <div className="p-3 border-b border-white/5 flex items-center gap-2">
                  <IoSearchOutline className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search city or code..."
                    value={toFilter}
                    onChange={(e) => setToFilter(e.target.value)}
                    className="w-full bg-transparent text-xs text-white border-none focus:outline-none placeholder-slate-500"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto py-1">
                  {filteredToAirports.map((ap) => (
                    <div
                      key={ap.code}
                      onClick={() => {
                        setTo(ap.city);
                        setShowToDropdown(false);
                        setToFilter('');
                      }}
                      className="px-4 py-2.5 hover:bg-white/5 cursor-pointer flex justify-between items-center transition-colors text-left"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{ap.city}</span>
                        <span className="text-[10px] text-slate-500">India</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-gold tracking-wide">
                        {ap.code}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Departure Date Picker */}
        <div className="w-full lg:flex-1 relative">
          <label 
            onClick={(e) => {
              e.preventDefault();
              try {
                dateInputRef.current?.showPicker();
              } catch (err) {
                dateInputRef.current?.focus();
              }
            }}
            className="flex items-center gap-3.5 bg-navy-950/70 hover:bg-navy-900/70 border border-slate-800 hover:border-gold/30 rounded-xl px-4 py-3 cursor-pointer transition-all text-left"
          >
            <IoCalendarOutline className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="flex flex-col w-full relative leading-tight">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Depart</span>
              <span className="text-sm font-extrabold text-white mt-0.5">{formatDateLabel(departDate)}</span>
              <span className="text-[11px] font-semibold text-slate-400 mt-0.5">{getDayName(departDate)}</span>
              <input
                ref={dateInputRef}
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                min="2025-01-01"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </label>
        </div>

        {/* Travellers & Class Selector */}
        <div ref={travellerRef} className="w-full lg:flex-1 relative">
          <div 
            onClick={() => setShowTravellerDropdown(true)}
            className="flex items-center justify-between bg-navy-950/70 hover:bg-navy-900/70 border border-slate-800 hover:border-gold/30 rounded-xl px-4 py-3 cursor-pointer transition-all text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <IoPersonOutline className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Travellers & Class</span>
                <span className="text-sm font-extrabold text-white truncate mt-0.5">{travellers} Traveller{travellers > 1 ? 's' : ''}</span>
                <span className="text-[11px] font-semibold text-slate-400 mt-0.5">{flightClass}</span>
              </div>
            </div>
            <IoChevronDownOutline className="w-4 h-4 text-slate-500 shrink-0" />
          </div>

          <AnimatePresence>
            {showTravellerDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 left-0 lg:left-auto lg:w-72 top-full mt-2 bg-navy-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-4 flex flex-col gap-4 text-left"
              >
                {/* Travellers Count */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Travellers</span>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Adults (12+ years)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setTravellers(Math.max(1, travellers - 1))}
                      className="w-7 h-7 rounded-full border border-slate-700 hover:border-gold hover:text-gold flex items-center justify-center text-white font-bold cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">{travellers}</span>
                    <button
                      type="button"
                      onClick={() => setTravellers(Math.min(9, travellers + 1))}
                      className="w-7 h-7 rounded-full border border-slate-700 hover:border-gold hover:text-gold flex items-center justify-center text-white font-bold cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Flight Class Selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Travel Class</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Economy', 'Premium Economy', 'Business', 'First Class'].map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setFlightClass(cls)}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          flightClass === cls
                            ? 'border-gold bg-gold/10 text-gold shadow-md'
                            : 'border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTravellerDropdown(false)}
                  className="w-full py-2 bg-gradient-to-r from-gold to-yellow-500 rounded-lg text-navy-950 font-bold text-[10px] uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Apply Selections
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Flights Button */}
        <div className="w-full lg:w-auto shrink-0 self-stretch lg:self-auto flex items-center">
          <motion.button
            onClick={handleSearch}
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(245, 166, 35, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full lg:w-56 h-14 lg:h-[68px] bg-gradient-to-r from-gold to-yellow-500 text-navy-950 font-extrabold text-sm tracking-wider rounded-full flex items-center justify-center gap-3.5 hover:brightness-110 transition-all cursor-pointer px-6"
          >
            <span>Search Flights</span>
            <IoArrowForwardOutline className="w-5 h-5" />
          </motion.button>
        </div>

      </form>
    </motion.div>
  );
}
