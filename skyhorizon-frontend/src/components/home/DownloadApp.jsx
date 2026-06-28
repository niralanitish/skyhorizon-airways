import { motion } from 'framer-motion';
import { 
  IoLogoApple, 
  IoLogoGooglePlaystore,
  IoAirplaneOutline,
  IoCalendarOutline,
  IoCloseOutline
} from 'react-icons/io5';
import wingViewImg from '../../assets/images/airplane_wing_view.png';

export default function DownloadApp() {
  return (
    <section className="py-16 bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Horizontal Strip Banner */}
        <div className="bg-[#031b3e] rounded-3xl border border-white/5 shadow-2xl p-8 md:px-10 md:py-8 flex flex-col xl:flex-row items-center justify-between gap-8 overflow-hidden relative">
          
          {/* Subtle background vector detail */}
          <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* LEFT SIDE: TEXT DETAILS & STORE BUTTONS */}
          <div className="flex flex-col items-start text-left z-10 xl:max-w-md">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Get the SkyHorizon app
            </h2>
            <p className="text-xs md:text-sm text-slate-350 font-medium mt-2 leading-relaxed">
              Exclusive app-only fares and faster rebooking
            </p>

            {/* Play store / App store buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {/* Google Play */}
              <motion.a 
                href="#google-play"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-black border border-slate-700 rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
              >
                <IoLogoGooglePlaystore className="w-5 h-5 text-white" />
                <div className="flex flex-col text-left">
                  <span className="text-[8px] text-slate-400 font-bold uppercase leading-none">GET IT ON</span>
                  <span className="text-xs font-bold text-white leading-none mt-1">Google Play</span>
                </div>
              </motion.a>

              {/* App Store */}
              <motion.a 
                href="#app-store"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-black border border-slate-700 rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
              >
                <IoLogoApple className="w-5 h-5 text-white" />
                <div className="flex flex-col text-left">
                  <span className="text-[8px] text-slate-400 font-bold uppercase leading-none">Download on the</span>
                  <span className="text-xs font-bold text-white leading-none mt-1">App Store</span>
                </div>
              </motion.a>
            </div>
          </div>

          {/* CENTER: MOBILE PHONE & AIRPLANE WINDOW MOCKUPS */}
          <div className="flex items-center justify-center gap-5 z-10 shrink-0 select-none">
            
            {/* Vector Styled Phone displaying SkyHorizon search app screen */}
            <div className="w-40 h-[220px] bg-slate-950 rounded-[28px] border-[5px] border-slate-700 shadow-2xl relative overflow-hidden flex flex-col p-2 text-left shrink-0">
              {/* Camera Notch */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-3 bg-slate-700 rounded-full flex items-center justify-center">
                <div className="w-4 h-0.5 bg-black rounded-full" />
              </div>

              {/* Mock App Header */}
              <div className="flex items-center justify-between mt-2.5 pb-1 border-b border-white/5">
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded bg-navy-900 border border-gold/40 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-2.5 h-2.5 fill-gold">
                      <path d="M 25 35 C 10 38, 5 50, 15 65 C 20 60, 22 50, 30 48 C 22 45, 23 38, 25 35 Z" />
                      <path d="M 75 35 C 90 38, 95 50, 85 65 C 80 60, 78 50, 70 48 C 78 45, 77 38, 75 35 Z" />
                      <rect x="38" y="25" width="6" height="50" rx="3" />
                      <rect x="56" y="25" width="6" height="50" rx="3" />
                      <rect x="42" y="47" width="16" height="6" rx="2" />
                    </svg>
                  </div>
                  <span className="text-[7px] font-black text-white leading-none">SkyHorizon</span>
                </div>
                <IoCloseOutline className="w-3 h-3 text-slate-500" />
              </div>

              {/* Mock Fields list */}
              <div className="flex flex-col gap-1.5 mt-3">
                {/* From */}
                <div className="bg-navy-900 border border-slate-800 rounded-lg p-1.5 flex items-center gap-2">
                  <IoAirplaneOutline className="w-3 h-3 text-slate-500 -rotate-45" />
                  <div className="flex flex-col leading-none">
                    <span className="text-[5px] font-bold text-slate-500 uppercase tracking-wide">From</span>
                    <span className="text-[8px] font-bold text-white mt-0.5">HYD Hyderabad</span>
                  </div>
                </div>
                {/* To */}
                <div className="bg-navy-900 border border-slate-800 rounded-lg p-1.5 flex items-center gap-2">
                  <IoAirplaneOutline className="w-3 h-3 text-slate-500 rotate-45" />
                  <div className="flex flex-col leading-none">
                    <span className="text-[5px] font-bold text-slate-500 uppercase tracking-wide">To</span>
                    <span className="text-[8px] font-bold text-white mt-0.5">GOI Goa</span>
                  </div>
                </div>
                {/* Depart */}
                <div className="bg-navy-900 border border-slate-800 rounded-lg p-1.5 flex items-center gap-2">
                  <IoCalendarOutline className="w-3 h-3 text-slate-500" />
                  <div className="flex flex-col leading-none">
                    <span className="text-[5px] font-bold text-slate-500 uppercase tracking-wide">Depart</span>
                    <span className="text-[8px] font-bold text-white mt-0.5">22 Jun, 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Airplane Window Frame containing Wing View generated image */}
            <div className="w-32 h-[200px] border-[8px] border-slate-700/80 rounded-[45px] shadow-2xl relative overflow-hidden shrink-0 bg-slate-900">
              <img 
                src={wingViewImg} 
                alt="Airplane Wing View" 
                className="w-full h-full object-cover"
              />
              {/* Highlight gleam overlay on window frame */}
              <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-[37px]" />
            </div>

          </div>

          {/* FAR RIGHT: QR CODE CARD */}
          <div className="flex items-center gap-4 z-10 bg-navy-950/20 p-4 border border-white/5 rounded-2xl shrink-0 select-none">
            {/* White QR Code box */}
            <div className="p-2 bg-white rounded-xl shadow-md shrink-0">
              <svg viewBox="0 0 100 100" className="w-14 h-14 fill-slate-900">
                <rect x="0" y="0" width="30" height="30" rx="3" />
                <rect x="5" y="5" width="20" height="20" fill="white" rx="1.5" />
                <rect x="10" y="10" width="10" height="10" rx="0.5" />

                <rect x="70" y="0" width="30" height="30" rx="3" />
                <rect x="75" y="5" width="20" height="20" fill="white" rx="1.5" />
                <rect x="80" y="10" width="10" height="10" rx="0.5" />

                <rect x="0" y="70" width="30" height="30" rx="3" />
                <rect x="5" y="75" width="20" height="20" fill="white" rx="1.5" />
                <rect x="10" y="80" width="10" height="10" rx="0.5" />

                <rect x="40" y="10" width="10" height="20" />
                <rect x="55" y="0" width="10" height="10" />
                <rect x="40" y="40" width="20" height="10" />
                <rect x="15" y="45" width="10" height="15" />
                <rect x="45" y="60" width="15" height="10" />
                <rect x="70" y="45" width="20" height="10" />
                <rect x="80" y="60" width="10" height="25" />
                <rect x="45" y="80" width="20" height="10" />
                <rect x="65" y="75" width="10" height="10" />
              </svg>
            </div>
            
            {/* QR Label */}
            <div className="flex flex-col text-left leading-tight font-extrabold text-white text-[11px] uppercase tracking-wider">
              <span>Scan to</span>
              <span className="text-gold">download</span>
              <span>the app</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
