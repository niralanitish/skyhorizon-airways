import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false,
  isLoading = false,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all focus:outline-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none text-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-gold to-yellow-500 text-navy-950 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:brightness-110 px-6 py-3 text-base',
    secondary: 'bg-navy-800 text-white border border-slate-700 hover:border-gold/30 hover:bg-navy-700 px-6 py-3 text-base',
    outline: 'bg-transparent text-slate-200 border border-slate-700 hover:border-gold hover:text-white px-6 py-3 text-base',
    glass: 'glass text-white hover:bg-white/10 hover:border-gold/40 border border-white/10 shadow-lg px-6 py-3 text-base',
    goldOutline: 'bg-transparent text-gold border border-gold hover:bg-gold hover:text-navy-950 px-6 py-3 text-base',
    small: 'bg-gradient-to-r from-gold to-yellow-500 text-navy-950 px-4 py-2 text-sm shadow-md',
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      className={`${baseStyles} ${selectedVariant} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'glass', 'goldOutline', 'small']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};
