import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoAirplaneOutline, 
  IoChevronForwardOutline,
  IoWifiOutline,
  IoCafeOutline,
  IoFilmOutline,
  IoBatteryChargingOutline,
  IoBriefcaseOutline,
  IoReceiptOutline,
  IoShieldCheckmarkOutline,
  IoCheckmarkCircleSharp,
  IoBedOutline,
  IoStarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoSparklesOutline,
  IoCloseOutline
} from 'react-icons/io5';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/home/Footer';
import Card from '../components/common/Card';
import { AirlineLogo } from '../components/flights/FlightCard';

// Utility to calculate Boarding Time (45 minutes before departure)
const calculateBoardingTime = (depTime) => {
  if (!depTime) return '05:15 AM';
  let cleanTime = depTime.replace(/ (AM|PM)/i, '');
  const parts = cleanTime.split(':');
  let h = Number(parts[0]) || 0;
  let m = Number(parts[1]) || 0;
  
  const isPM = depTime.toLowerCase().includes('pm');
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;
  
  let bh = h;
  let bm = m - 45;
  if (bm < 0) {
    bm += 60;
    bh -= 1;
    if (bh < 0) bh += 24;
  }
  
  const ampm = bh >= 12 ? 'PM' : 'AM';
  const bh12 = bh % 12 || 12;
  return `${String(bh12).padStart(2, '0')}:${String(bm).padStart(2, '0')} ${ampm}`;
};

// Utility to generate deterministic pseudo-random values from strings
const getSeed = (str) => {
  if (!str) return 12345;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const getDeterministicValue = (seedStr, arr) => {
  return arr[getSeed(seedStr) % arr.length];
};

const getAirportCode = (city) => {
  if (!city) return 'XXX';
  const codes = {
    'Hyderabad': 'HYD', 'Delhi': 'DEL', 'Mumbai': 'BOM', 'Bangalore': 'BLR',
    'Chennai': 'MAA', 'Kolkata': 'CCU', 'Goa': 'GOI', 'Pune': 'PNQ',
    'Dubai': 'DXB', 'Singapore': 'SIN', 'London': 'LHR', 'New York': 'JFK'
  };
  return codes[city] || city.substring(0, 3).toUpperCase();
};

const generateMockData = (flightNum, src, dest) => {
  const seed = `${flightNum}-${src}-${dest}`;
  const aircrafts = ['Airbus A320neo', 'Boeing 737 MAX', 'Boeing 787 Dreamliner', 'Airbus A350-900', 'Boeing 777-300ER'];
  const terminals = ['T1', 'T2', 'T3'];
  const gates = ['A12', 'B07', 'C18', 'D22', 'E05', 'F14'];
  const baggageOpts = ['15kg Check-in', '20kg Check-in', '25kg Check-in', '30kg Check-in'];
  
  const depHours = (getSeed(seed + 'depH') % 18) + 5; 
  const depMins = (getSeed(seed + 'depM') % 12) * 5; 
  const durHours = (getSeed(seed + 'durH') % 4) + 1; 
  const durMins = (getSeed(seed + 'durM') % 12) * 5; 
  
  const formatTime = (h, m) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const arrH = depHours + durHours + Math.floor((depMins + durMins) / 60);
  const arrM = (depMins + durMins) % 60;
  
  return {
    aircraft: getDeterministicValue(seed + 'ac', aircrafts),
    terminal: getDeterministicValue(seed + 'term', terminals),
    gate: getDeterministicValue(seed + 'gate', gates),
    baggage: getDeterministicValue(seed + 'bag', baggageOpts),
    departureTime: formatTime(depHours, depMins),
    arrivalTime: formatTime(arrH % 24, arrM),
    duration: `${durHours}h ${durMins > 0 ? durMins + 'm' : ''}`.trim()
  };
};

const getAircraftDescription = (ac) => {
  if (ac.includes('787')) return 'The Boeing 787 Dreamliner is a state-of-the-art widebody aircraft featuring quieter engines, large dimmable windows, and advanced cabin air conditioning filters.';
  if (ac.includes('350')) return 'The Airbus A350 is a cutting-edge widebody aircraft offering unmatched passenger comfort, ambient lighting, and an incredibly quiet cabin experience.';
  if (ac.includes('320')) return 'The Airbus A320neo brings next-generation engine technology for a quieter, smoother, and more eco-friendly journey on short to medium haul flights.';
  if (ac.includes('737')) return 'The Boeing 737 MAX offers enhanced cabin interiors, larger overhead bins, and superior fuel efficiency for a comfortable and sustainable flight.';
  return `The ${ac} offers a modern and comfortable cabin environment tailored to enhance your inflight experience.`;
};

// Mock Hotels database based on destination city
const mockHotels = {
  'Goa': [
    { name: 'Taj Exotica Resort & Spa', rating: 4.9, price: 14500, desc: 'Luxury beachfront resort in South Goa.' },
    { name: 'W Goa', rating: 4.8, price: 18200, desc: 'Vibrant cliffside stay in Vagator.' },
    { name: 'Cidade de Goa - IHCL', rating: 4.6, price: 9800, desc: 'Portuguese heritage resort by Vainguinim Beach.' }
  ],
  'Delhi': [
    { name: 'The Leela Palace New Delhi', rating: 4.9, price: 19500, desc: 'Palatial luxury in Diplomatic Enclave.' },
    { name: 'Taj Mahal Hotel Delhi', rating: 4.8, price: 16800, desc: 'Iconic stay in the heart of Lutyens.' },
    { name: 'The Lodhi', rating: 4.7, price: 15200, desc: 'Modern urban luxury with private plunge pools.' }
  ],
  'Mumbai': [
    { name: 'The Taj Mahal Palace Mumbai', rating: 4.9, price: 24000, desc: 'Historic landmark facing the Gateway of India.' },
    { name: 'Trident Nariman Point', rating: 4.7, price: 11500, desc: 'Panoramic Arabian Sea views along Marine Drive.' },
    { name: 'JW Marriott Mumbai Juhu', rating: 4.8, price: 15800, desc: 'Beachfront luxury popular for celebrity sightings.' }
  ],
  'Dubai': [
    { name: 'Burj Al Arab Jumeirah', rating: 5.0, price: 85000, desc: 'Ultra-luxury sail-shaped 7-star landmark.' },
    { name: 'Atlantis The Royal', rating: 4.9, price: 42000, desc: 'Spectacular architectural marvel on the Palm.' },
    { name: 'Armani Hotel Dubai', rating: 4.7, price: 29000, desc: 'Minimalist designer stay inside Burj Khalifa.' }
  ]
};

const defaultHotels = [
  { name: 'SkyHorizon Grand Hotel', rating: 4.7, price: 8500, desc: 'Premium airport transit hotel with luxury spa.' },
  { name: 'The Ritz-Carlton', rating: 4.9, price: 22000, desc: 'World-class hospitality, fine dining, and comfort.' },
  { name: 'Hilton Premium Suites', rating: 4.6, price: 9500, desc: 'Spacious suites and executive club access.' }
];

export default function FlightDetails() {
  const navigate = useNavigate();
  const { selectedFlight, searchQuery } = useBooking();
  const travellers = searchQuery?.travellers || 1;

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Redirect to search if no flight selected (e.g. direct page refresh)
  if (!selectedFlight) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 animate-pulse">
          <IoAirplaneOutline className="w-8 h-8 -rotate-45" />
        </div>
        <h3 className="text-xl font-extrabold text-white">No Flight Selected</h3>
        <p className="text-slate-450 font-semibold text-xs mt-2 max-w-xs leading-relaxed">
          Please select a flight option from the flights list to configure ticketing details.
        </p>
        <button
          onClick={() => navigate('/flights')}
          className="mt-6 px-6 py-2.5 bg-gradient-to-r from-gold to-yellow-500 rounded-full text-navy-950 font-black text-xs uppercase tracking-wider cursor-pointer"
        >
          Browse Flights
        </button>
      </div>
    );
  }

  const {
    airline,
    airlineCode,
    flightNumber,
    aircraft: originalAircraft,
    source,
    sourceCode,
    destination,
    destinationCode,
    departureTime: originalDepartureTime,
    arrivalTime: originalArrivalTime,
    duration: originalDuration,
    stops: originalStops,
    numberOfStops,
    stopover,
    price,
    cabin: originalCabin,
    wifi,
    meal,
    baggage: originalBaggage,
    refundType: originalRefundType,
    terminal: originalTerminal,
    gate: originalGate
  } = selectedFlight;

  const stops = numberOfStops !== undefined ? numberOfStops : (originalStops || 0);
  
  const computedSource = source || 'Hyderabad';
  const computedDest = destination || 'Bangalore';
  const computedSourceCode = sourceCode || getAirportCode(computedSource);
  const computedDestCode = destinationCode || getAirportCode(computedDest);
  const airlineName = airline || 'SkyHorizon Airlines';
  const airlineCodeStr = airlineCode || 'SH';
  const flightNumStr = flightNumber || `SH-${(getSeed(computedSource + computedDest) % 900) + 100}`;

  const mock = generateMockData(flightNumStr, computedSource, computedDest);

  const departureTime = originalDepartureTime || mock.departureTime;
  const arrivalTime = originalArrivalTime || mock.arrivalTime;
  const duration = originalDuration || mock.duration;
  const aircraft = originalAircraft || mock.aircraft;
  const cabin = originalCabin || 'Economy';
  const terminal = originalTerminal || mock.terminal;
  const gate = originalGate || mock.gate;
  const baggage = originalBaggage || mock.baggage;
  const refundType = originalRefundType || 'Non-Refundable';

  const boardingTime = calculateBoardingTime(departureTime);

  // Pricing values
  const baseFare = price || ((getSeed(flightNumStr) % 10000) + 3500);
  const totalBase = baseFare * travellers;
  const taxes = Math.round(baseFare * 0.12);
  const totalTaxes = taxes * travellers;
  const convenienceFee = 350;
  const grandTotal = totalBase + totalTaxes + convenienceFee;

  const fleetType = aircraft.includes('Airbus') ? 'Airbus Fleet' : (aircraft.includes('Boeing') ? 'Boeing Fleet' : 'Modern Fleet');
  const aircraftDesc = getAircraftDescription(aircraft);

  // Retrieve destination specific hotels
  const hotelsList = mockHotels[computedDest] || defaultHotels;

  const handleProceedBook = () => {
    navigate('/passenger-details');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative w-full text-left">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-grow pt-24 pb-20 w-full relative">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* 1. BREADCRUMB */}
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 select-none">
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/flights')}>Flights</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="text-gold">Flight Details</span>
          </nav>

          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-8 select-none">
            Review Itinerary Details
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN DETAILS SECTION */}
            <div className="lg:col-span-8 flex flex-col gap-6 text-left w-full">
              
              {/* 2. FLIGHT SUMMARY CARD */}
              <Card variant="glass" className="p-6 md:p-8 border border-white/5 relative overflow-hidden">
                <div className="flex flex-col gap-6">
                  {/* Summary header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <AirlineLogo code={airlineCodeStr} className="w-10 h-10 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-extrabold text-base text-white tracking-wide">{airlineName}</span>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold text-slate-450">
                          <span className="bg-slate-800/80 border border-white/5 px-2 py-0.2 rounded uppercase">
                            {flightNumStr}
                          </span>
                          <span>·</span>
                          <span>{cabin} Class</span>
                        </div>
                      </div>
                    </div>
                    
                    <span className="text-[10px] text-emerald-450 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                      {refundType}
                    </span>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-semibold text-slate-400">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Boarding Time</span>
                      <span className="text-sm font-black text-white mt-1">{boardingTime}</span>
                      <span className="text-[10px] text-gold mt-1 font-semibold">45m before departure</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Equipment</span>
                      <span className="text-sm font-black text-white mt-1">{aircraft}</span>
                      <span className="text-[10px] text-slate-500 mt-1 font-semibold">{fleetType}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Airport Info</span>
                      <span className="text-sm font-black text-white mt-1">Terminal {terminal}</span>
                      <span className="text-[10px] text-slate-500 mt-1 font-semibold">Gate {gate}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Checked Baggage</span>
                      <span className="text-sm font-black text-white mt-1">{baggage} Included</span>
                      <span className="text-[10px] text-slate-500 mt-1 font-semibold">Max size 158cm</span>
                    </div>
                  </div>

                </div>
              </Card>

              {/* 3. LARGE FLIGHT TIMELINE */}
              <Card variant="glass" className="p-6 md:p-8 border border-white/5 select-none relative overflow-hidden">
                <div className="flex flex-col gap-6">
                  <span className="text-[10px] font-black text-gold uppercase tracking-widest">Flight Timeline</span>
                  
                  <div className="flex items-center justify-between gap-4 py-4">
                    {/* Departure info */}
                    <div className="flex flex-col text-left shrink-0">
                      <span className="text-3xl md:text-4xl font-black text-white tracking-tight">{departureTime}</span>
                      <span className="text-sm font-black text-gold mt-2 uppercase tracking-wider">{computedSourceCode}</span>
                      <span className="text-xs text-slate-400 font-bold mt-1 max-w-[120px] truncate" title={computedSource}>{computedSource}</span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-1">T{terminal} · Gate {gate}</span>
                    </div>

                    {/* Progress vector graphic */}
                    <div className="flex-grow flex flex-col items-center px-4 relative">
                      <span className="text-xs font-black text-slate-400 mb-2">{duration}</span>
                      
                      <div className="w-full flex items-center justify-between relative py-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-gold border-2 border-gold shadow-[0_0_10px_rgba(245,166,35,0.8)] z-10 shrink-0" />
                        
                        <div className="flex-grow h-[2px] bg-gradient-to-r from-gold/50 via-gold to-gold/50 relative mx-1">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 bg-navy-900 rounded-full border border-gold/40 shadow-lg">
                            <IoAirplaneOutline className="w-4 h-4 text-gold rotate-90" />
                          </div>
                        </div>
                        
                        <span className="w-3.5 h-3.5 rounded-full bg-gold border-2 border-gold shadow-[0_0_10px_rgba(245,166,35,0.8)] z-10 shrink-0" />
                      </div>

                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
                        {stops === 0 ? 'Non-stop Flight' : `${stops} Stop (${stopover})`}
                      </span>
                    </div>

                    {/* Arrival info */}
                    <div className="flex flex-col text-right shrink-0">
                      <span className="text-3xl md:text-4xl font-black text-white tracking-tight">{arrivalTime}</span>
                      <span className="text-sm font-black text-gold mt-2 uppercase tracking-wider">{computedDestCode}</span>
                      <span className="text-xs text-slate-400 font-bold mt-1 max-w-[120px] truncate" title={computedDest}>{computedDest}</span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-1">{computedDest} Int'l ({computedDestCode})</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 4. AIRCRAFT INFORMATION (Visual Cabin Layout) */}
              <Card variant="glass" className="p-6 md:p-8 border border-white/5 relative overflow-hidden text-left">
                <span className="text-[10px] font-black text-gold uppercase tracking-widest">Flight Deck & Cabin Configuration</span>
                <h3 className="text-lg font-black text-white mt-1 border-b border-white/5 pb-3 mb-6">{aircraft}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Left: Interactive/Visual representation details */}
                  <div className="flex flex-col gap-4 text-xs font-semibold text-slate-350">
                    <p className="leading-relaxed text-slate-400">
                      {aircraftDesc}
                    </p>
                    
                    <div className="flex flex-col gap-2.5 pt-2">
                      <div className="flex justify-between items-center bg-navy-950/40 p-2.5 rounded-xl border border-white/5">
                        <span className="text-slate-500">Business Class:</span>
                        <span className="text-white font-extrabold">1 - 2 - 1 Configuration (Flat Bed)</span>
                      </div>
                      <div className="flex justify-between items-center bg-navy-950/40 p-2.5 rounded-xl border border-white/5">
                        <span className="text-slate-500">Premium Economy:</span>
                        <span className="text-white font-extrabold">2 - 3 - 2 Configuration (Spacious)</span>
                      </div>
                      <div className="flex justify-between items-center bg-navy-950/40 p-2.5 rounded-xl border border-white/5">
                        <span className="text-slate-500">Economy Class:</span>
                        <span className="text-white font-extrabold">3 - 3 - 3 Configuration (Standard)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: SVG Silhouette of the aircraft layout */}
                  <div className="w-full h-44 bg-navy-950/50 rounded-2xl border border-white/5 flex items-center justify-center p-4">
                    <svg className="w-full h-full max-w-[280px] text-gold/25" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Plane outline shape */}
                      <path d="M5 30C5 25 15 10 50 10C85 10 95 25 95 30C95 35 85 50 50 50C15 50 5 35 5 30Z" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="50" cy="30" r="14" stroke="currentColor" strokeWidth="1" />
                      
                      {/* Symmetrical seat circles */}
                      <circle cx="25" cy="20" r="1.5" fill="#f5a623" />
                      <circle cx="25" cy="30" r="1.5" fill="#f5a623" />
                      <circle cx="25" cy="40" r="1.5" fill="#f5a623" />
                      <circle cx="38" cy="20" r="1.5" fill="#ffffff" />
                      <circle cx="38" cy="30" r="1.5" fill="#ffffff" />
                      <circle cx="38" cy="40" r="1.5" fill="#ffffff" />
                      <circle cx="62" cy="20" r="1.5" fill="#ffffff" />
                      <circle cx="62" cy="30" r="1.5" fill="#ffffff" />
                      <circle cx="62" cy="40" r="1.5" fill="#ffffff" />
                      <circle cx="75" cy="20" r="1.5" fill="#ffffff" />
                      <circle cx="75" cy="30" r="1.5" fill="#ffffff" />
                      <circle cx="75" cy="40" r="1.5" fill="#ffffff" />
                      <text x="50" y="33" fill="currentColor" fontSize="8" fontWeight="bold" textAnchor="middle">787 Cabin</text>
                    </svg>
                  </div>
                </div>
              </Card>

              {/* 5. INCLUDED SERVICES */}
              <div className="flex flex-col gap-4 text-left">
                <span className="text-[10px] font-black text-gold uppercase tracking-widest pl-2">Inflight Services Included</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Broadband Wi-Fi', desc: 'Complimentary high-speed streaming.', icon: <IoWifiOutline className="w-5 h-5" />, active: wifi },
                    { label: 'Hot Meals', desc: 'Vegetarian and non-vegetarian selections.', icon: <IoCafeOutline className="w-5 h-5" />, active: meal },
                    { label: 'HD Screens', desc: 'Over 2,000 hours of movies and audio.', icon: <IoFilmOutline className="w-5 h-5" />, active: true },
                    { label: 'USB Charging', desc: 'Universal plug in-seat chargers.', icon: <IoBatteryChargingOutline className="w-5 h-5" />, active: true },
                    { label: 'Universal Sockets', desc: '110V power outlets at every passenger seat.', icon: <IoBatteryChargingOutline className="w-5 h-5" />, active: true },
                    { label: 'Checked Baggage', desc: `${baggage} check-in allowance included.`, icon: <IoBriefcaseOutline className="w-5 h-5" />, active: true }
                  ].map((service, idx) => (
                    <Card key={idx} variant="glass" className="p-4 flex flex-col gap-2.5 border border-white/5 hover:border-gold/20 hover:shadow-lg transition-all text-left">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        service.active 
                          ? 'bg-gold/15 text-gold border-gold/20' 
                          : 'bg-slate-800/40 text-slate-500 border-slate-700/30'
                      }`}>
                        {service.icon}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-extrabold text-white leading-none">{service.label}</span>
                        <span className="text-[10px] text-slate-450 font-semibold leading-relaxed mt-1">{service.desc}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 6. FARE RULES */}
              <Card variant="glass" className="p-6 md:p-8 border border-white/5 relative overflow-hidden text-left">
                <span className="text-[10px] font-black text-gold uppercase tracking-widest">Itinerary Policies</span>
                <h3 className="text-lg font-black text-white mt-1 border-b border-white/5 pb-3 mb-6">Fare Rules & Penalties</h3>
                
                <div className="flex flex-col gap-4 text-xs font-semibold text-slate-350">
                  <div className="flex items-start gap-3">
                    <IoShieldCheckmarkOutline className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-white font-extrabold text-sm">Cancellation Penalty</span>
                      <span className="text-slate-400 text-[11px] mt-1">
                        Cancellations made 24 hours prior to departure incur a flat fee of ₹2,500. Within 24 hours of departure, tickets are non-refundable.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-white/5 pt-4">
                    <IoShieldCheckmarkOutline className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-white font-extrabold text-sm">Reschedule Policy</span>
                      <span className="text-slate-400 text-[11px] mt-1">
                        Changes to the flight itinerary are permitted up to 12 hours prior for a fee of ₹1,500 plus any applicable difference in fare.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-white/5 pt-4">
                    <IoShieldCheckmarkOutline className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-white font-extrabold text-sm">Refund Timeline</span>
                      <span className="text-slate-400 text-[11px] mt-1">
                        Refunds are processed back to the original method of payment within 7 business days from approval. Convenience fees are non-refundable.
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 9. RECOMMENDED HOTELS */}
              <div className="flex flex-col gap-4 text-left mt-2 select-none">
                <span className="text-[10px] font-black text-gold uppercase tracking-widest pl-2">Hotels in {computedDest}</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hotelsList.map((hotel, idx) => (
                    <Card key={idx} variant="glass" className="p-5 flex flex-col gap-3 border border-white/5 hover:border-gold/25 transition-all text-left">
                      <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold border border-gold/20 flex items-center justify-center">
                        <IoBedOutline className="w-5 h-5" />
                      </div>
                      
                      <div className="flex flex-col">
                        <h4 className="text-xs font-black text-white tracking-wide">{hotel.name}</h4>
                        <span className="text-[10px] text-slate-450 font-semibold leading-relaxed mt-1">
                          {hotel.desc}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rate</span>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-black text-gold">₹{hotel.price.toLocaleString('en-IN')}/night</span>
                          <span className="text-[8px] text-slate-400 font-semibold mt-0.5 flex items-center gap-0.5">
                            <IoStarOutline className="w-2.5 h-2.5 text-gold" />
                            <span>{hotel.rating} Rating</span>
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN STICKY PRICE SUMMARY */}
            <aside className="lg:col-span-4 h-fit sticky top-28 select-none">
              
              {/* 7. PRICE SUMMARY CARD */}
              <Card variant="glass" className="p-6 md:p-8 text-left border border-white/5 relative overflow-hidden flex flex-col gap-5 shadow-2xl">
                
                {/* Header Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/30 to-gold/30" />

                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <IoReceiptOutline className="w-4 h-4 text-gold animate-[pulse_2s_infinite]" />
                  <span className="font-black text-xs text-white uppercase tracking-widest">Fare Summary</span>
                </div>

                <div className="flex flex-col gap-3.5 text-xs font-semibold text-slate-400">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">Base Fare ({travellers}x)</span>
                    <span className="text-white font-extrabold">₹{totalBase.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">Taxes & Fees</span>
                    <span className="text-white font-extrabold">₹{totalTaxes.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-500">Convenience Fee</span>
                    <span className="text-white font-extrabold">₹{convenienceFee.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Grand total price */}
                  <div className="flex justify-between items-center border-t border-white/5 pt-4 text-sm font-black mt-2">
                    <span className="text-white uppercase tracking-wider text-xs">Total Amount</span>
                    <span className="text-gold text-lg tracking-tight">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* 8. CTA (Book Flight) */}
                <button
                  onClick={handleProceedBook}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 text-navy-950 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group cursor-pointer relative overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_0.8s_ease-in-out]" />
                  <span>Book Flight</span>
                  <IoChevronForwardOutline className="w-4 h-4" />
                </button>

              </Card>

            </aside>

          </div>
        </div>
      </div>

      {/* Booking confirmation modal receipt */}
      <AnimatePresence>
        {bookingConfirmed && receiptData && (
          <>
            {/* Dark backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-950/80 z-50 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-navy-950 border border-gold/30 rounded-3xl z-[60] p-6 shadow-2xl flex flex-col overflow-hidden text-center justify-center"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto mb-4 animate-[pulse_2s_infinite]">
                <IoCheckmarkCircleSharp className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black text-white tracking-tight">Booking Confirmed!</h3>
              <p className="text-xs font-semibold text-slate-400 mt-2 leading-relaxed">
                Your flight booking is successfully confirmed. Your e-ticket details have been issued and sent.
              </p>

              {/* Receipt Visual Ticket */}
              <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 my-6 text-left flex flex-col gap-3.5 relative overflow-hidden">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-navy-950 border-r border-slate-800" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-navy-950 border-l border-slate-800" />

                <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-b border-white/5 pb-2 uppercase tracking-widest">
                  <span>Booking ID</span>
                  <span className="text-white font-extrabold">{receiptData.bookingId}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase leading-none">From</span>
                    <h4 className="text-lg font-black text-white leading-none mt-1">{receiptData?.flight?.fromCode || computedSourceCode}</h4>
                    <span className="text-[10px] font-semibold text-slate-450 leading-none">{receiptData?.flight?.from || computedSource}</span>
                  </div>
                  <IoAirplaneOutline className="w-5 h-5 text-gold -rotate-45" />
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-bold uppercase leading-none">To</span>
                    <h4 className="text-lg font-black text-white leading-none mt-1">{receiptData?.flight?.toCode || computedDestCode}</h4>
                    <span className="text-[10px] font-semibold text-slate-455 leading-none">{receiptData?.flight?.to || computedDest}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-white/5 border-dashed">
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-widest">Seat Allocated</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{receiptData.seat}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest">Flight No</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{receiptData?.flight?.flightNumber || flightNumStr}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest">Gate</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">Term {terminal} · G {gate}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setBookingConfirmed(false);
                    navigate('/my-bookings');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-gold to-yellow-500 rounded-full text-navy-950 font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <IoReceiptOutline className="w-4 h-4 shrink-0" />
                  <span>Go to My Trips</span>
                </button>
                <button
                  onClick={() => {
                    setBookingConfirmed(false);
                    navigate('/');
                  }}
                  className="py-2.5 rounded-full text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider cursor-pointer"
                >
                  Return to Home
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
