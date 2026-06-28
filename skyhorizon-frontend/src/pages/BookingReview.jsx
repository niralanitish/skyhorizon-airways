import { useState } from 'react';
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoAirplaneOutline, 
  IoChevronForwardOutline, 
  IoCheckmarkCircleSharp, 
  IoReceiptOutline, 
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoShieldCheckmarkOutline,
  IoSparklesOutline,
  IoTicketOutline,
  IoCreateOutline,
  IoWarningOutline
} from 'react-icons/io5';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/home/Footer';
import Card from '../components/common/Card';
import { AirlineLogo } from '../components/flights/FlightCard';

export default function BookingReview() {
  const navigate = useNavigate();
  const { selectedFlight, fetchBookings, searchQuery, passengerDetails } = useBooking();

  const [agreed, setAgreed] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fallback if no flight is selected
  if (!selectedFlight) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 animate-pulse">
          <IoAirplaneOutline className="w-8 h-8 -rotate-45" />
        </div>
        <h3 className="text-xl font-extrabold text-white">No Itinerary Selected</h3>
        <p className="text-slate-450 font-semibold text-xs mt-2 max-w-xs leading-relaxed">
          Please select a flight to review booking details.
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
  if (!passengerDetails) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 animate-pulse">
          <IoPersonOutline className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-white">Passenger Details Missing</h3>
        <p className="text-slate-450 font-semibold text-xs mt-2 max-w-xs leading-relaxed">
          Please enter passenger details before proceeding to booking review.
        </p>
        <button
          onClick={() => navigate('/passenger-details')}
          className="mt-6 px-6 py-2.5 bg-gradient-to-r from-gold to-yellow-500 rounded-full text-navy-950 font-black text-xs uppercase tracking-wider cursor-pointer"
        >
          Enter Passenger Info
        </button>
      </div>
    );
  }

  // Extract Details from context state
  const travellers = searchQuery?.travellers || 1;
  const cabinClass = searchQuery?.flightClass || 'Economy';
  const selectedSeat = passengerDetails.selectedSeat || { id: 'Not Selected', price: 0, class: cabinClass, type: 'standard' };

  // Price calculations
  const baseFare = passengerDetails.pricing.subtotal;
  const seatCharges = selectedSeat.price;
  const baggageCharges = passengerDetails.pricing.baggagePrice;
  const insuranceCharges = passengerDetails.pricing.insurancePrice;
  const taxes = passengerDetails.pricing.taxes;
  const convenienceFee = passengerDetails.pricing.convenienceFee;

  const totalBeforeDiscount = baseFare + seatCharges + baggageCharges + insuranceCharges + taxes + convenienceFee;
  const grandTotal = totalBeforeDiscount - discount;

  // Formatting name
  const fullName = `${passengerDetails.title} ${passengerDetails.firstName} ${passengerDetails.lastName}`;

  // Promo code execution logic
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const trimmedCode = promoCode.trim().toUpperCase();
    if (!trimmedCode) {
      setPromoError('Please enter a promotional code.');
      return;
    }

    if (trimmedCode === 'SKYGOLD') {
      const discountVal = Math.round(baseFare * 0.1);
      setDiscount(discountVal);
      setAppliedCode(trimmedCode);
      setPromoSuccess(`Promo code Applied! 10% Discount of ₹${discountVal.toLocaleString('en-IN')} on flight fare.`);
    } else if (trimmedCode === 'HORIZON15') {
      const discountVal = Math.round(baseFare * 0.15);
      setDiscount(discountVal);
      setAppliedCode(trimmedCode);
      setPromoSuccess(`Promo code Applied! 15% Discount of ₹${discountVal.toLocaleString('en-IN')} on flight fare.`);
    } else {
      setPromoError('Invalid promo code. Try SKYGOLD or HORIZON15.');
    }
  };

  const calculateAge = (dob) => {

  const birthDate = new Date(dob);

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const month =
    today.getMonth() - birthDate.getMonth();

  if (
    month < 0 ||
    (month === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};
  const handleConfirmSubmit = async () => {
    if (!agreed) {
      setErrorMessage("You must agree to the booking terms.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("skyhorizon_token");
      const request = {
        flightId: selectedFlight.id,
        passengerName: `${passengerDetails.firstName} ${passengerDetails.lastName}`,
        passengerEmail: passengerDetails.email,
        passengerPhone: passengerDetails.phone,
        passengerAge: calculateAge(passengerDetails.dob),
        passengerGender: passengerDetails.gender,
        travelClass: searchQuery.flightClass,
        numberOfSeats: searchQuery.travellers
      };

      const response = await api.post("/bookings", request, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReceiptData(response.data);
      setBookingConfirmed(true);
      
      // Refresh the context bookings so the My Trips page updates immediately
      await fetchBookings();
    } catch (error) {
      console.error("Booking error:", error);
      const message = error.response?.data?.message || error.response?.data || error.message || "Booking Failed";
      setErrorMessage(typeof message === "string" ? message : "Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative w-full text-left font-sans text-slate-350">
      <Navbar />

      {/* Main Container */}
      <div className="flex-grow pt-24 pb-20 w-full relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 select-none font-sans">
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/flights')}>Flights</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/flight-details')}>Details</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/passenger-details')}>Passengers</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/seat-selection')}>Seats</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="text-gold">Review Booking</span>
          </nav>

          {/* Stepper progress */}
          <div className="mb-10 w-full select-none">
            <div className="grid grid-cols-6 gap-2 text-center text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-white/5 pb-4">
              <span className="text-emerald-450 flex items-center justify-center gap-1">Search <IoCheckmarkCircleSharp className="w-3 h-3" /></span>
              <span className="text-emerald-450 flex items-center justify-center gap-1">Flight <IoCheckmarkCircleSharp className="w-3 h-3" /></span>
              <span className="text-emerald-450 flex items-center justify-center gap-1">Passenger <IoCheckmarkCircleSharp className="w-3 h-3" /></span>
              <span className="text-emerald-450 flex items-center justify-center gap-1">Seats <IoCheckmarkCircleSharp className="w-3 h-3" /></span>
              <span className="text-gold border-b-2 border-gold pb-4 -mb-4 flex items-center justify-center gap-1">Review Details ●</span>
              <span>Success</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE DETAILS SUMMARY */}
            <div className="lg:col-span-8 flex flex-col gap-6 text-left w-full">
              
              {/* Error messages banner */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl flex items-center gap-2.5 text-xs font-semibold leading-relaxed"
                  >
                    <IoWarningOutline className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 1. FLIGHT SUMMARY CARD */}
              <Card variant="glass" className="p-6 md:p-8 border border-white/5 relative overflow-hidden flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <IoAirplaneOutline className="w-5 h-5 text-gold shrink-0" />
                    <span className="font-black text-xs text-white uppercase tracking-widest">Flight Details</span>
                  </div>
                  <button
                    onClick={() => navigate('/flights')}
                    className="text-[9px] font-black text-gold hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <IoCreateOutline className="w-3.5 h-3.5" />
                    <span>Change Flight</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AirlineLogo code={selectedFlight.airlineCode} className="w-10 h-10 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-white">{selectedFlight.airline}</span>
                      <span className="text-[10px] text-slate-450 font-bold mt-0.5 uppercase tracking-wide">
                        {selectedFlight.flightNumber} · {selectedFlight.aircraft}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] text-emerald-450 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                    {selectedFlight.refundType}
                  </span>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-3 items-center py-4 text-center select-none">
                  <div className="flex flex-col items-start text-left">
                    <span className="text-2xl font-black text-white">{selectedFlight.departureTime}</span>
                    <span className="text-[10px] font-bold text-gold uppercase mt-1">{selectedFlight.sourceCode}</span>
                    <span className="text-slate-450 text-[10px] mt-0.5 truncate max-w-[130px] font-semibold">{selectedFlight.source}</span>
                    <span className="text-slate-500 text-[8px] mt-0.5 font-semibold">Terminal {selectedFlight.terminal}</span>
                  </div>
                  <div className="flex flex-col items-center relative">
                    <span className="text-[9px] text-slate-450 font-bold mb-1">{selectedFlight.duration}</span>
                    <div className="w-full flex items-center justify-between relative py-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                      <div className="flex-grow h-[1px] bg-gradient-to-r from-gold/40 via-gold to-gold/40 relative mx-1">
                        <IoAirplaneOutline className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold rotate-90 w-3.5 h-3.5" />
                      </div>
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                    </div>
                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-1">
                      {selectedFlight.stops === 0 ? 'Non-Stop' : `${selectedFlight.stops} Stop${selectedFlight.stops > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-2xl font-black text-white">{selectedFlight.arrivalTime}</span>
                    <span className="text-[10px] font-bold text-gold uppercase mt-1">{selectedFlight.destinationCode}</span>
                    <span className="text-slate-450 text-[10px] mt-0.5 truncate max-w-[130px] font-semibold">{selectedFlight.destination}</span>
                    <span className="text-slate-500 text-[8px] mt-0.5 font-semibold">Terminal 1</span>
                  </div>
                </div>
              </Card>

              {/* 2. PASSENGER SUMMARY */}
              <Card variant="glass" className="p-6 md:p-8 border border-white/5 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <IoPersonOutline className="w-5 h-5 text-gold shrink-0" />
                    <span className="font-black text-xs text-white uppercase tracking-widest">Passenger Information</span>
                  </div>
                  <button
                    onClick={() => navigate('/passenger-details')}
                    className="text-[9px] font-black text-gold hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <IoCreateOutline className="w-3.5 h-3.5" />
                    <span>Change Details</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold text-slate-400">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Passenger Name</span>
                    <span className="text-white font-extrabold text-sm mt-1">{fullName}</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-semibold">{passengerDetails.gender} · {passengerDetails.dob}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Nationality & Passports</span>
                    <span className="text-white font-extrabold mt-1">{passengerDetails.nationality}</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-semibold">
                      {passengerDetails.passportNum ? `Passport: ${passengerDetails.passportNum}` : 'No Passport Provided (Domestic)'}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Contact Details</span>
                    <span className="text-white font-extrabold mt-1">{passengerDetails.email}</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-semibold">{passengerDetails.countryCode} {passengerDetails.phone}</span>
                  </div>
                </div>
              </Card>

              {/* 3. SEAT SUMMARY */}
              <Card variant="glass" className="p-6 md:p-8 border border-white/5 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <IoShieldCheckmarkOutline className="w-5 h-5 text-gold shrink-0" />
                    <span className="font-black text-xs text-white uppercase tracking-widest">Seat Allocation</span>
                  </div>
                  <button
                    onClick={() => navigate('/seat-selection')}
                    className="text-[9px] font-black text-gold hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <IoCreateOutline className="w-3.5 h-3.5" />
                    <span>Change Seat</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-8 text-xs font-semibold text-slate-400">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Seat Number</span>
                    <span className="text-lg font-black text-gold mt-1">{selectedSeat.id}</span>
                  </div>

                  <div className="flex flex-col text-left border-l border-white/10 pl-8">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Seat Class</span>
                    <span className="text-white font-extrabold mt-1">{selectedSeat.class} Cabin</span>
                  </div>

                  <div className="flex flex-col text-left border-l border-white/10 pl-8">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Features</span>
                    <span className="text-white font-extrabold mt-1">
                      {selectedSeat.type === 'extra-legroom' ? 'Extra Legroom Bulkhead Seat' : selectedSeat.type === 'emergency-exit' ? 'Emergency Exit Row Space' : 'Standard Seat'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* 4. ADDITIONAL SERVICES */}
              <Card variant="glass" className="p-6 md:p-8 border border-white/5 flex flex-col gap-5">
                <div className="flex items-center border-b border-white/5 pb-3">
                  <IoSparklesOutline className="w-5 h-5 text-gold shrink-0" />
                  <span className="font-black text-xs text-white uppercase tracking-widest pl-2">Special Requests & Inflight Add-ons</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-400">
                  <div className="bg-navy-950/50 p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Meal Selection</span>
                    <span className="text-white font-extrabold">{passengerDetails.mealPref === 'Veg' ? 'Vegetarian Menu' : passengerDetails.mealPref === 'Non-Veg' ? 'Non-Veg Hot Menu' : passengerDetails.mealPref === 'Vegan' ? 'Plant-based Menu' : passengerDetails.mealPref === 'Halal' ? 'Halal Meal' : 'No Pref'}</span>
                  </div>

                  <div className="bg-navy-950/50 p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Wheelchair Service</span>
                    <span className="text-white font-extrabold">{passengerDetails.wheelchair === 'Yes' ? 'Requested' : 'Not Requested'}</span>
                  </div>

                  <div className="bg-navy-950/50 p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Extra Checked Bags</span>
                    <span className="text-white font-extrabold">{passengerDetails.extraBaggage === 'None' ? 'Standard Allowance' : passengerDetails.extraBaggage}</span>
                  </div>

                  <div className="bg-navy-950/50 p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Travel Protection</span>
                    <span className="text-white font-extrabold">{passengerDetails.addInsurance ? 'Comprehensive Covered' : 'Not Secured'}</span>
                  </div>
                </div>
              </Card>

              {/* 5. FARE BREAKDOWN & PROMO CODE */}
              <Card variant="glass" className="p-6 md:p-8 border border-white/5 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <IoReceiptOutline className="w-5 h-5 text-gold shrink-0" />
                    <span className="font-black text-xs text-white uppercase tracking-widest">Fare Structure</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  {/* Costs list */}
                  <div className="flex flex-col gap-3.5 text-xs font-semibold text-slate-400 w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-500">Base Flight Fare</span>
                      <span className="text-white font-extrabold">₹{baseFare.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-500">Seat Option Charges</span>
                      <span className="text-white font-extrabold">₹{seatCharges.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-500">Baggage Charges</span>
                      <span className="text-white font-extrabold">₹{baggageCharges.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-500">Insurance Cover charges</span>
                      <span className="text-white font-extrabold">₹{insuranceCharges.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-500">Taxes & Airport Surcharges</span>
                      <span className="text-white font-extrabold">₹{taxes.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center border-b border-white/5 pb-3.5">
                      <span className="font-medium text-slate-500">Ticketing Convenience Fee</span>
                      <span className="text-white font-extrabold">₹{convenienceFee.toLocaleString('en-IN')}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between items-center text-emerald-400 font-extrabold">
                        <span>Discount Coupon ({appliedCode})</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm font-black pt-2">
                      <span className="text-white uppercase tracking-wider text-xs">Total Amount</span>
                      <span className="text-gold text-lg tracking-tight">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Promo Input Card */}
                  <div className="bg-navy-950/40 border border-white/5 p-5 rounded-2xl flex flex-col gap-4">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                      <IoTicketOutline className="w-4 h-4 text-gold" />
                      <span>Promotional Offer Code</span>
                    </span>

                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input 
                        type="text" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="SKYGOLD / HORIZON15"
                        className="bg-navy-950 border border-slate-800 text-white font-bold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 flex-grow uppercase"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-gold text-navy-950 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all hover:brightness-110 active:scale-95"
                      >
                        Apply
                      </button>
                    </form>

                    <AnimatePresence>
                      {promoError && (
                        <motion.span 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[10px] text-amber-500 font-bold uppercase tracking-wider"
                        >
                          {promoError}
                        </motion.span>
                      )}
                      {promoSuccess && (
                        <motion.span 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[10px] text-emerald-450 font-bold uppercase tracking-wider leading-relaxed"
                        >
                          {promoSuccess}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <div className="text-[9px] text-slate-500 font-medium leading-relaxed border-t border-white/5 pt-3">
                      Use code <span className="text-gold font-bold">SKYGOLD</span> for 10% discount or <span className="text-gold font-bold">HORIZON15</span> for 15% discount on base flight fares.
                    </div>
                  </div>

                </div>
              </Card>

              {/* 6. TERMS AND CONDITIONS CHECKBOX */}
              <div className="flex items-start gap-3 pl-2 py-2">
                <input 
                  type="checkbox" 
                  id="agree-terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-navy-950 text-gold focus:ring-0 cursor-pointer mt-0.5 shrink-0"
                />
                <label htmlFor="agree-terms" className="text-xs font-semibold leading-relaxed text-slate-400 select-none cursor-pointer">
                  I agree to the booking terms, baggage policies, and cancellation conditions. I confirm that all names match passenger identification exactly.
                </label>
              </div>

            </div>

            {/* RIGHT SIDE STICKY BOOKING SUMMARY CARD */}
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
                    <span>{fullName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{cabinClass}</span>
                </div>

                {/* Costs list */}
                <div className="flex flex-col gap-3 font-semibold text-xs text-slate-400 pt-3 border-t border-white/5">
                  <div className="flex justify-between">
                    <span>Flight Fare</span>
                    <span className="text-white">₹{baseFare.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Seat Option Charge ({selectedSeat.id})</span>
                    <span className="text-white">₹{seatCharges.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes & Airport Surcharges</span>
                    <span className="text-white">₹{taxes.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-450 font-extrabold">
                      <span>Discount Coupon</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Grand total */}
                  <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2 text-sm font-black">
                    <span className="text-white uppercase tracking-wider text-xs">Grand Total</span>
                    <span className="text-gold text-lg tracking-tight">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Continue button */}
                <button
                  onClick={handleConfirmSubmit}
                  disabled={loading}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 text-navy-950 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group cursor-pointer relative overflow-hidden disabled:opacity-50"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_0.8s_ease-in-out]" />
                  {loading ? (
                    <span className="w-5 h-5 rounded-full border-2 border-navy-950 border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>Continue to Payment</span>
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
                  <span className="text-white font-extrabold">{receiptData.bookingNumber}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase leading-none">From</span>
                    <h4 className="text-lg font-black text-white leading-none mt-1">{selectedFlight.sourceCode || (selectedFlight.source ? selectedFlight.source.substring(0, 3).toUpperCase() : '—')}</h4>
                    <span className="text-[10px] font-semibold text-slate-455 leading-none">{selectedFlight.source}</span>
                  </div>
                  <IoAirplaneOutline className="w-5 h-5 text-gold -rotate-45" />
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-bold uppercase leading-none">To</span>
                    <h4 className="text-lg font-black text-white leading-none mt-1">{selectedFlight.destinationCode || (selectedFlight.destination ? selectedFlight.destination.substring(0, 3).toUpperCase() : '—')}</h4>
                    <span className="text-[10px] font-semibold text-slate-455 leading-none">{selectedFlight.destination}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-white/5 border-dashed">
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-bold text-slate-550 uppercase tracking-widest">Seat Number</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{receiptData.seat || selectedSeat.id || '—'}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest">Flight Number</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">{receiptData.flight?.flightNumber || selectedFlight.flightNumber}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest">Gate</span>
                    <span className="text-xs font-extrabold text-white mt-0.5">Term {selectedFlight.terminal || '—'} · G {selectedFlight.gate || '—'}</span>
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
