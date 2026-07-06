'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  LayoutDashboard, FlaskConical, History, ChevronLeft, ChevronRight,
  CloudSun, Sun, Moon, Menu, Activity, Settings, Bell, Search, 
  User, LogOut, AlertOctagon, Layers, BarChart3, HelpCircle, X, Command
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analyze', label: 'Analyze', icon: FlaskConical },
  { href: '/reports', label: 'Reports Feed', icon: History },
  { href: '/alerts', label: 'Weather Alerts', icon: AlertOctagon },
  { href: '/scenarios', label: 'Scenario Library', icon: Layers },
  { href: '/analytics', label: 'System Analytics', icon: BarChart3 },
  { href: '/settings', label: 'System Settings', icon: Settings },
  { href: '/help', label: 'Help Center', icon: HelpCircle },
];

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-success'];

interface SystemNotification {
  id: string;
  title: string;
  type: 'critical' | 'warning' | 'info';
  time: string;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // Header dropdown states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    { id: '1', title: 'Seattle Fulfilment wind warning active', type: 'warning', time: '10m ago' },
    { id: '2', title: 'Denver scaffolding risk reached critical limits', type: 'critical', time: '1h ago' },
    { id: '3', title: 'New monitored site registered: Houston Refinery', type: 'info', time: '4h ago' }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    
    Promise.resolve().then(() => {
      setIsDark(dark);
    });
  }, []);

  // Ctrl+K to toggle search command bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  if (isPublic) {
    return <>{children}</>;
  }

  const filteredCommands = NAV_ITEMS.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden text-slate-800 dark:text-slate-100" style={{ background: 'rgb(var(--color-bg))' }}>
        
        {/* Mobile Sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        {/* Collapsible Sidebar */}
        <aside
          className={`
            fixed lg:relative z-50 lg:z-auto h-full flex flex-col shrink-0
            transition-all duration-300 ease-in-out
            ${collapsed ? 'w-16' : 'w-60'}
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{
            background: 'rgb(var(--color-surface))',
            borderRight: '1px solid rgb(var(--color-border))',
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid rgb(var(--color-border))' }}>
            <div className={`flex items-center gap-2.5 overflow-hidden ${collapsed ? 'w-0' : 'w-full'}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgb(var(--color-primary))', boxShadow: '0 2px 8px rgb(79 70 229 / 0.35)' }}>
                <CloudSun className="w-4 h-4 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <div className="font-bold text-sm" style={{ color: 'rgb(var(--color-text))' }}>WeatherOps</div>
                  <div className="text-[10px] tracking-wider uppercase font-bold" style={{ color: 'rgb(var(--color-text-muted))' }}>Control Room</div>
                </div>
              )}
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md transition-colors shrink-0"
              style={{ color: 'rgb(var(--color-text-3))' }}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {NAV_ITEMS.map(item => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`nav-item ${active ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="text-xs font-semibold">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer Info */}
          <div className="p-3 space-y-2" style={{ borderTop: '1px solid rgb(var(--color-border))' }}>
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: 'rgb(var(--color-surface-2))' }}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10.5px] font-semibold" style={{ color: 'rgb(var(--color-text-3))' }}>
                  <Activity className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
                  Operator Connected
                </span>
              </div>
            )}
            <button
              onClick={toggleTheme}
              className={`nav-item ${collapsed ? 'justify-center px-0' : ''}`}
            >
              {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
              {!collapsed && <span className="text-xs font-semibold">{isDark ? 'Light Theme' : 'Dark Theme'}</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Top Navigation Header */}
          <header className="flex items-center justify-between px-6 py-3 border-b shrink-0 relative"
            style={{ background: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}>
            
            {/* Left Header: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden" style={{ color: 'rgb(var(--color-text-3))' }}>
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>WEATHEROPS SYSTEM STATUS:</span>
                <span className="text-emerald-500 font-bold">ONLINE</span>
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-4">
              
              {/* Command Search Button */}
              <button 
                onClick={() => setSearchOpen(true)} 
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs bg-zinc-950/20 text-slate-400 hover:text-slate-200 transition-colors"
                style={{ borderColor: 'rgb(var(--color-border))' }}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search dashboard...</span>
                <span className="bg-zinc-800 text-[10px] px-1.5 py-0.5 rounded font-mono border border-zinc-700">Ctrl K</span>
              </button>

              <button onClick={() => setSearchOpen(true)} className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-black/5 dark:hover:bg-white/5">
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Notification Center */}
              <div className="relative">
                <button 
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 relative"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 rounded-xl border shadow-xl z-40 p-4"
                      style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(var(--color-text))' }}>Active Dispatch warnings</h4>
                        {notifications.length > 0 && (
                          <button onClick={() => setNotifications([])} className="text-[10px] text-indigo-400 hover:text-indigo-300">Dismiss All</button>
                        )}
                      </div>
                      <div className="divide-y max-h-60 overflow-y-auto" style={{ borderColor: 'rgb(var(--color-border))' }}>
                        {notifications.map((notif) => (
                          <div key={notif.id} className="py-2.5 flex items-start gap-2.5 first:pt-0 last:pb-0">
                            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'critical' ? 'bg-red-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs leading-normal font-semibold truncate" style={{ color: 'rgb(var(--color-text))' }}>{notif.title}</p>
                              <span className="text-[10px] text-slate-400">{notif.time}</span>
                            </div>
                          </div>
                        ))}
                        {notifications.length === 0 && (
                          <p className="text-xs py-4 text-center text-slate-500">No active alerts at present.</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile Avatar Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 p-1.5 rounded-lg text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {user?.name ? user.name[0] : 'O'}
                  </div>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border shadow-xl z-40 py-1.5"
                      style={{ backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))' }}>
                      <div className="px-4 py-2 border-b" style={{ borderColor: 'rgb(var(--color-border))' }}>
                        <div className="text-xs font-bold truncate" style={{ color: 'rgb(var(--color-text))' }}>{user?.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                      </div>
                      <Link 
                        href="/settings" 
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-semibold"
                        style={{ color: 'rgb(var(--color-text))' }}
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Operator Profile
                      </Link>
                      <button 
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs hover:bg-red-500/10 text-red-500 transition-colors font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-zinc-950">
            {children}
          </main>
        </div>
      </div>

      {/* Global Command Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setSearchOpen(false)} />
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-10 overflow-hidden">
            <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
              <Command className="w-4 h-4 text-indigo-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search command center modules..."
                className="w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto p-2">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold px-3 py-1 mb-1.5">Navigation</div>
              {filteredCommands.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                    router.push(item.href);
                  }}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-600/10 text-xs font-semibold text-zinc-300 hover:text-indigo-400 transition-colors"
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              ))}
              {filteredCommands.length === 0 && (
                <div className="text-xs text-center py-4 text-zinc-600">No navigation commands found matching query.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
