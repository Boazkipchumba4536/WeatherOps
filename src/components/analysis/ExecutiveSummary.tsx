'use client';

import { OperationalReport } from '@/types';
import { RiskGauge } from './RiskGauge';
import { OPERATIONAL_STATUS_CONFIG } from '@/lib/constants';
import { CheckCircle2, XCircle, AlertTriangle, TrendingDown } from 'lucide-react';

interface ExecutiveSummaryProps {
  report: OperationalReport;
}

export function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  const statusConfig = OPERATIONAL_STATUS_CONFIG[report.operationalStatus];

  return (
    <div className="card p-6 fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="status-badge"
              style={{
                color: statusConfig.color.includes('green') ? '#22c55e'
                  : statusConfig.color.includes('lime') ? '#84cc16'
                  : statusConfig.color.includes('amber') ? '#f59e0b'
                  : statusConfig.color.includes('orange') ? '#f97316'
                  : '#ef4444',
                backgroundColor: statusConfig.color.includes('green') ? '#f0fdf4'
                  : statusConfig.color.includes('lime') ? '#f7fee7'
                  : statusConfig.color.includes('amber') ? '#fffbeb'
                  : statusConfig.color.includes('orange') ? '#fff7ed'
                  : '#fef2f2',
                borderColor: statusConfig.color.includes('green') ? '#bbf7d0'
                  : statusConfig.color.includes('lime') ? '#d9f99d'
                  : statusConfig.color.includes('amber') ? '#fde68a'
                  : statusConfig.color.includes('orange') ? '#fed7aa'
                  : '#fecaca',
              }}
            >
              <span className={`w-1.5 h-1.5 rounded-full pulse-dot`}
                style={{
                  backgroundColor: statusConfig.color.includes('green') ? '#22c55e'
                    : statusConfig.color.includes('lime') ? '#84cc16'
                    : statusConfig.color.includes('amber') ? '#f59e0b'
                    : statusConfig.color.includes('orange') ? '#f97316'
                    : '#ef4444'
                }}
              />
              {statusConfig.label}
            </span>
            <span className="text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>
              Generated {new Date(report.generatedAt).toLocaleTimeString()}
            </span>
          </div>

          <h2 className="text-lg font-bold mb-1" style={{ color: 'rgb(var(--color-text))' }}>
            {report.operationalRecommendation}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--color-text-3))' }}>
            {report.executiveSummary}
          </p>
        </div>

        <div className="shrink-0">
          <RiskGauge score={report.riskScore.value} level={report.riskScore.level} size={160} />
        </div>
      </div>

      {/* Risk Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Risks */}
        {report.keyRisks.length > 0 && (
          <div className="rounded-lg p-4" style={{ background: 'rgb(var(--color-surface-2))', border: '1px solid rgb(var(--color-border))' }}>
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: 'rgb(var(--color-text))' }}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Key Risk Factors
            </h3>
            <ul className="space-y-2">
              {report.keyRisks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgb(var(--color-text-2))' }}>
                  <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Positive Factors */}
        {report.positiveFactors.length > 0 && (
          <div className="rounded-lg p-4" style={{ background: 'rgb(var(--color-surface-2))', border: '1px solid rgb(var(--color-border))' }}>
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: 'rgb(var(--color-text))' }}>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Favorable Conditions
            </h3>
            <ul className="space-y-2">
              {report.positiveFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgb(var(--color-text-2))' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
