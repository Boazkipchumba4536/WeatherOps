import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 p-8 md:p-12 border fade-in-up" style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight" style={{ color: 'rgb(var(--color-text))' }}>
          Operational Weather <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400">
            Intelligence for Businesses
          </span>
        </h1>
        <p className="text-base md:text-lg mb-8 leading-relaxed max-w-xl" style={{ color: 'rgb(var(--color-text-2))' }}>
          Transform raw weather data into actionable business decisions. Get instant operational risk scores, automated alerts, and delay suggestions for your industry.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Link href="/analyze" className="btn-primary">
            Run Analysis <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/history" className="btn-secondary bg-surface">
            View Decision History
          </Link>
        </div>
      </div>
    </div>
  );
}
