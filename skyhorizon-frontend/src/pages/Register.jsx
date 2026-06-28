import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoPersonAddOutline } from 'react-icons/io5';
import { useBooking } from '../context/BookingContext';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/home/Footer';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useBooking();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.register(name, email, password);
      if (response.success) {
        login(response.user);
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow pt-28 pb-20 flex items-center justify-center px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card variant="glass" className="p-8 border border-white/5 shadow-2xl text-center">
            
            {/* Header branding */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-3">
                <svg viewBox="0 0 100 100" className="w-8 h-8 fill-gold">
                  <path d="M 25 35 C 10 38, 5 50, 15 65 C 20 60, 22 50, 30 48 C 22 45, 23 38, 25 35 Z" />
                  <path d="M 75 35 C 90 38, 95 50, 85 65 C 80 60, 78 50, 70 48 C 78 45, 77 38, 75 35 Z" />
                  <rect x="38" y="25" width="6" height="50" rx="3" />
                  <rect x="56" y="25" width="6" height="50" rx="3" />
                  <rect x="42" y="47" width="16" height="6" rx="2" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white">Create Account</h3>
              <p className="text-slate-400 font-semibold text-xs mt-1">Join SkyHorizon Airways Frequent Flyer Program</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold p-3.5 rounded-xl text-left mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
              <Input
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<IoPersonOutline className="w-5 h-5" />}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<IoMailOutline className="w-5 h-5" />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<IoLockClosedOutline className="w-5 h-5" />}
                required
              />

              <div className="flex items-start gap-2.5 my-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 accent-gold cursor-pointer mt-0.5 flex-shrink-0"
                />
                <label htmlFor="agree" className="text-xs text-slate-300 cursor-pointer font-semibold select-none leading-normal">
                  I agree to the <Link to="#" className="text-gold hover:underline">Terms of Service</Link> & <Link to="#" className="text-gold hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full py-3.5 mt-2 flex items-center justify-center gap-2"
              >
                <span>Create Account</span>
                <IoPersonAddOutline className="w-5 h-5" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-1.5 text-xs font-semibold">
              <span className="text-slate-500">Already have an account?</span>
              <Link to="/login" className="text-gold hover:underline">Log in</Link>
            </div>

          </Card>
        </motion.div>

      </div>

      <Footer />
    </div>
  );
}
