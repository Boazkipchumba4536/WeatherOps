import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed rounded-xl" style={{ borderColor: 'rgb(var(--color-border-strong))', backgroundColor: 'rgb(var(--color-surface-2))' }}>
      <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))' }}>
        <div className="text-primary w-8 h-8 opacity-80 flex items-center justify-center [&>svg]:w-8 [&>svg]:h-8">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(var(--color-text))' }}>{title}</h3>
      <p className="text-sm max-w-sm mb-6" style={{ color: 'rgb(var(--color-text-3))' }}>{description}</p>
      {action}
    </div>
  );
}
