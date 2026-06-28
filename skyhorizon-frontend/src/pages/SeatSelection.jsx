import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoAirplaneOutline, 
  IoChevronForwardOutline, 
  IoCheckmarkCircleSharp, 
  IoReceiptOutline, 
  IoCloseOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/home/Footer';
import Card from '../components/common/Card';
import { AirlineLogo } from '../components/flights/FlightCard';

// -------------------------------------------------------------
// Realistic Seat Map Seed Data for Boeing 787 Dreamliner
// -------------------------------------------------------------
const generateSeats = () => {
  const seats = [];
  
  // 1. Business Class (Rows 1 - 5)
  // 1-2-1 layout: A - D F - K
  const businessLetters = ['A', 'D', 'F', 'K'];
  for (let r = 1; r <= 5; r++) {
    businessLetters.forEach(l => {
      // Seed pre-occupied seats (roughly 40% occupied)
      const isOccupied = Math.random() < 0.4;
      seats.push({
        id: `${r}${l}`,
        row: r,
        letter: l,
        class: 'Business',
        type: r === 1 ? 'extra-legroom' : 'standard',
        price: r === 1 ? 4500 : 3500,
        status: isOccupied ? 'occupied' : 'available'
      });
    });
  }

  // 2. Premium Economy Class (Rows 6 - 10)
  // 2-3-2 layout: A C - D E F - H K
  const premiumLetters = ['A', 'C', 'D', 'E', 'F', 'H', 'K'];
  for (let r = 6; r <= 10; r++) {
    premiumLetters.forEach(l => {
      const isOccupied = Math.random() < 0.45;
      seats.push({
        id: `${r}${l}`,
        row: r,
        letter: l,
        class: 'Premium',
        type: r === 6 ? 'extra-legroom' : 'standard',
        price: r === 6 ? 2200 : 1500,
        status: isOccupied ? 'occupied' : 'available'
      });
    });
  }

  // 3. Economy Class (Rows 11 - 30)
  // 3-3-3 layout: A B C - D E F - G H K
  const economyLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K'];
  for (let r = 11; r <= 30; r++) {
    const isExitRow = r === 11 || r === 20;
    economyLetters.forEach(l => {
      const isOccupied = Math.random() < 0.5;
      let seatType = 'standard';
      let seatPrice = 0;

      if (isExitRow) {
        seatType = 'emergency-exit';
        seatPrice = 1200;
      } else if (l === 'A' || l === 'K') {
        // Window seats have premium price
        seatType = 'standard';
        seatPrice = 250;
      } else if (r === 12) {
        seatType = 'extra-legroom';
        seatPrice = 800;
      }

      seats.push({
        id: `${r}${l}`,
        row: r,
        letter: l,
        class: 'Economy',
        type: seatType,
        price: seatPrice,
        status: isOccupied ? 'occupied' : 'available'
      });
    });
  }

  return seats;
};

export default function SeatSelection() {
  const navigate = useNavigate();
  const { selectedFlight, searchQuery, passengerDetails, setPassengerDetails } = useBooking();

  const [seatMap, setSeatMap] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize Seat Map
  useEffect(() => {
    setSeatMap(generateSeats());
  }, []);

  // Fallback if no flight is selected
  if (!selectedFlight) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 animate-pulse">
          <IoAirplaneOutline className="w-8 h-8 -rotate-45" />
        </div>
        <h3 className="text-xl font-extrabold text-white">No Flight Selected</h3>
        <p className="text-slate-450 font-semibold text-xs mt-2 max-w-xs leading-relaxed">
          Please select a flight option from the flights search page to choose your seat.
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

  // Fallback if passenger details are missing
  const passengerName = passengerDetails 
    ? `${passengerDetails.title} ${passengerDetails.firstName} ${passengerDetails.lastName}`
    : 'Lead Passenger';

  // Base values from previous step
  const travellers = searchQuery?.travellers || 1;
  const cabinClass = searchQuery?.flightClass || 'Economy';
  const flightBaseFare = passengerDetails?.pricing?.subtotal || (selectedFlight.price * travellers);
  const taxesAndFees = passengerDetails?.pricing?.taxes || (750 * travellers);
  const convenienceFee = passengerDetails?.pricing?.convenienceFee || 350;
  const baggageCharge = passengerDetails?.pricing?.baggagePrice || 0;
  const insurancePrice = passengerDetails?.pricing?.insurancePrice || 0;

  // Selected Seat details
  const seatCharge = selectedSeat ? selectedSeat.price : 0;
  const grandTotal = flightBaseFare + taxesAndFees + convenienceFee + baggageCharge + insurancePrice + seatCharge;

  const handleSeatClick = (seat) => {
    if (seat.status === 'occupied') {
      setErrorMessage('This seat is already occupied. Please select an available seat.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    setSelectedSeat(seat);
    setErrorMessage('');
  };

  const handleProceedConfirm = () => {
    if (!selectedSeat) {
      setErrorMessage('Please select a seat before continuing.');
      setTimeout(() => setErrorMessage(''), 4000);
      return;
    }

    setPassengerDetails({
      ...passengerDetails,
      selectedSeat: {
        id: selectedSeat.id,
        class: selectedSeat.class,
        type: selectedSeat.type,
        price: selectedSeat.price
      }
    });
    navigate('/booking-review');
  };

  // Group seats by Class for clean rendering
  const businessSeats = seatMap.filter(s => s.class === 'Business');
  const premiumSeats = seatMap.filter(s => s.class === 'Premium');
  const economySeats = seatMap.filter(s => s.class === 'Economy');

  // Helper to get rows list inside seat array
  const getRows = (seatsList) => {
    return [...new Set(seatsList.map(s => s.row))].sort((a, b) => a - b);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative w-full text-left font-sans text-slate-350">
      <Navbar />

      {/* Background Gradient Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-navy-900/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="flex-grow pt-24 pb-20 w-full relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 select-none">
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/flights')}>Flights</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/flight-details')}>Details</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/passenger-details')}>Passengers</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="text-gold">Seat Selection</span>
          </nav>

          {/* Stepper Progress Indicator */}
          <div className="mb-10 w-full select-none">
            <div className="grid grid-cols-6 gap-2 text-center text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-white/5 pb-4">
              <span className="text-emerald-450 flex items-center justify-center gap-1">Search <IoCheckmarkCircleSharp className="w-3 h-3" /></span>
              <span className="text-emerald-450 flex items-center justify-center gap-1">Flight <IoCheckmarkCircleSharp className="w-3 h-3" /></span>
              <span className="text-emerald-450 flex items-center justify-center gap-1">Passenger <IoCheckmarkCircleSharp className="w-3 h-3" /></span>
              <span className="text-gold border-b-2 border-gold pb-4 -mb-4 flex items-center justify-center gap-1">Seat Selection ●</span>
              <span>Review</span>
              <span>Success</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE: AIRCRAFT SEAT MAP & LEGEND */}
            <div className="lg:col-span-8 flex flex-col gap-6 text-left w-full">
              
              {/* Error messages overlay */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-2xl flex items-center gap-2.5 text-xs font-semibold leading-relaxed"
                  >
                    <IoAlertCircleOutline className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Legends Section */}
              <Card variant="glass" className="p-4 md:p-6 border border-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1 block mb-4">Seat Status Legends</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 justify-between items-center text-xs font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700 block shrink-0" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-gold border border-gold block shrink-0 shadow-[0_0_8px_rgba(245,166,35,0.4)]" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-slate-900 border border-slate-900 block shrink-0 relative opacity-45 cursor-not-allowed">
                      <span className="absolute inset-0.5 border-t border-r border-slate-650 rotate-45" />
                    </span>
                    <span className="text-slate-500">Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-cyan-950 border border-cyan-500 block shrink-0" />
                    <span>Extra Legroom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-indigo-950 border border-indigo-500 block shrink-0" />
                    <span>Exit Row</span>
                  </div>
                </div>
              </Card>

              {/* Seat Selection Fuse-map Container */}
              <Card variant="glass" className="p-4 md:p-10 border border-white/5 relative overflow-hidden flex flex-col items-center">
                
                {/* Airplane Cockpit / Fuselage Design Frame */}
                <div className="w-full max-w-xl bg-navy-950/40 border border-white/5 rounded-[120px_120px_40px_40px] pt-16 pb-12 px-4 md:px-8 relative shadow-2xl">
                  
                  {/* Cockpit Area at the top */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-10 border-b border-x border-slate-800 rounded-b-3xl bg-navy-900 flex items-center justify-center shadow-inner">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Boeing 787 Cockpit</span>
                  </div>

                  {/* Flight Direction Indicator */}
                  <div className="flex flex-col items-center gap-1.5 text-slate-600 mb-10 select-none">
                    <IoAirplaneOutline className="w-6 h-6 rotate-180" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Front of Aircraft</span>
                  </div>

                  {/* 1. BUSINESS CLASS SECTION */}
                  <div className="mb-8 relative">
                    <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gold/10" />
                    <div className="text-center mb-6">
                      <span className="text-[9px] font-black text-gold uppercase tracking-widest bg-gold/5 border border-gold/15 px-3 py-1 rounded-full">
                        Business Class
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {getRows(businessSeats).map(rowNum => {
                        const rowSeats = businessSeats.filter(s => s.row === rowNum);
                        return (
                          <div key={rowNum} className="flex justify-between items-center gap-2">
                            {/* Seat A */}
                            <SeatButton seat={rowSeats.find(s => s.letter === 'A')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                            
                            <div className="w-8 shrink-0 text-center" /> {/* Left Aisle */}

                            {/* Seat D */}
                            <SeatButton seat={rowSeats.find(s => s.letter === 'D')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                            {/* Seat F */}
                            <SeatButton seat={rowSeats.find(s => s.letter === 'F')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                            
                            <div className="w-8 shrink-0 text-center" /> {/* Right Aisle */}

                            {/* Seat K */}
                            <SeatButton seat={rowSeats.find(s => s.letter === 'K')} selectedSeat={selectedSeat} onClick={handleSeatClick} />

                            <span className="w-6 text-center text-[9px] font-black text-slate-600">{rowNum}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Galley Partition */}
                  <div className="border-y border-white/5 py-3 my-6 text-center select-none bg-navy-900/30">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-550">Galley & Restrooms</span>
                  </div>

                  {/* 2. PREMIUM ECONOMY CLASS SECTION */}
                  <div className="mb-8 relative">
                    <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-cyan-500/10" />
                    <div className="text-center mb-6">
                      <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/5 border border-cyan-500/15 px-3 py-1 rounded-full">
                        Premium Economy
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {getRows(premiumSeats).map(rowNum => {
                        const rowSeats = premiumSeats.filter(s => s.row === rowNum);
                        return (
                          <div key={rowNum} className="flex justify-between items-center gap-1.5">
                            {/* Seat A, C */}
                            <div className="flex gap-1.5">
                              <SeatButton seat={rowSeats.find(s => s.letter === 'A')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                              <SeatButton seat={rowSeats.find(s => s.letter === 'C')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                            </div>

                            <div className="w-6 shrink-0 text-center" /> {/* Left Aisle */}

                            {/* Seat D, E, F */}
                            <div className="flex gap-1.5">
                              <SeatButton seat={rowSeats.find(s => s.letter === 'D')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                              <SeatButton seat={rowSeats.find(s => s.letter === 'E')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                              <SeatButton seat={rowSeats.find(s => s.letter === 'F')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                            </div>

                            <div className="w-6 shrink-0 text-center" /> {/* Right Aisle */}

                            {/* Seat H, K */}
                            <div className="flex gap-1.5">
                              <SeatButton seat={rowSeats.find(s => s.letter === 'H')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                              <SeatButton seat={rowSeats.find(s => s.letter === 'K')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                            </div>

                            <span className="w-6 text-center text-[9px] font-black text-slate-600">{rowNum}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* EMERGENCY EXIT ROW INDICATOR */}
                  <div className="flex items-center justify-between border-y border-dashed border-red-500/15 py-2 my-6 text-[8px] font-black uppercase tracking-widest text-red-400 select-none px-2 bg-red-500/5">
                    <span>⟨ Emergency Exit Door</span>
                    <span>Row 11 Exit Row</span>
                    <span>Emergency Exit Door ⟩</span>
                  </div>

                  {/* 3. ECONOMY CLASS SECTION */}
                  <div className="relative">
                    <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-indigo-500/10" />
                    <div className="text-center mb-6">
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/5 border border-indigo-500/15 px-3 py-1 rounded-full">
                        Economy Class
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {getRows(economySeats).map(rowNum => {
                        const rowSeats = economySeats.filter(s => s.row === rowNum);
                        const isExitRow = rowNum === 20;

                        return (
                          <div key={rowNum} className="flex flex-col gap-2">
                            {isExitRow && (
                              <div className="flex items-center justify-between border-y border-dashed border-red-500/15 py-1.5 my-2 text-[8px] font-black uppercase tracking-widest text-red-400 select-none px-2 bg-red-500/5">
                                <span>⟨ Exit</span>
                                <span>Row 20 Exit Row</span>
                                <span>Exit ⟩</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center gap-1 md:gap-1.5">
                              {/* Seat A, B, C */}
                              <div className="flex gap-1">
                                <SeatButton seat={rowSeats.find(s => s.letter === 'A')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                                <SeatButton seat={rowSeats.find(s => s.letter === 'B')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                                <SeatButton seat={rowSeats.find(s => s.letter === 'C')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                              </div>

                              <div className="w-5 shrink-0 text-center" /> {/* Left Aisle */}

                              {/* Seat D, E, F */}
                              <div className="flex gap-1">
                                <SeatButton seat={rowSeats.find(s => s.letter === 'D')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                                <SeatButton seat={rowSeats.find(s => s.letter === 'E')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                                <SeatButton seat={rowSeats.find(s => s.letter === 'F')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                              </div>

                              <div className="w-5 shrink-0 text-center" /> {/* Right Aisle */}

                              {/* Seat G, H, K */}
                              <div className="flex gap-1">
                                <SeatButton seat={rowSeats.find(s => s.letter === 'G')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                                <SeatButton seat={rowSeats.find(s => s.letter === 'H')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                                <SeatButton seat={rowSeats.find(s => s.letter === 'K')} selectedSeat={selectedSeat} onClick={handleSeatClick} />
                              </div>

                              <span className="w-6 text-center text-[9px] font-black text-slate-600">{rowNum}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </Card>

              {/* Passenger Selected Seat Detail Card */}
              <Card variant="glass" className="p-6 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold border border-gold/20 flex items-center justify-center shrink-0">
                    <IoPersonOutline className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Passenger Card</span>
                    <h4 className="text-sm font-extrabold text-white mt-0.5">{passengerName}</h4>
                    <span className="text-[10px] text-slate-400 mt-1 font-semibold">{cabinClass} Cabin Class</span>
                  </div>
                </div>

                <div className="flex gap-8 items-center border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <div className="flex flex-col text-left md:text-right">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Allocated Seat</span>
                    <span className="text-base font-black text-gold mt-0.5">
                      {selectedSeat ? `${selectedSeat.id} (${selectedSeat.class})` : 'Not Selected'}
                    </span>
                  </div>
                  <div className="flex flex-col text-left md:text-right border-l border-white/10 pl-6">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Seat Surcharge</span>
                    <span className="text-base font-black text-white mt-0.5">
                      {seatCharge > 0 ? `+₹${seatCharge.toLocaleString('en-IN')}` : '₹0'}
                    </span>
                  </div>
                </div>
              </Card>

            </div>

            {/* RIGHT SIDE: BOOKING SUMMARY STICKY */}
            <aside className="lg:col-span-4 h-fit sticky top-28 select-none">
              <Card variant="glass" className="p-6 md:p-8 text-left border border-white/5 relative overflow-hidden flex flex-col gap-5 shadow-2xl">
                
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/30 to-gold/30" />

                {/* Summary Header */}
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <IoReceiptOutline className="w-4 h-4 text-gold animate-[pulse_2s_infinite]" />
                  <span className="font-black text-xs text-white uppercase tracking-widest">Booking Summary</span>
                </div>

                {/* Flight Route details */}
                <div className="flex items-center gap-3 bg-navy-950/40 border border-white/5 p-3 rounded-xl">
                  <div className="shrink-0">
                    <AirlineLogo code={selectedFlight.airlineCode} className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 font-black text-[11px] text-white uppercase leading-none">
                      <span>{selectedFlight.sourceCode}</span>
                      <IoAirplaneOutline className="w-3 text-gold rotate-95" />
                      <span>{selectedFlight.destinationCode}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500 mt-1 leading-none">
                      <span>{selectedFlight.flightNumber}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-slate-600" />
                      <span>{selectedFlight.departureTime}</span>
                    </div>
                  </div>
                </div>

                {/* Traveler / Cabin count */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-350">
                  <div className="flex items-center gap-2">
                    <IoPersonOutline className="w-4 h-4 text-gold shrink-0" />
                    <span>{passengerName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{cabinClass}</span>
                </div>

                {/* Price Breakdown */}
                <div className="flex flex-col gap-3 font-semibold text-xs text-slate-400 pt-3 border-t border-white/5">
                  <div className="flex justify-between">
                    <span>Flight Fare ({travellers}x)</span>
                    <span className="text-white">₹{flightBaseFare.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span className="text-white">₹{taxesAndFees.toLocaleString('en-IN')}</span>
                  </div>

                  {baggageCharge > 0 && (
                    <div className="flex justify-between">
                      <span>Extra Checked Baggage</span>
                      <span className="text-white">₹{baggageCharge.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {insurancePrice > 0 && (
                    <div className="flex justify-between">
                      <span>Travel Protection</span>
                      <span className="text-white">₹{insurancePrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Seat Option ({selectedSeat ? selectedSeat.id : 'None'})</span>
                    <span className="text-white">₹{seatCharge.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span className="text-white">₹{convenienceFee.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Grand total */}
                  <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2 text-sm font-black">
                    <span className="text-white uppercase tracking-wider text-xs">Total Amount</span>
                    <span className="text-gold text-lg tracking-tight">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Continue button */}
                <button
                  onClick={handleProceedConfirm}
                  disabled={loading}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 text-navy-950 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group cursor-pointer relative overflow-hidden disabled:opacity-50"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_0.8s_ease-in-out]" />
                  {loading ? (
                    <span className="w-5 h-5 rounded-full border-2 border-navy-950 border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>Confirm Booking</span>
                      <IoChevronForwardOutline className="w-4 h-4 animate-[pulse_1.5s_infinite]" />
                    </>
                  )}
                </button>

              </Card>
            </aside>

          </div>
        </div>
      </div>

      {/* Confirmation Success Modal dialog overlay */}
      <AnimatePresence>
        {bookingConfirmed && receiptData && (
          <>
            {/* Backdrop */}
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
                Thank you for choosing SkyHorizon Airways. Your boarding pass seat is allocated and tickets issued successfully.
              </p>

              {/* Receipt Ticket Details */}
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
                    <h4 className="text-lg font-black text-white leading-none mt-1">{selectedFlight.sourceCode}</h4>
                    <span className="text-[10px] font-semibold text-slate-450 leading-none">{selectedFlight.source}</span>
                  </div>
                  <IoAirplaneOutline className="w-5 h-5 text-gold -rotate-45" />
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-bold uppercase leading-none">To</span>
                    <h4 className="text-lg font-black text-white leading-none mt-1">{selectedFlight.destinationCode}</h4>
                    <span className="text-[10px] font-semibold text-slate-455 leading-none">{selectedFlight.destination}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-white/5 border-dashed">
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-widest">Seat Number</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{receiptData.seat}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest">Flight Number</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{receiptData.flight.flightNumber}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest">Gate</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">Term {selectedFlight.terminal} · G {selectedFlight.gate}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
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

// -------------------------------------------------------------
// Helper Seat Button Sub-component
// -------------------------------------------------------------
function SeatButton({ seat, selectedSeat, onClick }) {
  if (!seat) return <div className="w-7 h-7" />; // Empty placeholder for aisle spaces or misaligned layouts

  const isSelected = selectedSeat?.id === seat.id;
  const isOccupied = seat.status === 'occupied';

  // Compute style classes based on seat type and state
  let stateClasses = 'bg-slate-800 border-slate-700 hover:border-gold/50 text-slate-350 cursor-pointer';

  if (isOccupied) {
    stateClasses = 'bg-slate-900 border-slate-900 opacity-45 cursor-not-allowed';
  } else if (isSelected) {
    stateClasses = 'bg-gold border-gold text-navy-950 shadow-[0_0_12px_rgba(245,166,35,0.7)] cursor-pointer';
  } else if (seat.type === 'emergency-exit') {
    stateClasses = 'bg-indigo-950 border-indigo-650 hover:border-gold/50 text-indigo-200 cursor-pointer';
  } else if (seat.type === 'extra-legroom') {
    stateClasses = 'bg-cyan-950 border-cyan-650 hover:border-gold/50 text-cyan-200 cursor-pointer';
  }

  return (
    <button
      onClick={() => onClick(seat)}
      disabled={isOccupied}
      className={`w-7 h-7 md:w-8 md:h-8 rounded-lg border text-[8px] md:text-[9px] font-black transition-all flex items-center justify-center relative select-none shrink-0 ${stateClasses}`}
      title={`Seat ${seat.id} (${seat.class} - ${seat.type}) - ${isOccupied ? 'Occupied' : `+₹${seat.price}`}`}
    >
      {isOccupied ? (
        <span className="absolute inset-1 border-t border-r border-slate-650 rotate-45" />
      ) : (
        seat.id
      )}
    </button>
  );
}
