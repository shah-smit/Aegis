import React from 'react';
import { 
  ClientProfile, 
  AdvisorBookSummary, 
  AegisIntelligenceInsight, 
  WorkflowItem,
  Case 
} from '../../types';
import { 
  AlertCircle, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  GitBranch, 
  Building2, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  ShieldAlert, 
  AlertTriangle,
  Cpu
} from 'lucide-react';

interface AdvisorWorkspaceProps {
  advisorBook: AdvisorBookSummary;
  clients: ClientProfile[];
  onSelectClient: (clientId: string) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenApprovalModal: () => void;
  onInspectControlPlaneCase: (caseId: string) => void;
}

export const AdvisorWorkspace: React.FC<AdvisorWorkspaceProps> = ({
  advisorBook,
  clients,
  onSelectClient,
  onNavigateToTab,
  onOpenApprovalModal,
  onInspectControlPlaneCase,
}) => {
  // Aggregate all proactive intelligence insights across clients
  const allInsights = clients.flatMap(c => c.intelligenceInsights);
  const activeWorkflows = clients.flatMap(c => c.activeWorkflows);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* 1. Header & Intelligent Summary Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 font-serif">
            Aegis Wealth OS • Private Advisory
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Good morning, Sarah
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Here's what needs your attention today across your client book.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs text-stone-500 font-mono">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Singapore Market Live • 09:30 SGT</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Autonomous Gates Active</span>
          </span>
        </div>
      </div>

      {/* 2. Three Intelligent KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Clients Needing Attention */}
        <div 
          onClick={() => onNavigateToTab('clients')}
          className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Client Action</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-stone-900">
              {advisorBook.clientsNeedAttentionCount} Clients
            </div>
            <p className="text-xs text-stone-600 mt-0.5">Need attention or review</p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-amber-800 group-hover:text-amber-900">
            <span>View client list</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Reviews Due */}
        <div 
          onClick={() => onNavigateToTab('clients')}
          className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Compliance Cycles</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-stone-900">
              {advisorBook.reviewsDueCount} Reviews Due
            </div>
            <p className="text-xs text-stone-600 mt-0.5">Within next 30 days (MAS 626)</p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-indigo-700 group-hover:text-indigo-800">
            <span>Start KYC refreshes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Approval Waiting */}
        <div 
          onClick={onOpenApprovalModal}
          className="bg-white rounded-2xl p-5 border border-amber-300 shadow-sm hover:shadow-md hover:border-amber-400 bg-gradient-to-b from-white to-amber-50/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Supervisory Gate</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-stone-900">
              {advisorBook.approvalsWaitingCount} Approval Waiting
            </div>
            <p className="text-xs text-amber-800 font-medium mt-0.5">$8.2M Wire Hold (Starlight)</p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-semibold text-amber-900 group-hover:text-amber-950">
            <span>Sign compliance release</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Total Book Wealth */}
        <div 
          onClick={() => onNavigateToTab('investments')}
          className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Advisor Book AUM</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-stone-900">
              {advisorBook.totalAUMFormatted}
            </div>
            <p className="text-xs text-stone-600 mt-0.5">Across {advisorBook.clientsCount} Family Offices</p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-emerald-700 group-hover:text-emerald-800">
            <span>Portfolio allocations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. Aegis Intelligence: Proactive Recommendations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Aegis Intelligence
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
              Proactive Recommendations
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('intelligence')}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center space-x-1"
          >
            <span>View all ({allInsights.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allInsights.map((insight) => {
            const urgencyBg = 
              insight.urgency === 'HIGH' ? 'border-amber-300 bg-gradient-to-b from-white to-amber-50/20' :
              insight.urgency === 'MEDIUM' ? 'border-stone-200/90 bg-white' : 'border-stone-200/70 bg-white';

            return (
              <div 
                key={insight.id}
                className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${urgencyBg}`}
              >
                <div>
                  {/* Top Client Tag & Category */}
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span 
                      onClick={() => onSelectClient(insight.clientId)}
                      className="font-semibold text-stone-900 hover:text-amber-800 cursor-pointer underline-offset-2 hover:underline"
                    >
                      {insight.clientName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {insight.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-serif font-bold text-stone-900 leading-snug">
                    {insight.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {insight.summary}
                  </p>

                  {/* Why it matters */}
                  <div className="mt-3 pt-3 border-t border-stone-100 text-xs">
                    <span className="font-semibold text-stone-800">Why it matters: </span>
                    <span className="text-stone-600">{insight.whyItMatters}</span>
                  </div>
                </div>

                {/* Bottom Actions with Progressive Disclosure */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectClient(insight.clientId)}
                    className="text-xs font-semibold text-stone-900 hover:text-amber-800 flex items-center space-x-1"
                  >
                    <span>{insight.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {insight.relatedCaseId && (
                    <button
                      onClick={() => onInspectControlPlaneCase(insight.relatedCaseId!)}
                      className="text-[11px] font-mono text-stone-500 hover:text-stone-800 flex items-center space-x-1"
                      title="Inspect underlying Agent Trace and Cryptographic Proof"
                    >
                      <Cpu className="w-3 h-3 text-cyan-600" />
                      <span>Control Plane</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Active Workflows & Bounded Autonomy Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Agentic Workflows */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-stone-700" />
                <h2 className="text-base font-serif font-bold text-stone-900">
                  Active Agentic Workflows
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Autonomous pipelines running under Aegis Deterministic Policy Gates
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('workflows')}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center space-x-1"
            >
              <span>Workflow Manager</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeWorkflows.slice(0, 3).map((wf) => {
              const isWaitingApproval = wf.status === 'WAITING_APPROVAL';
              const isCompleted = wf.status === 'COMPLETED';

              return (
                <div
                  key={wf.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isWaitingApproval
                      ? 'border-amber-300 bg-amber-50/30'
                      : 'border-stone-200/80 bg-stone-50/50 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span 
                      onClick={() => onSelectClient(wf.clientId)}
                      className="font-semibold text-stone-900 hover:text-amber-800 cursor-pointer"
                    >
                      {wf.clientName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      isWaitingApproval ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      isCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    }`}>
                      {wf.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-stone-900 mt-1">
                    {wf.title}
                  </h4>

                  <p className="text-xs text-stone-600 mt-1">
                    {wf.currentStageDescription}
                  </p>

                  {/* Bounded Restraint Banner if present */}
                  {wf.boundedRestraint && (
                    <div className="mt-3 p-2.5 rounded-lg bg-white border border-amber-300 text-xs space-y-1">
                      <div className="flex items-center space-x-1.5 text-amber-900 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Aegis Bounded Autonomy: Action Blocked</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        <strong>Policy:</strong> {wf.boundedRestraint.policyBlocked}
                      </p>
                      <p className="text-[11px] text-stone-600">
                        {wf.boundedRestraint.reason}
                      </p>
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-[11px] text-stone-500 font-mono">
                      <span>{wf.assignedAgents.length} Agents Assigned</span>
                      <span>•</span>
                      <span>Stage {wf.currentStageNumber} of {wf.totalStages}</span>
                    </div>

                    <button
                      onClick={() => onInspectControlPlaneCase(wf.caseId)}
                      className="font-mono text-stone-700 hover:text-stone-900 text-[11px] flex items-center space-x-1"
                    >
                      <span>View in Control Plane</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Client Book Quick Directory */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-stone-700" />
              <h2 className="text-base font-serif font-bold text-stone-900">
                Client 360 Book
              </h2>
            </div>
            <button
              onClick={() => onNavigateToTab('clients')}
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              All ({clients.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {clients.map((client) => {
              const formattedWealth = (client.totalWealthSGD / 1000000).toFixed(1) + 'M';
              return (
                <div
                  key={client.id}
                  onClick={() => onSelectClient(client.id)}
                  className="p-3 rounded-xl border border-stone-200/70 hover:border-stone-300 hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 font-serif font-bold text-xs flex items-center justify-center border border-stone-200">
                      {client.avatarInitials}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                        {client.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {client.primaryContact}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-stone-900 font-mono">
                      SGD {formattedWealth}
                    </div>
                    <span className="text-[10px] font-medium text-stone-500">
                      {client.lifecycleStage}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
