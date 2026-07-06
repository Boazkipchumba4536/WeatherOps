'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { 
  CloudSun, ShieldCheck, CheckCircle2, ChevronDown, 
  ArrowRight, Users, Activity, Play, Globe, HelpCircle, 
  Mail, Settings, Compass, Layers, CheckSquare
} from 'lucide-react';

const COMPANIES = ['Stripe', 'Linear', 'Vercel', 'Retool', 'Clerk', 'Notion'];

const FEATURES = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
    title: "Operational Risk Engine",
    description: "Calculates precise risk indicators for 13 industry verticals using real-time atmospheric data inputs."
  },
  {
    icon: <Settings className="w-5 h-5 text-emerald-400" />,
    title: "Custom Threshold Tuning",
    description: "Empower managers to override standard wind caps, worker temperature safety limits, and logistical rain levels."
  },
  {
    icon: <Activity className="w-5 h-5 text-blue-400" />,
    title: "Diurnal Timeline Forecast",
    description: "Inspect detailed risk timelines indicating exactly which hours are safe for site, marine, or aviation operations."
  },
  {
    icon: <Layers className="w-5 h-5 text-amber-400" />,
    title: "SaaS Command Radar",
    description: "Geographic visualizations mapping corporate monitored sites directly alongside active weather advisories."
  }
];

const PRICING_TIERS = [
  {
    name: "Base Control",
    price: "$199",
    period: "/mo",
    description: "Operational safety tools for smaller teams with localized properties.",
    features: [
      "Up to 5 monitored assets",
      "Standard threshold configs",
      "Email & Slack warning reports",
      "3-day chronological forecast trends",
      "API baseline access"
    ],
    cta: "Start Base Trial",
    popular: false
  },
  {
    name: "Enterprise Fleet",
    price: "$499",
    period: "/mo",
    description: "High-density operational planning across global transits and depots.",
    features: [
      "Monitored assets unlimited",
      "Custom scenario rules override",
      "SMS alerts + automated call dispatch",
      "10-day chronological forecast trends",
      "API premium access with SLAs",
      "Direct engineer support"
    ],
    cta: "Launch Fleet Command",
    popular: true
  }
];

const FAQS = [
  {
    q: "How does WeatherOps differ from normal dashboards?",
    a: "Standard weather dashboards show raw values like '14 m/s wind' or '38°C temp'. WeatherOps processes those values directly against custom scenario parameters to output actionable decisions, such as 'Halt Crane operations' or 'Enforce mandatory rest breaks'."
  },
  {
    q: "What is the source of truth for the meteorological feeds?",
    a: "We integrate directly with high-fidelity WeatherAI API pipelines, ensuring real-time globally accurate meteorological readings with rapid update frequencies."
  },
  {
    q: "Can we configure different thresholds for different sites?",
    a: "Yes! The system settings center allows defining specific limits for each property registered in the asset monitoring fleet."
  },
  {
    q: "Does WeatherOps offer localized notification rules?",
    a: "Yes. Dispatch parameters support localized SMS, email, and Slack webhooks, routed to site managers depending on active risk levels."
  }
];

export default function LandingPage() {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Dynamic Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)' }}>
              <CloudSun className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">WeatherOps</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
            <a href="#features" className="hover:text-zinc-200 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-zinc-200 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-zinc-200 transition-colors">FAQ</a>
            <Link href="/help" className="hover:text-zinc-200 transition-colors">Support</Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="btn-primary py-1.5 px-3.5 text-xs">
                Control Room <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary py-1.5 px-3.5 text-xs">
                  Register Operator <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col items-center text-center px-4 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[130px] -z-10" />
        <div className="absolute top-1/4 right-10 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800/80 rounded-full px-3 py-1 text-[10px] text-indigo-400 font-mono tracking-wider uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Operational Weather Intelligence
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-3xl mx-auto">
            Transform Raw Weather Data into <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Business Decisions</span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop interpreting reports. Automatically calculate risk levels, configure custom threshold parameters, and dispatch actionable checklists based on real-time meteorological calculations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href={user ? "/dashboard" : "/register"} className="btn-primary py-2.5 px-6 text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
              Launch Command Center <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#pricing" className="btn-secondary py-2.5 px-6 text-sm font-semibold text-zinc-300 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 w-full sm:w-auto justify-center">
              View Pricing Specifications
            </a>
          </div>
        </div>

        {/* Dashboard Mockup Image */}
        <div className="max-w-5xl mx-auto mt-16 px-4 relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-emerald-500/10 rounded-2xl blur-[60px] opacity-75 group-hover:opacity-100 transition-opacity" />
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden p-2 backdrop-blur-xl relative">
            <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-950 aspect-[16/9] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mx-auto border border-zinc-800 text-indigo-400">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <p className="text-xs text-zinc-500 font-mono">ENTERPRISE COMMAND PANEL FEED [SECURE]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Securing Logistics & Operations Globally</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-center opacity-50 hover:opacity-75 transition-opacity">
            {COMPANIES.map((company) => (
              <div key={company} className="text-sm font-semibold text-zinc-400 font-mono uppercase tracking-wider">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Engineered for Industrial Verticals</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Standard weather reports provide warnings for humans. WeatherOps calculates conditions against enterprise operational specs to make automated executive decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group hover:-translate-y-1 duration-300">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center mb-4 group-hover:scale-115 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-2">{feature.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works / Timeline */}
      <section className="py-20 bg-zinc-950/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">System Integration In 3 Steps</h2>
            <p className="text-xs sm:text-sm text-zinc-400">Deploy atmospheric intelligence capabilities across your organizational pipeline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 hidden md:block -z-10" />
            
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 text-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-sm flex items-center justify-center mx-auto">01</div>
              <h3 className="text-sm font-semibold text-zinc-200">Connect Coordinates</h3>
              <p className="text-xs text-zinc-400">Map depot, warehouse, or building coordinates directly in the monitored properties tracker.</p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 text-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-sm flex items-center justify-center mx-auto">02</div>
              <h3 className="text-sm font-semibold text-zinc-200">Tune Safe Thresholds</h3>
              <p className="text-xs text-zinc-400">Adjust acceptable speed boundaries, thermal worker limits, and precipitation variables.</p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 text-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-sm flex items-center justify-center mx-auto">03</div>
              <h3 className="text-sm font-semibold text-zinc-200">Receive Action Dispatches</h3>
              <p className="text-xs text-zinc-400">Get automated reports, alerts, checklist adjustments, and timeline calculations daily.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Flexible Enterprise Plans</h2>
          <p className="text-xs sm:text-sm text-zinc-400">Scale operational intelligence tools depending on monitored asset density.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRICING_TIERS.map((tier, idx) => (
            <div key={idx} className={`bg-zinc-900/30 border rounded-2xl p-6 flex flex-col justify-between relative ${tier.popular ? 'border-indigo-500/80 shadow-indigo-500/5 shadow-2xl' : 'border-zinc-800'}`}>
              {tier.popular && (
                <span className="absolute -top-3 left-6 bg-indigo-600 text-white font-mono uppercase text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider">Most Popular</span>
              )}
              <div>
                <h3 className="text-sm font-bold text-zinc-200 mb-1">{tier.name}</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">{tier.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                  <span className="text-xs text-zinc-500">{tier.period}</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-400 border-t border-zinc-800/80 pt-4 mb-6">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register" className={`w-full py-2.5 rounded-lg text-xs font-semibold text-center transition-all ${tier.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'}`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 bg-zinc-950/80">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-zinc-400">Everything you need to know about the WeatherOps decision pipeline.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const active = activeFaq === index;
              return (
                <div key={index} className="border border-zinc-800 bg-zinc-900/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(active ? null : index)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between text-zinc-200 hover:text-white transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${active ? 'rotate-180' : ''}`} />
                  </button>
                  {active && (
                    <div className="px-5 pb-4 pt-1 border-t border-zinc-800/80">
                      <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter signup */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="bg-gradient-to-r from-indigo-900/20 via-zinc-900 to-emerald-900/10 border border-zinc-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-emerald-500/5 blur-[80px]" />
          <div className="space-y-3 max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Subscribe to Risk Intelligence</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Get monthly newsletters containing weather anomalies, industrial risk calculations, and SaaS updates directly.
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed mockup'); }} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="operator@company.com"
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 w-full md:w-60"
              required
            />
            <button type="submit" className="btn-primary py-2 px-4 text-xs font-semibold whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)' }}>
                <CloudSun className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">WeatherOps</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Operational weather intelligence for businesses. We calculate risk indicators so you don&apos;t have to interpret raw readings.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px] mb-3">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-zinc-300">Features</a></li>
              <li><a href="#pricing" className="hover:text-zinc-300">Pricing</a></li>
              <li><Link href="/scenarios" className="hover:text-zinc-300">Scenario Rules</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px] mb-3">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="hover:text-zinc-300">Help Center</Link></li>
              <li><Link href="/help" className="hover:text-zinc-300">Contact Support</Link></li>
              <li><Link href="/help" className="hover:text-zinc-300">System Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px] mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-zinc-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-zinc-300">Terms of Operation</a></li>
              <li><a href="#" className="hover:text-zinc-300">Security Parameters</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} WeatherOps Technologies Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-300">Twitter</a>
            <a href="#" className="hover:text-zinc-300">GitHub</a>
            <a href="#" className="hover:text-zinc-300">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
