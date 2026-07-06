'use client';

import React, { useState } from 'react';
import { HelpCircle, Mail, BookOpen, Send, PhoneCall, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/shared/ToastProvider';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const DOCS_SECTIONS = [
  {
    title: 'Getting Started Guide',
    links: [
      { name: 'System Overview & Control Architecture', desc: 'Introduction to operational weather metrics vs standard weather maps.' },
      { name: 'Configuring Property Geocodes', desc: 'How to monitor specific transit bays, warehouses, or building sites.' },
      { name: 'Integrating Webhook Warnings', desc: 'Dispatch notifications automatically to site supervisor SMS feeds.' }
    ]
  },
  {
    title: 'Formula Specifications',
    links: [
      { name: 'Scoring Penalties Formula', desc: 'Understanding penalty point weights for crane wind speed, rainfall, and thermal safety.' },
      { name: 'Diurnal Analysis Planning', desc: 'Using chronological forecast cards to identify operating windows.' }
    ]
  }
];

const FAQS = [
  {
    q: 'How frequently does WeatherOps refresh meteorological data?',
    a: 'WeatherOps syncs directly with raw WeatherAI API clusters. We pull fresh data updates every 15 minutes, with automated dispatch updates running on 1-hour intervals.'
  },
  {
    q: 'Can we define separate wind limits for different crane models?',
    a: 'Yes. In the Threshold Settings console, you can register custom thresholds mapping specific limit parameters for individual sites and crane sizes.'
  },
  {
    q: 'Is there offline support or reports download capabilities?',
    a: 'Absolutely. The Operations Reports console allows exporting historical assessments as standalone CSV or JSON files for local inspection.'
  }
];

export default function HelpCenterPage() {
  const { toast } = useToast();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Ticket Form States
  const [subject, setSubject] = useState('');
  const [scenario, setScenario] = useState('construction');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast({ title: 'Error', message: 'Please fill in all support ticket fields.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    // Mock latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({ 
      title: 'Ticket Submitted', 
      message: 'Operator support ticket has been dispatched. Dispatch reference ID: #WOP-' + Math.floor(Math.random() * 9000 + 1000), 
      type: 'success' 
    });

    setSubject('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
          <HelpCircle className="w-6 h-6 text-indigo-400" />
          Operator Support Center
        </h1>
        <p className="text-sm" style={{ color: 'rgb(var(--color-text-3))' }}>
          System documentation, FAQ indexes, and direct developer communication channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left pane: Docs & FAQ */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Docs Section */}
          <div className="card p-5 space-y-4">
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" /> System Manuals & Documentation
            </h2>
            <div className="space-y-4">
              {DOCS_SECTIONS.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300">{section.title}</h3>
                  <div className="space-y-2">
                    {section.links.map((link, i) => (
                      <a 
                        key={i} 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert('Manual layout mock'); }}
                        className="block bg-zinc-950/40 p-3 rounded-lg border border-zinc-900/60 hover:border-indigo-500/30 transition-colors text-left"
                      >
                        <div className="text-xs font-semibold text-zinc-200">{link.name}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{link.desc}</div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="card p-5 space-y-4">
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" /> FAQ Search Index
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const active = activeFaq === index;
                return (
                  <div key={index} className="border border-zinc-900 bg-zinc-950/20 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(active ? null : index)}
                      className="w-full text-left px-4 py-3 flex items-center justify-between text-zinc-200 hover:text-white transition-colors"
                    >
                      <span className="text-xs font-semibold">{faq.q}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${active ? 'rotate-180' : ''}`} />
                    </button>
                    {active && (
                      <div className="px-4 pb-3 pt-0.5 border-t border-zinc-900/50">
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right pane: Ticket Contact Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmitTicket} className="card p-5 space-y-4 relative">
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500" /> Dispatch Support Ticket
            </h2>
            
            <p className="text-[11px] text-zinc-500 leading-normal">
              Experiencing grid processing delays or require api key upgrades? Dispatch a direct support ticket to active support team.
            </p>

            <div className="space-y-3">
              <div>
                <label className="label">Ticket Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Requesting manual threshold overrides specs"
                  className="input-field text-xs py-1.5"
                  required
                />
              </div>

              <div>
                <label className="label">Focus Scenario</label>
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="input-field text-xs py-1.5 appearance-none bg-transparent"
                >
                  <option value="general">General Operations</option>
                  <option value="construction">Construction & Cranes</option>
                  <option value="logistics">Logistics Fleets</option>
                  <option value="utilities">Utility Systems</option>
                </select>
              </div>

              <div>
                <label className="label">Mitigation Request Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Provide details of the meteorological query or technical exception..."
                  className="input-field text-xs py-2 w-full resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="w-3.5 h-3.5 text-white animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Support Ticket
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Hot Contact Info */}
          <div className="card p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 shrink-0">
              <PhoneCall className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Enterprise Hotline</div>
              <div className="text-xs font-bold text-zinc-300">+1 (800) WEATHEROPS</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
