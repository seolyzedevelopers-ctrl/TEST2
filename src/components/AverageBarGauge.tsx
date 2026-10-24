import React from 'react';

interface AverageBarGaugeProps {
  label: string;
  currentValue: number;
  benchmarkValue: number;
  unit: string;
  colorScheme?: 'emerald' | 'amber' | 'rose' | 'sky' | 'indigo' | 'orange';
  benchmarkLabel?: string;
  showPercentage?: boolean;
  maxScaleValue?: number;
}

export const AverageBarGauge: React.FC<AverageBarGaugeProps> = ({
  label,
  currentValue,
  benchmarkValue,
  unit,
  colorScheme = 'amber',
  benchmarkLabel = 'Target Avg',
  showPercentage = true,
  maxScaleValue
}) => {
  const max = maxScaleValue || Math.max(benchmarkValue * 1.3, currentValue * 1.15, 1);
  const currentPercent = Math.min(100, Math.max(0, (currentValue / max) * 100));
  const benchmarkPercent = Math.min(100, Math.max(0, (benchmarkValue / max) * 100));
  const relativePercent = benchmarkValue > 0 ? Math.round((currentValue / benchmarkValue) * 100) : 0;

  const colorStyles = {
    emerald: {
      bar: 'bg-emerald-600',
      text: 'text-emerald-700',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    amber: {
      bar: 'bg-amber-500',
      text: 'text-amber-800',
      lightBg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    rose: {
      bar: 'bg-rose-500',
      text: 'text-rose-700',
      lightBg: 'bg-rose-50',
      border: 'border-rose-200'
    },
    sky: {
      bar: 'bg-sky-600',
      text: 'text-sky-700',
      lightBg: 'bg-sky-50',
      border: 'border-sky-200'
    },
    indigo: {
      bar: 'bg-indigo-600',
      text: 'text-indigo-700',
      lightBg: 'bg-indigo-50',
      border: 'border-indigo-200'
    },
    orange: {
      bar: 'bg-orange-600',
      text: 'text-orange-700',
      lightBg: 'bg-orange-50',
      border: 'border-orange-200'
    }
  }[colorScheme];

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-stone-800">
          <span>{label}</span>
          {showPercentage && (
            <span className={`text-[11px] font-semibold ${colorStyles.text}`}>
              ({relativePercent}% of avg)
            </span>
          )}
        </div>
        <div className="text-right text-stone-600 font-mono text-[11px]">
          <span className="font-semibold text-stone-900">{Math.round(currentValue)}</span>
          <span className="text-stone-400"> / {benchmarkValue}{unit}</span>
        </div>
      </div>

      <div className="relative h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
        {/* Fill bar */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles.bar}`}
          style={{ width: `${currentPercent}%` }}
        />
        
        {/* Average Benchmark Marker Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-stone-900 z-10 shadow-xs"
          style={{ left: `${benchmarkPercent}%` }}
          title={`${benchmarkLabel}: ${benchmarkValue}${unit}`}
        />
      </div>

      <div className="flex items-center justify-between mt-1 text-[10px] text-stone-600 font-sans">
        <span>0</span>
        <span className="flex items-center gap-1 font-medium text-stone-600">
          <span className="inline-block w-1.5 h-1.5 bg-stone-800 rounded-full"></span>
          {benchmarkLabel} ({benchmarkValue}{unit})
        </span>
        <span>{Math.round(max)}{unit}</span>
      </div>
    </div>
  );
};
