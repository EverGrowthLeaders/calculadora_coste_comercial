interface SliderInputProps {
  label: string;
  helper: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  id: string;
  warning?: string;
}

export function SliderInput({ label, helper, value, onChange, min, max, step, displayValue, id, warning }: SliderInputProps) {
  // Calculate fill percentage for visual track
  const fillPercent = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-semibold text-text-primary">
          {label}
        </label>
        <span className="text-lg font-bold text-navy-600 bg-navy-50 px-3 py-1 rounded-lg min-w-[60px] text-center transition-smooth">
          {displayValue}
        </span>
      </div>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-full bg-navy-100 w-full pointer-events-none" />
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-full pointer-events-none transition-all duration-150"
          style={{
            width: `${fillPercent}%`,
            background: 'linear-gradient(90deg, #00d4ff, #2a4d8a)',
          }}
        />
        <input
          id={id}
          type="range"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="relative z-10 w-full bg-transparent"
        />
      </div>
      <p className="text-xs text-text-muted leading-relaxed">{helper}</p>
      {warning && (
        <p className="text-xs text-magenta-500 font-medium flex items-center gap-1 animate-fade-in">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {warning}
        </p>
      )}
    </div>
  );
}
