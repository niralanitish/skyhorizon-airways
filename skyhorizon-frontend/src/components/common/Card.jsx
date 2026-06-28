import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function Card({ 
  children, 
  className = '', 
  variant = 'glass', 
  hoverEffect = true,
  onClick,
  ...props 
}) {
  const baseStyles = 'rounded-2xl transition-all duration-300 relative overflow-hidden';
  
  const variants = {
    glass: 'glass-card shadow-lg',
    flat: 'bg-navy-900 border border-slate-800 shadow-md',
    glassLight: 'glass-light shadow-md',
    outline: 'border border-slate-800 bg-transparent',
    white: 'bg-white text-navy-950 border border-slate-100 shadow-xl',
  };

  const selectedVariant = variants[variant] || variants.glass;
  const isClickable = typeof onClick === 'func' || onClick !== undefined;

  const motionProps = hoverEffect
    ? {
        whileHover: { y: -6, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)', borderColor: 'rgba(245, 166, 35, 0.3)' },
        transition: { duration: 0.3, ease: 'easeOut' },
      }
    : {};

  return (
    <motion.div
      onClick={onClick}
      className={`${baseStyles} ${selectedVariant} ${isClickable ? 'cursor-pointer' : ''} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['glass', 'flat', 'glassLight', 'outline', 'white']),
  hoverEffect: PropTypes.bool,
  onClick: PropTypes.func,
};
