import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoAirplaneOutline, 
  IoChevronForwardOutline,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoBriefcaseOutline,
  IoShieldCheckmarkOutline,
  IoCheckmarkCircleSharp,
  IoReceiptOutline,
  IoSparklesOutline,
  IoCloseOutline
} from 'react-icons/io5';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/home/Footer';
import Card from '../components/common/Card';
import { AirlineLogo } from '../components/flights/FlightCard';

export default function PassengerDetails() {
  const navigate = useNavigate();
  const { selectedFlight, searchQuery, setPassengerDetails } = useBooking();

  const travellers = searchQuery?.travellers || 1;
  const cabinClass = searchQuery?.flightClass || 'Economy';

  // Form State
  const [title, setTitle] = useState('Mr');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [nationality, setNationality] = useState('Indian');
  const [passportNum, setPassportNum] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const [mealPref, setMealPref] = useState('None');
  const [wheelchair, setWheelchair] = useState('No');
  const [extraBaggage, setExtraBaggage] = useState('None');
  const [seatPref, setSeatPref] = useState('None');
  
  const [addInsurance, setAddInsurance] = useState(false);

  // Errors state
  const [errors, setErrors] = useState({});

  // Confirm Modal state
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Fallback if no flight is selected
  if (!selectedFlight) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 animate-pulse">
          <IoAirplaneOutline className="w-8 h-8 -rotate-45" />
        </div>
        <h3 className="text-xl font-extrabold text-white">No Flight Selected</h3>
        <p className="text-slate-450 font-semibold text-xs mt-2 max-w-xs leading-relaxed">
          Please select a flight option from the flights search page to configure passenger details.
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

  // Calculate pricing breakdown
  const baseFare = selectedFlight.price;
  const subtotal = baseFare * travellers;
  const taxes = 750 * travellers;
  const insurancePrice = addInsurance ? 399 * travellers : 0;
  const convenienceFee = 350;
  
  // Baggage charge
  let baggagePrice = 0;
  if (extraBaggage === '+5kg') baggagePrice = 750 * travellers;
  if (extraBaggage === '+10kg') baggagePrice = 1400 * travellers;
  if (extraBaggage === '+20kg') baggagePrice = 2500 * travellers;

  const grandTotal = subtotal + taxes + insurancePrice + convenienceFee + baggagePrice;

  // Validation handler
  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!dob) newErrors.dob = 'Date of birth is required';
    if (!nationality.trim()) newErrors.nationality = 'Nationality is required';
    
    // Contact Info Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required';
    if (!emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Emergency phone is required';
    } else if (!phoneRegex.test(emergencyPhone.trim())) {
      newErrors.emergencyPhone = 'Enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setPassengerDetails({
        title,
        firstName,
        lastName,
        dob,
        gender,
        nationality,
        passportNum,
        passportExpiry,
        email,
        phone,
        countryCode,
        emergencyName,
        emergencyPhone,
        mealPref,
        wheelchair,
        extraBaggage,
        seatPref,
        addInsurance,
        pricing: {
          baseFare,
          subtotal,
          taxes,
          insurancePrice,
          baggagePrice,
          convenienceFee,
          grandTotal
        }
      });
      navigate('/seat-selection');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative w-full text-left">
      <Navbar />

      {/* Main Container */}
      <div className="flex-grow pt-24 pb-20 w-full relative">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 select-none">
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/flights')}>Flights</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="hover:text-gold cursor-pointer transition-colors" onClick={() => navigate('/flight-details')}>Details</span>
            <IoChevronForwardOutline className="w-3 h-3 text-slate-600" />
            <span className="text-gold">Passenger Details</span>
          </nav>

          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-8 select-none">
            Passenger Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: PASSENGER INFORMATION FORMS */}
            <div className="lg:col-span-8 flex flex-col gap-6 text-left w-full">
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 w-full">
                
                {/* 1. Passenger Information form card */}
                <Card variant="glass" className="p-6 md:p-8 border border-white/5 relative overflow-hidden flex flex-col gap-6">
                  <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                    <IoPersonOutline className="w-5 h-5 text-gold shrink-0" />
                    <span className="font-black text-xs text-white uppercase tracking-widest">Adult Passenger 1</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                      <select 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-navy-950 border border-slate-800 text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 cursor-pointer"
                      >
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Ms">Ms.</option>
                        <option value="Miss">Miss.</option>
                        <option value="Dr">Dr.</option>
                      </select>
                    </div>

                    {/* First Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className={`bg-navy-950 border text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 ${
                          errors.firstName ? 'border-gold/50' : 'border-slate-800'
                        }`}
                      />
                      {errors.firstName && <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{errors.firstName}</span>}
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className={`bg-navy-950 border text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 ${
                          errors.lastName ? 'border-gold/50' : 'border-slate-800'
                        }`}
                      />
                      {errors.lastName && <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* DOB */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                      <input 
                        type="date" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className={`bg-navy-950 border text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 ${
                          errors.dob ? 'border-gold/50' : 'border-slate-800'
                        }`}
                      />
                      {errors.dob && <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{errors.dob}</span>}
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                      <select 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)}
                        className="bg-navy-950 border border-slate-800 text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Nationality */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationality</label>
                      <input 
                        type="text" 
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="Indian"
                        className={`bg-navy-950 border text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 ${
                          errors.nationality ? 'border-gold/50' : 'border-slate-800'
                        }`}
                      />
                      {errors.nationality && <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{errors.nationality}</span>}
                    </div>
                  </div>

                  {/* Passport Details (Optional) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Passport Number (Optional)</label>
                      <input 
                        type="text" 
                        value={passportNum}
                        onChange={(e) => setPassportNum(e.target.value)}
                        placeholder="Z9999999"
                        className="bg-navy-950 border border-slate-800 text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-550 uppercase tracking-widest">Passport Expiry (Optional)</label>
                      <input 
                        type="date" 
                        value={passportExpiry}
                        onChange={(e) => setPassportExpiry(e.target.value)}
                        className="bg-navy-950 border border-slate-800 text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>

                </Card>

                {/* 2. Contact Information */}
                <Card variant="glass" className="p-6 md:p-8 border border-white/5 flex flex-col gap-6">
                  <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                    <IoMailOutline className="w-5 h-5 text-gold shrink-0" />
                    <span className="font-black text-xs text-white uppercase tracking-widest">Contact Information</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Country Code */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Country Code</label>
                      <select 
                        value={countryCode} 
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-navy-950 border border-slate-800 text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 cursor-pointer"
                      >
                        <option value="+91">India (+91)</option>
                        <option value="+1">US (+1)</option>
                        <option value="+44">UK (+44)</option>
                        <option value="+971">UAE (+971)</option>
                        <option value="+65">Singapore (+65)</option>
                      </select>
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <div className="relative">
                        <IoCallOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className={`bg-navy-950 border text-white font-semibold text-xs rounded-xl p-3 pl-10 w-full focus:outline-none focus:border-gold/50 ${
                            errors.phone ? 'border-gold/50' : 'border-slate-800'
                          }`}
                        />
                      </div>
                      {errors.phone && <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{errors.phone}</span>}
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                      <div className="relative">
                        <IoMailOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@mail.com"
                          className={`bg-navy-950 border text-white font-semibold text-xs rounded-xl p-3 pl-10 w-full focus:outline-none focus:border-gold/50 ${
                            errors.email ? 'border-gold/50' : 'border-slate-800'
                          }`}
                        />
                      </div>
                      {errors.email && <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{errors.email}</span>}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact Name</label>
                      <input 
                        type="text" 
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="Jane Doe"
                        className={`bg-navy-950 border text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 ${
                          errors.emergencyName ? 'border-gold/50' : 'border-slate-800'
                        }`}
                      />
                      {errors.emergencyName && <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{errors.emergencyName}</span>}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Phone Number</label>
                      <input 
                        type="tel" 
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="9876543211"
                        className={`bg-navy-950 border text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 ${
                          errors.emergencyPhone ? 'border-gold/50' : 'border-slate-800'
                        }`}
                      />
                      {errors.emergencyPhone && <span className="text-[10px] text-gold font-bold uppercase tracking-wider">{errors.emergencyPhone}</span>}
                    </div>
                  </div>

                </Card>

                {/* 3. Special Requests */}
                <Card variant="glass" className="p-6 md:p-8 border border-white/5 flex flex-col gap-6">
                  <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                    <IoSparklesOutline className="w-5 h-5 text-gold shrink-0" />
                    <span className="font-black text-xs text-white uppercase tracking-widest">Special Requests & Services</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Inflight Meal */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inflight Meal</label>
                      <select 
                        value={mealPref} 
                        onChange={(e) => setMealPref(e.target.value)}
                        className="bg-navy-950 border border-slate-800 text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 cursor-pointer"
                      >
                        <option value="None">No Meal Preference</option>
                        <option value="Veg">Vegetarian Hot Meal</option>
                        <option value="Non-Veg">Non-Vegetarian Hot Meal</option>
                        <option value="Vegan">Vegan/Plant-Based Meal</option>
                        <option value="Halal">Halal Certified Menu</option>
                      </select>
                    </div>

                    {/* Wheelchair Assistance */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wheelchair</label>
                      <select 
                        value={wheelchair} 
                        onChange={(e) => setWheelchair(e.target.value)}
                        className="bg-navy-950 border border-slate-800 text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 cursor-pointer"
                      >
                        <option value="No">Not Required</option>
                        <option value="Yes">Required (Ramp/Aisle)</option>
                      </select>
                    </div>

                    {/* Extra Checked Baggage */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extra Baggage</label>
                      <select 
                        value={extraBaggage} 
                        onChange={(e) => setExtraBaggage(e.target.value)}
                        className="bg-navy-950 border border-slate-800 text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 cursor-pointer"
                      >
                        <option value="None">No Extra Bags</option>
                        <option value="+5kg">Add +5kg (+₹750)</option>
                        <option value="+10kg">Add +10kg (+₹1,400)</option>
                        <option value="+20kg">Add +20kg (+₹2,500)</option>
                      </select>
                    </div>

                    {/* Seat Preference */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seat Pref</label>
                      <select 
                        value={seatPref} 
                        onChange={(e) => setSeatPref(e.target.value)}
                        className="bg-navy-950 border border-slate-800 text-white font-semibold text-xs rounded-xl p-3 focus:outline-none focus:border-gold/50 cursor-pointer"
                      >
                        <option value="None">No Seat Preference</option>
                        <option value="Window">Window Seat</option>
                        <option value="Aisle">Aisle Seat</option>
                        <option value="Center">Center Seat</option>
                      </select>
                    </div>
                  </div>

                </Card>

                {/* 4. Travel Insurance (Optional) */}
                <Card variant="glass" className="p-6 md:p-8 border border-gold/15 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Decorative airplane logo */}
                  <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
                    <IoAirplaneOutline className="w-32 h-32 text-gold rotate-45" />
                  </div>

                  <div className="flex flex-col gap-2 text-left md:max-w-xl">
                    <div className="flex items-center gap-2">
                      <IoShieldCheckmarkOutline className="w-5 h-5 text-gold shrink-0 animate-pulse" />
                      <span className="font-black text-xs text-white uppercase tracking-widest">Secure Your Journey</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                      Protect your trip with comprehensive coverage including trip cancellation, flight delay refunds, checked baggage loss, and accidental medical expenses for just <span className="text-gold font-bold">₹399/traveller</span>.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[9px] text-slate-500 font-black uppercase">Cover charge</span>
                      <span className="text-base font-black text-gold">₹{(399 * travellers).toLocaleString('en-IN')}</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setAddInsurance(!addInsurance)}
                      className={`px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                        addInsurance 
                          ? 'bg-gold text-navy-950 border border-gold' 
                          : 'bg-transparent border border-slate-750 text-slate-350 hover:border-gold hover:text-white'
                      }`}
                    >
                      {addInsurance ? 'Remove' : 'Add Protection'}
                    </button>
                  </div>

                </Card>

              </form>
            </div>

            {/* RIGHT COLUMN sticky summary */}
            <aside className="lg:col-span-4 h-fit sticky top-28 select-none">
              
              <Card variant="glass" className="p-6 md:p-8 text-left border border-white/5 relative overflow-hidden flex flex-col gap-5 shadow-2xl">
                
                {/* Header Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/30 to-gold/30" />

                {/* Title */}
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
                    <span>{travellers} Passenger{travellers > 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{cabinClass}</span>
                </div>

                {/* Costs list */}
                <div className="flex flex-col gap-3 font-semibold text-xs text-slate-400 pt-3 border-t border-white/5">
                  
                  <div className="flex justify-between">
                    <span>Outbound Base Fare</span>
                    <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span className="text-white">₹{taxes.toLocaleString('en-IN')}</span>
                  </div>

                  {addInsurance && (
                    <div className="flex justify-between">
                      <span>Travel Protection</span>
                      <span className="text-white">₹{insurancePrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {baggagePrice > 0 && (
                    <div className="flex justify-between">
                      <span>Extra Checked Baggage</span>
                      <span className="text-white">₹{baggagePrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Convenience Charge</span>
                    <span className="text-white">₹{convenienceFee.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Grand total */}
                  <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2 text-sm font-black">
                    <span className="text-white uppercase tracking-wider text-xs">Grand Total</span>
                    <span className="text-gold text-lg tracking-tight">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>

                </div>

                {/* Continue button */}
                <button
                  onClick={handleFormSubmit}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 text-navy-950 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group cursor-pointer relative overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_0.8s_ease-in-out]" />
                  <span>Select Seats</span>
                  <IoChevronForwardOutline className="w-4 h-4 animate-[pulse_1.5s_infinite]" />
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
