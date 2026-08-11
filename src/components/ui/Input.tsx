import React, { useState, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = 'text', className = '', error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`flex flex-col mb-4 ${className}`}>
        {label && (
          <label className="text-[#A1A1AA] text-[15px] mb-2">{label}</label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`w-full bg-transparent border-b pb-2 text-[17px] outline-none transition-colors placeholder:text-[#A1A1AA] placeholder:font-normal ${
              error
                ? 'border-[#CB3030] text-[#CB3030] focus:border-[#CB3030]'
                : 'border-[#1E293B] text-[#1E293B] focus:border-[#1E293B]'
            }`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-0 bottom-2 text-[#1E293B] hover:opacity-70 transition-opacity"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                // Open Eye Icon
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12c0 0 4-7 10-7s10 7 10 7-4 7-10 7-10-7-10-7z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                 </svg>
              ) : (
                // Closed Eye with lashes
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12C3 12 8.5 16 12 16C15.5 16 21 12 21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 14.5L5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 14.5L19 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          )}
        </div>
        {error && (
          <span className="text-[#CB3030] text-[14px] mt-1">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
