'use client';

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useHistory } from '@/hooks/useHistory';
import { useToast } from '@/components/shared/ToastProvider';
import { AnalysisForm } from '@/components/analysis/AnalysisForm';
import { ExecutiveSummary } from '@/components/analysis/ExecutiveSummary';
import { WeatherDetailsCard } from '@/components/analysis/WeatherDetailsCard';
import { AlertsPanel } from '@/components/analysis/AlertsPanel';
import { TimelinePanel } from '@/components/analysis/TimelinePanel';
import { ImpactAnalysis } from '@/components/analysis/ImpactAnalysis';
import { RecommendedActions } from '@/components/analysis/RecommendedActions';
import { ForecastComparison } from '@/components/analysis/ForecastComparison';
import { EmptyState } from '@/components/shared/EmptyState';
import { FlaskConical, AlertCircle, Printer, LayoutGrid, CalendarRange, Thermometer, ShieldAlert } from 'lucide-react';
import { AnalysisFormValues, BusinessScenario } from '@/types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const { state, analyze } = useAnalysis();
  const { addEntry } = useHistory();
  const { toast } = useToast();
  const hasAutoRun = useRef(false);
  const [activeTab, setActiveTab] = useState<'decision' | 'impact' | 'outlook' | 'meteorology'>('decision');

  const initialValues: Partial<AnalysisFormValues> = {
    locationName: searchParams.get('location') || '',
    lat: searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined,
    lon: searchParams.get('lon') ? parseFloat(searchParams.get('lon')!) : undefined,
    date: searchParams.get('date') || undefined,
    businessScenario: (searchParams.get('scenario') as BusinessScenario) || undefined,
  };

  const handleAnalyze = useCallback(async (values: AnalysisFormValues) => {
    const report = await analyze(values);
    if (report) {
      addEntry({
        id: `hist-${Date.now()}`,
        businessScenario: report.businessScenario,
        locationName: report.locationName,
        date: report.date,
        analyzedAt: report.generatedAt,
        riskScore: report.riskScore.value,
        riskLevel: report.riskScore.level,
        operationalStatus: report.operationalStatus,
        lat: values.lat,
        lon: values.lon,
      });
      toast({ title: 'Analysis Complete', message: 'Report generated successfully.', type: 'success' });
    } else {
      toast({ title: 'Analysis Failed', message: 'Please try again later.', type: 'error' });
    }
  }, [analyze, addEntry, toast]);

  useEffect(() => {
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    const location = searchParams.get('location') || '';
    const scenario = (searchParams.get('scenario') as BusinessScenario) || 'construction';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (latStr && lonStr && !hasAutoRun.current) {
      hasAutoRun.current = true;
      const lat = parseFloat(latStr);
      const lon = parseFloat(lonStr);
      
      handleAnalyze({
        locationName: location,
        lat,
        lon,
        date,
        businessScenario: scenario,
        units: 'metric'
      });
    }
  }, [searchParams, handleAnalyze]);

  const handlePrint = () => {
    window.print();
  };

  // Recharts forecast data computation
  const forecastChartData = state.status === 'success' ? state.forecast.slice(0, 3).map(day => ({
    name: day.dayLabel,
    'Max Temp (°C)': Math.round(day.tempMax),
    'Min Temp (°C)': Math.round(day.tempMin),
    'Rain Prob (%)': Math.round(day.rainProbability),
  })) : [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
      <div className="mb-6 flex justify-between items-end no-print">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--color-text))' }}>Run Analysis</h1>
          <p className="text-sm" style={{ color: 'rgb(var(--color-text-3))' }}>Analyze weather conditions for your business operations.</p>
        </div>
        {state.status === 'success' && (
          <button onClick={handlePrint} className="btn-secondary hidden sm:flex">
            <Printer className="w-4 h-4" /> Print Report
          </button>
        )}
      </div>

      <div className="no-print mb-8">
        <AnalysisForm 
          onSubmit={handleAnalyze} 
          isLoading={state.status === 'loading'} 
          initialValues={initialValues} 
        />
      </div>

      {state.status === 'idle' && (
        <EmptyState 
          icon={<FlaskConical />}
          title="Ready for Analysis"
          description="Select a location and business scenario above to generate an operational report."
        />
      )}

      {state.status === 'error' && (
        <EmptyState 
          icon={<AlertCircle className="text-red-500" />}
          title="Analysis Failed"
          description={state.message}
        />
      )}

      {state.status === 'success' && (
        <div className="space-y-6">
          <div className="hidden print:block mb-8">
            <h1 className="text-3xl font-bold mb-2 text-black">WeatherOps Report</h1>
            <p className="text-gray-600">Location: {state.report.locationName} • Date: {state.report.date}</p>
          </div>

          <ExecutiveSummary report={state.report} />

          {/* Tab Selection */}
          <div className="flex border-b mb-6 no-print" style={{ borderColor: 'rgb(var(--color-border))' }}>
            <button
              onClick={() => setActiveTab('decision')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px flex items-center gap-2 ${
                activeTab === 'decision'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4" /> Decision Center
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px flex items-center gap-2 ${
                activeTab === 'impact'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Department Impacts
            </button>
            <button
              onClick={() => setActiveTab('outlook')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px flex items-center gap-2 ${
                activeTab === 'outlook'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <CalendarRange className="w-4 h-4" /> Chronological Outlook
            </button>
            <button
              onClick={() => setActiveTab('meteorology')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px flex items-center gap-2 ${
                activeTab === 'meteorology'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Thermometer className="w-4 h-4" /> Raw Meteorology
            </button>
          </div>

          {/* Dynamic Tab Panels */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* Tab 1: Decision Center */}
            {(activeTab === 'decision' || typeof window === 'undefined') && (
              <div className="space-y-6 fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RecommendedActions actions={state.report.recommendedActions} />
                  </div>
                  <div className="space-y-6">
                    <AlertsPanel alerts={state.report.alerts} />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Department Impact */}
            {activeTab === 'impact' && (
              <div className="fade-in-up">
                <ImpactAnalysis impacts={state.report.impactAreas} />
              </div>
            )}

            {/* Tab 3: Chronological Outlook & Trends */}
            {activeTab === 'outlook' && (
              <div className="space-y-6 fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Recharts Forecast Graph */}
                  <div className="lg:col-span-7 card p-5">
                    <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>3-Day Meteorological Trends</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecastChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border), 0.5)" vertical={false} />
                          <XAxis dataKey="name" stroke="rgb(var(--color-text-3))" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgb(var(--color-text-3))" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgb(var(--color-surface))', 
                              borderColor: 'rgb(var(--color-border))',
                              borderRadius: '8px',
                              color: 'rgb(var(--color-text))'
                            }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                          <Area type="monotone" dataKey="Max Temp (°C)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
                          <Area type="monotone" dataKey="Rain Prob (%)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRain)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <ForecastComparison forecast={state.forecast} />
                  </div>
                </div>

                <TimelinePanel timeline={state.report.timeline} />
              </div>
            )}

            {/* Tab 4: Raw Meteorology */}
            {activeTab === 'meteorology' && (
              <div className="fade-in-up">
                <WeatherDetailsCard weather={state.weather} />
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading analysis interface...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
