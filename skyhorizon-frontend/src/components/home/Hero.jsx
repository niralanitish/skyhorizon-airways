import { motion } from 'framer-motion';
import { 
  IoRibbonOutline, 
  IoPricetagOutline, 
  IoLockClosedOutline 
} from 'react-icons/io5';
import FlightSearchCard from './FlightSearchCard';
import heroBg from '../../assets/images/hero_background.png';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' }
    },
  };

  const trustBadges = [
    { 
      icon: <IoRibbonOutline className="w-5 h-5 text-gold" />, 
      line1: 'Best prices', 
      line2: 'guaranteed' 
    },
    { 
      icon: <IoPricetagOutline className="w-5 h-5 text-gold" />, 
      line1: 'No hidden', 
      line2: 'fees' 
    },
    { 
      icon: <IoLockClosedOutline className="w-5 h-5 text-gold" />, 
      line1: 'Safe & secure', 
      line2: 'bookings' 
    },
  ];

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between overflow-visible bg-navy-950 pt-28 pb-16">
      
      {/* Background Image: Loaded from user-provided assets containing mountains, aircraft & trails */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroBg})` 
        }}
      />
      
      {/* Dark overlay removed as requested */}

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-6 w-full flex-grow flex flex-col justify-center z-30 relative">
        <div className="mb-12">
          
          {/* Full-Width text content with max-w-3xl constraint */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col text-left max-w-3xl"
          >
            {/* Small caps badge */}
            <motion.span 
              variants={itemVariants}
              className="text-[11px] font-extrabold text-gold tracking-[0.2em] uppercase mb-3"
            >
              OVER 60 DESTINATIONS · ON-TIME, EVERY TIME
            </motion.span>
            
            {/* Main Headings */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-[1.05]"
            >
              Fly beyond <br />
              <span className="text-gold font-black">
                the horizon
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-sm sm:text-base text-slate-200 font-medium max-w-xl mb-6 leading-relaxed"
            >
              Book flights at fares that make sense, with a booking flow that takes under a minute.
            </motion.p>

            {/* Stacked two-line Trust Badges in a Row */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-2"
            >
              {trustBadges.map((badge, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 select-none text-left"
                >
                  <div className="shrink-0">{badge.icon}</div>
                  <div className="flex flex-col text-[11px] leading-tight font-bold text-slate-350">
                    <span className="text-white">{badge.line1}</span>
                    <span className="text-slate-400 font-medium mt-0.5">{badge.line2}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Flight Search Widget */}
        <div className="w-full mt-4">
          <FlightSearchCard />
        </div>
      </div>
    </div>
  );
}
