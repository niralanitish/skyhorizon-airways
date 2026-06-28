import PropTypes from 'prop-types';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  error,
  className = '',
  required = false,
  name,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-gold">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full py-3.5 bg-navy-950/60 border rounded-xl text-white placeholder-slate-500 font-medium transition-all focus:outline-none ${
            icon ? 'pl-11 pr-4' : 'px-4'
          } ${
            error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
              : 'border-slate-800 focus:border-gold focus:ring-1 focus:ring-gold/30'
          }`}
          {...props}
        />
      </div>
      {error && <span className="text-xs font-semibold text-red-400 mt-0.5">{error}</span>}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  icon: PropTypes.node,
  error: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  name: PropTypes.string,
};
