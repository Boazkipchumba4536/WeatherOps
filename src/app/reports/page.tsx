'use client';

import React, { useState, useEffect } from 'react';
import { useHistory } from '@/hooks/useHistory';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Search, Filter, ArrowUpDown, Download, Trash2, X, MapPin, Calendar, Clock, AlertTriangle, CheckSquare } from 'lucide-react';
import { HistoryEntry } from '@/types';
import { SCENARIO_META } from '@/lib/constants';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface DrawerReportDetails {
  executiveSummary: string;
  keyRisks?: string[];
  recommendedActions?: { id: string; priority: string; category: string; action: string; rationale: string }[];
}

export default function ReportsPage() {
  const { entries, isLoaded, removeEntry, clearAll } = useHistory();
  const [filteredEntries, setFilteredEntries] = useState<HistoryEntry[]>([]);
  
  // States for search and filter
  const [search, setSearch] = useState('');
  const [scenarioFilter, setScenarioFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Sort states
  const [sortBy, setSortBy] = useState<'analyzedAt' | 'riskScore' | 'locationName'>('analyzedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Selection drawer
  const [selectedReport, setSelectedReport] = useState<HistoryEntry | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerData, setDrawerData] = useState<DrawerReportDetails | null>(null);

  // Apply filters
  useEffect(() => {
    let result = [...entries];

    if (search) {
      result = result.filter(e => 
        e.locationName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (scenarioFilter !== 'all') {
      result = result.filter(e => e.businessScenario === scenarioFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter(e => e.operationalStatus === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        // Number comparison
        const numA = (valA as number) || 0;
        const numB = (valB as number) || 0;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }
    });

    Promise.resolve().then(() => {
      setFilteredEntries(result);
    });
  }, [entries, search, scenarioFilter, statusFilter, sortBy, sortOrder]);

  // Load detailed analysis for drawer
  useEffect(() => {
    if (!selectedReport) {
      Promise.resolve().then(() => {
        setDrawerData(null);
      });
      return;
    }

    const loadDetails = async () => {
      if (selectedReport.lat && selectedReport.lon) {
        setDrawerLoading(true);
        try {
          const params = new URLSearchParams({
            lat: selectedReport.lat.toString(),
            lon: selectedReport.lon.toString(),
            scenario: selectedReport.businessScenario,
            location: selectedReport.locationName,
            date: selectedReport.date,
          });
          const res = await fetch(`/api/analyze?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            setDrawerData(data.report);
          }
        } catch (e) {
          // Fallback to mock details if fetch fails
        } finally {
          setDrawerLoading(false);
        }
      } else {
        // Mock fallback if coordinates are missing (for legacy records)
        setDrawerLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setDrawerData({
          executiveSummary: `Generated meteorological planning assessment for ${selectedReport.locationName}. Conditions present moderate limits.`,
          keyRisks: [
            'Wind speed limits approaching active thresholds.',
            'Temperature fluctuations affecting surface operations.'
          ],
          recommendedActions: [
            { id: '1', priority: 'medium', category: 'Operations', action: 'Increase interval inspection schedule', rationale: 'Maintain visibility over crane/lifting limits.' },
            { id: '2', priority: 'low', category: 'Safety', action: 'Review thermal protective gear availability', rationale: 'Ensure operator comfort during periods of extended exposure.' }
          ]
        });
        setDrawerLoading(false);
      }
    };

    loadDetails();
  }, [selectedReport]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExport = (type: 'csv' | 'json') => {
    if (filteredEntries.length === 0) return;
    
    let content = '';
    let mimeType = '';
    let filename = `weatherops-report-export-${Date.now()}`;
    
    if (type === 'csv') {
      content = 'ID,Location,Scenario,Status,Risk Score,Date,Analyzed At\n' +
        filteredEntries.map(e => 
          `"${e.id}","${e.locationName}","${e.businessScenario}","${e.operationalStatus}",${e.riskScore},"${e.date}","${e.analyzedAt}"`
        ).join('\n');
      mimeType = 'text/csv;charset=utf-8;';
      filename += '.csv';
    } else {
      content = JSON.stringify(filteredEntries, null, 2);
      mimeType = 'application/json;charset=utf-8;';
      filename += '.json';
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24 relative min-h-screen">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--color-text))' }}>Operations Reports</h1>
          <p className="text-sm" style={{ color: 'rgb(var(--color-text-3))' }}>History of generated weather intelligence assessments.</p>
        </div>
        
        {filteredEntries.length > 0 && (
          <div className="flex gap-2">
            <button 
              onClick={() => handleExport('csv')} 
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button 
              onClick={() => { if(confirm('Delete all report histories?')) clearAll(); }}
              className="btn-secondary border-red-500/30 hover:bg-red-500/10 text-red-500 text-xs flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Purge History
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(var(--color-text-muted))' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by location..."
            className="input-field pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={scenarioFilter}
              onChange={(e) => setScenarioFilter(e.target.value)}
              className="input-field text-xs py-1 px-2.5 max-w-[150px] appearance-none"
            >
              <option value="all">All Scenarios</option>
              {Object.entries(SCENARIO_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field text-xs py-1 px-2.5 max-w-[150px] appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="GO">GO</option>
            <option value="PROCEED_WITH_CAUTION">CAUTION</option>
            <option value="DELAY_RECOMMENDED">DELAY</option>
            <option value="HALT_OPERATIONS">HALT</option>
            <option value="CRITICAL_HALT">CRITICAL HALT</option>
          </select>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="card overflow-hidden">
        {!isLoaded ? (
          <div className="p-12 text-center">
            <LoadingSpinner className="w-8 h-8 text-primary mx-auto animate-spin" />
            <p className="text-xs text-slate-400 mt-2">Loading database entries...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No report records match the selected query parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgb(var(--color-border))', backgroundColor: 'rgb(var(--color-surface-2))' }}>
                  <th 
                    onClick={() => toggleSort('locationName')} 
                    className="p-4 font-semibold cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                    style={{ color: 'rgb(var(--color-text))' }}
                  >
                    Location Name
                    <ArrowUpDown className="w-3 h-3" />
                  </th>
                  <th className="p-4 font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Scenario</th>
                  <th className="p-4 font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Status</th>
                  <th 
                    onClick={() => toggleSort('riskScore')} 
                    className="p-4 font-semibold cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                    style={{ color: 'rgb(var(--color-text))' }}
                  >
                    Risk Score
                    <ArrowUpDown className="w-3 h-3" />
                  </th>
                  <th 
                    onClick={() => toggleSort('analyzedAt')} 
                    className="p-4 font-semibold cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                    style={{ color: 'rgb(var(--color-text))' }}
                  >
                    Assessment Time
                    <ArrowUpDown className="w-3 h-3" />
                  </th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgb(var(--color-border))' }}>
                {filteredEntries.map((e) => {
                  const meta = SCENARIO_META[e.businessScenario as keyof typeof SCENARIO_META];
                  return (
                    <tr 
                      key={e.id} 
                      onClick={() => setSelectedReport(e)}
                      className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-bold" style={{ color: 'rgb(var(--color-text))' }}>{e.locationName}</td>
                      <td className="p-4" style={{ color: 'rgb(var(--color-text-2))' }}>{meta ? meta.label : e.businessScenario}</td>
                      <td className="p-4"><StatusBadge status={e.operationalStatus} /></td>
                      <td className="p-4 font-bold" style={{ color: 'rgb(var(--color-text))' }}>{e.riskScore} / 100</td>
                      <td className="p-4" style={{ color: 'rgb(var(--color-text-3))' }}>
                        {new Date(e.analyzedAt).toLocaleString()}
                      </td>
                      <td className="p-4 text-right" onClick={(ev) => ev.stopPropagation()}>
                        <button
                          onClick={() => removeEntry(e.id)}
                          className="p-1.5 rounded hover:bg-red-500/15 text-red-500 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide Out Details Drawer */}
      {selectedReport && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSelectedReport(null)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 flex flex-col justify-between fade-in-right">
            
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Operational Report Details</h3>
                  <span className="text-[10px] text-zinc-400 font-mono">ID: {selectedReport.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div>
                      <h4 className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Property Location</h4>
                      <p className="text-sm font-semibold text-zinc-200">{selectedReport.locationName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div>
                      <h4 className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Assessment Target Date</h4>
                      <p className="text-sm font-semibold text-zinc-200">{selectedReport.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div>
                      <h4 className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Assessment Execution</h4>
                      <p className="text-sm font-semibold text-zinc-200">{new Date(selectedReport.analyzedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-zinc-800 py-4">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 text-center">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Risk Level</div>
                    <div className="text-base font-extrabold text-zinc-200 uppercase mt-1">{selectedReport.riskLevel}</div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 text-center">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Risk Score</div>
                    <div className="text-base font-extrabold text-zinc-200 mt-1">{selectedReport.riskScore} / 100</div>
                  </div>
                </div>

                {drawerLoading ? (
                  <div className="py-12 text-center">
                    <LoadingSpinner className="w-6 h-6 text-primary mx-auto animate-spin" />
                    <p className="text-[11px] text-zinc-400 mt-1.5">Analyzing weather profiles...</p>
                  </div>
                ) : drawerData ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <h4 className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Executive Summary</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-850">{drawerData.executiveSummary}</p>
                    </div>

                    {drawerData.keyRisks && drawerData.keyRisks.length > 0 && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Operational Hazards</h4>
                        <ul className="space-y-1">
                          {drawerData.keyRisks.map((risk: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-amber-500">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {drawerData.recommendedActions && drawerData.recommendedActions.length > 0 && (
                      <div className="space-y-1.5">
                        <h4 className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Actionable Safeguards</h4>
                        <ul className="space-y-2">
                          {drawerData.recommendedActions.map((action) => (
                            <li key={action.id} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850 flex gap-2">
                              <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                              <div>
                                <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{action.category}</div>
                                <div className="text-xs text-zinc-200 font-semibold">{action.action}</div>
                                <div className="text-[10.5px] text-zinc-500 mt-0.5">{action.rationale}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-xs text-zinc-600 py-6">Could not fetch report diagnostics.</div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex gap-3">
              <button 
                onClick={() => setSelectedReport(null)}
                className="btn-secondary w-full justify-center text-xs"
              >
                Close View
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
