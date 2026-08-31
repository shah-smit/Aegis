import React from 'react';
import { ClientProfile } from '../../types';
import { 
  PieChart, 
  TrendingUp, 
  Target, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';

interface InvestmentsPlanningViewProps {
  clients: ClientProfile[];
  onSelectClient: (clientId: string) => void;
  onInspectControlPlaneCase: (caseId: string) => void;
}

export const InvestmentsPlanningView: React.FC<InvestmentsPlanningViewProps> = ({
  clients,
  onSelectClient,
  onInspectControlPlaneCase,
}) => {
  const totalAUM = clients.reduce((acc, c) => acc + c.totalWealthSGD, 0);

  // Aggregate asset allocation
  const assetClassTotals: Record<string, number> = {
    'Global Equities': 0,
    'Fixed Income': 0,
    'Alternatives & VC': 0,
    'Cash & Treasury': 0,
  };

  clients.forEach(c => {
    c.portfolios.forEach(p => {
      if (p.assetClass.includes('Equities')) assetClassTotals['Global Equities'] += p.value;
      else if (p.assetClass.includes('Fixed Income') || p.assetClass.includes('Sukuk')) assetClassTotals['Fixed Income'] += p.value;
      else if (p.assetClass.includes('Alternatives') || p.assetClass.includes('VC')) assetClassTotals['Alternatives & VC'] += p.value;
      else assetClassTotals['Cash & Treasury'] += p.value;
    });
  });

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 font-serif">
            Portfolio Strategy & Discretionary Mandates
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Investments & Wealth Planning
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Consolidated asset allocation, mandate drift monitoring, and goals-based progress tracking.
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs text-stone-500 font-mono">Consolidated Book AUM</span>
          <div className="text-2xl font-serif font-bold text-stone-900 font-mono">
            SGD {(totalAUM / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>

      {/* 1. Macro Asset Allocation Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-stone-900">
            Consolidated Book Allocation
          </h3>
          <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Mandate Drift: 1 Alert Active
          </span>
        </div>

        {/* Visual Allocation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {Object.entries(assetClassTotals).map(([assetClass, amount], i) => {
            const pct = ((amount / totalAUM) * 100).toFixed(1);
            return (
              <div key={i} className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200/70 space-y-1">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{assetClass}</span>
                <div className="text-lg font-serif font-bold text-stone-900 font-mono">
                  SGD {(amount / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs font-mono text-stone-600">
                  {pct}% of Total Book
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Client Mandate Drift & Rebalancing Watchlist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-stone-900">
            Family Office Mandate Drift & Rebalance Triggers
          </h3>
          <span className="text-xs text-stone-500">Autonomous Drift Watchdog Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client) => {
            const hasDrift = client.portfolios.some(p => (p.driftPercent || 0) > 3.0);
            return (
              <div
                key={client.id}
                className={`bg-white rounded-2xl p-6 border shadow-sm space-y-4 ${
                  hasDrift ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/10' : 'border-stone-200/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div 
                    onClick={() => onSelectClient(client.id)}
                    className="cursor-pointer group"
                  >
                    <h4 className="text-base font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                      {client.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">
                      {client.primaryContact} • SGD {(client.totalWealthSGD / 1000000).toFixed(1)}M
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    hasDrift ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {hasDrift ? 'Mandate Drift (+4.2%)' : 'Balanced'}
                  </span>
                </div>

                {/* Portfolios Breakdown Mini List */}
                <div className="space-y-2 text-xs">
                  {client.portfolios.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100 font-mono">
                      <span className="font-sans font-medium text-stone-800">{p.assetClass}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-stone-500">Target {p.targetPercent}% / Actual {p.allocationPercent}%</span>
                        {p.driftPercent && p.driftPercent > 3 ? (
                          <span className="text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                            +{p.driftPercent}% Drift
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectClient(client.id)}
                    className="font-semibold text-stone-900 hover:text-amber-800 flex items-center space-x-1"
                  >
                    <span>View Client 360</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onInspectControlPlaneCase(client.linkedCaseId)}
                    className="text-stone-500 hover:text-stone-800 font-mono text-[11px]"
                  >
                    Control Plane →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
