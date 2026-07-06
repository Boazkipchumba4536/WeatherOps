'use client';

import { useState } from 'react';
import { MapPin, Calendar, Briefcase, Search, Loader2 } from 'lucide-react';
import { SCENARIO_META } from '@/lib/constants';
import { BusinessScenario, AnalysisFormValues } from '@/types';
import { useGeocoding, GeocodingResult } from '@/hooks/useGeocoding';

interface AnalysisFormProps {
  onSubmit: (values: AnalysisFormValues) => void;
  isLoading: boolean;
  initialValues?: Partial<AnalysisFormValues>;
}

export function AnalysisForm({ onSubmit, isLoading, initialValues }: AnalysisFormProps) {
  const { search, results, isLoading: isGeocoding, clear } = useGeocoding();
  
  const [locationName, setLocationName] = useState(initialValues?.locationName || '');
  const [lat, setLat] = useState<number | null>(initialValues?.lat || null);
  const [lon, setLon] = useState<number | null>(initialValues?.lon || null);
  const [showResults, setShowResults] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialValues?.date || today);
  
  const [scenario, setScenario] = useState<BusinessScenario>(initialValues?.businessScenario || 'construction');
  
  const handleLocationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocationName(val);
    setLat(null);
    setLon(null);
    setShowResults(true);
    search(val);
  };
  
  const selectLocation = (r: GeocodingResult) => {
    setLocationName(r.displayName);
    setLat(r.lat);
    setLon(r.lon);
    setShowResults(false);
    clear();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lat === null || lon === null) {
      alert('Please select a valid location from the dropdown.');
      return;
    }
    
    onSubmit({
      locationName,
      lat,
      lon,
      date,
      businessScenario: scenario,
      units: 'metric',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-5 sm:p-6 fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Location */}
        <div className="md:col-span-5 relative">
          <label className="label">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(var(--color-text-muted))' }} />
            <input
              type="text"
              value={locationName}
              onChange={handleLocationSearch}
              onFocus={() => setShowResults(true)}
              placeholder="Search city..."
              className="input-field pl-9"
              required
            />
            {isGeocoding && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: 'rgb(var(--color-primary))' }} />
            )}
          </div>
          
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-50 max-h-60 overflow-y-auto" style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}>
              {results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onMouseDown={(e) => {
                    // Use onMouseDown to prevent blur event from closing the dropdown before click registers
                    e.preventDefault();
                    selectLocation(r);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{r.name}</div>
                  <div className="text-xs truncate" style={{ color: 'rgb(var(--color-text-3))' }}>{r.displayName}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Date */}
        <div className="md:col-span-3">
          <label className="label">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(var(--color-text-muted))' }} />
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="input-field pl-9"
              required
            />
          </div>
        </div>
        
        {/* Scenario */}
        <div className="md:col-span-4">
          <label className="label">Business Scenario</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ color: 'rgb(var(--color-text-muted))' }} />
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as BusinessScenario)}
              className="input-field pl-9 appearance-none bg-transparent"
              required
            >
              {Object.entries(SCENARIO_META).map(([key, meta]) => (
                <option key={key} value={key} className="bg-surface text-primary">
                  {meta.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-5 flex justify-end">
        <button 
          type="submit" 
          className="btn-primary w-full sm:w-auto"
          disabled={isLoading || lat === null || lon === null}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Search className="w-4 h-4" /> Run Analysis</>
          )}
        </button>
      </div>
    </form>
  );
}
