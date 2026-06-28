import { 
  IoAirplaneOutline, 
  IoPersonOutline, 
  IoReceiptOutline, 
  IoChevronForwardOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoShieldCheckmarkOutline,
  IoRibbonOutline,
  IoGiftOutline
} from 'react-icons/io5';
import { AirlineLogo } from './FlightCard';

export default function FareSummary({ 
  selectedFlight, 
  searchQuery, 
  onContinue 
}) {
  const travelers = searchQuery.travellers || 1;
  const cabinClass = searchQuery.flightClass || 'Economy';

  if (!selectedFlight) {
    return (
      <div className="w-full bg-navy-900 border border-white/5 rounded-[24px] overflow-hidden shadow-xl select-none backdrop-blur-md flex flex-col text-left">
        {/* Header Accent */}
        <div className="bg-gradient-to-r from-gold/30 via-yellow-600/30 to-gold/30 h-1" />

        <div className="p-6 flex flex-col gap-6">
          
          {/* Title */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <IoReceiptOutline className="w-4 h-4 text-gold animate-[pulse_2s_infinite]" />
            <span className="font-black text-xs text-white uppercase tracking-widest">Booking Status</span>
          </div>

          {/* Ticket Process Checklists */}
          <div className="flex flex-col gap-3 bg-navy-950/40 border border-white/5 p-4 rounded-2xl text-xs font-semibold">
            <div className="flex items-center gap-2.5 text-emerald-450">
              <IoCheckmarkCircleOutline className="w-4.5 h-4.5 shrink-0" />
              <span>1. Enter Details & Search</span>
            </div>
            <div className="flex items-center gap-2.5 text-gold">
              <span className="w-4 h-4 rounded-full border border-gold flex items-center justify-center text-[9px] font-black shrink-0">2</span>
              <span>Select Outbound Flight</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500">
              <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-black shrink-0">3</span>
              <span>Passenger Information</span>
            </div>
          </div>

          {/* SkyHorizon Privilege Club / Loyalty Banner */}
          <div className="bg-gradient-to-br from-navy-950/80 via-navy-900 to-navy-950/80 border border-gold/15 p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
              <IoAirplaneOutline className="w-24 h-24 text-gold rotate-45" />
            </div>
            
            <div className="flex items-center gap-2">
              <IoGiftOutline className="w-4.5 h-4.5 text-gold shrink-0" />
              <span className="font-extrabold text-[10px] text-white uppercase tracking-widest">SkyHorizon Privilege Club</span>
            </div>
            
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Log in or join today to earn up to <span className="text-gold font-bold">1,850 SkyMiles</span> on this trip and enjoy zero convenience fees.
            </p>
          </div>

          {/* Brand trust icons */}
          <div className="flex flex-col gap-2.5 text-[10px] text-slate-400 font-semibold mt-1">
            <div className="flex items-center gap-2">
              <IoRibbonOutline className="w-4 h-4 text-gold shrink-0" />
              <span>Best Rate Guarantee & Verified Fares</span>
            </div>
            <div className="flex items-center gap-2">
              <IoShieldCheckmarkOutline className="w-4 h-4 text-gold shrink-0" />
              <span>Secure 256-bit Encrypted Transaction</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Calculate breakdown if a flight is selected
  const basePrice = selectedFlight.price;
  const rawSubtotal = basePrice * travelers;
  const taxes = 750 * travelers; 
  const serviceFee = 250 * travelers; 
  const total = rawSubtotal + taxes + serviceFee;

  return (
    <div className="w-full bg-navy-900 border border-gold/15 rounded-[24px] overflow-hidden shadow-2xl sticky top-28 select-none backdrop-blur-md flex flex-col text-left">
      {/* Header Accent */}
      <div className="bg-gradient-to-r from-gold/30 via-yellow-600/30 to-gold/30 h-1" />

      <div className="p-6 flex flex-col gap-5">
        
        {/* Title */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <IoReceiptOutline className="w-4 h-4 text-gold" />
            <span className="font-black text-xs text-white uppercase tracking-widest">Fare Summary</span>
          </div>
          {/* Active status indicator */}
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded text-[9px] font-black uppercase tracking-wider animate-[pulse_3s_infinite]">
            Selected
          </span>
        </div>

        {/* Selected Flight Summary Card */}
        <div className="flex items-center gap-3 bg-navy-950/40 border border-white/5 p-3.5 rounded-2xl">
          <div className="shrink-0">
            <AirlineLogo code={selectedFlight.airlineCode} className="w-9 h-9" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 font-black text-xs text-white uppercase leading-none">
              <span>{selectedFlight.sourceCode}</span>
              <IoAirplaneOutline className="w-3.5 h-3.5 text-gold rotate-95" />
              <span>{selectedFlight.destinationCode}</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 mt-1.5 leading-none">
              <span>{selectedFlight.flightNumber}</span>
              <span className="w-0.8 h-0.8 rounded-full bg-slate-600" />
              <span>{selectedFlight.departureTime}</span>
            </div>
          </div>
        </div>

        {/* Passengers description */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-350">
          <IoPersonOutline className="w-4 h-4 text-gold shrink-0" />
          <span>{travelers} Passenger{travelers > 1 ? 's' : ''} ({cabinClass})</span>
        </div>

        {/* Fare Rates lists */}
        <div className="flex flex-col gap-3.5 border-t border-white/5 pt-4 text-xs font-semibold text-slate-450">
          
          <div className="flex justify-between items-center">
            <span>Base Fare ({travelers}x)</span>
            <span className="text-white">₹{rawSubtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Taxes & Airport Fees</span>
            <span className="text-white">₹{taxes.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Online Service Fee</span>
            <span className="text-white">₹{serviceFee.toLocaleString('en-IN')}</span>
          </div>

          {/* Seat left status */}
          {selectedFlight.seatsLeft <= 3 && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-red-950/40 border border-red-900/30 text-red-400 text-[10px] font-bold">
              <IoAlertCircleOutline className="w-4 h-4 shrink-0" />
              <span>Fares rising! Only {selectedFlight.seatsLeft} seats left at this price.</span>
            </div>
          )}

          {/* Grand total */}
          <div className="flex justify-between items-center border-t border-white/5 pt-4 text-sm font-black">
            <span className="text-white uppercase tracking-wider text-xs">Total Amount</span>
            <span className="text-gold text-lg tracking-tight">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onContinue}
          className="w-full mt-2 py-3.5 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 text-navy-950 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group cursor-pointer relative overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_0.8s_ease-in-out]" />
          <span>Continue Booking</span>
          <IoChevronForwardOutline className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
