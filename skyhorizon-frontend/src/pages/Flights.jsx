import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoAirplaneOutline, 
  IoFilterOutline, 
  IoSparklesOutline,
  IoTrendingDownOutline,
  IoFlashOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseOutline,
  IoSearchOutline,
  IoChevronDownOutline
} from 'react-icons/io5';
import { useBooking } from '../context/BookingContext';
import { searchFlights } from "../services/flightService";
import Navbar from '../components/layout/Navbar';
import Footer from '../components/home/Footer';
import FlightCard from '../components/flights/FlightCard';
import FilterPanel from '../components/flights/FilterPanel';
import FlightSkeleton from '../components/flights/FlightSkeleton';
import InlineFlightSearch from '../components/flights/InlineFlightSearch';

// Helper to convert flight duration string (e.g. "2h 15m") to total minutes
const durationToMinutes = (dur) => {
  if (!dur) return 0;
  const parts = dur.split(' ');
  let total = 0;
  parts.forEach(p => {
    if (p.includes('h')) total += parseInt(p.replace('h', ''), 10) * 60;
    if (p.includes('m')) total += parseInt(p.replace('m', ''), 10);
  });
  return total;
};

export default function Flights() {
  const navigate = useNavigate();
  const { searchQuery, setSelectedFlight } = useBooking();
  const { from, to, departDate, travellers, flightClass } = searchQuery;

  // Flight listings state
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sorting State
  const [sortBy, setSortBy] = useState('best'); // 'best', 'cheapest', 'fastest'

  // Filter States
  const [priceRange, setPriceRange] = useState(25000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(30000);
  const [stopsFilter, setStopsFilter] = useState('all'); // 'all', '0', '1', '2'
  const [depTimeFilter, setDepTimeFilter] = useState('all'); // 'all', 'morning', 'afternoon', 'evening', 'night'
  const [arrTimeFilter, setArrTimeFilter] = useState('all'); // 'all', 'morning', 'afternoon', 'evening', 'night'
  const [durationFilter, setDurationFilter] = useState(15); // in hours
  const [maxDurationLimit, setMaxDurationLimit] = useState(15);
  const [airlineFilter, setAirlineFilter] = useState([]); // Array of airline names
  const [amenitiesFilter, setAmenitiesFilter] = useState([]); // 'refundable', 'wifi', 'meal'

  // UI state
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Scroll to top of list ref
  const resultsRef = useRef(null);

  // Fetch flights on search query change
  useEffect(() => {
    async function fetchFlights() {
      setLoading(true);
      setSelectedFlight(null); // Clear context selected flight
      // Reset all sidebar filters so they don't hide results on a new route
      setStopsFilter('all');
      setDepTimeFilter('all');
      setArrTimeFilter('all');
      setAirlineFilter([]);
      setAmenitiesFilter([]);
      setSortBy('best');
      try {
        const cleanFrom = from.split(' (')[0];
        const cleanTo = to.split(' (')[0];
        const data = await searchFlights(
              cleanFrom,
              cleanTo
                      );
        
        setFlights(data);
        
        // Dynamically compute boundaries
        const prices = data.map(f => f.price);
        if (prices.length > 0) {
          const maxP = Math.max(...prices);
          setMaxPriceLimit(maxP);
          setPriceRange(maxP);
        }

        const durations = data.map(f => durationToMinutes(f.duration) / 60);
        if (durations.length > 0) {
          const maxD = Math.ceil(Math.max(...durations));
          setMaxDurationLimit(maxD);
          setDurationFilter(maxD);
        }

        setCurrentPage(1); 
      } catch (err) {
        console.error('Error loading flights:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFlights();
  }, [from, to, departDate]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...flights];

    // 1. Price Filter
    result = result.filter(f => f.price <= priceRange);

    // 2. Stops Filter
    if (stopsFilter !== 'all') {
      const stopsNum = parseInt(stopsFilter, 10);
      result = result.filter(f => {
        const s = f.numberOfStops !== undefined ? f.numberOfStops : (f.stops || 0);
        if (stopsNum === 2) {
          return s >= 2;
        } else {
          return s === stopsNum;
        }
      });
    }

    // 3. Departure Time Filter
    if (depTimeFilter !== 'all') {
      result = result.filter(f => {
        if (!f.departureTime) return false;
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        if (depTimeFilter === 'morning') return hour >= 6 && hour < 12;
        if (depTimeFilter === 'afternoon') return hour >= 12 && hour < 18;
        if (depTimeFilter === 'evening') return hour >= 18 && hour < 24;
        if (depTimeFilter === 'night') return hour >= 0 && hour < 6;
        return true;
      });
    }

    // 4. Arrival Time Filter
    if (arrTimeFilter !== 'all') {
      result = result.filter(f => {
        if (!f.arrivalTime) return false;
        const hour = parseInt(f.arrivalTime.split(':')[0], 10);
        if (arrTimeFilter === 'morning') return hour >= 6 && hour < 12;
        if (arrTimeFilter === 'afternoon') return hour >= 12 && hour < 18;
        if (arrTimeFilter === 'evening') return hour >= 18 && hour < 24;
        if (arrTimeFilter === 'night') return hour >= 0 && hour < 6;
        return true;
      });
    }

    // 5. Duration Filter
    result = result.filter(f => durationToMinutes(f.duration) / 60 <= durationFilter);

    // 6. Airline Filter
    if (airlineFilter.length > 0) {
      result = result.filter(f => airlineFilter.includes(f.airline));
    }

    // 7. Amenities Filters
    if (amenitiesFilter.includes('refundable')) {
      result = result.filter(f => f.refundType === 'Refundable');
    }
    if (amenitiesFilter.includes('wifi')) {
      result = result.filter(f => f.wifi === true);
    }
    if (amenitiesFilter.includes('meal')) {
      result = result.filter(f => f.meal === true);
    }

    // 8. Sorting
    if (sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'fastest') {
      result.sort((a, b) => durationToMinutes(a.duration) - durationToMinutes(b.duration));
    } else if (sortBy === 'best') {
      result.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        const scoreA = a.price / 1000 + durationToMinutes(a.duration) / 30 - ratingA * 2;
        const scoreB = b.price / 1000 + durationToMinutes(b.duration) / 30 - ratingB * 2;
        return scoreA - scoreB;
      });
    }

    setFilteredFlights(result);
    setCurrentPage(1); 
  }, [flights, priceRange, stopsFilter, depTimeFilter, arrTimeFilter, durationFilter, airlineFilter, amenitiesFilter, sortBy]);

  // Reset all sidebar filters
  const handleResetFilters = () => {
    setPriceRange(maxPriceLimit);
    setStopsFilter('all');
    setDepTimeFilter('all');
    setArrTimeFilter('all');
    setDurationFilter(maxDurationLimit);
    setAirlineFilter([]);
    setAmenitiesFilter([]);
  };

  // Pagination Math
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage) || 1;
  const paginatedFlights = filteredFlights.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Selection Handler
  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    navigate('/flight-details'); // Proceed directly to flight details
  };

  // Dynamically calculate Cheapest, Fastest, and Best price summaries for Sort Tabs
  let cheapestFlight = null;
  let fastestFlight = null;
  let bestFlight = null;

  if (filteredFlights.length > 0) {
    cheapestFlight = [...filteredFlights].sort((a, b) => a.price - b.price)[0];
    fastestFlight = [...filteredFlights].sort((a, b) => durationToMinutes(a.duration) - durationToMinutes(b.duration))[0];
    bestFlight = [...filteredFlights].sort((a, b) => {
      const scoreA = a.price / 1000 + durationToMinutes(a.duration) / 30 - a.rating * 2;
      const scoreB = b.price / 1000 + durationToMinutes(b.duration) / 30 - b.rating * 2;
      return scoreA - scoreB;
    })[0];
  }

  // Calculate active filters count
  let activeFiltersCount = 0;
  if (priceRange < maxPriceLimit) activeFiltersCount++;
  if (stopsFilter !== 'all') activeFiltersCount++;
  if (depTimeFilter !== 'all') activeFiltersCount++;
  if (arrTimeFilter !== 'all') activeFiltersCount++;
  if (durationFilter < maxDurationLimit) activeFiltersCount++;
  activeFiltersCount += airlineFilter.length;
  activeFiltersCount += amenitiesFilter.length;

  const hasActiveFilters = activeFiltersCount > 0;

  // Active filter chip cleanup handlers
  const handleRemoveAirline = (airline) => {
    setAirlineFilter(airlineFilter.filter(item => item !== airline));
  };

  const handleRemoveAmenity = (amenity) => {
    setAmenitiesFilter(amenitiesFilter.filter(item => item !== amenity));
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative w-full text-left">
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow pt-20 pb-20 w-full relative">
        
        {/* STICKY SEARCH SUMMARY BAR */}
        <div className="sticky top-20 z-30 w-full bg-navy-950/80 backdrop-blur-md border-b border-white/5 shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Route summary */}
            <div className="flex flex-col text-left select-none">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                <span>Outbound Flights</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                <span>{flightClass}</span>
              </div>
              
              <h2 className="text-lg md:text-xl font-black text-white mt-1 flex items-center gap-2.5">
                <span>{from.split(' (')[0]}</span>
                <IoAirplaneOutline className="w-4.5 h-4.5 text-gold -rotate-45" />
                <span>{to.split(' (')[0]}</span>
              </h2>

              <p className="text-[11px] font-bold text-slate-400 mt-1">
                {departDate} · {travellers} Guest{travellers > 1 ? 's' : ''}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Modify Search toggle */}
              <button
                onClick={() => setShowSearchPanel(v => !v)}
                className={`px-4 py-2.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                  showSearchPanel
                    ? 'bg-gold text-navy-950 border border-gold'
                    : 'bg-transparent border border-slate-700 hover:border-gold hover:text-white text-slate-350'
                }`}
              >
                <IoSearchOutline className="w-4 h-4" />
                <span className="hidden sm:inline">Modify Search</span>
                <IoChevronDownOutline
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${showSearchPanel ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Filters */}
              <button
                onClick={() => setShowFiltersDrawer(true)}
                className="px-4 py-2.5 rounded-full font-black text-xs uppercase tracking-wider bg-transparent border border-slate-700 hover:border-gold hover:text-white text-slate-350 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <IoFilterOutline className="w-4 h-4 text-gold animate-[pulse_2s_infinite]" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gold text-navy-950 font-black text-[9px] flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ── Inline Search Panel (collapsible) ── */}
          <AnimatePresence initial={false}>
            {showSearchPanel && (
              <motion.div
                key="inline-search"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-white/5"
              >
                <div className="max-w-6xl mx-auto px-6 py-5">
                  <InlineFlightSearch
                    loading={loading}
                    onSearch={() => setShowSearchPanel(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* WIDE CENTERED GRID CONTAINER */}
        <div className="max-w-4xl mx-auto px-6 mt-8" ref={resultsRef}>
          <div className="flex flex-col gap-6 w-full text-left">
            
            {/* Sort Tabs & Count */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Sort Tabs */}
              <div className="w-full md:w-auto md:min-w-[420px] grid grid-cols-3 gap-2 bg-navy-900/60 border border-white/5 rounded-[24px] p-2 select-none shadow-md">
                {[
                  { id: 'best', label: 'Best', icon: <IoSparklesOutline className="w-4 h-4" />, price: bestFlight?.price, duration: bestFlight?.duration },
                  { id: 'cheapest', label: 'Cheapest', icon: <IoTrendingDownOutline className="w-4 h-4" />, price: cheapestFlight?.price, duration: cheapestFlight?.duration },
                  { id: 'fastest', label: 'Fastest', icon: <IoFlashOutline className="w-4 h-4" />, price: fastestFlight?.price, duration: fastestFlight?.duration }
                ].map((tab) => {
                  const isActive = sortBy === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSortBy(tab.id)}
                      className={`relative py-3.5 px-3 rounded-[18px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'text-navy-950 font-black'
                          : 'text-slate-400 hover:text-white font-semibold'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sortTabActiveIndicator"
                          className="absolute inset-0 bg-gradient-to-r from-gold to-yellow-500 rounded-[18px] z-0 shadow-lg"
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        />
                      )}
                      
                      <div className="flex items-center gap-1.5 z-10 text-xs">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                      
                      <div className="z-10 flex flex-col text-[10px] items-center tracking-wide leading-tight opacity-90 mt-0.5">
                        {tab.price ? (
                          <span className="font-extrabold">₹{tab.price.toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="text-slate-550 font-bold">—</span>
                        )}
                        {tab.duration && (
                          <span className="text-[9px] opacity-75 font-semibold">{tab.duration}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Counts Label & Mobile filters Trigger */}
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-350">
                  {filteredFlights.length} Flight{filteredFlights.length !== 1 ? 's' : ''} Found
                </span>
              </div>
            </div>

            {/* ACTIVE CHIPS VIEW */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 p-2 bg-navy-905 border border-white/5 rounded-2xl select-none">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-2">Active:</span>
                
                {priceRange < maxPriceLimit && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/20 text-[10px] font-bold">
                    <span>Max ₹{priceRange.toLocaleString('en-IN')}</span>
                    <button onClick={() => setPriceRange(maxPriceLimit)} className="text-slate-400 hover:text-white cursor-pointer">
                      <IoCloseOutline className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {stopsFilter !== 'all' && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/20 text-[10px] font-bold">
                    <span>{stopsFilter === '0' ? 'Non-stop' : stopsFilter === '1' ? '1 Stop' : '2+ Stops'}</span>
                    <button onClick={() => setStopsFilter('all')} className="text-slate-400 hover:text-white cursor-pointer">
                      <IoCloseOutline className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {depTimeFilter !== 'all' && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/20 text-[10px] font-bold">
                    <span>Dep: {depTimeFilter}</span>
                    <button onClick={() => setDepTimeFilter('all')} className="text-slate-400 hover:text-white cursor-pointer">
                      <IoCloseOutline className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {arrTimeFilter !== 'all' && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/20 text-[10px] font-bold">
                    <span>Arr: {arrTimeFilter}</span>
                    <button onClick={() => setArrTimeFilter('all')} className="text-slate-400 hover:text-white cursor-pointer">
                      <IoCloseOutline className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {durationFilter < maxDurationLimit && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/20 text-[10px] font-bold">
                    <span>Max {durationFilter}h</span>
                    <button onClick={() => setDurationFilter(maxDurationLimit)} className="text-slate-400 hover:text-white cursor-pointer">
                      <IoCloseOutline className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {airlineFilter.map(airline => (
                  <span key={airline} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/20 text-[10px] font-bold">
                    <span>{airline.split(' ')[0]}</span>
                    <button onClick={() => handleRemoveAirline(airline)} className="text-slate-400 hover:text-white cursor-pointer">
                      <IoCloseOutline className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                {amenitiesFilter.map(amenity => (
                  <span key={amenity} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/20 text-[10px] font-bold">
                    <span>{amenity === 'refundable' ? 'Refundable' : amenity === 'wifi' ? 'Wi-Fi' : 'Meals'}</span>
                    <button onClick={() => handleRemoveAmenity(amenity)} className="text-slate-400 hover:text-white cursor-pointer">
                      <IoCloseOutline className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                <button 
                  onClick={handleResetFilters}
                  className="text-[9px] font-black text-slate-405 hover:text-gold uppercase tracking-widest pl-2 pr-1.5 cursor-pointer ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* CARDS LISTINGS */}
            <div className="flex flex-col gap-5">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <FlightSkeleton />
                ) : filteredFlights.length === 0 ? (
                  /* NO FLIGHTS STATE */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-20 px-6 text-center flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[24px] bg-navy-900/40 backdrop-blur-md shadow-lg"
                  >
                    <svg className="w-24 h-24 text-gold/20 mb-6 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                      <path d="M30 50L45 55L75 35L55 60L30 50Z" fill="currentColor" opacity="0.6"/>
                    </svg>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">No Flights Found</h3>
                    <p className="text-xs text-slate-400 font-semibold max-w-sm mt-2 leading-relaxed">
                      We couldn't find any flights matching your criteria. Try adjusting your sliders, stops, or clearing filters to see more results.
                    </p>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => setShowFiltersDrawer(true)}
                        className="px-5 py-2.5 bg-navy-800 hover:bg-navy-750 border border-slate-700 hover:border-gold hover:text-white text-slate-355 font-extrabold text-[10px] uppercase tracking-wider rounded-full transition-all cursor-pointer"
                      >
                        Adjust Filters
                      </button>
                      <button
                        onClick={handleResetFilters}
                        className="px-5 py-2.5 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 text-navy-950 font-extrabold text-[10px] uppercase tracking-wider rounded-full transition-all cursor-pointer"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* RENDERED CARDS */
                  paginatedFlights.map((flight) => (
                    <motion.div
                      key={flight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      layout="position"
                    >
                      <FlightCard
                        flight={flight}
                        onSelect={handleSelectFlight}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* PAGINATION PANEL */}
            {!loading && filteredFlights.length > 0 && (
              <div className="w-full flex items-center justify-between bg-navy-900/60 border border-white/5 rounded-[24px] p-4 select-none shadow-md mt-4">
                <span className="text-[11px] font-semibold text-slate-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredFlights.length)} of {filteredFlights.length} Flights
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2 bg-navy-850 hover:bg-navy-800 border border-slate-800 hover:border-gold text-slate-300 disabled:opacity-30 disabled:border-slate-800 disabled:hover:text-slate-300 rounded-xl transition-all cursor-pointer"
                    title="Previous Page"
                  >
                    <IoChevronBackOutline className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNum = index + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                          isActive
                            ? 'bg-gradient-to-r from-gold to-yellow-500 text-navy-950 font-black shadow-lg shadow-gold/20'
                            : 'bg-navy-850 hover:bg-navy-800 text-slate-450 hover:text-white border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2 bg-navy-850 hover:bg-navy-800 border border-slate-800 hover:border-gold text-slate-300 disabled:opacity-30 disabled:border-slate-800 disabled:hover:text-slate-300 rounded-xl transition-all cursor-pointer"
                    title="Next Page"
                  >
                    <IoChevronForwardOutline className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* UNIFIED SIDE SLIDE-OVER / BOTTOM SHEET FILTERS PANEL */}
        <FilterPanel
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPriceLimit={maxPriceLimit}
          stopsFilter={stopsFilter}
          setStopsFilter={setStopsFilter}
          depTimeFilter={depTimeFilter}
          setDepTimeFilter={setDepTimeFilter}
          arrTimeFilter={arrTimeFilter}
          setArrTimeFilter={setArrTimeFilter}
          durationFilter={durationFilter}
          setDurationFilter={setDurationFilter}
          maxDurationLimit={maxDurationLimit}
          airlineFilter={airlineFilter}
          setAirlineFilter={setAirlineFilter}
          amenitiesFilter={amenitiesFilter}
          setAmenitiesFilter={setAmenitiesFilter}
          onReset={handleResetFilters}
          isOpen={showFiltersDrawer}
          onClose={() => setShowFiltersDrawer(false)}
        />

      </div>

      <Footer />
    </div>
  );
}
