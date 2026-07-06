'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Globe, Compass, CloudRain } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { OperationalStatus } from '@/types';

interface CorporateAsset {
  id: string;
  name: string;
  lat: number;
  lon: number;
  scenario: string;
  scenarioLabel: string;
  status: OperationalStatus;
  temp: number;
  windSpeed: number;
  condition: string;
  x: number; // percentage coordinate on SVG map
  y: number; // percentage coordinate on SVG map
}

const DEFAULT_ASSETS: CorporateAsset[] = [
  { id: '1', name: 'Seattle Fulfillment Center', lat: 47.6062, lon: -122.3321, scenario: 'delivery_fleet', scenarioLabel: 'Logistics', status: 'PROCEED_WITH_CAUTION', temp: 12, windSpeed: 8.5, condition: 'Light Rain', x: 20, y: 35 },
  { id: '2', name: 'Houston Refining Facility', lat: 29.7604, lon: -95.3698, scenario: 'utility_maintenance', scenarioLabel: 'Utility Maintenance', status: 'GO', temp: 31, windSpeed: 3.2, condition: 'Sunny', x: 45, y: 75 },
  { id: '3', name: 'Miami Marine Terminal', lat: 25.7617, lon: -80.1918, scenario: 'marine_operations', scenarioLabel: 'Marine Operations', status: 'GO', temp: 28, windSpeed: 4.8, condition: 'Partly Cloudy', x: 80, y: 85 },
  { id: '4', name: 'Denver Construction Site 4', lat: 39.7392, lon: -104.9903, scenario: 'construction', scenarioLabel: 'Building Site', status: 'HALT_OPERATIONS', temp: 8, windSpeed: 16.4, condition: 'High Winds', x: 38, y: 55 },
  { id: '5', name: 'Chicago Drone Survey Area', lat: 41.8781, lon: -87.6298, scenario: 'drone_inspection', scenarioLabel: 'Drone Inspection', status: 'DELAY_RECOMMENDED', temp: 14, windSpeed: 10.2, condition: 'Overcast', x: 62, y: 48 },
];

export function CommandCenterMap() {
  const router = useRouter();
  const [selectedAsset, setSelectedAsset] = useState<CorporateAsset | null>(DEFAULT_ASSETS[0]);

  const handleRunAnalysis = (asset: CorporateAsset) => {
    const date = new Date().toISOString().split('T')[0];
    const params = new URLSearchParams({
      lat: asset.lat.toString(),
      lon: asset.lon.toString(),
      location: asset.name,
      scenario: asset.scenario,
      date,
    });
    router.push(`/analyze?${params.toString()}`);
  };

  return (
    <div className="card p-5 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
            <Globe className="w-4 h-4 text-primary" />
            Asset Weather Command Center
          </h3>
          <p className="text-xs" style={{ color: 'rgb(var(--color-text-3))' }}>
            Real-time weather monitoring across monitored corporate properties.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geographic visualization board */}
        <div className="lg:col-span-2 relative aspect-[16/9] border rounded-xl overflow-hidden bg-zinc-950 dark:bg-black/80 flex items-center justify-center" style={{ borderColor: 'rgb(var(--color-border-strong))' }}>
          {/* Radar background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black opacity-60" />
          <svg className="absolute inset-0 w-full h-full text-zinc-800/20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <circle cx="50%" cy="50%" r="30%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx="50%" cy="50%" r="15%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
          </svg>

          {/* Asset Dots on the grid */}
          {DEFAULT_ASSETS.map((asset) => {
            const isSelected = selectedAsset?.id === asset.id;
            const dotColor = 
              asset.status === 'GO' ? 'bg-emerald-500' :
              asset.status === 'PROCEED_WITH_CAUTION' || asset.status === 'DELAY_RECOMMENDED' ? 'bg-amber-500' :
              'bg-red-500';

            return (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 z-20"
                style={{ left: `${asset.x}%`, top: `${asset.y}%` }}
              >
                {/* Glowing ring */}
                <span className={`absolute inset-0 w-6 h-6 -m-1 rounded-full animate-ping opacity-25 ${dotColor}`} />
                {/* Visual marker pin */}
                <div className={`w-4 h-4 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center shadow-lg transition-transform duration-200 ${dotColor} ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`} />
                
                {/* Hover label popup */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-zinc-900 text-white text-[10px] px-2 py-1 rounded shadow-md z-30">
                  {asset.name}
                </div>
              </button>
            );
          })}

          <div className="absolute top-3 left-3 bg-zinc-900/90 text-[10px] font-mono text-zinc-400 border border-zinc-700/50 rounded px-2 py-1 flex items-center gap-1.5 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> RADAR FEED: ONLINE
          </div>
        </div>

        {/* Selected asset details card */}
        <div className="flex flex-col justify-between">
          {selectedAsset ? (
            <div className="flex flex-col flex-1">
              <div className="p-4 rounded-xl border flex flex-col flex-1 justify-between" style={{ backgroundColor: 'rgb(var(--color-surface-2))', borderColor: 'rgb(var(--color-border))' }}>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold truncate" style={{ color: 'rgb(var(--color-text))' }}>{selectedAsset.name}</h4>
                    <span className="text-[10px] uppercase font-mono tracking-wider" style={{ color: 'rgb(var(--color-text-3))' }}>{selectedAsset.scenarioLabel}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <StatusBadge status={selectedAsset.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 my-auto">
                  <div className="p-3 rounded-lg bg-surface border text-center" style={{ borderColor: 'rgb(var(--color-border))' }}>
                    <div className="text-[10px]" style={{ color: 'rgb(var(--color-text-3))' }}>Temperature</div>
                    <div className="text-lg font-bold" style={{ color: 'rgb(var(--color-text))' }}>{selectedAsset.temp}°C</div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface border text-center" style={{ borderColor: 'rgb(var(--color-border))' }}>
                    <div className="text-[10px]" style={{ color: 'rgb(var(--color-text-3))' }}>Wind Speed</div>
                    <div className="text-lg font-bold" style={{ color: 'rgb(var(--color-text))' }}>{selectedAsset.windSpeed} m/s</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-xs border-t" style={{ borderColor: 'rgb(var(--color-border))', color: 'rgb(var(--color-text-2))' }}>
                  <span>Conditions</span>
                  <span className="font-semibold flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-primary" /> {selectedAsset.condition}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleRunAnalysis(selectedAsset)}
                  className="btn-primary flex-1 justify-center text-xs"
                >
                  Inspect Site Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-8 bg-zinc-50 dark:bg-zinc-900 border rounded-xl border-dashed">
              <MapPin className="w-8 h-8 opacity-45 mb-2" />
              <p className="text-xs" style={{ color: 'rgb(var(--color-text-3))' }}>Select a map pin to inspect asset intelligence details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
