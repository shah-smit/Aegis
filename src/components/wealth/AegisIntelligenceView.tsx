import React, { useState } from 'react';
import { ClientProfile, AegisIntelligenceInsight } from '../../types';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  Filter, 
  Building2, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  GitBranch
} from 'lucide-react';

interface AegisIntelligenceViewProps {
  clients: ClientProfile[];
  onSelectClient: (clientId: string) => void;
  onInspectControlPlaneCase: (caseId: string) => void;
  onOpenApprovalModal: () => void;
}

export const AegisIntelligenceView: React.FC<AegisIntelligenceViewProps> = ({
  clients,
  onSelectClient,
  onInspectControlPlaneCase,
  onOpenApprovalModal,
}) => {
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');

  const allInsights: Array<AegisIntelligenceInsight & { clientName: string; linkedCaseId: string }> = clients.flatMap(c => 
    c.intelligenceInsights.map(ins => ({
      ...ins,
      clientName: c.name,
      linkedCaseId: c.linkedCaseId,
    }))
  );

  const filteredInsights = filterUrgency === 'ALL'
    ? allInsights
    : allInsights.filter(ins => ins.urgency === filterUrgency);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-700 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span className="uppercase tracking-widest font-serif">Proactive Autonomous Monitoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Aegis Intelligence Feed
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Continuous synthesis of corporate registries, portfolio drift, lifecycle milestones, and transaction risks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterUrgency(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterUrgency === lvl
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {lvl === 'ALL' ? 'All Alerts' : `${lvl} Urgency`}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Layer Progressive Disclosure Explainer Banner */}
      <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-stone-200/80 text-xs text-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-bold text-stone-900">3-Layer Progressive Disclosure Principle</span>
          <p className="text-stone-600">
            <strong>Layer 1:</strong> Human summary • <strong>Layer 2:</strong> Why it matters & suggested action • <strong>Layer 3:</strong> Cryptographic evidence in Control Plane.
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 whitespace-nowrap">
          Deterministic Policy Constrained
        </span>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInsights.map((ins) => {
          const isHigh = ins.urgency === 'HIGH';
          return (
            <div
              key={ins.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                isHigh ? 'border-amber-300 bg-gradient-to-b from-white to-amber-50/20' : 'border-stone-200/90'
              }`}
            >
              <div className="space-y-4">
                {/* Top Info */}
                <div className="flex items-center justify-between text-xs">
                  <span 
                    onClick={() => onSelectClient(ins.clientId)}
                    className="font-serif font-bold text-base text-stone-900 hover:text-amber-800 cursor-pointer"
                  >
                    {ins.clientName}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isHigh ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    'bg-stone-100 text-stone-600'
                  }`}>
                    {ins.urgency} URGENCY
                  </span>
                </div>

                {/* Layer 1: Title & Summary */}
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 leading-snug">
                    {ins.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {ins.summary}
                  </p>
                </div>

                {/* Layer 2: Why it matters & Recommended Action */}
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-200/70 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-stone-900">Why this matters: </span>
                    <span className="text-stone-700">{ins.whyItMatters}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">Recommended action: </span>
                    <span className="text-stone-700">{ins.suggestedAction}</span>
                  </div>
                </div>
              </div>

              {/* Layer 3: Direct Action & Control Plane Jump */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    if (ins.actionLabel.includes('Approval') || ins.actionLabel.includes('checkpoint')) {
                      onOpenApprovalModal();
                    } else {
                      onSelectClient(ins.clientId);
                    }
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  <span>{ins.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {ins.relatedCaseId && (
                  <button
                    onClick={() => onInspectControlPlaneCase(ins.relatedCaseId!)}
                    className="font-mono text-xs text-stone-600 hover:text-cyan-700 font-semibold flex items-center space-x-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Control Plane Trace →</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
