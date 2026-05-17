import { formatEuros } from '../utils/format';

interface BreakdownBarProps {
  items: {
    label: string;
    value: number;
    color: string;
  }[];
}

export function BreakdownBar({ items }: BreakdownBarProps) {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  if (total === 0) return null;

  return (
    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards', opacity: 0 }}>
      {/* Stacked bar */}
      <div className="h-4 rounded-full overflow-hidden flex bg-navy-50">
        {items.map((item, i) => {
          const width = total > 0 ? (Math.max(0, item.value) / total) * 100 : 0;
          return (
            <div
              key={i}
              className="h-full transition-all duration-700 ease-out first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${width}%`,
                backgroundColor: item.color,
                transitionDelay: `${i * 100}ms`,
              }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-navy-50 hover:bg-white transition-smooth"
          >
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary font-medium truncate">{item.label}</p>
              <p className="text-sm font-bold text-text-primary">{formatEuros(item.value)}/mes</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
