import ErrorText from './ErrorText';

export default function FormField({
  label,
  name,
  type = 'text',
  register,
  error,
  required = false,
  options = [],
  placeholder = '',
  className = ''
}) {
  const inputClasses = `mt-1 block w-full rounded-xl border-2 ${
    error 
      ? 'border-red-500 focus:border-red-400 focus:ring-red-400 bg-red-900/20' 
      : 'border-dark-600 focus:border-starlit focus:ring-starlit bg-dark-800/50'
  } px-4 py-3 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 text-gray-100 placeholder-gray-500`;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-300">
        {label} {required && <span className="text-starlit">*</span>}
      </label>
      
      {type === 'select' ? (
        <select id={name} {...register(name)} className={inputClasses}>
          <option value="" className="bg-dark-800">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark-800">
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          {...register(name)}
          rows={4}
          placeholder={placeholder}
          className={inputClasses}
        />
      ) : (
        <input
          id={name}
          type={type}
          {...register(name)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
      
      {error && <ErrorText message={error.message} />}
    </div>
  );
}
