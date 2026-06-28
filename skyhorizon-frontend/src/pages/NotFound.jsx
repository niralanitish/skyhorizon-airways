import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IoAirplaneOutline, IoHomeOutline } from 'react-icons/io5';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative grids */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="glass" className="p-8 border border-white/5 shadow-2xl text-center flex flex-col items-center">
          
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 relative">
            <IoAirplaneOutline className="w-10 h-10 -rotate-45" />
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-gold/40 animate-ping opacity-25" />
          </div>

          <h1 className="text-6xl font-black text-white leading-none">404</h1>
          <h3 className="text-xl font-extrabold text-white mt-3">Route Off Course</h3>
          <p className="text-slate-400 font-semibold text-xs mt-2 max-w-xs leading-relaxed">
            The page destination you're attempting to reach is currently unlisted. Let's return you back to the main coordinates.
          </p>

          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="mt-8 text-xs uppercase tracking-wider font-bold flex items-center gap-2"
          >
            <IoHomeOutline className="w-4 h-4" />
            <span>Return to Home</span>
          </Button>

        </Card>
      </motion.div>
    </div>
  );
}
