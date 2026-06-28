import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoTimeOutline, 
  IoShieldCheckmarkOutline, 
  IoBedOutline, // wait, let's look at the seat icon, seat icon is comfort/seat. We can import IoSeatOutline or IoHeartOutline or IoBedOutline. Let's look at what we used, let's use IoBedOutline or IoRibbonOutline. Let's check react-icons. IoAirplaneOutline, IoRibbonOutline, etc.
  IoHeadsetOutline, 
  IoRibbonOutline, 
  IoChatbubbleEllipsesOutline,
  IoCloseOutline,
  IoSendOutline,
  IoSparklesSharp,
  IoShieldOutline
} from 'react-icons/io5';
import { MdChair } from 'react-icons/md'; // We can use MdChair for seats! It is a clear seat icon.
import SectionTitle from '../common/SectionTitle';

export default function WhyUs() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! 👋 How can I help you today?', sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto slide-in animation for Sky AI button after page loads
  const [showAiBadge, setShowAiBadge] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAiBadge(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleQuickQuestion = (question, answer) => {
    const userMsg = { id: Date.now(), text: question, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = { id: Date.now() + 1, text: answer, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 850);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "I'm not sure about that. Please contact support@skyhorizon.com.";
      const lowerText = userText.toLowerCase();

      if (lowerText.includes('baggage') || lowerText.includes('luggage')) {
        aiResponse = "Standard Economy flights include 25kg checked baggage and 7kg cabin baggage.";
      } else if (lowerText.includes('check') || lowerText.includes('rules')) {
        aiResponse = "Web check-in opens 48 hours prior to your scheduled flight and closes 1 hour before departure.";
      } else if (lowerText.includes('status') || lowerText.includes('delay')) {
        aiResponse = "Currently, 94% of our aircraft are operating exactly on schedule.";
      } else if (lowerText.includes('cancel') || lowerText.includes('refund')) {
        aiResponse = "Cancellations made 24 hours prior to departure are eligible for refunds.";
      } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
        aiResponse = "Hello! 👋 I am Sky AI, how can I assist you with your booking today?";
      }

      const aiMsg = { id: Date.now() + 1, text: aiResponse, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const promptOptions = [
    { label: 'Baggage allowance', answer: 'Checked baggage allowance is 25kg for Economy, 35kg for Business. Cabin luggage is 7kg across all classes.' },
    { label: 'Check-in rules', answer: 'Web check-in opens 48 hours before your flight and closes 60 minutes before departure.' },
    { label: 'Flight status', answer: 'Flights are running on schedule. Check your specific flight code under the support tab.' },
    { label: 'Cancellation policy', answer: 'Full refunds are processed if cancelled 24 hours before flight time. Admin fees apply.' }
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

      {/* Floating Sky AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Sky AI Circular Floating Action Button */}
        <AnimatePresence>
          {showAiBadge && !isOpen && (
            <motion.button
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="px-5 py-4 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 shadow-2xl rounded-full text-navy-950 flex items-center gap-2.5 font-bold text-sm tracking-wide cursor-pointer"
            >
              <IoChatbubbleEllipsesOutline className="w-5 h-5 animate-pulse" />
              <span>Sky AI Beta</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Window Dialog */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-[360px] md:w-[380px] h-[500px] bg-white border border-slate-200 rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative"
            >
              {/* Chat Header */}
              <div className="p-4 bg-navy-950 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                    <IoSparklesSharp className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-sm text-white flex items-center gap-1.5 leading-none">
                      Sky AI
                      <span className="px-1.5 py-0.5 rounded bg-gold/20 text-gold text-[8px] font-black tracking-widest uppercase">
                        Beta
                      </span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
                >
                  <IoCloseOutline className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3.5 scrollbar-thin bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gold text-navy-950 rounded-tr-none font-bold shadow-sm'
                          : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none font-semibold shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 px-3 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Footer Input & Options */}
              <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
                {/* Quick select buttons */}
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-1.5 justify-start">
                    {promptOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQuickQuestion(opt.label, opt.answer)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-gold/40 text-slate-600 hover:text-navy-950 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input text form */}
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-grow py-2.5 px-4 bg-slate-50 border border-slate-200 focus:border-gold/50 rounded-xl text-[11px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 rounded-xl text-navy-950 shadow-md cursor-pointer transition-transform active:scale-95 flex items-center justify-center focus:outline-none"
                  >
                    <IoSendOutline className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
}
