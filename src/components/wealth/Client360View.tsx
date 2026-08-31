import React, { useState } from 'react';
import { 
  ClientProfile, 
  WealthPortfolioItem, 
  WealthGoal, 
  ClientEntitySummary, 
  WorkflowItem,
  DocumentRecord 
} from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  TrendingUp, 
  Target, 
  Users, 
  Layers, 
  GitBranch, 
  Lightbulb, 
  AlertTriangle, 
  Sparkles, 
  ChevronRight, 
  Cpu,
  Download,
  Key,
  DollarSign
} from 'lucide-react';

interface Client360ViewProps {
  clients: ClientProfile[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  onInspectControlPlaneCase: (caseId: string) => void;
  onOpenApprovalModal: () => void;
}

export const Client360View: React.FC<Client360ViewProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onInspectControlPlaneCase,
  onOpenApprovalModal,
}) => {
  const [activeTab, setActiveTab] = useState<'wealth' | 'goals' | 'structure' | 'workflows' | 'intelligence' | 'documents'>('wealth');
  
  const client = clients.find(c => c.id === selectedClientId) || clients[0];
  const formattedWealth = (client.totalWealthSGD / 1000000).toFixed(1);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Client Selector Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200/80">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 whitespace-nowrap mr-1">
          Select Client:
        </span>
        {clients.map((c) => {
          const isSelected = c.id === client.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectClient(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 border ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${c.riskProfile === 'High' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span>{c.name}</span>
              <span className="text-[11px] opacity-75 font-mono">
                (SGD {(c.totalWealthSGD / 1000000).toFixed(1)}M)
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Flagship Client 360 Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white font-serif font-bold text-lg flex items-center justify-center shadow-md ring-2 ring-amber-400/30">
                {client.avatarInitials}
              </div>
              <div>
                <span className="text-xs font-medium text-amber-800 font-serif tracking-wider uppercase">
                  Family Office & Trust Group
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  {client.name}
                </h1>
                <p className="text-sm text-stone-500 font-medium">
                  {client.primaryContact} • <span className="text-stone-700">{client.title}</span>
                </p>
              </div>
            </div>
            
            <p className="text-xs text-stone-600 mt-4 max-w-3xl leading-relaxed">
              {client.overviewSummary}
            </p>
          </div>

          {/* Quick Deep-Dive Button into Control Plane */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 items-start lg:items-end">
            <button
              onClick={() => onInspectControlPlaneCase(client.linkedCaseId)}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl text-xs font-mono font-semibold flex items-center space-x-2 shadow-md transition-all group"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Inspect in Aegis Control Plane</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <span className="text-[11px] text-stone-500 font-mono">
              Linked Proof Root: {client.linkedCaseId}
            </span>
          </div>
        </div>

        {/* Client Key Metric Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-stone-100">
          <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200/60">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">Total Wealth</span>
            <div className="text-base font-serif font-bold text-stone-900 mt-0.5 font-mono">
              SGD {formattedWealth}M
            </div>
          </div>

          <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200/60">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">Risk Profile</span>
            <div className="text-base font-serif font-bold text-stone-900 mt-0.5">
              {client.riskProfile}
            </div>
          </div>

          <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200/60">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">Relationship</span>
            <div className="text-base font-serif font-bold text-stone-900 mt-0.5">
              {client.relationshipYears} Years
            </div>
          </div>

          <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200/60">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">Next Review</span>
            <div className="text-base font-serif font-bold text-stone-900 mt-0.5">
              {client.nextReviewDate}
            </div>
          </div>

          <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200/60">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">Entities</span>
            <div className="text-base font-serif font-bold text-stone-900 mt-0.5">
              {client.entitiesCount} Structures
            </div>
          </div>

          <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200/60">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">Active Workflows</span>
            <div className="text-base font-serif font-bold text-stone-900 mt-0.5 text-amber-800">
              {client.activeWorkflowsCount} Running
            </div>
          </div>
        </div>
      </div>

      {/* 3. Visual Lifecycle Timeline (Section 8 of Brief) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-stone-700" />
            <h3 className="text-sm font-serif font-bold text-stone-900">
              Client Lifecycle State Machine
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            Autonomous State: <span className="font-semibold text-stone-900">{client.lifecycleStage}</span>
          </span>
        </div>

        {/* Interactive Timeline Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {client.lifecycleTimeline.map((step, idx) => {
            const isCompleted = step.status === 'COMPLETED';
            const isActive = step.status === 'ACTIVE';
            const isFlagged = step.status === 'FLAGGED';

            return (
              <div
                key={step.key}
                className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                  isActive
                    ? 'border-amber-400 bg-amber-50/50 shadow-sm ring-1 ring-amber-300'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40 text-stone-800'
                    : isFlagged
                    ? 'border-rose-300 bg-rose-50/50 text-rose-900'
                    : 'border-stone-200/60 bg-stone-50/50 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-stone-400">
                    0{idx + 1}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {isActive && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
                  {isFlagged && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                </div>

                <div className="mt-2">
                  <div className={`font-semibold ${isActive ? 'text-stone-900 font-bold' : ''}`}>
                    {step.label}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    {step.date || (isActive ? 'Active' : 'Pending')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Client 360 Workspace Tabs */}
      <div className="border-b border-stone-200/80">
        <nav className="flex space-x-6 overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: 'wealth', label: 'Wealth Overview' },
            { id: 'goals', label: `Client Goals (${client.goals.length})` },
            { id: 'structure', label: `Ownership Structure (${client.entities.length})` },
            { id: 'workflows', label: `Active Workflows (${client.activeWorkflows.length})` },
            { id: 'intelligence', label: `Aegis Intelligence (${client.intelligenceInsights.length})` },
            { id: 'documents', label: `Documents (${client.documents.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-stone-900 text-stone-900 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 5. Tab Content Sections */}
      {/* TAB 1: Wealth & Portfolios */}
      {activeTab === 'wealth' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Portfolio Allocation & Performance
                </h3>
                <p className="text-xs text-stone-500">
                  Target asset allocation vs current discretionary mandate positioning
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-500 font-mono">Discretionary Mandate</span>
                <div className="text-sm font-bold text-stone-900 font-mono">
                  SGD {formattedWealth}M
                </div>
              </div>
            </div>

            {/* Portfolio Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Asset Class</th>
                    <th className="pb-3 text-right">Value (SGD)</th>
                    <th className="pb-3 text-right">Current %</th>
                    <th className="pb-3 text-right">Target %</th>
                    <th className="pb-3 text-right">Drift</th>
                    <th className="pb-3 text-right">Performance YTD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {client.portfolios.map((item, i) => (
                    <tr key={i} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 font-semibold text-stone-900">
                        {item.assetClass}
                      </td>
                      <td className="py-3 text-right font-mono font-medium text-stone-800">
                        SGD {(item.value / 1000000).toFixed(1)}M
                      </td>
                      <td className="py-3 text-right font-mono text-stone-700">
                        {item.allocationPercent.toFixed(1)}%
                      </td>
                      <td className="py-3 text-right font-mono text-stone-500">
                        {item.targetPercent.toFixed(1)}%
                      </td>
                      <td className="py-3 text-right font-mono font-semibold">
                        {item.driftPercent ? (
                          <span className={item.driftPercent > 3 ? 'text-amber-800 bg-amber-50 px-2 py-0.5 rounded' : 'text-stone-600'}>
                            {item.driftPercent > 0 ? `+${item.driftPercent}%` : `${item.driftPercent}%`}
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className={`py-3 text-right font-mono font-bold ${item.performanceColor || 'text-stone-900'}`}>
                        {item.performanceYTD}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Goals-Based Wealth (Section 7 of Brief) */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.goals.map((goal) => {
              const isAchieved = goal.status === 'ACHIEVED';
              const isAttention = goal.status === 'ATTENTION';

              return (
                <div 
                  key={goal.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-amber-800 uppercase tracking-wider text-[10px] font-mono">
                        {goal.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isAchieved ? 'bg-emerald-100 text-emerald-800' :
                        isAttention ? 'bg-amber-100 text-amber-900' :
                        'bg-stone-100 text-stone-700'
                      }`}>
                        {goal.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-bold text-stone-900">
                      {goal.title}
                    </h4>

                    <p className="text-xs text-stone-600 mt-2">
                      {goal.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-stone-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Target Objective:</span>
                        <span className="font-semibold text-stone-900">{goal.targetAmount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Current Status:</span>
                        <span className="font-medium text-emerald-800">{goal.currentStatus}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>Horizon:</span>
                        <span>{goal.timeHorizon}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Ownership & Corporate Structure (Section 9 Progressive Disclosure) */}
      {activeTab === 'structure' && (
        <div className="space-y-4">
          {/* Progressive Disclosure Layer 1 & 2: Human + Intelligence Summary */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Aegis Intelligence Reviewed Structure</span>
              </div>
              <h3 className="text-lg font-serif font-bold mt-1 text-white">
                {client.structureSummary.totalEntities} entities • {client.structureSummary.ownershipTiers} ownership tiers
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 mt-2">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Registry information matched</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Beneficial owner: {client.structureSummary.beneficialOwner}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No screening conflicts detected</span>
                </span>
              </div>
            </div>

            {/* Layer 3: Deep Dive into Control Plane */}
            <button
              onClick={() => onInspectControlPlaneCase(client.linkedCaseId)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md whitespace-nowrap"
            >
              <span>Inspect Evidence Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* List of Registered Entities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.entities.map((ent) => (
              <div
                key={ent.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono font-medium">
                    {ent.type}
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{ent.status}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    {ent.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Jurisdiction: <span className="text-stone-800 font-medium">{ent.jurisdiction}</span>
                    {ent.uen && ` • UEN: ${ent.uen}`}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 text-xs flex items-center justify-between text-stone-500">
                  <span>Ownership: <strong className="text-stone-900">{ent.ownershipPercent}%</strong></span>
                  <span className="text-[11px] font-mono text-stone-400">{ent.verificationSource}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Active Workflows & Bounded Autonomy (Section 12 & 13) */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          {client.activeWorkflows.map((wf) => (
            <div
              key={wf.id}
              className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-100 text-stone-700">
                      {wf.category}
                    </span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs font-semibold text-stone-700">
                      Started: {new Date(wf.startedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-stone-900 mt-1">
                    {wf.title}
                  </h3>
                </div>

                <button
                  onClick={() => onInspectControlPlaneCase(wf.caseId)}
                  className="px-3.5 py-1.5 bg-stone-900 text-amber-300 rounded-lg text-xs font-mono font-semibold flex items-center space-x-1.5 self-start"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect Trace (OTel)</span>
                </button>
              </div>

              {/* Bounded Restraint Explicit Highlight (Section 13) */}
              {wf.boundedRestraint && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>BOUNDED AUTONOMY: What the Agent Could NOT Do</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                    <div>
                      <span className="font-semibold text-stone-900">Agent Attempted:</span> {wf.boundedRestraint.attemptedAction}
                    </div>
                    <div>
                      <span className="font-semibold text-amber-900">Aegis Policy Gate:</span> <span className="font-mono text-rose-700 font-bold">ACTION BLOCKED</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-stone-900">Enforced Rule:</span> {wf.boundedRestraint.policyBlocked} — {wf.boundedRestraint.reason}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                    <span className="text-amber-900 font-medium">
                      {wf.boundedRestraint.humanActionRequired}
                    </span>
                    <button
                      onClick={onOpenApprovalModal}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-bold text-xs"
                    >
                      Authorize Action
                    </button>
                  </div>
                </div>
              )}

              {/* Workflow Stepper */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Workflow Execution Stages
                </span>
                <div className="space-y-1.5">
                  {wf.stages.map((stage, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#FAF9F6] border border-stone-200/60 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-mono text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-stone-900">{stage.name}</span>
                        {stage.agent && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
                            {stage.agent}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 font-mono text-[11px]">
                        {stage.time && <span className="text-stone-400">{stage.time}</span>}
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          stage.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          stage.status === 'ACTIVE' ? 'bg-amber-100 text-amber-900 animate-pulse' :
                          'bg-stone-100 text-stone-500'
                        }`}>
                          {stage.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: Aegis Intelligence for this client */}
      {activeTab === 'intelligence' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.intelligenceInsights.map((ins) => (
              <div
                key={ins.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-500 text-[10px] bg-stone-100 px-2 py-0.5 rounded">
                    {ins.category}
                  </span>
                  <span className="text-emerald-700 font-semibold text-[11px]">
                    Confidence: {ins.confidence}
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-stone-900">
                  {ins.title}
                </h4>

                <p className="text-xs text-stone-600">
                  {ins.summary}
                </p>

                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-stone-200/60 text-xs space-y-1">
                  <span className="font-bold text-stone-800">Why it matters:</span>
                  <p className="text-stone-600">{ins.whyItMatters}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    Suggested: <strong className="text-stone-800">{ins.suggestedAction}</strong>
                  </span>

                  {ins.relatedCaseId && (
                    <button
                      onClick={() => onInspectControlPlaneCase(ins.relatedCaseId!)}
                      className="font-mono text-cyan-800 hover:text-cyan-950 font-semibold flex items-center space-x-1"
                    >
                      <span>Control Plane</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Client Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {client.documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono text-[10px]">
                    {doc.type}
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1 text-[11px]">
                    <ShieldCheck className="w-3 h-3" />
                    <span>VERIFIED</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-stone-900 truncate" title={doc.name}>
                    {doc.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>{doc.size}</span>
                  <span className="truncate max-w-[120px]" title={doc.sha256}>
                    SHA: {doc.sha256.slice(0, 10)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
