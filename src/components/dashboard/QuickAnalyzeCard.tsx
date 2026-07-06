'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight } from 'lucide-react';
import { useGeocoding, GeocodingResult } from '@/hooks/useGeocoding';

export function QuickAnalyzeCard() {
  const router = useRouter();
  const { search, results, clear } = useGeocoding();
  
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(true);
    search(e.target.value);
  };

  const handleSelect = (r: GeocodingResult) => {
    setQuery(r.displayName);
    setShowResults(false);
    clear();
    
    // Default to construction and today
    const date = new Date().toISOString().split('T')[0];
    const params = new URLSearchParams({
      lat: r.lat.toString(),
      lon: r.lon.toString(),
      location: r.displayName,
      scenario: 'construction',
      date
    });
    
    router.push(`/analyze?${params.toString()}`);
  };

  return (
    <div className="card p-6 border-l-4 fade-in-up" style={{ borderLeftColor: 'rgb(var(--color-primary))', animationDelay: '0.1s' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold mb-1" style={{ color: 'rgb(var(--color-text))' }}>Quick Analysis</h3>
          <p className="text-xs" style={{ color: 'rgb(var(--color-text-3))' }}>Enter a location to instantly check operational risks.</p>
        </div>
      </div>
      
      <div className="relative">
        <div className="relative flex items-center">
          <MapPin className="absolute left-3 w-4 h-4" style={{ color: 'rgb(var(--color-text-muted))' }} />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            onFocus={() => setShowResults(true)}
            placeholder="Search any city or location..."
            className="input-field pl-9 pr-10 py-3 text-sm font-medium"
          />
          <button className="absolute right-2 p-1.5 rounded-md text-white bg-primary hover:bg-primary-hover transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 max-h-60 overflow-y-auto" style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}>
            {results.map((r) => (
              <button
                key={r.id}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleSelect(r); }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b last:border-b-0"
                style={{ borderColor: 'rgb(var(--color-border))' }}
              >
                <div className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>{r.name}</div>
                <div className="text-xs truncate mt-0.5" style={{ color: 'rgb(var(--color-text-3))' }}>{r.displayName}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
