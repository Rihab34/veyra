import type { ReactNode } from 'react';

interface ScoreRingProps {
  score: number; // 1-5
  max?: number;
  size?: number;
  label?: string;
}

export function ScoreRing({ score, max = 5, size = 56, label }: ScoreRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, score / max));
  const dash = circumference * pct;

  const color = score >= 4 ? '#16a34a' : score >= 3 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#ECE5DC"
            strokeWidth={4}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-charcoal-900">
            {score.toFixed(1)}
          </span>
        </div>
      </div>
      {label && <span className="text-xs text-charcoal-700">{label}</span>}
    </div>
  );
}

interface DimensionBarProps {
  label: string;
  score: number;
  max?: number;
  note?: string;
}

export function DimensionBar({ label, score, max = 5, note }: DimensionBarProps) {
  const pct = (score / max) * 100;
  const color = score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-charcoal-800">{label}</span>
        <span className="font-semibold text-charcoal-700">{score}/5</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-warm-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {note && <p className="text-xs text-charcoal-700">{note}</p>}
    </div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-warm-300 bg-white/60 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-100 text-veyra-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-charcoal-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-charcoal-700">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
