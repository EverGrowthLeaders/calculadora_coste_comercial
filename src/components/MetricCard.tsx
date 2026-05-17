interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subvalue?: string;
  color: 'cyan' | 'navy' | 'magenta' | 'emerald';
  delay?: number;
}

const colorClasses = {
  cyan: {
    bg: 'bg-cyan-100/40',
    border: 'border-cyan-200/50',
    icon: 'text-cyan-500',
    value: 'text-navy-800',
  },
  navy: {
    bg: 'bg-navy-50/60',
    border: 'border-navy-100/50',
    icon: 'text-navy-500',
    value: 'text-navy-800',
  },
  magenta: {
    bg: 'bg-magenta-200/20',
    border: 'border-magenta-200/40',
    icon: 'text-magenta-500',
    value: 'text-navy-800',
  },
  emerald: {
    bg: 'bg-green-50',
    border: 'border-green-200/50',
    icon: 'text-green-600',
    value: 'text-navy-800',
  },
};

export function MetricCard({ icon, label, value, subvalue, color, delay = 0 }: MetricCardProps) {
  const c = colorClasses[color];
  
  return (
    <div
      className={`
        ${c.bg} ${c.border} border rounded-2xl p-5 
        hover:shadow-lg hover:-translate-y-0.5 transition-smooth
        animate-fade-in-up opacity-0
      `}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`${c.icon} mb-3`}>{icon}</div>
      <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold ${c.value} leading-tight`}>{value}</p>
      {subvalue && (
        <p className="text-sm text-text-muted mt-1 font-medium">{subvalue}</p>
      )}
    </div>
  );
}
