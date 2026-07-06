import { OPERATIONAL_STATUS_CONFIG } from '@/lib/constants';
import { OperationalStatus } from '@/types';

interface StatusBadgeProps {
  status: OperationalStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = OPERATIONAL_STATUS_CONFIG[status];
  
  return (
    <span
      className={`status-badge ${config.color} ${config.bgColor} ${config.borderColor} ${className}`}
      title={config.description}
    >
      <span className="w-1.5 h-1.5 rounded-full pulse-dot bg-current" />
      {config.label}
    </span>
  );
}
