import { IoFunnelOutline, IoCloseOutline, IoRefreshOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterPanel({
  priceRange,
  setPriceRange,
  maxPriceLimit,
  stopsFilter,
  setStopsFilter,
  depTimeFilter,
  setDepTimeFilter,
  arrTimeFilter,
  setArrTimeFilter,
  durationFilter,
  setDurationFilter,
  maxDurationLimit,
  airlineFilter,
  setAirlineFilter,
  amenitiesFilter,
  setAmenitiesFilter,
  onReset,
  isOpen = false,
  onClose
}) {

  // Time segment values
  const timeOptions = [
    { label: 'Morning (6AM - 12PM)', value: 'morning' },
    { label: 'Afternoon (12PM - 6PM)', value: 'afternoon' },
    { label: 'Evening (6PM - 12AM)', value: 'evening' },
    { label: 'Night (12AM - 6AM)', value: 'night' }
  ];

  // Airline options matching mock database
  const airlines = [
    'SkyHorizon Airways',
    'BlueWings',
    'Nimbus Air',
    'AeroIndia',
    'SkyJet'
  ];

  const handleAirlineChange = (airline) => {
    if (airlineFilter.includes(airline)) {
      setAirlineFilter(airlineFilter.filter(item => item !== airline));
    } else {
      setAirlineFilter([...airlineFilter, airline]);
    }
  };

  const handleAmenityChange = (amenity) => {
    if (amenitiesFilter.includes(amenity)) {
      setAmenitiesFilter(amenitiesFilter.filter(item => item !== amenity));
    } else {
      setAmenitiesFilter([...amenitiesFilter, amenity]);
    }
  };

  const filtersContent = (
    <div className="flex flex-col gap-6 text-left select-none">
      
      {/* Reset all button inside drawer */}
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Filter Options</span>
        <button
          onClick={onReset}
          className="text-xs font-bold text-gold hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
        >
          <IoRefreshOutline className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* 1. Price Range Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Price</span>
          <span className="text-xs font-black text-gold">₹{priceRange.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="3000"
          max={maxPriceLimit}
          step="500"
          value={priceRange}
          onChange={(e) => setPriceRange(parseInt(e.target.value))}
          className="w-full accent-gold cursor-pointer bg-slate-800 h-1.5 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[9px] text-slate-550 font-extrabold uppercase">
          <span>₹3,000</span>
          <span>₹{maxPriceLimit.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* 2. Stops Selector */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stops</span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Non-stop', value: '0' },
            { label: '1 Stop', value: '1' },
            { label: '2+ Stops', value: '2' }
          ].map((opt) => {
            const isSelected = stopsFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStopsFilter(stopsFilter === opt.value ? 'all' : opt.value)}
                className={`py-2 rounded-xl text-[10px] font-bold border transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-slate-850 bg-navy-950/40 text-slate-400 hover:border-slate-700 hover:text-white font-medium'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Departure Time Selector */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departure Time</span>
        <div className="grid grid-cols-2 gap-2">
          {timeOptions.map((opt) => {
            const isSelected = depTimeFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDepTimeFilter(depTimeFilter === opt.value ? 'all' : opt.value)}
                className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all text-center cursor-pointer truncate ${
                  isSelected
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-slate-850 bg-navy-950/40 text-slate-400 hover:border-slate-700 hover:text-white font-medium'
                }`}
                title={opt.label}
              >
                {opt.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Arrival Time Selector */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arrival Time</span>
        <div className="grid grid-cols-2 gap-2">
          {timeOptions.map((opt) => {
            const isSelected = arrTimeFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setArrTimeFilter(arrTimeFilter === opt.value ? 'all' : opt.value)}
                className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all text-center cursor-pointer truncate ${
                  isSelected
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-slate-850 bg-navy-950/40 text-slate-400 hover:border-slate-700 hover:text-white font-medium'
                }`}
                title={opt.label}
              >
                {opt.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Maximum Flight Duration Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Duration</span>
          <span className="text-xs font-black text-gold">{durationFilter}h</span>
        </div>
        <input
          type="range"
          min="1"
          max={maxDurationLimit}
          step="0.5"
          value={durationFilter}
          onChange={(e) => setDurationFilter(parseFloat(e.target.value))}
          className="w-full accent-gold cursor-pointer bg-slate-800 h-1.5 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[9px] text-slate-550 font-extrabold uppercase">
          <span>1h</span>
          <span>{maxDurationLimit}h</span>
        </div>
      </div>

      {/* 6. Airlines Filter */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Airlines</span>
        <div className="flex flex-col gap-2.5">
          {airlines.map((airline) => (
            <label key={airline} className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer select-none hover:text-white">
              <input
                type="checkbox"
                checked={airlineFilter.includes(airline)}
                onChange={() => handleAirlineChange(airline)}
                className="w-4 h-4 rounded border border-slate-700 bg-navy-950 text-gold accent-gold focus:ring-0 cursor-pointer"
              />
              <span>{airline}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 7. Amenities Checkboxes */}
      <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amenities & Fares</span>
        <div className="flex flex-col gap-2.5">
          {[
            { label: 'Refundable Fares', value: 'refundable' },
            { label: 'Wi-Fi Onboard', value: 'wifi' },
            { label: 'Meals Included', value: 'meal' }
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer select-none hover:text-white">
              <input
                type="checkbox"
                checked={amenitiesFilter.includes(opt.value)}
                onChange={() => handleAmenityChange(opt.value)}
                className="w-4 h-4 rounded border border-slate-700 bg-navy-950 text-gold accent-gold focus:ring-0 cursor-pointer"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur backdrop for drawers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* DESKTOP SLIDE-OVER DRAWER (From Left) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[380px] bg-navy-900 border-r border-white/10 shadow-2xl z-50 flex-col overflow-hidden text-left"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <span className="font-black text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <IoFunnelOutline className="w-4.5 h-4.5 text-gold animate-[pulse_2s_infinite]" />
                Filter Flight Results
              </span>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer">
                <IoCloseOutline className="w-6 h-6" />
              </button>
            </div>
            
            {/* Scrollable Filters list */}
            <div className="flex-grow overflow-y-auto p-6 scrollbar-none pb-28">
              {filtersContent}
            </div>

            {/* Sticky Bottom Apply Action */}
            <div className="p-5 bg-navy-950/90 border-t border-white/5 absolute bottom-0 left-0 right-0 z-10 shrink-0">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-gold to-yellow-500 rounded-full text-navy-950 font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>

          {/* MOBILE SLIDE-UP DRAWER (Bottom Sheet) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 max-h-[82vh] bg-navy-900 border-t border-white/10 rounded-t-[32px] z-50 overflow-hidden flex flex-col shadow-2xl text-left"
          >
            {/* Handle Drag bar */}
            <div className="w-full flex justify-center py-3.5 cursor-row-resize select-none shrink-0" onClick={onClose}>
              <div className="w-12 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Title & Close */}
            <div className="px-6 pb-2.5 flex items-center justify-between border-b border-white/5 shrink-0">
              <span className="font-black text-sm text-white uppercase tracking-wider">Refine Flight Search</span>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer">
                <IoCloseOutline className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable filter list */}
            <div className="flex-grow overflow-y-auto px-6 py-6 pb-28">
              {filtersContent}
            </div>

            {/* Sticky Bottom Apply Button */}
            <div className="p-4 bg-navy-950/90 border-t border-white/5 shrink-0 z-10">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-gold to-yellow-500 rounded-full text-navy-950 font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
