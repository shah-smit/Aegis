import React, { useState } from 'react';
import { 
  ClientProfile, 
  WorkflowItem 
} from '../../types';
import { 
  GitBranch, 
  Cpu, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Filter, 
  Search, 
  Sparkles, 
  FileText,
  Building2,
  Lock,
  Key
} from 'lucide-react';

interface WorkflowManagerViewProps {
  clients: ClientProfile[];
  onSelectClient: (clientId: string) => void;
  onInspectControlPlaneCase: (caseId: string) => void;
  onOpenApprovalModal: () => void;
}

export const WorkflowManagerView: React.FC<WorkflowManagerViewProps> = ({
  clients,
  onSelectClient,
  onInspectControlPlaneCase,
  onOpenApprovalModal,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const allWorkflows: WorkflowItem[] = clients.flatMap(c => c.activeWorkflows);

  const filteredWorkflows = filterCategory === 'ALL'
    ? allWorkflows
    : allWorkflows.filter(w => w.category === filterCategory);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 font-serif">
            Aegis Control Layer
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Agentic Workflow Manager
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Coordinate specialist AI agents across onboarding, lifecycle events, and compliance checkpoints.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Workflows' },
            { id: 'ONBOARDING', label: 'Wealth Onboarding' },
            { id: 'LIFECYCLE_CHANGE', label: 'Lifecycle Changes' },
            { id: 'AML_INVESTIGATION', label: 'AML Investigations' },
            { id: 'REBALANCING', label: 'Portfolio Rebalancing' },
            { id: 'KYC_REFRESH', label: 'KYC Refreshes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterCategory === tab.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Conceptual Workflow Pipeline Explainer (Section 11 of Brief) */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 shadow-md border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Autonomous Execution Model</span>
          </div>
          <span className="text-[11px] font-mono text-stone-400">
            Agents Act • Policies Constrain • Aegis Proves
          </span>
        </div>

        {/* 10-Step Workflow Lifecycle Chain */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs font-mono">
          {[
            { step: '01', title: 'Detect Change', desc: 'Registry / Trade / Trigger' },
            { step: '02', title: 'Assign Agents', desc: 'Specialist Sub-agents' },
            { step: '03', title: 'Parallel Checks', desc: 'Gemini + Registry + PEP' },
            { step: '04', title: 'Aggregate Data', desc: 'UBO Graph & Risk Matrix' },
            { step: '05', title: 'Policy Gate', desc: 'Deterministic Evaluation' },
            { step: '06', title: 'Determine Authority', desc: 'Allow / Block / Human' },
            { step: '07', title: 'Bounded Restraint', desc: 'Enforce Safety Limits' },
            { step: '08', title: 'Human Checkpoint', desc: 'Advisor Sign-off (if req)' },
            { step: '09', title: 'Execute Gateway', desc: 'Action Dispatch' },
            { step: '10', title: 'Aegis Proof', desc: 'Signed Action Receipt' },
          ].map((item, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700/60 flex flex-col justify-between">
              <span className="text-amber-400 font-bold text-[10px]">{item.step}</span>
              <div className="mt-1">
                <div className="text-white font-sans font-semibold text-[11px]">{item.title}</div>
                <div className="text-[10px] text-stone-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Workflow List with Bounded Autonomy Callouts */}
      <div className="space-y-6">
        {filteredWorkflows.map((wf) => {
          const isWaitingApproval = wf.status === 'WAITING_APPROVAL';
          const isCompleted = wf.status === 'COMPLETED';

          return (
            <div
              key={wf.id}
              className={`bg-white rounded-2xl p-6 sm:p-7 border shadow-sm space-y-5 transition-all ${
                isWaitingApproval ? 'border-amber-300 ring-1 ring-amber-200' : 'border-stone-200/90'
              }`}
            >
              {/* Top Row: Client, Title, Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span 
                      onClick={() => onSelectClient(wf.clientId)}
                      className="text-xs font-serif font-bold text-amber-900 hover:underline cursor-pointer"
                    >
                      {wf.clientName}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                      {wf.category}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-400">
                      Started {new Date(wf.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-stone-900 mt-1">
                    {wf.title}
                  </h3>

                  <p className="text-xs text-stone-600 mt-1">
                    {wf.currentStageDescription}
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isWaitingApproval ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    isCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {wf.status.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => onInspectControlPlaneCase(wf.caseId)}
                    className="px-3.5 py-1 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-lg text-xs font-mono font-semibold flex items-center space-x-1.5 shadow-sm"
                  >
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Control Plane Trace</span>
                  </button>
                </div>
              </div>

              {/* Bounded Restraint Banner (What the Agent Could NOT Do) */}
              {wf.boundedRestraint && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-amber-900 font-bold">
                      <Lock className="w-4 h-4 text-amber-700" />
                      <span>BOUNDED AUTONOMY RESTRAINT ENFORCED</span>
                    </div>
                    <span className="font-mono text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                      ACTION BLOCKED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-stone-700 pt-1">
                    <div>
                      <span className="font-semibold text-stone-900">Autonomous Proposal:</span>
                      <p className="font-mono text-[11px] text-stone-800 mt-0.5">{wf.boundedRestraint.attemptedAction}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900">Restraining Policy Gate:</span>
                      <p className="text-stone-800 mt-0.5">{wf.boundedRestraint.policyBlocked}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-semibold text-stone-900">Why Aegis Blocked It:</span>
                      <p className="text-stone-600 mt-0.5">{wf.boundedRestraint.reason}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-amber-950 font-medium">
                      {wf.boundedRestraint.humanActionRequired}
                    </span>
                    <button
                      onClick={onOpenApprovalModal}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center space-x-1.5 self-start"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Execute Human Sign-Off</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Multi-Agent Assignment Pill Row */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Assigned Specialist Agents:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {wf.assignedAgents.map((ag, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200"
                    >
                      🤖 {ag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step Sequence Bar */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  Execution Stages ({wf.currentStageNumber}/{wf.totalStages} Completed):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {wf.stages.map((stage, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                        stage.status === 'COMPLETED' ? 'bg-emerald-50/50 border-emerald-200/80 text-stone-800' :
                        stage.status === 'ACTIVE' ? 'bg-amber-50 border-amber-300 text-amber-950 ring-1 ring-amber-200' :
                        'bg-stone-50/50 border-stone-200/60 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="font-mono text-[10px] font-bold opacity-60">0{idx + 1}</span>
                        <span className="truncate font-medium">{stage.name}</span>
                      </div>
                      {stage.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                      {stage.status === 'ACTIVE' && <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
