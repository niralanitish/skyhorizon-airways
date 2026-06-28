import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoAirplaneOutline, 
  IoWifiOutline, 
  IoCafeOutline, 
  IoBriefcaseOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoBatteryChargingOutline,
  IoFilmOutline,
  IoFlameOutline,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoTicketOutline,
  IoSparklesOutline,
  IoTrendingDownOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import Card from '../common/Card';

// Utility to calculate Boarding Time (45 minutes before departure)
const calculateBoardingTime = (depTime) => {
  if (!depTime) return '05:15';
  const [h, m] = depTime.split(':').map(Number);
  let bh = h;
  let bm = m - 45;
  if (bm < 0) {
    bm += 60;
    bh -= 1;
    if (bh < 0) bh += 24;
  }
  return `${String(bh).padStart(2, '0')}:${String(bm).padStart(2, '0')}`;
};

// SVG Fictional Airline Logos with high-quality gradients, drop-shadows, and gold trims
export function AirlineLogo({ code, className = "w-10 h-10" }) {
  const shadowFilter = "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.4))";
  
  if (code === 'SH') {
    return (
      <div className={`relative flex items-center justify-center p-0.5 rounded-full bg-gradient-to-br from-gold/40 via-yellow-600/20 to-navy-950 border border-gold/40 shadow-lg ${className}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: shadowFilter }}>
          <path d="M50 15C30 15 20 35 15 50C25 55 45 45 50 30C55 45 75 55 85 50C80 35 70 15 50 15Z" fill="url(#shGoldGrad)" />
          <path d="M50 35C45 48 35 58 20 60C35 63 45 73 50 85C55 73 65 63 80 60C65 58 55 48 50 35Z" fill="#ffffff" opacity="0.9" />
          <defs>
            <linearGradient id="shGoldGrad" x1="15" y1="15" x2="85" y2="50">
              <stop stopColor="#fbbf24" />
              <stop offset="0.5" stopColor="#f5a623" />
              <stop offset="1" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }
  if (code === 'BW') {
    return (
      <div className={`relative flex items-center justify-center p-0.5 rounded-full bg-gradient-to-br from-blue-500/40 to-navy-950 border border-blue-500/45 shadow-lg ${className}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: shadowFilter }}>
          <path d="M15 45C35 30 65 32 85 45C60 55 35 52 15 45Z" fill="url(#bwGrad)" />
          <path d="M22 55C40 42 62 45 78 55C58 63 38 61 22 55Z" fill="#60a5fa" opacity="0.8" />
          <defs>
            <linearGradient id="bwGrad" x1="15" y1="30" x2="85" y2="55">
              <stop stopColor="#1e40af" />
              <stop offset="0.5" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }
  if (code === 'NA') {
    return (
      <div className={`relative flex items-center justify-center p-0.5 rounded-full bg-gradient-to-br from-slate-400/40 to-navy-950 border border-slate-450 shadow-lg ${className}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: shadowFilter }}>
          <path d="M32 58C27 58 22 54 22 49C22 42 28 38 35 38C38 30 45 25 54 25C64 25 72 32 74 40C80 40 84 45 84 49C84 55 79 58 74 58H32Z" fill="url(#naGrad)" />
          <path d="M62 33L65 39L72 40L67 44L68 50L62 47L56 50L57 44L52 40L59 39L62 33Z" fill="#fbbf24" />
          <defs>
            <linearGradient id="naGrad" x1="22" y1="25" x2="84" y2="58">
              <stop stopColor="#f8fafc" />
              <stop offset="0.6" stopColor="#cbd5e1" />
              <stop offset="1" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }
  if (code === 'AI') {
    return (
      <div className={`relative flex items-center justify-center p-0.5 rounded-full bg-gradient-to-br from-orange-500/40 via-green-600/20 to-navy-950 border border-orange-500/45 shadow-lg ${className}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: shadowFilter }}>
          <path d="M15 35H85L60 48L15 35Z" fill="#f97316" />
          <path d="M22 50H78L55 62L22 50Z" fill="#16a34a" />
          <circle cx="50" cy="45" r="5" fill="#1e3a8a" />
        </svg>
      </div>
    );
  }
  return (
    <div className={`relative flex items-center justify-center p-0.5 rounded-full bg-gradient-to-br from-amber-500/40 to-navy-950 border border-amber-500/45 shadow-lg ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: shadowFilter }}>
        <path d="M50 15L67 52H54L50 82L46 52H33L50 15Z" fill="url(#sjGold)" />
        <defs>
          <linearGradient id="sjGold" x1="50" y1="15" x2="50" y2="82">
            <stop stopColor="#fbbf24" />
            <stop offset="0.5" stopColor="#f5a623" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function FlightCard({ 
  flight, 
  onSelect, 
  isSelected = false 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    id,
    airline,
    airlineCode,
    flightNumber,
    aircraft,
    source,
    sourceCode,
    destination,
    destinationCode,
    departureTime,
    arrivalTime,
    duration,
    stops,
    numberOfStops,
    stopover,
    price,
    cabin,
    wifi,
    meal,
    baggage,
    refundType,
    bestChoice,
    seatsLeft,
    availableSeats,
    terminal,
    gate,
    rating
  } = flight;

  const finalStops = numberOfStops !== undefined ? numberOfStops : (stops || 0);
  const finalSeatsLeft = availableSeats !== undefined ? availableSeats : (seatsLeft || 0);
  const finalDepartureTime = departureTime || '—';
  const finalArrivalTime = arrivalTime || '—';
  const finalDuration = duration || '—';
  const finalAircraft = aircraft || '—';
  const finalCabin = cabin || 'Economy';
  const finalTerminal = terminal || '—';
  const finalGate = gate || '—';
  const finalBaggage = baggage || '—';
  const finalRating = rating || null;
  const finalRefundType = refundType || null;

  const boardingTime = calculateBoardingTime(departureTime);

  // Setup premium badges based on real backend values only (no fake values synthesized)
  const showBestChoice = bestChoice;
  const showLowestFare = price < 5000;
  const showGreatValue = finalRating && finalRating >= 4.8 && price < 7000;
  const showLimitedSeats = finalSeatsLeft > 0 && finalSeatsLeft <= 3;
  const showFlexible = finalRefundType === 'Refundable';

  return (
    <Card 
      variant="glass" 
      hoverEffect={!isSelected}
      className={`border transition-all duration-500 overflow-visible rounded-[24px] ${
        isSelected 
          ? 'border-gold shadow-[0_0_30px_rgba(245,166,35,0.25)] bg-navy-900/90' 
          : 'border-white/5 hover:border-gold/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]'
      }`}
    >
      {/* Top Banner Badges (Rendered elegantly on absolute top) */}
      <div className="absolute -top-3 left-6 flex flex-wrap gap-2 z-10 select-none">
        {showBestChoice && (
          <span className="px-3 py-0.5 bg-gradient-to-r from-amber-500 via-gold to-yellow-600 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1 border border-amber-400/20">
            <IoFlameOutline className="w-3 h-3" />
            Best Choice
          </span>
        )}
        {showLowestFare && (
          <span className="px-3 py-0.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1 border border-emerald-450/20">
            <IoTrendingDownOutline className="w-3 h-3" />
            Lowest Fare
          </span>
        )}
        {showGreatValue && (
          <span className="px-3 py-0.5 bg-gradient-to-r from-indigo-600 to-blue-750 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1 border border-indigo-400/20">
            <IoSparklesOutline className="w-3 h-3" />
            Great Value
          </span>
        )}
        {showFlexible && (
          <span className="px-3 py-0.5 bg-navy-950 text-gold border border-gold/45 font-extrabold text-[9px] uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
            <IoShieldCheckmarkOutline className="w-3 h-3" />
            Flexible
          </span>
        )}
      </div>

      {/* Main card grid using a two-column design: left detail column + right pricing column */}
      <div className="flex flex-col md:flex-row md:items-stretch">
        
        {/* Left side: Airline branding, Timeline, and Metadata */}
        <div className="flex-grow flex flex-col gap-6 p-6 md:p-8 md:pr-6 text-left">
          
          {/* Header row: Logo, Airline name, Aircraft metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <AirlineLogo code={airlineCode} className="w-10 h-10 shrink-0" />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm md:text-base text-white tracking-wide">{airline}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider bg-slate-800/80 px-1.5 py-0.2 rounded border border-white/5">
                    {flightNumber}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold">{finalCabin} · {finalAircraft}</span>
                </div>
              </div>
            </div>
            
            {/* Right-aligned segment inside details header */}
            {finalRating && (
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest bg-navy-950/40 px-3 py-1 rounded-full border border-white/5">
                Rating: {finalRating} ★
              </span>
            )}
          </div>

          {/* Timeline Row (No overlap layout) */}
          <div className="flex items-center justify-between gap-3 md:gap-6 py-2 select-none">
            {/* Departure Station */}
            <div className="flex flex-col items-start text-left shrink-0">
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">{finalDepartureTime}</span>
              <span className="text-xs font-black text-gold mt-1.5 uppercase tracking-wider leading-none">{sourceCode || (source ? source.substring(0, 3).toUpperCase() : '—')}</span>
              <span className="text-[10px] text-slate-450 font-bold mt-1 max-w-[90px] truncate" title={source}>{source}</span>
              <span className="text-[9px] text-slate-500 font-extrabold uppercase mt-2 flex items-center gap-1.5 leading-none">
                <IoTimeOutline className="w-3.5 h-3.5 text-gold/80" />
                <span>Brd: {boardingTime}</span>
              </span>
            </div>

            {/* Travel Line Pathway */}
            <div className="flex-grow flex flex-col items-center px-1 relative">
              <span className="text-[10px] text-slate-400 font-black mb-1.5 tracking-wide leading-none">{finalDuration}</span>
              
              <div className="w-full flex items-center justify-between relative py-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gold border-2 border-gold shadow-[0_0_8px_rgba(245,166,35,0.7)] z-10 shrink-0" />
                
                <div className="flex-grow h-[1.5px] bg-gradient-to-r from-gold/45 via-gold to-gold/45 relative mx-1">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-navy-900 rounded-full border border-gold/30 shadow-md">
                    <IoAirplaneOutline className="w-3.5 h-3.5 text-gold rotate-90" />
                  </div>
                </div>
                
                <span className="w-2.5 h-2.5 rounded-full bg-gold border-2 border-gold shadow-[0_0_8px_rgba(245,166,35,0.7)] z-10 shrink-0" />
              </div>

              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 leading-none text-center">
                {finalStops === 0 ? 'Non-stop' : `${finalStops} Stop${finalStops > 1 ? 's' : ''}${stopover ? ` (${stopover})` : ''}`}
              </span>
            </div>

            {/* Arrival Station */}
            <div className="flex flex-col items-end text-right shrink-0">
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">{finalArrivalTime}</span>
              <span className="text-xs font-black text-gold mt-1.5 uppercase tracking-wider leading-none">{destinationCode || (destination ? destination.substring(0, 3).toUpperCase() : '—')}</span>
              <span className="text-[10px] text-slate-450 font-bold mt-1 max-w-[90px] truncate" title={destination}>{destination}</span>
              <span className="text-[9px] text-slate-500 font-extrabold uppercase mt-2 flex items-center gap-1.5 leading-none">
                <IoLocationOutline className="w-3.5 h-3.5 text-gold/80" />
                <span>Term {finalTerminal} · G {finalGate}</span>
              </span>
            </div>
          </div>

          {/* Footer details row */}
          <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-4 text-xs mt-2 gap-4">
            <div className="flex flex-wrap items-center gap-4 text-slate-450 font-bold text-[10px]">
              {wifi && (
                <span className="flex items-center gap-1" title="Complimentary Wi-Fi Available">
                  <IoWifiOutline className="w-4 h-4 text-gold shrink-0" />
                  <span>Wi-Fi</span>
                </span>
              )}
              {meal && (
                <span className="flex items-center gap-1" title="In-flight Hot Meal Included">
                  <IoCafeOutline className="w-4 h-4 text-gold shrink-0" />
                  <span>Meals</span>
                </span>
              )}
              <span className="flex items-center gap-1" title="Checked Luggage Allowance">
                <IoBriefcaseOutline className="w-4 h-4 text-gold shrink-0" />
                <span>Luggage: {finalBaggage}</span>
              </span>
            </div>

            {/* View details */}
            <button
              onClick={() => onSelect(flight)}
              className="flex items-center gap-1 text-xs font-extrabold text-gold hover:text-white transition-colors cursor-pointer select-none py-1 px-3.5 rounded-full hover:bg-white/5"
            >
              <span>View Details</span>
              <IoChevronDownOutline className="w-3.5 h-3.5 -rotate-90" />
            </button>
          </div>

        </div>

        {/* Right side: Pricing and Action Button (Stretched layout, vertical separator) */}
        <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-white/5 p-6 md:p-8 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-stretch gap-4 shrink-0 bg-navy-900/10 rounded-b-[24px] md:rounded-b-none md:rounded-r-[24px] select-none text-left md:text-right">
          
          {/* Price display container */}
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Total Fare</span>
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1.5 leading-none">₹{price.toLocaleString('en-IN')}</span>
            <span className="text-[9px] font-semibold text-emerald-450 mt-1.5 leading-none">taxes & fees incl.</span>
          </div>

          {/* Action button container */}
          <div className="flex flex-col gap-2 shrink-0 md:w-full">
            <button
              onClick={() => onSelect(flight)}
              className={`px-5 py-3 rounded-full font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 relative overflow-hidden group border w-full ${
                isSelected 
                  ? 'bg-gold text-navy-950 border-gold shadow-[0_0_20px_rgba(245,166,35,0.35)]' 
                  : 'bg-transparent text-gold border-gold/45 hover:bg-gold hover:text-navy-950 hover:border-gold hover:shadow-[0_0_20px_rgba(245,166,35,0.3)]'
              }`}
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_0.8s_ease-in-out]" />
              <IoTicketOutline className="w-4 h-4 shrink-0" />
              <span>{isSelected ? 'Selected' : 'Book Now'}</span>
            </button>

            {/* Seats Left indicator — always shown when backend provides the value */}
            {finalSeatsLeft > 0 && (
              <span className={`hidden md:flex items-center justify-center gap-1 text-[9px] font-extrabold uppercase tracking-wider mt-1 ${
                finalSeatsLeft <= 3
                  ? 'text-red-400 animate-pulse'
                  : finalSeatsLeft <= 10
                    ? 'text-amber-400'
                    : 'text-emerald-400'
              }`}>
                Seats Left: {finalSeatsLeft}
              </span>
            )}
          </div>

        </div>

      </div>

      {/* Expandable detailed itinerary panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="border-t border-white/5 bg-navy-950/45 overflow-hidden rounded-b-[24px]"
          >
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-sm">
              
              {/* Aircraft details */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-gold uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <IoAirplaneOutline className="w-4 h-4 text-gold shrink-0" />
                  Aircraft & Configuration
                </span>
                <div className="flex flex-col gap-2.5 text-slate-350 font-semibold text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Model:</span>
                    <span className="text-white">{finalAircraft}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Seating:</span>
                    <span className="text-white">{aircraft ? (aircraft.includes('A320') ? '3 - 3 Layout' : '3 - 3 - 3 Layout') : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Seat Pitch:</span>
                    <span className="text-white">{aircraft ? (aircraft.includes('Dreamliner') || aircraft.includes('350') ? '32-34 inches' : '31 inches') : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Travel Class:</span>
                    <span className="text-white">{finalCabin} (Standard)</span>
                  </div>
                </div>
              </div>

              {/* Inflight Services */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-gold uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <IoSparklesOutline className="w-4 h-4 text-gold shrink-0" />
                  Inflight Experience
                </span>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    <IoWifiOutline className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <div className="flex flex-col text-xs leading-tight">
                      <span className="font-bold text-white">{wifi ? 'Complimentary Broadband Wi-Fi' : 'Offline Flight'}</span>
                      <span className="text-slate-450 text-[10px] mt-1 font-medium">
                        {wifi ? 'Stream, chat, and browse with speeds up to 50 Mbps.' : 'In-flight internet is not available.'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <IoBatteryChargingOutline className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <div className="flex flex-col text-xs leading-tight">
                      <span className="font-bold text-white">USB & Universal Sockets</span>
                      <span className="text-slate-450 text-[10px] mt-1 font-medium">110V AC electrical outlets and Type-A & Type-C USB charging ports at each seat.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <IoFilmOutline className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <div className="flex flex-col text-xs leading-tight">
                      <span className="font-bold text-white">HD In-seat Entertainment</span>
                      <span className="text-slate-455 text-[10px] mt-1 font-medium">Personal touchscreen with 2,000+ hours of movies, TV, and audio options.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Baggage & Cancellations */}
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-gold uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <IoBriefcaseOutline className="w-4 h-4 text-gold shrink-0" />
                  Baggage & Fare Policies
                </span>
                <div className="flex flex-col gap-2.5 text-slate-355 font-semibold text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Cabin Baggage:</span>
                    <span className="text-white">1x 7kg Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Checked Baggage:</span>
                    <span className="text-white">1x {finalBaggage} Check-in</span>
                  </div>
                  {finalRefundType && (
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-500 font-medium">Refund Status:</span>
                      <span className={finalRefundType === 'Refundable' ? 'text-emerald-450' : 'text-slate-450'}>{finalRefundType}</span>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                    <span className="text-gold font-bold">Rules:</span> Cancellations made up to 24h prior incur a penalty fee of ₹2,500. Refunds are processed within 7 working days to the original mode of payment.
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
