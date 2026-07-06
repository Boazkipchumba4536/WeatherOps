'use client';

import React, { useState } from 'react';
import { Layers, ShieldCheck, Compass, Info, Flame, Wind, CloudRain, AlertTriangle } from 'lucide-react';
import { SCENARIO_META } from '@/lib/constants';

interface ScenarioRuleDetail {
  id: string;
  name: string;
  icon: React.ReactNode;
  riskEngineTitle: string;
  limits: { label: string; limit: string; description: string }[];
  scoringBreakdown: { condition: string; penalty: string; riskFactor: string }[];
  recommendations: string[];
}

const SCENARIOS_DETAILS: ScenarioRuleDetail[] = [
  {
    id: 'construction',
    name: 'Construction & Crane Operations',
    icon: <Wind className="w-5 h-5 text-indigo-400" />,
    riskEngineTitle: 'Structural Lifting Safe Envelope',
    limits: [
      { label: 'High Wind Cutoff', limit: '>14 m/s', description: 'Crane operations suspended due to structural lift sway hazards.' },
      { label: 'Heavy Precipitation', limit: '>25 mm/day', description: 'Halt concrete curing and soil stability operations.' },
      { label: 'Thermal Safety Limit', limit: '>38°C or <2°C', description: 'Mandatory worker shifts scheduling limits.' }
    ],
    scoringBreakdown: [
      { condition: 'Wind Speed > 14 m/s', penalty: '+40 points', riskFactor: 'High' },
      { condition: 'Lightning Storm', penalty: '+50 points', riskFactor: 'Critical' },
      { condition: 'Rain > 25 mm/day', penalty: '+35 points', riskFactor: 'High' },
      { condition: 'Visibility < 1 km', penalty: '+15 points', riskFactor: 'Low' }
    ],
    recommendations: [
      'Ground heavy rigging and crane activities immediately if wind gusts exceed safe capacity.',
      'Cover concrete placements and structural steel foundations during precipitation bands.',
      'Activate hot weather heat stress protocols (rest, hydrate, rotate crew) if temperatures peak.'
    ]
  },
  {
    id: 'delivery_fleet',
    name: 'Logistics & Delivery Fleets',
    icon: <Compass className="w-5 h-5 text-emerald-400" />,
    riskEngineTitle: 'Fleet Dispatch Safe Envelope',
    limits: [
      { label: 'Severe Wind Gust', limit: '>18 m/s', description: 'Transit lane sway hazard for large container vehicles.' },
      { label: 'Rain Threshold', limit: '>15 mm/day', description: 'Route safety warnings due to surface pooling.' },
      { label: 'Thermal High Warning', limit: '>35°C', description: 'Cooling engine checks and refrigeration limits.' }
    ],
    scoringBreakdown: [
      { condition: 'Wind Speed > 18 m/s', penalty: '+35 points', riskFactor: 'High' },
      { condition: 'Precipitation > 15 mm/day', penalty: '+30 points', riskFactor: 'High' },
      { condition: 'Visibility < 0.5 km', penalty: '+25 points', riskFactor: 'Medium' }
    ],
    recommendations: [
      'Issue speed limit modifiers to active freight operators during heavy precipitation bands.',
      'Check cooling systems and temperature-sensitive container storage units.',
      'Reroute transits away from known localized low-point flood basins.'
    ]
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Spraying Operations',
    icon: <Layers className="w-5 h-5 text-amber-400" />,
    riskEngineTitle: 'Crop Dusting & Soil Safe Envelope',
    limits: [
      { label: 'Drift Wind Limit', limit: '>5.5 m/s', description: 'Prevent pesticide chemical drifting to neighboring zones.' },
      { label: 'Rain Limits', limit: '>8 mm/day', description: 'Soil absorption loss and runoff hazards.' },
      { label: 'High Thermal Limits', limit: '>32°C', description: 'Leaf surface burning under intense sun conditions.' }
    ],
    scoringBreakdown: [
      { condition: 'Wind Speed > 5.5 m/s', penalty: '+30 points', riskFactor: 'Medium' },
      { condition: 'Precipitation > 8 mm/day', penalty: '+25 points', riskFactor: 'Medium' },
      { condition: 'Temperature > 32°C', penalty: '+20 points', riskFactor: 'Low' }
    ],
    recommendations: [
      'Postpone chemical spraying if wind speeds push spray patterns past drift limits.',
      'Ensure soil integrity before utilizing heavy farm equipment on wet soil plots.',
      'Schedule early morning harvesting to minimize sun burn levels.'
    ]
  },
  {
    id: 'outdoor_event',
    name: 'Outdoor Public Events',
    icon: <Flame className="w-5 h-5 text-red-400" />,
    riskEngineTitle: 'Event Safety Safe Envelope',
    limits: [
      { label: 'Max Structure Wind', limit: '>12 m/s', description: 'Temporary staging, tents and display sway hazard.' },
      { label: 'Rain Limit', limit: '>12 mm/day', description: 'Audience logistics and safety planning cutoff.' },
      { label: 'Extreme Thermal High', limit: '>36°C', description: 'Mandatory misting and heat safety deployment.' }
    ],
    scoringBreakdown: [
      { condition: 'Lightning storm', penalty: '+60 points', riskFactor: 'Critical' },
      { condition: 'Wind Speed > 12 m/s', penalty: '+30 points', riskFactor: 'Medium' },
      { condition: 'Precipitation > 12 mm/day', penalty: '+25 points', riskFactor: 'Medium' }
    ],
    recommendations: [
      'Suspend event activities and route audience members to secure permanent structures during storms.',
      'Inspect ground anchor tensions on all canvas tents and temporary outdoor screen scaffolds.',
      'Provide misting setups, water, and shaded medical rest zones for high temp profiles.'
    ]
  },
  {
    id: 'utility_maintenance',
    name: 'Utility Maintenance & Repairs',
    icon: <Layers className="w-5 h-5 text-indigo-400" />,
    riskEngineTitle: 'High-Voltage Line Operations Safe Envelope',
    limits: [
      { label: 'Pole Climb Wind Limit', limit: '>13 m/s', description: 'Climbing elevated power poles suspended for operator safety.' },
      { label: 'Lightning Proximity', limit: 'Any activity', description: 'Instant lock out of utility grid adjustments.' },
      { label: 'Winter Freeze Warning', limit: '< -3°C', description: 'Line icing hazards and equipment failures.' }
    ],
    scoringBreakdown: [
      { condition: 'Thunderstorm activity', penalty: '+55 points', riskFactor: 'Critical' },
      { condition: 'Wind Speed > 13 m/s', penalty: '+40 points', riskFactor: 'High' },
      { condition: 'Temperature < -3°C', penalty: '+20 points', riskFactor: 'Medium' }
    ],
    recommendations: [
      'Ground repair crews if lightning cells are recorded within active perimeters.',
      'Postpone pole structural servicing during elevated wind speeds.',
      'Supply cold protection gears for lineman teams working frozen structures.'
    ]
  },
  {
    id: 'marine_operations',
    name: 'Marine Docking & Transport',
    icon: <CloudRain className="w-5 h-5 text-blue-400" />,
    riskEngineTitle: 'Vessel Safe Docking Envelope',
    limits: [
      { label: 'Docking Wind Limit', limit: '>15 m/s', description: 'Vessel sway and dock collision hazards during docking maneuvers.' },
      { label: 'Wave Surge Precip', limit: '>20 mm/day', description: 'High harbor wave surges and poor optical mooring.' },
      { label: 'Heavy Fog Limits', limit: '< 0.5 km', description: 'Optical dock navigation cutoff.' }
    ],
    scoringBreakdown: [
      { condition: 'Wind Speed > 15 m/s', penalty: '+45 points', riskFactor: 'High' },
      { condition: 'Visibility < 0.5 km', penalty: '+30 points', riskFactor: 'High' },
      { condition: 'Precipitation > 20 mm/day', penalty: '+25 points', riskFactor: 'Medium' }
    ],
    recommendations: [
      'Enforce tethered harbor mooring procedures if surge risk escalates.',
      'Halt docking maneuvers during periods of extreme low optical visibility.',
      'Notify tugboat assist units to standby for inbound cargo vessel docking support.'
    ]
  }
];

export default function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>('construction');

  const activeScenario = SCENARIOS_DETAILS.find(s => s.id === selectedScenario) || SCENARIOS_DETAILS[0];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
      
      {/* Title */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
            <Layers className="w-6 h-6 text-indigo-400 animate-pulse" />
            SaaS Scenario Specifications
          </h1>
          <p className="text-sm" style={{ color: 'rgb(var(--color-text-3))' }}>
            Reference guide mapping weather risk formulas to operational safety policies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="card overflow-hidden">
            <div className="p-3 border-b bg-zinc-950/20 font-bold uppercase tracking-wider text-[10px] text-slate-400"
              style={{ borderColor: 'rgb(var(--color-border))' }}>
              Select Scenario Specification
            </div>
            <div className="p-2 space-y-1">
              {SCENARIOS_DETAILS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedScenario === s.id
                      ? 'bg-indigo-600/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {s.icon}
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Details Pane */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card p-6 space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4" style={{ borderColor: 'rgb(var(--color-border))' }}>
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100">{activeScenario.name}</h2>
                <span className="text-[11px] text-slate-400 font-mono">Engine Schema: {activeScenario.riskEngineTitle}</span>
              </div>
            </div>

            {/* Threshold limits */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> Operational Limits Specs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeScenario.limits.map((limit, idx) => (
                  <div key={idx} className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900/80">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{limit.label}</div>
                    <div className="text-sm font-extrabold text-zinc-200 mt-1">{limit.limit}</div>
                    <p className="text-[10.5px] text-zinc-500 mt-1 leading-normal">{limit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scoring penalty table */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Risk Calculation Penalties
              </h3>
              <div className="overflow-hidden border rounded-xl" style={{ borderColor: 'rgb(var(--color-border))' }}>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'rgb(var(--color-border))', backgroundColor: 'rgb(var(--color-surface-2))' }}>
                      <th className="p-3 font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Weather Condition</th>
                      <th className="p-3 font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Penalty Weight</th>
                      <th className="p-3 font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Rating Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'rgb(var(--color-border))' }}>
                    {activeScenario.scoringBreakdown.map((row, idx) => (
                      <tr key={idx} className="hover:bg-black/[0.005] dark:hover:bg-white/[0.005] transition-colors">
                        <td className="p-3 font-semibold text-slate-800 dark:text-zinc-200">{row.condition}</td>
                        <td className="p-3 text-slate-500 dark:text-zinc-400 font-mono">{row.penalty}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            row.riskFactor === 'Critical' 
                              ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                              : row.riskFactor === 'High' 
                                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {row.riskFactor}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-500" /> Prescriptive Actions Guide
              </h3>
              <ul className="space-y-2">
                {activeScenario.recommendations.map((rec, idx) => (
                  <li key={idx} className="bg-zinc-950 p-3 rounded-lg border border-zinc-900/80 flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                    <span className="w-5 h-5 rounded bg-zinc-900 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
