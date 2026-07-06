# WeatherOps
> **Operational Weather Intelligence for Businesses**

WeatherOps is a production-ready B2B SaaS platform engineered for companies that require weather-aware operational planning. Unlike consumer dashboards that display raw meteorological variables, WeatherOps automatically translates raw atmospheric readings from the high-fidelity WeatherAI API into actionable business decisions, safety indicators, and dispatch guidelines.

---

## 🚀 Key Capabilities

### 1. Automated Risk Engine
Calculates operational safety envelopes and risk indexes (0–100) across 6 primary industry verticals:
- **Construction & Cranes**: Lift height wind caps, precipitation thresholds, and cold-soaking steel parameters.
- **Logistics & Delivery**: Route surface pooling warnings, container crosswind sway metrics, and transit latency adjustments.
- **Agriculture & Spraying**: Spray drift wind speed limits, soil moisture saturation forecasts, and sun burn alerts.
- **Outdoor Events**: Scaffold anchoring parameters, lightning cell proximity evacuation triggers, and crowd shading/misting guidelines.
- **Utility Maintenance**: Line worker climbing caps, sub-zero equipment freeze alarms, and high-voltage grid lockouts.
- **Marine Operations**: surge wave mooring safety profiles, tug assistance standby requests, and dock visual ranges.

### 2. Multi-Channel Warn Dispatch & Webhooks
- Automatically schedules SMS warning alerts for critical threshold violations.
- Publishes hourly status logs to registered Slack workspace channels.
- Renders system notifications directly in the operator command hub.

### 3. Detailed Planning & Historical Auditing
- Chronological diurnal forecast profiles map specific hourly safety clearance windows.
- Reports list allows filtering, sorting, and exporting histories as structured CSV or JSON files.
- Sliding drawer panel maps observed values side-by-side with safety limits using dynamic fetch updates.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Programming Language**: TypeScript (Strict typing check)
- **Styling**: Tailwind CSS (CSS variables, responsive cards)
- **Charts & Data Viz**: Recharts (diurnal trends, usage logs, anomaly comparisons)
- **Icons**: Lucide React
- **Client State**: Context API (Auth session storage, notifications feeds)

---

## 📁 Repository Structure
```text
src/
├── app/
│   ├── api/
│   │   ├── analyze/        # Main weather analysis API routing (WeatherAI source of truth)
│   │   └── geocode/        # Address geocoding API routing
│   ├── dashboard/          # Secured operator dashboard metrics
│   ├── reports/            # Planning audit history & detail drawers
│   ├── alerts/             # Active alarms dashboard & acknowledgment feeds
│   ├── scenarios/          # Interactive scenario library definitions
│   ├── analytics/          # Recharts operational visualizations
│   ├── settings/           # Operational thresholds override & asset management
│   ├── help/               # Support manuals & ticketing system
│   └── page.tsx            # Stripe/Linear-style public SaaS marketing landing page
├── components/
│   ├── auth/               # Protecting routes & auth session variables
│   ├── dashboard/          # Radar maps & widget containers
│   ├── layout/             # Command sidebar, command search shortcut menu
│   └── shared/             # Custom status tags, loaders, toast alerts
├── hooks/
│   ├── useHistory.ts       # Manages report database state in LocalStorage
│   └── useGeocoding.ts     # Triggers facility geolocations
└── lib/
    ├── business-engine/    # Scoring calculations & limits validation
    └── constants.ts        # Baseline threshold configurations
```

---

## ⚙️ Setup and Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
To trigger TypeScript verification, linter analysis, and Next.js bundle optimization:
```bash
npm run build
```

---

## 🔒 Access Credentials (Mock Auth)
To test the secured areas of the command center, register a new account on the registry page or sign in using the default operator profile:
- **Email**: `admin@weatherops.com`
- **Password**: `password123`
