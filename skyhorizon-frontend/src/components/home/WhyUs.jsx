import { 
  IoTimeOutline, 
  IoShieldCheckmarkOutline, 
  IoBedOutline, // wait, let's look at the seat icon, seat icon is comfort/seat. We can import IoSeatOutline or IoHeartOutline or IoBedOutline. Let's look at what we used, let's use IoBedOutline or IoRibbonOutline. Let's check react-icons. IoAirplaneOutline, IoRibbonOutline, etc.
  IoHeadsetOutline, 
  IoRibbonOutline, 
  IoShieldOutline
} from 'react-icons/io5';
import { MdChair } from 'react-icons/md'; // We can use MdChair for seats! It is a clear seat icon.
import SectionTitle from '../common/SectionTitle';

export default function WhyUs() {

  const features = [
    {
      icon: <IoTimeOutline className="w-5 h-5 text-white" />,
      iconBg: 'bg-blue-600 shadow-md shadow-blue-500/25',
      title: 'Book in under 60 seconds',
      description: 'Quick, simple and hassle-free booking'
    },
    {
      icon: <IoShieldCheckmarkOutline className="w-5 h-5 text-white" />,
      iconBg: 'bg-emerald-600 shadow-md shadow-emerald-500/25',
      title: 'No hidden fees at checkout',
      description: 'What you see is what you pay'
    },
    {
      icon: <MdChair className="w-5 h-5 text-white" />,
      iconBg: 'bg-indigo-600 shadow-md shadow-indigo-500/25',
      title: 'Comfort meets convenience',
      description: 'Spacious seats and great legroom'
    },
    {
      icon: <IoHeadsetOutline className="w-5 h-5 text-white" />,
      iconBg: 'bg-orange-600 shadow-md shadow-orange-500/25',
      title: '24/7 customer support',
      description: 'We\'re here for you, anytime'
    },
    {
      icon: <IoRibbonOutline className="w-5 h-5 text-white" />,
      iconBg: 'bg-rose-600 shadow-md shadow-rose-500/25',
      title: 'Trusted by millions',
      description: 'Real humans, real fast'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section title */}
        <div className="flex flex-col text-left mb-12">
          <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Why fly SkyHorizon?
          </h2>
        </div>

        {/* 5 Cards Grid in a Single Horizontal Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              {/* Circular colored background icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${feat.iconBg}`}>
                {feat.icon}
              </div>
              <div className="flex flex-col mt-2">
                <h3 className="text-sm font-extrabold text-navy-950 leading-snug">{feat.title}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1.5 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
