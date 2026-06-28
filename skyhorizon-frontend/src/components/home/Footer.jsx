import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';
import { 
  IoLogoFacebook, 
  IoLogoInstagram, 
  IoLogoTwitter, 
  IoLogoYoutube, 
  IoLogoLinkedin,
  IoArrowForwardOutline,
  IoGlobeOutline
} from 'react-icons/io5';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-white/5 pt-20 pb-10 relative z-20">
      
      {/* Primary Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5 text-left">
        
        {/* LEFT COLUMN: BRAND LOGO & TAGLINE & SOCIAL (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col items-start gap-4">
          <Link to="/">
            <div className="flex items-center justify-start overflow-hidden h-16 w-52 relative -ml-6">
              <img 
                src={logoImg} 
                alt="SkyHorizon Airways" 
                className="absolute w-[240%] h-[240%] max-w-none object-contain left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </Link>

          <p className="text-xs font-semibold text-slate-500 mt-2 max-w-xs leading-relaxed">
            Connecting you to places that matter. Experience global standard travel.
          </p>

          {/* Social Icons Directly Under Logo Column */}
          <div className="flex items-center gap-4 mt-2">
            <a href="#facebook" className="text-slate-600 hover:text-gold text-base transition-colors"><IoLogoFacebook /></a>
            <a href="#instagram" className="text-slate-600 hover:text-gold text-base transition-colors"><IoLogoInstagram /></a>
            <a href="#twitter" className="text-slate-600 hover:text-gold text-base transition-colors"><IoLogoTwitter /></a>
            <a href="#youtube" className="text-slate-600 hover:text-gold text-base transition-colors"><IoLogoYoutube /></a>
            <a href="#linkedin" className="text-slate-600 hover:text-gold text-base transition-colors"><IoLogoLinkedin /></a>
          </div>
        </div>

        {/* RIGHT COLUMNS: DIRECTORY LINKS (8 cols on desktop) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Company Column */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-5">Company</h4>
            <ul className="flex flex-col gap-3.5 text-xs font-semibold text-slate-500">
              <li><Link to="#" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Press</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Investors</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-5">Help</h4>
            <ul className="flex flex-col gap-3.5 text-xs font-semibold text-slate-500">
              <li><Link to="#" className="hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Baggage Info</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Travel Guidelines</Link></li>
            </ul>
          </div>

          {/* Policies Column */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-5">Policies</h4>
            <ul className="flex flex-col gap-3.5 text-xs font-semibold text-slate-500">
              <li><Link to="#" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Terms & Conditions</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Cancellation</Link></li>
              <li><Link to="#" className="hover:text-gold transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-5">Newsletter</h4>
            <p className="text-[11px] font-semibold text-slate-500 mb-4 leading-normal">
              Get the best deals & offers straight to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-navy-900 border border-slate-800 focus:border-gold/50 rounded-xl px-4 py-3 text-[11px] text-white placeholder-slate-600 focus:outline-none transition-all pr-12 font-medium"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 p-2 bg-gradient-to-r from-gold to-yellow-500 hover:brightness-110 rounded-lg text-navy-950 shadow-md cursor-pointer transition-transform active:scale-95 flex items-center justify-center focus:outline-none"
              >
                <IoArrowForwardOutline className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <span className="text-[10px] text-emerald-400 font-bold mt-2 animate-pulse">
                Subscribed successfully!
              </span>
            )}
          </div>

        </div>

      </div>

      {/* FOOTER BOTTOM SECTION (Matching Reference Image Layout) */}
      <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col sm:flex-row items-center sm:justify-between gap-6 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
        
        {/* Sitemap and accessibility */}
        <div className="flex items-center gap-6">
          <Link to="#" className="hover:text-gold transition-colors">Sitemap</Link>
          <Link to="#" className="hover:text-gold transition-colors">Accessibility</Link>
        </div>

        {/* Currency and language mocks */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-900 border border-slate-800 rounded-lg cursor-pointer hover:border-gold/30 transition-colors">
          <IoGlobeOutline className="w-3.5 h-3.5 text-gold" />
          <span className="text-slate-300 font-extrabold">English v</span>
        </div>

      </div>

    </footer>
  );
}
