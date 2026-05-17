interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-3">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-smooth
                ${isCompleted
                  ? 'bg-gradient-to-br from-cyan-500 to-navy-500 text-white shadow-lg shadow-cyan-500/20'
                  : isActive
                    ? 'bg-gradient-to-br from-cyan-500 to-navy-600 text-white shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/15'
                    : 'bg-navy-50 text-navy-300 border-2 border-navy-100'
                }
              `}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : stepNum}
              </div>
              <span className={`text-[11px] mt-1.5 font-medium text-center leading-tight hidden sm:block transition-smooth ${
                isActive ? 'text-navy-700' : isCompleted ? 'text-navy-500' : 'text-text-muted'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Progress bar track */}
      <div className="h-1.5 bg-navy-50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out progress-gradient"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
