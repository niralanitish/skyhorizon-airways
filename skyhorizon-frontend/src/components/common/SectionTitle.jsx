import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function SectionTitle({
  title,
  subtitle,
  badgeText,
  badgeIcon,
  linkText,
  linkPath,
  align = 'left',
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 ${className}`}>
      <div className={`flex flex-col ${isCenter ? 'items-center text-center w-full' : ''}`}>
        {badgeText && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-3 self-start">
            {badgeIcon && <span className="text-sm">{badgeIcon}</span>}
            <span>{badgeText}</span>
          </div>
        )}
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <p className="text-slate-400 mt-2 text-base max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {linkText && linkPath && (
        <Link 
          to={linkPath}
          className="text-gold font-bold text-sm tracking-wider uppercase hover:text-yellow-400 transition-colors flex items-center gap-1 group self-start md:self-end mt-2 md:mt-0"
        >
          <span>{linkText}</span>
          <span className="transform transition-transform group-hover:translate-x-1 duration-200">→</span>
        </Link>
      )}
    </div>
  );
}

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  badgeText: PropTypes.string,
  badgeIcon: PropTypes.node,
  linkText: PropTypes.string,
  linkPath: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center']),
  className: PropTypes.string,
};
