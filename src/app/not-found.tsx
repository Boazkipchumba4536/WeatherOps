import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-amber-50 dark:bg-amber-950/20 text-amber-500 font-bold text-2xl">
        404
      </div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgb(var(--color-text))' }}>Page Not Found</h2>
      <p className="text-sm max-w-xs mb-8" style={{ color: 'rgb(var(--color-text-3))' }}>
        The operational intelligence page you are looking for does not exist or has been relocated.
      </p>
      <Link href="/" className="btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
}
