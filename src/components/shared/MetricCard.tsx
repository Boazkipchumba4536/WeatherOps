import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  className?: string;
}

export function MetricCard({ title, value, subtitle, icon, trend, className = '' }: MetricCardProps) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium" style={{ color: 'rgb(var(--color-text-2))' }}>{title}</h3>
        {icon && <div className="text-primary opacity-80">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>{value}</div>
        {trend && (
          <div className={`text-xs font-medium flex items-center ${
            trend.direction === 'up' ? 'text-green-500' :
            trend.direction === 'down' ? 'text-red-500' :
            'text-gray-500'
          }`}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : ''} {trend.value}
          </div>
        )}
      </div>
      {subtitle && (
        <div className="mt-1 text-xs" style={{ color: 'rgb(var(--color-text-3))' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
