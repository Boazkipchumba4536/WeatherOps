'use client';

import { RiskLevel } from '@/types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
  showLabel?: boolean;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  minimal: '#22c55e',
  low: '#84cc16',
  moderate: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

const RISK_LABELS: Record<RiskLevel, string> = {
  minimal: 'Minimal',
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  critical: 'Critical',
};

export function RiskGauge({ score, level, size = 180, showLabel = true }: RiskGaugeProps) {
  const color = RISK_COLORS[level];
  const label = RISK_LABELS[level];

  const cx = size / 2;
  const cy = size / 2;
  const r = (size - 24) / 2;
  const strokeWidth = 10;

  // Arc goes from 225° to 315° (270° span = 3/4 circle)
  const startAngle = 225;
  const endAngle = 315;
  const totalAngle = 270;
  const fillAngle = (score / 100) * totalAngle;

  function polarToCartesian(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function arcPath(startDeg: number, endDeg: number) {
    const start = polarToCartesian(startDeg);
    const end = polarToCartesian(endDeg);
    const spanDeg = endDeg - startDeg;
    const largeArc = spanDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  const bgPath = arcPath(startAngle, startAngle + totalAngle);
  const fillPath = fillAngle > 0 ? arcPath(startAngle, startAngle + fillAngle) : '';

  // Gradient stops
  const gradId = `risk-grad-${score}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <path
            d={bgPath}
            fill="none"
            stroke="rgb(var(--color-border))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Filled arc */}
          {fillPath && (
            <path
              d={fillPath}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter="url(#glow)"
              style={{
                transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tabular-nums" style={{ color, lineHeight: 1 }}>
            {score}
          </span>
          <span className="text-xs font-medium mt-0.5" style={{ color: 'rgb(var(--color-text-muted))' }}>
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col items-center gap-1">
          <span
            className="status-badge"
            style={{
              color,
              backgroundColor: `${color}18`,
              borderColor: `${color}40`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {label} Risk
          </span>
        </div>
      )}
    </div>
  );
}
