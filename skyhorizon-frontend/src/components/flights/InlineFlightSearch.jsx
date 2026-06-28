import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoAirplaneOutline,
  IoSwapHorizontalOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoChevronDownOutline,
  IoArrowForwardOutline
} from 'react-icons/io5';
import { useBooking } from '../../context/BookingContext';
import { airportCodes } from '../../services/api';

const AIRPORTS = Object.keys(airportCodes).map(city => ({
  city,
  code: airportCodes[city]
}));

// Parse context "City (CODE)" format → city name only
const parseCityName = (val = '') => val.split(' (')[0].trim() || val;

// Date helpers
const formatDateLabel = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

const getDayName = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });
};

// Parse a context date label like "22 Jun, 2025" back to ISO "2025-06-22"
// Also handles ISO strings like "2025-06-22" directly.
const parseLabelToIso = (label = '') => {
  if (!label) return '';
  // Already ISO?
  if (/^\d{4}-\d{2}-\d{2}$/.test(label.trim())) return label.trim();
  try {
    const d = new Date(label);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch {}
  // Fallback: today
  return new Date().toISOString().split('T')[0];
};

/**
 * InlineFlightSearch
 * Self-contained search bar that updates BookingContext.searchQuery on submit.
 * The Flights page useEffect will automatically react and re-fetch.
 *
 * Props:
 *   onSearch — called after context is updated (optional, for closing the panel etc.)
 *   loading  — bool, disables the submit button while fetching
 */
export default function InlineFlightSearch({ onSearch, loading = false }) {
  const { searchQuery, setSearchQuery } = useBooking();

  // Initialise from context
  const [from, setFrom] = useState(parseCityName(searchQuery.from));
  const [to, setTo]     = useState(parseCityName(searchQuery.to));
  const [departDate, setDepartDate] = useState(parseLabelToIso(searchQuery.departDate) || '');
  const [travellers, setTravellers] = useState(searchQuery.travellers || 1);
  const [flightClass, setFlightClass] = useState(searchQuery.flightClass || 'Economy');

  // Dropdown visibility
  const [showFromDD, setShowFromDD] = useState(false);
  const [showToDD, setShowToDD]     = useState(false);
  const [showTravDD, setShowTravDD] = useState(false);

  // Airport search filters
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter]     = useState('');

  // Refs for outside-click
  const fromRef   = useRef(null);
  const toRef     = useRef(null);
  const travRef   = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setShowFromDD(false);
      if (toRef.current   && !toRef.current.contains(e.target))   setShowToDD(false);
      if (travRef.current && !travRef.current.contains(e.target))  setShowTravDD(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Keep local state in sync if context changes from outside (e.g. home page search)
  useEffect(() => {
    setFrom(parseCityName(searchQuery.from));
    setTo(parseCityName(searchQuery.to));
    setTravellers(searchQuery.travellers || 1);
    setFlightClass(searchQuery.flightClass || 'Economy');
  }, [searchQuery.from, searchQuery.to, searchQuery.travellers, searchQuery.flightClass]);

  const handleSwap = () => {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
  };

  const filteredFrom = AIRPORTS.filter(ap =>
    ap.city.toLowerCase().includes(fromFilter.toLowerCase()) ||
    ap.code.toLowerCase().includes(fromFilter.toLowerCase())
  );
  const filteredTo = AIRPORTS.filter(ap =>
    ap.city.toLowerCase().includes(toFilter.toLowerCase()) ||
    ap.code.toLowerCase().includes(toFilter.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const codeFrom = airportCodes[from] || from.substring(0, 3).toUpperCase();
    const codeTo   = airportCodes[to]   || to.substring(0, 3).toUpperCase();

    setSearchQuery({
      ...searchQuery,
      from: `${from} (${codeFrom})`,
      to: `${to} (${codeTo})`,
      departDate: formatDateLabel(departDate) || searchQuery.departDate,
      departDay:  getDayName(departDate) || searchQuery.departDay,
      travellers,
      flightClass,
    });

    onSearch?.();
  };

  // Field wrapper — uniform dark input tile styling
  const fieldClass =
    'flex items-center gap-3 bg-navy-950/60 hover:bg-navy-900/60 border border-slate-800 hover:border-gold/30 rounded-xl px-4 py-3 cursor-pointer transition-all text-left w-full';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Row 1: From / Swap / To / Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr] gap-3 items-center">

        {/* FROM */}
        <div ref={fromRef} className="relative">
          <div className={fieldClass} onClick={() => { setShowFromDD(true); setShowToDD(false); }}>
            <IoAirplaneOutline className="w-4 h-4 text-slate-400 -rotate-45 shrink-0" />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">From</span>
              <span className="text-sm font-extrabold text-white truncate mt-0.5">{from}</span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{airportCodes[from] || '—'}</span>
            </div>
          </div>
          <AnimatePresence>
            {showFromDD && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 9999 }}
                className="mt-1.5 bg-navy-900 border border-slate-800 rounded-xl shadow-2xl max-h-64 overflow-hidden flex flex-col"
              >
                <div className="p-2.5 border-b border-white/5 flex items-center gap-2">
                  <IoSearchOutline className="text-slate-400 w-3.5 h-3.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search city or code…"
                    value={fromFilter}
                    onChange={e => setFromFilter(e.target.value)}
                    className="w-full bg-transparent text-xs text-white border-none focus:outline-none placeholder-slate-500"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto py-1">
                  {filteredFrom.map(ap => (
                    <div
                      key={ap.code}
                      onClick={() => { setFrom(ap.city); setShowFromDD(false); setFromFilter(''); }}
                      className="px-4 py-2.5 hover:bg-white/5 cursor-pointer flex justify-between items-center transition-colors"
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

        {/* SWAP */}
        <div className="hidden lg:flex items-center justify-center">
          <motion.button
            type="button"
            onClick={handleSwap}
            whileHover={{ scale: 1.12, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="w-8 h-8 rounded-full bg-navy-950 border border-slate-800 hover:border-gold hover:text-gold text-slate-400 flex items-center justify-center cursor-pointer shadow-md transition-colors"
          >
            <IoSwapHorizontalOutline className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* TO */}
        <div ref={toRef} className="relative">
          <div className={fieldClass} onClick={() => { setShowToDD(true); setShowFromDD(false); }}>
            <IoAirplaneOutline className="w-4 h-4 text-slate-400 rotate-45 shrink-0" />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">To</span>
              <span className="text-sm font-extrabold text-white truncate mt-0.5">{to}</span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{airportCodes[to] || '—'}</span>
            </div>
          </div>
          <AnimatePresence>
            {showToDD && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 9999 }}
                className="mt-1.5 bg-navy-900 border border-slate-800 rounded-xl shadow-2xl max-h-64 overflow-hidden flex flex-col"
              >
                <div className="p-2.5 border-b border-white/5 flex items-center gap-2">
                  <IoSearchOutline className="text-slate-400 w-3.5 h-3.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search city or code…"
                    value={toFilter}
                    onChange={e => setToFilter(e.target.value)}
                    className="w-full bg-transparent text-xs text-white border-none focus:outline-none placeholder-slate-500"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto py-1">
                  {filteredTo.map(ap => (
                    <div
                      key={ap.code}
                      onClick={() => { setTo(ap.city); setShowToDD(false); setToFilter(''); }}
                      className="px-4 py-2.5 hover:bg-white/5 cursor-pointer flex justify-between items-center transition-colors"
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

        {/* DATE */}
        <div>
          <label className={fieldClass}>
            <IoCalendarOutline className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex flex-col w-full relative leading-tight">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Depart</span>
              <span className="text-sm font-extrabold text-white mt-0.5">
                {departDate ? formatDateLabel(departDate) : 'Select date'}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                {departDate ? getDayName(departDate) : ''}
              </span>
              <input
                type="date"
                value={departDate}
                onChange={e => setDepartDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </label>
        </div>
      </div>

      {/* Row 2: Travellers & Class + Search button */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">

        {/* TRAVELLERS & CLASS */}
        <div ref={travRef} className="relative">
          <div
            className={`${fieldClass} justify-between`}
            onClick={() => setShowTravDD(v => !v)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <IoPersonOutline className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Travellers &amp; Class</span>
                <span className="text-sm font-extrabold text-white truncate mt-0.5">
                  {travellers} Traveller{travellers > 1 ? 's' : ''}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{flightClass}</span>
              </div>
            </div>
            <IoChevronDownOutline
              className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${showTravDD ? 'rotate-180' : ''}`}
            />
          </div>

          <AnimatePresence>
            {showTravDD && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-72 top-full mt-1.5 bg-navy-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-4 flex flex-col gap-4"
              >
                {/* Traveller counter */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Travellers</span>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Adults (12+ years)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setTravellers(v => Math.max(1, v - 1))}
                      className="w-7 h-7 rounded-full border border-slate-700 hover:border-gold hover:text-gold flex items-center justify-center text-white font-bold cursor-pointer text-sm transition-colors"
                    >
                      −
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">{travellers}</span>
                    <button
                      type="button"
                      onClick={() => setTravellers(v => Math.min(9, v + 1))}
                      className="w-7 h-7 rounded-full border border-slate-700 hover:border-gold hover:text-gold flex items-center justify-center text-white font-bold cursor-pointer text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Class selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Travel Class</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Economy', 'Premium Economy', 'Business', 'First Class'].map(cls => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setFlightClass(cls)}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          flightClass === cls
                            ? 'border-gold bg-gold/10 text-gold shadow-sm'
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
                  onClick={() => setShowTravDD(false)}
                  className="w-full py-2 bg-gradient-to-r from-gold to-yellow-500 rounded-lg text-navy-950 font-bold text-[10px] uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Apply Selections
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SEARCH BUTTON */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 20px rgba(245,166,35,0.45)' } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="h-14 px-8 bg-gradient-to-r from-gold to-yellow-500 text-navy-950 font-extrabold text-sm tracking-wider rounded-full flex items-center justify-center gap-2.5 hover:brightness-110 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
        >
          {loading ? (
            <span className="w-5 h-5 rounded-full border-2 border-navy-950 border-t-transparent animate-spin" />
          ) : (
            <>
              <span>Search Flights</span>
              <IoArrowForwardOutline className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
