import { RecommendedAction } from '@/types';
import { CheckSquare } from 'lucide-react';

export function RecommendedActions({ actions }: { actions: RecommendedAction[] }) {
  if (actions.length === 0) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'medium': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="card p-5 fade-in-up" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>Recommended Actions Checklist</h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <div key={action.id} className="flex gap-3 group">
            <div className="mt-0.5 shrink-0">
              <CheckSquare className="w-5 h-5 transition-colors cursor-pointer" style={{ color: 'rgb(var(--color-border-strong))' }} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 items-center mb-1">
                <span className="text-sm font-medium" style={{ color: 'rgb(var(--color-text))' }}>{action.action}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold ${getPriorityColor(action.priority)}`}>
                  {action.priority}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-medium" style={{ color: 'rgb(var(--color-text-3))', borderColor: 'rgb(var(--color-border))' }}>
                  {action.category}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'rgb(var(--color-text-2))' }}>{action.rationale}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
