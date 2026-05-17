import { type InputHTMLAttributes } from 'react';

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  helper: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  id: string;
}

export function NumberInput({ label, helper, value, onChange, suffix, id, min, max, step, ...rest }: NumberInputProps) {
  return (
    <div className="space-y-2 animate-fade-in-up">
      <label htmlFor={id} className="block text-sm font-semibold text-text-primary">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value || ''}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onChange(isNaN(val) ? 0 : val);
          }}
          min={min}
          max={max}
          step={step}
          className="w-full px-4 py-3 bg-white border border-navy-100 rounded-xl text-text-primary font-medium text-lg
                     focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500
                     transition-smooth hover:border-navy-200 placeholder:text-text-muted"
          {...rest}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary font-medium text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted leading-relaxed">{helper}</p>
    </div>
  );
}
