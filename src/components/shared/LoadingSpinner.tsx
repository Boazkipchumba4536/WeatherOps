export function LoadingSpinner({ text = 'Loading...', className }: { text?: string; className?: string }) {
  if (className) {
    return (
      <div className={`rounded-full border-2 animate-spin shrink-0 ${className}`} style={{ borderTopColor: 'currentColor' }} />
    );
  }
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 animate-spin" style={{ borderColor: 'rgb(var(--color-primary)) transparent transparent transparent' }} />
        <div className="absolute inset-2 rounded-full border-2" style={{ borderColor: 'transparent transparent rgb(var(--color-primary)) rgb(var(--color-primary))', opacity: 0.5, animation: 'spin 1.5s linear infinite reverse' }} />
      </div>
      {text && <div className="text-sm font-medium animate-pulse" style={{ color: 'rgb(var(--color-text-2))' }}>{text}</div>}
    </div>
  );
}
