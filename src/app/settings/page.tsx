'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/shared/ToastProvider';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useAuth } from '@/components/auth/AuthContext';
import { Settings, Save, Trash2, Plus, MapPin, Briefcase, RefreshCw, User, Bell, Shield, Languages } from 'lucide-react';
import { SCENARIO_META } from '@/lib/constants';

interface Thresholds {
  constructionWindLimit: number;
  constructionWindWarning: number;
  constructionRainLimit: number;
  constructionRainWarning: number;
  constructionTempMaxLimit: number;
  constructionTempMaxWarning: number;
  constructionTempMinLimit: number;
}

const DEFAULT_THRESHOLDS: Thresholds = {
  constructionWindLimit: 14,
  constructionWindWarning: 10,
  constructionRainLimit: 25,
  constructionRainWarning: 10,
  constructionTempMaxLimit: 38,
  constructionTempMaxWarning: 34,
  constructionTempMinLimit: 2,
};

interface MonitoredAsset {
  id: string;
  name: string;
  lat: number;
  lon: number;
  scenario: string;
  scenarioLabel: string;
}

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { search, results, isLoading: isGeocoding, clear } = useGeocoding();
  const [activeTab, setActiveTab] = useState<'profile' | 'thresholds' | 'assets' | 'general'>('profile');

  // Core settings state
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);
  const [assets, setAssets] = useState<MonitoredAsset[]>([]);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  
  // Profile settings state
  const [profileName, setProfileName] = useState('');
  const [profileCompany, setProfileCompany] = useState('');
  const [profileRole, setProfileRole] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // General settings state
  const [lang, setLang] = useState('en');
  const [notifSms, setNotifSms] = useState(true);
  const [notifSlack, setNotifSlack] = useState(false);
  const [notifWeekly, setNotifWeekly] = useState(true);

  // Asset creation form state
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetLat, setNewAssetLat] = useState<number | null>(null);
  const [newAssetLon, setNewAssetLon] = useState<number | null>(null);
  const [newAssetScenario, setNewAssetScenario] = useState('construction');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    let nameVal = '';
    let companyVal = '';
    let roleVal = '';
    let emailVal = '';
    if (user) {
      nameVal = user.name;
      companyVal = user.companyName;
      roleVal = user.role;
      emailVal = user.email;
    }

    let savedThresholdsParsed = DEFAULT_THRESHOLDS;
    const savedThresholds = localStorage.getItem('WEATHEROPS_SETTINGS_THRESHOLDS');
    if (savedThresholds) {
      try { savedThresholdsParsed = JSON.parse(savedThresholds); } catch (e) {}
    }

    let savedAssetsParsed: MonitoredAsset[] = [];
    const savedAssets = localStorage.getItem('WEATHEROPS_SETTINGS_ASSETS');
    if (savedAssets) {
      try { savedAssetsParsed = JSON.parse(savedAssets); } catch (e) {}
    } else {
      savedAssetsParsed = [
        { id: '1', name: 'Seattle Fulfillment Center', lat: 47.6062, lon: -122.3321, scenario: 'delivery_fleet', scenarioLabel: 'Logistics' },
        { id: '2', name: 'Houston Refining Facility', lat: 29.7604, lon: -95.3698, scenario: 'utility_maintenance', scenarioLabel: 'Utility Maintenance' },
      ];
    }

    let savedUnitsParsed: 'metric' | 'imperial' = 'metric';
    const savedUnits = localStorage.getItem('WEATHEROPS_SETTINGS_UNITS');
    if (savedUnits) {
      savedUnitsParsed = savedUnits as 'metric' | 'imperial';
    }

    Promise.resolve().then(() => {
      setProfileName(nameVal);
      setProfileCompany(companyVal);
      setProfileRole(roleVal);
      setProfileEmail(emailVal);
      setThresholds(savedThresholdsParsed);
      setAssets(savedAssetsParsed);
      setUnits(savedUnitsParsed);
    });
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API update
    toast({ title: 'Profile Updated', message: 'Operator credentials saved successfully.', type: 'success' });
  };

  const handleSaveThresholds = () => {
    localStorage.setItem('WEATHEROPS_SETTINGS_THRESHOLDS', JSON.stringify(thresholds));
    toast({ title: 'Settings Saved', message: 'Operational thresholds updated successfully.', type: 'success' });
  };

  const handleResetThresholds = () => {
    if (confirm('Reset all thresholds to default factory specifications?')) {
      setThresholds(DEFAULT_THRESHOLDS);
      localStorage.setItem('WEATHEROPS_SETTINGS_THRESHOLDS', JSON.stringify(DEFAULT_THRESHOLDS));
      toast({ title: 'Settings Reset', message: 'Thresholds reverted to defaults.', type: 'success' });
    }
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetLat || !newAssetLon || !newAssetName) {
      toast({ title: 'Error', message: 'Please search and select a valid location.', type: 'error' });
      return;
    }

    const scenarioMeta = SCENARIO_META[newAssetScenario as keyof typeof SCENARIO_META];
    const newAsset = {
      id: `asset-${Date.now()}`,
      name: newAssetName,
      lat: newAssetLat,
      lon: newAssetLon,
      scenario: newAssetScenario,
      scenarioLabel: scenarioMeta ? scenarioMeta.label : 'General Operations',
    };

    const updated = [...assets, newAsset];
    setAssets(updated);
    localStorage.setItem('WEATHEROPS_SETTINGS_ASSETS', JSON.stringify(updated));

    setNewAssetName('');
    setNewAssetLat(null);
    setNewAssetLon(null);
    toast({ title: 'Asset Added', message: `${newAsset.name} is now monitored.`, type: 'success' });
  };

  const handleRemoveAsset = (id: string) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    localStorage.setItem('WEATHEROPS_SETTINGS_ASSETS', JSON.stringify(updated));
    toast({ title: 'Asset Removed', message: 'Asset removed from active monitoring feed.', type: 'success' });
  };

  const handleSaveGeneral = () => {
    localStorage.setItem('WEATHEROPS_SETTINGS_UNITS', units);
    toast({ title: 'Preferences Saved', message: 'General system configurations updated.', type: 'success' });
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
      
      {/* Page Title */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
            <Settings className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '8s' }} />
            System Settings & Preferences
          </h1>
          <p className="text-sm" style={{ color: 'rgb(var(--color-text-3))' }}>
            Configure corporate weather limits, active operator profiles, and general preferences.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6" style={{ borderColor: 'rgb(var(--color-border))' }}>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <User className="w-4 h-4" /> Operator Profile
        </button>
        <button
          onClick={() => setActiveTab('thresholds')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px flex items-center gap-2 ${
            activeTab === 'thresholds'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Shield className="w-4 h-4" /> Operational Thresholds
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px flex items-center gap-2 ${
            activeTab === 'assets'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <MapPin className="w-4 h-4" /> Monitored Properties
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px flex items-center gap-2 ${
            activeTab === 'general'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Bell className="w-4 h-4" /> Configuration & Notifications
        </button>
      </div>

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 fade-in-up">
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">Operator Identity Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Operator Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Monitored Organization</label>
                <input
                  type="text"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">System Access Role</label>
                <input
                  type="text"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="input-field"
                  disabled
                />
                <p className="text-[10px] text-zinc-500 mt-1">Role assignments can only be configured by organizational admin accounts.</p>
              </div>

              <div>
                <label className="label">Registered Email</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">Security & Credentials Reset</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">New Security Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-primary">
              <Save className="w-4 h-4" /> Save Operator Settings
            </button>
          </div>
        </form>
      )}

      {/* Threshold Config */}
      {activeTab === 'thresholds' && (
        <div className="space-y-6 fade-in-up">
          <div className="card p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
              🏗️ Construction Site Thresholds (Metric)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="label">Max Crane Wind Speed Limit (m/s)</label>
                <input
                  type="number"
                  value={thresholds.constructionWindLimit}
                  onChange={(e) => setThresholds({ ...thresholds, constructionWindLimit: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                />
                <p className="text-[11px] mt-1" style={{ color: 'rgb(var(--color-text-3))' }}>Default limit is 14 m/s. Exceeding this triggers a CRITICAL stop alert.</p>
              </div>

              <div>
                <label className="label">Wind Speed Warning Advisory (m/s)</label>
                <input
                  type="number"
                  value={thresholds.constructionWindWarning}
                  onChange={(e) => setThresholds({ ...thresholds, constructionWindWarning: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                />
                <p className="text-[11px] mt-1" style={{ color: 'rgb(var(--color-text-3))' }}>Default limit is 10 m/s. Exceeding this triggers a WARNING watch advisory.</p>
              </div>

              <div>
                <label className="label">Max Daily Rainfall Limit (mm)</label>
                <input
                  type="number"
                  value={thresholds.constructionRainLimit}
                  onChange={(e) => setThresholds({ ...thresholds, constructionRainLimit: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                />
                <p className="text-[11px] mt-1" style={{ color: 'rgb(var(--color-text-3))' }}>Default limit is 25 mm. High rain affects concrete quality and structural scaffolding safety.</p>
              </div>

              <div>
                <label className="label">Worker Safety Max Temperature Limit (°C)</label>
                <input
                  type="number"
                  value={thresholds.constructionTempMaxLimit}
                  onChange={(e) => setThresholds({ ...thresholds, constructionTempMaxLimit: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                />
                <p className="text-[11px] mt-1" style={{ color: 'rgb(var(--color-text-3))' }}>Default limit is 38°C. Exceeding this triggers mandatory hydration shutdowns.</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t pt-4" style={{ borderColor: 'rgb(var(--color-border))' }}>
              <button onClick={handleResetThresholds} className="btn-secondary">
                <RefreshCw className="w-4 h-4" /> Reset Defaults
              </button>
              <button onClick={handleSaveThresholds} className="btn-primary">
                <Save className="w-4 h-4" /> Save Specifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Tracker Config */}
      {activeTab === 'assets' && (
        <div className="space-y-6 fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-5">
              <form onSubmit={handleAddAsset} className="card p-5 relative">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'rgb(var(--color-text))' }}>Register New Monitored Property</h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <label className="label">Location Name</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(var(--color-text-muted))' }} />
                      <input
                        type="text"
                        value={newAssetName}
                        onChange={(e) => {
                          setNewAssetName(e.target.value);
                          setShowResults(true);
                          search(e.target.value);
                        }}
                        onFocus={() => setShowResults(true)}
                        placeholder="Search city/facilities..."
                        className="input-field pl-9"
                        required
                      />
                    </div>

                    {showResults && results.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-50 max-h-48 overflow-y-auto" style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}>
                        {results.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setNewAssetName(r.displayName);
                              setNewAssetLat(r.lat);
                              setNewAssetLon(r.lon);
                              setShowResults(false);
                              clear();
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b last:border-b-0"
                            style={{ borderColor: 'rgb(var(--color-border))' }}
                          >
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{r.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{r.displayName}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="label">Operational Context (Scenario)</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ color: 'rgb(var(--color-text-muted))' }} />
                      <select
                        value={newAssetScenario}
                        onChange={(e) => setNewAssetScenario(e.target.value)}
                        className="input-field pl-9 appearance-none bg-transparent"
                      >
                        {Object.entries(SCENARIO_META).map(([key, meta]) => (
                          <option key={key} value={key} className="bg-surface text-primary">
                            {meta.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center mt-2"
                    disabled={!newAssetLat || !newAssetLon}
                  >
                    <Plus className="w-4 h-4" /> Add Asset Location
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-7">
              <div className="card overflow-hidden">
                <div className="p-4 border-b" style={{ borderColor: 'rgb(var(--color-border))', backgroundColor: 'rgb(var(--color-surface-2))' }}>
                  <h3 className="text-sm font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Active Monitored Fleet ({assets.length})</h3>
                </div>

                <div className="divide-y" style={{ borderColor: 'rgb(var(--color-border))' }}>
                  {assets.map((asset) => (
                    <div key={asset.id} className="flex justify-between items-center p-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                      <div className="min-w-0 pr-4">
                        <h4 className="text-sm font-semibold truncate" style={{ color: 'rgb(var(--color-text))' }}>{asset.name}</h4>
                        <div className="flex items-center gap-2 text-xs mt-1" style={{ color: 'rgb(var(--color-text-3))' }}>
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {asset.scenarioLabel}</span>
                          <span>•</span>
                          <span>Lat: {asset.lat.toFixed(3)}, Lon: {asset.lon.toFixed(3)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAsset(asset.id)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors shrink-0"
                        title="Remove Site Monitoring"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {assets.length === 0 && (
                    <div className="p-8 text-center" style={{ color: 'rgb(var(--color-text-3))' }}>
                      No custom properties registered for weather monitoring.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* General Configuration */}
      {activeTab === 'general' && (
        <div className="space-y-6 fade-in-up">
          
          {/* Layout unit tab */}
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">System Preferences & Localization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Measurement Standards</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'rgb(var(--color-text-2))' }}>
                    <input
                      type="radio"
                      name="units"
                      value="metric"
                      checked={units === 'metric'}
                      onChange={() => setUnits('metric')}
                      className="accent-primary"
                    />
                    Metric (C, m/s, mm)
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'rgb(var(--color-text-2))' }}>
                    <input
                      type="radio"
                      name="units"
                      value="imperial"
                      checked={units === 'imperial'}
                      onChange={() => setUnits('imperial')}
                      className="accent-primary"
                    />
                    Imperial (F, mph, in)
                  </label>
                </div>
              </div>

              <div>
                <label className="label flex items-center gap-1.5"><Languages className="w-4 h-4 text-indigo-400" /> Language Preferences</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="input-field text-xs mt-1 appearance-none bg-transparent"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications setup */}
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">Warning Webhook Dispatches</h3>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 dark:text-zinc-400 select-none">
                <input
                  type="checkbox"
                  checked={notifSms}
                  onChange={(e) => setNotifSms(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-800 text-indigo-500 focus:ring-0 mt-0.5"
                />
                <div>
                  <span className="font-semibold block text-zinc-200">SMS Safety Dispatch warnings</span>
                  <span className="text-[10px] text-zinc-500">Send critical limits violations alerts directly to monitored site operators&apos; phones.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 dark:text-zinc-400 select-none border-t border-zinc-900/60 pt-3">
                <input
                  type="checkbox"
                  checked={notifSlack}
                  onChange={(e) => setNotifSlack(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-800 text-indigo-500 focus:ring-0 mt-0.5"
                />
                <div>
                  <span className="font-semibold block text-zinc-200">Hourly Slack integration reports</span>
                  <span className="text-[10px] text-zinc-500">Post current risk score updates dynamically into active Slack channel feeds.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 dark:text-zinc-400 select-none border-t border-zinc-900/60 pt-3">
                <input
                  type="checkbox"
                  checked={notifWeekly}
                  onChange={(e) => setNotifWeekly(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-800 text-indigo-500 focus:ring-0 mt-0.5"
                />
                <div>
                  <span className="font-semibold block text-zinc-200">Weekly operational audit dispatch</span>
                  <span className="text-[10px] text-zinc-500">Receive comprehensive weekly summary tables of overall site clearances and delays.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={handleSaveGeneral} className="btn-primary">
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
