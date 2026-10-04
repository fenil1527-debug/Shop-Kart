export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
  autoComplete,
}) {
  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-sm font-medium text-stone-700 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors duration-200">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`
            w-full bg-stone-50/70 hover:bg-stone-50 border rounded-xl py-3 text-stone-900 placeholder-stone-400
            text-sm transition-all duration-200 input-focus-ring focus:bg-white
            ${icon ? "pl-10 pr-4" : "px-4"}
            ${error ? "border-red-400 bg-red-50/30" : "border-stone-200"}
          `}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
