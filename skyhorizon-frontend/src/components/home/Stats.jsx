import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  IoGlobeOutline, 
  IoTimeOutline, 
  IoAirplaneOutline 
} from 'react-icons/io5';
import PropTypes from 'prop-types';

function Counter({ value, duration = 1.5, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const target = parseFloat(value);
    const hasDecimal = value.toString().includes('.');
    
    let start = 0;
    const end = target;
    if (end === 0) return;

    const totalSteps = 65;
    const stepTime = (duration * 1000) / totalSteps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextCount = easeProgress * end;

      if (currentStep >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(hasDecimal ? parseFloat(nextCount.toFixed(1)) : Math.round(nextCount));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

Counter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  duration: PropTypes.number,
  suffix: PropTypes.string,
};

export default function Stats() {
  const statsData = [
    {
      id: 1,
      value: '62',
      suffix: '+',
      title: 'Destinations',
      subtitle: 'Across the globe',
      icon: <IoGlobeOutline className="w-5 h-5 text-white" />,
      iconBg: 'bg-blue-600 shadow-md shadow-blue-500/25',
    },
    {
      id: 2,
      value: '94',
      suffix: '%',
      title: 'On-time Arrivals',
      subtitle: 'Punctuality you can trust',
      icon: <IoTimeOutline className="w-5 h-5 text-white" />,
      iconBg: 'bg-emerald-600 shadow-md shadow-emerald-500/25',
    },
    {
      id: 3,
      value: '8.4',
      suffix: 'M+',
      title: 'Flyers per year',
      subtitle: 'Happy travellers',
      icon: <IoAirplaneOutline className="w-5 h-5 text-white rotate-45" />,
      iconBg: 'bg-purple-600 shadow-md shadow-purple-500/25',
    },
    {
      id: 4,
      value: '120',
      suffix: '+',
      title: 'Fleet Size',
      subtitle: 'Modern & efficient',
      icon: <IoAirplaneOutline className="w-5 h-5 text-white -rotate-45" />,
      iconBg: 'bg-orange-600 shadow-md shadow-orange-500/25',
    },
  ];

  return (
    <div className="bg-white py-6 relative z-20">
      <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-20">
        
        {/* Consolidated White Stats Strip Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-8 flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-0">
          
          {statsData.map((stat, idx) => (
            <div 
              key={stat.id}
              className="flex-1 flex items-center justify-start lg:justify-center gap-4 px-4 relative"
            >
              {/* Vertical divider lines between stats on desktop */}
              {idx > 0 && (
                <div className="hidden lg:block absolute left-0 top-1/6 bottom-1/6 w-[1.5px] bg-slate-200" />
              )}
              
              {/* Circular solid background icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                {stat.icon}
              </div>

              {/* Text info blocks */}
              <div className="flex flex-col text-left select-none">
                <span className="text-2xl font-black text-navy-950 leading-none tracking-tight">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-xs font-bold text-navy-950 mt-1 leading-none">
                  {stat.title}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold mt-1.5 leading-none">
                  {stat.subtitle}
                </span>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
